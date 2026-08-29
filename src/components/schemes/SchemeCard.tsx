import { useState } from "react";
import { SchemeEvaluationResult } from "../../lib/schemeMatching";

interface Props {
  evaluation: SchemeEvaluationResult;
  onOpenDetail: () => void;
}

export default function SchemeCard({ evaluation, onOpenDetail }: Props) {
  const { scheme, relevanceLabel, badgeClass, whyReasons } = evaluation;
  const [showWhy, setShowWhy] = useState(false);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>{scheme.categoryIcon}</span>
            <div>
              <span className="section-label">{scheme.categoryLabel}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 2, color: "var(--text-main)" }}>
                {scheme.shortName}
              </h3>
            </div>
          </div>
          <span className={`badge ${badgeClass}`}>{relevanceLabel}</span>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", marginTop: 8 }}>
          {scheme.name}
        </div>

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {scheme.summary}
        </p>

        {/* Expandable Why Matched Accordion */}
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--border-subtle)" }}>
          <button
            className="accordion-toggle-btn"
            onClick={() => setShowWhy(!showWhy)}
            style={{ fontSize: 12 }}
          >
            <span>Why KisaniQ recommends this</span>
            <span>{showWhy ? "▲" : "▼"}</span>
          </button>

          {showWhy && (
            <div style={{ marginTop: 8, background: "var(--surface-muted)", padding: 10, borderRadius: "var(--radius-sm)", fontSize: 12 }}>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                {whyReasons.map((r, i) => (
                  <li key={i} style={{ color: "var(--text-main)", lineHeight: 1.4 }}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* TWO MANDATORY BUTTONS AT BOTTOM OF EVERY CARD */}
      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={onOpenDetail}
          className="btn btn-outline"
          style={{ width: "100%", justifyContent: "center", padding: "9px 12px", fontSize: 12.5 }}
        >
          View Detailed Summary
        </button>

        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: "9px 12px", fontSize: 12.5, textDecoration: "none" }}
        >
          Official Website ↗
        </a>
      </div>
    </div>
  );
}
