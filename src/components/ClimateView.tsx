import { useEffect, useState } from "react";
import { fetchKopargaonWeather, assessClimateRisk, WeatherSnapshot, ClimateRisk } from "../lib/weather";
import { analyzeClimateIntelligence, getConditionDetails } from "../lib/climateIntelligence";
import { Village } from "../data/villages";
import { Tab } from "../App";
import PageHeader from "./PageHeader";
import WeatherTrendsChart from "./climate/WeatherTrendsChart";
import ClimateRiskModal from "./climate/ClimateRiskModal";

interface Props {
  village?: Village | null;
  cropName?: string | null;
  onNavigateTab?: (tab: Tab) => void;
}

export default function ClimateView({ village, cropName, onNavigateTab }: Props) {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [risk, setRisk] = useState<ClimateRisk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRiskModal, setShowRiskModal] = useState(false);

  // API Key config collapsible drawer
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

  const intel = weather && risk ? analyzeClimateIntelligence(weather, risk, village?.name, cropName) : null;

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      {/* 1. Page Header */}
      <PageHeader
        title="Climate & Weather"
        subtitle="Weather intelligence for your farm"
        action={
          intel && (
            <span className={`badge ${intel.overallBadgeClass}`} style={{ fontSize: 12.5, padding: "5px 12px" }}>
              Current Risk: {intel.overallRiskLevel}
            </span>
          )
        }
      />

      {/* Sub-header Location & Feed Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: -14, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
            📍 {intel ? intel.locationName : (village ? `${village.name}, Kopargaon` : "Kopargaon, Maharashtra")}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}>
            · Live Weather Data ({weather?.provider ?? "Satellite Feed"})
          </span>
        </div>

        {weather && (
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Updated: {new Date(weather.fetchedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>

      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📡</div>
          <h4 style={{ fontSize: 15, fontWeight: 600 }}>Fetching live satellite weather forecast...</h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Connecting to Open-Meteo &amp; OpenWeatherMap endpoints...</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ padding: 20, borderLeft: "3px solid var(--color-urgent)" }}>
          <h4 style={{ fontSize: 15, color: "var(--color-urgent)" }}>Weather Data Unavailable</h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{error}</p>
          <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => loadWeatherData()}>
            Retry Live Feed
          </button>
        </div>
      )}

      {weather && risk && intel && (
        <>
          {/* 2. Today's Weather & Climate Risk Grid */}
          <div className="grid-2" style={{ marginBottom: 28, gap: 20 }}>
            {/* Today's Weather Hero */}
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 24 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="section-label" style={{ fontSize: 11 }}>TODAY</span>
                  <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                    {new Date(intel.today.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
                  <div style={{ fontSize: 44, lineHeight: 1 }}>{intel.todayIcon}</div>
                  <div>
                    <div style={{ fontSize: 44, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--text-main)", lineHeight: 1 }}>
                      {Math.round(intel.today.tempMaxC)}°C
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                      Feels like ~{intel.todayAvgTemp}°C · Min {Math.round(intel.today.tempMinC)}°C / Max {Math.round(intel.today.tempMaxC)}°C
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--primary-800)", marginTop: 10 }}>
                  {intel.todayCondition}
                </div>
              </div>

              {/* 4 Compact Key Metrics */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Rain Chance</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                    {Math.round(intel.today.precipitationProbabilityPct)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Expected Rain</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                    {intel.today.precipitationMm.toFixed(1)} mm
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Humidity</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                    {weather.avgHumidityNext24hPct ?? 68}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Dry Days</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                    {risk.dryDaysAhead} / 7
                  </div>
                </div>
              </div>
            </div>

            {/* Climate Risk Section */}
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 24 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="section-label" style={{ fontSize: 11 }}>CLIMATE RISK</span>
                  <span className={`badge ${intel.overallBadgeClass}`}>{intel.overallRiskLevel}</span>
                </div>

                <p style={{ fontSize: 13.5, color: "var(--text-main)", marginTop: 12, lineHeight: 1.5, fontWeight: 500 }}>
                  {risk.headline}
                </p>

                {/* Risk Components List */}
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {intel.categoryRisks.map((cat, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 }}>
                      <span style={{ color: "var(--text-muted)" }}>● {cat.name}</span>
                      <span className={`badge ${cat.badgeClass}`} style={{ fontSize: 11, padding: "1px 7px" }}>
                        {cat.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                <button
                  className="btn-outline-sm"
                  onClick={() => setShowRiskModal(true)}
                  style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
                >
                  View Risk Details &amp; Calculation Rules →
                </button>
              </div>
            </div>
          </div>

          {/* 3. Decision Signal Flow (Weather -> Farm Action) */}
          <div className="card" style={{ marginBottom: 28, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
              From Weather Signal to Farm Decision
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              <div style={{ padding: 12, background: "var(--surface-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>1. Weather Signal</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
                  {intel.decisionFlow.weatherSignal}
                </div>
              </div>

              <div style={{ padding: 12, background: "var(--surface-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>2. Climate Risk</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-urgent)", marginTop: 4 }}>
                  {intel.decisionFlow.climateRisk}
                </div>
              </div>

              <div style={{ padding: 12, background: "var(--surface-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>3. Farm Impact</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
                  {intel.decisionFlow.farmImpact}
                </div>
              </div>

              <div style={{ padding: 12, background: "var(--primary-100)", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-200)" }}>
                <div style={{ fontSize: 11, color: "var(--primary-800)", fontWeight: 700 }}>4. KisaniQ Recommendation</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-900)", marginTop: 4 }}>
                  {intel.decisionFlow.recommendation}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Farm Impact Section */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 14 }}>
              <span className="section-label">FARM IMPACT</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                How This Weather May Affect Your Farm
              </h3>
            </div>

            <div className="grid-2" style={{ gap: 16 }}>
              {intel.farmImpacts.map((impact, idx) => (
                <div key={idx} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 20 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{impact.icon}</span>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}>{impact.title}</h4>
                      </div>
                      <span className={`badge ${impact.badgeClass}`} style={{ fontSize: 11 }}>{impact.status}</span>
                    </div>

                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.5 }}>
                      <strong>Why?</strong> {impact.reason}
                    </p>

                    <div style={{ marginTop: 10, padding: 10, background: "var(--surface-muted)", borderRadius: "var(--radius-sm)", fontSize: 12.5, color: "var(--text-main)", lineHeight: 1.4 }}>
                      <strong>Action:</strong> {impact.action}
                    </div>
                  </div>

                  {impact.targetTab && onNavigateTab && (
                    <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--border-subtle)" }}>
                      <button
                        className="btn-outline-sm"
                        onClick={() => onNavigateTab(impact.targetTab!)}
                        style={{ fontSize: 12 }}
                      >
                        View {impact.targetTab === "water" ? "Water & Soil" : impact.targetTab === "crop" ? "Crop Doctor" : impact.targetTab === "schemes" ? "Government Schemes" : "Advisory"} →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Clean 7-Day Forecast Visual Timeline */}
          <div className="card" style={{ marginBottom: 32, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <div>
                <span className="section-label">7-DAY FORECAST</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                  Day-by-Day Farm Weather Outlook
                </h3>
              </div>

              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {risk.dryDaysAhead} Dry Days (&lt;1mm) · {risk.heatStressDays} Heat Stress Days
              </span>
            </div>

            {/* Clean Forecast Row List */}
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--border-subtle)" }}>
              {weather.days.map((d, index) => {
                const isDry = d.precipitationMm < 1.0;
                const isHeat = d.tempMaxC >= 38;
                const { icon } = getConditionDetails(d);
                const dateObj = new Date(d.date);
                const dayName = dateObj.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase();
                const dateFormatted = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

                return (
                  <div
                    key={d.date}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 10px",
                      borderBottom: "1px solid var(--border-subtle)",
                      background: index === 0 ? "rgba(46, 125, 50, 0.05)" : "transparent",
                      flexWrap: "wrap",
                      gap: 12
                    }}
                  >
                    {/* Date & Weather Icon */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 150 }}>
                      <span style={{ fontSize: 22, width: 26, textAlign: "center" }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                          {dayName} {dateFormatted} {index === 0 && <span style={{ color: "var(--primary-800)", fontSize: 10, fontWeight: 700, marginLeft: 4 }}>● TODAY</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {Math.round(d.precipitationProbabilityPct)}% rain prob
                        </div>
                      </div>
                    </div>

                    {/* Temperature Slider Range */}
                    <div style={{ flex: 1, minWidth: 160, maxWidth: 240 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "var(--text-main)", marginBottom: 3 }}>
                        <span>{Math.round(d.tempMinC)}°C</span>
                        <span>{Math.round(d.tempMaxC)}°C</span>
                      </div>
                      <div style={{ height: 5, background: "var(--border-subtle)", borderRadius: 3, position: "relative" }}>
                        <div
                          style={{
                            position: "absolute",
                            left: `${Math.max(0, Math.min(100, ((d.tempMinC - 15) / 25) * 100))}%`,
                            right: `${Math.max(0, Math.min(100, 100 - ((d.tempMaxC - 15) / 25) * 100))}%`,
                            height: "100%",
                            background: d.tempMaxC >= 38 ? "var(--color-urgent)" : "var(--primary-600)",
                            borderRadius: 3
                          }}
                        />
                      </div>
                    </div>

                    {/* Rainfall Volume */}
                    <div style={{ minWidth: 100, textAlign: "right" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-main)" }}>
                        💧 {d.precipitationMm.toFixed(1)} mm
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {d.precipitationMm >= 1.0 ? "Rain expected" : "Dry day"}
                      </div>
                    </div>

                    {/* Simple Text Status */}
                    <div style={{ minWidth: 90, textAlign: "right" }}>
                      <span className={`badge ${isHeat ? "badge-urgent" : isDry ? "badge-watch" : "badge-healthy"}`} style={{ fontSize: 10.5, padding: "2px 8px" }}>
                        {isHeat ? "HEAT ALERT" : isDry ? "DRY DAY" : "RAIN"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. Weather Trends & 7-Day Climate Outlook */}
          <div style={{ marginBottom: 32 }}>
            <WeatherTrendsChart days={weather.days} />

            <div className="card" style={{ marginTop: 16, background: "var(--surface-muted)", padding: 18, borderRadius: "var(--radius-md)" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)" }}>📋 7-Day Climate Outlook Summary</h4>
              <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.6 }}>
                {intel.outlookSummary}
              </p>
            </div>
          </div>

          {/* 7. KisaniQ Actionable Advisories */}
          <div className="card" style={{ marginBottom: 32, padding: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <span className="section-label">ADVISORY</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                KisaniQ Weather Advisories
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {intel.priorityAdvisories.map((adv, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--surface-bg)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    padding: 14
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary-800)", letterSpacing: "0.05em" }}>
                      {adv.category}
                    </span>
                    <span className={`badge ${adv.badgeClass}`} style={{ fontSize: 10.5 }}>
                      {adv.priority}
                    </span>
                  </div>

                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
                    {adv.title}
                  </h4>
                  <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>
                    <strong>Reason:</strong> {adv.reason}
                  </p>
                  <div style={{ fontSize: 12.5, color: "var(--text-main)", marginTop: 4, fontWeight: 500 }}>
                    👉 <strong>Action:</strong> {adv.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Quiet Footer & Settings Drawer */}
          <div
            style={{
              padding: "14px 18px",
              background: "var(--surface-muted)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              fontSize: 12,
              color: "var(--text-muted)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10
            }}
          >
            <div>
              <strong>Weather Data Source:</strong> {weather.provider} Satellite Feed · Kopargaon (19.88° N, 74.47° E).
            </div>

            <button
              className="btn-outline-sm"
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              style={{ fontSize: 11, padding: "3px 8px" }}
            >
              ⚙️ Settings
            </button>
          </div>

          {/* API Key Config Collapsible Drawer */}
          {showKeyConfig && (
            <form
              onSubmit={handleSaveApiKey}
              style={{
                background: "var(--surface-card)",
                padding: 16,
                borderRadius: "var(--radius-md)",
                marginTop: 12,
                border: "1px solid var(--border-strong)"
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                OpenWeatherMap Custom API Key Config
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                Paste custom OpenWeatherMap API Key below to switch from keyless satellite feed.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="text"
                  className="input-text"
                  placeholder="Paste OpenWeatherMap API Key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  style={{ flex: 1, minWidth: 260 }}
                />
                <button type="submit" className="btn-primary-sm">
                  Save Key
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

          {/* Risk Breakdown Modal */}
          {showRiskModal && (
            <ClimateRiskModal
              intelligence={intel}
              snapshot={weather}
              risk={risk}
              onClose={() => setShowRiskModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
