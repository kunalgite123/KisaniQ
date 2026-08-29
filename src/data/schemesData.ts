export type SchemeType = "scheme" | "programme" | "service" | "platform" | "reference";

export type SchemeCategory =
  | "income"
  | "insurance"
  | "climate"
  | "irrigation"
  | "groundwater"
  | "soil"
  | "pest-disease"
  | "market"
  | "employment"
  | "monitoring"
  | "side-income";

export interface GovernmentScheme {
  id: string;
  name: string;
  shortName: string;
  typeLabel: string;
  category: SchemeCategory;
  categoryLabel: string;
  categoryIcon: string;
  summary: string;
  programmePeriod?: string;
  benefits: string[];
  eligibilitySummary: string[];
  documentsRequired: string[];
  howToApplySteps: string[];
  officialUrl: string;
  officialSourceName: string;
  lastVerified: string;
  soilParameters?: string[];
  disruptionTags?: string[];
}

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi",
    shortName: "PM-KISAN",
    typeLabel: "SCHEME",
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
    lastVerified: "August 2026",
    disruptionTags: ["inputs", "income"]
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana",
    shortName: "PMFBY",
    typeLabel: "CROP INSURANCE SCHEME",
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
    lastVerified: "August 2026",
    disruptionTags: ["drought", "rain", "pest"]
  },
  {
    id: "wbcis",
    name: "Weather Based Crop Insurance Scheme",
    shortName: "WBCIS",
    typeLabel: "WEATHER INSURANCE COMPONENT",
    category: "climate",
    categoryLabel: "Weather & Climate Risk",
    categoryIcon: "🌦️",
    summary:
      "Insurance protection against specified adverse weather conditions like deficit rainfall, excess rain, extreme temperatures, and high humidity that adversely affect crop production.",
    benefits: [
      "Parametric weather index payout based on objective weather data recorded at automated weather stations.",
      "Protection against drought, heat stress, unseasonal rainfall, and high humidity spells.",
      "Fast claim processing without requiring individual field crop-cutting estimates."
    ],
    eligibilitySummary: [
      "Farmers growing notified crops in notified weather reference areas.",
      "Implemented under the PMFBY crop insurance framework."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Land 7/12 Extract",
      "Sowing Declaration Certificate",
      "Bank Account details"
    ],
    howToApplySteps: [
      "Access WBCIS parameters via pmfby.gov.in or National Portal india.gov.in.",
      "Check notified weather parameters for Ahmednagar district / Kopargaon block.",
      "Enroll through local bank branch, CSC center, or online PMFBY portal.",
      "Claims are automatically triggered if weather stations record adverse index events."
    ],
    officialUrl: "https://www.india.gov.in/category/agriculture-rural-environment/subcategory/agricultural-produce/details/weather-based-crop-insurance-scheme-wbcis",
    officialSourceName: "National Portal of India & PMFBY Framework",
    lastVerified: "August 2026",
    disruptionTags: ["drought", "rain"]
  },
  {
    id: "pmksy",
    name: "Pradhan Mantri Krishi Sinchayee Yojana — Per Drop More Crop",
    shortName: "PMKSY — Per Drop More Crop",
    typeLabel: "IRRIGATION SCHEME",
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
    lastVerified: "August 2026",
    disruptionTags: ["water", "drought"]
  },
  {
    id: "atal-bhujal",
    name: "Atal Bhujal Yojana — Groundwater Reference",
    shortName: "Atal Bhujal Yojana",
    typeLabel: "GROUNDWATER MANAGEMENT REFERENCE",
    category: "groundwater",
    categoryLabel: "Groundwater & Water Security",
    categoryIcon: "💧",
    programmePeriod: "Programme Period: 2020–2025",
    summary:
      "Community-led sustainable groundwater management programme implemented across water-stressed areas to strengthen water budgeting, artificial recharge, and water conservation.",
    benefits: [
      "Community water budgeting and rainwater harvesting asset creation.",
      "Groundwater recharge structure guidelines (percolation tanks, check dams, recharge shafts).",
      "Support for efficient crop water planning in over-exploited and semi-critical groundwater blocks."
    ],
    eligibilitySummary: [
      "Reference programme implemented in selected water-stressed Gram Panchayats in Maharashtra (2020–2025).",
      "For active individual drip/sprinkler subsidies, see PMKSY — Per Drop More Crop."
    ],
    documentsRequired: [
      "Gram Panchayat Water Budgeting Plan",
      "Village Water Security Plan reference"
    ],
    howToApplySteps: [
      "Review official Maharashtra GSDA groundwater reports at gsda.maharashtra.gov.in.",
      "Participate in Gram Panchayat water security and water budgeting meetings.",
      "Adopt micro-irrigation via PMKSY for individual farm water saving."
    ],
    officialUrl: "https://gsda.maharashtra.gov.in/en-atal-bhujal-project/",
    officialSourceName: "Groundwater Surveys & Development Agency (GSDA), Govt. of Maharashtra",
    lastVerified: "August 2026",
    disruptionTags: ["water"]
  },
  {
    id: "soil-health-card",
    name: "Soil Health Card Scheme",
    shortName: "Soil Health Card",
    typeLabel: "SOIL HEALTH SERVICE",
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
    lastVerified: "August 2026",
    disruptionTags: ["inputs"]
  },
  {
    id: "ipm",
    name: "Integrated Pest Management Programme",
    shortName: "Integrated Pest Management (IPM)",
    typeLabel: "GOVERNMENT PROGRAMME",
    category: "pest-disease",
    categoryLabel: "Crop Disease & Pest Management",
    categoryIcon: "🐛",
    summary:
      "Ecological pest management approach combining biological control, mechanical traps, cultural practices, and judicious chemical pesticide usage below economic threshold levels.",
    benefits: [
      "Minimizes chemical pesticide residue on food crops while preserving natural beneficial predator insects.",
      "Prevents pest resistance development in Cotton (Bollworm/Whitefly), Sugarcane (Borer/Smut), and Onion (Thrips).",
      "Free field scout training and demonstration through Central IPM Centers and KVKs."
    ],
    eligibilitySummary: [
      "All farmers growing field crops and horticultural crops.",
      "Guidance available through Directorate of Plant Protection, Quarantine & Storage (PPQS)."
    ],
    documentsRequired: [
      "No formal documents required for technical guidance and IPM field school participation."
    ],
    howToApplySteps: [
      "Visit ppqs.gov.in or contact nearest Krishi Vigyan Kendra.",
      "Adopt yellow/blue sticky traps and pheromone traps for pest monitoring.",
      "Use bio-pesticides (Neem oil, Trichoderma, Pseudomonas) before applying chemical sprays."
    ],
    officialUrl: "https://ppqs.gov.in/",
    officialSourceName: "Directorate of Plant Protection, Quarantine & Storage (PPQS), Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["pest"]
  },
  {
    id: "npss",
    name: "National Pest Surveillance System",
    shortName: "NPSS",
    typeLabel: "GOVERNMENT AGRICULTURAL SERVICE",
    category: "monitoring",
    categoryLabel: "Crop & Pest Monitoring",
    categoryIcon: "📡",
    summary:
      "AI/ML-enabled national digital surveillance platform developed by ICAR-NCIPM for pest identification, disease diagnostic surveillance, and rapid crop protection advisories.",
    benefits: [
      "AI-assisted instant pest and disease photo identification on mobile devices.",
      "Geo-tagged real-time pest outbreak alerts for neighboring talukas and districts.",
      "Direct connection with ICAR plant protection scientists for expert advisories."
    ],
    eligibilitySummary: [
      "Free digital agricultural service open to all farmers, agricultural extension officers, and scientists."
    ],
    documentsRequired: [
      "Smartphone with camera and internet connectivity."
    ],
    howToApplySteps: [
      "Visit nriipm.res.in or download the NPSS App from Google Play Store.",
      "Register with Mobile Number and location (Ahmednagar / Kopargaon).",
      "Upload leaf disease/pest photo to receive AI diagnostic feedback and ICAR guidance."
    ],
    officialUrl: "https://nriipm.res.in/",
    officialSourceName: "ICAR — National Research Centre for Integrated Pest Management",
    lastVerified: "August 2026",
    disruptionTags: ["pest"]
  },
  {
    id: "enam",
    name: "National Agriculture Market (e-NAM)",
    shortName: "e-NAM",
    typeLabel: "GOVERNMENT PLATFORM",
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
    lastVerified: "August 2026",
    disruptionTags: ["market"]
  },
  {
    id: "mgnrega",
    name: "Mahatma Gandhi National Rural Employment Guarantee Scheme",
    shortName: "MGNREGA",
    typeLabel: "RURAL EMPLOYMENT & ASSET PROGRAMME",
    category: "employment",
    categoryLabel: "Rural Employment & Labour",
    categoryIcon: "👷",
    summary:
      "National social security scheme guaranteeing 100 days of wage employment per financial year to rural households, while building community assets for water conservation and land development.",
    benefits: [
      "Guaranteed wage employment for rural households for up to 100 days per year.",
      "Funding for rural asset creation: farm ponds, check dams, trenching, and soil conservation.",
      "Direct wage credit to Aadhaar-seeded bank/post office accounts."
    ],
    eligibilitySummary: [
      "Adult members of rural households residing in Gram Panchayat area willing to do unskilled manual work."
    ],
    documentsRequired: [
      "MGNREGA Job Card",
      "Aadhaar Card",
      "Bank/Post Office Account details"
    ],
    howToApplySteps: [
      "Visit nrega.nic.in or apply at local Gram Panchayat office.",
      "Submit application for Job Card issuance with household details.",
      "Submit written application for work to Gram Panchayat / Programme Officer."
    ],
    officialUrl: "https://nrega.nic.in/",
    officialSourceName: "Ministry of Rural Development, Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["side-income", "water"]
  },

  /* NEW: SIDE INCOME / ALLIED BUSINESS SUBSIDIES FOR FARMERS */
  {
    id: "pmmsy",
    name: "Pradhan Mantri Matsya Sampada Yojana",
    shortName: "PMMSY (Fish Farming / Aquaculture)",
    typeLabel: "ALLIED BUSINESS SUBSIDY SCHEME",
    category: "side-income",
    categoryLabel: "Side Income / Allied Business",
    categoryIcon: "🐟",
    summary:
      "Flagship scheme for holistic development of fisheries and aquaculture, providing 40% to 60% capital subsidy for farm pond fish culture, biofloc units, and fish seed hatcheries.",
    benefits: [
      "40% capital subsidy for general category farmers and 60% for SC/ST/Women farmers on farm pond fish farming.",
      "Generate ₹1.5 Lakh to ₹3.0 Lakh additional annual side income from farm ponds or re-circulatory aquaculture units.",
      "Financial assistance for purchasing fingerlings, fish feed, aerators, and fish transport vehicles."
    ],
    eligibilitySummary: [
      "Individual farmers, landholders with farm ponds or willing to construct aquaculture ponds, SHGs, and Co-operatives.",
      "Special incentives for women farmers and small landholders in rural areas."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "7/12 Land Extract or Farm Pond Ownership Certificate",
      "Bank Account details",
      "DPR (Detailed Project Report) for aquaculture unit"
    ],
    howToApplySteps: [
      "Visit official portal pmmsy.dof.gov.in or contact District Fisheries Office.",
      "Register online under 'Farmer / Beneficiary Registration'.",
      "Select project component (Farm Pond Fish Culture / Biofloc / Re-circulatory System).",
      "Submit DPR along with land documents for District Level Committee sanction."
    ],
    officialUrl: "https://pmmsy.dof.gov.in/",
    officialSourceName: "Department of Fisheries, Ministry of Fisheries, Animal Husbandry & Dairying, Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["side-income"]
  },
  {
    id: "nlm",
    name: "National Livestock Mission & AHIDF",
    shortName: "National Livestock Mission (Goat/Poultry/Dairy)",
    typeLabel: "ALLIED BUSINESS SUBSIDY SCHEME",
    category: "side-income",
    categoryLabel: "Side Income / Allied Business",
    categoryIcon: "🐐",
    summary:
      "Government subsidy programme providing up to 50% capital subsidy (up to ₹25 Lakh to ₹50 Lakh) for setting up Goat/Sheep breeding farms, Poultry units, and Dairy value addition enterprises.",
    benefits: [
      "50% capital subsidy directly released to beneficiary bank account for Goat, Sheep, and Country Chicken breeding units.",
      "3% interest subvention under AHIDF (Animal Husbandry Infrastructure Development Fund) for dairy processing and cattle feed units.",
      "Provides steady daily/monthly supplementary side income to buffer against crop failure risks."
    ],
    eligibilitySummary: [
      "Individual farmers, FPOs, Self Help Groups, and Joint Liability Groups.",
      "Requires land availability for shed construction and fodder cultivation."
    ],
    documentsRequired: [
      "Aadhaar Card & PAN Card",
      "Land Ownership / Lease Agreement",
      "Bank Loan Sanction Letter (for bank-linked subsidy)",
      "Project Training Certificate from KVK / Veterinary College"
    ],
    howToApplySteps: [
      "Visit official portal nlm.udyamimitra.in or ahidf.udyamimitra.in.",
      "Apply online under 'Entrepreneurship Development Programme'.",
      "Upload Project Report, Land documents, and Bank Details.",
      "State Level Executive Committee scrutinizes and sanctions subsidy."
    ],
    officialUrl: "https://nlm.udyamimitra.in/",
    officialSourceName: "Department of Animal Husbandry & Dairying, Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["side-income"]
  },
  {
    id: "pmfme",
    name: "PM Formalisation of Micro Food Processing Enterprises",
    shortName: "PMFME (Agri-Food Processing / Jaggery / Storage)",
    typeLabel: "AGRI-BUSINESS SUBSIDY SCHEME",
    category: "side-income",
    categoryLabel: "Side Income / Allied Business",
    categoryIcon: "🏭",
    summary:
      "Scheme offering 35% credit-linked capital subsidy (up to ₹10 Lakh) for setting up micro food processing units (Onion storage/processing, Jaggery making, Sugarcane juice bottling, Spices grinding, Cotton seed oil).",
    benefits: [
      "35% capital credit-linked subsidy up to ₹10 Lakh for individual micro-food processing units.",
      "Up to ₹40,000 seed capital per SHG member for working capital and small tool purchase.",
      "Transforms raw produce into high-value packaged goods for local mandis and supermarket supply."
    ],
    eligibilitySummary: [
      "Existing or new micro food processing entrepreneurs, individual farmers, SHGs, and Farmer Producer Companies (FPCs)."
    ],
    documentsRequired: [
      "Aadhaar & PAN Card",
      "Udyam Registration Certificate",
      "Bank Account statement & Project Cost Quotation",
      "FSSAI license registration (guidance provided)"
    ],
    howToApplySteps: [
      "Visit official PMFME portal at pmfme.mofpi.gov.in.",
      "Click 'Sign Up' → Select 'Individual Micro Enterprise'.",
      "Fill online application form and upload land / equipment machinery quote.",
      "District Resource Person (DRP) assists in bank loan application and subsidy disbursal."
    ],
    officialUrl: "https://pmfme.mofpi.gov.in/",
    officialSourceName: "Ministry of Food Processing Industries (MoFPI), Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["side-income", "market"]
  }
];
