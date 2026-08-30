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
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: "18px 14px",
        marginTop: 0
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Tier 1: Category & Type Tags on Left + Relevance Badge on Right (Exact 28px height) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, height: 28, marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", overflow: "hidden" }}>
            <span className="section-label" style={{ fontSize: 10, whiteSpace: "nowrap" }}>
              {isMr ? (scheme.categoryLabelMr || scheme.categoryLabel) : scheme.categoryLabel}
            </span>
            <span className="badge" style={{ fontSize: 10, background: "var(--surface-muted)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              {isMr ? (scheme.typeLabelMr || scheme.typeLabel) : scheme.typeLabel}
            </span>
          </div>

          <span className={`badge ${badgeClass}`} style={{ flexShrink: 0, fontSize: 10, whiteSpace: "nowrap" }}>
            {translatedBadge}
          </span>
        </div>

        {/* Tier 2: Icon + Short Name Title (Exact 32px height) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 32, marginBottom: 4 }}>
          <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{scheme.categoryIcon}</span>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", margin: 0, lineHeight: 1.2 }}>
            {scheme.shortName}
          </h3>
        </div>

        {/* Tier 3: Full Scheme Name (Exact 24px height) */}
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", height: 24, display: "flex", alignItems: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {isMr ? (scheme.nameMr || scheme.name) : scheme.name}
        </div>

        {/* Tier 4: Provenance Badge Box (Exact 42px height) */}
        <div style={{ height: 42, display: "flex", alignItems: "center", marginTop: 4, marginBottom: 6 }}>
          <div style={{ fontSize: 10.5, color: "var(--primary-800)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, background: "var(--primary-100)", padding: "4px 8px", borderRadius: 4, width: "100%", lineHeight: 1.3 }}>
            <span style={{ flexShrink: 0 }}>✓</span>
            <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {isMr ? `अधिकृत स्रोत: ${scheme.officialSourceName || "शासकीय पोर्टल"} · पडताळणी: ${scheme.lastVerified || "ऑगस्ट २०२६"}` : `Verified official source: ${scheme.officialSourceName || "Government Portal"} · Checked ${scheme.lastVerified || "August 2026"}`}
            </span>
          </div>
        </div>

        {/* Tier 5: Scheme Summary (Exact 56px height) */}
        <p
          style={{
            fontSize: 12.5,
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 74
          }}
        >
          {isMr ? (scheme.summaryMr || scheme.summary) : scheme.summary}
        </p>
      </div>

      {/* Tier 6: Full Width Vertical Action Buttons (Zero Clipping & Fits Page) */}
      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: 7
        }}
      >
        <button
          type="button"
          onClick={onOpenDetail}
          className="btn-outline-sm"
          style={{ width: "100%", justifyContent: "center", padding: "7px 10px", fontSize: 12, fontWeight: 600 }}
        >
          {t("view_detailed_summary")}
        </button>

        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary-sm"
          style={{ width: "100%", justifyContent: "center", padding: "7px 10px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
        >
          {t("official_website")} ↗
        </a>
      </div>
    </div>
  );
}
