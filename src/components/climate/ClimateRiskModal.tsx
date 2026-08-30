import { ClimateIntelligence } from "../../lib/climateIntelligence";
import { WeatherSnapshot, ClimateRisk } from "../../lib/weather";

interface Props {
  intelligence: ClimateIntelligence;
  snapshot: WeatherSnapshot;
  risk: ClimateRisk;
  onClose: () => void;
}

export default function ClimateRiskModal({ intelligence, snapshot, risk, onClose }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 31, 24, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          maxWidth: 680,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-strong)",
          padding: 28
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="section-label">CLIMATE RISK INTELLIGENCE &amp; EXPLAINABILITY</span>
              <span className={`badge ${intelligence.overallBadgeClass}`}>{intelligence.overallRiskLevel}</span>
            </div>
            <h2 style={{ fontSize: 22, marginTop: 6, color: "var(--text-main)" }}>Climate Risk Assessment Breakdown</h2>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{intelligence.locationName}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "var(--surface-muted)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* AI Explainability Summary */}
        <div style={{ marginTop: 20, background: "var(--surface-muted)", padding: 16, borderRadius: "var(--radius-md)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--primary-900)" }}>
            🧠 Why Kisan Sarthi Identifies {intelligence.overallRiskLevel}
          </h4>
          <p style={{ fontSize: 13.5, color: "var(--text-main)", marginTop: 6, lineHeight: 1.6 }}>
            {risk.headline}
          </p>
        </div>

        {/* Risk Categories Breakdown */}
        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginBottom: 12 }}>
            Risk Component Evaluation
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {intelligence.categoryRisks.map((cat, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--surface-bg)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-main)" }}>{cat.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{cat.reason}</div>
                </div>
                <span className={`badge ${cat.badgeClass}`} style={{ fontSize: 12 }}>
                  {cat.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Threshold Rules */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>
            ℹ️ Empirical Calculation Rules &amp; Thresholds
          </h4>
          <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
            <li>
              <strong>Dry Day Threshold:</strong> Forecast daily rainfall sum &lt; 1.0 mm.
            </li>
            <li>
              <strong>Heat Stress Threshold:</strong> Maximum daily temperature &gt; 38.0°C.
            </li>
            <li>
              <strong>Humidity Fungal Proxy:</strong> 24-hour mean relative humidity ≥ 75%.
            </li>
            <li>
              <strong>Data Source:</strong> {snapshot.provider} Live Weather Satellite Feed.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: "8px 20px" }}>
            Close Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
