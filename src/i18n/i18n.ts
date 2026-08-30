import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "./translations";

const STORAGE_KEY_LANG = "krishi_setu_lang_v1";
const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
const initialLang = savedLang === "mr" || savedLang === "hi" || savedLang === "en" ? savedLang : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translations.en },
    mr: { translation: translations.mr },
    hi: { translation: translations.hi }
  },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false // React already escapes values
  }
});

export default i18n;
