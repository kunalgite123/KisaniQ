import { useState } from "react";
import { villages, Village, waterSourceLabel } from "../data/villages";
import { kopargaonProfile, cropBenchmarks } from "../data/groundSoil";
import { useLanguage } from "../context/LanguageContext";
import { evaluateWaterSoilDecision } from "../lib/waterSoilDecision";
import { Tab } from "../App";
import PageHeader from "./PageHeader";
import {
  Droplets,
  Layers,
  MapPin,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface Props {
  village: Village | null;
  onSelectVillage: (village: Village | null) => void;
  cropName?: string | null;
  onNavigateTab?: (tab: Tab) => void;
}

export default function WaterSoil({ village, onSelectVillage, cropName = "Sugarcane", onNavigateTab }: Props) {
  const { t, language } = useLanguage();
  const [showWhyReasoning, setShowWhyReasoning] = useState(false);

  // Evaluate Water & Soil Decision Rule Engine
  const decision = evaluateWaterSoilDecision({
    village,
    cropName,
    dryDaysAhead: 6,
    lang: language
  });

  return (
    <div>
      <PageHeader
        title={t("water_soil_title")}
        subtitle={language === "mr" ? "स्थान, भूजल व मातीवर आधारित शेती सिंचन निर्णय प्रणाली" : t("water_soil_subtitle")}
      />

      {/* 1. TOP SUMMARY CARD (SECTION 37) */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--surface-card), var(--surface-muted))",
          border: "2px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
          marginBottom: 24,
          boxShadow: "var(--shadow-md)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Sparkles size={14} style={{ color: "var(--primary-500)" }} />
              <span className="section-label" style={{ fontSize: 11 }}>
                {language === "mr" ? "कृषी सेतू पाणी व माती सल्ला" : "WATER & SOIL DECISION SUMMARY"}
              </span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={22} style={{ color: "var(--primary-500)" }} />
              {village ? village.name : "Kopargaon (Taluka Centre)"}
            </h2>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                background: "var(--primary-100)",
                color: "var(--primary-700)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: 12,
                fontWeight: 700
              }}
            >
              📍 {decision.distanceKm.toFixed(1)} km
            </span>
            <span
              style={{
                background: decision.waterStatus === "STRESSED" ? "rgba(220, 38, 38, 0.1)" : "rgba(230, 126, 34, 0.1)",
                color: decision.waterStatus === "STRESSED" ? "var(--alert-red)" : "var(--saffron-orange)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: 12,
                fontWeight: 700
              }}
            >
              {decision.ruleLabel}
            </span>
          </div>
        </div>

        {/* Quick Decision Action Headline */}
        <div
          style={{
            marginTop: 18,
            padding: "14px 18px",
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "var(--primary-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary-700)",
              flexShrink: 0
            }}
          >
            <Droplets size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              {language === "mr" ? "शिफारस केलेली कृती" : "RECOMMENDED FARM ACTION"}
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", marginTop: 2 }}>
              "{decision.recommendedAction}"
            </div>
          </div>
        </div>
      </div>

      {/* 2. VILLAGE SELECTOR & LOCATION PROXIMITY CARD */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-label">{t("village_selector_label")}</div>
        <h3 className="section-title">{t("select_your_village")}</h3>

        <div style={{ marginTop: 14, maxWidth: 460 }}>
          <select
            className="select"
            value={village?.name ?? ""}
            onChange={(e) => {
              const selected = villages.find((v) => v.name === e.target.value) ?? null;
              onSelectVillage(selected);
            }}
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            <option value="">-- {t("select_your_village")} --</option>
            {villages.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.distanceToGodavariKm.toFixed(1)} km from Godavari)
              </option>
            ))}
          </select>
        </div>

        {village && (
          <div className="grid-2" style={{ marginTop: 18 }}>
            <div className="readout">
              <div className="readout-label">{t("primary_source")}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 6 }}>
                <span className={`tag ${village.waterSourceType}`}>{waterSourceLabel[village.waterSourceType]}</span>
              </div>
              <div className="readout-label" style={{ marginTop: 14 }}>
                {t("distance_godavari")}
              </div>
              <div className="readout-value" style={{ fontSize: 24, marginTop: 2 }}>
                {village.distanceToGodavariKm.toFixed(1)} km
              </div>
            </div>

            {/* Card 2: CGWB Recharge Site & Dynamic Distance Decision (Case 1 / 2 / 3) */}
            <div className="readout" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
                    <div className="readout-label" style={{ margin: 0 }}>{t("recharge_site")}</div>
                    <span className="section-label" style={{ fontSize: 9.5, letterSpacing: "0.02em" }}>{decision.ruleLabel}</span>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>
                    {village.proposedRecharge ? "Yes — Percolation Tank / Recharge Shaft" : "Standard Monitoring Site"}
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
                  <span className="readout-label" style={{ marginTop: 0 }}>{decision.depthTypeLabel}:</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-700)" }}>{decision.referenceDepthRange}</span>
                </div>

                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-main)", marginTop: 6, lineHeight: 1.5 }}>
                  "{decision.interpretationText}"
                </div>
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  background: "var(--surface-bg)",
                  borderRadius: "var(--radius-sm)",
                  borderLeft: "4px solid var(--primary-500)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-main)",
                  lineHeight: 1.5
                }}
              >
                <strong>{language === "mr" ? "शिफारस केलेली कृती:" : "Recommended action:"}</strong> {decision.recommendedAction}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. VISUAL DISTANCE THRESHOLD DIAGRAM (SECTION 8 & 9) */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          padding: 22,
          background: "var(--surface-card)",
          border: "1px solid var(--border-strong)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <span className="section-label" style={{ fontSize: 11 }}>
              {language === "mr" ? "जल निरीक्षण अंतर मर्यादा" : "DISTANCE THRESHOLD EVALUATION"}
            </span>
            <h4 style={{ fontSize: 16, fontWeight: 700, margin: "2px 0 0 0", color: "var(--text-main)" }}>
              {language === "mr" ? "तुमच्या शेताचे जल निरीक्षण बिंदूपासूनचे अंतर" : "Proximity to Water Monitoring Point"}
            </h4>
          </div>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: 11.5,
              fontWeight: 800,
              background: decision.distanceCategory === "NEARBY" ? "var(--primary-100)" : "rgba(230, 126, 34, 0.15)",
              color: decision.distanceCategory === "NEARBY" ? "var(--primary-700)" : "var(--saffron-orange)"
            }}
          >
            {decision.ruleLabel}
          </span>
        </div>

        {/* Visual Line Diagram */}
        <div
          style={{
            margin: "20px 0 14px 0",
            padding: "16px 20px",
            background: "var(--surface-muted)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, zIndex: 1 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--primary-700)" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
              {language === "mr" ? "तुमचे शेत" : "YOUR FARM"}
            </span>
          </div>

          <div
            style={{
              flex: 1,
              height: 2,
              background: "dashed 2px var(--border-strong)",
              margin: "0 16px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-strong)",
                padding: "2px 10px",
                borderRadius: "var(--radius-full)",
                fontSize: 12,
                fontWeight: 800,
                color: "var(--primary-700)"
              }}
            >
              {decision.distanceKm.toFixed(1)} km
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, zIndex: 1 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--ai-blue)" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
              {language === "mr" ? "जल निरीक्षण बिंदू" : "MONITORING POINT"}
            </span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
          {language === "mr"
            ? `नियम मर्यादा: < ३ किमी (जवळ), ३–१० किमी (मध्यम), > १० किमी (खोल/लांब)`
            : `Threshold logic: < 3 km (Nearby), 3–10 km (Moderate), > 10 km (Deep/Distant)`}
        </div>
      </div>

      {/* 4. WATER STATUS CARD & SOIL STATUS CARD GRID (SECTION 4, 5, 19, 20) */}
      <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
        {/* WATER STATUS CARD */}
        <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Droplets size={20} style={{ color: "var(--ai-blue)" }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                  {language === "mr" ? "पाण्याची स्थिती" : "WATER STATUS"}
                </h3>
              </div>
              <span className={`badge badge-${decision.waterStatus === "GOOD" ? "healthy" : decision.waterStatus === "WATCH" ? "watch" : "urgent"}`}>
                {decision.waterStatus}
              </span>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                {language === "mr" ? "भूजल संदर्भ पातळी / खोली" : "Groundwater Depth"}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--text-main)", marginTop: 2 }}>
                {decision.measuredOrEstimatedDepth}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                <strong>{decision.depthTypeLabel}:</strong> {decision.referenceDepthRange}
              </div>
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-subtle)", fontSize: 13, color: "var(--text-main)" }}>
              📍 <strong>{decision.distanceKm.toFixed(1)} km</strong> {language === "mr" ? "जलनिरीक्षण बिंदूपासून अंतर" : "from monitoring observation point"}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-main)", background: "var(--surface-bg)", padding: 12, borderRadius: "var(--radius-sm)" }}>
              💡 {decision.interpretationText}
            </div>
          </div>
        </div>

        {/* SOIL CONDITION CARD */}
        <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Layers size={20} style={{ color: "var(--saffron-orange)" }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                  {language === "mr" ? "मातीची स्थिती" : "SOIL CONDITION"}
                </h3>
              </div>
              <span className={`badge badge-${decision.soilConditionState === "Healthy" ? "healthy" : "watch"}`}>
                {decision.soilConditionState}
              </span>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                {language === "mr" ? "मातीचा प्रकार" : "Soil Type"}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", marginTop: 4 }}>
                {decision.soilTypeLabel}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                {language === "mr" ? "कोपरगाव ब्लॉक क्षेत्र:" : "Kopargaon block share:"} 41% Medium Black + 38% Coarse shallow
              </div>
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-subtle)", fontSize: 13, color: "var(--text-main)", lineHeight: 1.5 }}>
              🌱 {decision.soilNote}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
              * {language === "mr" ? "फक्त प्रत्यक्ष उपलब्ध माती गुणधर्मांनुसार शिफारस दर्शवली आहे." : "Only displaying soil properties available in baseline hydrogeological database."}
            </div>
          </div>
        </div>
      </div>

      {/* 5. PROMINENT COMBINED WATER & SOIL DECISION CARD (SECTION 6 & 18) */}
      <div
        className="card"
        style={{
          padding: 26,
          marginBottom: 28,
          border: "2px solid var(--primary-500)",
          boxShadow: "var(--shadow-lg)",
          background: "var(--surface-card)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--primary-700)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div className="section-label" style={{ fontSize: 11 }}>
              {language === "mr" ? "एआय निर्णय इंजिन" : "KISAN SETU CONVERGED DECISION"}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
              💧 {language === "mr" ? "पाणी व माती निर्णय" : "Water & Soil Decision"}
            </h3>
          </div>
        </div>

        {/* Inputs Multi-Signal Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 10,
            padding: 14,
            background: "var(--surface-muted)",
            borderRadius: "var(--radius-md)",
            marginBottom: 20
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-main)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 11, display: "block" }}>GROUNDWATER</span>
            <strong>{decision.measuredOrEstimatedDepth}</strong> ({decision.referenceDepthRange})
          </div>
          <div style={{ fontSize: 12, color: "var(--text-main)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 11, display: "block" }}>SOIL TYPE</span>
            <strong>{decision.soilTypeLabel}</strong>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-main)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 11, display: "block" }}>LOCATION REACH</span>
            <strong>{decision.distanceKm.toFixed(1)} km</strong>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-main)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 11, display: "block" }}>CROP</span>
            <strong>{cropName}</strong>
          </div>
        </div>

        {/* WHAT THIS MEANS Section */}
        <div style={{ marginBottom: 18 }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            {language === "mr" ? "याचा अर्थ काय?" : "WHAT THIS MEANS"}
          </h4>
          <div style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-main)", fontWeight: 600 }}>
            {decision.interpretationText}
          </div>
        </div>

        {/* RECOMMENDED ACTION Section */}
        <div
          style={{
            background: "var(--primary-50)",
            border: "1px solid var(--primary-500)",
            padding: 18,
            borderRadius: "var(--radius-md)",
            marginBottom: 20
          }}
        >
          <h4 style={{ fontSize: 13, fontWeight: 800, color: "var(--primary-700)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px 0" }}>
            {language === "mr" ? "शिफारस केलेली कृती" : "RECOMMENDED ACTION"}
          </h4>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--primary-900)", lineHeight: 1.5 }}>
            "{decision.recommendedAction}"
          </div>

          {/* Action CTAs */}
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {onNavigateTab && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onNavigateTab("advisory")}
                style={{ fontSize: 13, fontWeight: 700, padding: "8px 16px" }}
              >
                {decision.ctaLabel}
              </button>
            )}

            {decision.hasGovernmentSupport && onNavigateTab && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => onNavigateTab("schemes")}
                style={{ fontSize: 13, fontWeight: 700, padding: "8px 16px" }}
              >
                🏛 {language === "mr" ? "सिंचन योजना पहा →" : "View Irrigation Schemes →"}
              </button>
            )}
          </div>
        </div>

        {/* DEDICATED RECOMMENDED GOVERNMENT SCHEME CARD FOR > 10 KM (PMKSY - PER DROP MORE CROP) */}
        {decision.hasGovernmentSupport && (
          <div
            style={{
              padding: 22,
              background: "var(--surface-card)",
              border: "2px solid var(--ai-blue)",
              borderRadius: "var(--radius-md)",
              marginBottom: 20,
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <span
                style={{
                  background: "rgba(0, 119, 182, 0.12)",
                  color: "var(--ai-blue)",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.04em"
                }}
              >
                🏛 RECOMMENDED SCHEME FOR DEEP GROUNDWATER (&gt; 10 KM)
              </span>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>
                Department: Agriculture Department
              </span>
            </div>

            <h4 style={{ fontSize: 19, fontWeight: 800, color: "var(--text-main)", margin: "0 0 14px 0", borderBottom: "2px solid var(--ai-blue)", paddingBottom: 8 }}>
              Pradhan Mantri Krishi Sinchayee Yojana - Per Drop More Crop (Micro-irrigation Component)
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
                  {language === "mr" ? "योजनेबद्दल / Overview" : "Overview"}
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--text-main)", margin: 0 }}>
                  The major objective of PMKSY is to achieve convergence of investments in irrigation at the field level, expand cultivable area under assured irrigation, improve on-farm water use efficiency to reduce wastage of water, enhance the adoption of precision-irrigation and other water saving technologies (More crop per drop), enhance recharge of aquifers.
                </p>
              </div>

              <div
                style={{
                  padding: 14,
                  background: "var(--surface-muted)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
                  Related Documents
                </div>
                <a
                  href="https://pmksy.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12.5, color: "var(--primary-700)", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
                >
                  📄 Government Resolution ↗
                </a>
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {onNavigateTab && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onNavigateTab("schemes")}
                  style={{ fontSize: 13, fontWeight: 700, padding: "8px 18px" }}
                >
                  {language === "mr" ? "शासकीय योजनांमध्ये अर्ज करा / माहिती पहा →" : "View Scheme Details & Apply →"}
                </button>
              )}
              <a
                href="https://pmksy.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-sm"
                style={{ fontSize: 12, padding: "6px 14px" }}
              >
                Official Portal (pmksy.gov.in) ↗
              </a>
            </div>
          </div>
        )}

        {/* WHY THIS RECOMMENDATION ACCORDION (SECTION 17) */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 14 }}>
          <button
            type="button"
            className="accordion-toggle-btn"
            onClick={() => setShowWhyReasoning(!showWhyReasoning)}
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--primary-700)", fontWeight: 700, fontSize: 13 }}
          >
            <HelpCircle size={16} />
            <span>{language === "mr" ? "आम्ही ही शिफारस का करत आहोत? (कारण पहा)" : "Why this recommendation? (DATA ➔ REASONING ➔ ACTION)"}</span>
            {showWhyReasoning ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showWhyReasoning && (
            <div
              style={{
                marginTop: 12,
                padding: 16,
                background: "var(--surface-bg)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                fontSize: 13,
                lineHeight: 1.6
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--text-main)" }}>
                {language === "mr" ? "एआय निर्णय विश्लेषण:" : "Multi-Signal Decision Reasoning Matrix:"}
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-main)" }}>
                <li><strong>Location:</strong> {decision.reasoning.locationInfo}</li>
                <li><strong>Distance:</strong> {decision.reasoning.distanceInfo}</li>
                <li><strong>Groundwater:</strong> {decision.reasoning.groundwaterInfo}</li>
                <li><strong>Soil Profile:</strong> {decision.reasoning.soilInfo}</li>
                <li><strong>Weather Outlook:</strong> {decision.reasoning.weatherInfo}</li>
                <li><strong>Crop Needs:</strong> {decision.reasoning.cropInfo}</li>
              </ul>
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px dashed var(--border-strong)", color: "var(--primary-700)", fontWeight: 700 }}>
                ➔ {language === "mr" ? "निष्कर्ष:" : "Kisan Setu Final Recommendation:"} "{decision.reasoning.summaryDecision}"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. CGWB BLOCK BASELINE & CROP BENCHMARKS TABLES (PRESERVED DATA) */}
      <div className="card">
        <div className="section-label">{t("cgwb_baseline_label")}</div>
        <h3 className="section-title">{t("block_baseline_title")}</h3>

        <div className="grid-3" style={{ marginTop: 16 }}>
          <div className="readout">
            <div className="readout-value">{kopargaonProfile.irrigationSharePct}%</div>
            <div className="readout-label">{t("cropped_area_irrigation")}</div>
          </div>
          <div className="readout">
            <div className="readout-value">{kopargaonProfile.irrigationSourceSplit.wellOrLiftPct}%</div>
            <div className="readout-label">{t("irrigation_wells")}</div>
          </div>
          <div className="readout">
            <div className="readout-value">{kopargaonProfile.irrigationSourceSplit.canalPct}%</div>
            <div className="readout-label">{t("irrigation_canal")}</div>
          </div>
        </div>

        <h4 style={{ marginTop: 24, marginBottom: 12, fontSize: 16 }}>{t("soil_composition_title")}</h4>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("col_soil_type")}</th>
                <th>{t("col_coverage_share")}</th>
                <th>{t("col_agronomic_char")}</th>
              </tr>
            </thead>
            <tbody>
              {kopargaonProfile.soilComposition.map((s) => {
                const typeText =
                  s.type === "Coarse shallow"
                    ? t("coarse_shallow")
                    : s.type === "Medium black"
                    ? t("medium_black")
                    : s.type === "Deep black (cotton soil)"
                    ? t("deep_black")
                    : t("reddish");
                const noteText =
                  s.sharePct === 38 || s.sharePct === 41
                    ? t("soil_note_1")
                    : s.sharePct === 13
                    ? t("soil_note_2")
                    : t("soil_note_3");

                return (
                  <tr key={s.type}>
                    <td style={{ fontWeight: 600 }}>{typeText}</td>
                    <td className="mono">{s.sharePct}%</td>
                    <td>{noteText}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h4 style={{ marginTop: 24, marginBottom: 12, fontSize: 16 }}>{t("crop_benchmarks_title")}</h4>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("col_crop")}</th>
                <th>{t("col_current_yield")}</th>
                <th>{t("col_potential_yield")}</th>
                <th>{t("col_yield_gap")}</th>
                <th>{t("col_key_intervention")}</th>
              </tr>
            </thead>
            <tbody>
              {cropBenchmarks.map((b) => {
                const cropLabel = b.crop === "Sugarcane" ? t("crop_sugarcane") : b.crop === "Onion" ? t("crop_onion") : t("crop_cotton");
                const intervLabel =
                  b.crop === "Sugarcane" ? t("interv_sugarcane") : b.crop === "Onion" ? t("interv_onion") : t("interv_cotton");

                return (
                  <tr key={b.crop}>
                    <td style={{ fontWeight: 600 }}>{cropLabel}</td>
                    <td className="mono">{b.existingTPerHa}</td>
                    <td className="mono">{b.potentialTPerHa}</td>
                    <td className="mono">+{b.gapTPerHa}</td>
                    <td>{intervLabel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
