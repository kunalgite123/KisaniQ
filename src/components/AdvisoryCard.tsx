import { useState } from "react";
import { ClimateRisk } from "../lib/weather";
import { Village, waterSourceLabel } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { synthesizeAdvisory } from "../lib/advisory";
import { useLanguage } from "../context/LanguageContext";
import {
  CloudSun,
  Layers,
  Droplets,
  Sprout,
  Zap,
  AlertTriangle,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles
} from "lucide-react";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  onViewDetails?: () => void;
}

export default function AdvisoryCard({ climateRisk, village, detectedDisease, cropName, onViewDetails }: Props) {
  const { t, language } = useLanguage();
  const [showExplainability, setShowExplainability] = useState(false);
  const verdict = synthesizeAdvisory({ climateRisk, village, detectedDisease, cropName, lang: language });

  const confidencePct = detectedDisease ? 92 : climateRisk ? 88 : 84;
  const riskLevel =
    verdict.urgency === "urgent" ? t("status_critical") : verdict.urgency === "watch" ? t("status_monitor") : t("status_stable");

  const translatedTitle =
    verdict.urgency === "urgent"
      ? t("act_this_week")
      : verdict.urgency === "watch"
      ? t("monitor_closely")
      : t("conditions_stable");

  return (
    <div
      className="ai-convergence-card"
      style={{
        position: "relative",
        padding: 26,
        border: "2px solid rgba(45, 106, 79, 0.25)",
        borderRadius: "var(--radius-lg)",
        marginBottom: 24,
        overflow: "hidden",
        isolation: "isolate",
        boxShadow: "var(--shadow-md)",
        background: "var(--surface-card)"
      }}
    >
      {/* Background Image: 40% Visibility in Light Mode, 20% in Dark Mode */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: 'url("/farm_bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "var(--advisory-bg-opacity, 0.40)" as any,
          pointerEvents: "none",
          zIndex: -1
        }}
      />

      {/* Card Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={14} style={{ color: "var(--primary-500)" }} />
            <span className="section-label" style={{ fontSize: 11 }}>{t("todays_farm_decision")}</span>
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)", marginTop: 4, margin: 0 }}>
            {translatedTitle}
          </h3>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className={`badge badge-${verdict.urgency}`} style={{ fontSize: 12.5, padding: "4px 12px" }}>
            {riskLevel}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
            {t("confidence")}: {confidencePct}%
          </span>
        </div>
      </div>

      {/* Signal Flow Visualizer Pipeline */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
          padding: 16,
          background: "rgba(244, 246, 248, 0.75)",
          backdropFilter: "blur(6px)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          marginBottom: 18
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(45, 106, 79, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloudSun size={18} style={{ color: "var(--primary-500)" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{t("node_climate")}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>
              {climateRisk ? `${climateRisk.dryDaysAhead}/7 ${t("dry_day").toLowerCase()}s` : t("live_data")}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(230, 126, 34, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={18} style={{ color: "var(--saffron-orange)" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{t("node_soil")}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>{t("soil_black_murrum")}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0, 119, 182, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Droplets size={18} style={{ color: "var(--ai-blue)" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{t("node_groundwater")}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>
              {village ? (village.waterSourceType === "canal_godavari" ? t("canal_reach") : t("well_depleted")) : t("taluka_baseline")}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(45, 106, 79, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sprout size={18} style={{ color: "var(--primary-500)" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{t("node_crop_ai")}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>
              {detectedDisease ? `${cropName}: ${detectedDisease.displayName}` : t("leaf_scout")}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--primary-700)", color: "#ffffff", padding: "8px 12px", borderRadius: "var(--radius-md)" }}>
          <Zap size={18} style={{ color: "#ffffff" }} />
          <div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}>{t("node_krishi_ai")}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#ffffff" }}>{translatedTitle}</div>
          </div>
        </div>
      </div>

      {/* Primary Actionable Verdict Box inside AdvisoryCard */}
      <div
        style={{
          background:
            verdict.urgency === "urgent"
              ? "rgba(220, 38, 38, 0.08)"
              : verdict.urgency === "watch"
              ? "rgba(230, 126, 34, 0.08)"
              : "rgba(45, 106, 79, 0.08)",
          backdropFilter: "blur(6px)",
          border:
            verdict.urgency === "urgent"
              ? "1px solid rgba(220, 38, 38, 0.25)"
              : verdict.urgency === "watch"
              ? "1px solid rgba(230, 126, 34, 0.25)"
              : "1px solid rgba(45, 106, 79, 0.25)",
          borderRadius: "var(--radius-md)",
          padding: 20
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          {verdict.urgency === "urgent" ? (
            <AlertTriangle size={24} style={{ color: "var(--alert-red)", flexShrink: 0 }} />
          ) : verdict.urgency === "watch" ? (
            <Info size={24} style={{ color: "var(--saffron-orange)", flexShrink: 0 }} />
          ) : (
            <CheckCircle size={24} style={{ color: "var(--primary-500)", flexShrink: 0 }} />
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <h4 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                {translatedTitle}
              </h4>
              <span className="badge" style={{ background: "rgba(0, 0, 0, 0.06)", fontSize: 11 }}>
                {t("timeframe_label")}
              </span>
            </div>

            <ul style={{ marginTop: 12, paddingLeft: 20, fontSize: 14, lineHeight: 1.65, color: "var(--text-main)" }}>
              {verdict.points.map((p, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{p}</li>
              ))}
            </ul>

            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="btn btn-outline"
                style={{ marginTop: 14, padding: "6px 16px", fontSize: 12.5 }}
              >
                {t("view_full_advisory")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progressive Disclosure Explainability Accordion */}
      <div className="explainability-accordion" style={{ marginTop: 16 }}>
        <button
          className="accordion-toggle-btn"
          onClick={() => setShowExplainability(!showExplainability)}
        >
          <Search size={14} />
          <span>{t("why_recommending")}</span>
          {showExplainability ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showExplainability && (
          <div className="explainability-content">
            <ul className="explain-list">
              {climateRisk && (
                <li className="explain-item">
                  <strong>{language === "mr" ? "हवामान घटक:" : "Climate Factor:"}</strong> {climateRisk.headline}
                </li>
              )}
              {village && (
                <li className="explain-item">
                  <strong>{language === "mr" ? "भूजल घटक:" : "Groundwater Factor:"}</strong> {village.name} {language === "mr" ? `हे गाव गोदावरी नदीपासून ${village.distanceToGodavariKm.toFixed(1)} किमी अंतरावर आहे (${waterSourceLabel[village.waterSourceType]}).` : `is ${village.distanceToGodavariKm.toFixed(1)} km from Godavari river (${waterSourceLabel[village.waterSourceType]}).`}
                </li>
              )}
              {detectedDisease && cropName && (
                <li className="explain-item">
                  <strong>{language === "mr" ? "पीक निदान घटक:" : "Crop Diagnostic Factor:"}</strong> {detectedDisease.displayName} {language === "mr" ? `हे लक्षण ${cropName} पिकावर वर्गीकरण केले.` : `on ${cropName} leaf.`}
                </li>
              )}
              {!detectedDisease && (
                <li className="explain-item">
                  <strong>{language === "mr" ? "पीक पाहणी टीप:" : "Crop Scouting Tip:"}</strong> {language === "mr" ? "या निर्णय इंजिनमध्ये थेट रोग निदान माहिती देण्यासाठी 'पीक डॉक्टर' मध्ये पानाचा फोटो स्कॅन करा." : "Scan a leaf under 'Crop Doctor' to feed real-time disease diagnostic signals into this decision engine."}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
