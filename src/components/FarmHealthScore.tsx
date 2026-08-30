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
              width: 64,
              height: 64,
              borderRadius: "var(--radius-sm)",
              border: "1.5px solid var(--border-strong)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--surface-sage)"
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: "var(--primary-900)", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>/ 100</span>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {isMr ? "शेती तयारी निर्देशांक" : "Farm Readiness Index"}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
              {isMr ? "शुभ प्रभात, शेतकरी बांधवांनो 🌾" : "Good morning, Kisan 🌾"}
            </h2>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>
              {isMr ? "आजच्या हवामान, भूजल आणि पिकाच्या स्थितीवर आधारित · 📍" : "Based on today's weather, water and crop conditions · 📍"} <strong>{village ? village.name : (isMr ? "कोपरगाव" : "Kopargaon")}, {isMr ? "महाराष्ट्र" : "Maharashtra"}</strong>
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
