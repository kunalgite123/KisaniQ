export type Language = "en" | "mr";

export const translations = {
  en: {
    // Navigation
    nav_dashboard: "Dashboard",
    nav_crop: "Crop Doctor",
    nav_climate: "Climate",
    nav_water: "Water & Soil",
    nav_machinery: "Labour & Machinery",
    nav_schemes: "Schemes",
    nav_advisory: "Advisory",

    nav_desc_dashboard: "Farm overview & today's intelligence",
    nav_desc_crop: "Crop health & disease detection",
    nav_desc_climate: "Weather & climate risk",
    nav_desc_water: "Groundwater & soil intelligence",
    nav_desc_machinery: "Rent & list farm equipment & labour",
    nav_desc_schemes: "Government agriculture schemes",
    nav_desc_advisory: "AI-powered recommendations",

    // Titles & Breadcrumbs
    title_dashboard: "Dashboard Overview",
    title_crop: "Crop Doctor",
    title_climate: "Climate & Weather",
    title_water: "Water & Soil Intelligence",
    title_machinery: "Labour & Machinery Monitoring",
    title_schemes: "Agriculture Schemes",
    title_advisory: "AI Farm Advisory",

    // Top Navbar & Controls
    location_label: "Kopargaon (Taluka Centre)",
    live_data: "Live Data",
    systems_operational: "Systems Operational",
    main_navigation: "Main Navigation",
    farm_location: "Farm Location",
    district_name: "Ahilyanagar, MH",
    system_status_online: "Krishi Setu AI Online",
    all_systems_ok: "All systems operational",

    // Crop Doctor Section
    crop_doctor_title: "Crop Doctor",
    crop_doctor_subtitle: "Detect crop stress and disease using on-device AI neural networks & symptom matching",
    edge_ai_ready: "🟢 Edge AI Ready",
    observed_symptoms_label: "Select Observed Symptom (Colour + Condition)",
    clear_symptom: "✕ Clear Symptom Selection",
    upload_photo: "📁 Upload Photo",
    use_camera: "📷 Use Camera",
    capture_scan: "⚡ Capture & Scan",
    stop_camera: "Stop",
    diagnostic_output: "Diagnostic Output",
    symptom_verified: "🔍 Symptom Verified",
    edge_privacy_notice: "🔒 Krishi Setu Edge Privacy: Neural networks run 100% locally inside your web browser via TensorFlow.js — no leaf photos leave your device.",

    // Crops
    crop_cotton: "🌾 Cotton",
    crop_sugarcane: "🎋 Sugarcane",
    crop_onion: "🧅 Onion",

    // Climate & Weather Section
    weather_title: "7-Day Forecast & Risk Metrics",
    dry_days: "Dry days forecast (rainfall <1mm)",
    heat_stress_days: "Heat stress days forecast (>38°C)",
    humidity_label: "Avg. humidity (24h fungal risk proxy)",
    date_col: "Date",
    temp_col: "Max / Min Temp",
    rain_col: "Expected Rain",
    chance_col: "Precipitation Chance",
    status_col: "Day Status",
    dry_day: "Dry Day",
    rain_expected: "Rain Expected",
    field_action_impact: "Field Action Impact",
    irrigation_impact: "💧 Irrigation Impact",
    spray_impact: "🐛 Spraying & Pest Impact",

    // Water & Soil Section
    water_soil_title: "Groundwater & Soil Intelligence",
    groundwater_level: "Groundwater Level",
    soil_ph: "Soil pH",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    organic_carbon: "Organic Carbon",
    normal: "Normal",
    optimal: "Optimal",
    medium: "Medium",

    // Labour & Machinery Section
    machinery_title: "Labour & Machinery Monitoring",
    machinery_subtitle: "Community rental network for farm equipment, harvesters, tractors & skilled labour gangs in Kopargaon",
    browse_tab: "🔍 Browse Available Equipment & Labour",
    my_bookings_tab: "📋 My Rental Requests",
    list_machine_btn: "➕ List Your Machine / Labour Team",
    rent_machine_btn: "🚜 Rent Machine",
    call_owner_btn: "📞 Call",
    all_categories: "All",
    tractors: "🚜 Tractors",
    harvesters: "🌾 Harvesters",
    implements: "⚙️ Implements",
    sprayers: "💨 Sprayers",
    labour_crews: "👨‍🌾 Labour Crews",
    available_now: "Available Now",
    per_hour: "hour",
    per_day: "day",
    per_acre: "acre",

    // Advisory & Schemes
    active_recommendations: "4 Active Recommendations",
    action_schedule: "Krishi Setu AI Engine Output · Action Schedule",
    categorized_actions: "Categorized Action Items",
    gov_schemes_title: "Government Agriculture Schemes",
    pm_kisan_title: "PM-KISAN Samman Nidhi",
    drip_subsidy_title: "Micro-Irrigation Subsidy (MUKRIS)",
    crop_insurance_title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)"
  },
  mr: {
    // Navigation
    nav_dashboard: "मुख्यपृष्ठ",
    nav_crop: "पीक डॉक्टर",
    nav_climate: "हवामान",
    nav_water: "पाणी व माती",
    nav_machinery: "मजूर व यंत्रसामग्री",
    nav_schemes: "शासकीय योजना",
    nav_advisory: "सल्लागार",

    nav_desc_dashboard: "शेतीचा आढावा व आजची महत्त्वाची माहिती",
    nav_desc_crop: "पीक आरोग्य व रोग निदान तंत्रज्ञान",
    nav_desc_climate: "हवामान अंदाज व धोक्याचे विश्लेषण",
    nav_desc_water: "भूजल पातळी व माती परीक्षण माहिती",
    nav_desc_machinery: "शेती अवजारे व मजूर भाड्याने मिळण्याचे केंद्र",
    nav_desc_schemes: "शासकीय कृषी योजना व अनुदान",
    nav_desc_advisory: "एआय आधारित शेती सल्लागार तंत्रज्ञान",

    // Titles & Breadcrumbs
    title_dashboard: "मुख्यपृष्ठ आढावा",
    title_crop: "पीक डॉक्टर (रोग निदान)",
    title_climate: "हवामान व हवामान धोका",
    title_water: "भूजल व माती आरोग्य माहिती",
    title_machinery: "मजूर व यंत्रसामग्री व्यवस्थापन",
    title_schemes: "शासकीय कृषी योजना",
    title_advisory: "एआय शेती सल्लागार",

    // Top Navbar & Controls
    location_label: "कोपरगाव (तालुका केंद्र)",
    live_data: "थेट माहिती",
    systems_operational: "प्रणाली कार्यरत",
    main_navigation: "मुख्य मेनू",
    farm_location: "शेत स्थान",
    district_name: "अहिल्यानगर, महाराष्ट्र",
    system_status_online: "कृषी सेतू एआय ऑनलाइन",
    all_systems_ok: "सर्व प्रणाली सुव्यवस्थित",

    // Crop Doctor Section
    crop_doctor_title: "पीक डॉक्टर",
    crop_doctor_subtitle: "कृत्रिम बुद्धिमत्ता (AI) व लक्षण जुळवणीद्वारे पीक रोग निदान करा",
    edge_ai_ready: "🟢 एआय प्रणाली सज्ज",
    observed_symptoms_label: "दिसणारे लक्षण निवडा (रंग + काय घडते)",
    clear_symptom: "✕ निवड रद्द करा",
    upload_photo: "📁 फोटो अपलोड करा",
    use_camera: "📷 कॅमेरा वापरा",
    capture_scan: "⚡ फोटो काढा व तपासा",
    stop_camera: "कॅमेरा बंद करा",
    diagnostic_output: "निदान निकाल",
    symptom_verified: "🔍 लक्षण सत्यापित",
    edge_privacy_notice: "🔒 कृषी सेतू गोपनीयता: तुमचे फोटो मोबाईलवरच तपासले जातात — कोणतेही फोटो बाहेर जात नाहीत.",

    // Crops
    crop_cotton: "🌾 कापूस",
    crop_sugarcane: "🎋 ऊस",
    crop_onion: "🧅 कांदा",

    // Climate & Weather Section
    weather_title: "७ दिवसांचा हवामान अंदाज व धोका निर्देशांक",
    dry_days: "कोरड्या दिवसांचा अंदाज (<१ मिमी पाऊस)",
    heat_stress_days: "उष्णतेच्या लाटेचे दिवस (>३८°से)",
    humidity_label: "सरासरी आर्द्रता (बुरशीजन्य रोग धोका)",
    date_col: "दिनांक",
    temp_col: "कमाल / किमान तापमान",
    rain_col: "अपेक्षित पाऊस",
    chance_col: "पावसाची शक्यता",
    status_col: "दिवसाची स्थिती",
    dry_day: "कोरडा दिवस",
    rain_expected: "पावसाची शक्यता",
    field_action_impact: "शेतातील कृतींवरील परिणाम",
    irrigation_impact: "💧 सिंचन नियोजन",
    spray_impact: "🐛 फवारणी व कीड व्यवस्थापन",

    // Water & Soil Section
    water_soil_title: "भूजल व माती आरोग्य माहिती",
    groundwater_level: "भूजल पातळी",
    soil_ph: "मातीचा सामू (pH)",
    nitrogen: "नत्र (N)",
    phosphorus: "स्फुरद (P)",
    potassium: "पालाश (K)",
    organic_carbon: "सेंद्रिय कर्ब",
    normal: "सामान्य",
    optimal: "योग्य",
    medium: "मध्यम",

    // Labour & Machinery Section
    machinery_title: "मजूर व यंत्रसामग्री केंद्र",
    machinery_subtitle: "कोपरगाव तालुक्यातील शेती अवजारे, हार्वेस्टर, ट्रॅक्टर व मजूर भाड्याने देणारी संस्था",
    browse_tab: "🔍 उपलब्ध अवजारे व मजूर शोधा",
    my_bookings_tab: "📋 माझे भाडे अर्ज",
    list_machine_btn: "➕ तुमचे अवजार किंवा मजूर टोळी नोंदवा",
    rent_machine_btn: "🚜 भाड्याने घ्या",
    call_owner_btn: "📞 कॉल करा",
    all_categories: "सर्व",
    tractors: "🚜 ट्रॅक्टर",
    harvesters: "🌾 हार्वेस्टर",
    implements: "⚙️ अवजारे",
    sprayers: "💨 फवारणी यंत्र",
    labour_crews: "👨‍🌾 मजूर टोळी",
    available_now: "सध्या उपलब्ध",
    per_hour: "प्रति तास",
    per_day: "प्रति दिवस",
    per_acre: "प्रति एकर",

    // Advisory & Schemes
    active_recommendations: "४ सक्रिय शिफारसी",
    action_schedule: "कृषी सेतू एआय शिफारसी · कृती वेळापत्रक",
    categorized_actions: "वर्गीकृत कृती आराखडा",
    gov_schemes_title: "शासकीय कृषी योजना",
    pm_kisan_title: "पीएम-किसान सन्मान निधी",
    drip_subsidy_title: "ठिबक सिंचन अनुदान योजना",
    crop_insurance_title: "प्रधानमंत्री पीक विमा योजना (PMFBY)"
  }
};

export type TranslationKey = keyof typeof translations.en;
