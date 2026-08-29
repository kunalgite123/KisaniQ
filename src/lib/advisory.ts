import { ClimateRisk } from "./weather";
import { Village } from "../data/villages";
import { DiseaseInfo } from "../data/cropModels";

export interface AdvisoryInput {
  climateRisk: ClimateRisk | null;
  village: Village | null;
  detectedDisease: DiseaseInfo | null;
  cropName: string | null;
  lang?: "en" | "mr";
}

export interface AdvisoryVerdict {
  urgency: "healthy" | "watch" | "urgent";
  title: string;
  points: string[];
}

/**
 * Converts three independently-scattered signals (weather, groundwater/water
 * access, crop-health) into one localized, actionable verdict — bilingual in MR & EN.
 */
export function synthesizeAdvisory(input: AdvisoryInput): AdvisoryVerdict {
  const { climateRisk, village, detectedDisease, cropName, lang = "en" } = input;
  const points: string[] = [];
  let urgency: AdvisoryVerdict["urgency"] = "healthy";

  const isMr = lang === "mr";

  if (climateRisk) {
    if (isMr) {
      if (climateRisk.level === "high") {
        points.push(`हवामानाचा उच्च धोका: पुढील ७ पैकी ${climateRisk.dryDaysAhead} दिवस पूर्णपणे कोरडे राहण्याचा अंदाज. पिकाला वेळेवर पाणी देण्याचे नियोजन करा.`);
        urgency = "urgent";
      } else if (climateRisk.level === "moderate") {
        points.push(`मिश्र हवामान — पुढील ७ पैकी ${climateRisk.dryDaysAhead} दिवस कोरडे राहण्याचा अंदाज. मातीतील ओलावा तपासा व आवश्यकतेनुसार सिंचन करा.`);
        if (urgency === "healthy") urgency = "watch";
      } else {
        points.push(`हवामान अनुकूल आहे — तापमान व आद्रता पिकाच्या वाढीसाठी सुयोग्य आहे.`);
      }
    } else {
      points.push(climateRisk.headline);
      if (climateRisk.level === "high") urgency = "urgent";
      else if (climateRisk.level === "moderate" && urgency === "healthy") urgency = "watch";
    }
  }

  if (village) {
    if (village.waterSourceType === "groundwater_only") {
      if (isMr) {
        points.push(
          `${village.name} हे गाव पूर्णतः विहीर/बोअरवेलवर अवलंबून असून भूजल पातळी घसरत चाललेल्या (वर्षाला ~०.४१ मी) अर्ध-गंभीर क्षेत्रात आहे. ` +
            (climateRisk?.level === "high"
              ? "पुढील कोरड्या कालावधीमुळे उपलब्ध पाण्याचा ठिबकद्वारे काटकसरीने वापर करा."
              : "हंगामात बोअरवेलची पाणी पातळी तपासा व नवीन खोल बोअरवेल पाडणे टाळा.")
        );
      } else {
        points.push(
          `${village.name} is well/borewell-dependent and sits in a Semi-Critical block with a falling post-monsoon water table (~0.41 m/year). ` +
            (climateRisk?.level === "high"
              ? "Combined with the dry week ahead, prioritise the most water-efficient irrigation slot you have and avoid new deep borewells."
              : "Track borewell yield through the season and avoid drilling beyond 60 m without local guidance.")
        );
      }
      if (urgency === "healthy") urgency = "watch";
    } else if (village.waterSourceType === "canal_godavari") {
      points.push(
        isMr
          ? `${village.name} हे गाव गोदावरी कालवा क्षेत्रात आहे — बोअरवेल पंपिंग करण्यापूर्वी गोदावरी कालव्याच्या पाणी सोडण्याच्या वेळापत्रकाची खात्री करा.`
          : `${village.name} sits within Godavari canal reach — check the current canal release schedule before relying on borewell pumping.`
      );
    } else {
      points.push(
        isMr
          ? `${village.name} हे नदीपासून मध्यम अंतरावर आहे — फक्त पावसावर अवलंबून न राहता प्रवरा बाजूच्या कालव्याचे पाणी शेतापर्यंत पोहोचते का याची खात्री करा.`
          : `${village.name} is a moderate distance from the river — confirm with your local irrigation office whether the Pravara-side canal branch currently reaches your field before planning the season purely on rainfall.`
      );
    }
  }

  if (detectedDisease && cropName) {
    if (detectedDisease.severity === "urgent") {
      urgency = "urgent";
      points.push(
        isMr
          ? `${cropName} पाहणी: ${detectedDisease.displayName} रोग आढळला आहे. ${detectedDisease.advisory}`
          : `${cropName} scan: ${detectedDisease.displayName} detected. ${detectedDisease.advisory}`
      );
    } else if (detectedDisease.severity === "watch") {
      if (urgency === "healthy") urgency = "watch";
      points.push(
        isMr
          ? `${cropName} पाहणी: ${detectedDisease.displayName} ची लक्षणे दिसली आहेत. ${detectedDisease.advisory}`
          : `${cropName} scan: ${detectedDisease.displayName} detected. ${detectedDisease.advisory}`
      );
    } else {
      points.push(
        isMr
          ? `${cropName} पाहणी: पीक निरोगी दिसत आहे. नियमन ठेवा.`
          : `${cropName} scan: plant looks healthy. ${detectedDisease.advisory}`
      );
    }
  }

  if (points.length === 0) {
    points.push(
      isMr
        ? "एकत्रित शेती सल्ला मिळवण्यासाठी तुमचे गाव निवडा आणि पिकाच्या पानाचा फोटो अपलोड करा."
        : "Select your village and scan a crop leaf to generate a combined advisory."
    );
  }

  const title = isMr
    ? urgency === "urgent"
      ? "तातडीने कारवाई करा"
      : urgency === "watch"
      ? "बारीक लक्ष ठेवा"
      : "परिस्थिती अनुकूल"
    : urgency === "urgent"
    ? "Act this week"
    : urgency === "watch"
    ? "Monitor closely"
    : "Conditions stable";

  return { urgency, title, points };
}
