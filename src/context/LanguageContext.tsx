import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
import { Language, TranslationKey } from "../i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const STORAGE_KEY_LANG = "krishi_setu_lang_v1";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { t: i18nT } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved === "mr" || saved === "hi" || saved === "en" ? (saved as Language) : (i18n.language as Language) || "en";
  });

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }

  function t(key: TranslationKey): string {
    const translated = i18nT(key);
    return translated !== key ? translated : (i18n.getResource("en", "translation", key) as string) || key;
  }

  useEffect(() => {
    document.documentElement.lang = language;
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
