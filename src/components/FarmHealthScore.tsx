import { ClimateRisk } from "../lib/weather";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
}

export default function FarmHealthScore({ climateRisk, village, detectedDisease, cropName }: Props) {
  let score = 82; // Base score
  let statusText = "Good";

  if (climateRisk?.level === "high") score -= 15;
  else if (climateRisk?.level === "moderate") score -= 8;

  if (village?.waterSourceType === "groundwater_only") score -= 10;

  if (detectedDisease?.severity === "urgent") score -= 25;
  else if (detectedDisease?.severity === "watch") score -= 12;

  if (score >= 80) statusText = "Optimal";
  else if (score >= 60) statusText = "Moderate";
  else statusText = "Action Required";

  return (
    <div className="farm-score-banner">
      <div className="score-left">
        <div className="score-gauge">
          <div className="score-inner">
            <span className="score-num">{score}</span>
            <span className="score-label">/ 100</span>
          </div>
        </div>

        <div className="score-greeting">
          <h2>Good morning 👋</h2>
          <p>Your farm intelligence for today • <strong>{village ? village.name : "Kopargaon"}, Maharashtra</strong></p>
        </div>
      </div>

      <div className="signals-summary-row">
        <div className="signal-pill">
          <span>🌦️</span>
          <span>Climate: {climateRisk ? climateRisk.level.toUpperCase() : "Live API"}</span>
        </div>

        <div className="signal-pill">
          <span>💧</span>
          <span>Water: {village ? village.waterSourceType.split("_")[0] : "Monitored"}</span>
        </div>

        <div className="signal-pill">
          <span>🍃</span>
          <span>Crop AI: {detectedDisease ? `${cropName}: ${detectedDisease.displayName}` : "Scouted"}</span>
        </div>
      </div>
    </div>
  );
}
