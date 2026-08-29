import { SchemeEvaluationResult } from "../../lib/schemeMatching";

interface Props {
  evaluation: SchemeEvaluationResult;
  onClose: () => void;
}

export default function SchemeDetailModal({ evaluation, onClose }: Props) {
  const { scheme, whyReasons, relevanceLabel, badgeClass } = evaluation;

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
              <span className="badge" style={{ background: "var(--surface-muted)", fontSize: 12 }}>
                {scheme.categoryIcon} {scheme.categoryLabel}
              </span>
              <span className={`badge ${badgeClass}`}>{relevanceLabel}</span>
              <span className="badge" style={{ background: "var(--primary-100)", color: "var(--primary-800)" }}>
                🏛 Official Government Scheme
              </span>
            </div>
            <h2 style={{ fontSize: 24, marginTop: 10, color: "var(--text-main)" }}>{scheme.name}</h2>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{scheme.shortName}</div>
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

        {/* 1. What is this scheme? */}
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}>What is this scheme?</h4>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.6 }}>{scheme.summary}</p>
        </div>

        {/* 2. Why is it relevant to you? */}
        <div style={{ marginTop: 20, background: "var(--surface-muted)", padding: 16, borderRadius: "var(--radius-md)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--primary-900)" }}>
            Why KisaniQ recommends this for your farm
          </h4>
          <ul style={{ marginTop: 8, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {whyReasons.map((reason, idx) => (
              <li key={idx} style={{ fontSize: 13, color: "var(--text-main)", lineHeight: 1.5 }}>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Soil Parameters list if Soil Health Card */}
        {scheme.soilParameters && (
          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}>
              12 Soil Health Parameters Monitored
            </h4>
            <div className="grid-2" style={{ marginTop: 8, gap: 8 }}>
              {scheme.soilParameters.map((param, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--surface-bg)",
                    border: "1px solid var(--border-subtle)",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 12.5,
                    color: "var(--text-muted)"
                  }}
                >
                  {param}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Key Benefits */}
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}>Key Benefits</h4>
          <ul style={{ marginTop: 8, paddingLeft: 18, fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
            {scheme.benefits.map((b, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Eligibility & Requirements */}
        <div className="grid-2" style={{ marginTop: 20, gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)" }}>Who Can Benefit</h4>
            <ul style={{ marginTop: 6, paddingLeft: 16, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {scheme.eligibilitySummary.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)" }}>Documents Required</h4>
            <ul style={{ marginTop: 6, paddingLeft: 16, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {scheme.documentsRequired.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. How to Proceed */}
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)" }}>How to Proceed</h4>
          <ol style={{ marginTop: 8, paddingLeft: 18, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
            {scheme.howToApplySteps.map((step, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Official Source Info */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-main)" }}>
              🏛 {scheme.officialSourceName}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              Last Verified: {scheme.lastVerified}
            </div>
          </div>

          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: "10px 20px", fontSize: 13 }}
          >
            Official Government Website ↗
          </a>
        </div>
      </div>
    </div>
  );
}
