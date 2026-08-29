import { WeatherSnapshot, ClimateRisk } from "../lib/weather";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { useLanguage } from "../context/LanguageContext";
import PageHeader from "./PageHeader";
import { FarmerProfile } from "../data/farmerProfile";
import { FarmerDecision, generateFarmerDecision } from "../lib/farmerDecisionEngine";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  weather?: WeatherSnapshot | null;
  farmerProfile?: FarmerProfile | null;
  decision?: FarmerDecision | null;
}

interface ActionItem {
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: string;
  recommendation: string;
  reason: string;
  timeframe: string;
  confidencePct: number;
}

import AdviceSectionCard from "./AdviceSectionCard";

export default function AdvisoryPage({
  climateRisk,
  village,
  detectedDisease,
  cropName,
  weather,
  farmerProfile,
  decision: propDecision
}: Props) {
  const { t, language } = useLanguage();

  const decision = propDecision || generateFarmerDecision({
    farmerProfile,
    village,
    weather,
    climateRisk,
    cropName,
    detectedDisease,
    lang: language as any
  });

  const isMr = language === "mr";

  const actions: (ActionItem & { id: string })[] = [];

  // Primary Action Item from Decision Engine
  actions.push({
    id: "primary_decision",
    priority: decision.urgency === "urgent" ? "HIGH" : decision.urgency === "watch" ? "MEDIUM" : "LOW",
    category: `⚡ ${isMr ? "प्राधान्य शेती निर्णय" : "PRIMARY FARM DECISION"}`,
    recommendation: decision.primaryAction,
    reason: decision.summary,
    avoid: decision.avoidAction,
    timeframe: decision.timing,
    confidencePct: decision.confidencePct
  });

  // Rain & Irrigation Decision Item
  actions.push({
    id: "irrigation_decision",
    priority: decision.irrigation.waterSavingMode ? "HIGH" : "MEDIUM",
    category: `💧 ${t("water_management_cat")} ${decision.irrigation.waterSavingMode ? "(Water-Saving Mode)" : ""}`,
    recommendation: decision.irrigation.action,
    reason: decision.irrigation.reason,
    avoid: decision.irrigation.avoid,
    timeframe: decision.irrigation.interval,
    confidencePct: 88
  });

  // Crop Doctor / Health Item
  if (detectedDisease && cropName) {
    actions.push({
      id: "crop_disease_diagnostic",
      priority: detectedDisease.severity === "urgent" ? "HIGH" : "MEDIUM",
      category: "🐛 Crop Health & Pest Diagnostic",
      recommendation: `Apply targeted treatment for ${detectedDisease.displayName} on ${cropName}.`,
      reason: detectedDisease.advisory,
      avoid: "Delaying treatment or applying unverified chemicals",
      timeframe: t("timeframe_24h"),
      confidencePct: 92
    });
  } else {
    actions.push({
      id: "pest_weather_defense",
      priority: "LOW",
      category: "🐛 Pest & Disease Weather Defense",
      recommendation: decision.pestRisk.action,
      reason: decision.pestRisk.reason,
      avoid: decision.pestRisk.avoid,
      timeframe: "Next 48 Hours",
      confidencePct: 85
    });
  }

  // Weather Risk Item
  if (climateRisk) {
    actions.push({
      id: "climate_weather_defense",
      priority: climateRisk.level === "high" ? "HIGH" : climateRisk.level === "moderate" ? "MEDIUM" : "LOW",
      category: "🌦️ Climate & Weather Defense",
      recommendation: climateRisk.dryDaysAhead >= 5
        ? (isMr ? "५+ कोरड्या दिवसांसाठी सिंचन नियोजन करा. पहाटे पाणी द्या." : "Prepare for 5+ dry days ahead. Irrigate during early morning hours.")
        : (isMr ? "२४-४८ तासांत पावसाचा अंदाज. औषध फवारणी पुढे ढकला." : "Rain expected within 48 hours. Postpone heavy foliar sprays."),
      reason: climateRisk.headline,
      avoid: climateRisk.dryDaysAhead >= 5 ? "Delaying irrigation setup before dry spell" : "Heavy foliar spray on rain days",
      timeframe: "Next 7 Days",
      confidencePct: 87
    });
  }

  return (
    <div>
      <PageHeader
        title={t("title_advisory")}
        subtitle={t("advisory_subtitle_detailed")}
      />

      {/* 1. Categorized Action Items Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <span className="section-label">{t("action_schedule_label")}</span>
            <h3 className="section-title">{t("categorized_action_items")}</h3>
          </div>
          <span className="badge badge-healthy">🎯 {decision.confidencePct}% {t("confidence")}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {actions.map((item) => (
            <AdviceSectionCard
              key={item.id}
              id={item.id}
              category={item.category}
              title={item.recommendation}
              recommendation={item.recommendation}
              reason={item.reason}
              avoid={item.avoid}
              timeframe={item.timeframe}
              urgency={item.priority}
              confidencePct={item.confidencePct}
            />
          ))}
        </div>
      </div>

      {/* 2. Next 72 Hours Decision Timeline Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <span className="section-label">{isMr ? "⏱️ कृती वेळरेषा" : "⏱️ ACTION TIMELINE"}</span>
            <h3 className="section-title">{isMr ? "पुढील ७२ तासांची निर्णय वेळरेषा" : "Next 72 Hours Decision Timeline"}</h3>
          </div>
          <span className="badge badge-watch">{isMr ? "४-टप्पे अंदाज" : "4-Stage Forecast"}</span>
        </div>

        <div className="grid-2" style={{ gap: 16, marginTop: 16 }}>
          {[
            decision.timeline.now,
            decision.timeline.next24h,
            decision.timeline.next48h,
            decision.timeline.next72h
          ].map((slot, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--surface-bg)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: 16
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--primary-600)", fontFamily: "var(--font-mono)" }}>
                  {slot.period}
                </span>
                <span className="badge badge-muted" style={{ fontSize: 10 }}>{slot.risk}</span>
              </div>
              <h5 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                {slot.action}
              </h5>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.4 }}>
                <strong>{isMr ? "कारण:" : "Reason:"}</strong> {slot.reason}
              </p>
              <div style={{ fontSize: 11.5, color: "var(--alert-red)", marginTop: 6, fontWeight: 600 }}>
                ⚠ {isMr ? "काय टाळावे:" : "Avoid:"} {slot.avoid}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Decision Reasoning & Data Sources Transparency Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="section-label">{isMr ? "🧠 स्पष्टीकरणात्मक एआय तर्क" : "🧠 EXPLAINABLE AI LOGIC"}</span>
            <h3 className="section-title">{isMr ? "मला हा सल्ला का मिळत आहे?" : "Why Am I Getting This Advice?"}</h3>
          </div>
          <span className="badge badge-healthy">{isMr ? "पारदर्शक निर्णय पद्धती" : "Transparent Intelligence"}</span>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ background: "var(--surface-muted)", padding: 16, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", marginBottom: 16 }}>
            <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)", marginBottom: 10 }}>
              {isMr ? "निर्णयाचे मुख्य घटक:" : "Convergence Factors Breakdown:"}
            </h5>
            <ul style={{ paddingLeft: 20, fontSize: 13, color: "var(--text-main)", lineHeight: 1.6 }}>
              {decision.reasons.map((r, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <strong>{r.factor}:</strong> {r.detail} → <em>{r.impact}</em>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: "var(--surface-bg)", padding: 16, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>
              {isMr ? "वापरलेले माहिती स्त्रोत:" : "Active Data Sources:"}
            </h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {decision.dataSources.map((ds, i) => (
                <span key={i} className="badge badge-muted" style={{ fontSize: 11.5 }}>
                  {ds}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
