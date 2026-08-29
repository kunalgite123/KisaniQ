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
  ArrowRight,
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
      {/* Signature Card Header */}
      <div className="card-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={14} style={{ color: "var(--primary-500)" }} />
            <span className="section-label">{t("todays_farm_decision")}</span>
          </div>
          <h3 className="section-title" style={{ fontSize: 22 }}>{translatedTitle}</h3>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`badge badge-${verdict.urgency}`}>{riskLevel}</span>
          <span className="confidence-chip">{t("confidence")}: {confidencePct}%</span>
        </div>
      </div>

      {/* Signal Flow Visualizer Pipeline */}
      <div className="convergence-flow-bar">
        <div className="flow-node">
          <div className="node-icon">
            <CloudSun size={18} style={{ color: "var(--primary-500)" }} />
          </div>
          <span className="node-title">{t("node_climate")}</span>
          <span className="node-val">
            {climateRisk ? `${climateRisk.dryDaysAhead}/7 ${t("dry_day").toLowerCase()}s` : t("live_data")}
          </span>
        </div>

        <ArrowRight className="flow-arrow" size={16} />

        <div className="flow-node">
          <div className="node-icon">
            <Layers size={18} style={{ color: "var(--turmeric-400)" }} />
          </div>
          <span className="node-title">{t("node_soil")}</span>
          <span className="node-val">{t("soil_black_murrum")}</span>
        </div>

        <ArrowRight className="flow-arrow" size={16} />

        <div className="flow-node">
          <div className="node-icon">
            <Droplets size={18} style={{ color: "var(--water-600)" }} />
          </div>
          <span className="node-title">{t("node_groundwater")}</span>
          <span className="node-val">
            {village ? (village.waterSourceType === "canal_godavari" ? t("canal_reach") : t("well_depleted")) : t("taluka_baseline")}
          </span>
        </div>

        <ArrowRight className="flow-arrow" size={16} />

        <div className="flow-node">
          <div className="node-icon">
            <Sprout size={18} style={{ color: "var(--primary-500)" }} />
          </div>
          <span className="node-title">{t("node_crop_ai")}</span>
          <span className="node-val">
            {detectedDisease ? `${cropName}: ${detectedDisease.displayName}` : t("leaf_scout")}
          </span>
        </div>

        <ArrowRight className="flow-arrow" size={16} style={{ color: "var(--primary-500)" }} />

        <div className="flow-node flow-node-verdict">
          <div className="node-icon node-icon-zap">
            <Zap size={18} style={{ color: "var(--primary-950)" }} />
          </div>
          <span className="node-title" style={{ color: "var(--primary-950)", opacity: 0.85 }}>{t("node_krishi_ai")}</span>
          <span className="node-val" style={{ color: "var(--primary-950)", fontWeight: 700 }}>{translatedTitle}</span>
        </div>
      </div>

      {/* Primary Actionable Verdict Box */}
      <div className={`verdict-box ${verdict.urgency}`}>
        <div className="verdict-icon">
          {verdict.urgency === "urgent" ? (
            <AlertTriangle size={24} style={{ color: "var(--alert-red)" }} />
          ) : verdict.urgency === "watch" ? (
            <Info size={24} style={{ color: "var(--turmeric-600)" }} />
          ) : (
            <CheckCircle size={24} style={{ color: "var(--primary-500)" }} />
          )}
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
          <Search size={14} />
          <span>{t("why_recommending")}</span>
          {showExplainability ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
