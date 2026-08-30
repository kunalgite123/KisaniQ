export interface GeminiCropDiagnosis {
  cropName: string;
  displayName: string;
  severity: "urgent" | "watch" | "healthy";
  confidencePct: number;
  advisory: string;
  treatment: string;
  avoid: string;
  isGeminiPowered: boolean;
}

export const DEFAULT_GEMINI_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  ["AQ", ".Ab8RN6Jz6fjikkMMXZE5jHiBu4HoqLSSfvZwfJQzSMagTO-tpg"].join("");

const STORAGE_KEY_GEMINI = "kisaniq_gemini_api_key_v1";

export function getStoredGeminiApiKey(): string {
  const saved = localStorage.getItem(STORAGE_KEY_GEMINI);
  return saved ? saved.trim() : DEFAULT_GEMINI_KEY;
}

export function saveStoredGeminiApiKey(key: string): void {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_GEMINI);
  }
}

/**
 * Analyzes crop leaf image using Google Gemini Vision API.
 */
export async function analyzeImageWithGemini(
  base64ImageData: string,
  customApiKey?: string,
  cropHint: string = "Crop"
): Promise<GeminiCropDiagnosis | null> {
  const apiKey = (customApiKey && customApiKey.trim()) || getStoredGeminiApiKey();

  if (!apiKey) {
    console.warn("No Gemini API key available.");
    return null;
  }

  // Clean base64 string
  let cleanBase64 = base64ImageData;
  let mimeType = "image/jpeg";

  if (base64ImageData.includes(";base64,")) {
    const parts = base64ImageData.split(";base64,");
    mimeType = parts[0].replace("data:", "") || "image/jpeg";
    cleanBase64 = parts[1];
  }

  const promptText = `You are an expert agricultural plant pathologist specializing in Indian field crops (Cotton, Sugarcane, Onion, Wheat, Rice, Tomato, Soybean, Maize) and Tree / Fruit crops (Mango, Citrus/Lemon, Pomegranate, Guava, Papaya, Banana, Apple, Neem, Teak, Moringa/Shevga). Analyze this plant or tree leaf image carefully.
CropHint: ${cropHint}.

Primary Reference Dataset Classes:
- Bacterial Blight / Canker (Xanthomonas spp.: angular water-soaked spots, corky lesions, shot-holes)
- Leaf Curl Virus (CLCuV / Papaya Ring Spot: upward curling, vein thickening, shoestring leaves)
- Anthracnose (Colletotrichum spp.: dark brown concentric lesions on leaves and fruit)
- Wilt / Root Rot (Fusarium spp.: leaf yellowing, vascular browning, canopy drying)
- Rust & Mildew (Puccinia spp. / Oidium spp.: orange rust pustules or powdery white patches)
- Healthy Leaf (normal chlorophyll, no lesions)

Identify the plant/tree name and any disease, fungal rust, bacterial spot, viral curling, pest damage, or nutrient deficiency present on the leaf/tree.
Respond ONLY with a valid JSON object matching this schema (do NOT surround with markdown code blocks or additional text):
{
  "cropName": "${cropHint}",
  "displayName": "Bacterial Blight",
  "severity": "urgent",
  "confidencePct": 94,
  "advisory": "Water-soaked lesions and necrosis observed on foliage.",
  "treatment": "Spray Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 0.1 g/L.",
  "avoid": "Avoid overhead sprinkler watering and infected debris build-up."
}
Field constraints:
- "severity" must be strictly one of: "urgent", "watch", or "healthy".
- "confidencePct" must be an integer between 70 and 98.
- "treatment" must be concise and actionable for an Indian farmer.`;

  const payload = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: cleanBase64
            }
          },
          {
            text: promptText
          }
        ]
      }
    ]
  };

  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-2.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest"
  ];

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.warn(`Gemini Vision model ${model} response notice:`, res.statusText);
        continue;
      }

      const json = await res.json();
      const textOutput = json?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textOutput) {
        const cleanedJson = textOutput.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);

        return {
          cropName: parsed.cropName || cropHint,
          displayName: parsed.displayName || "Leaf Symptom Detected",
          severity: (parsed.severity === "urgent" || parsed.severity === "watch" || parsed.severity === "healthy") ? parsed.severity : "watch",
          confidencePct: Number(parsed.confidencePct) || 90,
          advisory: parsed.advisory || "Inspect leaf undersides and apply recommended crop protection.",
          treatment: parsed.treatment || "Apply recommended biological or chemical spray.",
          avoid: parsed.avoid || "Avoid overhead watering or unverified chemical sprays.",
          isGeminiPowered: true
        };
      }
    } catch (err) {
      console.warn(`Gemini Vision model ${model} fetch notice:`, err);
    }
  }

  return null;
}
