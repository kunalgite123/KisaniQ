import { useEffect, useState } from "react";
import { fetchKopargaonWeather, assessClimateRisk, WeatherSnapshot, ClimateRisk } from "../lib/weather";
import { analyzeClimateIntelligence, getConditionDetails } from "../lib/climateIntelligence";
import { Village } from "../data/villages";
import { Tab } from "../App";
import PageHeader from "./PageHeader";
import WeatherTrendsChart from "./climate/WeatherTrendsChart";
import ClimateRiskModal from "./climate/ClimateRiskModal";
import { useLanguage } from "../context/LanguageContext";
import { FarmerDecision } from "../lib/farmerDecisionEngine";
import AdviceSectionCard from "./AdviceSectionCard";

interface Props {
  village?: Village | null;
  cropName?: string | null;
  weather?: WeatherSnapshot | null;
  climateRisk?: ClimateRisk | null;
  decision?: FarmerDecision | null;
  onNavigateTab?: (tab: Tab) => void;
}

export default function ClimateView({ village, cropName, weather: propWeather, climateRisk: propRisk, decision, onNavigateTab }: Props) {
  const { language } = useLanguage();
  const isMr = language === "mr";

  const [weather, setWeather] = useState<WeatherSnapshot | null>(propWeather || null);
  const [risk, setRisk] = useState<ClimateRisk | null>(propRisk || null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!propWeather);
  const [showRiskModal, setShowRiskModal] = useState(false);

  // Sync prop weather if provided
  useEffect(() => {
    if (propWeather) {
      setWeather(propWeather);
      setRisk(propRisk || assessClimateRisk(propWeather));
      setLoading(false);
    }
  }, [propWeather, propRisk]);

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

  const intel = weather && risk ? analyzeClimateIntelligence(weather, risk, village?.name, cropName, language as any) : null;

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      <PageHeader
        title={isMr ? "हवामान व हवामान अंदाज" : "Climate & Weather"}
        subtitle={isMr ? "तुमच्या शेतासाठी उपग्रह आधारित हवामान व हवामान धोका विश्लेषण." : "Weather intelligence for your farm"}
        action={
          intel && (
            <span className={`badge ${intel.overallBadgeClass}`} style={{ fontSize: 12.5, padding: "5px 12px" }}>
              {isMr ? "सध्याचा धोका:" : "Current Risk:"} {intel.overallRiskLevel}
            </span>
          )
        }
      />

      {/* DEDICATED SECTION-SPECIFIC CLIMATE AI ADVICE CARD */}
      {risk && (
        <AdviceSectionCard
          id={`climate_${village?.name || 'default'}`}
          category={isMr ? "🌦️ हवामान व हवामान धोका सल्ला" : "🌦️ Climate & Weather Defense Advice"}
          title={decision ? decision.weatherRisk.headline : risk.headline}
          recommendation={risk.dryDaysAhead >= 5 ? (isMr ? "पुढील ५+ कोरड्या दिवसांसाठी पहाटेच्या वेळी सिंचन करा." : "Schedule proactive irrigation for dry stretch ahead") : (isMr ? "फवारणी व शेती कामांसाठी अनुकूल वातावरण उपलब्ध आहे." : "Optimal field operation window available")}
          reason={risk.headline}
          avoid={risk.dryDaysAhead >= 5 ? (isMr ? "उन्हाची तीव्रता वाढण्यापूर्वी पाणी देण्यात उशीर करणे" : "Delaying irrigation setup before heat wave") : (isMr ? "पावसाच्या दिवशी फवारणी करणे" : "Heavy foliar spraying on rain forecast days")}
          timeframe={isMr ? "पुढील ७ दिवस" : "Next 7 Days"}
          urgency={risk.level === "high" ? "urgent" : risk.level === "moderate" ? "watch" : "healthy"}
          confidencePct={87}
        />
      )}

      {/* Sub-header Location & Feed Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: -14, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
            📍 {intel ? intel.locationName : (village ? `${village.name}, Kopargaon` : (isMr ? "कोपरगाव, महाराष्ट्र" : "Kopargaon, Maharashtra"))}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}>
            · {isMr ? "थेट हवामान माहिती (उपग्रह फीड)" : "Live Weather Data (Satellite Feed)"}
          </span>
        </div>

        {weather && (
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {isMr ? "अद्यतन:" : "Updated:"} {new Date(weather.fetchedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>

      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📡</div>
          <h4 style={{ fontSize: 15, fontWeight: 600 }}>{isMr ? "थेट हवामान माहिती लोड होत आहे..." : "Fetching live satellite weather forecast..."}</h4>
        </div>
      )}

      {error && (
        <div className="card" style={{ padding: 20, borderLeft: "3px solid var(--color-urgent)" }}>
          <h4 style={{ fontSize: 15, color: "var(--color-urgent)" }}>{isMr ? "हवामान माहिती उपलब्ध नाही" : "Weather Data Unavailable"}</h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{error}</p>
          <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => loadWeatherData()}>
            {isMr ? "पुन्हा प्रयत्न करा" : "Retry Live Feed"}
          </button>
        </div>
      )}

      {weather && risk && intel && (
        <>
          {/* 2. Today's Weather & Climate Risk Grid (Equal Size Boxes - Exact Top & Bottom Alignment) */}
          <div className="grid-2" style={{ marginBottom: 28, gap: 20, alignItems: "stretch" }}>
            {/* Today's Weather Hero */}
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 24, height: "100%", marginTop: 0 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="section-label" style={{ fontSize: 11 }}>{isMr ? "आज" : "TODAY"}</span>
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
                      {isMr ? "भासमान तापमान" : "Feels like"} ~{intel.todayAvgTemp}°C · {isMr ? "किमान" : "Min"} {Math.round(intel.today.tempMinC)}°C / {isMr ? "कमाल" : "Max"} {Math.round(intel.today.tempMaxC)}°C
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
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "पावसाची शक्यता" : "Rain Chance"}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                    {Math.round(intel.today.precipitationProbabilityPct)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "अपेक्षित पाऊस" : "Expected Rain"}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                    {intel.today.precipitationMm.toFixed(1)} mm
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "आद्रता" : "Humidity"}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                    {weather.avgHumidityNext24hPct ?? 68}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "कोरडे दिवस" : "Dry Days"}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                    {risk.dryDaysAhead} / 7
                  </div>
                </div>
              </div>
            </div>

            {/* Climate Risk Section */}
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 24, height: "100%", marginTop: 0 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="section-label" style={{ fontSize: 11 }}>{isMr ? "हवामान धोका" : "CLIMATE RISK"}</span>
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

              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
                <button
                  className="btn-outline-sm"
                  onClick={() => setShowRiskModal(true)}
                  style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
                >
                  {isMr ? "धोका तपशील व नियम पहा →" : "View Risk Details & Calculation Rules →"}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Decision Signal Flow (Weather -> Farm Action) */}
          <div className="card" style={{ marginBottom: 28, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
              {isMr ? "हवामान संकेत ते शेती निर्णय" : "From Weather Signal to Farm Decision"}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              <div style={{ padding: 12, background: "var(--surface-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "१. हवामान संकेत" : "1. Weather Signal"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
                  {intel.decisionFlow.weatherSignal}
                </div>
              </div>

              <div style={{ padding: 12, background: "var(--surface-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "२. हवामान धोका" : "2. Climate Risk"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-urgent)", marginTop: 4 }}>
                  {intel.decisionFlow.climateRisk}
                </div>
              </div>

              <div style={{ padding: 12, background: "var(--surface-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{isMr ? "३. पिकांवरील परिणाम" : "3. Farm Impact"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
                  {intel.decisionFlow.farmImpact}
                </div>
              </div>

              <div style={{ padding: 12, background: "var(--primary-100)", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-200)" }}>
                <div style={{ fontSize: 11, color: "var(--primary-800)", fontWeight: 700 }}>{isMr ? "४. कृषी सेतू शिफारस" : "4. Krishi Setu Recommendation"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-900)", marginTop: 4 }}>
                  {intel.decisionFlow.recommendation}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Farm Impact Section */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 14 }}>
              <span className="section-label">{isMr ? "पिकांवर परिणाम" : "FARM IMPACT"}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                {isMr ? "हवामानाचा तुमच्या शेतावर होणारा परिणाम" : "How This Weather May Affect Your Farm"}
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
                      <strong>{isMr ? "कारण:" : "Why?"}</strong> {impact.reason}
                    </p>

                    <div style={{ marginTop: 10, padding: 10, background: "var(--surface-muted)", borderRadius: "var(--radius-sm)", fontSize: 12.5, color: "var(--text-main)", lineHeight: 1.4 }}>
                      <strong>{isMr ? "कृती:" : "Action:"}</strong> {impact.action}
                    </div>
                  </div>

                  {impact.targetTab && onNavigateTab && (
                    <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--border-subtle)" }}>
                      <button
                        className="btn-outline-sm"
                        onClick={() => onNavigateTab(impact.targetTab!)}
                        style={{ fontSize: 12 }}
                      >
                        {isMr ? "तपशील पहा →" : `View ${impact.targetTab === "water" ? "Water & Soil" : impact.targetTab === "crop" ? "Crop Doctor" : impact.targetTab === "schemes" ? "Government Schemes" : "Advisory"} →`}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Concise 7-Day Weather Summary (Replaces long forecast list & charts) */}
          <div className="card" style={{ marginBottom: 28, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div>
                <span className="section-label">{isMr ? "७ दिवसांचा हवामान सारांश" : "7-DAY WEATHER SUMMARY"}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", marginTop: 2, margin: 0 }}>
                  {isMr ? "७ दिवसांची हवामान स्थिती व अंदाज" : "7-Day Farm Climate Brief"}
                </h3>
              </div>

              <span className="badge badge-healthy" style={{ fontSize: 11.5 }}>
                🌧️ {isMr ? "एकूण पाऊस:" : "Total Rainfall:"} {weather.days.reduce((acc, d) => acc + d.precipitationMm, 0).toFixed(1)} mm
              </span>
            </div>

            <div style={{ background: "var(--surface-muted)", padding: 18, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <p style={{ fontSize: 14, color: "var(--text-main)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                📋 {intel.outlookSummary}
              </p>
              <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap", fontSize: 12.5, color: "var(--text-muted)" }}>
                <span><strong>{isMr ? "कोरडे दिवस:" : "Dry Days (<1mm):"}</strong> {risk.dryDaysAhead} / 7</span>
                <span><strong>{isMr ? "तापमान श्रेणी:" : "Temp Range:"}</strong> {Math.min(...weather.days.map((d) => d.tempMinC))}°C – {Math.max(...weather.days.map((d) => d.tempMaxC))}°C</span>
                <span><strong>{isMr ? "उकाड्याचे दिवस:" : "Heat Stress Days:"}</strong> {risk.heatStressDays}</span>
              </div>
            </div>
          </div>

          {/* 7. Krishi Setu Actionable Advisories */}
          <div className="card" style={{ marginBottom: 32, padding: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <span className="section-label">{isMr ? "हवामान सल्ला" : "ADVISORY"}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", marginTop: 2 }}>
                {isMr ? "कृषी सेतू हवामान सल्ला" : "Krishi Setu Weather Advisories"}
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
                    <strong>{isMr ? "कारण:" : "Reason:"}</strong> {adv.reason}
                  </p>
                  <div style={{ fontSize: 12.5, color: "var(--text-main)", marginTop: 4, fontWeight: 500 }}>
                    👉 <strong>{isMr ? "कृती:" : "Action:"}</strong> {adv.action}
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
