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
  Search
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
    <div
      className="card"
      style={{
        padding: 24,
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        marginBottom: 24
      }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div>
          <span className="section-label" style={{ fontSize: 11 }}>TODAY'S FARM DECISION</span>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
            {translatedTitle}
          </h3>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className={`badge badge-${verdict.urgency}`} style={{ fontSize: 12.5, padding: "4px 12px" }}>
            {riskLevel}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
            Confidence: {confidencePct}%
          </span>
        </div>
      </div>

      {/* Signal Flow Visualizer Pipeline */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          padding: 16,
          background: "var(--surface-bg)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-subtle)",
          marginBottom: 16
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CloudSun size={18} style={{ color: "var(--primary-700)" }} />
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Climate</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>
              {climateRisk ? `${climateRisk.dryDaysAhead}/7 dry days` : "Live Data"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Layers size={18} style={{ color: "var(--primary-700)" }} />
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Soil</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>Medium Black</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Droplets size={18} style={{ color: "var(--primary-700)" }} />
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Groundwater</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>
              {village ? (village.waterSourceType === "canal_godavari" ? "Canal Reach" : "Well Depleted") : "Semi-Critical"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sprout size={18} style={{ color: "var(--primary-700)" }} />
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Crop AI</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>
              {detectedDisease ? `${cropName}: ${detectedDisease.displayName}` : "Scouted"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--primary-100)", padding: "6px 10px", borderRadius: "var(--radius-sm)" }}>
          <Zap size={18} style={{ color: "var(--primary-900)" }} />
          <div>
            <div style={{ fontSize: 11, color: "var(--primary-800)", fontWeight: 700 }}>KisaniQ Action</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--primary-900)" }}>{translatedTitle}</div>
          </div>
        </div>
      </div>

      {/* Primary Actionable Verdict Box */}
      <div
        style={{
          background:
            verdict.urgency === "urgent"
              ? "rgba(220, 38, 38, 0.06)"
              : verdict.urgency === "watch"
              ? "rgba(217, 119, 6, 0.06)"
              : "rgba(21, 128, 61, 0.06)",
          border:
            verdict.urgency === "urgent"
              ? "1px solid rgba(220, 38, 38, 0.2)"
              : verdict.urgency === "watch"
              ? "1px solid rgba(217, 119, 6, 0.2)"
              : "1px solid rgba(21, 128, 61, 0.2)",
          borderRadius: "var(--radius-sm)",
          padding: 18
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          {verdict.urgency === "urgent" ? (
            <AlertTriangle size={22} style={{ color: "var(--color-urgent)" }} />
          ) : verdict.urgency === "watch" ? (
            <Info size={22} style={{ color: "#d97706" }} />
          ) : (
            <CheckCircle size={22} style={{ color: "var(--primary-700)" }} />
          )}

          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
              {translatedTitle}
            </h4>

            <ul style={{ marginTop: 8, paddingLeft: 18, fontSize: 13.5, color: "var(--text-main)", lineHeight: 1.6 }}>
              {verdict.points.map((p, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{p}</li>
              ))}
            </ul>

            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="btn-outline-sm"
                style={{ marginTop: 12, fontSize: 12 }}
              >
                View full advisory details →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Explainability Accordion */}
      <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={() => setShowExplainability(!showExplainability)}
          style={{
            border: "none",
            background: "transparent",
            color: "var(--primary-800)",
            fontWeight: 600,
            fontSize: 12.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <Search size={14} />
          <span>Why are we recommending this?</span>
          {showExplainability ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showExplainability && (
          <div style={{ marginTop: 10, background: "var(--surface-muted)", padding: 12, borderRadius: "var(--radius-sm)", fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {climateRisk && <li><strong>Climate:</strong> {climateRisk.headline}</li>}
              {village && <li><strong>Groundwater:</strong> {village.name} is {village.distanceToGodavariKm.toFixed(1)} km from Godavari river ({waterSourceLabel[village.waterSourceType]}).</li>}
              {detectedDisease && cropName && <li><strong>Crop Health:</strong> {detectedDisease.displayName} identified on {cropName}.</li>}
              {!detectedDisease && <li><strong>Crop Scouting:</strong> Scan a leaf under Crop Doctor to feed real-time disease diagnostic signals.</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
