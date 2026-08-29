import { WeatherSnapshot, DailyWeather, ClimateRisk } from "./weather";

export interface CategoryRisk {
  name: string;
  level: "Low" | "Moderate" | "High" | "Critical";
  badgeClass: string;
  reason: string;
}

export interface ClimateIntelligence {
  overallRiskLevel: "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk";
  overallBadgeClass: string;
  locationName: string;
  today: DailyWeather;
  todayCondition: string;
  todayIcon: string;
  todayAvgTemp: number;
  categoryRisks: CategoryRisk[];
  outlookSummary: string;
  farmImpacts: {
    title: string;
    icon: string;
    status: string;
    badgeClass: string;
    reason: string;
    action: string;
    targetTab?: "water" | "crop" | "schemes" | "advisory";
  }[];
  decisionFlow: {
    weatherSignal: string;
    climateRisk: string;
    farmImpact: string;
    recommendation: string;
  };
  priorityAdvisories: {
    priority: "HIGH PRIORITY" | "MEDIUM PRIORITY" | "LOW PRIORITY";
    badgeClass: string;
    category: string;
    title: string;
    reason: string;
    action: string;
  }[];
  totalPrecipitationMm: number;
  maxTempWeek: number;
  minTempWeek: number;
}

export function getConditionDetails(d: DailyWeather, lang: "en" | "mr" = "en"): { text: string; icon: string } {
  const isMr = lang === "mr";
  if (d.precipitationMm >= 10 || (d.precipitationProbabilityPct > 70 && d.precipitationMm >= 5)) {
    return { text: isMr ? "मुसळधार पावसाची शक्यता" : "Heavy Rain Expected", icon: "⛈" };
  }
  if (d.precipitationMm >= 1.0 || d.precipitationProbabilityPct >= 50) {
    return { text: isMr ? "पावसाची शक्यता" : "Rain Expected", icon: "🌧" };
  }
  if (d.tempMaxC >= 38) {
    return { text: isMr ? "तीव्र उकाडा" : "Extreme Heat", icon: "☀" };
  }
  if (d.precipitationProbabilityPct >= 30) {
    return { text: isMr ? "अंशतः ढगाळ" : "Partly Cloudy", icon: "🌤" };
  }
  if (d.tempMaxC >= 32) {
    return { text: isMr ? "उबदार व कोरडे" : "Warm & Dry", icon: "☀️" };
  }
  return { text: isMr ? "निरभ्र / स्वच्छ हवामान" : "Fair / Clear", icon: "🌤" };
}

export function analyzeClimateIntelligence(
  snapshot: WeatherSnapshot,
  risk: ClimateRisk,
  selectedVillageName?: string | null,
  cropName?: string | null,
  lang: "en" | "mr" = "en"
): ClimateIntelligence {
  const isMr = lang === "mr";
  const days = snapshot.days;
  const today = days[0] || {
    date: new Date().toISOString().split("T")[0],
    tempMaxC: 30,
    tempMinC: 22,
    precipitationMm: 0,
    precipitationProbabilityPct: 10
  };

  const currentCrop = cropName || (isMr ? "कापूस / ऊस / कांदा" : "Cotton / Sugarcane / Onion");
  const locationName = selectedVillageName
    ? `${selectedVillageName}, ${isMr ? "कोपरगाव, अहिल्यानगर" : "Kopargaon, Ahmednagar"}`
    : isMr ? "कोपरगाव तालुका (केंद्र), महाराष्ट्र" : "Kopargaon Taluka (Centre), Maharashtra";

  const todayAvgTemp = Math.round((today.tempMaxC + today.tempMinC) / 2);
  const { text: todayCondition, icon: todayIcon } = getConditionDetails(today, lang);

  const totalPrecipitationMm = days.reduce((sum, d) => sum + d.precipitationMm, 0);
  const maxTempWeek = Math.max(...days.map((d) => d.tempMaxC));
  const minTempWeek = Math.min(...days.map((d) => d.tempMinC));

  // Category Risks Breakdown
  const categoryRisks: CategoryRisk[] = [];

  // 1. Dry Spell Risk
  if (risk.dryDaysAhead >= 6) {
    categoryRisks.push({
      name: isMr ? "कोरड्या दिवसांचा धोका" : "Dry Spell Risk",
      level: isMr ? "High" : "High",
      badgeClass: "badge-urgent",
      reason: isMr ? `पुढील ७ पैकी ${risk.dryDaysAhead} दिवस १.० मिमी पेक्षा कमी पावसाचा अंदाज.` : `${risk.dryDaysAhead} of 7 days forecast to receive less than 1.0 mm rainfall.`
    });
  } else if (risk.dryDaysAhead >= 4) {
    categoryRisks.push({
      name: isMr ? "कोरड्या दिवसांचा धोका" : "Dry Spell Risk",
      level: isMr ? "Moderate" : "Moderate",
      badgeClass: "badge-watch",
      reason: isMr ? `पुढील ७ दिवसांत ${risk.dryDaysAhead} कोरडे दिवस.` : `${risk.dryDaysAhead} dry days forecast ahead.`
    });
  } else {
    categoryRisks.push({
      name: isMr ? "कोरड्या दिवसांचा धोका" : "Dry Spell Risk",
      level: isMr ? "Low" : "Low",
      badgeClass: "badge-healthy",
      reason: isMr ? `या आठवड्यात ${7 - risk.dryDaysAhead} दिवस पावसाचा अंदाज.` : `Rain forecast on ${7 - risk.dryDaysAhead} days this week.`
    });
  }

  // 2. Rainfall Deficit / Flood Risk
  if (totalPrecipitationMm < 2.0) {
    categoryRisks.push({
      name: isMr ? "पाऊस तुटवडा धोका" : "Rainfall Risk",
      level: isMr ? "Moderate" : "Moderate",
      badgeClass: "badge-watch",
      reason: isMr ? `आठवड्याचा एकूण पाऊस कमी (${totalPrecipitationMm.toFixed(1)} मिमी).` : `Low weekly total precipitation (${totalPrecipitationMm.toFixed(1)} mm).`
    });
  } else if (totalPrecipitationMm > 40.0) {
    categoryRisks.push({
      name: isMr ? "अतिवृष्टी धोका" : "Rainfall Risk",
      level: isMr ? "High" : "High",
      badgeClass: "badge-urgent",
      reason: isMr ? `जास्त पाऊस (${totalPrecipitationMm.toFixed(1)} मिमी) — पाणी साचण्याचा धोका.` : `Heavy cumulative rainfall (${totalPrecipitationMm.toFixed(1)} mm) — risk of waterlogging.`
    });
  } else {
    categoryRisks.push({
      name: isMr ? "पाऊस प्रमाण" : "Rainfall Risk",
      level: isMr ? "Low" : "Low",
      badgeClass: "badge-healthy",
      reason: isMr ? `संतुलित पाऊस प्रमाण (${totalPrecipitationMm.toFixed(1)} मिमी).` : `Balanced rainfall total (${totalPrecipitationMm.toFixed(1)} mm).`
    });
  }

  // 3. Heat Stress Risk
  if (risk.heatStressDays >= 2) {
    categoryRisks.push({
      name: isMr ? "उष्णता / उकाडा धोका" : "Heat Risk",
      level: isMr ? "High" : "High",
      badgeClass: "badge-urgent",
      reason: isMr ? `३८°C पेक्षा जास्त तापमानाचे ${risk.heatStressDays} दिवस.` : `${risk.heatStressDays} days forecast exceeding 38°C heat stress threshold.`
    });
  } else if (risk.heatStressDays === 1) {
    categoryRisks.push({
      name: isMr ? "उष्णता / उकाडा धोका" : "Heat Risk",
      level: isMr ? "Moderate" : "Moderate",
      badgeClass: "badge-watch",
      reason: isMr ? `१ दिवस ३८°C पेक्षा जास्त तापमान.` : `1 day forecast exceeding 38°C threshold.`
    });
  } else {
    categoryRisks.push({
      name: isMr ? "उष्णता ताण" : "Heat Risk",
      level: isMr ? "Low" : "Low",
      badgeClass: "badge-healthy",
      reason: isMr ? `तापमान ३८°C मर्यादेच्या आत आहे.` : `No forecast days exceed the 38°C heat stress threshold.`
    });
  }

  // 4. Humidity & Fungal Disease Risk
  const humidity = snapshot.avgHumidityNext24hPct;
  if (humidity !== null && humidity >= 75) {
    categoryRisks.push({
      name: isMr ? "आद्रता व बुरशी धोका" : "Humidity Risk",
      level: isMr ? "Moderate" : "Moderate",
      badgeClass: "badge-watch",
      reason: isMr ? `२४ तासांची सरासरी आद्रता ${humidity}% — बुरशीजन्य रोगांसाठी पोषक वातावरण.` : `24h average humidity at ${humidity}% — favorable micro-climate for leaf rust and fungal pathogens.`
    });
  } else {
    categoryRisks.push({
      name: isMr ? "आद्रता स्थिती" : "Humidity Risk",
      level: isMr ? "Low" : "Low",
      badgeClass: "badge-healthy",
      reason: isMr ? `आद्रता ${humidity ?? 65}% — बुरशी बीजाणू वाढण्याचा कमी धोका.` : `Humidity at ${humidity ?? 65}% — low fungal spore germination pressure.`
    });
  }

  // Overall Risk Label
  let overallRiskLevel: "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk" = isMr ? ("कमी धोका" as any) : "Low Risk";
  let overallBadgeClass = "badge-healthy";

  if (risk.level === "high") {
    overallRiskLevel = isMr ? ("मोठा धोका" as any) : "High Risk";
    overallBadgeClass = "badge-urgent";
  } else if (risk.level === "moderate") {
    overallRiskLevel = isMr ? ("मध्यम धोका" as any) : "Moderate Risk";
    overallBadgeClass = "badge-watch";
  } else {
    overallRiskLevel = isMr ? ("कमी धोका" as any) : "Low Risk";
    overallBadgeClass = "badge-healthy";
  }

  // Outlook Summary
  let outlookSummary = "";
  if (risk.dryDaysAhead >= 5) {
    outlookSummary = isMr
      ? `पुढील ७ दिवसांत बहुतांश दिवस कोरडे (७ पैकी ${risk.dryDaysAhead} दिवस), एकूण कमी पाऊस (${totalPrecipitationMm.toFixed(1)} मिमी) आणि ${risk.heatStressDays} उकाड्याचे दिवस. पहाटेच्या वेळी सिंचनाचे नियोजन करा.`
      : `Mostly dry conditions expected over the next 7 days (${risk.dryDaysAhead}/7 dry days), with limited precipitation (${totalPrecipitationMm.toFixed(1)} mm total) and ${risk.heatStressDays} heat-stress days forecast. Proactive irrigation planning recommended.`;
  } else if (totalPrecipitationMm >= 25) {
    outlookSummary = isMr
      ? `पुढील ७ दिवसांत चांगल्या पावसाची शक्यता असून एकूण ${totalPrecipitationMm.toFixed(1)} मिमी पाऊस होईल. शेतातील पाण्याचा निचरा तपासा व पावसाच्या दिवशी फवारणी पुढे ढकला.`
      : `Wet weather stretch expected with ${totalPrecipitationMm.toFixed(1)} mm total precipitation across ${7 - risk.dryDaysAhead} rain days. Monitor field drainage and defer pesticide spraying on high-rain days.`;
  } else {
    outlookSummary = isMr
      ? `कोपरगाव परिसरासाठी मिश्र स्वरूपाचे हवामान असून एकूण ${totalPrecipitationMm.toFixed(1)} मिमी पाऊस आणि सरासरी तापमान ${Math.round(minTempWeek)}°C ते ${Math.round(maxTempWeek)}°C दरम्यान राहील.`
      : `Mixed weather conditions ahead for Kopargaon block with ${totalPrecipitationMm.toFixed(1)} mm total rainfall and average temperatures between ${Math.round(minTempWeek)}°C and ${Math.round(maxTempWeek)}°C.`;
  }

  // Farm Impact Cards
  const farmImpacts = [
    {
      title: isMr ? "सिंचन व मातीतील ओलावा" : "Irrigation & Soil Moisture",
      icon: "💧",
      status: risk.dryDaysAhead >= 5 ? (isMr ? "कोरड्या दिवसांचा अंदाज" : "Dry Conditions Forecast") : (isMr ? "पर्याप्त पाऊस अंदाज" : "Adequate Rain Expected"),
      badgeClass: risk.dryDaysAhead >= 5 ? "badge-watch" : "badge-healthy",
      reason: isMr ? `७ पैकी ${risk.dryDaysAhead} दिवस १.० मिमी पेक्षा कमी पावसाचा अंदाज. बाष्पीभवन वेग कायम राहील.` : `${risk.dryDaysAhead} of 7 forecast days have rainfall below 1.0 mm. Soil evapotranspiration rate remains steady.`,
      action: isMr ? "ठिबक किंवा पाटाचे पाणी देण्यापूर्वी जमिनीतील ओलावा तपासा." : "Verify root-zone soil moisture before scheduling drip or flood irrigation to prevent unnecessary water loss.",
      targetTab: "water" as const
    },
    {
      title: isMr ? "पीक आरोग्य व बुरशी धोका" : "Crop Health & Fungal Risk",
      icon: "🌱",
      status: humidity && humidity >= 75 ? (isMr ? "उच्च आद्रता धोका" : "Elevated Humidity Risk") : (isMr ? "सामान्य बुरशी धोका" : "Normal Fungal Risk"),
      badgeClass: humidity && humidity >= 75 ? "badge-watch" : "badge-healthy",
      reason: isMr ? `सरासरी आद्रता ${humidity ?? 68}% आहे. उबदार हवामानामुळे ${currentCrop} पिकावर बुरशीचा प्रादुर्भाव वाढू शकतो.` : `Average humidity is ${humidity ?? 68}%. High humidity combined with warm temperatures creates micro-climates suitable for pathogen spore germination on ${currentCrop}.`,
      action: isMr ? "पानांच्या खालच्या बाजूला बुरशीचे ठिपके किंवा तांबेरा तपासण्यासाठी पीक डॉक्टर वापरा." : "Inspect lower leaves for powdery mildew, rust pustules, or leaf spots using Crop Doctor diagnostic scanner.",
      targetTab: "crop" as const
    },
    {
      title: isMr ? "औषध फवारणी व शेती कामे" : "Field Spraying & Operation Window",
      icon: "🚜",
      status: isMr ? "फवारणीसाठी उत्तम हवामान" : "Optimal Spray Window Available",
      badgeClass: "badge-healthy",
      reason: isMr ? `७ पैकी ५ दिवस कमी पाऊस असल्यामुळे फवारलेले औषध वाहून जाण्याचा धोका कमी आहे.` : `Low rainfall expected on 5 out of 7 days, allowing foliar applications without immediate wash-off risks.`,
      action: isMr ? "वारा कमी असताना सकाळी लवकर जैविक किंवा शिफारसीत फवारणी करा." : "Schedule organic or recommended bio-pesticide sprays during early morning hours when wind speed is low.",
      targetTab: "advisory" as const
    },
    {
      title: isMr ? "शासकीय पीक विमा योजना" : "Government Crop Insurance",
      icon: "🛡️",
      status: isMr ? "हवामान धोका संरक्षण" : "Weather Risk Protection Eligible",
      badgeClass: "badge-muted",
      reason: isMr ? `हवामान आधारित पीक विमा योजना (PMFBY / WBCIS) हवामान धोक्यांपासून संरक्षण देते.` : `Weather Based Crop Insurance (WBCIS / PMFBY) covers notified crop losses triggered by weather index deficits.`,
      action: isMr ? "कोपरगाव केंद्रासाठी हवामान आधारित पीक विमा निकष व अर्जाची माहिती पहा." : "Review Weather Based Crop Insurance Scheme (WBCIS) guidelines for Kopargaon reference weather station.",
      targetTab: "schemes" as const
    }
  ];

  // Visual Decision Flow
  const decisionFlow = {
    weatherSignal: isMr ? `${risk.dryDaysAhead} कोरडे दिवस (<१ मिमी पाऊस)` : `${risk.dryDaysAhead} Dry Days Forecast (<1mm Rain)`,
    climateRisk: isMr ? `वाढता बाष्पीभवन व कोरडेपणा धोका` : `Moderate Evapotranspiration Risk`,
    farmImpact: isMr ? `मुळांच्या क्षेत्रात ओलाव्याची कमतरता` : `Soil Moisture Deficit in Root Zone`,
    recommendation: isMr ? `मातीतील ओलावा तपासा व पहाटे सूक्ष्म सिंचन करा` : `Check Soil Moisture & Schedule Micro-Irrigation`
  };

  // Priority Advisories
  const priorityAdvisories = [
    {
      priority: risk.dryDaysAhead >= 5 ? ("HIGH PRIORITY" as const) : ("MEDIUM PRIORITY" as const),
      badgeClass: risk.dryDaysAhead >= 5 ? "badge-urgent" : "badge-watch",
      category: isMr ? "💧 सिंचन नियोजन" : "IRRIGATION PLANNING",
      title: isMr ? "मातीतील ओलावा व विहिरीची पाणी पातळी तपासा" : "Inspect Soil Moisture & Well Water Table",
      reason: isMr ? `पुढील काही दिवस सतत कोरडे राहण्याचा अंदाज. कोपरगाव भूजल पातळी ~४२.६ मीटर आहे.` : `${risk.dryDaysAhead} consecutive dry days expected ahead. Kopargaon aquifer level is at ~42.6m.`,
      action: isMr ? "दिवसा होणारे बाष्पीभवन टाळण्यासाठी पहाटे ठिबक सिंचन करा." : "Drip irrigate early morning to prevent high daytime evaporation losses."
    },
    {
      priority: humidity && humidity >= 75 ? ("HIGH PRIORITY" as const) : ("LOW PRIORITY" as const),
      badgeClass: humidity && humidity >= 75 ? "badge-urgent" : "badge-healthy",
      category: isMr ? "🐛 पीक संरक्षण" : "CROP PROTECTION",
      title: isMr ? `${currentCrop} पिकाच्या पानांच्या खालच्या बाजूला बुरशीची लक्षणे तपासा` : `Monitor ${currentCrop} Leaf Undersides for Fungal Symptoms`,
      reason: isMr ? `सापेक्ष आद्रता ${humidity ?? 68}% असल्यामुळे करपा व बुरशी बीजाणू वाढण्याचा धोका आहे.` : `Relative humidity at ${humidity ?? 68}% increases spore germination risk for Leaf Scald, Rust, and Blotch.`,
      action: isMr ? "पाने पिवळी पडल्यास कृषी सेतू पीक डॉक्टर फोटो स्कॅनरचा वापर करा." : "Use KisaniQ Crop Doctor photo scanner to capture leaf symptoms at first sign of yellowing or spots."
    },
    {
      priority: "LOW PRIORITY" as const,
      badgeClass: "badge-healthy",
      category: isMr ? "🛡️ शासकीय मदत" : "GOVERNMENT SUPPORT",
      title: isMr ? "हवामान आधारित पीक विमा (WBCIS) योजनेची माहिती घ्या" : "Explore Weather Based Crop Insurance Scheme (WBCIS)",
      reason: isMr ? "दीर्घकाळ कोरडे दिवस किंवा अतिवृष्टी झाल्यास विमा योजनेतून नुकसान भरपाई मिळू शकते." : "Weather risks like prolonged dry spells or extreme humidity can trigger automated index payouts under PMFBY.",
      action: isMr ? "अधिकृत पोर्टल pmfby.gov.in वर हवामान निकष व अंतिम तारखा पहा." : "Check WBCIS parameter cutoff dates on official portal pmfby.gov.in."
    }
  ];

  return {
    overallRiskLevel,
    overallBadgeClass,
    locationName,
    today,
    todayCondition,
    todayIcon,
    todayAvgTemp,
    categoryRisks,
    outlookSummary,
    farmImpacts,
    decisionFlow,
    priorityAdvisories,
    totalPrecipitationMm,
    maxTempWeek,
    minTempWeek
  };
}
