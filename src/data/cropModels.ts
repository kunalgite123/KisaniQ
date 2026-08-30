export interface SymptomOption {
  color: string;
  whatHappens: string;
  combinedLabel: string; // e.g. "Dark green — Leaves curl"
  colorMr?: string;
  whatHappensMr?: string;
  combinedLabelMr?: string;
  imageUrl?: string;
  iconBg?: string;
}

export interface DiseaseInfo {
  label: string; // class name or model identifier
  displayName: string;
  displayNameMr?: string;
  severity: "healthy" | "watch" | "urgent";
  advisory: string;
  advisoryMr?: string;
  symptom?: SymptomOption;
}

export interface CropModel {
  id: "cotton" | "sugarcane" | "onion" | "tree" | "custom";
  name: string;
  nameMr?: string;
  modelUrl: string; // Teachable Machine share URL
  diseases: DiseaseInfo[];
}

export const cropModels: CropModel[] = [
  {
    id: "cotton",
    name: "Cotton",
    nameMr: "कापूस",
    modelUrl: "https://teachablemachine.withgoogle.com/models/KAn_iFpjq/",
    diseases: [
      {
        label: "cotton leaf curl virus",
        displayName: "Leaf Curl Virus",
        displayNameMr: "लीफ कर्ल विषाणू (पाने आक्रसणे)",
        severity: "urgent",
        symptom: {
          color: "Dark green",
          whatHappens: "Leaves curl",
          combinedLabel: "Dark green — Leaves curl",
          colorMr: "गडद हिरवा",
          whatHappensMr: "पाने आक्रसतात",
          combinedLabelMr: "गडद हिरवा — पाने आक्रसतात",
          imageUrl: "/symptoms/cotton_leaf_curl.jpg",
          iconBg: "linear-gradient(135deg, #1b5e20, #388e3c)"
        },
        advisory:
          "Upward leaf curling and dark green vein thickening signal Cotton Leaf Curl Virus (CLCuV). Control whitefly vectors using yellow sticky traps and systemic insecticide. Rogue out infected plants early.",
        advisoryMr:
          "पाने वरच्या बाजूला आक्रसणे व शिरा गडद हिरव्या होणे हे लीफ कर्ल रोगाचे लक्षण आहे. पिवळे चिकट सापळे व कीटकनाशक वापरून पांढऱ्या माशीचे नियंत्रण करा. बाधित झाडे उपटून टाका."
      },
      {
        label: "Bacterial Blight",
        displayName: "Bacterial Blight (Xanthomonas)",
        displayNameMr: "जिवाणूजन्य करपा (Bacterial Blight / Xanthomonas)",
        severity: "urgent",
        symptom: {
          color: "Dark brown/black",
          whatHappens: "Angular water-soaked spots & leaf shot-holes",
          combinedLabel: "Dark brown/black — Angular water-soaked spots & shot-holes",
          colorMr: "गडद तपकिरी/काळा",
          whatHappensMr: "कोनात्मक पाणीदार ठिपके व पानांना छिद्रे",
          combinedLabelMr: "गडद तपकिरी/काळा — कोनात्मक ठिपके व पानांना छिद्रे",
          imageUrl: "/symptoms/cotton_bacterial_blight.jpg",
          iconBg: "linear-gradient(135deg, #3e2723, #5d4037)"
        },
        advisory:
          "Angular water-soaked lesions bounded by veins that dry into necrotic shot-holes indicate Cotton Bacterial Blight (Xanthomonas axonopodis pv. malvacearum). Treatment: Spray Copper Oxychloride 50% WP (2.5 g/L) + Streptocycline (0.1 g/L) or Kasugamycin (2 ml/L). Remove infected leaves and avoid overhead sprinkler irrigation.",
        advisoryMr:
          "पानांच्या शिरांच्या सीमेवर कोनात्मक पाणीदार काळे-तपकिरी ठिपके व वाळलेली पाने फुटून छिद्रे पडणे हे कापसावरील जिवाणूजन्य करपा (Bacterial Blight) रोगाचे मुख्य लक्षण आहे. उपाय: कॉपर ऑक्सिक्लोराईड (२.५ ग्रॅम/लिटर) + स्ट्रेप्टोसायक्लीन (०.१ ग्रॅम/लिटर) ची फवारणी करा. प्रभावित पाने नष्ट करा व रात्रीची सिंचन फवारणी टाळा."
      },
      {
        label: "Grey Mildew",
        displayName: "Grey Mildew",
        displayNameMr: "दहिया रोग (Grey Mildew)",
        severity: "watch",
        symptom: {
          color: "Greyish-white",
          whatHappens: "Powdery growth",
          combinedLabel: "Greyish-white — Powdery growth",
          colorMr: "राखाडी पांढरा",
          whatHappensMr: "पांढरी बुरशी",
          combinedLabelMr: "राखाडी पांढरा — पांढरी बुरशी",
          imageUrl: "/symptoms/cotton_grey_mildew.jpg",
          iconBg: "linear-gradient(135deg, #78909c, #cfd8dc)"
        },
        advisory:
          "Greyish-white powdery fungal growth on lower leaf surfaces. Spray wettable sulphur or carbendazim at first appearance to prevent premature defoliation.",
        advisoryMr:
          "पानांच्या खालच्या बाजूला राखाडी-पांढरी दहीसारखी बुरशी वाढते. पाण्यात मिसळणारे गंधक किंवा कार्बेंडाझिम फवारा."
      },
      {
        label: "Alternaria Leaf Spot",
        displayName: "Alternaria Leaf Spot",
        displayNameMr: "ऑल्टरनेरिया ठिपके (Alternaria Spot)",
        severity: "watch",
        symptom: {
          color: "Brown/grey",
          whatHappens: "Spots merge",
          combinedLabel: "Brown/grey — Spots merge",
          colorMr: "तपकिरी/राखाडी",
          whatHappensMr: "ठिपके एकत्र येतात",
          combinedLabelMr: "तपकिरी/राखाडी — ठिपके एकत्र येतात",
          imageUrl: "/symptoms/cotton_alternaria.jpg",
          iconBg: "linear-gradient(135deg, #5d4037, #8d6e63)"
        },
        advisory:
          "Brown/grey concentric target-board spots that merge into large necrotic areas. Apply mancozeb or azoxystrobin spray and maintain proper plant spacing.",
        advisoryMr:
          "पानांवर गोलाकार गोल तपकिरी ठिपके येतात. मँकोझेब किंवा ॲझोक्सीस्ट्रोबीनची फवारणी करा."
      },
      {
        label: "Root Rot (Wilt)",
        displayName: "Root Rot (Wilt)",
        displayNameMr: "मूळ कुज / मर रोग (Root Rot)",
        severity: "urgent",
        symptom: {
          color: "Yellow/black",
          whatHappens: "Plant wilts",
          combinedLabel: "Yellow/black — Plant wilts",
          colorMr: "पिवळा/काळा",
          whatHappensMr: "झाड वाळते",
          combinedLabelMr: "पिवळा/काळा — झाड वाळते",
          imageUrl: "/symptoms/cotton_root_rot.jpg",
          iconBg: "linear-gradient(135deg, #fbc02d, #212121)"
        },
        advisory:
          "Yellowing foliage followed by sudden plant wilting and dark root rot. Drench soil around root zones with Trichoderma viride or carbendazim solution.",
        advisoryMr:
          "पाने पिवळी पडून झाड अचानक सुकते व मुळे काळी पडतात. ट्रायकोडेर्मा किंवा कार्बेंडाझिमची मुळांशी आळवणी करा."
      },
      {
        label: "Boll Rot",
        displayName: "Boll Rot",
        displayNameMr: "बोंड कुज (Boll Rot)",
        severity: "urgent",
        symptom: {
          color: "Black/brown",
          whatHappens: "Bolls rot",
          combinedLabel: "Black/brown — Bolls rot",
          colorMr: "काळा/तपकिरी",
          whatHappensMr: "बोंड कुजते",
          combinedLabelMr: "काळा/तपकिरी — बोंड कुजते",
          imageUrl: "/symptoms/cotton_boll_rot.jpg",
          iconBg: "linear-gradient(135deg, #212121, #4e342e)"
        },
        advisory:
          "Black/brown softening and rot of cotton bolls during humid boll-opening stage. Avoid excess nitrogen fertilizer and spray copper hydroxide.",
        advisoryMr:
          "बोंडे काळी पडतात व पोकळ होऊन कुजतात. अतिरिक्त नत्र खत टाळा व कॉपर हायड्रॉक्साइड फवारा."
      },
      {
        label: "Anthracnose",
        displayName: "Anthracnose",
        displayNameMr: "अँथ्रॅक्नोज (Anthracnose)",
        severity: "watch",
        symptom: {
          color: "Reddish-brown",
          whatHappens: "Bolls sink",
          combinedLabel: "Reddish-brown — Bolls sink",
          colorMr: "तांबूस तपकिरी",
          whatHappensMr: "बोंडांवर खड्डे",
          combinedLabelMr: "तांबूस तपकिरी — बोंडांवर खड्डे",
          imageUrl: "/symptoms/cotton_anthracnose.jpg",
          iconBg: "linear-gradient(135deg, #b71c1c, #8d6e63)"
        },
        advisory:
          "Reddish-brown sunken circular spots on bolls and leaves. Treat seeds with thiram before sowing and spray mancozeb during boll formation.",
        advisoryMr:
          "बोंडांवर तांबूस-तपकिरी खड्ड्यांसारखे ठिपके येतात. मँकोझेबची फवारणी करा."
      },
      {
        label: "fresh cotton leaf",
        displayName: "Healthy Leaf",
        displayNameMr: "निरोगी पान",
        severity: "healthy",
        advisory: "Leaf shows no visible disease symptoms. Continue regular scouting and balanced nutrition.",
        advisoryMr: "पानावर कोणताही रोग नाही. पीक निरोगी आहे."
      },
      {
        label: "fresh cotton plant",
        displayName: "Healthy Plant",
        displayNameMr: "निरोगी झाड",
        severity: "healthy",
        advisory: "Plant is healthy overall. Continue regular irrigation and pest monitoring.",
        advisoryMr: "झाड संपूर्ण निरोगी आहे. नियमित देखभाल ठेवा."
      }
    ]
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    nameMr: "ऊस",
    modelUrl: "https://teachablemachine.withgoogle.com/models/jO1jrTpCl/",
    diseases: [
      {
        label: "Redrot",
        displayName: "Red Rot",
        displayNameMr: "तांबेरा / लाल कुज (Red Rot)",
        severity: "urgent",
        symptom: {
          color: "Red (inside stalk)",
          whatHappens: "Stalk rots",
          combinedLabel: "Red (inside stalk) — Stalk rots",
          colorMr: "लाल (कांडाच्या आत)",
          whatHappensMr: "कांड कुजते",
          combinedLabelMr: "लाल (कांडाच्या आत) — कांड कुजते",
          imageUrl: "/symptoms/sugarcane_red_rot.jpg",
          iconBg: "linear-gradient(135deg, #c62828, #b71c1c)"
        },
        advisory:
          "Reddish internal stalk discolouration with white cross-bands and alcohol smell. Rogue out infected clumps immediately and do not use setts from affected plots.",
        advisoryMr:
          "कांडाच्या आतील भाग लाल होऊन पांढरे पट्टे व अल्कोहोलचा वास येतो. बाधित खोड तात्काळ उपटून नष्ट करा."
      },
      {
        label: "Smut",
        displayName: "Smut",
        displayNameMr: "चाबूक काणी (Smut)",
        severity: "urgent",
        symptom: {
          color: "Black",
          whatHappens: "Whip forms",
          combinedLabel: "Black — Whip forms",
          colorMr: "काळा",
          whatHappensMr: "चाबूक तयार होतो",
          combinedLabelMr: "काळा — चाबूक तयार होतो",
          imageUrl: "/symptoms/sugarcane_smut.jpg",
          iconBg: "linear-gradient(135deg, #111111, #424242)"
        },
        advisory:
          "Long curved black whip-like structures arising from growing shoot tips. Carefully bag affected whips before cutting to prevent spore dispersal, then destroy Clumps.",
        advisoryMr:
          "कोंबातून लांब काळा चाबकासारखा भाग बाहेर पडतो. बीजाणू पसरू नये म्हणून प्लॅस्टिक पिशवीने झाकून कापून नष्ट करा."
      },
      {
        label: "Wilt",
        displayName: "Wilt",
        displayNameMr: "उबळणे / मर रोग (Wilt)",
        severity: "urgent",
        symptom: {
          color: "Yellow/dry",
          whatHappens: "Plant wilts",
          combinedLabel: "Yellow/dry — Plant wilts",
          colorMr: "पिवळा/वाळलेला",
          whatHappensMr: "झाड सुकते",
          combinedLabelMr: "पिवळा/वाळलेला — झाड सुकते",
          imageUrl: "/symptoms/sugarcane_wilt.jpg",
          iconBg: "linear-gradient(135deg, #f57f17, #fbc02d)"
        },
        advisory:
          "Gradual yellowing, drying of crown leaves, and hollow pith inside stalk. Improve soil aeration, avoid waterlogging, and apply soil bio-agents.",
        advisoryMr:
          "पाने पिवळी पडतात, कांड आतून पोकळ होते. जमिनीतील निचरा सुधारा आणि जैविक बुरशीनाशक वापरा."
      },
      {
        label: "Rust",
        displayName: "Rust",
        displayNameMr: "तांबेरा (Rust)",
        severity: "watch",
        symptom: {
          color: "Orange/brown",
          whatHappens: "Leaves rust",
          combinedLabel: "Orange/brown — Leaves rust",
          colorMr: "नारंगी/तपकिरी",
          whatHappensMr: "पानांवर तांबेरा",
          combinedLabelMr: "नारंगी/तपकिरी — पानांवर तांबेरा",
          imageUrl: "/symptoms/sugarcane_rust.jpg",
          iconBg: "linear-gradient(135deg, #e65100, #ef6c00)"
        },
        advisory:
          "Elongated orange/brown pustules on leaf underside. Apply mancozeb or propiconazole spray if rust covers more than 15% leaf area.",
        advisoryMr:
          "पानाच्या खालच्या बाजूला नारंगी/तपकिरी ठिपके येतात. मँकोझेब किंवा प्रोपिकॉनाझोल फवारा."
      },
      {
        label: "BacterialBlight",
        displayName: "Leaf Scald",
        displayNameMr: "लीफ स्कॉल्ड (Leaf Scald)",
        severity: "urgent",
        symptom: {
          color: "White/yellow",
          whatHappens: "Leaves streak",
          combinedLabel: "White/yellow — Leaves streak",
          colorMr: "पांढरा/पिवळा",
          whatHappensMr: "पानांवर पट्टे",
          combinedLabelMr: "पांढरा/पिवळा — पानांवर पट्टे",
          imageUrl: "/symptoms/sugarcane_leaf_scald.jpg",
          iconBg: "linear-gradient(135deg, #fff59d, #fbc02d)"
        },
        advisory:
          "Pencil-line white/yellow longitudinal stripes along leaf veins turning necrotic. Dip setts in hot water treatment (50°C for 2 hours) before planting.",
        advisoryMr:
          "पानांच्या शिरांवर पांढऱ्या-पिवळ्या रेषेसारखे पट्टे येतात. लागवडीपूर्वी बेण्यांवर गरम पाण्याची प्रक्रिया करा (५०°C २ तास)."
      },
      {
        label: "Ratoon Stunting",
        displayName: "Ratoon Stunting",
        displayNameMr: "खोडवा खुंटणे (Ratoon Stunting)",
        severity: "watch",
        symptom: {
          color: "Reddish (inside stalk)",
          whatHappens: "Growth stunts",
          combinedLabel: "Reddish (inside stalk) — Growth stunts",
          colorMr: "तांबूस (कांडाच्या आत)",
          whatHappensMr: "वाढ खुंटते",
          combinedLabelMr: "तांबूस (कांडाच्या आत) — वाढ खुंटते",
          imageUrl: "/symptoms/sugarcane_ratoon_stunting.jpg",
          iconBg: "linear-gradient(135deg, #d32f2f, #795548)"
        },
        advisory:
          "Reddish dots at nodes inside stalk causing severe stunting of ratoon crops. Sterilize cutting knives with disinfectant between rows.",
        advisoryMr:
          "कांडाच्या पेरांवर तांबूस ठिपके येतात व खोडव्याची वाढ खुंटते. कापणीची हत्यारे जंतूनाशकाने स्वच्छ करा."
      },
      {
        label: "Grassy Shoot",
        displayName: "Grassy Shoot",
        displayNameMr: "गवती वाढ (Grassy Shoot)",
        severity: "urgent",
        symptom: {
          color: "Pale yellow",
          whatHappens: "Shoots multiply",
          combinedLabel: "Pale yellow — Shoots multiply",
          colorMr: "फिकट पिवळा",
          whatHappensMr: "पुष्कळ फुटवे",
          combinedLabelMr: "फिकट पिवळा — पुष्कळ फुटवे",
          imageUrl: "/symptoms/sugarcane_grassy_shoot.jpg",
          iconBg: "linear-gradient(135deg, #fff59d, #c0ca33)"
        },
        advisory:
          "Profuse pale yellow paper-thin tillers giving a bushy grassy appearance. Uproot infected clumps and control leafhopper/aphid vectors.",
        advisoryMr:
          "गवतासारखे बारीक फिकट पिवळे पुष्कळ फुटवे येतात. बाधित खोड उपटून नष्ट करा व मावा किडीचे नियंत्रण करा."
      },
      {
        label: "mosaic",
        displayName: "Mosaic Virus",
        displayNameMr: "मोझॅक व्हायरस (Mosaic Virus)",
        severity: "watch",
        symptom: {
          color: "Light/dark green",
          whatHappens: "Leaves mottle",
          combinedLabel: "Light/dark green — Leaves mottle",
          colorMr: "हिरवा/पिवळसर",
          whatHappensMr: "चितकबरी पाने",
          combinedLabelMr: "हिरवा/पिवळसर — चितकबरी पाने",
          imageUrl: "/symptoms/sugarcane_mosaic_virus.jpg",
          iconBg: "linear-gradient(135deg, #33691e, #689f38)"
        },
        advisory: "Light and dark green mottling on leaves. Use healthy setts and control aphid vectors.",
        advisoryMr: "पानांवर हिरवे व पिवळसर ठिपके दिसतात. निरोगी बेणे वापरा व मावा किडीचा बंदोबस्त करा."
      }
    ]
  },
  {
    id: "onion",
    name: "Onion",
    nameMr: "कांदा",
    modelUrl: "https://teachablemachine.withgoogle.com/models/ZbW3-rhaY/",
    diseases: [
      {
        label: "onion_purple_blotch",
        displayName: "Purple Blotch",
        displayNameMr: "जांभळा करपा (Purple Blotch)",
        severity: "watch",
        symptom: {
          color: "Purple/brown",
          whatHappens: "Leaves blotch",
          combinedLabel: "Purple/brown — Leaves blotch",
          colorMr: "जांभळा/तपकिरी",
          whatHappensMr: "पानांवर चट्टे",
          combinedLabelMr: "जांभळा/तपकिरी — पानांवर चट्टे",
          imageUrl: "/symptoms/onion_purple_blotch.jpg",
          iconBg: "linear-gradient(135deg, #4a148c, #6a1b9a)"
        },
        advisory:
          "Purple/brown sunken lesions with yellow halo on leaves. Spray mancozeb or difenoconazole + azoxystrobin and avoid evening overhead sprinkler irrigation.",
        advisoryMr:
          "पानांवर पिवळसर कडा असलेले जांभळे/तपकिरी चट्टे पडतात. मँकोझेब किंवा डायफेनोकोनॅझोल फवारा."
      },
      {
        label: "onion_downy_mildew",
        displayName: "Downy Mildew",
        displayNameMr: "केवडा / डाउनी मिल्ड्यू",
        severity: "urgent",
        symptom: {
          color: "Pale yellow/grey",
          whatHappens: "Leaves collapse",
          combinedLabel: "Pale yellow/grey — Leaves collapse",
          colorMr: "फिकट पिवळा/राखाडी",
          whatHappensMr: "पाने कोलमडतात",
          combinedLabelMr: "फिकट पिवळा/राखाडी — पाने कोलमडतात",
          imageUrl: "/symptoms/onion_downy_mildew.jpg",
          iconBg: "linear-gradient(135deg, #fff59d, #90a4ae)"
        },
        advisory:
          "Pale yellow patches with greyish violet fungal growth leading to leaf collapse. Spray metalaxyl + mancozeb or cymoxanil during humid cool weather.",
        advisoryMr:
          "पानांवर फिकट पिवळे पट्टे येऊन राखाडी बुरशी वाढते व पाने कोलमडतात. मेटॅलॅक्सिल + मँकोझेब फवारा."
      },
      {
        label: "Basal Rot (Fusarium)",
        displayName: "Basal Rot (Fusarium)",
        displayNameMr: "कांदा सड / मूळ कुज (Basal Rot)",
        severity: "urgent",
        symptom: {
          color: "Yellow/brown",
          whatHappens: "Bulb rots",
          combinedLabel: "Yellow/brown — Bulb rots",
          colorMr: "पिवळा/तपकिरी",
          whatHappensMr: "कांदा कुजतो",
          combinedLabelMr: "पिवळा/तपकिरी — कांदा कुजतो",
          imageUrl: "/symptoms/onion_basal_rot.jpg",
          iconBg: "linear-gradient(135deg, #f57f17, #5d4037)"
        },
        advisory:
          "Yellowing leaf tips with decaying bulb basal plate and white root mycelium. Ensure crop rotation and drench soil with Trichoderma harzianum.",
        advisoryMr:
          "पानांची टोके पिवळी पडतात व कांद्याचा तळ भाग कुजतो. ट्रायकोडेर्माची मुळांशी आळवणी करा."
      },
      {
        label: "Anthracnose (Twister)",
        displayName: "Anthracnose (Twister)",
        displayNameMr: "ट्विस्टर रोग (मान पिळवटणे)",
        severity: "urgent",
        symptom: {
          color: "Yellow/white",
          whatHappens: "Leaves twist",
          combinedLabel: "Yellow/white — Leaves twist",
          colorMr: "पिवळा/पांढरा",
          whatHappensMr: "पाने पिळवटतात",
          combinedLabelMr: "पिवळा/पांढरा — पाने पिळवटतात",
          imageUrl: "/symptoms/onion_anthracnose_twister.jpg",
          iconBg: "linear-gradient(135deg, #ffee58, #fff9c4)"
        },
        advisory:
          "Pale yellow/white oval spots causing leaf curling and spiral twister neck twisting. Spray copper oxychloride or hexaconazole.",
        advisoryMr:
          "पानांवर फिकट पिवळे ठिपके येऊन मान पिळवटते व पानांचा पीळ पडतो. कॉपर ऑक्सिक्लोराईड किंवा हेक्झाकोनॅझोल फवारा."
      },
      {
        label: "Stemphylium Blight",
        displayName: "Stemphylium Blight",
        displayNameMr: "स्टेमफिलियम करपा (Stemphylium)",
        severity: "watch",
        symptom: {
          color: "Dark brown",
          whatHappens: "Tips die",
          combinedLabel: "Dark brown — Tips die",
          colorMr: "गडद तपकिरी",
          whatHappensMr: "टोके वाळतात",
          combinedLabelMr: "गडद तपकिरी — टोके वाळतात",
          imageUrl: "/symptoms/onion_stemphylium_blight.jpg",
          iconBg: "linear-gradient(135deg, #3e2723, #4e342e)"
        },
        advisory:
          "Dark brown elongated flecks starting from leaf tips causing tip dieback. Apply iprodione or tebuconazole spray.",
        advisoryMr:
          "पानांच्या टोकांपासून गडद तपकिरी डाग सुरू होऊन टोके वाळतात. टेब्युकोनॅझोलची फवारणी करा."
      },
      {
        label: "Black Mould",
        displayName: "Black Mould",
        displayNameMr: "काळी बुरशी (Black Mould)",
        severity: "watch",
        symptom: {
          color: "Black",
          whatHappens: "Bulb blackens",
          combinedLabel: "Black — Bulb blackens",
          colorMr: "काळा",
          whatHappensMr: "कांदा काळा पडतो",
          combinedLabelMr: "काळा — कांदा काळा पडतो",
          imageUrl: "/symptoms/onion_black_mould.jpg",
          iconBg: "linear-gradient(135deg, #212121, #000000)"
        },
        advisoryMr:
          "साठवणीत कांद्याच्या टरफलांवर काळी पावडरसारखी बुरशी जमते. कांदा सुकवून खेळत्या हवेत साठवा."
      },
      {
        label: "Neck Rot",
        displayName: "Neck Rot",
        displayNameMr: "मान कुज (Neck Rot)",
        severity: "urgent",
        symptom: {
          color: "Grey/brown",
          whatHappens: "Neck softens",
          combinedLabel: "Grey/brown — Neck softens",
          colorMr: "राखाडी/तपकिरी",
          whatHappensMr: "मान मऊ पडते",
          combinedLabelMr: "राखाडी/तपकिरी — मान मऊ पडते",
          imageUrl: "/symptoms/onion_neck_rot.jpg",
          iconBg: "linear-gradient(135deg, #78909c, #6d4c41)"
        },
        advisory:
          "Grey/brown soft rot near the neck of stored onion bulbs. Allow leaves to dry completely before topping and store under dry ventilated conditions.",
        advisoryMr:
          "साठवलेल्या कांद्याची मान मऊ पडून राखाडी/तपकिरी कुज होते. काढणीनंतर मान पूर्ण सुकू द्या."
      },
      {
        label: "onion_healthy",
        displayName: "Healthy",
        displayNameMr: "निरोगी",
        severity: "healthy",
        advisory: "No visible disease stress. Maintain regular watering and weeding schedule.",
        advisoryMr: "कोणताही रोग नाही. पीक निरोगी आहे."
      }
    ]
  },
  {
    id: "tree",
    name: "Trees & Fruit Crops",
    nameMr: "झाडे व फळबागा",
    modelUrl: "https://teachablemachine.withgoogle.com/models/ZbW3-rhaY/",
    diseases: [
      {
        label: "Citrus Canker",
        displayName: "Citrus Canker",
        displayNameMr: "साइट्रस कँकर (लिंबू खऱ्या रोग)",
        severity: "urgent",
        symptom: {
          color: "Yellow/brown halo",
          whatHappens: "Raised corky lesions",
          combinedLabel: "Yellow/brown halo — Raised corky lesions",
          colorMr: "पिवळसर कडा",
          whatHappensMr: "खवल्यांसारखे ठिपके",
          combinedLabelMr: "पिवळसर कडा — खवल्यांसारखे ठिपके",
          imageUrl: "/symptoms/citrus_canker.jpg",
          iconBg: "linear-gradient(135deg, #fbc02d, #ef6c00)"
        },
        advisory:
          "Raised corky brownish spots surrounded by yellow halos on leaves, twigs, and fruit caused by Xanthomonas citri. Spray Copper Oxychloride (3 g/L) + Streptocycline (0.1 g/L) and prune infected twigs.",
        advisoryMr:
          "पाने व फळांवर खवल्यांसारखे खुरदळे काळे-तपकिरी ठिपके व पिवळी कडा दिसणे हा लिंबूवर्गीय फळांवरील कँकर रोग आहे. कॉपर ऑक्सिक्लोराईड + स्ट्रेप्टोसायक्लीनची फवारणी करा."
      },
      {
        label: "Mango Anthracnose",
        displayName: "Mango Anthracnose",
        displayNameMr: "आंबा करपा (Mango Anthracnose)",
        severity: "urgent",
        symptom: {
          color: "Dark brown/black",
          whatHappens: "Irregular leaf & fruit spots",
          combinedLabel: "Dark brown/black — Irregular leaf & fruit spots",
          colorMr: "काळा/तपकिरी",
          whatHappensMr: "पाने व फळांवर चट्टे",
          combinedLabelMr: "काळा/तपकिरी — पाने व फळांवर चट्टे",
          imageUrl: "/symptoms/mango_anthracnose.jpg",
          iconBg: "linear-gradient(135deg, #3e2723, #b71c1c)"
        },
        advisory:
          "Dark brown to black irregular lesions on young leaves, panther spots on mango fruit, and blossom blight. Spray Carbendazim (1 g/L) or Azoxystrobin (1 ml/L) before and after flowering.",
        advisoryMr:
          "आंब्याच्या पानांवर व फळांवर काळे-तपकिरी चट्टे पडणे व मोहर करपणे. पालवी व मोहर येताना कार्बेंडाझिम किंवा ॲझोक्सीस्ट्रोबीनची फवारणी करा."
      },
      {
        label: "Pomegranate Bacterial Blight",
        displayName: "Pomegranate Blight (Telyan)",
        displayNameMr: "डाळिंब तेल्या रोग (Bacterial Blight)",
        severity: "urgent",
        symptom: {
          color: "Oily black",
          whatHappens: "Water-soaked spots & fruit cracks",
          combinedLabel: "Oily black — Water-soaked spots & fruit cracks",
          colorMr: "तेकट काळा",
          whatHappensMr: "पाणीदार ठिपके व फळ उलगडणे",
          combinedLabelMr: "तेकट काळा — पाणीदार ठिपके व फळ उलगडणे",
          imageUrl: "/symptoms/pomegranate_blight.jpg",
          iconBg: "linear-gradient(135deg, #1b5e20, #000000)"
        },
        advisory:
          "Dark oily water-soaked spots on leaves and L/Y-shaped cracking on pomegranate fruits (Xanthomonas axonopodis pv. punicae). Spray Streptocycline (0.5 g/L) + Copper Hydroxide (2 g/L) and remove infected leaves/fruits.",
        advisoryMr:
          "पानांवर तेकट काळे ठिपके व फळांवर L किंवा Y आकाराचे तडे जाणे हा डाळिंबावरील तेल्या रोग आहे. स्ट्रेप्टोसायक्लीन + कॉपर हायड्रॉक्साइड फवारा व बाधित फळे नष्ट करा."
      },
      {
        label: "Guava Wilt",
        displayName: "Guava Wilt",
        displayNameMr: "पेरू मर रोग (Guava Wilt)",
        severity: "urgent",
        symptom: {
          color: "Yellow/reddish",
          whatHappens: "Leaves dry & tree wilts",
          combinedLabel: "Yellow/reddish — Leaves dry & tree wilts",
          colorMr: "पिवळा/तांबूस",
          whatHappensMr: "पाने वाळतात व झाड सुकते",
          combinedLabelMr: "पिवळा/तांबूस — पाने वाळतात व झाड सुकते",
          imageUrl: "/symptoms/guava_wilt.jpg",
          iconBg: "linear-gradient(135deg, #e65100, #4e342e)"
        },
        advisory:
          "Yellowing, purplish tinting, and rapid wilting of guava branches due to Fusarium solani. Drench basin soil with Trichoderma harzianum or Carbendazim (2 g/L).",
        advisoryMr:
          "पेरूची पाने पिवळी-तांबूस पडून झाडाच्या फांद्या अचानक सुकतात. मुळांशी ट्रायकोडेर्मा किंवा कार्बेंडाझिमची आळवणी करा."
      },
      {
        label: "Papaya Ring Spot",
        displayName: "Papaya Ring Spot Virus",
        displayNameMr: "पपई रिंग स्पॉट (Ring Spot Virus)",
        severity: "urgent",
        symptom: {
          color: "Yellow mosaic",
          whatHappens: "Shoestring leaves & ring spots on fruit",
          combinedLabel: "Yellow mosaic — Shoestring leaves & ring spots",
          colorMr: "चितकबरा पिवळा",
          whatHappensMr: "पाने बारीक होतात व फळांवर गोल वलये",
          combinedLabelMr: "चितकबरा पिवळा — पाने बारीक होतात व फळांवर गोल वलये",
          imageUrl: "/symptoms/papaya_ring_spot.jpg",
          iconBg: "linear-gradient(135deg, #fbc02d, #388e3c)"
        },
        advisory:
          "Shoestring leaf distortion and concentric green ring spots on papaya fruits transmitted by aphids. Control aphid vectors with Imidacloprid (0.5 ml/L) and remove infected trees.",
        advisoryMr:
          "पाने दोरीसारखी बारीक होतात व पपईच्या फळांवर गोल वलये पडतात. इमिडाक्लोप्रिड फवारून मावा किडीचे नियंत्रण करा."
      },
      {
        label: "Apple Scab",
        displayName: "Apple Scab",
        displayNameMr: "सफरचंद स्कॅब (Apple Scab)",
        severity: "watch",
        symptom: {
          color: "Olive green/brown",
          whatHappens: "Velvety spots on leaves & fruit",
          combinedLabel: "Olive green/brown — Velvety spots on leaves & fruit",
          colorMr: "ऑलिव्ह हिरवा/तपकिरी",
          whatHappensMr: "पाने व फळांवर मखमली ठिपके",
          combinedLabelMr: "ऑलिव्ह हिरवा/तपकिरी — पानांवर मखमली ठिपके",
          imageUrl: "/symptoms/apple_scab.jpg",
          iconBg: "linear-gradient(135deg, #33691e, #5d4037)"
        },
        advisory:
          "Olive-green velvety lesions on leaves and scabby brown spots on apple fruits. Spray Mancozeb (2.5 g/L) or Captan (2 g/L) at green tip stage.",
        advisoryMr:
          "सफरचंदाच्या पानांवर व फळांवर मखमली ऑलिव्ह-हिरवे ठिपके येतात. मँकोझेब किंवा कॅप्टन बुरशीनाशक फवारा."
      },
      {
        label: "Healthy Tree Leaf",
        displayName: "Healthy Tree Leaf",
        displayNameMr: "निरोगी झाड / फळबाग पान",
        severity: "healthy",
        advisory: "Tree foliage appears healthy with vigorous growth and normal leaf color. Maintain organic mulching and balanced nutrition.",
        advisoryMr: "झाड व फळबाग पूर्णपणे निरोगी आहे. योग्य खत व पाणी व्यवस्थापन ठेवा."
      }
    ]
  }
];
