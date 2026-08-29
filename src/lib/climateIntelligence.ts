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

export function getConditionDetails(d: DailyWeather): { text: string; icon: string } {
  if (d.precipitationMm >= 10 || (d.precipitationProbabilityPct > 70 && d.precipitationMm >= 5)) {
    return { text: "Heavy Rain Expected", icon: "⛈" };
  }
  if (d.precipitationMm >= 1.0 || d.precipitationProbabilityPct >= 50) {
    return { text: "Rain Expected", icon: "🌧" };
  }
  if (d.tempMaxC >= 38) {
    return { text: "Extreme Heat", icon: "☀" };
  }
  if (d.precipitationProbabilityPct >= 30) {
    return { text: "Partly Cloudy", icon: "🌤" };
  }
  if (d.tempMaxC >= 32) {
    return { text: "Warm & Dry", icon: "☀️" };
  }
  return { text: "Fair / Clear", icon: "🌤" };
}

export function analyzeClimateIntelligence(
  snapshot: WeatherSnapshot,
  risk: ClimateRisk,
  selectedVillageName?: string | null,
  cropName?: string | null
): ClimateIntelligence {
  const days = snapshot.days;
  const today = days[0] || {
    date: new Date().toISOString().split("T")[0],
    tempMaxC: 30,
    tempMinC: 22,
    precipitationMm: 0,
    precipitationProbabilityPct: 10
  };

  const currentCrop = cropName || "Cotton / Sugarcane / Onion";
  const locationName = selectedVillageName
    ? `${selectedVillageName}, Kopargaon, Ahmednagar`
    : "Kopargaon Taluka (Centre), Maharashtra";

  const todayAvgTemp = Math.round((today.tempMaxC + today.tempMinC) / 2);
  const { text: todayCondition, icon: todayIcon } = getConditionDetails(today);

  const totalPrecipitationMm = days.reduce((sum, d) => sum + d.precipitationMm, 0);
  const maxTempWeek = Math.max(...days.map((d) => d.tempMaxC));
  const minTempWeek = Math.min(...days.map((d) => d.tempMinC));

  // Category Risks Breakdown
  const categoryRisks: CategoryRisk[] = [];

  // 1. Dry Spell Risk
  if (risk.dryDaysAhead >= 6) {
    categoryRisks.push({
      name: "Dry Spell Risk",
      level: "High",
      badgeClass: "badge-urgent",
      reason: `${risk.dryDaysAhead} of 7 days forecast to receive less than 1.0 mm rainfall.`
    });
  } else if (risk.dryDaysAhead >= 4) {
    categoryRisks.push({
      name: "Dry Spell Risk",
      level: "Moderate",
      badgeClass: "badge-watch",
      reason: `${risk.dryDaysAhead} dry days forecast ahead.`
    });
  } else {
    categoryRisks.push({
      name: "Dry Spell Risk",
      level: "Low",
      badgeClass: "badge-healthy",
      reason: `Rain forecast on ${7 - risk.dryDaysAhead} days this week.`
    });
  }

  // 2. Rainfall Deficit / Flood Risk
  if (totalPrecipitationMm < 2.0) {
    categoryRisks.push({
      name: "Rainfall Risk",
      level: "Moderate",
      badgeClass: "badge-watch",
      reason: `Low weekly total precipitation (${totalPrecipitationMm.toFixed(1)} mm).`
    });
  } else if (totalPrecipitationMm > 40.0) {
    categoryRisks.push({
      name: "Rainfall Risk",
      level: "High",
      badgeClass: "badge-urgent",
      reason: `Heavy cumulative rainfall (${totalPrecipitationMm.toFixed(1)} mm) — risk of waterlogging.`
    });
  } else {
    categoryRisks.push({
      name: "Rainfall Risk",
      level: "Low",
      badgeClass: "badge-healthy",
      reason: `Balanced rainfall total (${totalPrecipitationMm.toFixed(1)} mm).`
    });
  }

  // 3. Heat Stress Risk
  if (risk.heatStressDays >= 2) {
    categoryRisks.push({
      name: "Heat Risk",
      level: "High",
      badgeClass: "badge-urgent",
      reason: `${risk.heatStressDays} days forecast exceeding 38°C heat stress threshold.`
    });
  } else if (risk.heatStressDays === 1) {
    categoryRisks.push({
      name: "Heat Risk",
      level: "Moderate",
      badgeClass: "badge-watch",
      reason: `1 day forecast exceeding 38°C threshold.`
    });
  } else {
    categoryRisks.push({
      name: "Heat Risk",
      level: "Low",
      badgeClass: "badge-healthy",
      reason: `No forecast days exceed the 38°C heat stress threshold.`
    });
  }

  // 4. Humidity & Fungal Disease Risk
  const humidity = snapshot.avgHumidityNext24hPct;
  if (humidity !== null && humidity >= 75) {
    categoryRisks.push({
      name: "Humidity Risk",
      level: "Moderate",
      badgeClass: "badge-watch",
      reason: `24h average humidity at ${humidity}% — favorable micro-climate for leaf rust and fungal pathogens.`
    });
  } else {
    categoryRisks.push({
      name: "Humidity Risk",
      level: "Low",
      badgeClass: "badge-healthy",
      reason: `Humidity at ${humidity ?? 65}% — low fungal spore germination pressure.`
    });
  }

  // Overall Risk Label
  let overallRiskLevel: "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk" = "Low Risk";
  let overallBadgeClass = "badge-healthy";

  if (risk.level === "high") {
    overallRiskLevel = "High Risk";
    overallBadgeClass = "badge-urgent";
  } else if (risk.level === "moderate") {
    overallRiskLevel = "Moderate Risk";
    overallBadgeClass = "badge-watch";
  } else {
    overallRiskLevel = "Low Risk";
    overallBadgeClass = "badge-healthy";
  }

  // Outlook Summary
  let outlookSummary = "";
  if (risk.dryDaysAhead >= 5) {
    outlookSummary = `Mostly dry conditions expected over the next 7 days (${risk.dryDaysAhead}/7 dry days), with limited precipitation (${totalPrecipitationMm.toFixed(1)} mm total) and ${risk.heatStressDays} heat-stress days forecast. Proactive irrigation planning recommended.`;
  } else if (totalPrecipitationMm >= 25) {
    outlookSummary = `Wet weather stretch expected with ${totalPrecipitationMm.toFixed(1)} mm total precipitation across ${7 - risk.dryDaysAhead} rain days. Monitor field drainage and defer pesticide spraying on high-rain days.`;
  } else {
    outlookSummary = `Mixed weather conditions ahead for Kopargaon block with ${totalPrecipitationMm.toFixed(1)} mm total rainfall and average temperatures between ${Math.round(minTempWeek)}°C and ${Math.round(maxTempWeek)}°C.`;
  }

  // Farm Impact Cards
  const farmImpacts = [
    {
      title: "Irrigation & Soil Moisture",
      icon: "💧",
      status: risk.dryDaysAhead >= 5 ? "Dry Conditions Forecast" : "Adequate Rain Expected",
      badgeClass: risk.dryDaysAhead >= 5 ? "badge-watch" : "badge-healthy",
      reason: `${risk.dryDaysAhead} of 7 forecast days have rainfall below 1.0 mm. Soil evapotranspiration rate remains steady.`,
      action: "Verify root-zone soil moisture before scheduling drip or flood irrigation to prevent unnecessary water loss.",
      targetTab: "water" as const
    },
    {
      title: "Crop Health & Fungal Risk",
      icon: "🌱",
      status: humidity && humidity >= 75 ? "Elevated Humidity Risk" : "Normal Fungal Risk",
      badgeClass: humidity && humidity >= 75 ? "badge-watch" : "badge-healthy",
      reason: `Average humidity is ${humidity ?? 68}%. High humidity combined with warm temperatures creates micro-climates suitable for pathogen spore germination on ${currentCrop}.`,
      action: "Inspect lower leaves for powdery mildew, rust pustules, or leaf spots using Crop Doctor diagnostic scanner.",
      targetTab: "crop" as const
    },
    {
      title: "Field Spraying & Operation Window",
      icon: "🚜",
      status: "Optimal Spray Window Available",
      badgeClass: "badge-healthy",
      reason: `Low rainfall expected on 5 out of 7 days, allowing foliar applications without immediate wash-off risks.`,
      action: "Schedule organic or recommended bio-pesticide sprays during early morning hours when wind speed is low.",
      targetTab: "advisory" as const
    },
    {
      title: "Government Crop Insurance",
      icon: "🛡️",
      status: "Weather Risk Protection Eligible",
      badgeClass: "badge-muted",
      reason: `Weather Based Crop Insurance (WBCIS / PMFBY) covers notified crop losses triggered by weather index deficits.`,
      action: "Review Weather Based Crop Insurance Scheme (WBCIS) guidelines for Kopargaon reference weather station.",
      targetTab: "schemes" as const
    }
  ];

  // Visual Decision Flow
  const decisionFlow = {
    weatherSignal: `${risk.dryDaysAhead} Dry Days Forecast (<1mm Rain)`,
    climateRisk: `Moderate Evapotranspiration Risk`,
    farmImpact: `Soil Moisture Deficit in Root Zone`,
    recommendation: `Check Soil Moisture & Schedule Micro-Irrigation`
  };

  // Priority Advisories
  const priorityAdvisories = [
    {
      priority: risk.dryDaysAhead >= 5 ? ("HIGH PRIORITY" as const) : ("MEDIUM PRIORITY" as const),
      badgeClass: risk.dryDaysAhead >= 5 ? "badge-urgent" : "badge-watch",
      category: "IRRIGATION PLANNING",
      title: "Inspect Soil Moisture & Well Water Table",
      reason: `${risk.dryDaysAhead} consecutive dry days expected ahead. Kopargaon aquifer level is at ~42.6m.`,
      action: "Drip irrigate early morning to prevent high daytime evaporation losses."
    },
    {
      priority: humidity && humidity >= 75 ? ("HIGH PRIORITY" as const) : ("LOW PRIORITY" as const),
      badgeClass: humidity && humidity >= 75 ? "badge-urgent" : "badge-healthy",
      category: "CROP PROTECTION",
      title: `Monitor ${currentCrop} Leaf Undersides for Fungal Symptoms`,
      reason: `Relative humidity at ${humidity ?? 68}% increases spore germination risk for Leaf Scald, Rust, and Blotch.`,
      action: "Use KisaniQ Crop Doctor photo scanner to capture leaf symptoms at first sign of yellowing or spots."
    },
    {
      priority: "LOW PRIORITY" as const,
      badgeClass: "badge-healthy",
      category: "GOVERNMENT SUPPORT",
      title: "Explore Weather Based Crop Insurance Scheme (WBCIS)",
      reason: "Weather risks like prolonged dry spells or extreme humidity can trigger automated index payouts under PMFBY.",
      action: "Check WBCIS parameter cutoff dates on official portal pmfby.gov.in."
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
