import { DailyWeather } from "../../lib/weather";

interface Props {
  days: DailyWeather[];
}

export default function WeatherTrendsChart({ days }: Props) {
  if (!days || days.length === 0) return null;

  const width = 640;
  const height = 180;
  const padding = 32;

  // Temperature ranges
  const maxTemps = days.map((d) => d.tempMaxC);
  const minTemps = days.map((d) => d.tempMinC);
  const minVal = Math.floor(Math.min(...minTemps) - 2);
  const maxVal = Math.ceil(Math.max(...maxTemps) + 2);

  const getX = (index: number) => padding + (index * (width - 2 * padding)) / (days.length - 1);
  const getY = (temp: number) => height - padding - ((temp - minVal) / (maxVal - minVal)) * (height - 2 * padding);

  const maxPoints = maxTemps.map((t, i) => `${getX(i)},${getY(t)}`).join(" ");
  const minPoints = minTemps.map((t, i) => `${getX(i)},${getY(t)}`).join(" ");

  return (
    <div className="grid-2" style={{ gap: 20 }}>
      {/* 1. Temperature Trend Chart */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <span className="section-label">7-DAY TEMPERATURE TREND</span>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginTop: 2, color: "var(--text-main)" }}>
              Max &amp; Min Temperatures (°C)
            </h4>
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
            <span style={{ color: "#d32f2f", fontWeight: 600 }}>● Max Temp</span>
            <span style={{ color: "#1976d2", fontWeight: 600 }}>● Min Temp</span>
          </div>
        </div>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-subtle)" />

            {/* Max Temp Line */}
            <polyline fill="none" stroke="#d32f2f" strokeWidth="2.5" points={maxPoints} />
            {/* Min Temp Line */}
            <polyline fill="none" stroke="#1976d2" strokeWidth="2.5" strokeDasharray="4 4" points={minPoints} />

            {/* Points & Labels */}
            {days.map((d, i) => {
              const x = getX(i);
              const yMax = getY(d.tempMaxC);
              const yMin = getY(d.tempMinC);
              const dateLabel = new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" });

              return (
                <g key={d.date}>
                  {/* Max Temp Point */}
                  <circle cx={x} cy={yMax} r="4" fill="#d32f2f" />
                  <text x={x} y={yMax - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill="#d32f2f">
                    {Math.round(d.tempMaxC)}°
                  </text>

                  {/* Min Temp Point */}
                  <circle cx={x} cy={yMin} r="4" fill="#1976d2" />
                  <text x={x} y={yMin + 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1976d2">
                    {Math.round(d.tempMinC)}°
                  </text>

                  {/* Date Label */}
                  <text x={x} y={height - 6} textAnchor="middle" fontSize="11" fill="var(--text-muted)">
                    {dateLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. Rainfall & Probability Bar Chart */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <span className="section-label">7-DAY RAINFALL FORECAST</span>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginTop: 2, color: "var(--text-main)" }}>
              Precipitation (mm) &amp; Probability (%)
            </h4>
          </div>
          <div style={{ fontSize: 12, color: "var(--primary-700)", fontWeight: 600 }}>
            💧 Total: {days.reduce((s, d) => s + d.precipitationMm, 0).toFixed(1)} mm
          </div>
        </div>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-subtle)" />

            {days.map((d, i) => {
              const x = getX(i);
              const barWidth = 24;
              const maxRainHeight = height - 2 * padding;
              const barHeight = Math.max(4, (Math.min(d.precipitationMm, 20) / 20) * maxRainHeight);
              const yBar = height - padding - barHeight;
              const dateLabel = new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" });

              return (
                <g key={d.date}>
                  {/* Rain Bar */}
                  <rect
                    x={x - barWidth / 2}
                    y={yBar}
                    width={barWidth}
                    height={barHeight}
                    fill={d.precipitationMm >= 1.0 ? "var(--primary-600)" : "rgba(30, 136, 229, 0.25)"}
                    rx="3"
                  />

                  {/* Value Above Bar */}
                  <text x={x} y={yBar - 6} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="var(--text-main)">
                    {d.precipitationMm.toFixed(1)}mm
                  </text>

                  {/* Probability Below Bar */}
                  <text x={x} y={height - 22} textAnchor="middle" fontSize="10" fill="var(--text-muted)">
                    {Math.round(d.precipitationProbabilityPct)}%
                  </text>

                  {/* Date Label */}
                  <text x={x} y={height - 6} textAnchor="middle" fontSize="11" fill="var(--text-muted)">
                    {dateLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
