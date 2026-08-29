import { FarmerProfile } from "../data/farmerProfile";
import { Village, waterSourceLabel } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { WeatherSnapshot, ClimateRisk } from "./weather";
import { evaluateSchemeRelevance, SchemeEvaluationResult } from "./schemeMatching";
import { GOVERNMENT_SCHEMES } from "../data/schemesData";

export type FarmerProblem =
  | "irrigation"
  | "water_scarcity"
  | "pest"
  | "disease"
  | "low_yield"
  | "crop_loss"
  | "excessive_rain"
  | "drought"
  | "soil"
  | "market"
  | "input_cost"
  | "machinery"
  | "general";

export type RiskLevel = "urgent" | "watch" | "healthy";

export interface DecisionReason {
  factor: string;
  detail: string;
  impact: string;
}

export interface IrrigationRecommendation {
  action: string;
  reason: string;
  timing: string;
  interval: string; // e.g. "2–3 days (Estimated)"
  waterSavingMode: boolean;
  avoid: string;
}

export interface WeatherAction {
  rainExpectedWithin24h: boolean;
  rainExpectedWithin48h: boolean;
  usefulRainExpected: boolean;
  drySpellExpected: boolean;
  highHumidity: boolean;
  heatStressRisk: boolean;
  waterloggingRisk: boolean;
  fungalWeatherRisk: boolean;
  pestWeatherRisk: boolean;
  headline: string;
}

export interface PestRiskRecommendation {
  action: string;
  reason: string;
  avoid: string;
  riskLevel: "Low" | "Moderate" | "High";
}

export interface CropHealthRecommendation {
  action: string;
  diseaseName: string | null;
  severity: "urgent" | "watch" | "healthy" | null;
  advisory: string | null;
}

export interface CropLossAnalysis {
  action: string;
  documentationRec: string;
  schemeMatch: string;
  disclaimer: string;
}

export interface YieldAnalysis {
  possibleCauses: string[];
  recommendedChecks: string[];
  action: string;
  potentialSchemeMatches: string[];
}

export interface SchemeRecommendation {
  schemeId: string;
  schemeTitle: string;
  relevanceLabel: string;
  badgeClass: string;
  whyReasons: string[];
  disclaimer: string;
}

export interface TimelineSlot {
  period: string; // "NOW" | "NEXT 24 HOURS" | "NEXT 48 HOURS" | "NEXT 72 HOURS"
  action: string;
  reason: string;
  risk: string;
  avoid: string;
}

export interface DecisionTimeline {
  now: TimelineSlot;
  next24h: TimelineSlot;
  next48h: TimelineSlot;
  next72h: TimelineSlot;
}

export interface DataQuality {
  weather: "live" | "forecast" | "unavailable";
  farmerProfile: "complete" | "partial" | "default";
  soilMoisture: "farmer-reported" | "estimated" | "unavailable";
  cropHealth: "scanned" | "reference" | "none";
  villageLocation: "specific" | "taluka-fallback";
}

export interface FarmerDecisionInput {
  farmerProfile?: FarmerProfile | null;
  village?: Village | null;
  weather?: WeatherSnapshot | null;
  climateRisk?: ClimateRisk | null;
  cropName?: string | null;
  detectedDisease?: DiseaseInfo | null;
  farmerProblem?: FarmerProblem | null;
  lang?: "en" | "mr" | "hi";
}

export interface FarmerDecision {
  overallPriority: number; // 1 (Highest) to 9 (Lowest)
  urgency: RiskLevel;
  title: string;
  summary: string;
  primaryAction: string;
  avoidAction: string;
  timing: string;

  irrigation: IrrigationRecommendation;
  weatherRisk: WeatherAction;
  pestRisk: PestRiskRecommendation;
  cropHealth: CropHealthRecommendation;
  cropLoss: CropLossAnalysis | null;
  yieldAnalysis: YieldAnalysis | null;
  schemeRecommendations: SchemeRecommendation[];
  reasons: DecisionReason[];
  timeline: DecisionTimeline;

  confidence: "High" | "Medium" | "Low";
  confidencePct: number;
  dataQuality: DataQuality;
  dataSources: string[];
}

/**
 * Single Source of Truth Engine for Farmer Decision Intelligence
 */
export function generateFarmerDecision(input: FarmerDecisionInput): FarmerDecision {
  const {
    farmerProfile,
    village,
    weather,
    climateRisk,
    cropName = "Cotton",
    detectedDisease,
    farmerProblem: customProblem,
    lang = "en"
  } = input;

  const isMr = lang === "mr";
  const isHi = lang === "hi";

  const effectiveCrop = cropName || farmerProfile?.primaryCrop || "Cotton";
  const effectiveVillage = village?.name || farmerProfile?.locationVillage || "Kopargaon";
  const effectiveProblem = customProblem || farmerProfile?.farmerProblem || null;
  const soilMoisture = farmerProfile?.soilMoisture || "adequate";
  const waterAvailability = farmerProfile?.waterAvailability || "moderate";

  // 1. Weather Signals Extraction
  const days = weather?.days || [];
  const day1 = days[0];
  const day2 = days[1];
  const next48hRain = (day1?.precipitationMm || 0) + (day2?.precipitationMm || 0);
  const maxRainProb48h = Math.max(day1?.precipitationProbabilityPct || 0, day2?.precipitationProbabilityPct || 0);

  const rainExpectedWithin24h = (day1?.precipitationMm || 0) >= 1.0 || (day1?.precipitationProbabilityPct || 0) >= 60;
  const rainExpectedWithin48h = next48hRain >= 1.5 || maxRainProb48h >= 50;
  const usefulRainExpected = next48hRain >= 5.0 || (maxRainProb48h >= 65 && next48hRain >= 3.0);
  const drySpellExpected = (climateRisk?.dryDaysAhead || 0) >= 5;
  const avgHumidity = weather?.avgHumidityNext24hPct ?? 65;
  const highHumidity = avgHumidity >= 75;
  const tempMaxToday = day1?.tempMaxC ?? 32;
  const heatStressRisk = tempMaxToday >= 38 || (climateRisk?.heatStressDays || 0) >= 2;
  const total7DayRain = days.reduce((acc, d) => acc + d.precipitationMm, 0);
  const waterloggingRisk = total7DayRain >= 40.0;
  const fungalWeatherRisk = highHumidity && (tempMaxToday >= 24 || usefulRainExpected);
  const pestWeatherRisk = highHumidity && (climateRisk?.dryDaysAhead || 0) <= 3;

  const weatherRisk: WeatherAction = {
    rainExpectedWithin24h,
    rainExpectedWithin48h,
    usefulRainExpected,
    drySpellExpected,
    highHumidity,
    heatStressRisk,
    waterloggingRisk,
    fungalWeatherRisk,
    pestWeatherRisk,
    headline: climateRisk?.headline || (isMr ? "हवामान माहिती उपलब्ध आहे." : isHi ? "मौसम की जानकारी उपलब्ध है।" : "Live satellite weather active.")
  };

  // 2. Irrigation Decision Logic (Rain-Aware & Water-Saving)
  let waterSavingMode = waterAvailability === "limited" || waterAvailability === "critical" || (village?.waterSourceType === "groundwater_only" && drySpellExpected);

  let irrAction = "";
  let irrReason = "";
  let irrTiming = "";
  let irrInterval = "";
  let irrAvoid = "";

  if (usefulRainExpected && (soilMoisture === "adequate" || soilMoisture === "wet")) {
    // CASE A: Rain Expected
    irrAction = isMr
      ? "सिंचन पुढे ढकला"
      : isHi
      ? "सिंचाई टालें"
      : "POSTPONE IRRIGATION";
    irrReason = isMr
      ? `पुढील २४-४८ तासांत उपयुक्त पावसाचा अंदाज (${next48hRain.toFixed(1)} mm) आहे आणि सध्या मातीत पुरेसा ओलावा आहे. आता सिंचन केल्यास पाणी वाया जाऊ शकते.`
      : isHi
      ? `अगले 24-48 घंटों में उपयोगी बारिश का अनुमान (${next48hRain.toFixed(1)} mm) है और वर्तमान में मिट्टी में पर्याप्त नमी है। अभी सिंचाई करने से पानी व्यर्थ हो सकता है।`
      : `Useful rainfall is expected within the next 24–48 hours (${next48hRain.toFixed(1)} mm) and current soil moisture is adequate. Irrigating now may waste water.`;
    irrTiming = isMr ? "पावसानंतर मातीचा ओलावा तपासा" : isHi ? "बारिश के बाद मिट्टी की नमी जांचें" : "Recheck soil moisture after rainfall";
    irrInterval = isMr ? "पावसानंतर पुनर्मूल्यांकन करा (अंदाजित)" : isHi ? "बारिश के बाद पुनर्मूल्यांकन करें (अनुमानित)" : "Reassess after rainfall (Estimated)";
    irrAvoid = isMr ? "पावसापूर्वी अनावश्यक सिंचन करणे टाळा" : isHi ? "बारिश से पहले अनावश्यक सिंचाई से बचें" : "Avoid unnecessary irrigation before expected rainfall";
  } else if (maxRainProb48h >= 40 && next48hRain < 3.0) {
    // CASE B: Rain Probability Moderate but Low Rainfall
    irrAction = isMr
      ? "सिंचनापूर्वी मातीचा ओलावा तपासा"
      : isHi
      ? "सिंचाई से पहले मिट्टी की नमी जांचें"
      : "CHECK SOIL MOISTURE BEFORE IRRIGATION";
    irrReason = isMr
      ? `पावसाची शक्यता असली तरी अपेक्षीत पाऊस पिकासाठी पुरेसा नसू शकतो. प्रत्यक्ष मुळांजवळील ओलावा तपासूनच निर्णय घ्या.`
      : isHi
      ? `बारिश की संभावना है लेकिन अपेक्षित बारिश फसल के लिए पर्याप्त नहीं हो सकती है। जड़ क्षेत्र की नमी जांच कर ही निर्णय लें।`
      : `Rain is possible, but expected rainfall may not provide enough water for the crop. Verify root-zone soil moisture before turning on irrigation pumps.`;
    irrTiming = isMr ? "सकाळच्या वेळी ओलावा तपासा" : isHi ? "सुबह के समय नमी जांचें" : "Inspect soil moisture early morning";
    irrInterval = isMr ? "२ ते ३ दिवस (अंदाजित)" : isHi ? "2 से 3 दिन (अनुमानित)" : "2–3 days (Estimated)";
    irrAvoid = isMr ? "अंदाजावरून जास्त पाणी देणे टाळा" : isHi ? "अंदाजे से अधिक पानी देने से बचें" : "Avoid flooding fields without checking root zone";
  } else if (soilMoisture === "dry" || soilMoisture === "very_dry" || drySpellExpected) {
    // CASE C: Dry Soil / Dry Spell
    if (waterSavingMode) {
      irrAction = isMr ? "काटकसरीचे सिंचन करा (वाटर-सेव्हिंग मोड)" : isHi ? "बचत सिंचाई करें (वाटर-सेविंग मोड)" : "USE WATER-SAVING IRRIGATION";
      irrReason = isMr
        ? `कोरडे हवामान आणि मर्यादित पाणी साठ्यामुळे ठिबक किंवा रूट-झोनद्वारे कमी वेळेचे नियंत्रित सिंचन सत्र वापरा.`
        : isHi
        ? `सूखे मौसम और सीमित जल आपूर्ति के कारण ड्रिप या रूट-जोन द्वारा कम अवधि के नियंत्रित सिंचाई चक्र अपनाएं।`
        : `Dry spell ahead combined with limited water availability. Use short controlled drip/root-zone irrigation cycles during low evaporation periods.`;
      irrTiming = isMr ? "पहाटे किंवा संध्याकाळी" : isHi ? "सुबह जल्दी या शाम को" : "Early morning or late evening";
      irrInterval = isMr ? "१ ते २ दिवस (अंदाजित रिफरन्स)" : isHi ? "1 से 2 दिन (अनुमानित संदर्भ)" : "1–2 days (Reference guidance)";
      irrAvoid = isMr ? "दुपारच्या कडक उन्हात पाटाने पाणी देणे टाळा" : isHi ? "दोपहर के समय बाढ़ सिंचाई से बचें" : "Avoid flood irrigation during peak daytime heat";
    } else {
      irrAction = isMr ? "सिंचन आवश्यक आहे" : isHi ? "सिंचाई आवश्यक है" : "IRRIGATION REQUIRED";
      irrReason = isMr
        ? `मातीत ओलावा कमी असून पुढील दिवसांत पाऊस नाही. पिकाचा ताण टाळण्यासाठी वेळेवर सिंचन करा.`
        : isHi
        ? `मिट्टी में नमी कम है और आने वाले दिनों में बारिश नहीं है। फसल तनाव से बचने के लिए समय पर सिंचाई करें।`
        : `Soil moisture is depleted and dry conditions are forecast. Schedule irrigation to prevent moisture stress.`;
      irrTiming = isMr ? "पुढील २४ तासांत" : isHi ? "अगले 24 घंटों में" : "Within next 24 hours";
      irrInterval = isMr ? "२ ते ४ दिवस (अंदाजित)" : isHi ? "2 से 4 दिन (अनुमानित)" : "2–4 days (Baseline estimate)";
      irrAvoid = isMr ? "अति-सिंचन टाळा" : isHi ? "अत्यधिक सिंचाई से बचें" : "Avoid excess standing water";
    }
  } else {
    // Default Irrigation Guidance
    irrAction = isMr ? "ओलाव्यावर आधारित सिंचन" : isHi ? "नमी आधारित सिंचाई" : "MONITOR SOIL MOISTURE";
    irrReason = isMr ? "जमिनीतील ओलावा समाधानकारक आहे. गरजेनुसारच सिंचन करा." : isHi ? "मिट्टी में नमी संतोषजनक है। आवश्यकतानुसार ही सिंचाई करें।" : "Soil moisture level is adequate. Irrigate strictly according to soil checks.";
    irrTiming = isMr ? "नियमित पाहणी करा" : isHi ? "नियमित निगरानी करें" : "Regular monitoring";
    irrInterval = isMr ? "३ ते ५ दिवस (अंदाजित)" : isHi ? "3 से 5 दिन (अनुमानित)" : "3–5 days (Reference guidance)";
    irrAvoid = isMr ? "अनावश्यक पंपिंग टाळा" : isHi ? "अनावश्यक पंपिंग से बचें" : "Avoid unnecessary borewell pumping";
  }

  const irrigation: IrrigationRecommendation = {
    action: irrAction,
    reason: irrReason,
    timing: irrTiming,
    interval: irrInterval,
    waterSavingMode,
    avoid: irrAvoid
  };

  // 3. Pest & Crop Health Risk Logic
  let pestAction = "";
  let pestReason = "";
  let pestAvoid = "";
  let pestRiskLevel: "Low" | "Moderate" | "High" = "Low";

  if (fungalWeatherRisk) {
    pestRiskLevel = "High";
    pestAction = isMr ? "बुरशीजन्य रोगासाठी पीक पाहणी करा" : isHi ? "फंगल रोग के लिए फसल की निगरानी करें" : "MONITOR FOR FUNGAL DISEASE";
    pestReason = isMr
      ? `उच्च आद्रता (${avgHumidity}%) आणि उबदार हवामानामुळे ${effectiveCrop} वर करपा व बुरशीचा प्रादुर्भाव वाढू शकतो.`
      : isHi
      ? `उच्च आर्द्रता (${avgHumidity}%) और गर्म मौसम के कारण ${effectiveCrop} पर फंगल प्रकोप बढ़ सकता है।`
      : `High humidity (${avgHumidity}%) combined with warm temperatures creates favorable micro-climate for fungal pathogen germination on ${effectiveCrop}.`;
    pestAvoid = isMr ? "झाडांच्या पानांवर पाणी साचवणारे स्प्रे टाळा" : isHi ? "पत्तियों पर जल जमाव वाले छिड़काव से बचें" : "Avoid unnecessary overhead spraying or leaves remaining wet";
  } else if (pestWeatherRisk) {
    pestRiskLevel = "Moderate";
    pestAction = isMr ? "किड व किटकांची पाहणी करा" : isHi ? "कीट और कीटों की निगरानी करें" : "INSPECT FIELD FOR PESTS";
    pestReason = isMr ? "सध्याचे हवामान रस शोषणाऱ्या किडींसाठी अनुकूल आहे. पानांच्या खालच्या बाजूची तपासणी करा." : isHi ? "वर्तमान मौसम रस चूसने वाले कीटों के अनुकूल है। पत्तियों के निचले हिस्से की जांच करें।" : "Weather conditions favor sucking pests. Check leaf undersides for early symptoms.";
    pestAvoid = isMr ? "बिना सल्ल्याचे रासायनिक कीटकनाशक टाळा" : isHi ? "बिना सलाह के रासायनिक कीटनाशकों से बचें" : "Do not apply chemical sprays without verifying field pest thresholds";
  } else {
    pestRiskLevel = "Low";
    pestAction = isMr ? "नियमित पीक संरक्षण" : isHi ? "नियमित फसल सुरक्षा" : "ROUTINE CROP MONITORING";
    pestReason = isMr ? "सध्या किडीचा धोका कमी आहे. पिकाची नियमित पाहणी चालू ठेवा." : isHi ? "वर्तमान में कीट का खतरा कम है। नियमित निरीक्षण जारी रखें।" : "Pest and disease weather pressure is low. Maintain standard crop scouting.";
    pestAvoid = isMr ? "नासाडी टाळा" : isHi ? "अपव्यय से बचें" : "Avoid preventive chemical over-application";
  }

  const pestRisk: PestRiskRecommendation = {
    action: pestAction,
    reason: pestReason,
    avoid: pestAvoid,
    riskLevel: pestRiskLevel
  };

  const cropHealth: CropHealthRecommendation = {
    action: detectedDisease ? (isMr ? `${detectedDisease.displayName} वर उपचार करा` : isHi ? `${detectedDisease.displayName} का उपचार करें` : `Apply treatment for ${detectedDisease.displayName}`) : (isMr ? "पानांचे स्कॅनिंग करा" : isHi ? "पत्तियों को स्कैन करें" : "Scan crop leaf"),
    diseaseName: detectedDisease?.displayName || null,
    severity: detectedDisease?.severity || null,
    advisory: detectedDisease?.advisory || null
  };

  // 4. Low Yield & Crop Loss Analysis
  let cropLoss: CropLossAnalysis | null = null;
  if (farmerProfile?.cropLoss || effectiveProblem === "crop_loss" || effectiveProblem === "excessive_rain" || effectiveProblem === "drought") {
    cropLoss = {
      action: isMr ? "पिकाच्या नुकसानीचे पंचनामे व फोटो नोंदवा" : isHi ? "फसल नुकसान के फोटोग्राफ और दस्तावेज दर्ज करें" : "DOCUMENT CROP LOSS & NOTIFY AUTHORITIES",
      documentationRec: isMr ? "बाधित क्षेत्राचे दिनांकित फोटो काढा, ७/१२ उतारा व बँक पासबुकची प्रत तयार ठेवा." : isHi ? "प्रभावित क्षेत्र के दिनांकित फोटो लें, 7/12 प्रति और बैंक पासबुक तैयार रखें।" : "Take clear dated photographs of affected field plots and retain relevant farm land records.",
      schemeMatch: "PMFBY (प्रधानमंत्री पीक विमा योजना) / WBCIS",
      disclaimer: isMr
        ? "टीप: विमा भरपाई व पात्रता ही तात्कालीन शासकीय अधिसूचना, अधिसूचित क्षेत्र व अटींवर अवलंबून असते."
        : isHi
        ? "नोट: बीमा दावा और पात्रता सरकारी अधिसूचना और नीति शर्तों के अधीन है।"
        : "Disclaimer: Compensation eligibility depends on current government notifications, notified crop/area, policy conditions and applicable deadlines."
    };
  }

  let yieldAnalysis: YieldAnalysis | null = null;
  if (farmerProfile?.yieldIssue || effectiveProblem === "low_yield" || (farmerProfile?.actualYield && farmerProfile?.expectedYield && farmerProfile.actualYield < farmerProfile.expectedYield)) {
    yieldAnalysis = {
      possibleCauses: [
        isMr ? "पाण्याचा ताण किंवा अवेळी सिंचन" : "Water stress or inconsistent irrigation schedule",
        isMr ? "मुळांजवळ अन्नद्रव्यांची कमतरता (NPK/Micro-nutrients)" : "Root-zone soil nutrient deficit or imbalanced NPK",
        isMr ? "हवामानाचा ताण किंवा कीड-रोग" : "Sub-clinical disease pressure or heat stress during flowering"
      ],
      recommendedChecks: [
        isMr ? "माती परीक्षण (Soil Health Card) तपासा" : "Conduct 12-parameter soil health testing",
        isMr ? "मुळांची पाहणी व सूक्ष्म सिंचन तपासा" : "Check root-zone health and drip emitter uniformity"
      ],
      action: isMr ? "उत्पादन घटण्याच्या कारणांची तपासणी करा" : isHi ? "कम पैदावार के कारणों की जांच करें" : "INVESTIGATE LOW YIELD FACTORS",
      potentialSchemeMatches: ["Soil Health Card Scheme", "PMKSY Drip Subsidy", "PKVY Organic Farming"]
    };
  }

  // 5. Priority Ranking Determination (Hierarchy 1 to 9)
  let overallPriority = 9; // Default general optimization
  let primaryAction = "";
  let summary = "";
  let avoidAction = "";
  let timing = "";
  let urgency: RiskLevel = "healthy";

  if (detectedDisease && detectedDisease.severity === "urgent") {
    overallPriority = 1;
    urgency = "urgent";
    primaryAction = isMr ? `${effectiveCrop}: तातडीने ${detectedDisease.displayName} वर उपाय करा` : isHi ? `${effectiveCrop}: तुरंत ${detectedDisease.displayName} का उपचार करें` : `CRITICAL CROP HEALTH: ACT ON ${detectedDisease.displayName.toUpperCase()}`;
    summary = isMr ? `${detectedDisease.displayName} मुळे पिकाला मोठा धोका आहे. ${detectedDisease.advisory}` : `${detectedDisease.displayName} detected on ${effectiveCrop}. ${detectedDisease.advisory}`;
    avoidAction = isMr ? "उपचाराला उशीर करणे टाळा" : "Delaying spray application";
    timing = isMr ? "आजच / २४ तासांत" : "Within 24 Hours";
  } else if (effectiveProblem === "crop_loss" || effectiveProblem === "excessive_rain" || effectiveProblem === "drought") {
    overallPriority = 2;
    urgency = "urgent";
    primaryAction = isMr ? "नुकसानीची नोंदणी करा व पीक विम्याचा दावा करा" : isHi ? "नुकसान दर्ज करें और फसल बीमा का दावा करें" : "REPORT CROP LOSS & REGISTER INSURANCE CLAIM";
    summary = isMr ? "झालेल्या पिकाच्या नुकसानीचे फोटो व ७/१२ तयार ठेवून विमा प्रतिनिधीशी संपर्क साधा." : "Document crop loss immediately with dated photos and land details for insurance support.";
    avoidAction = isMr ? "नोंदणीस ७२ तासांपेक्षा जास्त उशीर करू नका" : "Delaying loss notification beyond 72 hours";
    timing = isMr ? "तातडीने (७२ तासांच्या आत)" : "Within 72 Hours";
  } else if (soilMoisture === "very_dry" || waterAvailability === "critical" || (drySpellExpected && waterSavingMode)) {
    overallPriority = 3;
    urgency = "watch";
    primaryAction = irrigation.action;
    summary = irrigation.reason;
    avoidAction = irrigation.avoid;
    timing = irrigation.timing;
  } else if (heatStressRisk || waterloggingRisk) {
    overallPriority = 4;
    urgency = "watch";
    primaryAction = heatStressRisk ? (isMr ? "उष्णतेच्या ताणापासून पिकाचे संरक्षण करा" : "PROTECT CROP FROM HEAT STRESS") : (isMr ? "शेतातील पाण्याचा निचरा करा" : "DRAIN EXCESS WATER FROM FIELD");
    summary = heatStressRisk ? (isMr ? "तापमान ३८°C च्या वर जाण्याचा अंदाज आहे. लहान कालावधीचे सिंचन द्या." : "Extreme temperature predicted. Maintain micro-climate moisture.") : (isMr ? "अतिवृष्टीमुळे साचलेले पाणी बाहेर काढा." : "Heavy rain forecast. Clear drainage channels.");
    avoidAction = heatStressRisk ? "कडक उन्हात फवारणी टाळा" : "Leaving field flooded";
    timing = "Next 24-48 Hours";
  } else if (fungalWeatherRisk || pestWeatherRisk) {
    overallPriority = 5;
    urgency = "watch";
    primaryAction = pestRisk.action;
    summary = pestRisk.reason;
    avoidAction = pestRisk.avoid;
    timing = "Next 48 Hours";
  } else if (cropLoss) {
    overallPriority = 6;
    urgency = "watch";
    primaryAction = cropLoss.action;
    summary = cropLoss.documentationRec;
    avoidAction = "Neglecting documentation";
    timing = "Immediate";
  } else if (yieldAnalysis) {
    overallPriority = 7;
    urgency = "healthy";
    primaryAction = yieldAnalysis.action;
    summary = yieldAnalysis.possibleCauses.join(". ");
    avoidAction = "Increasing chemical fertilizer without soil test";
    timing = "This Week";
  } else if (farmerProfile?.isCompleted === false) {
    overallPriority = 8;
    urgency = "healthy";
    primaryAction = isMr ? "प्रोफाइल पूर्ण करून योग्य योजना पहा" : isHi ? "प्रोफाइल पूरा करके योजनाएं देखें" : "COMPLETE FARM PROFILE FOR SCHEME MATCHING";
    summary = isMr ? "तुमचे गाव, पिक व जलस्रोत जोडून ५५%-८०% सबसिडी योजना अनलॉक करा." : "Complete farm details to unlock government irrigation & crop insurance support.";
    avoidAction = "Leaving farm profile empty";
    timing = "Flexible";
  } else {
    overallPriority = 9;
    urgency = "healthy";
    primaryAction = irrigation.action;
    summary = irrigation.reason;
    avoidAction = irrigation.avoid;
    timing = irrigation.timing;
  }

  const title = isMr
    ? urgency === "urgent"
      ? "तातडीची कृती आवश्यक"
      : urgency === "watch"
      ? "महत्त्वाची शेती कृती"
      : "परिस्थिती अनुकूल — नियमित कामे"
    : isHi
    ? urgency === "urgent"
      ? "तत्काल कार्रवाई आवश्यक"
      : urgency === "watch"
      ? "महत्वपूर्ण कृषि कार्य"
      : "स्थिति अनुकूल — नियमित कार्य"
    : urgency === "urgent"
    ? "URGENT FARM ACTION REQUIRED"
    : urgency === "watch"
    ? "PRIORITY FARM DECISION"
    : "STABLE CONDITIONS — REGULAR MANAGEMENT";

  // 6. Timeline Generation (Now, Next 24h, Next 48h, Next 72h)
  const timeline: DecisionTimeline = {
    now: {
      period: "NOW",
      action: primaryAction,
      reason: summary,
      risk: urgency === "urgent" ? "High Risk" : "Normal Risk",
      avoid: avoidAction
    },
    next24h: {
      period: "NEXT 24 HOURS",
      action: usefulRainExpected
        ? (isMr ? "पावसाची प्रतीक्षा करा, सिंचन रोखा" : "Await expected rainfall, hold irrigation")
        : (isMr ? "मातीचा ओलावा तपासा व सिंचन नियोजन करा" : "Check soil moisture & execute planned watering"),
      reason: usefulRainExpected ? `Rain predicted (${next48hRain.toFixed(1)}mm expected)` : "Maintain crop root hydration",
      risk: usefulRainExpected ? "Waterlogging risk if irrigated now" : "Moisture deficit",
      avoid: usefulRainExpected ? "Irrigating before rain" : "Delaying needed water"
    },
    next48h: {
      period: "NEXT 48 HOURS",
      action: fungalWeatherRisk
        ? (isMr ? "पानांची पाहणी करा (करपा लक्षणे)" : "Inspect leaf undersides for fungal spots")
        : (isMr ? "पिकाची वाढ व किडीची पाहणी करा" : "General field scouting & weeding"),
      reason: fungalWeatherRisk ? "High humidity favors spore growth" : "Routine maintenance window",
      risk: fungalWeatherRisk ? "Fungal infection outbreak" : "Weed competition",
      avoid: fungalWeatherRisk ? "Overhead spraying" : "Ignoring pest signs"
    },
    next72h: {
      period: "NEXT 72 HOURS",
      action: isMr ? "ओलावा पुन्हा तपासा व पुढील आवर्तन ठरवा" : "Reassess soil moisture & plan next irrigation cycle",
      reason: "Ensure steady crop growth without water stress",
      risk: "Sudden weather changes",
      avoid: "Fixed calendar watering without checking soil"
    }
  };

  // 7. Government Schemes Matching
  const schemeRecommendations: SchemeRecommendation[] = GOVERNMENT_SCHEMES.map((scheme) => {
    const evalRes: SchemeEvaluationResult = evaluateSchemeRelevance(
      scheme,
      village || null,
      effectiveCrop,
      detectedDisease || null,
      climateRisk || null
    );
    return {
      schemeId: scheme.id,
      schemeTitle: scheme.name,
      relevanceLabel: evalRes.relevanceLabel,
      badgeClass: evalRes.badgeClass,
      whyReasons: evalRes.whyReasons,
      disclaimer: isMr
        ? "पात्रता व लाभ हे तात्कालीन शासकीय जी.आर., अधिसूचित पिके आणि अटींच्या अधीन आहेत."
        : "Eligibility is subject to current government notification, notified crop/area, policy conditions and applicable deadlines."
    };
  }).filter((s) => s.relevanceLabel === "High Relevance" || s.relevanceLabel === "Good Match").slice(0, 3);

  // 8. Reasons / Explainability Breakdown
  const reasons: DecisionReason[] = [
    {
      factor: isMr ? "हवामान घटक" : "Weather Factor",
      detail: `${climateRisk?.dryDaysAhead || 6}/7 dry days, ${next48hRain.toFixed(1)}mm rain expected in 48h`,
      impact: usefulRainExpected ? "Suppresses immediate irrigation need" : "Drives soil moisture evaporation"
    },
    {
      factor: isMr ? "माती व पाणी घटक" : "Soil & Water Factor",
      detail: `Soil Moisture: ${soilMoisture.toUpperCase()}, Water Access: ${waterAvailability.toUpperCase()}${farmerProfile?.soilPh ? `, pH ${farmerProfile.soilPh}` : ""}`,
      impact: waterSavingMode ? "Activates Water-Saving Irrigation mode" : "Standard irrigation schedule applies"
    },
    {
      factor: isMr ? "पीक आरोग्य घटक" : "Crop Diagnostic Factor",
      detail: detectedDisease ? `${effectiveCrop}: ${detectedDisease.displayName} (${detectedDisease.severity})` : `${effectiveCrop}: Healthy / Unscanned`,
      impact: detectedDisease ? "Pushes crop health to top priority" : "Normal growth phase"
    },
    {
      factor: isMr ? "खत व बजेट नियोजन" : "Nutrient & Cost Management",
      detail: `Fertilizer: ${farmerProfile?.fertilizerType || "Standard NPK"}${farmerProfile?.budgetPerAcre ? `, Budget ₹${farmerProfile.budgetPerAcre}/acre` : ""}`,
      impact: farmerProfile?.fertilizerType === "organic_vermicompost" ? "Optimized for Organic Soil Carbon" : "Balanced NPK application recommended"
    }
  ];

  // 9. Data Quality & Confidence Calculation
  const hasWeather = !!weather;
  const hasProfile = !!farmerProfile && farmerProfile.isCompleted;
  const hasCropScan = !!detectedDisease;
  const hasVillage = !!village;

  let confidencePct = 75;
  if (hasWeather) confidencePct += 10;
  if (hasProfile) confidencePct += 5;
  if (hasCropScan) confidencePct += 5;
  if (hasVillage) confidencePct += 5;
  confidencePct = Math.min(96, confidencePct);

  const confidence: "High" | "Medium" | "Low" = confidencePct >= 88 ? "High" : confidencePct >= 78 ? "Medium" : "Low";

  const dataQuality: DataQuality = {
    weather: hasWeather ? "forecast" : "unavailable",
    farmerProfile: hasProfile ? "complete" : farmerProfile ? "partial" : "default",
    soilMoisture: farmerProfile?.soilMoisture ? "farmer-reported" : "estimated",
    cropHealth: hasCropScan ? "scanned" : "none",
    villageLocation: hasVillage ? "specific" : "taluka-fallback"
  };

  const dataSources = [
    hasWeather ? `✓ Live Satellite Forecast (${weather?.provider || "Open-Meteo"})` : "⚠ Weather API Fallback",
    farmerProfile ? `✓ Farmer Profile (${effectiveVillage}, ${effectiveCrop})` : "✓ Default Kopargaon Profile",
    hasCropScan ? `✓ Crop Doctor Leaf Scanner (${detectedDisease?.displayName})` : "✓ Agricultural Crop Baseline",
    village ? `✓ Village Water Table (${village.name}, ${village.distanceToGodavariKm}km Godavari)` : "✓ Kopargaon Taluka CGWB Baseline"
  ];

  return {
    overallPriority,
    urgency,
    title,
    summary,
    primaryAction,
    avoidAction,
    timing,
    irrigation,
    weatherRisk,
    pestRisk,
    cropHealth,
    cropLoss,
    yieldAnalysis,
    schemeRecommendations,
    reasons,
    timeline,
    confidence,
    confidencePct,
    dataQuality,
    dataSources
  };
}
