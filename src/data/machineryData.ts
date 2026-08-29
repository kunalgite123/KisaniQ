export type EquipmentCategory = "tractor" | "harvester" | "implement" | "sprayer" | "labour" | "irrigation" | "transport";

export interface MachineryListing {
  id: string;
  type: EquipmentCategory;
  title: string;
  categoryLabel: string;
  ownerName: string;
  ownerPhone: string;
  village: string;
  distanceKm: number;
  rate: number; // Listed rate in INR
  rateUnit: "acre" | "hour" | "day" | "worker / day";
  isProviderRate: boolean; // True if listed directly by provider, False if reference benchmark
  referenceRate?: number;
  availableNow: boolean;
  availableFrom?: string;
  isVerified: boolean;
  isDemoListing?: boolean;
  hpOrCapacity: string;
  attachmentsIncluded?: string[];
  description: string;
  crewSize?: number;
  imageUrl?: string;
  icon: string;
  rating: number;
  totalBookingsCount: number;
}

export interface RentalBooking {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  startDate: string;
  endDate: string;
  landAcres: number;
  estimatedCost: number;
  notes?: string;
  status: "Requested" | "Accepted" | "Completed" | "Cancelled";
  createdAt: string;
}

export const INITIAL_MACHINERY_LISTINGS: MachineryListing[] = [
  {
    id: "m1",
    type: "harvester",
    title: "Preet 987 Combine Harvester (Grain & Sugarcane)",
    categoryLabel: "Combine Harvester",
    ownerName: "Rameshwar Kale",
    ownerPhone: "+91 98220 14829",
    village: "Kopargaon",
    distanceKm: 1.2,
    rate: 1900,
    rateUnit: "acre",
    isProviderRate: true,
    referenceRate: 1900,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "110 HP Heavy Duty Engine",
    attachmentsIncluded: ["Straw Reaper Attachment", "Grain Tank 2000L", "Dual Cutter Bar"],
    description: "Heavy duty sugarcane and wheat harvester suitable for large plots. Includes experienced operator and diesel assistance.",
    icon: "🌾",
    rating: 4.9,
    totalBookingsCount: 38
  },
  {
    id: "m2",
    type: "tractor",
    title: "Mahindra 575 DI Power Plus Tractor with Cultivator",
    categoryLabel: "4WD Tractor & Cultivator",
    ownerName: "Dnyaneshwar Shinde",
    ownerPhone: "+91 94237 81920",
    village: "Dhamori",
    distanceKm: 3.0,
    rate: 700,
    rateUnit: "acre",
    isProviderRate: true,
    referenceRate: 700,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "47 HP / 3000 RPM",
    attachmentsIncluded: ["9 Tyne Cultivator", "Hydraulic Reversible Plough"],
    description: "Ideal for deep seedbed preparation, soil tilling and rotavator operations in sugarcane and onion fields.",
    icon: "🚜",
    rating: 4.8,
    totalBookingsCount: 64
  },
  {
    id: "m3",
    type: "implement",
    title: "Shaktiman 7-Feet Heavy Duty Rotavator",
    categoryLabel: "Rotavator (6–7 Feet)",
    ownerName: "Balasaheb Pawar",
    ownerPhone: "+91 98501 23411",
    village: "Takli",
    distanceKm: 3.6,
    rate: 1000,
    rateUnit: "acre",
    isProviderRate: true,
    referenceRate: 1000,
    availableNow: true,
    isVerified: false,
    hpOrCapacity: "Fits 45+ HP Tractors",
    attachmentsIncluded: ["Depth Control Skid", "Heavy PTO Shaft"],
    description: "Superior soil pulverization implement. Available for multi-day rental for field preparation.",
    icon: "⚙️",
    rating: 4.7,
    totalBookingsCount: 29
  },
  {
    id: "m4",
    type: "sprayer",
    title: "Aspee Solar High Pressure Boom Sprayer (500L)",
    categoryLabel: "Power Sprayer",
    ownerName: "Sanjay Jagtap",
    ownerPhone: "+91 97631 88402",
    village: "Ravande",
    distanceKm: 5.9,
    rate: 300,
    rateUnit: "acre",
    isProviderRate: true,
    referenceRate: 300,
    availableNow: false,
    availableFrom: "Available Tomorrow 8:00 AM",
    isVerified: true,
    hpOrCapacity: "500 Litre Tank / 12 Nozzles",
    attachmentsIncluded: ["50m Hose Reel", "Dual Boom Arms"],
    description: "Uniform pesticide and micro-nutrient foliar spray for sugarcane and pomegranate crops. Reduces chemical wastage by 30%.",
    icon: "💨",
    rating: 4.9,
    totalBookingsCount: 41
  },
  {
    id: "m5",
    type: "labour",
    title: "Kopargaon Sugarcane Cutters & Loader Gang",
    categoryLabel: "Harvesting Labour Crew",
    ownerName: "Mukadam Eknath Thorat",
    ownerPhone: "+91 99754 11209",
    village: "Kopargaon",
    distanceKm: 1.6,
    rate: 450,
    rateUnit: "worker / day",
    isProviderRate: true,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "10 Skilled Workers",
    crewSize: 10,
    attachmentsIncluded: ["Own Sickles", "Tractor Loading Racks"],
    description: "Experienced sugarcane harvest & carting gang. High efficiency cutting, bundle binding, and direct truck loading.",
    icon: "👨‍🌾",
    rating: 4.95,
    totalBookingsCount: 82
  },
  {
    id: "m6",
    type: "implement",
    title: "Precision Laser Land Leveler",
    categoryLabel: "Laser Land Leveller",
    ownerName: "Vishnu Patil",
    ownerPhone: "+91 98233 45678",
    village: "Derde",
    distanceKm: 8.2,
    rate: 1000,
    rateUnit: "acre",
    isProviderRate: true,
    referenceRate: 1000,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "Dual Axis Laser Transmitter",
    attachmentsIncluded: ["Scraper Bucket 7ft", "Transmitter Tripod"],
    description: "Saves up to 25% irrigation water by establishing 0% gradient level fields. Highly recommended prior to planting sugarcane.",
    icon: "📡",
    rating: 4.85,
    totalBookingsCount: 19
  },
  {
    id: "m7",
    type: "transport",
    title: "TATA 407 Agri Cargo Transport Truck",
    categoryLabel: "Farm Logistics & Transport",
    ownerName: "Babanrao Gite",
    ownerPhone: "+91 98902 33411",
    village: "Wari",
    distanceKm: 2.1,
    rate: 1200,
    rateUnit: "day",
    isProviderRate: true,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "3.5 Ton Payload Capacity",
    attachmentsIncluded: ["High Tarpaulin Cover", "Loading Ramps"],
    description: "Fast transport for onion sacks, pomegranate crates, and sugarcane bundles directly to Kopargaon & Shirdi APMC mandis.",
    icon: "🚛",
    rating: 4.75,
    totalBookingsCount: 53
  }
];
