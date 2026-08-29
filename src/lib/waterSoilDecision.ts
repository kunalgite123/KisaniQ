import { Village, waterSourceLabel } from "../data/villages";
import { kopargaonProfile } from "../data/groundSoil";

export type DistanceCategory = "NEARBY" | "MODERATE" | "DEEP_DISTANT";
export type WaterStatusState = "GOOD" | "WATCH" | "STRESSED";
export type SoilStatusState = "Healthy" | "Moisture Watch" | "Dry" | "Critical";

export interface WaterSoilDecisionInput {
  village: Village | null;
  cropName?: string | null;
  dryDaysAhead?: number;
  lang?: "en" | "mr" | "hi";
}

export interface WaterSoilDecisionOutput {
  distanceKm: number;
  distanceCategory: DistanceCategory;
  ruleLabel: string;
  waterStatus: WaterStatusState;
  measuredOrEstimatedDepth: string;
  depthTypeLabel: "Measured groundwater depth" | "Estimated groundwater depth" | "Reference depth range" | "Taluka baseline";
  referenceDepthRange: string;
  interpretationText: string;
  recommendedAction: string;
  soilTypeLabel: string;
  soilConditionState: SoilStatusState;
  soilNote: string;
  hasGovernmentSupport: boolean;
  governmentSupportNotice?: string;
  ctaType: "CHECK_IRRIGATION_ADVISORY" | "VIEW_GOVERNMENT_SCHEMES";
  ctaLabel: string;
  reasoning: {
    locationInfo: string;
    distanceInfo: string;
    groundwaterInfo: string;
    soilInfo: string;
    weatherInfo: string;
    cropInfo: string;
    summaryDecision: string;
  };
}

export function evaluateWaterSoilDecision(input: WaterSoilDecisionInput): WaterSoilDecisionOutput {
  const { village, cropName = "Sugarcane", dryDaysAhead = 6, lang = "en" } = input;
  const isMr = lang === "mr";
  const isHi = lang === "hi";

  const locationName = village?.name || "Kopargaon";
  const distanceKm = village ? village.distanceToGodavariKm : 4.8;
  const currentCrop = cropName || "Sugarcane";

  // Determine Distance Category Thresholds
  let category: DistanceCategory = "MODERATE";
  if (distanceKm < 3.0) {
    category = "NEARBY";
  } else if (distanceKm <= 10.0) {
    category = "MODERATE";
  } else {
    category = "DEEP_DISTANT";
  }

  // Determine Active Rule Label
  let ruleLabel = "";
  if (category === "NEARBY") {
    ruleLabel = isMr
      ? "जवळचा पाणी स्रोत (३ किमी आत)"
      : isHi
      ? "पास का जल स्रोत (3 किमी के भीतर)"
      : "NEARBY WATER ACCESS (< 3 km)";
  } else if (category === "MODERATE") {
    ruleLabel = isMr
      ? "मध्यम अंतरावरील पाणी स्रोत (३ ते १० किमी)"
      : isHi
      ? "मध्यम दूरी का जल स्रोत (3 से 10 किमी)"
      : "MODERATE DISTANCE WATER ACCESS (3–10 km)";
  } else {
    ruleLabel = isMr
      ? "खोल / लांबचा पाणी स्रोत (१० किमी पेक्षा जास्त)"
      : isHi
      ? "गहरा / दूर का जल स्रोत (10 किमी से अधिक)"
      : "DEEP / DISTANT WATER ACCESS (> 10 km)";
  }

  // Determine Water Status & Reference Depths
  let waterStatus: WaterStatusState = "WATCH";
  let referenceDepthRange = "15–30 m";
  let measuredOrEstimatedDepth = "22 m";
  let depthTypeLabel: WaterSoilDecisionOutput["depthTypeLabel"] = "Estimated groundwater depth";
  let interpretationText = "";
  let recommendedAction = "";
  let hasGovernmentSupport = false;
  let governmentSupportNotice = "";
  let ctaType: WaterSoilDecisionOutput["ctaType"] = "CHECK_IRRIGATION_ADVISORY";
  let ctaLabel = "";

  if (category === "NEARBY") {
    waterStatus = village?.waterSourceType === "canal_godavari" ? "GOOD" : "WATCH";
    referenceDepthRange = "9–15 m";
    measuredOrEstimatedDepth = "14 m";
    depthTypeLabel = "Estimated groundwater depth";

    interpretationText = isMr
      ? "जवळच भूजल उपलब्ध असून जमिनीची स्थिती सिंचन नियोजनासाठी उपयुक्त आहे."
      : isHi
      ? "पास में भूजल उपलब्ध है और सिंचाई योजना के लिए मिट्टी की स्थिति उपयुक्त है।"
      : "Groundwater is available nearby and soil conditions are suitable for irrigation planning.";

    recommendedAction = isMr
      ? `मातीतील ओलावा व ${currentCrop} पिकाच्या आवश्यकतेनुसार सिंचनाचा विचार करा.`
      : isHi
      ? `मिट्टी की नमी और ${currentCrop} फसल की आवश्यकता के आधार पर सिंचाई पर विचार करें।`
      : `Consider irrigation based on ${currentCrop} crop requirement and current soil moisture.`;

    ctaType = "CHECK_IRRIGATION_ADVISORY";
    ctaLabel = isMr ? "सिंचन सल्लागार उघडा →" : isHi ? "सिंचाई सलाह खोलें →" : "Check Irrigation Advisory →";
  } else if (category === "MODERATE") {
    waterStatus = "WATCH";
    referenceDepthRange = "15–30 m";
    measuredOrEstimatedDepth = "22 m";
    depthTypeLabel = "Reference depth range";

    interpretationText = isMr
      ? "भूजल अंदाजे १५ ते ३० मीटर संदर्भ खोलीवर उपलब्ध आहे."
      : isHi
      ? "भूजल अनुमानित 15 से 30 मीटर संदर्भ गहराई पर उपलब्ध है।"
      : "Groundwater is available at an estimated reference depth of 15–30 m.";

    recommendedAction = isMr
      ? `सिंचनाचा विचार केला जाऊ शकतो, परंतु पाणी देण्यापूर्वी मातीतील ओलावा व ${currentCrop} पिकाची गरज तपासा.`
      : isHi
      ? `सिंचाई पर विचार किया जा सकता है, लेकिन पानी देने से पहले मिट्टी की नमी और ${currentCrop} फसल की आवश्यकता जांचें।`
      : `Irrigation can be considered, but check soil moisture and ${currentCrop} crop water requirement before irrigating.`;

    ctaType = "CHECK_IRRIGATION_ADVISORY";
    ctaLabel = isMr ? "माती व सिंचन माहिती पहा →" : isHi ? "मिट्टी और सिंचाई विवरण देखें →" : "View Water & Soil →";
  } else {
    waterStatus = "STRESSED";
    referenceDepthRange = "50–80 m";
    measuredOrEstimatedDepth = "58 m";
    depthTypeLabel = "Reference depth range";

    interpretationText = isMr
      ? "भूजल तुलनेने खोल (अंदाजे ५० ते ८० मीटर संदर्भ श्रेणी) आहे."
      : isHi
      ? "भूजल अपेक्षाकृत गहरा (लगभग 50 से 80 मीटर संदर्भ सीमा) है।"
      : "Groundwater is relatively deep (approximately 50–80 m reference range).";

    recommendedAction = isMr
      ? "ठिबक किंवा तुषार सारख्या पाणी-कार्यक्षम सिंचनाला प्राधान्य द्या आणि शासकीय अनुदान योजनांची माहिती घ्या."
      : isHi
      ? "ड्रिप या स्प्रिंकलर जैसी जल-कुशल सिंचाई को प्राथमिकता दें और सरकारी सब्सिडी योजनाओं की जानकारी लें।"
      : "Prioritize water-efficient drip/sprinkler irrigation and explore applicable government irrigation support.";

    hasGovernmentSupport = true;
    governmentSupportNotice = isMr
      ? "शासकीय सहाय्य: सूक्ष्म सिंचन (PMKSY ठिबक अनुदान) अंतर्गत शासकीय अर्थसहाय्य उपलब्ध असू शकते."
      : isHi
      ? "सरकारी सहायता: सूक्ष्म सिंचाई (PMKSY ड्रिप सब्सिडी) के तहत सहायता उपलब्ध हो सकती है।"
      : "Government Support: Applicable irrigation assistance may be available through government schemes.";

    ctaType = "VIEW_GOVERNMENT_SCHEMES";
    ctaLabel = isMr ? "शासकीय योजनांची माहिती घ्या →" : isHi ? "सरकारी योजनाएं देखें →" : "Explore Government Schemes →";
  }

  // Soil Condition Classification
  const soilTypeLabel = isMr ? "काळी / मध्यम काळी माती" : isHi ? "काली / मध्यम काली मिट्टी" : "Black / Medium Black Soil";
  const soilConditionState: SoilStatusState = dryDaysAhead >= 5 ? "Moisture Watch" : "Healthy";
  const soilNote = isMr
    ? "जमिनीची ओलावा टिकवून ठेवण्याची क्षमता चांगली आहे, परंतु सिंचन प्रत्यक्ष मातीच्या ओलाव्यावर आधारित असावे."
    : isHi
    ? "मिट्टी की नमी बनाए रखने की क्षमता अच्छी है, लेकिन सिंचाई वास्तविक नमी पर आधारित होनी चाहिए।"
    : "Good moisture-retention characteristics, but irrigation should be based on actual soil moisture.";

  // Reasoning breakdown (DATA -> REASONING -> ACTION)
  const reasoning = {
    locationInfo: `${locationName} (${village ? waterSourceLabel[village.waterSourceType] : "Kopargaon Block Baseline"})`,
    distanceInfo: `${distanceKm.toFixed(1)} km from nearest monitoring point / Godavari river`,
    groundwaterInfo: `Reference depth ${referenceDepthRange} (${depthTypeLabel})`,
    soilInfo: `${soilTypeLabel} (${soilConditionState})`,
    weatherInfo: `${dryDaysAhead}/7 dry days forecast ahead`,
    cropInfo: `${currentCrop}`,
    summaryDecision: recommendedAction
  };

  return {
    distanceKm,
    distanceCategory: category,
    ruleLabel,
    waterStatus,
    measuredOrEstimatedDepth,
    depthTypeLabel,
    referenceDepthRange,
    interpretationText,
    recommendedAction,
    soilTypeLabel,
    soilConditionState,
    soilNote,
    hasGovernmentSupport,
    governmentSupportNotice,
    ctaType,
    ctaLabel,
    reasoning
  };
}
