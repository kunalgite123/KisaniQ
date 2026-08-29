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
  climateRisk: ClimateRisk | null,
  interactiveFilters?: {
    crop?: string;
    soil?: string;
    disruption?: string;
  }
): SchemeEvaluationResult {
  const whyReasons: string[] = [];
  let score = 0;

  const currentCrop = interactiveFilters?.crop && interactiveFilters.crop !== "all"
    ? interactiveFilters.crop
    : (cropName || "Cotton");

  const currentVillageName = village?.name || "Kopargaon";
  const userSoil = interactiveFilters?.soil || "all";
  const userDisruption = interactiveFilters?.disruption || "all";

  // Check interactive user choices first
  if (userDisruption !== "all") {
    if (userDisruption === "side-income" && scheme.category === "side-income") {
      whyReasons.push(`✓ Directly matched your request for Side Income & Allied Business Subsidies.`);
      score += 5;
    } else if (userDisruption === "drought" && (scheme.id === "pmfby" || scheme.id === "wbcis" || scheme.id === "pmksy")) {
      whyReasons.push(`✓ Matched your selected farm disruption: Deficit Rain & Drought Risk.`);
      score += 4;
    } else if (userDisruption === "pest" && (scheme.id === "ipm" || scheme.id === "npss" || scheme.id === "pmfby")) {
      whyReasons.push(`✓ Matched your selected farm disruption: Pest & Disease Outbreak.`);
      score += 4;
    } else if (userDisruption === "water" && (scheme.id === "pmksy" || scheme.id === "atal-bhujal")) {
      whyReasons.push(`✓ Matched your selected farm disruption: Groundwater & Water Scarcity.`);
      score += 4;
    } else if (userDisruption === "inputs" && (scheme.id === "pm-kisan" || scheme.id === "soil-health-card")) {
      whyReasons.push(`✓ Matched your selected farm disruption: Seed & Fertilizer Input Expenses.`);
      score += 4;
    } else if (userDisruption === "market" && (scheme.id === "enam" || scheme.id === "pmfme")) {
      whyReasons.push(`✓ Matched your selected farm disruption: Produce Selling & Market Access.`);
      score += 4;
    }
  }

  if (userSoil !== "all") {
    if (scheme.id === "soil-health-card") {
      whyReasons.push(`✓ Tailored for ${userSoil} nutrient management.`);
      score += 2;
    }
    if (userSoil.includes("Black") && (scheme.id === "pmksy" || scheme.id === "pmfby")) {
      whyReasons.push(`✓ Suitable for ${userSoil} water retention & crop moisture planning.`);
      score += 1;
    }
  }

  // General scheme matching logic
  if (scheme.id === "pmfby") {
    whyReasons.push(`✓ Registered crop (${currentCrop}) is a notified commercial/Kharif crop in Kopargaon block.`);
    score += 3;
    if (climateRisk && climateRisk.dryDaysAhead >= 4) {
      whyReasons.push(`✓ Active climate alert: ${climateRisk.dryDaysAhead} consecutive dry days detected.`);
      score += 3;
    }
    if (detectedDisease && detectedDisease.severity !== "healthy") {
      whyReasons.push(`✓ Active crop health alert: ${detectedDisease.displayName} classified on ${currentCrop} leaf.`);
      score += 2;
    }
  } else if (scheme.id === "wbcis") {
    whyReasons.push(`✓ Weather risk protection: Parameters calculated for ${currentCrop} crop in Kopargaon station.`);
    score += 3;
    if (climateRisk && climateRisk.dryDaysAhead >= 4) {
      whyReasons.push(`✓ Deficit rainfall signal: ${climateRisk.dryDaysAhead} consecutive dry days predicted ahead.`);
      score += 3;
    }
  } else if (scheme.id === "pmksy") {
    whyReasons.push(`✓ Hydrogeological context: Kopargaon block aquifer level monitored at ~42.6m depth.`);
    score += 3;
    if (village && village.waterSourceType === "groundwater_only") {
      whyReasons.push(`✓ Village water profile: ${village.name} relies on groundwater — micro-irrigation highly recommended.`);
      score += 3;
    }
  } else if (scheme.id === "pmmsy") {
    whyReasons.push(`✓ Supplementary Side Income: 40%–60% capital subsidy for farm pond aquaculture in ${currentVillageName}.`);
    score += 3;
    whyReasons.push(`✓ Diversification: Reduces single-crop risk by generating ₹1.5L–₹3L additional annual income.`);
    score += 2;
  } else if (scheme.id === "nlm") {
    whyReasons.push(`✓ Supplementary Side Income: 50% capital subsidy for Goat, Sheep, and Poultry units.`);
    score += 3;
    whyReasons.push(`✓ Steady Cash Flow: Provides regular daily/monthly income alongside ${currentCrop} harvest.`);
    score += 2;
  } else if (scheme.id === "pmfme") {
    whyReasons.push(`✓ Value Addition & Agri-Business: 35% credit-linked subsidy for ${currentCrop} processing & storage.`);
    score += 3;
    whyReasons.push(`✓ Market Price Realization: Converts raw produce into high-value packaged goods.`);
    score += 2;
  } else if (scheme.id === "soil-health-card") {
    whyReasons.push(`✓ Soil profile: 12-parameter soil testing for ${currentCrop} in ${currentVillageName}.`);
    score += 3;
  } else if (scheme.id === "ipm") {
    whyReasons.push(`✓ Pest management guidance: Applicable for ${currentCrop} protection in ${currentVillageName}.`);
    score += 2;
    if (detectedDisease && detectedDisease.severity !== "healthy") {
      whyReasons.push(`✓ Active disease diagnostic: ${detectedDisease.displayName} detected — IPM sticky trap controls recommended.`);
      score += 4;
    }
  } else if (scheme.id === "npss") {
    whyReasons.push(`✓ Digital surveillance reference: AI/ML pest diagnostic platform by ICAR-NCIPM.`);
    score += 2;
  } else if (scheme.id === "pm-kisan") {
    whyReasons.push(`✓ Landholding farmer profile: Applicable for small & marginal landholders in ${currentVillageName}.`);
    score += 3;
  } else if (scheme.id === "enam") {
    whyReasons.push(`✓ Produce marketing: Direct electronic bidding for ${currentCrop} at Kopargaon APMC Mandi.`);
    score += 3;
  } else if (scheme.id === "mgnrega") {
    whyReasons.push(`✓ Rural asset creation: Supports community water conservation & farm ponds in ${currentVillageName}.`);
    score += 2;
  } else if (scheme.id === "atal-bhujal") {
    whyReasons.push(`✓ Groundwater reference: Kopargaon taluka designated under Maharashtra GSDA water studies.`);
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
