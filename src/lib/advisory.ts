import { ClimateRisk } from "./weather";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { generateFarmerDecision } from "./farmerDecisionEngine";

export interface AdvisoryInput {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  lang?: "en" | "mr" | "hi";
}

export interface AdvisoryVerdict {
  urgency: "healthy" | "watch" | "urgent";
  title: string;
  points: string[];
}

/**
 * Delegates to central decision engine to produce unified actionable verdict.
 */
export function synthesizeAdvisory(input: AdvisoryInput): AdvisoryVerdict {
  const { climateRisk, village, detectedDisease, cropName, lang = "en" } = input;

  const decision = generateFarmerDecision({
    village,
    climateRisk,
    detectedDisease,
    cropName,
    lang
  });

  const points: string[] = [];
  points.push(decision.primaryAction + ": " + decision.summary);

  if (decision.irrigation.reason) {
    points.push(decision.irrigation.action + " — " + decision.irrigation.reason);
  }

  if (detectedDisease) {
    points.push(`${cropName || "Crop"}: ${detectedDisease.displayName} — ${detectedDisease.advisory}`);
  }

  return {
    urgency: decision.urgency,
    title: decision.title,
    points
  };
}
