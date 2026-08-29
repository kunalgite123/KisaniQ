import { useEffect, useState } from "react";
import { fetchKopargaonWeather, assessClimateRisk, WeatherSnapshot, ClimateRisk } from "../lib/weather";
import { kopargaonProfile } from "../data/groundSoil";
import PageHeader from "./PageHeader";

export default function ClimateView() {
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
        setError(err.message ?? "Could not fetch weather");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="Climate &amp; Weather"
        subtitle="7-day weather outlook and field impact analysis for Kopargaon block"
        action={
          risk && (
            <span className={`badge badge-${risk.level === "high" ? "urgent" : risk.level === "moderate" ? "watch" : "healthy"}`}>
              {risk.level.toUpperCase()} CLIMATE RISK
            </span>
          )
        }
      />

      {/* 7-Day Forecast & Live Metrics */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="section-label">Live Open-Meteo Satellite Feed · Kopargaon (19.88° N, 74.47° E)</span>
            <h3 className="section-title">7-Day Forecast &amp; Risk Metrics</h3>
          </div>
        </div>

        {loading && <p style={{ padding: 20, color: "var(--text-muted)" }}>Fetching live satellite forecast for Kopargaon block…</p>}
        {error && <p style={{ padding: 20, color: "var(--alert-red)" }}>{error}</p>}

        {weather && risk && (
          <>
            <div className="grid-3" style={{ marginTop: 14 }}>
              <div className="readout">
                <div className="readout-value">{risk.dryDaysAhead} / 7</div>
                <div className="readout-label">Dry days forecast (rainfall &lt;1mm)</div>
              </div>
              <div className="readout">
                <div className="readout-value">{risk.heatStressDays}</div>
                <div className="readout-label">Heat stress days forecast (&gt;38°C)</div>
              </div>
              <div className="readout">
                <div className="readout-value">{risk.fungalFavourablePct ?? "—"}%</div>
                <div className="readout-label">Avg. humidity (24h fungal risk proxy)</div>
              </div>
            </div>

            <h4 style={{ marginTop: 24, marginBottom: 12, fontSize: 16 }}>7-Day Forecast Schedule</h4>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Max / Min Temp</th>
                    <th>Expected Rain</th>
                    <th>Precipitation Chance</th>
                    <th>Day Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weather.days.map((d) => {
                    const isDry = d.precipitationMm < 1.0;
                    return (
                      <tr key={d.date}>
                        <td style={{ fontWeight: 600 }}>
                          {new Date(d.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                        </td>
                        <td className="mono">
                          {Math.round(d.tempMaxC)}°C / {Math.round(d.tempMinC)}°C
                        </td>
                        <td className="mono">{d.precipitationMm.toFixed(1)} mm</td>
                        <td className="mono">{Math.round(d.precipitationProbabilityPct)}%</td>
                        <td>
                          <span className={`badge ${isDry ? "badge-watch" : "badge-healthy"}`}>
                            {isDry ? "Dry Day" : "Rain Expected"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Weather to Farm Impact Card */}
      <div className="card">
        <div className="section-label">Agronomic Translation · What today's weather means for your farm</div>
        <h3 className="section-title">Field Action Impact</h3>

        <div className="grid-2" style={{ marginTop: 16 }}>
          <div className="readout" style={{ background: "var(--surface-muted)" }}>
            <h4 style={{ fontSize: 16, marginBottom: 6 }}>💧 Irrigation Impact</h4>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {risk && risk.dryDaysAhead >= 5
                ? "5+ dry days ahead. Increase micro-irrigation frequency during early morning hours to limit evaporation loss."
                : "Rain expected within next 48 hours. Hold planned overhead pumping to conserve groundwater."}
            </p>
          </div>

          <div className="readout" style={{ background: "var(--surface-muted)" }}>
            <h4 style={{ fontSize: 16, marginBottom: 6 }}>🐛 Spraying &amp; Pest Impact</h4>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {risk && risk.fungalFavourablePct && risk.fungalFavourablePct > 70
                ? "High relative humidity elevates fungal disease threat. Conduct leaf inspections and avoid late-evening watering."
                : "Wind and moisture levels are clear for scheduled field spraying."}
            </p>
          </div>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)", opacity: 0.8 }}>
          Seasonal baseline context: Kopargaon taluka sits in Maharashtra's Scarcity Zone with {kopargaonProfile.normalRainfallMm} mm normal annual rainfall ({kopargaonProfile.rainfallTrend}).
        </p>
      </div>
    </div>
  );
}
