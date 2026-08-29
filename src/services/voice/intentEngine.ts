import { detectLanguage } from "./languageDetection";
import { ResponseLang } from "./speechSynthesis";
import { Tab } from "../../App";
import { Village } from "../../data/villages";
import { DiseaseInfo } from "../../data/cropModels";
import { WeatherSnapshot, ClimateRisk } from "../../lib/weather";

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

export function processVoiceQuery(query: string, context: AssistantContext, forcedLang?: ResponseLang): AssistantResponse {
  const q = query.toLowerCase().trim();
  const lang = forcedLang && forcedLang !== ("auto" as any) ? forcedLang : detectLanguage(query);

  const currentCrop = context.cropName || "Cotton";
  const location = context.village?.name || "Kopargaon";

  // 1. Navigation Intent Checks
  if (
    q.includes("weather") || q.includes("climate") || q.includes("हवामान") ||
    q.includes("मौसम") || q.includes("havaman") || q.includes("mausam")
  ) {
    if (q.includes("open") || q.includes("show") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ") || q.includes("go to")) {
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
  }

  if (
    q.includes("soil") || q.includes("माती") || q.includes("मिट्टी") ||
    q.includes("mati") || q.includes("mitti")
  ) {
    if (q.includes("open") || q.includes("show") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ")) {
      return {
        detectedLang: lang,
        intent: "NAVIGATE_SOIL",
        navigateTab: "water",
        responseText:
          lang === "mr"
            ? "माती व पाणी आरोग्य विभाग उघडत आहे."
            : lang === "hi"
            ? "मृदा और जल स्वास्थ्य विभाग खोल रहा हूँ।"
            : "Opening Water & Soil Health intelligence."
      };
    }
  }

  if (
    q.includes("groundwater") || q.includes("well") || q.includes("borewell") ||
    q.includes("भूजल") || q.includes("विहीर") || q.includes("पाणी पातळी")
  ) {
    if (q.includes("open") || q.includes("show") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ")) {
      return {
        detectedLang: lang,
        intent: "NAVIGATE_GROUNDWATER",
        navigateTab: "water",
        responseText:
          lang === "mr"
            ? "भूजल पातळी व विहीर मॉनिटरिंग विभाग उघडत आहे."
            : lang === "hi"
            ? "भूजल स्तर निगरानी विभाग खोल रहा हूँ।"
            : "Opening Groundwater monitoring section."
      };
    }
  }

  if (
    q.includes("crop doctor") || q.includes("doctor") || q.includes("disease") ||
    q.includes("क्रॉप डॉक्टर") || q.includes("रोग") || q.includes("बीमारी")
  ) {
    if (q.includes("open") || q.includes("show") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ") || q.includes("scan")) {
      return {
        detectedLang: lang,
        intent: "NAVIGATE_CROP_DOCTOR",
        navigateTab: "crop",
        responseText:
          lang === "mr"
            ? "क्रॉप डॉक्टर पीक रोग निदान विभाग उघडत आहे."
            : lang === "hi"
            ? "क्रॉप डॉक्टर फसल रोग निदान विभाग खोल रहा हूँ।"
            : "Opening Crop Doctor diagnostic scanner."
      };
    }
  }

  if (
    q.includes("scheme") || q.includes("subsidy") || q.includes("योजना") ||
    q.includes("अनुदान") || q.includes("yojana") || q.includes("yojna")
  ) {
    if (q.includes("open") || q.includes("show") || q.includes("उघडा") || q.includes("दाखवा") || q.includes("खोलो") || q.includes("दिखाओ") || q.includes("which")) {
      return {
        detectedLang: lang,
        intent: "NAVIGATE_SCHEMES",
        navigateTab: "schemes",
        responseText:
          lang === "mr"
            ? "शासकीय कृषी योजना व सबसिडी विभाग उघडत आहे."
            : lang === "hi"
            ? "सरकारी कृषि योजनाएं विभाग खोल रहा हूँ।"
            : "Opening Government Schemes & Benefits."
      };
    }
  }

  if (q.includes("machinery") || q.includes("labour") || q.includes("मजूर") || q.includes("यंत्रसामग्री") || q.includes("ट्रॅक्टर")) {
    return {
      detectedLang: lang,
      intent: "NAVIGATE_MACHINERY",
      navigateTab: "machinery",
      responseText:
        lang === "mr"
          ? "मजूर व शेती यंत्रसामग्री विभाग उघडत आहे."
          : lang === "hi"
          ? "श्रमिक और कृषि उपकरण विभाग खोल रहा हूँ।"
          : "Opening Labour & Machinery section."
    };
  }

  if (q.includes("dashboard") || q.includes("home") || q.includes("मुख्यपृष्ठ")) {
    return {
      detectedLang: lang,
      intent: "NAVIGATE_DASHBOARD",
      navigateTab: "dashboard",
      responseText:
        lang === "mr"
          ? "शेतकरी मुख्यपृष्ठ उघडत आहे."
          : lang === "hi"
          ? "कृषक मुख्यपृष्ठ खोल रहा हूँ।"
          : "Opening Farm Dashboard."
    };
  }

  // 2. Data Queries
  // A. Weather Query
  if (q.includes("rain") || q.includes("weather") || q.includes("temp") || q.includes("पाऊस") || q.includes("हवामान") || q.includes("बारिश") || q.includes("मौसम")) {
    if (context.weather && context.weather.days.length > 0) {
      const today = context.weather.days[0];
      const tempMax = Math.round(today.tempMaxC);
      const rainMm = today.precipitationMm.toFixed(1);
      const rainProb = Math.round(today.precipitationProbabilityPct);
      const dryDays = context.risk?.dryDaysAhead ?? 6;

      if (lang === "mr") {
        return {
          detectedLang: "mr",
          intent: "WEATHER_QUERY",
          responseText: `आज ${location} मध्ये कमाल तापमान ${tempMax}°C असून पावसाची शक्यता ${rainProb}% आहे (${rainMm} मिमी पाऊस). पुढील ७ दिवसांपैकी ${dryDays} दिवस कोरडे राहण्याचा अंदाज आहे.`
        };
      }
      if (lang === "hi") {
        return {
          detectedLang: "hi",
          intent: "WEATHER_QUERY",
          responseText: `आज ${location} में अधिकतम तापमान ${tempMax}°C है और बारिश की संभावना ${rainProb}% है (${rainMm} मिमी बारिश)। अगले 7 में से ${dryDays} दिन सूखे रहने का अनुमान है।`
        };
      }
      return {
        detectedLang: "en",
        intent: "WEATHER_QUERY",
        responseText: `Today's weather for ${location}: max temperature ${tempMax}°C, rain probability ${rainProb}% with ${rainMm} mm expected rain. ${dryDays} of the next 7 days are forecast dry.`
      };
    }
  }

  // B. Groundwater Query
  if (q.includes("groundwater") || q.includes("water") || q.includes("borewell") || q.includes("भूजल") || q.includes("विहीर") || q.includes("पाणी")) {
    if (lang === "mr") {
      return {
        detectedLang: "mr",
        intent: "GROUNDWATER_QUERY",
        responseText: `${location} परिसरातील विहीर व बोअरवेल पाणी पातळी सुमारे ४२.६ मीटर खोलीवर (अर्ध-गंभीर क्षेत्र) आहे. पाण्याचा तुटवडा टाळण्यासाठी ठिबक सिंचनाची शिफारस केली जाते.`
      };
    }
    if (lang === "hi") {
      return {
        detectedLang: "hi",
        intent: "GROUNDWATER_QUERY",
        responseText: `${location} क्षेत्र में कुएं और बोरवेल का जल स्तर लगभग 42.6 मीटर गहराई पर है। पानी की बचत के लिए ड्रिप सिंचाई का उपयोग करें।`
      };
    }
    return {
      detectedLang: "en",
      intent: "GROUNDWATER_QUERY",
      responseText: `Groundwater level for ${location} is monitored at ~42.6 meters depth (Semi-Critical zone). Drip micro-irrigation is strongly recommended to preserve water.`
    };
  }

  // C. Soil Query
  if (q.includes("soil") || q.includes("nutrient") || q.includes("माती") || q.includes("जमीन") || q.includes("मिट्टी")) {
    if (lang === "mr") {
      return {
        detectedLang: "mr",
        intent: "SOIL_QUERY",
        responseText: `${location} भागातील मातीचा प्रकार: मध्यम काळी जमीन (pH ७.८). NPK संतुलित असून झिंक आणि सल्फरयुक्त खतांचा वापर करण्याची शिफारस केली जाते.`
      };
    }
    if (lang === "hi") {
      return {
        detectedLang: "hi",
        intent: "SOIL_QUERY",
        responseText: `${location} क्षेत्र की मिट्टी: मध्यम काली मिट्टी (pH 7.8)। संतुलित NPK और जिंक/सल्फर युक्त उर्वरकों के उपयोग की सिफारिश की जाती है।`
      };
    }
    return {
      detectedLang: "en",
      intent: "SOIL_QUERY",
      responseText: `Soil profile for ${location}: Medium Black soil with pH 7.8. NPK and micronutrients (Zinc, Sulphur) are recommended for optimal yield.`
    };
  }

  // D. Crop Disease Query
  if (q.includes("disease") || q.includes("problem") || q.includes("leaf") || q.includes("पिकाला") || q.includes("रोग") || q.includes("बीमारी") || q.includes("फसल")) {
    if (context.detectedDisease) {
      const diseaseName = context.detectedDisease.displayName;
      const advisory = context.detectedDisease.advisory;

      if (lang === "mr") {
        return {
          detectedLang: "mr",
          intent: "CROP_HEALTH_QUERY",
          responseText: `${currentCrop} पिकावर आढळलेला रोग: ${diseaseName}. शिफारस केलेला सल्ला: ${advisory}`
        };
      }
      if (lang === "hi") {
        return {
          detectedLang: "hi",
          intent: "CROP_HEALTH_QUERY",
          responseText: `${currentCrop} फसल में पाई गई बीमारी: ${diseaseName}। सलाह: ${advisory}`
        };
      }
      return {
        detectedLang: "en",
        intent: "CROP_HEALTH_QUERY",
        responseText: `Latest diagnosis for ${currentCrop}: ${diseaseName}. Advisory: ${advisory}`
      };
    } else {
      if (lang === "mr") {
        return {
          detectedLang: "mr",
          intent: "CROP_HEALTH_QUERY",
          navigateTab: "crop",
          responseText: "कोणतेही सक्रिय पीक निदान आढळले नाही. रोगाची तपासणी करण्यासाठी कृपया क्रॉप डॉक्टरमध्ये पिकाच्या पानाचा फोटो अपलोड करा."
        };
      }
      if (lang === "hi") {
        return {
          detectedLang: "hi",
          intent: "CROP_HEALTH_QUERY",
          navigateTab: "crop",
          responseText: "कोई सक्रिय फसल निदान नहीं मिला। बीमारी की जांच के लिए कृपया क्रॉप डॉक्टर में पत्ती की तस्वीर अपलोड करें।"
        };
      }
      return {
        detectedLang: "en",
        intent: "CROP_HEALTH_QUERY",
        navigateTab: "crop",
        responseText: "No active diagnosis found. Please upload a crop leaf photo to Crop Doctor to scan for disease symptoms."
      };
    }
  }

  // E. Schemes Query
  if (q.includes("scheme") || q.includes("subsidy") || q.includes("योजना") || q.includes("अनुदान")) {
    if (lang === "mr") {
      return {
        detectedLang: "mr",
        intent: "SCHEME_QUERY",
        navigateTab: "schemes",
        responseText: `तुमच्या शेतासाठी प्रमुख योजना: पीक विमा (PMFBY), PM-KISAN (₹६,००० उत्पन्न आधार), ठिबक सिंचन अनुदान (PMKSY 55%), आणि मत्स्य पालन / पशुपालन जोडधंदा योजना (PMMSY/NLM).`
      };
    }
    if (lang === "hi") {
      return {
        detectedLang: "hi",
        intent: "SCHEME_QUERY",
        navigateTab: "schemes",
        responseText: `आपकी फसल के लिए प्रमुख योजनाएं: पीएम फसल बीमा (PMFBY), पीएम-किसान (₹6,000 आय सहायता), ड्रिप सब्सिडी (PMKSY 55%), और मत्स्य/पशुपालन साइड-बिजनेस सब्सिडी (PMMSY/NLM)।`
      };
    }
    return {
      detectedLang: "en",
      intent: "SCHEME_QUERY",
      navigateTab: "schemes",
      responseText: `Top relevant schemes for ${currentCrop}: PMFBY (Crop Insurance), PM-KISAN (₹6,000 Income Support), PMKSY (55% Drip Subsidy), and PMMSY/NLM (Fish/Livestock Side Income Subsidies).`
    };
  }

  // Fallback General Response
  if (lang === "mr") {
    return {
      detectedLang: "mr",
      intent: "GENERAL",
      responseText: `मी तुम्हाला हवामान, माती, भूजल, पीक रोग निदान आणि सरकारी योजनांबद्दल माहिती देऊ शकतो. तुम्ही काय तपासू इच्छिता?`
    };
  }
  if (lang === "hi") {
    return {
      detectedLang: "hi",
      intent: "GENERAL",
      responseText: `मैं आपको मौसम, मिट्टी, भूजल, फसल रोग और सरकारी योजनाओं के बारे में जानकारी दे सकता हूँ। आप क्या देखना चाहते हैं?`
    };
  }
  return {
    detectedLang: "en",
    intent: "GENERAL",
    responseText: `I can help you check weather, soil health, groundwater level, crop disease diagnostics, or government schemes. What would you like to explore?`
  };
}
