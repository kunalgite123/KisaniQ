export interface DiseaseInfo {
  label: string; // exact class name returned by the Teachable Machine model
  displayName: string;
  severity: "healthy" | "watch" | "urgent";
  advisory: string;
}

export interface CropModel {
  id: "cotton" | "sugarcane" | "onion";
  name: string;
  modelUrl: string; // Teachable Machine share URL, must end with a trailing slash
  diseases: DiseaseInfo[];
}

export const cropModels: CropModel[] = [
  {
    id: "cotton",
    name: "Cotton",
    modelUrl: "https://teachablemachine.withgoogle.com/models/KAn_iFpjq/",
    diseases: [
      {
        label: "Bacterial Blight",
        displayName: "Bacterial blight",
        severity: "urgent",
        advisory:
          "Angular water-soaked leaf spots turning black point to bacterial blight. Remove and destroy infected leaves/bolls, avoid overhead irrigation, and spray a copper oxychloride or streptocycline mix. Do not save seed from this field."
      },
      {
        label: "cotton leaf curl virus",
        displayName: "Cotton leaf curl virus (CLCuV)",
        severity: "urgent",
        advisory:
          "Upward leaf curling and vein thickening signal CLCuV, spread by whitefly. Control whitefly with yellow sticky traps and a recommended systemic insecticide, rogue out badly infected plants early, and avoid planting near cucurbits that host whitefly."
      },
      {
        label: "fresh cotton leaf",
        displayName: "Healthy leaf",
        severity: "healthy",
        advisory: "Leaf shows no visible stress. Continue the regular irrigation and scouting schedule."
      },
      {
        label: "fresh cotton plant",
        displayName: "Healthy plant",
        severity: "healthy",
        advisory: "Plant looks healthy overall. Keep monitoring weekly, especially after rain breaks."
      }
    ]
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    modelUrl: "https://teachablemachine.withgoogle.com/models/jO1jrTpCl/",
    diseases: [
      {
        label: "BacterialBlight",
        displayName: "Bacterial blight",
        severity: "urgent",
        advisory:
          "Elongated red-streaked lesions with a yellow halo suggest bacterial leaf blight. Improve field drainage, avoid nitrogen excess, and remove infected leaves. Rotate with a non-host crop next season if spread is heavy."
      },
      {
        label: "mosaic",
        displayName: "Mosaic virus",
        severity: "watch",
        advisory:
          "Light and dark green mottling is typical of sugarcane mosaic virus, spread mainly through infected setts and aphids. Use disease-free setts for the next planting and control aphid vectors; there is no cure for standing infected cane."
      },
      {
        label: "Redrot",
        displayName: "Red rot",
        severity: "urgent",
        advisory:
          "Reddish internal discolouration with cross-white bands is classic red rot, a major yield-loss disease in the Scarcity Zone under moisture stress. Remove and burn affected stools away from the field, avoid ratooning this plot, and use red-rot-resistant varieties for the next cycle."
      }
    ]
  },
  {
    id: "onion",
    name: "Onion",
    modelUrl: "https://teachablemachine.withgoogle.com/models/ZbW3-rhaY/",
    diseases: [
      {
        label: "onion_healthy",
        displayName: "Healthy",
        severity: "healthy",
        advisory: "No visible disease stress. Maintain the current irrigation and weeding schedule."
      },
      {
        label: "onion_purple_blotch",
        displayName: "Purple blotch",
        severity: "watch",
        advisory:
          "Purple-brown concentric lesions on leaves indicate purple blotch, which spreads fast in humid, warm weather. Apply a mancozeb-based fungicide at first sign, avoid overhead irrigation in the evening, and improve row spacing for airflow."
      },
      {
        label: "onion_downy_mildew",
        displayName: "Downy mildew",
        severity: "urgent",
        advisory:
          "Pale, elongated patches with grey-violet fuzz under humid conditions point to downy mildew. Remove infected plants, avoid irrigation late in the day, and apply a recommended systemic fungicide before the next humid spell — this disease spreads quickly in cool, damp mornings."
      }
    ]
  }
];
