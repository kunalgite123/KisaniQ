export interface ImpactFeatureSelection {
  groundwaterRules: boolean;
  cropDoctor: boolean;
  weatherAlerts: boolean;
  govSchemes: boolean;
  machinerySharing: boolean;
}

export type CropType = "sugarcane" | "cotton" | "onion";

export interface ImpactInput {
  acres: number;
  crop: CropType;
  selectedFeatures: ImpactFeatureSelection;
  lang?: "en" | "mr" | "hi";
}

export interface ImpactComparisonResult {
  acres: number;
  crop: CropType;
  cropDisplayName: string;
  
  // Traditional Metrics
  traditional: {
    waterUsageLiters: number;
    inputCostRupees: number;
    yieldPerAcreTons: number;
    totalYieldTons: number;
    diseaseLossPct: number;
    subsidiesClaimedRupees: number;
    netProfitRupees: number;
  };

  // Krishi Setu Guided Metrics
  guided: {
    waterUsageLiters: number;
    inputCostRupees: number;
    yieldPerAcreTons: number;
    totalYieldTons: number;
    diseaseLossPct: number;
    subsidiesClaimedRupees: number;
    netProfitRupees: number;
  };

  // Difference / Impact Gains
  impact: {
    costSavedRupees: number;
    waterPreservedLiters: number;
    waterPreservedPct: number;
    yieldGainPct: number;
    extraYieldTons: number;
    subsidiesUnlockedRupees: number;
    chemicalReductionKg: number;
    extraProfitRupees: number;
  };

  // Feature Contributions Breakdown
  featureContributions: {
    featureName: string;
    description: string;
    valueLabel: string;
    active: boolean;
  }[];
}

// Agronomic Benchmarks per Acre for Kopargaon Block
const CROP_BENCHMARKS: Record<CropType, {
  name: { en: string; mr: string; hi: string };
  pricePerTonRupees: number;
  traditionalYieldTonsPerAcre: number;
  potentialYieldTonsPerAcre: number;
  traditionalWaterLitersPerAcre: number;
  traditionalInputCostPerAcreRupees: number;
}> = {
  sugarcane: {
    name: { en: "Sugarcane", mr: "ऊस", hi: "गन्ना" },
    pricePerTonRupees: 3150, // FRP rate
    traditionalYieldTonsPerAcre: 30, // ~75 t/ha
    potentialYieldTonsPerAcre: 50, // ~125 t/ha
    traditionalWaterLitersPerAcre: 6000000, // ~60 lakh liters flood irrigation
    traditionalInputCostPerAcreRupees: 42000
  },
  cotton: {
    name: { en: "Cotton", mr: "कापूस", hi: "कपास" },
    pricePerTonRupees: 72000, // MSP rate per ton (quintal ~7200)
    traditionalYieldTonsPerAcre: 0.8, // ~2 t/ha
    potentialYieldTonsPerAcre: 1.4, // ~3.5 t/ha
    traditionalWaterLitersPerAcre: 3500000,
    traditionalInputCostPerAcreRupees: 28000
  },
  onion: {
    name: { en: "Onion", mr: "कांदा", hi: "प्याज़" },
    pricePerTonRupees: 18000, // Average mandi price per ton
    traditionalYieldTonsPerAcre: 6.8, // ~17 t/ha
    potentialYieldTonsPerAcre: 9.0, // ~22 t/ha
    traditionalWaterLitersPerAcre: 4000000,
    traditionalInputCostPerAcreRupees: 35000
  }
};

export function calculateImpactComparison(input: ImpactInput): ImpactComparisonResult {
  const { acres, crop, selectedFeatures, lang = "en" } = input;
  const benchmark = CROP_BENCHMARKS[crop];
  const isMr = lang === "mr";
  const isHi = lang === "hi";

  const cropDisplayName = isMr ? benchmark.name.mr : isHi ? benchmark.name.hi : benchmark.name.en;

  // Feature multiplier weights based on active feature checkboxes
  let waterSavingMultiplier = 0.0;
  let inputCostReductionMultiplier = 0.0;
  let yieldRecoveryMultiplier = 0.0;
  let subsidiesUnlockedPerAcre = 0;
  let fixedSubsidiesUnlocked = 0;

  if (selectedFeatures.groundwaterRules) {
    waterSavingMultiplier += 0.35; // 35% water saving via soil & distance threshold logic
    inputCostReductionMultiplier += 0.12; // Electricity & pumping cost savings
  }

  if (selectedFeatures.cropDoctor) {
    yieldRecoveryMultiplier += 0.25; // 25% yield recovery from early disease detection
    inputCostReductionMultiplier += 0.18; // Prevented unneeded chemical sprays
  }

  if (selectedFeatures.weatherAlerts) {
    waterSavingMultiplier += 0.15; // 15% water saving by holding pump on rain days
    yieldRecoveryMultiplier += 0.15; // 15% crop loss prevention from extreme dry spells
  }

  if (selectedFeatures.govSchemes) {
    fixedSubsidiesUnlocked += 6000; // PM-KISAN
    subsidiesUnlockedPerAcre += 18000; // PMKSY Drip Subsidy component
  }

  if (selectedFeatures.machinerySharing) {
    inputCostReductionMultiplier += 0.15; // Rental machine & group labour cost sharing
  }

  // --- TRADITIONAL FARMING CALCULATIONS ---
  const tradWaterTotal = benchmark.traditionalWaterLitersPerAcre * acres;
  const tradInputCostTotal = benchmark.traditionalInputCostPerAcreRupees * acres;
  const tradYieldTotal = benchmark.traditionalYieldTonsPerAcre * acres;
  const tradGrossRevenue = tradYieldTotal * benchmark.pricePerTonRupees;
  const tradSubsidies = 0; // Unassisted farmer misses most subsidies
  const tradNetProfit = tradGrossRevenue - tradInputCostTotal + tradSubsidies;

  // --- KRISHI SETU GUIDED FARMING CALCULATIONS ---
  const guidedWaterTotal = Math.round(tradWaterTotal * (1 - waterSavingMultiplier));
  const guidedInputCostTotal = Math.round(tradInputCostTotal * (1 - inputCostReductionMultiplier));
  
  // Yield gain calculated by closing the yield gap
  const yieldGap = (benchmark.potentialYieldTonsPerAcre - benchmark.traditionalYieldTonsPerAcre) * acres;
  const guidedYieldTotal = Math.round((tradYieldTotal + yieldGap * Math.min(1.0, yieldRecoveryMultiplier)) * 100) / 100;
  
  const guidedGrossRevenue = guidedYieldTotal * benchmark.pricePerTonRupees;
  const guidedSubsidies = fixedSubsidiesUnlocked + Math.round(subsidiesUnlockedPerAcre * acres);
  const guidedNetProfit = guidedGrossRevenue - guidedInputCostTotal + guidedSubsidies;

  // --- DIFFERENCES & IMPACT GAINS ---
  const costSavedRupees = tradInputCostTotal - guidedInputCostTotal;
  const waterPreservedLiters = tradWaterTotal - guidedWaterTotal;
  const waterPreservedPct = Math.round(waterSavingMultiplier * 100);
  const extraYieldTons = Math.round((guidedYieldTotal - tradYieldTotal) * 100) / 100;
  const yieldGainPct = Math.round((extraYieldTons / tradYieldTotal) * 100);
  const extraProfitRupees = guidedNetProfit - tradNetProfit;
  const chemicalReductionKg = Math.round(acres * 14 * (selectedFeatures.cropDoctor ? 1.5 : 0.8));

  // Feature breakdown cards
  const featureContributions = [
    {
      featureName: isMr ? "भूजल व माती अंतरावर आधारित सिंचन नियम" : "Groundwater & Soil Proximity Rules",
      description: isMr ? "अंतराच्या नियमांनुसार ठिबक सिंचन वापरून पाण्याच्या अपव्ययाला आळा घाला." : "Optimizes micro-irrigation based on village distance to Godavari & aquifer depth.",
      valueLabel: selectedFeatures.groundwaterRules ? (isMr ? "३५% पाणी बचत" : "35% Water Preserved") : (isMr ? "अक्रिय" : "Inactive"),
      active: selectedFeatures.groundwaterRules
    },
    {
      featureName: isMr ? "एआय पीक डॉक्टर (Edge AI रोग निदान)" : "Edge AI Crop Doctor Diagnostics",
      description: isMr ? "रोग सुरूवातीलाच ओळखून अनावश्य रासायनिक फवारणी टाळा." : "Identifies crop diseases in early stage, preventing severe crop yield loss.",
      valueLabel: selectedFeatures.cropDoctor ? (isMr ? "२५% उत्पन्न वाढ व १८% खत बचत" : "+25% Yield Recovery & 18% Spray Savings") : (isMr ? "अक्रिय" : "Inactive"),
      active: selectedFeatures.cropDoctor
    },
    {
      featureName: isMr ? "७-दिवसीय हवामान व कोरड्या कालावधीचे इशारे" : "7-Day Weather & Dry-Spell Defense",
      description: isMr ? "पावसाचा अंदाज पाहून विनाकारण पंपिंग टाळा." : "Holds planned pumping when rain is imminent to preserve tube-well water.",
      valueLabel: selectedFeatures.weatherAlerts ? (isMr ? "१५% अतिरिक्त पाणी बचत" : "15% Extra Water Saved") : (isMr ? "अक्रिय" : "Inactive"),
      active: selectedFeatures.weatherAlerts
    },
    {
      featureName: isMr ? "महाडीबीटी व पीएमकेएसवाय योजना मॅचिंग" : "MahaDBT & PMKSY Government Scheme Matching",
      description: isMr ? "ठिबक सिंचन सबसिडी व पीएम-किसान हप्ते थेट अनलॉक करा." : "Unlocks up to 55-80% micro-irrigation subsidies and direct farmer income support.",
      valueLabel: selectedFeatures.govSchemes ? `₹${guidedSubsidies.toLocaleString("en-IN")} ${isMr ? "अनुदान प्राप्त" : "Subsidies Unlocked"}` : (isMr ? "अक्रिय" : "Inactive"),
      active: selectedFeatures.govSchemes
    },
    {
      featureName: isMr ? "मजूर व यंत्रसामग्री भाडे शेअरिंग" : "Labour & Machinery Rental Sharing",
      description: isMr ? "स्थानिक यंत्रे व टोळी भाड्याने घेऊन १५% खर्च कमी करा." : "Reduces capital equipment expenditure through local tractor & harvester sharing.",
      valueLabel: selectedFeatures.machinerySharing ? (isMr ? "१५% यंत्रसामग्री बचत" : "15% Machinery Cost Reduction") : (isMr ? "अक्रिय" : "Inactive"),
      active: selectedFeatures.machinerySharing
    }
  ];

  return {
    acres,
    crop,
    cropDisplayName,
    traditional: {
      waterUsageLiters: tradWaterTotal,
      inputCostRupees: tradInputCostTotal,
      yieldPerAcreTons: benchmark.traditionalYieldTonsPerAcre,
      totalYieldTons: tradYieldTotal,
      diseaseLossPct: 22,
      subsidiesClaimedRupees: tradSubsidies,
      netProfitRupees: tradNetProfit
    },
    guided: {
      waterUsageLiters: guidedWaterTotal,
      inputCostRupees: guidedInputCostTotal,
      yieldPerAcreTons: Math.round((guidedYieldTotal / acres) * 10) / 10,
      totalYieldTons: guidedYieldTotal,
      diseaseLossPct: 4,
      subsidiesClaimedRupees: guidedSubsidies,
      netProfitRupees: guidedNetProfit
    },
    impact: {
      costSavedRupees,
      waterPreservedLiters,
      waterPreservedPct,
      yieldGainPct,
      extraYieldTons,
      subsidiesUnlockedRupees: guidedSubsidies,
      chemicalReductionKg,
      extraProfitRupees
    },
    featureContributions
  };
}
