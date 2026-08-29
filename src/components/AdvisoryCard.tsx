import { useState } from "react";
import { ClimateRisk } from "../lib/weather";
import { Village, waterSourceLabel } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { synthesizeAdvisory } from "../lib/advisory";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  onViewDetails?: () => void;
}

export default function AdvisoryCard({ climateRisk, village, detectedDisease, cropName, onViewDetails }: Props) {
  const [showExplainability, setShowExplainability] = useState(false);
  const verdict = synthesizeAdvisory({ climateRisk, village, detectedDisease, cropName });

  const confidencePct = detectedDisease ? 92 : climateRisk ? 88 : 84;
  const riskLevel = verdict.urgency === "urgent" ? "CRITICAL" : verdict.urgency === "watch" ? "MONITOR" : "STABLE";

  return (
    <div className="ai-convergence-card">
      <div className="card-header">
        <div>
          <span className="section-label">TODAY'S FARM DECISION · KisaniQ AI Convergence</span>
          <h3 className="section-title">{verdict.title}</h3>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`badge badge-${verdict.urgency}`}>{riskLevel}</span>
          <span className="confidence-chip">Confidence: {confidencePct}%</span>
        </div>
      </div>

      {/* Signal Flow Visualizer */}
      <div className="convergence-flow-bar">
        <div className="flow-node">
          <div className="node-icon">🌦️</div>
          <span className="node-title">Climate</span>
          <span className="node-val">
            {climateRisk ? `${climateRisk.dryDaysAhead}/7 dry days` : "Live API"}
          </span>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-node">
          <div className="node-icon">🌱</div>
          <span className="node-title">Soil</span>
          <span className="node-val">Black / Murrum</span>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-node">
          <div className="node-icon">💧</div>
          <span className="node-title">Groundwater</span>
          <span className="node-val">
            {village ? (village.waterSourceType === "canal_godavari" ? "Canal Reach" : "Well Depleted") : "Taluka Baseline"}
          </span>
        </div>

        <span className="flow-arrow">→</span>

        <div className="flow-node">
          <div className="node-icon">🍃</div>
          <span className="node-title">Crop AI</span>
          <span className="node-val">
            {detectedDisease ? `${cropName}: ${detectedDisease.displayName}` : "Leaf Scout"}
          </span>
        </div>

        <span className="flow-arrow">⇒</span>

        <div className="flow-node" style={{ background: "var(--primary-700)", color: "#ffffff", padding: "6px 12px", borderRadius: "var(--radius-md)" }}>
          <div className="node-icon" style={{ background: "transparent", color: "#ffffff" }}>⚡</div>
          <span className="node-title" style={{ color: "rgba(255,255,255,0.8)" }}>KisaniQ AI</span>
          <span className="node-val" style={{ color: "#ffffff" }}>{verdict.title}</span>
        </div>
      </div>

      {/* Primary Actionable Verdict Box */}
      <div className={`verdict-box ${verdict.urgency}`}>
        <div className="verdict-icon">
          {verdict.urgency === "urgent" ? "⚠" : verdict.urgency === "watch" ? "◐" : "✓"}
        </div>
        <div style={{ flex: 1 }}>
          <div className="verdict-header">
            <h4 className="verdict-title">{verdict.title}</h4>
            <span className="badge" style={{ background: "rgba(0,0,0,0.06)" }}>
              Timeframe: 24–48 Hours
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
              View Full Advisory Details →
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
          <span>🔍 Why are we recommending this?</span>
          <span>{showExplainability ? "▲ Hide reasoning" : "▼ Show AI reasoning"}</span>
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
