import { useState } from "react";
import { ClimateRisk } from "../lib/weather";
import { Village, waterSourceLabel } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import { useLanguage } from "../context/LanguageContext";
import PageHeader from "./PageHeader";
import {
  CloudSun,
  Droplets,
  Sprout,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  Search,
  ChevronDown,
  ChevronUp,
  Tractor,
  FileText
} from "lucide-react";

interface Props {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  onNavigateTab?: (tab: string) => void;
}

export interface DetailedActionItem {
  id: string;
  bucket: "URGENT" | "DO_TODAY" | "WATCH" | "PLAN_AHEAD";
  category: "Climate & Weather" | "Water & Irrigation" | "Crop Health" | "Soil Health" | "Farm Services";
  what: string;
  why: string;
  when: string;
  evidence: string[];
  ctaLabel: string;
  ctaTab: string;
  isDone?: boolean;
}

export default function AdvisoryPage({ climateRisk, village, detectedDisease, cropName, onNavigateTab }: Props) {
  const { t } = useLanguage();
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [expandedWhy, setExpandedWhy] = useState<Record<string, boolean>>({});

  const actions: DetailedActionItem[] = [];

  // 1. Crop Health Diagnostic Advisory
  if (detectedDisease && cropName) {
    const isUrgent = detectedDisease.severity === "urgent";
    actions.push({
      id: "action_crop",
      bucket: isUrgent ? "URGENT" : "DO_TODAY",
      category: "Crop Health",
      what: `Inspect and treat ${cropName} for ${detectedDisease.displayName}.`,
      why: detectedDisease.advisory,
      when: isUrgent ? "Within 24 hours" : "This week",
      evidence: [
        `Disease: ${detectedDisease.displayName}`,
        `Crop: ${cropName}`,
        `Severity: ${detectedDisease.severity.toUpperCase()}`
      ],
      ctaLabel: "Open Crop Doctor Diagnosis →",
      ctaTab: "crop"
    });
  } else {
    actions.push({
      id: "action_crop_scout",
      bucket: "WATCH",
      category: "Crop Health",
      what: "Scan leaf samples to check for early pest and disease stress.",
      why: "No active disease currently detected. Regular scouting prevents crop loss.",
      when: "Every 7 days",
      evidence: ["Crop Doctor Edge Neural Network", "No active disease detected"],
      ctaLabel: "Open Crop Doctor Scanner →",
      ctaTab: "crop"
    });
  }

  // 2. Water & Irrigation Advisory
  if (village) {
    const isGroundwater = village.waterSourceType === "groundwater_only";
    actions.push({
      id: "action_water",
      bucket: isGroundwater ? "DO_TODAY" : "WATCH",
      category: "Water & Irrigation",
      what: isGroundwater
        ? "Check field soil moisture before the next irrigation cycle."
        : "Verify local canal release schedule before pumping borewell.",
      why: isGroundwater
        ? `${village.name} is well-dependent in a Semi-Critical groundwater zone (~0.41m/yr drop).`
        : `${village.name} is located within the Godavari canal command area.`,
      when: "Before next irrigation",
      evidence: [
        `Village: ${village.name}`,
        `Water Source: ${waterSourceLabel[village.waterSourceType]}`,
        `Distance to Godavari: ${village.distanceToGodavariKm.toFixed(1)} km`
      ],
      ctaLabel: "Open Water & Soil Details →",
      ctaTab: "water"
    });
  } else {
    actions.push({
      id: "action_water_default",
      bucket: "DO_TODAY",
      category: "Water & Irrigation",
      what: "Check soil moisture in the root zone before irrigating.",
      why: "Avoid over-irrigation during dry spells to protect root systems.",
      when: "Before next watering",
      evidence: ["Kopargaon Groundwater Baseline: Semi-Critical"],
      ctaLabel: "Open Water & Soil Details →",
      ctaTab: "water"
    });
  }

  // 3. Climate & Weather Defense Advisory
  if (climateRisk) {
    const isHighRisk = climateRisk.level === "high";
    actions.push({
      id: "action_climate",
      bucket: isHighRisk ? "DO_TODAY" : "WATCH",
      category: "Climate & Weather",
      what: isHighRisk
        ? "Prepare for 5+ consecutive dry days. Schedule drip irrigation for early morning."
        : "Plan field operations around tomorrow's expected dry window.",
      why: climateRisk.headline,
      when: isHighRisk ? "Next 48 Hours" : "This Week",
      evidence: [
        `Forecast: ${climateRisk.dryDaysAhead}/7 dry days (<1mm)`,
        `Heat Stress: ${climateRisk.heatStressDays} days`,
        `Risk Level: ${climateRisk.level.toUpperCase()}`
      ],
      ctaLabel: "View 7-Day Climate Forecast →",
      ctaTab: "climate"
    });
  }

  // 4. Farm Services & Machinery Recommendation
  actions.push({
    id: "action_machinery",
    bucket: "PLAN_AHEAD",
    category: "Farm Services",
    what: "Check available boom sprayers and tractors near Kopargaon.",
    why: "Dry weather window provides ideal conditions for foliar sprays and rotavator operations.",
    when: "Next 3–5 Days",
    evidence: ["Weather: Suitable dry window", "Marketplace: 12 nearby providers within 10 km"],
    ctaLabel: "Find Nearby Farm Services →",
    ctaTab: "machinery"
  });

  // Calculate dynamic active action count
  const activeAttentionCount = actions.filter((a) => a.bucket === "URGENT" || a.bucket === "DO_TODAY").length;
  const topAction = actions.find((a) => a.bucket === "URGENT") || actions.find((a) => a.bucket === "DO_TODAY") || actions[0];

  function toggleDone(id: string) {
    setCompletedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleWhy(id: string) {
    setExpandedWhy((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      {/* 1. Page Header */}
      <PageHeader
        title="Today's Farm Advisory"
        subtitle="Clear, practical actions based on your farm's weather, soil, water and crop conditions."
      />

      {/* 2. Top Summary: TODAY'S FARM STATUS BAR */}
      <div
        className="card"
        style={{
          padding: 20,
          marginBottom: 20,
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="section-label" style={{ fontSize: 10 }}>TODAY'S FARM STATUS</span>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
              📍 {village ? village.name : "Kopargaon"}, Maharashtra
            </h3>
          </div>

          <span className="badge badge-warning" style={{ fontSize: 12, padding: "6px 14px", fontWeight: 700 }}>
            ⚡ {activeAttentionCount} actions need your attention today
          </span>
        </div>

        {/* 4 Status Metrics Pills */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
          <div style={{ background: "var(--surface-bg)", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <CloudSun size={14} style={{ color: "var(--primary-700)" }} />
              Climate Status
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
              {climateRisk ? (climateRisk.level === "high" ? "Critical Dry" : "Moderate") : "Stable"}
            </div>
          </div>

          <div style={{ background: "var(--surface-bg)", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <Layers size={14} style={{ color: "var(--primary-700)" }} />
              Soil Health
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
              Medium Black / Murrum
            </div>
          </div>

          <div style={{ background: "var(--surface-bg)", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <Droplets size={14} style={{ color: "var(--primary-700)" }} />
              Groundwater
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-urgent)", marginTop: 4 }}>
              ↘ Semi-Critical Zone
            </div>
          </div>

          <div style={{ background: "var(--surface-bg)", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <Sprout size={14} style={{ color: "var(--primary-700)" }} />
              Crop Health
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
              {detectedDisease ? `${cropName}: ${detectedDisease.displayName}` : "Scouted & Healthy"}
            </div>
          </div>
        </div>
      </div>

      {/* 3. HERO CARD: "WHAT SHOULD I DO NOW?" */}
      {topAction && (
        <div
          style={{
            background: "rgba(21, 128, 61, 0.08)",
            border: "1.5px solid rgba(21, 128, 61, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: 22,
            marginBottom: 24
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "var(--primary-900)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              # WHAT SHOULD I DO NOW?
            </span>
            <span className="badge badge-healthy" style={{ fontSize: 11 }}>
              Highest Priority Action
            </span>
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", margin: 0, marginTop: 4 }}>
            💧 {topAction.what}
          </h3>

          <div style={{ marginTop: 8, fontSize: 13.5, color: "var(--text-main)", lineHeight: 1.5 }}>
            <strong>Why:</strong> {topAction.why}
          </div>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
              ⏱️ Timeframe: <strong>{topAction.when}</strong>
            </span>

            {onNavigateTab && (
              <button
                className="btn-primary"
                onClick={() => onNavigateTab(topAction.ctaTab)}
                style={{ fontSize: 13, padding: "8px 18px" }}
              >
                {topAction.ctaLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. PRIORITIZED ACTION TIMELINE */}
      <div className="card" style={{ padding: 22, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <span className="section-label" style={{ fontSize: 10 }}>DAILY DECISION BOARD</span>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
              Action Plan by Urgency &amp; Timeframe
            </h3>
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {actions.length} Total Recommendations
          </span>
        </div>

        {/* Action Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {actions.map((item) => {
            const isDone = !!completedMap[item.id];
            const isWhyOpen = !!expandedWhy[item.id];

            const bucketBadge =
              item.bucket === "URGENT"
                ? "badge-urgent"
                : item.bucket === "DO_TODAY"
                ? "badge-healthy"
                : item.bucket === "WATCH"
                ? "badge-watch"
                : "badge-muted";

            const bucketText =
              item.bucket === "URGENT"
                ? "🔴 URGENT"
                : item.bucket === "DO_TODAY"
                ? "🟢 DO TODAY"
                : item.bucket === "WATCH"
                ? "🟠 WATCH THIS WEEK"
                : "🔵 PLAN AHEAD";

            return (
              <div
                key={item.id}
                style={{
                  background: isDone ? "var(--surface-bg)" : "var(--surface-card)",
                  border: isDone ? "1px solid var(--border-subtle)" : "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: 18,
                  opacity: isDone ? 0.6 : 1,
                  transition: "all 0.2s ease"
                }}
              >
                {/* Header Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className={`badge ${bucketBadge}`} style={{ fontSize: 11, padding: "3px 10px", fontWeight: 700 }}>
                      {bucketText}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-800)", textTransform: "uppercase" }}>
                      {item.category}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>⏱️ {item.when}</span>
                    <button
                      onClick={() => toggleDone(item.id)}
                      style={{
                        border: "1px solid var(--border-subtle)",
                        background: isDone ? "var(--primary-700)" : "transparent",
                        color: isDone ? "#ffffff" : "var(--text-main)",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {isDone ? "✓ Completed Today" : "Mark as Done"}
                    </button>
                  </div>
                </div>

                {/* WHAT */}
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", margin: 0, textDecoration: isDone ? "line-through" : "none" }}>
                  {item.what}
                </h4>

                {/* WHY */}
                <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  <strong>Why:</strong> {item.why}
                </div>

                {/* Evidence & Action CTAs Row */}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <button
                    onClick={() => toggleWhy(item.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "var(--primary-800)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <Search size={13} />
                    <span>Why am I seeing this?</span>
                    {isWhyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {onNavigateTab && (
                    <button
                      className="btn-outline-sm"
                      onClick={() => onNavigateTab(item.ctaTab)}
                      style={{ fontSize: 12 }}
                    >
                      {item.ctaLabel}
                    </button>
                  )}
                </div>

                {/* Expandable Evidence Details */}
                {isWhyOpen && (
                  <div style={{ marginTop: 10, background: "var(--surface-bg)", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", fontSize: 12, color: "var(--text-muted)" }}>
                    <strong style={{ color: "var(--text-main)" }}>Data Signals &amp; Evidence:</strong>
                    <ul style={{ margin: 0, marginTop: 4, paddingLeft: 18 }}>
                      {item.evidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
