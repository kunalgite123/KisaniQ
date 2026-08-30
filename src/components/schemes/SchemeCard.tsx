import { SchemeEvaluationResult } from "../../lib/schemeMatching";
import { useLanguage } from "../../context/LanguageContext";

interface Props {
  evaluation: SchemeEvaluationResult;
  onOpenDetail: () => void;
}

export default function SchemeCard({ evaluation, onOpenDetail }: Props) {
  const { t, language } = useLanguage();
  const isMr = language === "mr";
  const { scheme, relevanceLabel, badgeClass } = evaluation;

  const translatedBadge =
    relevanceLabel === "Good Match"
      ? (isMr ? "योग्य सुसंगत" : t("good_match_label"))
      : relevanceLabel === "High Relevance"
      ? (isMr ? "उच्च प्राधान्य" : t("high_relevance_label"))
      : relevanceLabel === "Relevant"
      ? (isMr ? "सुसंगत योजना" : t("relevant_label"))
      : relevanceLabel;

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        {/* Header & Badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>{scheme.categoryIcon}</span>
            <div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span className="section-label">{isMr ? (scheme.categoryLabelMr || scheme.categoryLabel) : scheme.categoryLabel}</span>
                <span className="badge" style={{ fontSize: 10, background: "var(--surface-muted)", color: "var(--text-muted)" }}>
                  {isMr ? (scheme.typeLabelMr || scheme.typeLabel) : scheme.typeLabel}
                </span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 2, color: "var(--text-main)" }}>
                {scheme.shortName}
              </h3>
            </div>
          </div>
          <span className={`badge ${badgeClass}`}>{translatedBadge}</span>
        </div>

        {/* Name & Period */}
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-main)", marginTop: 8 }}>
          {isMr ? (scheme.nameMr || scheme.name) : scheme.name}
        </div>

        {scheme.programmePeriod && (
          <div style={{ fontSize: 11, color: "var(--color-urgent)", fontWeight: 600, marginTop: 2 }}>
            ⏱ {scheme.programmePeriod}
          </div>
        )}

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {isMr ? (scheme.summaryMr || scheme.summary) : scheme.summary}
        </p>

      </div>

      {/* TWO MANDATORY BUTTONS AT BOTTOM OF EVERY CARD */}
      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={onOpenDetail}
          className="btn btn-outline"
          style={{ width: "100%", justifyContent: "center", padding: "9px 12px", fontSize: 12.5 }}
        >
          {t("view_detailed_summary")}
        </button>

        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: "9px 12px", fontSize: 12.5, textDecoration: "none" }}
        >
          {t("official_website")}
        </a>
      </div>
    </div>
  );
}
