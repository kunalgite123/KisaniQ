export interface GovernmentScheme {
  id: string;
  name: string;
  shortName: string;
  category: "income" | "insurance" | "irrigation" | "soil" | "market";
  categoryLabel: string;
  categoryIcon: string;
  summary: string;
  benefits: string[];
  eligibilitySummary: string[];
  documentsRequired: string[];
  howToApplySteps: string[];
  officialUrl: string;
  officialSourceName: string;
  lastVerified: string;
  soilParameters?: string[];
}

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi",
    shortName: "PM-KISAN",
    category: "income",
    categoryLabel: "Income Support",
    categoryIcon: "💰",
    summary:
      "Central sector income support scheme providing ₹6,000 per year in three equal installments of ₹2,000 to eligible landholding farmer families across India.",
    benefits: [
      "Direct Benefit Transfer (DBT) of ₹6,000 annually into bank account in 3 equal installments of ₹2,000.",
      "Financial assistance for purchasing seeds, fertilizers, and meeting operational farm expenses.",
      "100% funded by Government of India with transparent Aadhaar-seeded payments."
    ],
    eligibilitySummary: [
      "Small and marginal landholding farmer families with cultivable land in their name.",
      "Excludes institutional landholders and high income-tax paying individuals.",
      "Mandatory e-KYC and Aadhaar-seeded bank account."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Land Ownership Documents (7/12 extract / Khatauni)",
      "Aadhaar-linked Bank Account details",
      "Active Mobile Number"
    ],
    howToApplySteps: [
      "Visit the official PM-KISAN Portal at pmkisan.gov.in.",
      "Click on 'Farmers Corner' → 'New Farmer Registration'.",
      "Enter Aadhaar Number, Mobile Number, and Select State (Maharashtra).",
      "Upload Land Record documents and submit application.",
      "Complete e-KYC via OTP or Biometric at nearest CSC centre."
    ],
    officialUrl: "https://pmkisan.gov.in/",
    officialSourceName: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    lastVerified: "August 2026"
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana",
    shortName: "PMFBY",
    category: "insurance",
    categoryLabel: "Crop Insurance",
    categoryIcon: "🛡️",
    summary:
      "Comprehensive crop insurance scheme providing financial coverage to farmers against crop loss/damage due to non-preventable natural risks, pests, and localized calamities.",
    benefits: [
      "Low premium rate for farmers: 2.0% for Kharif crops (Cotton/Sugarcane/Onion), 1.5% for Rabi crops, and 5% for commercial/horticultural crops.",
      "Full sum insured payout for yield loss, drought, unseasonal rainfall, inundation, and post-harvest losses.",
      "Use of satellite remote sensing, smartphones, and drone technology for rapid crop loss claim settlement."
    ],
    eligibilitySummary: [
      "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
      "Compulsory for loanee farmers opting in, voluntary for non-loanee farmers.",
      "Application must be submitted before seasonal deadline (Kharif / Rabi cutoff)."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Land Record (7/12 extract / Possession certificate)",
      "Sowing Certificate issued by Gram Panchayat / Talathi",
      "Cancelled Bank Cheque / Passbook copy"
    ],
    howToApplySteps: [
      "Visit pmfby.gov.in or download the Crop Insurance App.",
      "Click 'Farmer Corner' → 'Apply for Crop Insurance'.",
      "Select State (Maharashtra), District (Ahmednagar), Block (Kopargaon).",
      "Select notified crop (Cotton / Sugarcane / Onion) and land area.",
      "Calculate premium using Insurance Calculator and pay premium online."
    ],
    officialUrl: "https://pmfby.gov.in/",
    officialSourceName: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    lastVerified: "August 2026"
  },
  {
    id: "pmksy",
    name: "Pradhan Mantri Krishi Sinchayee Yojana — Per Drop More Crop",
    shortName: "PMKSY — Per Drop More Crop",
    category: "irrigation",
    categoryLabel: "Irrigation / Water Efficiency",
    categoryIcon: "💧",
    summary:
      "National irrigation scheme focusing on micro-irrigation systems (drip and sprinkler technologies) to maximize water-use efficiency and crop productivity.",
    benefits: [
      "Up to 55% subsidy for small and marginal farmers and 45% for other farmers on Drip & Sprinkler irrigation installations.",
      "Water saving up to 40–50% compared to flood irrigation, reducing weed growth and labor costs.",
      "Higher yield and fertigation efficiency by delivering nutrients directly to plant root zones."
    ],
    eligibilitySummary: [
      "Farmers owning cultivable land with an assured water source (Well, Borewell, Canal).",
      "Co-operative societies, Self Help Groups, and Panchayats are also eligible.",
      "Applicable for row crops like Cotton, Sugarcane, Onion, and horticultural crops."
    ],
    documentsRequired: [
      "7/12 Land Extract and 8-A Extract",
      "Aadhaar Card copy",
      "Certificate of Water Source (Borewell / Well / Canal reach)",
      "Drip System Technical Quotation from registered manufacturer"
    ],
    howToApplySteps: [
      "Visit pmksy.gov.in or Maharashtra MahaDBT Portal.",
      "Navigate to 'Irrigation Schemes' → 'Per Drop More Crop (Micro Irrigation)'.",
      "Upload land 7/12 extract and water source details.",
      "Select authorized drip manufacturer and submit application.",
      "Field inspection by Agriculture Officer followed by subsidy release."
    ],
    officialUrl: "https://pmksy.gov.in/",
    officialSourceName: "Department of Agriculture & Farmers Welfare, Govt. of India",
    lastVerified: "August 2026"
  },
  {
    id: "soil-health-card",
    name: "Soil Health Card Scheme",
    shortName: "Soil Health Card",
    category: "soil",
    categoryLabel: "Soil Health / Nutrient Management",
    categoryIcon: "🌱",
    summary:
      "Government initiative issuing soil health cards to farmers containing nutrient status across 12 vital parameters with customized fertilizer recommendations.",
    soilParameters: [
      "Macronutrients: Nitrogen (N), Phosphorus (P), Potassium (K)",
      "Secondary Nutrient: Sulphur (S)",
      "Micronutrients: Zinc (Zn), Iron (Fe), Copper (Cu), Manganese (Mn), Boron (B)",
      "Physical Indicators: pH, Electrical Conductivity (EC), Organic Carbon (OC)"
    ],
    benefits: [
      "Customized dosage recommendations for chemical fertilizers, organic manure, and bio-fertilizers.",
      "Prevents soil degradation and reduces excess NPK fertilizer expenditure by up to 20%.",
      "Free soil sampling and lab testing conducted every 2–3 years per land holding."
    ],
    eligibilitySummary: [
      "All landholding farmers across Kopargaon and Maharashtra talukas.",
      "Soil samples collected systematically by district agriculture department staff."
    ],
    documentsRequired: [
      "Land survey number / 7/12 extract",
      "Aadhaar Card",
      "Mobile number for SMS Soil Test Report delivery"
    ],
    howToApplySteps: [
      "Visit soilhealth.dac.gov.in or contact local Krishi Vigyan Kendra (KVK).",
      "Request soil sampling for your survey number or track existing sample status.",
      "View digital Soil Health Card report online by entering State, District, and Village.",
      "Apply recommended NPK + Micronutrient doses during field preparation."
    ],
    officialUrl: "https://soilhealth.dac.gov.in/",
    officialSourceName: "Department of Agriculture & Farmers Welfare, Govt. of India",
    lastVerified: "August 2026"
  },
  {
    id: "enam",
    name: "National Agriculture Market (e-NAM)",
    shortName: "e-NAM",
    category: "market",
    categoryLabel: "Market Access",
    categoryIcon: "🏪",
    summary:
      "Pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities with transparent price discovery.",
    benefits: [
      "Access to nationwide buyers and mandis ensuring competitive and transparent bidding.",
      "Real-time mandi price updates, arrival data, and quality testing parameters.",
      "Direct online payment to farmer's bank account avoiding intermediary delays."
    ],
    eligibilitySummary: [
      "All farmers, FPOs (Farmer Producer Organizations), and traders registered at e-NAM integrated APMC mandis.",
      "Registration is free for all farmers."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Bank Account details (Passbook / Cheque)",
      "APMC Mandi Registration ID / Mobile Number"
    ],
    howToApplySteps: [
      "Visit enam.gov.in or download the e-NAM Mobile App.",
      "Click 'Registration' → Select 'Farmer'.",
      "Fill personal details, APMC mandi choice (e.g. Kopargaon APMC), and bank details.",
      "Upload produce details (Cotton / Sugarcane / Onion) for e-bidding.",
      "Receive direct payment in bank account upon bid confirmation."
    ],
    officialUrl: "https://enam.gov.in/",
    officialSourceName: "Small Farmers' Agribusiness Consortium (SFAC), Govt. of India",
    lastVerified: "August 2026"
  }
];
