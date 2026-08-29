import { ClimateRisk } from "../lib/weather";
import { Village, waterSourceLabel } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { useLanguage } from "../context/LanguageContext";
import PageHeader from "./PageHeader";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
}

interface ActionItem {
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: string;
  recommendation: string;
  reason: string;
  timeframe: string;
  confidencePct: number;
}

export default function AdvisoryPage({ climateRisk, village, detectedDisease, cropName }: Props) {
  const { t } = useLanguage();
  const actions: ActionItem[] = [];

  if (detectedDisease && cropName) {
    actions.push({
      priority: detectedDisease.severity === "urgent" ? "HIGH" : "MEDIUM",
      category: "🐛 Crop Health & Pest Diagnostic",
      recommendation: `Apply targeted treatment for ${detectedDisease.displayName} on ${cropName}.`,
      reason: detectedDisease.advisory,
      timeframe: t("timeframe_24h"),
      confidencePct: 92
    });
  }

  if (village) {
    actions.push({
      priority: village.waterSourceType === "groundwater_only" ? "HIGH" : "MEDIUM",
      category: `💧 ${t("water_management_cat")}`,
      recommendation: village.waterSourceType === "groundwater_only"
        ? `Optimize micro-irrigation slots in ${village.name}. Avoid drilling deep borewells beyond 60m.`
        : `Utilize canal water release schedules for ${village.name} before borewell pumping.`,
      reason: `${village.name} is ${village.distanceToGodavariKm.toFixed(1)} km from Godavari river (${waterSourceLabel[village.waterSourceType]}).`,
      timeframe: t("timeframe_24h"),
      confidencePct: 88
    });
  } else {
    actions.push({
      priority: "LOW",
      category: `💧 ${t("water_management_cat")}`,
      recommendation: t("water_rec_1"),
      reason: t("water_why_1"),
      timeframe: t("timeframe_seasonal"),
      confidencePct: 80
    });
  }

  if (climateRisk) {
    actions.push({
      priority: climateRisk.level === "high" ? "HIGH" : climateRisk.level === "moderate" ? "MEDIUM" : "LOW",
      category: "🌦️ Climate & Weather Defense",
      recommendation: climateRisk.dryDaysAhead >= 5
        ? "Prepare for 5+ dry days ahead. Irrigate during early morning hours."
        : "Rain expected within 48 hours. Postpone heavy foliar sprays.",
      reason: climateRisk.headline,
      timeframe: "Next 7 Days",
      confidencePct: 87
    });
  }

  actions.push({
    priority: "LOW",
    category: `🌱 ${t("soil_practices_cat")}`,
    recommendation: t("soil_rec_1"),
    reason: t("soil_why_1"),
    timeframe: t("timeframe_weekly"),
    confidencePct: 85
  });

  return (
    <div>
      <PageHeader
        title={t("title_advisory")}
        subtitle={t("advisory_subtitle_detailed")}
      />

      <div className="card">
        <div className="card-header">
          <div>
            <span className="section-label">{t("action_schedule_label")}</span>
            <h3 className="section-title">{t("categorized_action_items")}</h3>
          </div>
          <span className="badge badge-healthy">{t("active_recommendations_count")}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          {actions.map((item, idx) => {
            const prioLabel =
              item.priority === "HIGH" ? t("high_priority_tag") : item.priority === "MEDIUM" ? t("medium_priority_tag") : t("low_priority_tag");
            return (
              <div
                key={idx}
                style={{
                  background: "var(--surface-muted)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={`badge ${item.priority === "HIGH" ? "badge-urgent" : item.priority === "MEDIUM" ? "badge-watch" : "badge-healthy"}`}>
                      {prioLabel}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>{item.category}</span>
                  </div>

                  <div style={{ display: "flex", gap: 12, fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                    <span>⏳ {item.timeframe}</span>
                    <span>🎯 {t("confidence")}: {item.confidencePct}%</span>
                  </div>
                </div>

                <h4 style={{ marginTop: 10, fontSize: 17, color: "var(--text-main)" }}>{item.recommendation}</h4>
                <p style={{ marginTop: 6, fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  <strong>Why?</strong> {item.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
