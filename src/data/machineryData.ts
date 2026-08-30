export type EquipmentCategory = "tractor" | "harvester" | "implement" | "sprayer" | "labour" | "irrigation" | "transport";

export interface MachineryListing {
  id: string;
  type: EquipmentCategory;
  title: string;
  titleMr?: string;
  categoryLabel: string;
  categoryLabelMr?: string;
  ownerName: string;
  ownerPhone: string;
  village: string;
  distanceKm: number;
  rate: number; // Listed rate in INR
  rateUnit: "acre" | "hour" | "day" | "worker / day";
  rateUnitMr?: string;
  isProviderRate: boolean; // True if listed directly by provider, False if reference benchmark
  referenceRate?: number;
  availableNow: boolean;
  availableFrom?: string;
  isVerified: boolean;
  isDemoListing?: boolean;
  hpOrCapacity: string;
  hpOrCapacityMr?: string;
  attachmentsIncluded?: string[];
  description: string;
  descriptionMr?: string;
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
    titleMr: "प्रीत ९८७ कंबाइन हार्वेस्टर (धान्य व ऊस)",
    categoryLabel: "Combine Harvester",
    categoryLabelMr: "कंबाइन हार्वेस्टर",
    ownerName: "Rameshwar Kale",
    ownerPhone: "+91 98220 14829",
    village: "Kopargaon",
    distanceKm: 1.2,
    rate: 1900,
    rateUnit: "acre",
    rateUnitMr: "एकर",
    isProviderRate: true,
    referenceRate: 1900,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "110 HP Heavy Duty Engine",
    hpOrCapacityMr: "११० एचपी हेव्ही ड्युटी इंजिन",
    attachmentsIncluded: ["Straw Reaper Attachment", "Grain Tank 2000L", "Dual Cutter Bar"],
    description: "Heavy duty sugarcane and wheat harvester suitable for large plots. Includes experienced operator and diesel assistance.",
    descriptionMr: "मोठ्या शेतांसाठी उपयुक्त ऊस व गहू कापणी यंत्र. अनुभवी चालकासह उपलब्ध.",
    icon: "🌾",
    rating: 4.9,
    totalBookingsCount: 38
  },
  {
    id: "m2",
    type: "tractor",
    title: "Mahindra 575 DI Power Plus Tractor with Cultivator",
    titleMr: "महिंद्रा ५७५ डीआय पॉवर प्लस ट्रॅक्टर व कल्टिव्हेटर",
    categoryLabel: "4WD Tractor & Cultivator",
    categoryLabelMr: "४WD ट्रॅक्टर व कल्टिव्हेटर",
    ownerName: "Dnyaneshwar Shinde",
    ownerPhone: "+91 94237 81920",
    village: "Dhamori",
    distanceKm: 3.0,
    rate: 700,
    rateUnit: "acre",
    rateUnitMr: "एकर",
    isProviderRate: true,
    referenceRate: 700,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "47 HP / 3000 RPM",
    hpOrCapacityMr: "४७ एचपी / ३००० आरपीएम",
    attachmentsIncluded: ["9 Tyne Cultivator", "Hydraulic Reversible Plough"],
    description: "Ideal for deep seedbed preparation, soil tilling and rotavator operations in sugarcane and onion fields.",
    descriptionMr: "ऊस व कांदा शेतात खोल नांगरणी, माती मशागत व रोटाव्हेटर कामासाठी उत्तम ट्रॅक्टर.",
    icon: "🚜",
    rating: 4.8,
    totalBookingsCount: 64
  },
  {
    id: "m3",
    type: "implement",
    title: "Shaktiman 7-Feet Heavy Duty Rotavator",
    titleMr: "शक्तिमान ७-फूट हेव्ही ड्युटी रोटाव्हेटर",
    categoryLabel: "Rotavator (6–7 Feet)",
    categoryLabelMr: "रोटाव्हेटर (६–७ फूट)",
    ownerName: "Balasaheb Pawar",
    ownerPhone: "+91 98501 23411",
    village: "Takli",
    distanceKm: 3.6,
    rate: 1000,
    rateUnit: "acre",
    rateUnitMr: "एकर",
    isProviderRate: true,
    referenceRate: 1000,
    availableNow: true,
    isVerified: false,
    hpOrCapacity: "Fits 45+ HP Tractors",
    hpOrCapacityMr: "४५+ एचपी ट्रॅक्टरसाठी उपयुक्त",
    attachmentsIncluded: ["Depth Control Skid", "Heavy PTO Shaft"],
    description: "Superior soil pulverization implement. Available for multi-day rental for field preparation.",
    descriptionMr: "मातीचे उत्तम बारीक भुसभुशीतकरण करणारे यंत्र. शेत मशागतीसाठी भाड्याने उपलब्ध.",
    icon: "⚙️",
    rating: 4.7,
    totalBookingsCount: 29
  },
  {
    id: "m4",
    type: "sprayer",
    title: "Aspee Solar High Pressure Boom Sprayer (500L)",
    titleMr: "अस्पी सोलर हाय प्रेशर बूम स्प्रेअर (५०० लि)",
    categoryLabel: "Power Sprayer",
    categoryLabelMr: "पावर स्प्रेअर",
    ownerName: "Sanjay Jagtap",
    ownerPhone: "+91 97631 88402",
    village: "Ravande",
    distanceKm: 5.9,
    rate: 300,
    rateUnit: "acre",
    rateUnitMr: "एकर",
    isProviderRate: true,
    referenceRate: 300,
    availableNow: false,
    availableFrom: "Available Tomorrow 8:00 AM",
    isVerified: true,
    hpOrCapacity: "500 Litre Tank / 12 Nozzles",
    hpOrCapacityMr: "५०० लिटर टँक / १२ नोझल्स",
    attachmentsIncluded: ["50m Hose Reel", "Dual Boom Arms"],
    description: "Uniform pesticide and micro-nutrient foliar spray for sugarcane and pomegranate crops. Reduces chemical wastage by 30%.",
    descriptionMr: "ऊस व डाळिंब पिकावर समान कीटकनाशक व सूक्ष्मअन्नद्रव्य फवारणी. ३०% औषध बचत.",
    icon: "💨",
    rating: 4.9,
    totalBookingsCount: 41
  },
  {
    id: "m5",
    type: "labour",
    title: "Kopargaon Sugarcane Cutters & Loader Gang",
    titleMr: "कोपरगाव ऊस तोडणी व भरती मजूर टोळी",
    categoryLabel: "Harvesting Labour Crew",
    categoryLabelMr: "मजूर टोळी",
    ownerName: "Mukadam Eknath Thorat",
    ownerPhone: "+91 99754 11209",
    village: "Kopargaon",
    distanceKm: 1.6,
    rate: 450,
    rateUnit: "worker / day",
    rateUnitMr: "कामगार / दिवस",
    isProviderRate: true,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "10 Skilled Workers",
    hpOrCapacityMr: "१० कुशल कामगार",
    crewSize: 10,
    attachmentsIncluded: ["Own Sickles", "Tractor Loading Racks"],
    description: "Experienced sugarcane harvest & carting gang. High efficiency cutting, bundle binding, and direct truck loading.",
    descriptionMr: "अनुभवी ऊस तोडणी व भरती टोळी. जलद कापणी, मोळी बांधणी व थेट ट्रॅक्टर/ट्रक भरती.",
    icon: "👨‍🌾",
    rating: 4.95,
    totalBookingsCount: 82
  },
  {
    id: "m6",
    type: "implement",
    title: "Precision Laser Land Leveler",
    titleMr: "लेसर लँड लेव्हलर (जमीन सपाटीकरण)",
    categoryLabel: "Laser Land Leveller",
    categoryLabelMr: "लेसर लँड लेव्हलर",
    ownerName: "Vishnu Patil",
    ownerPhone: "+91 98233 45678",
    village: "Derde",
    distanceKm: 8.2,
    rate: 1000,
    rateUnit: "acre",
    rateUnitMr: "एकर",
    isProviderRate: true,
    referenceRate: 1000,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "Dual Axis Laser Transmitter",
    hpOrCapacityMr: "ड्युअल ॲक्सिस लेसर ट्रान्समीटर",
    attachmentsIncluded: ["Scraper Bucket 7ft", "Transmitter Tripod"],
    description: "Saves up to 25% irrigation water by establishing 0% gradient level fields. Highly recommended prior to planting sugarcane.",
    descriptionMr: "जमीन तंतोतंत सपाट करून २५% पाण्यामध्ये बचत करते. ऊस लागवडीपूर्वी अत्यंत शिफारसीत.",
    icon: "📡",
    rating: 4.85,
    totalBookingsCount: 19
  },
  {
    id: "m7",
    type: "transport",
    title: "TATA 407 Agri Cargo Transport Truck",
    titleMr: "टाटा ४०७ कृषी माल वाहतूक टेम्पो/ट्रक",
    categoryLabel: "Farm Logistics & Transport",
    categoryLabelMr: "कृषी माल वाहतूक",
    ownerName: "Babanrao Gite",
    ownerPhone: "+91 98902 33411",
    village: "Wari",
    distanceKm: 2.1,
    rate: 1200,
    rateUnit: "day",
    rateUnitMr: "दिवस",
    isProviderRate: true,
    availableNow: true,
    isVerified: true,
    hpOrCapacity: "3.5 Ton Payload Capacity",
    hpOrCapacityMr: "३.५ टन क्षमता",
    attachmentsIncluded: ["High Tarpaulin Cover", "Loading Ramps"],
    description: "Fast transport for onion sacks, pomegranate crates, and sugarcane bundles directly to Kopargaon & Shirdi APMC mandis.",
    descriptionMr: "कांदा गोणी, डाळिंब क्रेट्स व ऊस थेट कोपरगाव व शिर्डी बाजार समितीत नेण्यासाठी जलद वाहतूक.",
    icon: "🚛",
    rating: 4.75,
    totalBookingsCount: 53
  }
];
