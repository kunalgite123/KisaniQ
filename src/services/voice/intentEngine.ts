import { detectLanguage } from "./languageDetection";
import { ResponseLang } from "./speechSynthesis";
import { Tab } from "../../App";
import { Village, villages } from "../../data/villages";
import { DiseaseInfo, cropModels } from "../../data/cropModels";
import { WeatherSnapshot, ClimateRisk } from "../../lib/weather";
import { evaluateWaterSoilDecision } from "../../lib/waterSoilDecision";

export interface AssistantResponse {
  detectedLang: ResponseLang;
  responseText: string;
  navigateTab?: Tab;
  intent: string;
}

export interface AssistantContext {
  village?: Village | null;
  cropName?: string | null;
  detectedDisease?: DiseaseInfo | null;
  weather?: WeatherSnapshot | null;
  risk?: ClimateRisk | null;
  currentTab?: Tab;
}

export function processVoiceQuery(
  query: string,
  context: AssistantContext,
  forcedLang?: ResponseLang
): AssistantResponse {
  const q = query.toLowerCase().trim();
  const lang = forcedLang && forcedLang !== ("auto" as any) ? forcedLang : detectLanguage(query);

  const currentCrop = context.cropName || "Cotton";
  const location = context.village?.name || "Kopargaon";

  // ==========================================
  // 1. ROUTE NAVIGATION INTENTS
  // ==========================================

  // A. Climate & Weather Navigation
  if (
    (q.includes("weather") || q.includes("climate") || q.includes("हवामान") || q.includes("मौसम") || q.includes("havaman")) &&
    (q.includes("open") || q.includes("show") || q.includes("go to") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ") || q.includes("वर जा"))
  ) {
    return {
      detectedLang: lang,
      intent: "NAVIGATE_WEATHER",
      navigateTab: "climate",
      responseText:
        lang === "mr"
          ? "हवामान व हवामान धोके विभाग उघडत आहे."
          : lang === "hi"
          ? "मौसम और जलवायु विभाग खोल रहा हूँ।"
          : "Opening Climate & Weather dashboard."
    };
  }

  // B. Water & Soil Navigation
  if (
    (q.includes("soil") || q.includes("water") || q.includes("माती") || q.includes("पाणी") || q.includes("मिट्टी") || q.includes("mati") || q.includes("pani")) &&
    (q.includes("open") || q.includes("show") || q.includes("go to") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ") || q.includes("वर जा"))
  ) {
    return {
      detectedLang: lang,
      intent: "NAVIGATE_SOIL",
      navigateTab: "water",
      responseText:
        lang === "mr"
          ? "भूजल पातळी व माती परीक्षण विभाग उघडत आहे."
          : lang === "hi"
          ? "मृदा और जल स्वास्थ्य विभाग खोल रहा हूँ।"
          : "Opening Water & Soil Health intelligence."
    };
  }

  // C. Crop Doctor Navigation
  if (
    (q.includes("crop doctor") || q.includes("doctor") || q.includes("scan") || q.includes("रोग") || q.includes("क्रॉप डॉक्टर") || q.includes("निदान") || q.includes("बीमारी")) &&
    (q.includes("open") || q.includes("show") || q.includes("go to") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ") || q.includes("वर जा") || q.includes("photo") || q.includes("फोटो"))
  ) {
    return {
      detectedLang: lang,
      intent: "NAVIGATE_CROP_DOCTOR",
      navigateTab: "crop",
      responseText:
        lang === "mr"
          ? "क्रॉप डॉक्टर पीक रोग निदान विभाग उघडत आहे. येथे पिकाच्या पानाचा फोटो अपलोड करा."
          : lang === "hi"
          ? "क्रॉप डॉक्टर फसल रोग निदान विभाग खोल रहा हूँ।"
          : "Opening Crop Doctor diagnostic scanner. Upload or take a leaf photo here."
    };
  }

  // D. Schemes Navigation
  if (
    (q.includes("scheme") || q.includes("subsidy") || q.includes("योजना") || q.includes("अनुदान") || q.includes("yojana")) &&
    (q.includes("open") || q.includes("show") || q.includes("go to") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ") || q.includes("वर जा") || q.includes("list"))
  ) {
    return {
      detectedLang: lang,
      intent: "NAVIGATE_SCHEMES",
      navigateTab: "schemes",
      responseText:
        lang === "mr"
          ? "शासकीय कृषी योजना व सबसिडी विभाग उघडत आहे."
          : lang === "hi"
          ? "सरकारी कृषि योजनाएं विभाग खोल रहा हूँ।"
          : "Opening Government Schemes & Benefits portal."
    };
  }

  // E. Machinery & Labour Navigation
  if (
    q.includes("machinery") || q.includes("labour") || q.includes("tractor") || q.includes("मजूर") || q.includes("यंत्रसामग्री") || q.includes("ट्रॅक्टर") || q.includes("अवजारे")
  ) {
    if (q.includes("open") || q.includes("show") || q.includes("go to") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ") || q.includes("वर जा") || q.includes("rent")) {
      return {
        detectedLang: lang,
        intent: "NAVIGATE_MACHINERY",
        navigateTab: "machinery",
        responseText:
          lang === "mr"
            ? "मजूर व शेती यंत्रसामग्री विभाग उघडत आहे."
            : lang === "hi"
            ? "श्रमिक और कृषि उपकरण विभाग खोल रहा हूँ।"
            : "Opening Labour & Machinery Rental Network."
      };
    }
  }

  // F. Dashboard Navigation
  if (q.includes("dashboard") || q.includes("home") || q.includes("मुख्यपृष्ठ") || q.includes("घर") || q.includes("मुख्य")) {
    return {
      detectedLang: lang,
      intent: "NAVIGATE_DASHBOARD",
      navigateTab: "dashboard",
      responseText:
        lang === "mr"
          ? "कृषी सेतू मुख्यपृष्ठ उघडत आहे."
          : lang === "hi"
          ? "कृषक मुख्यपृष्ठ खोल रहा हूँ।"
          : "Opening Krishi Setu Farm Dashboard."
    };
  }

  // ==========================================
  // 2. SPECIFIC CROP DISEASE & PEST KNOWLEDGE
  // ==========================================

  // Search all disease entries across Sugarcane, Cotton, Onion
  for (const cropModel of cropModels) {
    for (const d of cropModel.diseases) {
      const name = d.displayName.toLowerCase();
      const adv = d.advisory;

      if (q.includes(name) || (d.label && q.includes(d.label.toLowerCase()))) {
        return {
          detectedLang: lang,
          intent: "DISEASE_INFO",
          navigateTab: "crop",
          responseText:
            lang === "mr"
              ? `${cropModel.name} पिकावरील ${d.displayName}: ${adv}`
              : `Diagnostic details for ${d.displayName} on ${cropModel.name}: ${adv}`
        };
      }
    }
  }

  // Onion Disease Queries
  if (q.includes("onion") || q.includes("कांदा") || q.includes("kanda")) {
    if (q.includes("purple blotch") || q.includes("करपा") || q.includes("जांभळा")) {
      return {
        detectedLang: lang,
        intent: "ONION_PURPLE_BLOTCH",
        navigateTab: "crop",
        responseText:
          lang === "mr"
            ? "कांद्यावरील जांभळा करपा (Purple Blotch): पानांवर जांभळट डाग पडतात. उपायासाठी मॅन्कोझेब (Mancozeb 2.5gm/L) किंवा कॉपर ऑक्सिक्लोराइड ची फवारणी करा."
            : "Onion Purple Blotch causes purplish sunken lesions on leaves. Treat with Mancozeb (2.5g/L) or Copper Oxychloride spray."
      };
    }
    if (q.includes("stemphylium") || q.includes("केवडा") || q.includes("downy mildew") || q.includes("rot") || q.includes("कुज")) {
      return {
        detectedLang: lang,
        intent: "ONION_DISEASE",
        navigateTab: "crop",
        responseText:
          lang === "mr"
            ? "कांद्यावरील बुरशीजन्य रोगासाठी टेबुकॉनेझोल किंवा कार्बेंडाझिम २ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करा व साचलेले पाणी काढून टाका."
            : "For onion fungal blight or basal rot, spray Tebuconazole or Carbendazim (2g/L) and ensure proper field drainage."
      };
    }
  }

  // Sugarcane Disease Queries
  if (q.includes("sugarcane") || q.includes("ऊस") || q.includes("us")) {
    if (q.includes("red rot") || q.includes("तांबेडा") || q.includes("लाल")) {
      return {
        detectedLang: lang,
        intent: "SUGARCANE_RED_ROT",
        navigateTab: "crop",
        responseText:
          lang === "mr"
            ? "उसातील तांबेडा (Red Rot): कांडांमध्ये लालसर पट्टे व अल्कोहोलसारखा वास येतो. बाधित उसाची बेटे उपटून टाका व ट्रायकोडरमा ची आळवणी करा."
            : "Sugarcane Red Rot shows red vascular discoloration and alcoholic odor. Uproot diseased clumps and apply Trichoderma to soil."
      };
    }
    if (q.includes("smut") || q.includes("काणी") || q.includes("rust") || q.includes("तांबेरा")) {
      return {
        detectedLang: lang,
        intent: "SUGARCANE_DISEASE",
        navigateTab: "crop",
        responseText:
          lang === "mr"
            ? "उसावरील चाबूक काणी किंवा तांबेरा रोगासाठी प्रोपिकोनेझोल (Propiconazole 1ml/L) ची फवारणी करा व निरोगी बियाणे वापरा."
            : "For Sugarcane Smut or Rust, spray Propiconazole (1ml/L) and use disease-free certified setts."
      };
    }
  }

  // Cotton Disease Queries
  if (q.includes("cotton") || q.includes("कापूस") || q.includes("kapas")) {
    if (q.includes("curl") || q.includes("चुरडा") || q.includes("मुरडा")) {
      return {
        detectedLang: lang,
        intent: "COTTON_LEAF_CURL",
        navigateTab: "crop",
        responseText:
          lang === "mr"
            ? "कापसावरील चुरडा मुरडा (Leaf Curl Virus): पांढरी माशी (Whitefly) या रोगाचा प्रसार करते. पिवळे चिकट सापळे लावा व असिटामिप्रिड ची फवारणी करा."
            : "Cotton Leaf Curl Virus is transmitted by whiteflies. Install yellow sticky traps and spray Acetamiprid insecticide."
      };
    }
    if (q.includes("blight") || q.includes("बोंड") || q.includes("boll rot") || q.includes("दहिया")) {
      return {
        detectedLang: lang,
        intent: "COTTON_DISEASE",
        navigateTab: "crop",
        responseText:
          lang === "mr"
            ? "कापसावरील जिवाणूजन्य करपा किंवा बोंड कुजीसाठी कॉपर ऑक्सिक्लोराइड + स्ट्रेप्टोसायक्लिन ची फवारणी करा."
            : "For Cotton Bacterial Blight or Boll Rot, spray Copper Oxychloride combined with Streptocycline."
      };
    }
  }

  // ==========================================
  // 3. GROUNDWATER & SOIL KNOWLEDGE (KOPARGAON / VILLAGES)
  // ==========================================

  // Village specific lookup
  for (const v of villages) {
    if (q.includes(v.name.toLowerCase())) {
      const canalInfo =
        v.waterSourceType === "canal_godavari"
          ? (lang === "mr" ? "गोदावरी कालवा क्षेत्रात आहे (पाण्याची उपलब्धता उत्तम)." : "located in Godavari Canal reach (optimal water availability).")
          : v.waterSourceType === "possible_canal_branch"
          ? (lang === "mr" ? "कालवा फाटा क्षेत्रात आहे." : "located in canal branch reach.")
          : (lang === "mr" ? "गोदावरीपासून लांब असून मुख्यतः विहीर व भूजलावर अवलंबून आहे." : "far from Godavari river, relying primarily on well groundwater.");

      const rechargeInfo = v.proposedRecharge
        ? (lang === "mr" ? " या गावात CGWB भूजल पुनर्भरण तलाव प्रस्तावित आहे." : " CGWB recharge percolation tank is listed for this village.")
        : "";

      return {
        detectedLang: lang,
        intent: "VILLAGE_INFO",
        navigateTab: "water",
        responseText:
          lang === "mr"
            ? `${v.name} गाव गोदावरी नदीपासून ${v.distanceToGodavariKm.toFixed(1)} किमी अंतरावर आहे. हे गाव ${canalInfo}${rechargeInfo}`
            : `${v.name} is ${v.distanceToGodavariKm.toFixed(1)} km from Godavari river. It is ${canalInfo}${rechargeInfo}`
      };
    }
  }

  // Water Situation / Groundwater Query synced with Water & Soil decision engine
  if (
    q.includes("groundwater") || q.includes("well") || q.includes("borewell") ||
    q.includes("भूजल") || q.includes("विहीर") || q.includes("पाणी पातळी") ||
    q.includes("पाण्याची परिस्थिती") || q.includes("water situation") || q.includes("near me") || q.includes("जवळ पाणी")
  ) {
    const dec = evaluateWaterSoilDecision({
      village: context.village ?? null,
      cropName: context.cropName,
      lang: lang as any
    });

    return {
      detectedLang: lang,
      intent: "WATER_DECISION_KNOWLEDGE",
      navigateTab: "water",
      responseText:
        lang === "mr"
          ? `तुमच्या ठिकाणापासून जलनिरीक्षण बिंदू ${dec.distanceKm.toFixed(1)} किमी अंतरावर आहे. संदर्भ भूजल खोली ${dec.referenceDepthRange} असून शिफारस: ${dec.recommendedAction}`
          : `Water monitoring point is ${dec.distanceKm.toFixed(1)} km from your location. Reference groundwater depth is ${dec.referenceDepthRange}. Recommended action: ${dec.recommendedAction}`
    };
  }

  // Soil Health Query
  if (q.includes("soil") || q.includes("fertilizer") || q.includes("npk") || q.includes("माती") || q.includes("खत") || q.includes("जमीन") || q.includes("मिट्टी")) {
    return {
      detectedLang: lang,
      intent: "SOIL_KNOWLEDGE",
      navigateTab: "water",
      responseText:
        lang === "mr"
          ? `${location} मधील माती: मध्यम काळी जमीन (pH ७.८). सेंद्रिय कर्ब ०.४८% असून नत्र, स्फुरद व पालाश (NPK) सोबत झिंक व गंधक खतांची गरज आहे.`
          : `Soil profile for ${location}: Medium Black soil with pH 7.8 and Organic Carbon 0.48%. Recommended: NPK balance with Zinc & Sulphur.`
    };
  }

  // ==========================================
  // 4. GOVERNMENT SCHEMES & SUBSIDIES KNOWLEDGE
  // ==========================================

  if (q.includes("pm-kisan") || q.includes("kisan samman") || q.includes("६०००") || q.includes("6000")) {
    return {
      detectedLang: lang,
      intent: "SCHEME_PM_KISAN",
      navigateTab: "schemes",
      responseText:
        lang === "mr"
          ? "पीएम-किसान (PM-KISAN): पात्र शेतकऱ्यांना वर्षाला ₹६,००० अर्थसहाय्य (₹२,००० चे ३ हप्ते) थेट बँक खात्यात दिले जाते."
          : "PM-KISAN Samman Nidhi provides ₹6,000 yearly income support in 3 equal installments of ₹2,000 directly to farmer bank accounts."
    };
  }

  if (q.includes("insurance") || q.includes("pmfby") || q.includes("विमा") || q.includes("नुकसान भरपाई")) {
    return {
      detectedLang: lang,
      intent: "SCHEME_PMFBY",
      navigateTab: "schemes",
      responseText:
        lang === "mr"
          ? "प्रधानमंत्री पीक विमा योजना (PMFBY): नैसर्गिक आपत्ती, दुष्काळ किंवा किडीमुळे पिकाचे नुकसान झाल्यास नुकसान भरपाई मिळते."
          : "PMFBY Crop Insurance protects farmers against crop loss from drought, flood, or pest outbreaks with minimum premium rates."
    };
  }

  if (q.includes("drip") || q.includes("ठिबक") || q.includes("तुषार") || q.includes("55%") || q.includes("५५%")) {
    return {
      detectedLang: lang,
      intent: "SCHEME_DRIP",
      navigateTab: "schemes",
      responseText:
        lang === "mr"
          ? "मुख्यमंत्री शाश्वत सिंचन योजना: लहान व अल्पभूधारक शेतकऱ्यांना ठिबक व तुषार सिंचनासाठी ५५% ते ८०% सबसिडी दिली जाते."
          : "Micro-Irrigation Subsidy (PMKSY/MUKRIS) offers 55% to 80% subsidy for small and marginal farmers installing drip systems."
    };
  }

  if (q.includes("fish") || q.includes("मत्स्य") || q.includes("शेतातळे") || q.includes("goat") || q.includes("शेळी") || q.includes("कुक्कुट")) {
    return {
      detectedLang: lang,
      intent: "SCHEME_ALLIED",
      navigateTab: "schemes",
      responseText:
        lang === "mr"
          ? "जोडधंदा योजना: मत्स्य शेती (PMMSY) व शेळी/कुक्कुटपालन (NLM) योजनेअंतर्गत ४०% ते ५०% पर्यंत शासकीय अनुदान उपलब्ध आहे."
          : "Allied Business Subsidies: PMMSY Fisheries & NLM Livestock Mission offer 40% to 50% government capital grants."
    };
  }

  // General Schemes Query
  if (q.includes("scheme") || q.includes("subsidy") || q.includes("योजना") || q.includes("अनुदान")) {
    return {
      detectedLang: lang,
      intent: "SCHEMES_GENERAL",
      navigateTab: "schemes",
      responseText:
        lang === "mr"
          ? "कृषी सेतूवर उपलब्ध योजना: १. पीक विमा (PMFBY), २. PM-KISAN (₹६,०००), ३. ठिबक सिंचन अनुदान (५५%), ४. मत्स्य व पशुपालन जोडधंदा अनुदान."
          : "Key Schemes available on Krishi Setu: PMFBY Crop Insurance, PM-KISAN, Drip Subsidy (55%), and PMMSY/NLM Allied Business Grants."
    };
  }

  // ==========================================
  // 5. LABOUR & MACHINERY NETWORK KNOWLEDGE
  // ==========================================

  if (q.includes("machinery") || q.includes("rent") || q.includes("rate") || q.includes("tractor") || q.includes("मजूर") || q.includes("भाडे") || q.includes("ट्रॅक्टर") || q.includes("दर")) {
    return {
      detectedLang: lang,
      intent: "MACHINERY_KNOWLEDGE",
      navigateTab: "machinery",
      responseText:
        lang === "mr"
          ? `${location} परिसरातील शेती अवजारे दर: ट्रॅक्टर नांगरणी ₹८००-१२००/तास, रोटाव्हेटर ₹९००/तास, फवारणी पंप ₹४००/दिवस व मजूर पथक उपलब्धता उपलब्ध आहे.`
          : `Machinery rental rates in ${location}: Tractor plowing ₹800-1200/hr, Rotavator ₹900/hr, Spray pumps ₹400/day. Labour teams available.`
    };
  }

  // ==========================================
  // 6. CLIMATE & WEATHER DATA KNOWLEDGE
  // ==========================================

  if (q.includes("rain") || q.includes("temp") || q.includes("forecast") || q.includes("पाऊस") || q.includes("तापमान") || q.includes("अंदाज")) {
    if (context.weather && context.weather.days.length > 0) {
      const today = context.weather.days[0];
      const tempMax = Math.round(today.tempMaxC);
      const rainMm = today.precipitationMm.toFixed(1);
      const rainProb = Math.round(today.precipitationProbabilityPct);
      const dryDays = context.risk?.dryDaysAhead ?? 6;

      return {
        detectedLang: lang,
        intent: "WEATHER_LIVE_KNOWLEDGE",
        navigateTab: "climate",
        responseText:
          lang === "mr"
            ? `${location} चे थेट हवामान: कमाल तापमान ${tempMax}°C असून पावसाची शक्यता ${rainProb}% आहे (${rainMm} मिमी पाऊस). पुढील ७ दिवसांपैकी ${dryDays} दिवस कोरडे राहतील.`
            : `Live weather for ${location}: Max temp ${tempMax}°C, rain chance ${rainProb}% (${rainMm}mm). ${dryDays} of next 7 days are forecast dry.`
      };
    }
  }

  // ==========================================
  // 7. PLATFORM HOW-TO & ABOUT KRISHI SETU
  // ==========================================

  if (q.includes("what is krishi setu") || q.includes("krishi setu काय आहे") || q.includes("about") || q.includes("बद्दल")) {
    return {
      detectedLang: lang,
      intent: "ABOUT_KRISHI_SETU",
      responseText:
        lang === "mr"
          ? "कृषी सेतू हे कोपरगाव व अहिल्यानगर शेतकर्‍यांसाठी एआय-आधारित शेती निर्णय तंत्रज्ञान आहे, जे हवामान, भूजल, माती आणि पीक रोगांचे अचूक विश्लेषण करून दैनंदिन सल्ला देते."
          : "Krishi Setu is an AI decision-intelligence platform for Kopargaon farmers, unifying satellite weather, groundwater, soil health, and leaf disease scanning."
    };
  }

  if (q.includes("language") || q.includes("मराठी") || q.includes("english") || q.includes("भाषा")) {
    return {
      detectedLang: lang,
      intent: "LANGUAGE_HELP",
      responseText:
        lang === "mr"
          ? "वेबसाइटची भाषा बदलण्यासाठी वरच्या उजव्या कोपऱ्यात असलेल्या EN | मराठी बटणावर क्लिक करा."
          : "To switch language between English and Marathi, tap the EN | मराठी button in the top navbar."
    };
  }

  // ==========================================
  // 8. DYNAMIC DEDICATED FALLBACK
  // ==========================================

  return {
    detectedLang: lang,
    intent: "DYNAMIC_AGRICULTURE_ADVISORY",
    responseText:
      lang === "mr"
        ? `मी कृषी सेतू एआय आहे. ${location} मधील तुमच्या ${currentCrop} पिकासाठी मी हवामान, माती परीक्षण, भूजल पातळी, पीक रोग औषधोपचार आणि शासकीय सबसिडीबद्दल अचूक माहिती देऊ शकतो.`
        : `I am Krishi Setu AI. I can assist you with real-time weather, soil nutrients, groundwater levels, disease remedies for ${currentCrop}, and government subsidies for ${location}.`
  };
}
