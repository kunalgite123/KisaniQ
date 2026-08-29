import { useEffect, useState } from "react";
import { fetchKopargaonWeather, assessClimateRisk, WeatherSnapshot, ClimateRisk } from "../lib/weather";
import { kopargaonProfile } from "../data/groundSoil";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";
import AdvisoryCard from "./AdvisoryCard";
import FarmHealthScore from "./FarmHealthScore";

interface Props {
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  onNavigateTab?: (tab: string) => void;
}

export default function Dashboard({ village, detectedDisease, cropName, onNavigateTab }: Props) {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [risk, setRisk] = useState<ClimateRisk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchKopargaonWeather()
      .then((snap) => {
        if (cancelled) return;
        setWeather(snap);
        setRisk(assessClimateRisk(snap));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message ?? "Could not reach weather service");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* 1. Farm Health Greeting Banner */}
      <FarmHealthScore
        climateRisk={risk}
        village={village}
        detectedDisease={detectedDisease}
        cropName={cropName}
      />

      {/* 2. Flagship ONE DOMINANT CARD: Today's Farm Decision */}
      <div style={{ marginTop: 20 }}>
        <AdvisoryCard
          climateRisk={risk}
          village={village}
          detectedDisease={detectedDisease}
          cropName={cropName}
          onViewDetails={onNavigateTab ? () => onNavigateTab("advisory") : undefined}
        />
      </div>

      {/* 3. Balanced Grid for Climate, Water & Crop Intelligence */}
      <div className="grid-2" style={{ marginTop: 20 }}>
        {/* Climate Intelligence */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="section-label">Climate Intelligence</span>
              <h3 className="section-title">Weather &amp; Dry-Spell Risk</h3>
            </div>
            {onNavigateTab && (
              <button
                className="accordion-toggle-btn"
                onClick={() => onNavigateTab("climate")}
              >
                View 7-day forecast →
              </button>
            )}
          </div>

          {loading && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Fetching satellite forecast…</p>}
          {error && <p style={{ color: "var(--alert-red)", fontSize: 13 }}>{error}</p>}

          {weather && risk && (
            <div>
              <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 32, fontWeight: 700 }}>
                  {Math.round(weather.days[0]?.tempMaxC ?? 32)}°C
                </span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Rain chance: {Math.round(weather.days[0]?.precipitationProbabilityPct ?? 0)}%
                </span>
              </div>

              <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                {risk.headline}
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <span className={`badge badge-${risk.level === "high" ? "urgent" : risk.level === "moderate" ? "watch" : "healthy"}`}>
                  {risk.dryDaysAhead}/7 Dry Days
                </span>
                <span className="badge badge-healthy">
                  {risk.heatStressDays} Heat Stress Days
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Crop Diagnostic Intelligence */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="section-label">Crop Intelligence</span>
              <h3 className="section-title">Pest &amp; Disease Diagnostics</h3>
            </div>
            {onNavigateTab && (
              <button
                className="accordion-toggle-btn"
                onClick={() => onNavigateTab("crop")}
              >
                Open Crop Doctor →
              </button>
            )}
          </div>

          {detectedDisease && cropName ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: "var(--text-main)" }}>
                  {cropName}: {detectedDisease.displayName}
                </span>
                <span className={`badge badge-${detectedDisease.severity}`}>
                  {detectedDisease.severity}
                </span>
              </div>
              <p style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                {detectedDisease.advisory}
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
                No active disease detected. Scan a leaf sample using the edge AI neural network to detect early stress.
              </p>
              {onNavigateTab && (
                <button
                  className="btn btn-outline"
                  onClick={() => onNavigateTab("crop")}
                  style={{ marginTop: 14, padding: "6px 16px", fontSize: 12.5 }}
                >
                  📷 Scan Leaf Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Water & Soil Intelligence Row */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div>
            <span className="section-label">Resource Health</span>
            <h3 className="section-title">Groundwater &amp; Soil Status</h3>
          </div>
          {onNavigateTab && (
            <button
              className="accordion-toggle-btn"
              onClick={() => onNavigateTab("water")}
            >
              View soil analysis →
            </button>
          )}
        </div>

        <div className="grid-3">
          <div className="readout">
            <div className="readout-label">Primary Water Source</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>
              {village ? village.waterSourceType.replace("_", " ").toUpperCase() : "TALUKA BASELINE"}
            </div>
            <div className="readout-label" style={{ marginTop: 8 }}>
              Status: <strong>↘ Semi-Critical</strong>
            </div>
          </div>

          <div className="readout">
            <div className="readout-label">Distance to Godavari River</div>
            <div className="readout-value" style={{ fontSize: 24, marginTop: 4 }}>
              {village ? `${village.distanceToGodavariKm.toFixed(1)} km` : "Centre"}
            </div>
            <div className="readout-label" style={{ marginTop: 8 }}>
              {village?.proposedRecharge ? "Recharge Site" : "Standard Monitoring"}
            </div>
          </div>

          <div className="readout">
            <div className="readout-label">Dominant Soil Type</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>
              Medium Black / Coarse
            </div>
            <div className="readout-label" style={{ marginTop: 8 }}>
              Annual Rainfall: {kopargaonProfile.normalRainfallMm} mm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
