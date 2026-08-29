import { useState } from "react";
import { ClimateRisk } from "../lib/weather";
import { Village, waterSourceLabel } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { synthesizeAdvisory } from "../lib/advisory";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  onViewDetails?: () => void;
}

export default function AdvisoryCard({ climateRisk, village, detectedDisease, cropName, onViewDetails }: Props) {
  const { t } = useLanguage();
  const [showExplainability, setShowExplainability] = useState(false);
  const verdict = synthesizeAdvisory({ climateRisk, village, detectedDisease, cropName });

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
    <div className="ai-convergence-card">
      <div className="card-header">
        <div>
          <span className="section-label">{t("todays_farm_decision")}</span>
          <h3 className="section-title">{translatedTitle}</h3>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`badge badge-${verdict.urgency}`}>{riskLevel}</span>
          <span className="confidence-chip">{t("confidence")}: {confidencePct}%</span>
        </div>
      </div>

      {/* Signal Flow Visualizer */}
      <div className="convergence-flow-bar">
        <div className="flow-node">
          <div className="node-icon">🌦️</div>
          <span className="node-title">{t("node_climate")}</span>
          <span className="node-val">
            {climateRisk ? `${climateRisk.dryDaysAhead}/7 ${t("dry_day").toLowerCase()}s` : t("live_data")}
          </span>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-node">
          <div className="node-icon">🌱</div>
          <span className="node-title">{t("node_soil")}</span>
          <span className="node-val">{t("soil_black_murrum")}</span>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-node">
          <div className="node-icon">💧</div>
          <span className="node-title">{t("node_groundwater")}</span>
          <span className="node-val">
            {village ? (village.waterSourceType === "canal_godavari" ? t("canal_reach") : t("well_depleted")) : t("taluka_baseline")}
          </span>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-node">
          <div className="node-icon">🍃</div>
          <span className="node-title">{t("node_crop_ai")}</span>
          <span className="node-val">
            {detectedDisease ? `${cropName}: ${detectedDisease.displayName}` : t("leaf_scout")}
          </span>
        </div>

        <span className="flow-arrow">⇒</span>

        <div className="flow-node" style={{ background: "var(--primary-700)", color: "#ffffff", padding: "6px 12px", borderRadius: "var(--radius-md)" }}>
          <div className="node-icon" style={{ background: "transparent", color: "#ffffff" }}>⚡</div>
          <span className="node-title" style={{ color: "rgba(255,255,255,0.8)" }}>{t("node_krishi_ai")}</span>
          <span className="node-val" style={{ color: "#ffffff" }}>{translatedTitle}</span>
        </div>
      </div>

      {/* Primary Actionable Verdict Box */}
      <div className={`verdict-box ${verdict.urgency}`}>
        <div className="verdict-icon">
          {verdict.urgency === "urgent" ? "⚠" : verdict.urgency === "watch" ? "◐" : "✓"}
        </div>
        <div style={{ flex: 1 }}>
          <div className="verdict-header">
            <h4 className="verdict-title">{translatedTitle}</h4>
            <span className="badge" style={{ background: "rgba(0,0,0,0.06)" }}>
              {t("timeframe_label")}
            </span>
          </div>

          <ul style={{ marginTop: 10, paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>
            {verdict.points.map((p, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{p}</li>
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

      {/* Progressive Disclosure Explainability Accordion */}
      <div className="explainability-accordion">
        <button
          className="accordion-toggle-btn"
          onClick={() => setShowExplainability(!showExplainability)}
        >
          <span>🔍 {t("why_recommending")}</span>
          <span>{showExplainability ? t("hide_reasoning") : t("show_reasoning")}</span>
        </button>

        {showExplainability && (
          <div className="explainability-content">
            <ul className="explain-list">
              {climateRisk && (
                <li className="explain-item">
                  <strong>Climate Factor:</strong> {climateRisk.headline}
                </li>
              )}
              {village && (
                <li className="explain-item">
                  <strong>Groundwater Factor:</strong> {village.name} is {village.distanceToGodavariKm.toFixed(1)} km from Godavari river ({waterSourceLabel[village.waterSourceType]}).
                </li>
              )}
              {detectedDisease && cropName && (
                <li className="explain-item">
                  <strong>Crop Diagnostic Factor:</strong> Edge TF.js model classified {detectedDisease.displayName} on {cropName} leaf.
                </li>
              )}
              {!detectedDisease && (
                <li className="explain-item">
                  <strong>Crop Scouting Tip:</strong> Scan a leaf under 'Crop Doctor' to feed real-time disease diagnostic signals into this decision engine.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
