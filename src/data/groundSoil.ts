// Source: Kopargaon_Taluka_CGWB_Extracted_Data.pdf,
// Kopargaon_Taluka_Aquifer_Data.pdf, Kopargaon_Agro_Climatic_Zone_Brief.pdf
// All figures are taluka/block-wide (2017-19 CGWB survey), not live sensor
// readings. The advisory frames them as the seasonal baseline a farmer's
// live/village input then adjusts.

export const kopargaonProfile = {
  geographicalAreaSqKm: 706.13,
  population2011: 302452,
  climate: "Monsoon sub-tropical, Scarcity Zone (drought-prone)",
  normalRainfallMm: 486.1,
  decadalAvgRainfallMm: 453.61,
  rainfallTrend: "Falling ~0.511 mm/year (1901-2017)",
  droughtProbability: { moderatePct: 12, severePct: 4, normalOrExcessPct: 84 },
  developmentStatus: "Semi-Critical (CGWB, over-exploitation reported)",
  soilComposition: [
    { type: "Coarse shallow", sharePct: 38, note: "Soil moisture is the main limiting factor under rainfed conditions" },
    { type: "Medium black", sharePct: 41, note: "Soil moisture is the main limiting factor under rainfed conditions" },
    { type: "Deep black (cotton soil)", sharePct: 13, note: "Best moisture retention; most forgiving under dry spells" },
    { type: "Reddish", sharePct: 8, note: "Lower fertility, needs organic amendment" }
  ],
  irrigationSharePct: 26.27,
  irrigationSourceSplit: { wellOrLiftPct: 71.46, canalPct: 28.54 },
  aquifers: {
    shallow: {
      name: "Aquifer-I (Phreatic, weathered basalt)",
      depthRangeMbgl: [9, 25],
      preMonsoonTrendMPerYear: -0.011,
      postMonsoonTrendMPerYear: -0.41,
      note: "Almost the entire taluka shows a falling trend"
    },
    deep: {
      name: "Aquifer-II (Semi-confined/confined, fractured basalt)",
      depthRangeMbgl: [23, 162],
      note: "Regulatory recommendation: avoid/regulate new borewells beyond 60 m"
    }
  }
};

export interface CropBenchmark {
  crop: string;
  existingTPerHa: number;
  potentialTPerHa: number;
  gapTPerHa: number;
  keyIntervention: string;
}

export const cropBenchmarks: CropBenchmark[] = [
  { crop: "Sugarcane", existingTPerHa: 75, potentialTPerHa: 125, gapTPerHa: 50, keyIntervention: "Paired-row planting, micro-irrigation, IPM/INM" },
  { crop: "Onion", existingTPerHa: 17, potentialTPerHa: 22, gapTPerHa: 5, keyIntervention: "Raised-bed planting, micro-irrigation, weed management" },
  { crop: "Cotton", existingTPerHa: 0.32, potentialTPerHa: 0.5, gapTPerHa: 0.18, keyIntervention: "Wide-row sowing, micro-irrigation, mechanization" }
];
