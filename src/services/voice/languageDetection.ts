import { ResponseLang } from "./speechSynthesis";

export function detectLanguage(text: string): ResponseLang {
  const q = text.toLowerCase().trim();

  // Devanagari Unicode Range check (\u0900-\u097F)
  const containsDevanagari = /[\u0900-\u097F]/.test(q);

  if (containsDevanagari) {
    // Marathi Devanagari Indicators
    const marathiKeywords = [
      "कसं", "कसा", "कशी", "आहे", "पडेल", "उघडा", "दाखवा", "माझ्या", "माती",
      "शेताची", "पिकाला", "काय", "पाऊस", "हवामान", "योजना", "उद्या", "आज", "भूजल"
    ];

    const isMarathi = marathiKeywords.some((kw) => q.includes(kw));
    if (isMarathi) return "mr";

    // Hindi Devanagari Indicators
    const hindiKeywords = [
      "कैसा", "कैसी", "है", "होगी", "खोलो", "दिखाओ", "मेरी", "मिट्टी",
      "फसल", "क्या", "बारिश", "मौसम", "योजनाएं", "कल", "आज", "भूजल"
    ];

    const isHindi = hindiKeywords.some((kw) => q.includes(kw));
    if (isHindi) return "hi";

    return "mr"; // Default Devanagari to Marathi for Maharashtra agricultural context
  }

  // Transliterated Latin (Hinglish / Marathish) Detection
  const marathiLatin = [
    "kasa", "kasa aahe", "kashi", "aahe", "padel", "ughad", "ughda", "dakhva",
    "majha", "mati", "pika", "paus", "havaman", "yojna", "udya", "aaj"
  ];

  const hindiLatin = [
    "kaisa", "kaisa hai", "kaisi", "hai", "hogi", "kholo", "dikhao", "meri",
    "mitti", "fasal", "barish", "mausam", "yojana", "kal", "aaj"
  ];

  if (marathiLatin.some((kw) => q.includes(kw))) return "mr";
  if (hindiLatin.some((kw) => q.includes(kw))) return "hi";

  return "en"; // Default to English
}
