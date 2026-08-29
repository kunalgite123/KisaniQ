export interface PricingBenchmark {
  serviceKey: string;
  serviceName: string;
  category: "field_prep" | "land_management" | "sowing" | "crop_protection" | "harvesting" | "planting";
  referenceRate: number; // in INR
  pricingUnit: "acre" | "hour" | "day" | "worker / day";
  sourceType: "published_market_reference";
  sourceNote: string;
  lastReviewed: string;
}

export const PRICING_BENCHMARKS: PricingBenchmark[] = [
  // FIELD PREPARATION
  {
    serviceKey: "cultivator",
    serviceName: "Cultivator (9–13 Tyne)",
    category: "field_prep",
    referenceRate: 700,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  },
  {
    serviceKey: "rotavator",
    serviceName: "Rotavator (6–7 Feet)",
    category: "field_prep",
    referenceRate: 1000,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  },
  {
    serviceKey: "disc_harrow",
    serviceName: "Disc Harrow",
    category: "field_prep",
    referenceRate: 1100,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  },

  // LAND MANAGEMENT
  {
    serviceKey: "laser_land_leveler",
    serviceName: "Laser Land Leveller",
    category: "land_management",
    referenceRate: 1000,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  },

  // SOWING & PLANTING
  {
    serviceKey: "seed_drill",
    serviceName: "Seed Drill",
    category: "sowing",
    referenceRate: 450,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  },
  {
    serviceKey: "super_seeder",
    serviceName: "Super Seeder",
    category: "sowing",
    referenceRate: 1500,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  },
  {
    serviceKey: "sugarcane_planter",
    serviceName: "Sugarcane Planter",
    category: "planting",
    referenceRate: 1750,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  },

  // CROP PROTECTION
  {
    serviceKey: "power_sprayer",
    serviceName: "Power Sprayer / Boom Sprayer",
    category: "crop_protection",
    referenceRate: 300,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  },

  // HARVESTING
  {
    serviceKey: "combine_harvester",
    serviceName: "Combine Harvester",
    category: "harvesting",
    referenceRate: 1900,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  },
  {
    serviceKey: "reaper",
    serviceName: "Reaper / Reaper-Binder",
    category: "harvesting",
    referenceRate: 1250,
    pricingUnit: "acre",
    sourceType: "published_market_reference",
    sourceNote: "Indian agricultural machinery hiring references",
    lastReviewed: "2026"
  }
];

export function getBenchmarkForService(titleOrType: string): PricingBenchmark | null {
  const lower = titleOrType.toLowerCase();
  if (lower.includes("rotavator")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "rotavator") || null;
  if (lower.includes("cultivator")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "cultivator") || null;
  if (lower.includes("harrow")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "disc_harrow") || null;
  if (lower.includes("leveler") || lower.includes("land level")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "laser_land_leveler") || null;
  if (lower.includes("seed drill")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "seed_drill") || null;
  if (lower.includes("seeder")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "super_seeder") || null;
  if (lower.includes("sprayer")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "power_sprayer") || null;
  if (lower.includes("harvester") || lower.includes("preet")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "combine_harvester") || null;
  if (lower.includes("reaper")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "reaper") || null;
  if (lower.includes("planter")) return PRICING_BENCHMARKS.find((b) => b.serviceKey === "sugarcane_planter") || null;
  return null;
}
