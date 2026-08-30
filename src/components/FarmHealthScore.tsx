import { ClimateRisk } from "../lib/weather";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { useLanguage } from "../context/LanguageContext";
import { CloudSun, Droplets, Sprout } from "lucide-react";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
}

export default function FarmHealthScore({ climateRisk, village, detectedDisease, cropName }: Props) {
  const { t, language } = useLanguage();
  const isMr = language === "mr";
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
    <div
      className="card"
      style={{
        padding: 24,
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        marginBottom: 20
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        {/* Left Side: Score & Greeting */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Circular Score Gauge */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "3px solid var(--primary-600)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--surface-bg)"
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>/ 100</span>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary-800)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {isMr ? "किसान सारथी दैनंदिन निर्देशांक" : "Kisan Sarthi Daily Index"}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
              {isMr ? "शुभ प्रभात, शेतकरी बांधवांनो 🌾" : "Good morning, Kisan 🌾"}
            </h2>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              {isMr ? "आजची तुमची शेती माहिती · 📍" : "Here's your farm intelligence for today · 📍"} <strong>{village ? village.name : (isMr ? "कोपरगाव" : "Kopargaon")}, {isMr ? "महाराष्ट्र" : "Maharashtra"}</strong>
            </div>
          </div>
        </div>

        {/* Right Side: 3 Compact Signal Chips */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div
            style={{
              background: "var(--surface-bg)",
              border: "1px solid var(--border-subtle)",
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <CloudSun size={14} style={{ color: "var(--primary-700)" }} />
            <span style={{ color: "var(--text-muted)" }}>{t("signal_climate")}:</span>
            <strong style={{ color: "var(--text-main)" }}>{climateText}</strong>
          </div>

          <div
            style={{
              background: "var(--surface-bg)",
              border: "1px solid var(--border-subtle)",
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Droplets size={14} style={{ color: "var(--primary-700)" }} />
            <span style={{ color: "var(--text-muted)" }}>{t("signal_water")}:</span>
            <strong style={{ color: "var(--text-main)" }}>{t("signal_monitored")}</strong>
          </div>

          <div
            style={{
              background: "var(--surface-bg)",
              border: "1px solid var(--border-subtle)",
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Sprout size={14} style={{ color: "var(--primary-700)" }} />
            <span style={{ color: "var(--text-muted)" }}>{t("signal_crop_ai")}:</span>
            <strong style={{ color: "var(--text-main)" }}>
              {detectedDisease ? `${cropName}: ${detectedDisease.displayName}` : t("signal_scouted")}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
