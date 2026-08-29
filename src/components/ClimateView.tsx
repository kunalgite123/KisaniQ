import { useEffect, useState } from "react";
import { fetchKopargaonWeather, assessClimateRisk, WeatherSnapshot, ClimateRisk } from "../lib/weather";
import { kopargaonProfile } from "../data/groundSoil";
import { useLanguage } from "../context/LanguageContext";
import PageHeader from "./PageHeader";

export default function ClimateView() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [risk, setRisk] = useState<ClimateRisk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // OpenWeather API Key state
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem("krishi_openweather_api_key") || "");
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  function loadWeatherData(key?: string) {
    setLoading(true);
    fetchKopargaonWeather(key)
      .then((snap) => {
        setWeather(snap);
        setRisk(assessClimateRisk(snap));
        setError(null);
      })
      .catch((err) => {
        setError(err.message ?? "Could not fetch weather");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadWeatherData();
  }, []);

  function handleSaveApiKey(e: React.FormEvent) {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      localStorage.setItem("krishi_openweather_api_key", apiKeyInput.trim());
    } else {
      localStorage.removeItem("krishi_openweather_api_key");
    }
    setShowKeyConfig(false);
    loadWeatherData(apiKeyInput.trim());
  }

  return (
    <div>
      <PageHeader
        title={t("title_climate")}
        subtitle={t("climate_subtitle")}
        action={
          risk && (
            <span className={`badge badge-${risk.level === "high" ? "urgent" : risk.level === "moderate" ? "watch" : "healthy"}`}>
              {risk.level === "high" ? t("status_critical") : risk.level === "moderate" ? t("moderate_climate_risk") : t("status_stable")}
            </span>
          )
        }
      />

      {/* 7-Day Forecast & Live Metrics */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="section-label">
                {weather?.provider === "OpenWeatherMap"
                  ? "🌐 Live OpenWeatherMap Feed"
                  : "📡 Open-Meteo Satellite Feed"}{" "}
                · Kopargaon (19.88° N, 74.47° E)
              </span>
              <span className={`badge ${weather?.provider === "OpenWeatherMap" ? "badge-healthy" : "badge-muted"}`} style={{ fontSize: 10 }}>
                Provider: {weather?.provider ?? "Detecting..."}
              </span>
            </div>
            <h3 className="section-title">{t("weather_title")}</h3>
          </div>

          <button
            className="btn-outline-sm"
            style={{ fontSize: 12, padding: "5px 12px" }}
            onClick={() => setShowKeyConfig(!showKeyConfig)}
          >
            🔑 {apiKeyInput ? "OpenWeather Key Active" : t("openweather_config_btn")}
          </button>
        </div>

        {/* API Key Configuration Collapsible Box */}
        {showKeyConfig && (
          <form
            onSubmit={handleSaveApiKey}
            style={{
              background: "var(--surface-muted)",
              padding: 16,
              borderRadius: "var(--radius-md)",
              marginBottom: 16,
              border: "1px solid var(--border-subtle)"
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>
              OpenWeatherMap API Key Integration
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
              Enter your custom OpenWeather API Key below (saved locally in your browser). If empty or invalid, the app automatically uses the open-access satellite feed.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="text"
                className="input-text"
                placeholder="Paste OpenWeatherMap API Key (e.g. 4a8b...)"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                style={{ flex: 1, minWidth: 260 }}
              />
              <button type="submit" className="btn-primary-sm">
                Save &amp; Fetch
              </button>
              {apiKeyInput && (
                <button
                  type="button"
                  className="btn-outline-sm"
                  onClick={() => {
                    setApiKeyInput("");
                    localStorage.removeItem("krishi_openweather_api_key");
                    loadWeatherData("");
                  }}
                >
                  Clear Key
                </button>
              )}
            </div>
          </form>
        )}

        {loading && <p style={{ padding: 20, color: "var(--text-muted)" }}>Fetching live weather forecast for Kopargaon block…</p>}
        {error && <p style={{ padding: 20, color: "var(--alert-red)" }}>{error}</p>}

        {weather && risk && (
          <>
            <div className="grid-3" style={{ marginTop: 14 }}>
              <div className="readout">
                <div className="readout-value">{risk.dryDaysAhead} / 7</div>
                <div className="readout-label">{t("dry_days")}</div>
              </div>
              <div className="readout">
                <div className="readout-value">{risk.heatStressDays}</div>
                <div className="readout-label">{t("heat_stress_days")}</div>
              </div>
              <div className="readout">
                <div className="readout-value">{risk.fungalFavourablePct ?? "—"}%</div>
                <div className="readout-label">{t("humidity_label")}</div>
              </div>
            </div>

            <h4 style={{ marginTop: 24, marginBottom: 12, fontSize: 16 }}>{t("weather_title")}</h4>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t("date_col")}</th>
                    <th>{t("temp_col")}</th>
                    <th>{t("rain_col")}</th>
                    <th>{t("chance_col")}</th>
                    <th>{t("status_col")}</th>
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
                            {isDry ? t("dry_day") : t("rain_expected")}
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
        <div className="section-label">{t("agronomic_translation_label")}</div>
        <h3 className="section-title">{t("field_action_impact_title")}</h3>

        <div className="grid-2" style={{ marginTop: 16 }}>
          <div className="readout" style={{ background: "var(--surface-muted)" }}>
            <h4 style={{ fontSize: 16, marginBottom: 6 }}>{t("irrigation_impact_title")}</h4>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {risk && risk.dryDaysAhead >= 5
                ? t("irrigation_impact_desc_dry")
                : t("irrigation_impact_desc_rain")}
            </p>
          </div>

          <div className="readout" style={{ background: "var(--surface-muted)" }}>
            <h4 style={{ fontSize: 16, marginBottom: 6 }}>{t("spray_impact_title")}</h4>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {risk && risk.fungalFavourablePct && risk.fungalFavourablePct > 70
                ? t("spray_impact_desc_high")
                : t("spray_impact_desc_normal")}
            </p>
          </div>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)", opacity: 0.8 }}>
          {t("seasonal_baseline_text")}
        </p>
      </div>
    </div>
  );
}
