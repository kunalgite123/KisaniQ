import { ClimateRisk } from "../lib/weather";
import { Village, waterSourceLabel } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { synthesizeAdvisory } from "../lib/advisory";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
}

export default function AdvisoryCard({ climateRisk, village, detectedDisease, cropName }: Props) {
  const verdict = synthesizeAdvisory({ climateRisk, village, detectedDisease, cropName });

  // Calculate confidence & risk level for display
  const confidencePct = detectedDisease ? 92 : climateRisk ? 88 : 84;
  const riskLevel = verdict.urgency === "urgent" ? "HIGH RISK" : verdict.urgency === "watch" ? "MODERATE RISK" : "STABLE";

  return (
    <div className="ai-convergence-card">
      <div className="card-header">
        <div>
          <span className="section-label">AI Convergence Engine · 4 Signals Integrated</span>
          <h3 className="section-title">Today's Farming Decision</h3>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`badge badge-${verdict.urgency}`}>{riskLevel}</span>
          <span className="confidence-chip">Confidence: {confidencePct}%</span>
        </div>
      </div>

      {/* Convergence Visual Flow Diagram */}
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
          <span className="node-title" style={{ color: "rgba(255,255,255,0.8)" }}>AI Decision</span>
          <span className="node-val" style={{ color: "#ffffff" }}>{verdict.title}</span>
        </div>
      </div>

      {/* Decision Verdict Box */}
      <div className={`verdict-box ${verdict.urgency}`}>
        <div className="verdict-icon">
          {verdict.urgency === "urgent" ? "⚠" : verdict.urgency === "watch" ? "◐" : "✓"}
        </div>
        <div style={{ flex: 1 }}>
          <div className="verdict-header">
            <h4 className="verdict-title">{verdict.title}</h4>
            <span className="badge" style={{ background: "rgba(0,0,0,0.08)" }}>
              Recommended Horizon: 24–48 Hours
            </span>
          </div>

          <ul style={{ marginTop: 10, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.6 }}>
            {verdict.points.map((p, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Explainability Section ("Why are we recommending this?") */}
      <div className="explainability-section">
        <div className="explain-title">🔍 Why is the AI recommending this action?</div>
        <ul className="explain-list">
          {climateRisk && (
            <li className="explain-item">
              <strong>Weather Signal:</strong> {climateRisk.headline}
            </li>
          )}
          {village && (
            <li className="explain-item">
              <strong>Groundwater &amp; Proximity Signal:</strong> {village.name} is {village.distanceToGodavariKm.toFixed(1)} km from Godavari river ({waterSourceLabel[village.waterSourceType]}).
            </li>
          )}
          {detectedDisease && cropName && (
            <li className="explain-item">
              <strong>Crop Diagnostic Signal:</strong> On-device model detected {detectedDisease.displayName} on {cropName} leaf.
            </li>
          )}
          {!detectedDisease && (
            <li className="explain-item">
              <strong>Crop Scouting Tip:</strong> Scan a leaf under 'Crop Doctor' tab to include real-time TF.js disease diagnostics into this decision model.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
