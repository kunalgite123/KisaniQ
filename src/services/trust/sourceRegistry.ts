export interface OfficialSource {
  id: string;
  name: string;
  shortName: string;
  type: "GOVERNMENT_PORTAL" | "LIVE_SATELLITE_API" | "GOVERNMENT_SURVEY" | "RESEARCH_INSTITUTION" | "VERIFIED_SERVICE" | "INTELLIGENCE_VAULT";
  authorityLevel: 1 | 2 | 3 | 4; // Level 1 = Authoritative Govt/Satellite, Level 4 = User
  officialUrl?: string;
  domain?: string;
  description: string;
  validityWindowDays: number; // Max days before data is flagged as OUTDATED
}

export const OFFICIAL_SOURCES: Record<string, OfficialSource> = {
  OPEN_METEO: {
    id: "OPEN_METEO",
    name: "Open-Meteo Global Meteorological Satellite Weather API",
    shortName: "Open-Meteo Satellite API",
    type: "LIVE_SATELLITE_API",
    authorityLevel: 1,
    officialUrl: "https://open-meteo.com/",
    domain: "open-meteo.com",
    description: "Real-time European Centre for Medium-Range Weather Forecasts (ECMWF) satellite weather stream.",
    validityWindowDays: 1
  },
  IMD: {
    id: "IMD",
    name: "India Meteorological Department (IMD)",
    shortName: "IMD Ministry Portal",
    type: "GOVERNMENT_PORTAL",
    authorityLevel: 1,
    officialUrl: "https://mausam.imd.gov.in/",
    domain: "imd.gov.in",
    description: "Official meteorological warning and forecast authority under Ministry of Earth Sciences, Govt. of India.",
    validityWindowDays: 1
  },
  CGWB: {
    id: "CGWB",
    name: "Central Ground Water Board (CGWB)",
    shortName: "CGWB Ministry Survey",
    type: "GOVERNMENT_SURVEY",
    authorityLevel: 1,
    officialUrl: "http://cgwb.gov.in/",
    domain: "cgwb.gov.in",
    description: "National hydrogeological survey baseline authority under Ministry of Jal Shakti.",
    validityWindowDays: 365
  },
  GSDA_MAHARASHTRA: {
    id: "GSDA_MAHARASHTRA",
    name: "Groundwater Surveys and Development Agency (GSDA) Maharashtra",
    shortName: "GSDA Maharashtra Portal",
    type: "GOVERNMENT_SURVEY",
    authorityLevel: 1,
    officialUrl: "https://gsda.maharashtra.gov.in/",
    domain: "gsda.maharashtra.gov.in",
    description: "Official groundwater observation and water level recorder agency for Maharashtra state.",
    validityWindowDays: 180
  },
  PM_KISAN: {
    id: "PM_KISAN",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) Official Portal",
    shortName: "PM-KISAN DBT Portal",
    type: "GOVERNMENT_PORTAL",
    authorityLevel: 1,
    officialUrl: "https://pmkisan.gov.in/",
    domain: "pmkisan.gov.in",
    description: "Official Direct Benefit Transfer portal under Ministry of Agriculture and Farmers Welfare.",
    validityWindowDays: 30
  },
  PMFBY: {
    id: "PMFBY",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY) Portal",
    shortName: "PMFBY Insurance Portal",
    type: "GOVERNMENT_PORTAL",
    authorityLevel: 1,
    officialUrl: "https://pmfby.gov.in/",
    domain: "pmfby.gov.in",
    description: "Official crop insurance administration portal under Ministry of Agriculture.",
    validityWindowDays: 30
  },
  ICAR: {
    id: "ICAR",
    name: "Indian Council of Agricultural Research (ICAR)",
    shortName: "ICAR Research Repository",
    type: "RESEARCH_INSTITUTION",
    authorityLevel: 2,
    officialUrl: "https://icar.org.in/",
    domain: "icar.org.in",
    description: "Apex agricultural research organization under Ministry of Agriculture and Farmers Welfare.",
    validityWindowDays: 365
  },
  KISAN_SETU_VAULT: {
    id: "KISAN_SETU_VAULT",
    name: "Kisan Setu Multi-Stream Data Repository",
    shortName: "Kisan Setu Verified Baseline",
    type: "INTELLIGENCE_VAULT",
    authorityLevel: 3,
    officialUrl: "https://krishisetu.in/",
    domain: "krishisetu.in",
    description: "Verified local agronomic baselines and equipment market listings.",
    validityWindowDays: 7
  }
};
