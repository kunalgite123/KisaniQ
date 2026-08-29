export interface SymptomOption {
  color: string;
  whatHappens: string;
  combinedLabel: string; // e.g. "Dark green — Leaves curl"
  imageUrl?: string;
  iconBg?: string;
}

export interface DiseaseInfo {
  label: string; // class name or model identifier
  displayName: string;
  severity: "healthy" | "watch" | "urgent";
  advisory: string;
  symptom?: SymptomOption;
}

export interface CropModel {
  id: "cotton" | "sugarcane" | "onion";
  name: string;
  modelUrl: string; // Teachable Machine share URL
  diseases: DiseaseInfo[];
}

export const cropModels: CropModel[] = [
  {
    id: "cotton",
    name: "Cotton",
    modelUrl: "https://teachablemachine.withgoogle.com/models/KAn_iFpjq/",
    diseases: [
      {
        label: "cotton leaf curl virus",
        displayName: "Leaf Curl Virus",
        severity: "urgent",
        symptom: {
          color: "Dark green",
          whatHappens: "Leaves curl",
          combinedLabel: "Dark green — Leaves curl",
          imageUrl: "/symptoms/cotton_leaf_curl.jpg",
          iconBg: "linear-gradient(135deg, #1b5e20, #388e3c)"
        },
        advisory:
          "Upward leaf curling and dark green vein thickening signal Cotton Leaf Curl Virus (CLCuV). Control whitefly vectors using yellow sticky traps and systemic insecticide. Rogue out infected plants early."
      },
      {
        label: "Bacterial Blight",
        displayName: "Bacterial Blight",
        severity: "urgent",
        symptom: {
          color: "Black/brown",
          whatHappens: "Spots spread",
          combinedLabel: "Black/brown — Spots spread",
          imageUrl: "/symptoms/cotton_bacterial_blight.jpg",
          iconBg: "linear-gradient(135deg, #3e2723, #5d4037)"
        },
        advisory:
          "Angular water-soaked black/brown spots that spread on leaves and bolls indicate Bacterial Blight. Spray copper oxychloride + streptocycline mix and avoid overhead irrigation."
      },
      {
        label: "Grey Mildew",
        displayName: "Grey Mildew",
        severity: "watch",
        symptom: {
          color: "Greyish-white",
          whatHappens: "Powdery growth",
          combinedLabel: "Greyish-white — Powdery growth",
          imageUrl: "/symptoms/cotton_grey_mildew.jpg",
          iconBg: "linear-gradient(135deg, #78909c, #cfd8dc)"
        },
        advisory:
          "Greyish-white powdery fungal growth on lower leaf surfaces. Spray wettable sulphur or carbendazim at first appearance to prevent premature defoliation."
      },
      {
        label: "Alternaria Leaf Spot",
        displayName: "Alternaria Leaf Spot",
        severity: "watch",
        symptom: {
          color: "Brown/grey",
          whatHappens: "Spots merge",
          combinedLabel: "Brown/grey — Spots merge",
          imageUrl: "/symptoms/cotton_alternaria.jpg",
          iconBg: "linear-gradient(135deg, #5d4037, #8d6e63)"
        },
        advisory:
          "Brown/grey concentric target-board spots that merge into large necrotic areas. Apply mancozeb or azoxystrobin spray and maintain proper plant spacing."
      },
      {
        label: "Root Rot (Wilt)",
        displayName: "Root Rot (Wilt)",
        severity: "urgent",
        symptom: {
          color: "Yellow/black",
          whatHappens: "Plant wilts",
          combinedLabel: "Yellow/black — Plant wilts",
          imageUrl: "/symptoms/cotton_root_rot.jpg",
          iconBg: "linear-gradient(135deg, #fbc02d, #212121)"
        },
        advisory:
          "Yellowing foliage followed by sudden plant wilting and dark root rot. Drench soil around root zones with Trichoderma viride or carbendazim solution."
      },
      {
        label: "Boll Rot",
        displayName: "Boll Rot",
        severity: "urgent",
        symptom: {
          color: "Black/brown",
          whatHappens: "Bolls rot",
          combinedLabel: "Black/brown — Bolls rot",
          imageUrl: "/symptoms/cotton_boll_rot.jpg",
          iconBg: "linear-gradient(135deg, #212121, #4e342e)"
        },
        advisory:
          "Black/brown softening and rot of cotton bolls during humid boll-opening stage. Avoid excess nitrogen fertilizer and spray copper hydroxide."
      },
      {
        label: "Anthracnose",
        displayName: "Anthracnose",
        severity: "watch",
        symptom: {
          color: "Reddish-brown",
          whatHappens: "Bolls sink",
          combinedLabel: "Reddish-brown — Bolls sink",
          imageUrl: "/symptoms/cotton_anthracnose.jpg",
          iconBg: "linear-gradient(135deg, #b71c1c, #8d6e63)"
        },
        advisory:
          "Reddish-brown sunken circular spots on bolls and leaves. Treat seeds with thiram before sowing and spray mancozeb during boll formation."
      },
      {
        label: "fresh cotton leaf",
        displayName: "Healthy Leaf",
        severity: "healthy",
        advisory: "Leaf shows no visible disease symptoms. Continue regular scouting and balanced nutrition."
      },
      {
        label: "fresh cotton plant",
        displayName: "Healthy Plant",
        severity: "healthy",
        advisory: "Plant is healthy overall. Continue regular irrigation and pest monitoring."
      }
    ]
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    modelUrl: "https://teachablemachine.withgoogle.com/models/jO1jrTpCl/",
    diseases: [
      {
        label: "Redrot",
        displayName: "Red Rot",
        severity: "urgent",
        symptom: {
          color: "Red (inside stalk)",
          whatHappens: "Stalk rots",
          combinedLabel: "Red (inside stalk) — Stalk rots",
          imageUrl: "/symptoms/sugarcane_red_rot.jpg",
          iconBg: "linear-gradient(135deg, #c62828, #b71c1c)"
        },
        advisory:
          "Reddish internal stalk discolouration with white cross-bands and alcohol smell. Rogue out infected clumps immediately and do not use setts from affected plots."
      },
      {
        label: "Smut",
        displayName: "Smut",
        severity: "urgent",
        symptom: {
          color: "Black",
          whatHappens: "Whip forms",
          combinedLabel: "Black — Whip forms",
          imageUrl: "/symptoms/sugarcane_smut.jpg",
          iconBg: "linear-gradient(135deg, #111111, #424242)"
        },
        advisory:
          "Long curved black whip-like structures arising from growing shoot tips. Carefully bag affected whips before cutting to prevent spore dispersal, then destroy Clumps."
      },
      {
        label: "Wilt",
        displayName: "Wilt",
        severity: "urgent",
        symptom: {
          color: "Yellow/dry",
          whatHappens: "Plant wilts",
          combinedLabel: "Yellow/dry — Plant wilts",
          imageUrl: "/symptoms/sugarcane_wilt.jpg",
          iconBg: "linear-gradient(135deg, #f57f17, #fbc02d)"
        },
        advisory:
          "Gradual yellowing, drying of crown leaves, and hollow pith inside stalk. Improve soil aeration, avoid waterlogging, and apply soil bio-agents."
      },
      {
        label: "Rust",
        displayName: "Rust",
        severity: "watch",
        symptom: {
          color: "Orange/brown",
          whatHappens: "Leaves rust",
          combinedLabel: "Orange/brown — Leaves rust",
          imageUrl: "/symptoms/sugarcane_rust.jpg",
          iconBg: "linear-gradient(135deg, #e65100, #ef6c00)"
        },
        advisory:
          "Elongated orange/brown pustules on leaf underside. Apply mancozeb or propiconazole spray if rust covers more than 15% leaf area."
      },
      {
        label: "BacterialBlight",
        displayName: "Leaf Scald",
        severity: "urgent",
        symptom: {
          color: "White/yellow",
          whatHappens: "Leaves streak",
          combinedLabel: "White/yellow — Leaves streak",
          imageUrl: "/symptoms/sugarcane_leaf_scald.jpg",
          iconBg: "linear-gradient(135deg, #fff59d, #fbc02d)"
        },
        advisory:
          "Pencil-line white/yellow longitudinal stripes along leaf veins turning necrotic. Dip setts in hot water treatment (50°C for 2 hours) before planting."
      },
      {
        label: "Ratoon Stunting",
        displayName: "Ratoon Stunting",
        severity: "watch",
        symptom: {
          color: "Reddish (inside stalk)",
          whatHappens: "Growth stunts",
          combinedLabel: "Reddish (inside stalk) — Growth stunts",
          imageUrl: "/symptoms/sugarcane_ratoon_stunting.jpg",
          iconBg: "linear-gradient(135deg, #d32f2f, #795548)"
        },
        advisory:
          "Reddish dots at nodes inside stalk causing severe stunting of ratoon crops. Sterilize cutting knives with disinfectant between rows."
      },
      {
        label: "Grassy Shoot",
        displayName: "Grassy Shoot",
        severity: "urgent",
        symptom: {
          color: "Pale yellow",
          whatHappens: "Shoots multiply",
          combinedLabel: "Pale yellow — Shoots multiply",
          imageUrl: "/symptoms/sugarcane_grassy_shoot.jpg",
          iconBg: "linear-gradient(135deg, #fff59d, #c0ca33)"
        },
        advisory:
          "Profuse pale yellow paper-thin tillers giving a bushy grassy appearance. Uproot infected clumps and control leafhopper/aphid vectors."
      },
      {
        label: "mosaic",
        displayName: "Mosaic Virus",
        severity: "watch",
        advisory: "Light and dark green mottling on leaves. Use healthy setts and control aphid vectors."
      }
    ]
  },
  {
    id: "onion",
    name: "Onion",
    modelUrl: "https://teachablemachine.withgoogle.com/models/ZbW3-rhaY/",
    diseases: [
      {
        label: "onion_purple_blotch",
        displayName: "Purple Blotch",
        severity: "watch",
        symptom: {
          color: "Purple/brown",
          whatHappens: "Leaves blotch",
          combinedLabel: "Purple/brown — Leaves blotch",
          imageUrl: "/symptoms/onion_purple_blotch.jpg",
          iconBg: "linear-gradient(135deg, #4a148c, #6a1b9a)"
        },
        advisory:
          "Purple/brown sunken lesions with yellow halo on leaves. Spray mancozeb or difenoconazole + azoxystrobin and avoid evening overhead sprinkler irrigation."
      },
      {
        label: "onion_downy_mildew",
        displayName: "Downy Mildew",
        severity: "urgent",
        symptom: {
          color: "Pale yellow/grey",
          whatHappens: "Leaves collapse",
          combinedLabel: "Pale yellow/grey — Leaves collapse",
          imageUrl: "/symptoms/onion_downy_mildew.jpg",
          iconBg: "linear-gradient(135deg, #fff59d, #90a4ae)"
        },
        advisory:
          "Pale yellow patches with greyish violet fungal growth leading to leaf collapse. Spray metalaxyl + mancozeb or cymoxanil during humid cool weather."
      },
      {
        label: "Basal Rot (Fusarium)",
        displayName: "Basal Rot (Fusarium)",
        severity: "urgent",
        symptom: {
          color: "Yellow/brown",
          whatHappens: "Bulb rots",
          combinedLabel: "Yellow/brown — Bulb rots",
          imageUrl: "/symptoms/onion_basal_rot.jpg",
          iconBg: "linear-gradient(135deg, #f57f17, #5d4037)"
        },
        advisory:
          "Yellowing leaf tips with decaying bulb basal plate and white root mycelium. Ensure crop rotation and drench soil with Trichoderma harzianum."
      },
      {
        label: "Anthracnose (Twister)",
        displayName: "Anthracnose (Twister)",
        severity: "urgent",
        symptom: {
          color: "Yellow/white",
          whatHappens: "Leaves twist",
          combinedLabel: "Yellow/white — Leaves twist",
          imageUrl: "/symptoms/onion_anthracnose_twister.jpg",
          iconBg: "linear-gradient(135deg, #ffee58, #fff9c4)"
        },
        advisory:
          "Pale yellow/white oval spots causing leaf curling and spiral twister neck twisting. Spray copper oxychloride or hexaconazole."
      },
      {
        label: "Stemphylium Blight",
        displayName: "Stemphylium Blight",
        severity: "watch",
        symptom: {
          color: "Dark brown",
          whatHappens: "Tips die",
          combinedLabel: "Dark brown — Tips die",
          imageUrl: "/symptoms/onion_stemphylium_blight.jpg",
          iconBg: "linear-gradient(135deg, #3e2723, #4e342e)"
        },
        advisory:
          "Dark brown elongated flecks starting from leaf tips causing tip dieback. Apply iprodione or tebuconazole spray."
      },
      {
        label: "Black Mould",
        displayName: "Black Mould",
        severity: "watch",
        symptom: {
          color: "Black",
          whatHappens: "Bulb blackens",
          combinedLabel: "Black — Bulb blackens",
          imageUrl: "/symptoms/onion_black_mould.jpg",
          iconBg: "linear-gradient(135deg, #212121, #000000)"
        },
        advisory:
          "Black powdery spore mass between outer bulb scales during storage. Ensure proper field curing and low humidity storage aeration."
      },
      {
        label: "Neck Rot",
        displayName: "Neck Rot",
        severity: "urgent",
        symptom: {
          color: "Grey/brown",
          whatHappens: "Neck softens",
          combinedLabel: "Grey/brown — Neck softens",
          imageUrl: "/symptoms/onion_neck_rot.jpg",
          iconBg: "linear-gradient(135deg, #78909c, #6d4c41)"
        },
        advisory:
          "Grey/brown soft rot near the neck of stored onion bulbs. Allow leaves to dry completely before topping and store under dry ventilated conditions."
      },
      {
        label: "onion_healthy",
        displayName: "Healthy",
        severity: "healthy",
        advisory: "No visible disease stress. Maintain regular watering and weeding schedule."
      }
    ]
  }
];
