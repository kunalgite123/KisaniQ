import { GovernmentScheme } from "../data/schemesData";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { ClimateRisk } from "./weather";

export type RelevanceLabel = "High Relevance" | "Good Match" | "Relevant" | "Explore";

export interface SchemeEvaluationResult {
  scheme: GovernmentScheme;
  relevanceLabel: RelevanceLabel;
  badgeClass: string;
  whyReasons: string[];
}

export function evaluateSchemeRelevance(
  scheme: GovernmentScheme,
  village: Village | null,
  cropName: string | null,
  detectedDisease: DiseaseInfo | null,
  climateRisk: ClimateRisk | null
): SchemeEvaluationResult {
  const whyReasons: string[] = [];
  let score = 0;

  const currentCrop = cropName || "Cotton";
  const currentVillageName = village?.name || "Kopargaon";

  if (scheme.id === "pmfby") {
    // Crop Insurance
    whyReasons.push(`✓ Registered crop (${currentCrop}) is a notified commercial/Kharif crop in Kopargaon block.`);
    score += 3;

    if (climateRisk && climateRisk.dryDaysAhead >= 4) {
      whyReasons.push(`✓ Active climate alert: ${climateRisk.dryDaysAhead} consecutive dry days detected in Open-Meteo satellite feed.`);
      score += 3;
    }
    if (detectedDisease && detectedDisease.severity !== "healthy") {
      whyReasons.push(`✓ Active crop health alert: ${detectedDisease.displayName} classified on ${currentCrop} leaf.`);
      score += 2;
    }
    whyReasons.push(`✓ Location context: ${currentVillageName}, Ahmednagar District, Maharashtra.`);
  } else if (scheme.id === "pmksy") {
    // Irrigation / Water Efficiency
    whyReasons.push(`✓ Hydrogeological context: Kopargaon block aquifer level monitored at ~42.6m depth (Semi-Critical zone).`);
    score += 3;

    if (village) {
      if (village.waterSourceType === "groundwater_only" || village.distanceToGodavariKm > 10) {
        whyReasons.push(`✓ Village water profile: ${village.name} is ${village.distanceToGodavariKm.toFixed(1)}km from Godavari river — micro-irrigation highly recommended.`);
        score += 3;
      } else {
        whyReasons.push(`✓ Canal/River proximity: ${village.name} (${village.distanceToGodavariKm.toFixed(1)}km to river) — drip fertigation improves yield.`);
        score += 2;
      }
    }

    if (climateRisk && climateRisk.heatStressDays > 0) {
      whyReasons.push(`✓ Temperature forecast: ${climateRisk.heatStressDays} heat stress days ahead — drip irrigation prevents evapotranspiration loss.`);
      score += 2;
    }
  } else if (scheme.id === "soil-health-card") {
    // Soil Health
    whyReasons.push(`✓ Soil profile: Medium Black / Coarse shallow soil dominant in Kopargaon block.`);
    score += 3;

    if (currentCrop === "Cotton" || currentCrop === "Sugarcane") {
      whyReasons.push(`✓ Crop nutrient demand: ${currentCrop} requires balanced NPK + Micronutrient management (Zn, S, B).`);
      score += 2;
    }
    whyReasons.push(`✓ KisaniQ soil intelligence: 12-parameter lab test tracking N, P, K, pH, EC, and Organic Carbon.`);
  } else if (scheme.id === "pm-kisan") {
    // Income Support
    whyReasons.push(`✓ Landholding farmer profile: Applicable for small & marginal landholders in ${currentVillageName}.`);
    score += 3;
    whyReasons.push(`✓ Annual support: ₹6,000 DBT financial assistance in 3 installments for seed & fertilizer input expenses.`);
    score += 1;
  } else if (scheme.id === "enam") {
    // Market Access
    whyReasons.push(`✓ Produce marketing: Direct electronic bidding for ${currentCrop} at Kopargaon APMC Mandi.`);
    score += 3;
    whyReasons.push(`✓ Price transparency: Real-time price discovery and direct bank settlement.`);
    score += 2;
  }

  let relevanceLabel: RelevanceLabel = "Explore";
  let badgeClass = "badge-healthy";

  if (score >= 6) {
    relevanceLabel = "High Relevance";
    badgeClass = "badge-urgent";
  } else if (score >= 4) {
    relevanceLabel = "Good Match";
    badgeClass = "badge-watch";
  } else if (score >= 2) {
    relevanceLabel = "Relevant";
    badgeClass = "badge-healthy";
  } else {
    relevanceLabel = "Explore";
    badgeClass = "badge-healthy";
  }

  return {
    scheme,
    relevanceLabel,
    badgeClass,
    whyReasons
  };
}
