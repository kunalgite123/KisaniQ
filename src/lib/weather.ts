// Kopargaon taluka approximate centre coordinates.
export const KOPARGAON_LAT = 19.8833;
export const KOPARGAON_LON = 74.4667;

export interface DailyWeather {
  date: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationMm: number;
  precipitationProbabilityPct: number;
}

export interface WeatherSnapshot {
  fetchedAt: string;
  avgHumidityNext24hPct: number | null;
  days: DailyWeather[];
}

const FORECAST_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${KOPARGAON_LAT}&longitude=${KOPARGAON_LON}` +
  `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max` +
  `&hourly=relative_humidity_2m` +
  `&forecast_days=7&timezone=auto`;

export async function fetchKopargaonWeather(): Promise<WeatherSnapshot> {
  const res = await fetch(FORECAST_URL);
  if (!res.ok) {
    throw new Error(`Weather service responded with ${res.status}`);
  }
  const json = await res.json();

  const days: DailyWeather[] = (json.daily?.time ?? []).map((date: string, i: number) => ({
    date,
    tempMaxC: json.daily.temperature_2m_max[i],
    tempMinC: json.daily.temperature_2m_min[i],
    precipitationMm: json.daily.precipitation_sum[i],
    precipitationProbabilityPct: json.daily.precipitation_probability_max[i]
  }));

  const humidityValues: number[] = (json.hourly?.relative_humidity_2m ?? []).slice(0, 24);
  const avgHumidityNext24hPct = humidityValues.length
    ? Math.round(humidityValues.reduce((a: number, b: number) => a + b, 0) / humidityValues.length)
    : null;

  return { fetchedAt: new Date().toISOString(), avgHumidityNext24hPct, days };
}

export type ClimateRiskLevel = "low" | "moderate" | "high";

export interface ClimateRisk {
  level: ClimateRiskLevel;
  dryDaysAhead: number; // of the next 7 days with <1mm expected rain
  heatStressDays: number; // days with tempMax > 38C
  fungalFavourablePct: number | null; // avg humidity next 24h, used as a proxy
  headline: string;
}

export function assessClimateRisk(snapshot: WeatherSnapshot): ClimateRisk {
  const dryDaysAhead = snapshot.days.filter((d) => d.precipitationMm < 1).length;
  const heatStressDays = snapshot.days.filter((d) => d.tempMaxC > 38).length;
  const humidity = snapshot.avgHumidityNext24hPct;

  let score = 0;
  if (dryDaysAhead >= 6) score += 2;
  else if (dryDaysAhead >= 4) score += 1;
  if (heatStressDays >= 2) score += 2;
  else if (heatStressDays >= 1) score += 1;
  if (humidity !== null && humidity >= 75) score += 1;

  const level: ClimateRiskLevel = score >= 4 ? "high" : score >= 2 ? "moderate" : "low";

  const headline =
    level === "high"
      ? `Dry, hot week ahead — ${dryDaysAhead}/7 days with negligible rain. Prioritise irrigation scheduling and heat-stress protection.`
      : level === "moderate"
      ? `Mixed week — ${dryDaysAhead}/7 dry days forecast. Watch soil moisture and irrigate proactively before the next dry stretch.`
      : `Relatively favourable week for the Scarcity Zone — rain expected on ${7 - dryDaysAhead} of 7 days.`;

  return { level, dryDaysAhead, heatStressDays, fungalFavourablePct: humidity, headline };
}
