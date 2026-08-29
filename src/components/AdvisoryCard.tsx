import { useState } from "react";
import { ClimateRisk } from "../lib/weather";
import { Village, waterSourceLabel } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { useLanguage } from "../context/LanguageContext";
import { FarmerDecision, generateFarmerDecision } from "../lib/farmerDecisionEngine";
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
  decision?: FarmerDecision | null;
  onViewDetails?: () => void;
}

export default function AdvisoryCard({ climateRisk, village, detectedDisease, cropName, decision: propDecision, onViewDetails }: Props) {
  const { t, language } = useLanguage();
  const [showExplainability, setShowExplainability] = useState(false);

  const decision = propDecision || generateFarmerDecision({
    village,
    climateRisk,
    detectedDisease,
    cropName,
    lang: language as any
  });

  const confidencePct = decision.confidencePct;
  const riskLevel =
    decision.urgency === "urgent" ? t("status_critical") : decision.urgency === "watch" ? t("status_monitor") : t("status_stable");

  const translatedTitle = decision.title;

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
      {/* Background Image */}
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
          <span className={`badge badge-${decision.urgency}`} style={{ fontSize: 12.5, padding: "4px 12px" }}>
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
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#ffffff" }}>{decision.primaryAction}</div>
          </div>
        </div>
      </div>

      {/* Primary Actionable Verdict Box inside AdvisoryCard */}
      <div
        style={{
          background:
            decision.urgency === "urgent"
              ? "rgba(220, 38, 38, 0.08)"
              : decision.urgency === "watch"
              ? "rgba(230, 126, 34, 0.08)"
              : "rgba(45, 106, 79, 0.08)",
          backdropFilter: "blur(6px)",
          border:
            decision.urgency === "urgent"
              ? "1px solid rgba(220, 38, 38, 0.25)"
              : decision.urgency === "watch"
              ? "1px solid rgba(230, 126, 34, 0.25)"
              : "1px solid rgba(45, 106, 79, 0.25)",
          borderRadius: "var(--radius-md)",
          padding: 20
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          {decision.urgency === "urgent" ? (
            <AlertTriangle size={24} style={{ color: "var(--alert-red)", flexShrink: 0 }} />
          ) : decision.urgency === "watch" ? (
            <Info size={24} style={{ color: "var(--saffron-orange)", flexShrink: 0 }} />
          ) : (
            <CheckCircle size={24} style={{ color: "var(--primary-500)", flexShrink: 0 }} />
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <h4 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                {decision.primaryAction}
              </h4>
              <span className="badge" style={{ background: "rgba(0, 0, 0, 0.06)", fontSize: 11 }}>
                ⏳ {decision.timing}
              </span>
            </div>

            <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6, color: "var(--text-main)" }}>
              {decision.summary}
            </p>

            <ul style={{ marginTop: 10, paddingLeft: 20, fontSize: 13.5, lineHeight: 1.6, color: "var(--text-main)" }}>
              <li style={{ marginBottom: 4 }}>
                <strong>{language === "mr" ? "सिंचन शिफारस: " : "Irrigation Recommendation: "}</strong>
                {decision.irrigation.action} — {decision.irrigation.reason}
              </li>
              <li style={{ marginBottom: 4 }}>
                <strong>{language === "mr" ? "काय टाळावे: " : "What to Avoid: "}</strong>
                {decision.avoidAction}
              </li>
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
              {decision.reasons.map((r, idx) => (
                <li key={idx} className="explain-item">
                  <strong>{r.factor}:</strong> {r.detail} — <em>{r.impact}</em>
                </li>
              ))}
              <li className="explain-item">
                <strong>{language === "mr" ? "माहिती स्रोत:" : "Data Sources:"}</strong> {decision.dataSources.join(" | ")}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
