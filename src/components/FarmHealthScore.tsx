import { ClimateRisk } from "../lib/weather";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
}

export default function FarmHealthScore({ climateRisk, village, detectedDisease, cropName }: Props) {
  const { t } = useLanguage();
  let score = 82; // Base score

  if (climateRisk?.level === "high") score -= 15;
  else if (climateRisk?.level === "moderate") score -= 8;

  if (village?.waterSourceType === "groundwater_only") score -= 10;

  if (detectedDisease?.severity === "urgent") score -= 25;
  else if (detectedDisease?.severity === "watch") score -= 12;

  const climateText = climateRisk
    ? climateRisk.level === "high"
      ? t("status_critical")
      : climateRisk.level === "moderate"
      ? t("status_moderate")
      : t("status_stable")
    : t("live_data");

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
          <h2>{t("greeting_good_morning")}</h2>
          <p>
            {t("greeting_intelligence_sub")}
            <strong>{village ? village.name : "Kopargaon"}, {t("maharashtra")}</strong>
          </p>
        </div>
      </div>

      <div className="signals-summary-row">
        <div className="signal-pill">
          <span>🌦️</span>
          <span>{t("signal_climate")}: {climateText}</span>
        </div>

        <div className="signal-pill">
          <span>💧</span>
          <span>{t("signal_water")}: {t("signal_monitored")}</span>
        </div>

        <div className="signal-pill">
          <span>🍃</span>
          <span>{t("signal_crop_ai")}: {detectedDisease ? `${cropName}: ${detectedDisease.displayName}` : t("signal_scouted")}</span>
        </div>
      </div>
    </div>
  );
}
