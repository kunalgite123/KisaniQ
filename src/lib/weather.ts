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
  provider: "OpenWeatherMap" | "Open-Meteo";
}

const OPEN_METEO_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${KOPARGAON_LAT}&longitude=${KOPARGAON_LON}` +
  `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max` +
  `&hourly=relative_humidity_2m` +
  `&forecast_days=7&timezone=auto`;

export async function fetchKopargaonWeather(customApiKey?: string): Promise<WeatherSnapshot> {
  const apiKey = customApiKey || localStorage.getItem("krishi_openweather_api_key") || import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (apiKey) {
    try {
      return await fetchOpenWeatherMap(apiKey);
    } catch (err) {
      console.warn("OpenWeatherMap API request failed, falling back to Open-Meteo:", err);
    }
  }

  // Fallback or default keyless Open-Meteo service
  return await fetchOpenMeteoWeather();
}

async function fetchOpenWeatherMap(apiKey: string): Promise<WeatherSnapshot> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${KOPARGAON_LAT}&lon=${KOPARGAON_LON}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`OpenWeatherMap returned ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const list: any[] = json.list ?? [];

  // Group 3-hour list entries by date (YYYY-MM-DD)
  const groupedByDay: Record<string, { temps: number[]; rains: number[]; humidities: number[]; pop: number[] }> = {};

  list.forEach((item) => {
    const dateStr = item.dt_txt.split(" ")[0];
    if (!groupedByDay[dateStr]) {
      groupedByDay[dateStr] = { temps: [], rains: [], humidities: [], pop: [] };
    }
    groupedByDay[dateStr].temps.push(item.main.temp);
    groupedByDay[dateStr].rains.push(item.rain?.["3h"] ?? 0);
    groupedByDay[dateStr].humidities.push(item.main.humidity);
    groupedByDay[dateStr].pop.push(item.pop ? item.pop * 100 : 0);
  });

  const dates = Object.keys(groupedByDay).slice(0, 7);
  const days: DailyWeather[] = dates.map((date) => {
    const data = groupedByDay[date];
    const tempMaxC = Math.max(...data.temps);
    const tempMinC = Math.min(...data.temps);
    const precipitationMm = data.rains.reduce((a, b) => a + b, 0);
    const precipitationProbabilityPct = Math.max(...data.pop);
    return {
      date,
      tempMaxC,
      tempMinC,
      precipitationMm,
      precipitationProbabilityPct
    };
  });

  const firstDayHumidities = list.slice(0, 8).map((item) => item.main.humidity);
  const avgHumidityNext24hPct = firstDayHumidities.length
    ? Math.round(firstDayHumidities.reduce((a: number, b: number) => a + b, 0) / firstDayHumidities.length)
    : null;

  return {
    fetchedAt: new Date().toISOString(),
    avgHumidityNext24hPct,
    days,
    provider: "OpenWeatherMap"
  };
}

async function fetchOpenMeteoWeather(): Promise<WeatherSnapshot> {
  const res = await fetch(OPEN_METEO_URL);
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

  return {
    fetchedAt: new Date().toISOString(),
    avgHumidityNext24hPct,
    days,
    provider: "Open-Meteo"
  };
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
