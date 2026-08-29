import PageHeader from "./PageHeader";

export default function Schemes() {
  return (
    <div>
      <PageHeader
        title="Agriculture Schemes &amp; FPO Matching"
        subtitle="PM-KISAN, micro-irrigation subsidies and crop insurance matching"
      />

      <div className="card">
        <div className="section-label">Government Schemes &amp; Subsidy Engine · Phase 2</div>
        <div style={{ marginTop: 24, textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🏛️</div>
          <h3 className="section-title" style={{ fontSize: 22 }}>
            Government Scheme Matching Arrives in Next Release
          </h3>
          <p style={{ marginTop: 10, fontSize: 14, maxWidth: 520, marginInline: "auto", color: "var(--text-muted)", lineHeight: 1.6 }}>
            We're sequencing data streams by farmer impact per build-hour. Weather, groundwater and crop-health advisories ship first because they change weekly farming decisions. Scheme and FPO matching (PM-KISAN eligibility, crop insurance windows, drip irrigation subsidies) is scheduled for Phase 2.
          </p>
        </div>
      </div>
    </div>
  );
}
