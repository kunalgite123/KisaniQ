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
  nameMr?: string;
  shortName: string;
  typeLabel: string;
  typeLabelMr?: string;
  category: SchemeCategory;
  categoryLabel: string;
  categoryLabelMr?: string;
  categoryIcon: string;
  summary: string;
  summaryMr?: string;
  programmePeriod?: string;
  benefits: string[];
  benefitsMr?: string[];
  eligibilitySummary: string[];
  eligibilitySummaryMr?: string[];
  documentsRequired: string[];
  documentsRequiredMr?: string[];
  howToApplySteps: string[];
  howToApplyStepsMr?: string[];
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
    nameMr: "प्रधानमंत्री किसान सन्मान निधी (PM-KISAN)",
    shortName: "PM-KISAN",
    typeLabel: "SCHEME",
    typeLabelMr: "शासकीय योजना",
    category: "income",
    categoryLabel: "Income Support",
    categoryLabelMr: "उत्पन्न पाठबळ",
    categoryIcon: "💰",
    summary:
      "Central sector income support scheme providing ₹6,000 per year in three equal installments of ₹2,000 to eligible landholding farmer families across India.",
    summaryMr:
      "शेतकरी कुटुंबांना वर्षाला ₹६,००० थेट बँक खात्यात जमा करणारी केंद्र सरकारची आर्थिक मदत योजना (३ टप्प्यांत ₹२,००० प्रत्येकी).",
    benefits: [
      "Direct Benefit Transfer (DBT) of ₹6,000 annually into bank account in 3 equal installments of ₹2,000.",
      "Financial assistance for purchasing seeds, fertilizers, and meeting operational farm expenses.",
      "100% funded by Government of India with transparent Aadhaar-seeded payments."
    ],
    benefitsMr: [
      "वर्षभरात ₹६,००० ची थेट मदत ३ समान हप्त्यांमध्ये (₹२,००० प्रत्येकी) थेट बँक खात्यात.",
      "बियाणे, खते खरेदी व शेती खर्चासाठी उपयुक्त आर्थिक आधार.",
      "आधारशी संलग्न बँक खात्यांमध्ये १००% पारदर्शक निधी वाटप."
    ],
    eligibilitySummary: [
      "Small and marginal landholding farmer families with cultivable land in their name.",
      "Excludes institutional landholders and high income-tax paying individuals.",
      "Mandatory e-KYC and Aadhaar-seeded bank account."
    ],
    eligibilitySummaryMr: [
      "स्वतःच्या नावावर लागवडीयोग्य जमीन असणारे लहान व अल्पभूधारक शेतकरी.",
      "सरकारी निवृत्तीवेतनधारक व उच्च आयकरदाते वगळून.",
      "e-KYC आणि आधार जोडलेले बँक खाते अनिवार्य."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Land Ownership Documents (7/12 extract / Khatauni)",
      "Aadhaar-linked Bank Account details",
      "Active Mobile Number"
    ],
    documentsRequiredMr: [
      "आधार कार्ड",
      "जमिनीचा ७/१२ व ८-अ उतारा",
      "आधार लिंक असलेले बँक पासबुक / चेकमध्ये",
      "चालू मोबाईल नंबर"
    ],
    howToApplySteps: [
      "Visit the official PM-KISAN Portal at pmkisan.gov.in.",
      "Click on 'Farmers Corner' → 'New Farmer Registration'.",
      "Enter Aadhaar Number, Mobile Number, and Select State (Maharashtra).",
      "Upload Land Record documents and submit application.",
      "Complete e-KYC via OTP or Biometric at nearest CSC centre."
    ],
    howToApplyStepsMr: [
      "pmkisan.gov.in पोर्टलला भेट द्या.",
      "'Farmers Corner' → 'New Farmer Registration' वर क्लिक करा.",
      "आधार क्रमांक, मोबाईल नंबर टाकून महाराष्ट्र राज्य निवडा.",
      "७/१२ उतारा अपलोड करा व अर्ज सबमिट करा.",
      "जवळच्या सीएससी केंद्रात किंवा ओटीपी द्वारे e-KYC पूर्ण करा."
    ],
    officialUrl: "https://pmkisan.gov.in/",
    officialSourceName: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["inputs", "income"]
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana",
    nameMr: "प्रधानमंत्री पीक विमा योजना (PMFBY)",
    shortName: "PMFBY",
    typeLabel: "CROP INSURANCE SCHEME",
    typeLabelMr: "पीक विमा योजना",
    category: "insurance",
    categoryLabel: "Crop Insurance",
    categoryLabelMr: "पीक विमा सुरक्षा",
    categoryIcon: "🛡️",
    summary:
      "Comprehensive crop insurance scheme providing financial coverage to farmers against crop loss/damage due to non-preventable natural risks, pests, and localized calamities.",
    summaryMr:
      "नैसर्गिक आपत्ती, अवकाळी पाऊस, कीड-रोग व दुष्काळ यामुळे होणाऱ्या पीक नुकसानीपासून सर्वसमावेशक विमा संरक्षण देणारी योजना.",
    benefits: [
      "Low premium rate for farmers: 2.0% for Kharif crops (Cotton/Sugarcane/Onion), 1.5% for Rabi crops, and 5% for commercial/horticultural crops.",
      "Full sum insured payout for yield loss, drought, unseasonal rainfall, inundation, and post-harvest losses.",
      "Use of satellite remote sensing, smartphones, and drone technology for rapid crop loss claim settlement."
    ],
    benefitsMr: [
      "शेतकऱ्यांसाठी अत्यंत कमी हप्ता: खरीप पिकांसाठी २.०%, रब्बी पिकांसाठी १.५%.",
      "उत्पन्न घट, दुष्काळ, अवकाळी पाऊस व स्थानिक आपत्तींवर संपूर्ण विमा भरपाई.",
      "उपग्रह व उपकरणांच्या साहाय्याने जलद नुकसान भरपाई वाटप."
    ],
    eligibilitySummary: [
      "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
      "Compulsory for loanee farmers opting in, voluntary for non-loanee farmers.",
      "Application must be submitted before seasonal deadline (Kharif / Rabi cutoff)."
    ],
    eligibilitySummaryMr: [
      "अधिसूचित क्षेत्रात अधिसूचित पिके घेणारे सर्व शेतकरी (बटईदार शेतकऱ्यांसह).",
      "कर्जदार व बिगर-कर्जदार सर्व शेतकऱ्यांसाठी अर्ज खुला.",
      "हंगामी अंतिम मुदतीपूर्वी अर्ज करणे आवश्यक."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Land Record (7/12 extract / Possession certificate)",
      "Sowing Certificate issued by Gram Panchayat / Talathi",
      "Cancelled Bank Cheque / Passbook copy"
    ],
    documentsRequiredMr: [
      "आधार कार्ड",
      "७/१२ व ८-अ उतारा",
      "ग्रामपंचायत / तलाठी पिकाचे पीक पाहणी प्रमाणपत्र",
      "बँक पासबुक प्रत / रद्द केलेला चेक"
    ],
    howToApplySteps: [
      "Visit pmfby.gov.in or download the Crop Insurance App.",
      "Click 'Farmer Corner' → 'Apply for Crop Insurance'.",
      "Select State (Maharashtra), District (Ahmednagar), Block (Kopargaon).",
      "Select notified crop (Cotton / Sugarcane / Onion) and land area.",
      "Calculate premium using Insurance Calculator and pay premium online."
    ],
    howToApplyStepsMr: [
      "pmfby.gov.in पोर्टलवर जा किंवा Crop Insurance ॲप वापरा.",
      "महाराष्ट्र, अहिल्यानगर जिल्हा व कोपरगाव तालुका निवडा.",
      "आपले पीक (कापूस / ऊस / कांदा) व क्षेत्रफळ प्रविष्ट करा.",
      "विमा हप्ता ऑनलाईन भरा व पावती डाऊनलोड करा."
    ],
    officialUrl: "https://pmfby.gov.in/",
    officialSourceName: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["drought", "rain", "pest"]
  },
  {
    id: "wbcis",
    name: "Weather Based Crop Insurance Scheme",
    nameMr: "हवामान आधारित पीक विमा योजना (WBCIS)",
    shortName: "WBCIS",
    typeLabel: "WEATHER INSURANCE COMPONENT",
    typeLabelMr: "हवामान विमा घटक",
    category: "climate",
    categoryLabel: "Weather & Climate Risk",
    categoryLabelMr: "हवामान व हवामान धोका",
    categoryIcon: "🌦️",
    summary:
      "Insurance protection against specified adverse weather conditions like deficit rainfall, excess rain, extreme temperatures, and high humidity that adversely affect crop production.",
    summaryMr:
      "पावसाचा खंड, अतिवृष्टी, तीव्र उकाडा व जास्त आद्रता यांसारख्या प्रतिकूल हवामान घटकांमुळे होणाऱ्या नुकसानीपासून स्वयंचलित भरपाई देणारी योजना.",
    benefits: [
      "Parametric weather index payout based on objective weather data recorded at automated weather stations.",
      "Protection against drought, heat stress, unseasonal rainfall, and high humidity spells.",
      "Fast claim processing without requiring individual field crop-cutting estimates."
    ],
    benefitsMr: [
      "स्वयंचलित हवामान केंद्रातील नोंदीनुसार थेट विमा भरपाई जमा.",
      "वैयक्तिक शेत पाहणीशिवाय जलद दावे मंजूर.",
      "दुष्काळ, उकाडा व अतिवृष्टीपासून संपूर्ण रक्षण."
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
    nameMr: "प्रधानमंत्री कृषी सिंचन योजना — प्रति थेंब अधिक पीक",
    shortName: "PMKSY — Per Drop More Crop",
    typeLabel: "IRRIGATION SCHEME",
    typeLabelMr: "सिंचन योजना अनुदान",
    category: "irrigation",
    categoryLabel: "Irrigation / Water Efficiency",
    categoryLabelMr: "सिंचन व पाणी बचत",
    categoryIcon: "💧",
    summary:
      "National irrigation scheme focusing on micro-irrigation systems (drip and sprinkler technologies) to maximize water-use efficiency and crop productivity.",
    summaryMr:
      "ठिबक व तुषार सिंचन पद्धतीचा अवलंब करून पाणी बचत व पीक उत्पादन वाढवण्यासाठी ५५% पर्यंत शासकीय अनुदान देणारी योजना.",
    benefits: [
      "Up to 55% subsidy for small and marginal farmers and 45% for other farmers on Drip & Sprinkler irrigation installations.",
      "Water saving up to 40–50% compared to flood irrigation, reducing weed growth and labor costs.",
      "Higher yield and fertigation efficiency by delivering nutrients directly to plant root zones."
    ],
    benefitsMr: [
      "लहान व अल्पभूधारक शेतकऱ्यांना ठिबक/तुषार संचावर ५५% अनुदान.",
      "पाटाच्या पाण्यापेक्षा ४०-५०% पाण्याची बचत व तण नियंत्रण.",
      "खाते थेट मुळांपर्यंत देऊन खतांची मोठी बचत."
    ],
    eligibilitySummary: [
      "Farmers owning cultivable land with an assured water source (Well, Borewell, Canal).",
      "Co-operative societies, Self Help Groups, and Panchayats are also eligible.",
      "Applicable for row crops like Cotton, Sugarcane, Onion, and horticultural crops."
    ],
    eligibilitySummaryMr: [
      "विहीर, कूपनलिका किंवा कालवा यांसारखा पाण्याचा स्रोत असणारे शेतकरी.",
      "ऊस, कांदा, कापूस व फळबाग उत्पादक शेतकऱ्यांसाठी उपलब्ध."
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
    howToApplyStepsMr: [
      "महाराष्ट्र महाडीबीटी पोर्टल (mahadbt.maharashtra.gov.in) वर जा.",
      "'सिंचन योजना' → 'प्रति थेंब अधिक पीक (सूक्ष्म सिंचन)' निवडा.",
      "७/१२ उतारा व पाण्याचा दाखला अपलोड करा.",
      "मान्यप्राप्त ठिबक कंपनीचे कोटेशन जोडून अर्ज सादर करा."
    ],
    officialUrl: "https://mahadbt.maharashtra.gov.in/Farmer/SchemeData/SchemeData?str=E9DDFA703C38E51AC7B56240D6D84F28",
    officialSourceName: "MahaDBT Farmer Portal & Agriculture Department, Govt. of Maharashtra",
    lastVerified: "August 2026",
    disruptionTags: ["water", "drought"]
  },
  {
    id: "atal-bhujal",
    name: "Atal Bhujal Yojana — Groundwater Reference",
    nameMr: "अटल भूजल योजना — भूजल व्यवस्थापन",
    shortName: "Atal Bhujal Yojana",
    typeLabel: "GROUNDWATER MANAGEMENT REFERENCE",
    typeLabelMr: "भूजल व्यवस्थापन संदर्भ",
    category: "groundwater",
    categoryLabel: "Groundwater & Water Security",
    categoryLabelMr: "भूजल व पाणी सुरक्षा",
    categoryIcon: "💧",
    programmePeriod: "Programme Period: 2020–2025",
    summary:
      "Community-led sustainable groundwater management programme implemented across water-stressed areas to strengthen water budgeting, artificial recharge, and water conservation.",
    summaryMr:
      "भूजल पातळी वाढवण्यासाठी, पुनर्भरणासाठी व पाणी अंदाजपत्रक तयार करण्यासाठी समुदाय संचलित भूजल योजना.",
    benefits: [
      "Community water budgeting and rainwater harvesting asset creation.",
      "Groundwater recharge structure guidelines (percolation tanks, check dams, recharge shafts).",
      "Support for efficient crop water planning in over-exploited and semi-critical groundwater blocks."
    ],
    benefitsMr: [
      "गाव पातळीवर पाणी अंदाजपत्रक व पाऊस पाणी साठवण प्रकल्प.",
      "भूजल पुनर्भरणासाठी शोषखड्डे, पाझर तलाव व बंधारे मार्गदर्शन.",
      "कमी पाणी असणाऱ्या भागात पीक पाणी नियोजन पाठबळ."
    ],
    eligibilitySummary: [
      "Reference programme implemented in selected water-stressed Gram Panchayats in Maharashtra (2020–2025).",
      "For active individual drip/sprinkler subsidies, see PMKSY — Per Drop More Crop."
    ],
    eligibilitySummaryMr: [
      "महाराष्ट्रातील निवडक टंचाईग्रस्त ग्रामपंचायतींमध्ये राबवलेला कार्यक्रम."
    ],
    documentsRequired: [
      "Gram Panchayat Water Budgeting Plan",
      "Village Water Security Plan reference"
    ],
    documentsRequiredMr: [
      "ग्रामपंचायत पाणी सुरक्षा योजना प्रत"
    ],
    howToApplySteps: [
      "Review official Maharashtra GSDA groundwater reports at gsda.maharashtra.gov.in.",
      "Participate in Gram Panchayat water security and water budgeting meetings.",
      "Adopt micro-irrigation via PMKSY for individual farm water saving."
    ],
    howToApplyStepsMr: [
      "gsda.maharashtra.gov.in वर भूजल अहवाल पहा.",
      "ग्रामपंचायत पाणी अंदाजपत्रक बैठकांमध्ये सहभागी व्हा."
    ],
    officialUrl: "https://gsda.maharashtra.gov.in/en-atal-bhujal-project/",
    officialSourceName: "Groundwater Surveys & Development Agency (GSDA), Govt. of Maharashtra",
    lastVerified: "August 2026",
    disruptionTags: ["water"]
  },
  {
    id: "soil-health-card",
    name: "Soil Health Card Scheme",
    nameMr: "मृदा आरोग्य पत्रिका योजना (Soil Health Card)",
    shortName: "Soil Health Card",
    typeLabel: "SOIL HEALTH SERVICE",
    typeLabelMr: "माती परीक्षण सेवा",
    category: "soil",
    categoryLabel: "Soil Health / Nutrient Management",
    categoryLabelMr: "माती आरोग्य व खत व्यवस्थापन",
    categoryIcon: "🌱",
    summary:
      "Government initiative issuing soil health cards to farmers containing nutrient status across 12 vital parameters with customized fertilizer recommendations.",
    summaryMr:
      "मातीतील १२ मुख्य घटकांची मोफत तपासणी करून पिकांनुसार संतुलित खत वापराची शिफारस करणारी मृदा आरोग्य पत्रिका.",
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
    benefitsMr: [
      "पिकानुसार खतांची अचूक मात्रा मिळाल्यामुळे २०% खत खर्चाची बचत.",
      "जमिनीचा सामू (pH) व सेंद्रिय कर्ब तपासून मातीची सुपीकता जपणे.",
      "प्रत्येक २-३ वर्षांनी मोफत माती नमुना तपासणी व कार्ड."
    ],
    eligibilitySummary: [
      "All landholding farmers across Kopargaon and Maharashtra talukas.",
      "Soil samples collected systematically by district agriculture department staff."
    ],
    eligibilitySummaryMr: [
      "कोपरगाव व महाराष्ट्रातील सर्व जमीनधारक शेतकरी पात्र."
    ],
    documentsRequired: [
      "Land survey number / 7/12 extract",
      "Aadhaar Card",
      "Mobile number for SMS Soil Test Report delivery"
    ],
    documentsRequiredMr: [
      "७/१२ उतारा व गट नंबर",
      "आधार कार्ड व मोबाईल नंबर"
    ],
    howToApplySteps: [
      "Visit soilhealth.dac.gov.in or contact local Krishi Vigyan Kendra (KVK).",
      "Request soil sampling for your survey number or track existing sample status.",
      "View digital Soil Health Card report online by entering State, District, and Village.",
      "Apply recommended NPK + Micronutrient doses during field preparation."
    ],
    howToApplyStepsMr: [
      "soilhealth.dac.gov.in वर जा किंवा कृषी विज्ञान केंद्राशी संपर्क साधा.",
      "आपल्या शेतातील माती नमुना देऊन तपासणी अहवाल ऑनलाईन डाऊनलोड करा."
    ],
    officialUrl: "https://soilhealth.dac.gov.in/",
    officialSourceName: "Department of Agriculture & Farmers Welfare, Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["inputs"]
  },
  {
    id: "ipm",
    name: "Integrated Pest Management Programme",
    nameMr: "एकात्मिक कीड व्यवस्थापन कार्यक्रम (IPM)",
    shortName: "Integrated Pest Management (IPM)",
    typeLabel: "GOVERNMENT PROGRAMME",
    typeLabelMr: "शासकीय कृषी कार्यक्रम",
    category: "pest-disease",
    categoryLabel: "Crop Disease & Pest Management",
    categoryLabelMr: "पीक संरक्षण व कीड नियंत्रण",
    categoryIcon: "🐛",
    summary:
      "Ecological pest management approach combining biological control, mechanical traps, cultural practices, and judicious chemical pesticide usage below economic threshold levels.",
    summaryMr:
      "जैविक नियंत्रक, कामगंध सापळे व योग्य औषध फवारणीच्या साहाय्याने पिकांवरील कीड-रोगांचे पर्यावरणपूरक नियंत्रण.",
    benefits: [
      "Minimizes chemical pesticide residue on food crops while preserving natural beneficial predator insects.",
      "Prevents pest resistance development in Cotton (Bollworm/Whitefly), Sugarcane (Borer/Smut), and Onion (Thrips).",
      "Free field scout training and demonstration through Central IPM Centers and KVKs."
    ],
    benefitsMr: [
      "कापूस बोंडअळी, ऊस तांबेरा व कांदा फुलकिड्यांवर प्रभावी नैसर्गिक नियंत्रण.",
      "रासायनिक फवारण्यांचा खर्च कमी करून मित्रकीटकांचे जतन.",
      "कृषी विज्ञान केंद्राद्वारे मोफत प्रात्यक्षिके व प्रशिक्षण."
    ],
    eligibilitySummary: [
      "All farmers growing field crops and horticultural crops.",
      "Guidance available through Directorate of Plant Protection, Quarantine & Storage (PPQS)."
    ],
    eligibilitySummaryMr: [
      "सर्व पीक व फळबाग उत्पादक शेतकरी पात्र."
    ],
    documentsRequired: [
      "No formal documents required for technical guidance and IPM field school participation."
    ],
    documentsRequiredMr: [
      "कागदपत्रांची अट नाही — थेट शेतकरी मार्गदर्शन."
    ],
    howToApplySteps: [
      "Visit ppqs.gov.in or contact nearest Krishi Vigyan Kendra.",
      "Adopt yellow/blue sticky traps and pheromone traps for pest monitoring.",
      "Use bio-pesticides (Neem oil, Trichoderma, Pseudomonas) before applying chemical sprays."
    ],
    howToApplyStepsMr: [
      "पिवळे/निळे चिकट सापळे व कामगंध सापळे शेतात लावा.",
      "निंबोळी अर्क, ट्रायकोडर्मा व सेंद्रिय बुरशीनाशकांचा प्राथमिक वापर करा."
    ],
    officialUrl: "https://ppqs.gov.in/",
    officialSourceName: "Directorate of Plant Protection, Quarantine & Storage (PPQS), Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["pest"]
  },
  {
    id: "npss",
    name: "National Pest Surveillance System",
    nameMr: "राष्ट्रीय कीड पाहणी प्रणाली (NPSS)",
    shortName: "NPSS",
    typeLabel: "GOVERNMENT AGRICULTURAL SERVICE",
    typeLabelMr: "शासकीय कृषी सेवा",
    category: "monitoring",
    categoryLabel: "Crop & Pest Monitoring",
    categoryLabelMr: "कीड व रोग निगा देखरेख",
    categoryIcon: "📡",
    summary:
      "AI/ML-enabled national digital surveillance platform developed by ICAR-NCIPM for pest identification, disease diagnostic surveillance, and rapid crop protection advisories.",
    summaryMr:
      "कृत्रिम बुद्धिमत्ता (AI) आधारित ॲपद्वारे कीड व रोगाचा फोटो काढून अचूक निदान व आयसीएआर (ICAR) शास्त्रज्ञांचा थेट सल्ला मिळवणारी प्रणाली.",
    benefits: [
      "AI-assisted instant pest and disease photo identification on mobile devices.",
      "Geo-tagged real-time pest outbreak alerts for neighboring talukas and districts.",
      "Direct connection with ICAR plant protection scientists for expert advisories."
    ],
    benefitsMr: [
      "मोबाईलवरून पानाचा फोटो काढून त्वरित रोग ओळख.",
      "शेजारील तालुक्यांमधील कीड प्रादुर्भावाचे पूर्व इशारे.",
      "कृषी शास्त्रज्ञांकडून मोफत मार्गदर्शन."
    ],
    eligibilitySummary: [
      "Free digital agricultural service open to all farmers, agricultural extension officers, and scientists."
    ],
    eligibilitySummaryMr: [
      "सर्व शेतकऱ्यांसाठी मोफत डिझिटल सेवा."
    ],
    documentsRequired: [
      "Smartphone with camera and internet connectivity."
    ],
    documentsRequiredMr: [
      "कॅमेरा व इंटरनेट असलेला स्मार्टफोन"
    ],
    howToApplySteps: [
      "Visit nriipm.res.in or download the NPSS App from Google Play Store.",
      "Register with Mobile Number and location (Ahmednagar / Kopargaon).",
      "Upload leaf disease/pest photo to receive AI diagnostic feedback and ICAR guidance."
    ],
    howToApplyStepsMr: [
      "Google Play Store वरून NPSS App डाऊनलोड करा.",
      "मोबाईल नंबर टाकून नोंदणी करा व फोटो अपलोड करून सल्ला मिळवा."
    ],
    officialUrl: "https://nriipm.res.in/",
    officialSourceName: "ICAR — National Research Centre for Integrated Pest Management",
    lastVerified: "August 2026",
    disruptionTags: ["pest"]
  },
  {
    id: "enam",
    name: "National Agriculture Market (e-NAM)",
    nameMr: "राष्ट्रीय कृषी बाजार (e-NAM)",
    shortName: "e-NAM",
    typeLabel: "GOVERNMENT PLATFORM",
    typeLabelMr: "शासकीय व्यापार पोर्टल",
    category: "market",
    categoryLabel: "Market Access",
    categoryLabelMr: "बाजारपेठ व भाव माहिती",
    categoryIcon: "🏪",
    summary:
      "Pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities with transparent price discovery.",
    summaryMr:
      "देशभरातील बाजार समित्यांना जोडणारे ऑनलाईन पोर्टल — कांदा, कापूस व धान्याला स्पर्धात्मक व पारदर्शक बाजारभाव मिळवून देणारी यंत्रणा.",
    benefits: [
      "Access to nationwide buyers and mandis ensuring competitive and transparent bidding.",
      "Real-time mandi price updates, arrival data, and quality testing parameters.",
      "Direct online payment to farmer's bank account avoiding intermediary delays."
    ],
    benefitsMr: [
      "देशभरातील खरेदीदारांकडून ऑनलाईन लिलाव व चांगला भाव.",
      "थेट बँक खात्यात ऑनलाईन पैसे जमा, मध्यस्थांची कपात नाही.",
      "बाजार समित्यांमधील रोजचे थेट बाजारभाव."
    ],
    eligibilitySummary: [
      "All farmers, FPOs (Farmer Producer Organizations), and traders registered at e-NAM integrated APMC mandis.",
      "Registration is free for all farmers."
    ],
    eligibilitySummaryMr: [
      "कोपरगाव व शिर्डी बाजार समितीत नोंदणीकृत सर्व शेतकरी पात्र."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Bank Account details (Passbook / Cheque)",
      "APMC Mandi Registration ID / Mobile Number"
    ],
    documentsRequiredMr: [
      "आधार कार्ड व बँक पासबुक",
      "बाजार समिती नोंदणी / मोबाईल नंबर"
    ],
    howToApplySteps: [
      "Visit enam.gov.in or download the e-NAM Mobile App.",
      "Click 'Registration' → Select 'Farmer'.",
      "Fill personal details, APMC mandi choice (e.g. Kopargaon APMC), and bank details.",
      "Upload produce details (Cotton / Sugarcane / Onion) for e-bidding.",
      "Receive direct payment in bank account upon bid confirmation."
    ],
    howToApplyStepsMr: [
      "enam.gov.in वर जा किंवा e-NAM App डाऊनलोड करा.",
      "कोपरगाव APMC निवडून शेतकरी नोंदणी करा.",
      "आपला माल (कांदा / कापूस) लिलावासाठी प्रविष्ट करा."
    ],
    officialUrl: "https://enam.gov.in/",
    officialSourceName: "Small Farmers' Agribusiness Consortium (SFAC), Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["market"]
  },
  {
    id: "mgnrega",
    name: "Mahatma Gandhi National Rural Employment Guarantee Scheme",
    nameMr: "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार हमी योजना (मनरेगा)",
    shortName: "MGNREGA",
    typeLabel: "RURAL EMPLOYMENT & ASSET PROGRAMME",
    typeLabelMr: "रोजगार हमी योजना",
    category: "employment",
    categoryLabel: "Rural Employment & Labour",
    categoryLabelMr: "ग्रामीण रोजगार व मजूर",
    categoryIcon: "👷",
    summary:
      "National social security scheme guaranteeing 100 days of wage employment per financial year to rural households, while building community assets for water conservation and land development.",
    summaryMr:
      "ग्रामीण भागातील कुटुंबांना वर्षाला १०० दिवसांचा हक्काचा रोजगार आणि शेततळी, बांध घालणे व जलसंधारणाची कामे देणारी योजना.",
    benefits: [
      "Guaranteed wage employment for rural households for up to 100 days per year.",
      "Funding for rural asset creation: farm ponds, check dams, trenching, and soil conservation.",
      "Direct wage credit to Aadhaar-seeded bank/post office accounts."
    ],
    benefitsMr: [
      "वर्षाला १०० दिवस हक्काचा मजुरी रोजगार.",
      "शेततळे, दगडी बांध, चर खोदणे व वृक्षारोपण कामांसाठी निधी.",
      "मजुरी थेट बँक खात्यात जमा."
    ],
    eligibilitySummary: [
      "Adult members of rural households residing in Gram Panchayat area willing to do unskilled manual work."
    ],
    eligibilitySummaryMr: [
      "ग्रामपंचायत क्षेत्रातील अकुशल काम करण्यास तयार असणारे नागरिक."
    ],
    documentsRequired: [
      "MGNREGA Job Card",
      "Aadhaar Card",
      "Bank/Post Office Account details"
    ],
    documentsRequiredMr: [
      "मनरेगा जॉब कार्ड",
      "आधार कार्ड व बँक खाते"
    ],
    howToApplySteps: [
      "Visit nrega.nic.in or apply at local Gram Panchayat office.",
      "Submit application for Job Card issuance with household details.",
      "Submit written application for work to Gram Panchayat / Programme Officer."
    ],
    howToApplyStepsMr: [
      "ग्रामपंचायत कार्यालयात जॉब कार्डसाठी अर्ज करा.",
      "कामाची मागणी अर्ज ग्रामसेवकाकडे सादर करा."
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
    nameMr: "प्रधानमंत्री मत्स्य संपदा योजना (मत्स्यपालन)",
    shortName: "PMMSY (Fish Farming / Aquaculture)",
    typeLabel: "ALLIED BUSINESS SUBSIDY SCHEME",
    typeLabelMr: "पूरक व्यवसाय अनुदान",
    category: "side-income",
    categoryLabel: "Side Income / Allied Business",
    categoryLabelMr: "पूरक व्यवसाय व जोडधंदा",
    categoryIcon: "🐟",
    summary:
      "Flagship scheme for holistic development of fisheries and aquaculture, providing 40% to 60% capital subsidy for farm pond fish culture, biofloc units, and fish seed hatcheries.",
    summaryMr:
      "शेततळ्यात मत्स्यपालनासाठी ४०% ते ६०% शासकीय भांडवली अनुदान देणारी पूरक उत्पन्न योजना (वार्षिक ₹१.५ ते ₹३ लाख अतिरिक्त उत्पन्न).",
    benefits: [
      "40% capital subsidy for general category farmers and 60% for SC/ST/Women farmers on farm pond fish farming.",
      "Generate ₹1.5 Lakh to ₹3.0 Lakh additional annual side income from farm ponds or re-circulatory aquaculture units.",
      "Financial assistance for purchasing fingerlings, fish feed, aerators, and fish transport vehicles."
    ],
    benefitsMr: [
      "सर्वसाधारण शेतकऱ्यांना ४०% तर महिला व मागासवर्गीय शेतकऱ्यांना ६०% अनुदान.",
      "शेततळ्यातून वर्षाला ₹१.५ ते ₹३ लाख अतिरिक्त पूरक उत्पन्न.",
      "माशांचे बोटुक, खाद्य व एरेटर खरेदीसाठी अर्थसहाय्य."
    ],
    eligibilitySummary: [
      "Individual farmers, landholders with farm ponds or willing to construct aquaculture ponds, SHGs, and Co-operatives.",
      "Special incentives for women farmers and small landholders in rural areas."
    ],
    eligibilitySummaryMr: [
      "स्वतःचे शेततळे असणारे किंवा नवीन तळे खोदण्यास तयार शेतकरी."
    ],
    documentsRequired: [
      "Aadhaar Card",
      "7/12 Land Extract or Farm Pond Ownership Certificate",
      "Bank Account details",
      "DPR (Detailed Project Report) for aquaculture unit"
    ],
    documentsRequiredMr: [
      "आधार कार्ड व ७/१२ उतारा (शेततळे नोंद)",
      "बँक पासबुक व प्रकल्प अहवाल (DPR)"
    ],
    howToApplySteps: [
      "Visit official portal pmmsy.dof.gov.in or contact District Fisheries Office.",
      "Register online under 'Farmer / Beneficiary Registration'.",
      "Select project component (Farm Pond Fish Culture / Biofloc / Re-circulatory System).",
      "Submit DPR along with land documents for District Level Committee sanction."
    ],
    howToApplyStepsMr: [
      "pmmsy.dof.gov.in वर जा किंवा जिल्हा मत्स्यव्यवसाय कार्यालयाशी संपर्क साधा.",
      "शेततळे मत्स्यपालन घटक निवडून ऑनलाईन अर्ज करा."
    ],
    officialUrl: "https://pmmsy.dof.gov.in/",
    officialSourceName: "Department of Fisheries, Ministry of Fisheries, Animal Husbandry & Dairying, Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["side-income"]
  },
  {
    id: "nlm",
    name: "National Livestock Mission & AHIDF",
    nameMr: "राष्ट्रीय पशुधन अभियान व दुग्धव्यवसाय अनुदान (NLM)",
    shortName: "National Livestock Mission (Goat/Poultry/Dairy)",
    typeLabel: "ALLIED BUSINESS SUBSIDY SCHEME",
    typeLabelMr: "पशुपालन व पूरक व्यवसाय अनुदान",
    category: "side-income",
    categoryLabel: "Side Income / Allied Business",
    categoryLabelMr: "पूरक व्यवसाय व जोडधंदा",
    categoryIcon: "🐐",
    summary:
      "Government subsidy programme providing up to 50% capital subsidy (up to ₹25 Lakh to ₹50 Lakh) for setting up Goat/Sheep breeding farms, Poultry units, and Dairy value addition enterprises.",
    summaryMr:
      "शेळी-मेंढी पालन, कुक्कुटपालन (गावठी कोंबडी) व दुग्ध व्यवसायासाठी ५०% पर्यंत थेट भांडवली अनुदान देणारी योजना.",
    benefits: [
      "50% capital subsidy directly released to beneficiary bank account for Goat, Sheep, and Country Chicken breeding units.",
      "3% interest subvention under AHIDF (Animal Husbandry Infrastructure Development Fund) for dairy processing and cattle feed units.",
      "Provides steady daily/monthly supplementary side income to buffer against crop failure risks."
    ],
    benefitsMr: [
      "शेळीपालन व कुक्कुटपालनासाठी ५०% थेट भांडवली अनुदान.",
      "दुग्ध व्यवसाय व गोठा बांधकामासाठी ३% व्याज सवलत.",
      "पिकांचे नुकसान झाल्यास दैनंदिन/मासिक शाश्वत पूरक उत्पन्न."
    ],
    eligibilitySummary: [
      "Individual farmers, FPOs, Self Help Groups, and Joint Liability Groups.",
      "Requires land availability for shed construction and fodder cultivation."
    ],
    eligibilitySummaryMr: [
      "शेळीगोठा किंवा पोल्ट्री शेड उभारणीसाठी जागा असणारे शेतकरी."
    ],
    documentsRequired: [
      "Aadhaar Card & PAN Card",
      "Land Ownership / Lease Agreement",
      "Bank Loan Sanction Letter (for bank-linked subsidy)",
      "Project Training Certificate from KVK / Veterinary College"
    ],
    documentsRequiredMr: [
      "आधार व पॅन कार्ड",
      "जागेचा ७/१२ व पशुसंवर्धन प्रशिक्षण प्रमाणपत्र"
    ],
    howToApplySteps: [
      "Visit official portal nlm.udyamimitra.in or ahidf.udyamimitra.in.",
      "Apply online under 'Entrepreneurship Development Programme'.",
      "Upload Project Report, Land documents, and Bank Details.",
      "State Level Executive Committee scrutinizes and sanctions subsidy."
    ],
    howToApplyStepsMr: [
      "nlm.udyamimitra.in पोर्टलवर ऑनलाईन अर्ज करा.",
      "प्रकल्प अहवाल व ७/१२ जोडून अर्ज सादर करा."
    ],
    officialUrl: "https://nlm.udyamimitra.in/",
    officialSourceName: "Department of Animal Husbandry & Dairying, Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["side-income"]
  },
  {
    id: "pmfme",
    name: "PM Formalisation of Micro Food Processing Enterprises",
    nameMr: "प्रधानमंत्री सूक्ष्म अन्न प्रक्रिया उद्योग योजना (PMFME)",
    shortName: "PMFME (Agri-Food Processing / Jaggery / Storage)",
    typeLabel: "AGRI-BUSINESS SUBSIDY SCHEME",
    typeLabelMr: "कृषी प्रक्रिया उद्योग अनुदान",
    category: "side-income",
    categoryLabel: "Side Income / Allied Business",
    categoryLabelMr: "पूरक व्यवसाय व जोडधंदा",
    categoryIcon: "🏭",
    summary:
      "Scheme offering 35% credit-linked capital subsidy (up to ₹10 Lakh) for setting up micro food processing units (Onion storage/processing, Jaggery making, Sugarcane juice bottling, Spices grinding, Cotton seed oil).",
    summaryMr:
      "कांदा साठवणूक/प्रक्रिया, गूळ निर्मिती, ऊस रस बॉटलींग व मसाले उद्योगासाठी ३५% (₹१० लाखांपर्यंत) शासकीय अनुदान.",
    benefits: [
      "35% capital credit-linked subsidy up to ₹10 Lakh for individual micro-food processing units.",
      "Up to ₹40,000 seed capital per SHG member for working capital and small tool purchase.",
      "Transforms raw produce into high-value packaged goods for local mandis and supermarket supply."
    ],
    benefitsMr: [
      "कांदा प्रक्रिया व गूळ निर्मिती उद्योगासाठी ३५% (₹१० लाख) अनुदान.",
      "कच्च्या मालावर प्रक्रिया करून दुप्पट नफा मिळवण्याची संधी.",
      "बँक कर्ज व ब्रँडिंगसाठी शासकीय मदत."
    ],
    eligibilitySummary: [
      "Existing or new micro food processing entrepreneurs, individual farmers, SHGs, and Farmer Producer Companies (FPCs)."
    ],
    eligibilitySummaryMr: [
      "अन्न प्रक्रिया उद्योग सुरू करू इच्छिणारे शेतकरी व बचत गट."
    ],
    documentsRequired: [
      "Aadhaar & PAN Card",
      "Udyam Registration Certificate",
      "Bank Account statement & Project Cost Quotation",
      "FSSAI license registration (guidance provided)"
    ],
    documentsRequiredMr: [
      "आधार, पॅन कार्ड व उद्यम नोंदणी",
      "बँक पासबुक व मशिनरी कोटेशन"
    ],
    howToApplySteps: [
      "Visit official PMFME portal at pmfme.mofpi.gov.in.",
      "Click 'Sign Up' → Select 'Individual Micro Enterprise'.",
      "Fill online application form and upload land / equipment machinery quote.",
      "District Resource Person (DRP) assists in bank loan application and subsidy disbursal."
    ],
    howToApplyStepsMr: [
      "pmfme.mofpi.gov.in पोर्टलवर जा.",
      "जिल्हा संसाधन व्यक्ती (DRP) च्या मदतीने ऑनलाईन अर्ज भरा."
    ],
    officialUrl: "https://pmfme.mofpi.gov.in/",
    officialSourceName: "Ministry of Food Processing Industries (MoFPI), Govt. of India",
    lastVerified: "August 2026",
    disruptionTags: ["side-income", "market"]
  }
];
