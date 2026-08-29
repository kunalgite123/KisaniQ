import { ClimateRisk } from "./weather";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";

export interface AdvisoryInput {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
}

export interface AdvisoryVerdict {
  urgency: "healthy" | "watch" | "urgent";
  title: string;
  points: string[];
}

/**
 * Converts three independently-scattered signals (weather, groundwater/water
 * access, crop-health) into one localized, actionable verdict — the core
 * ask of the super problem statement.
 */
export function synthesizeAdvisory(input: AdvisoryInput): AdvisoryVerdict {
  const { climateRisk, village, detectedDisease, cropName } = input;
  const points: string[] = [];
  let urgency: AdvisoryVerdict["urgency"] = "healthy";

  if (climateRisk) {
    points.push(climateRisk.headline);
    if (climateRisk.level === "high") urgency = "urgent";
    else if (climateRisk.level === "moderate" && urgency === "healthy") urgency = "watch";
  }

  if (village) {
    if (village.waterSourceType === "groundwater_only") {
      points.push(
        `${village.name} is well/borewell-dependent and sits in a Semi-Critical block with a falling post-monsoon water table (~0.41 m/year). ` +
          (climateRisk?.level === "high"
            ? "Combined with the dry week ahead, prioritise the most water-efficient irrigation slot you have and avoid new deep borewells."
            : "Track borewell yield through the season and avoid drilling beyond 60 m without local guidance.")
      );
      if (urgency === "healthy") urgency = "watch";
    } else if (village.waterSourceType === "canal_godavari") {
      points.push(
        `${village.name} sits within Godavari canal reach — check the current canal release schedule before relying on borewell pumping.`
      );
    } else {
      points.push(
        `${village.name} is a moderate distance from the river — confirm with your local irrigation office whether the Pravara-side canal branch currently reaches your field before planning the season purely on rainfall.`
      );
    }
  }

  if (detectedDisease && cropName) {
    if (detectedDisease.severity === "urgent") {
      urgency = "urgent";
      points.push(`${cropName} scan: ${detectedDisease.displayName} detected. ${detectedDisease.advisory}`);
    } else if (detectedDisease.severity === "watch") {
      if (urgency === "healthy") urgency = "watch";
      points.push(`${cropName} scan: ${detectedDisease.displayName} detected. ${detectedDisease.advisory}`);
    } else {
      points.push(`${cropName} scan: plant looks healthy. ${detectedDisease.advisory}`);
    }
  }

  if (points.length === 0) {
    points.push("Select your village and scan a crop leaf to generate a combined advisory.");
  }

  const title =
    urgency === "urgent"
      ? "Act this week"
      : urgency === "watch"
      ? "Monitor closely"
      : "Conditions stable";

  return { urgency, title, points };
}
