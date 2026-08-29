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
}

export default function Dashboard({ village, detectedDisease, cropName }: Props) {
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
      {/* High-Level Farm Status Banner */}
      <FarmHealthScore
        climateRisk={risk}
        village={village}
        detectedDisease={detectedDisease}
        cropName={cropName}
      />

      <div style={{ marginTop: 20 }}>
        {/* Core Flagship AI Convergence Engine Card */}
        <AdvisoryCard
          climateRisk={risk}
          village={village}
          detectedDisease={detectedDisease}
          cropName={cropName}
        />
      </div>

      {/* Climate & Weather Quick Summary Card */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div>
            <span className="section-label">7-Day Climate Risk Outlook · Open-Meteo Satellite Feed</span>
            <h3 className="section-title">Weather &amp; Dry-Spell Intelligence</h3>
          </div>
          {risk && (
            <span className={`badge badge-${risk.level === "high" ? "urgent" : risk.level === "moderate" ? "watch" : "healthy"}`}>
              {risk.level.toUpperCase()} CLIMATE RISK
            </span>
          )}
        </div>

        {loading && <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Fetching satellite forecast…</p>}
        {error && <p style={{ color: "var(--alert-red)", marginTop: 8 }}>{error}</p>}

        {weather && risk && (
          <div className="grid-3" style={{ marginTop: 14 }}>
            <div className="readout">
              <div className="readout-value">{risk.dryDaysAhead} / 7</div>
              <div className="readout-label">Days forecast with &lt;1mm rainfall</div>
            </div>
            <div className="readout">
              <div className="readout-value">{risk.heatStressDays}</div>
              <div className="readout-label">Days forecast &gt;38°C (Heat Stress)</div>
            </div>
            <div className="readout">
              <div className="readout-value">{risk.fungalFavourablePct ?? "—"}%</div>
              <div className="readout-label">24h Relative Humidity (Fungal Risk Proxy)</div>
            </div>
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 14 }}>
          Seasonal baseline: {kopargaonProfile.climate}, normal rainfall {kopargaonProfile.normalRainfallMm} mm/year ({kopargaonProfile.rainfallTrend}).
        </p>
      </div>
    </div>
  );
}
