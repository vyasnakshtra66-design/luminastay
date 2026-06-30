"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface LangContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LangContext = createContext<LangContextType>({ language: "en", setLanguage: () => {} });

export function LanguageProvider({ children, savedLang }: { children: ReactNode; savedLang?: string }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState(savedLang || "en");

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (savedLang && savedLang !== language) {
      setLanguage(savedLang);
    }
  }, [savedLang]);

  return (
    <LangContext.Provider value={{ language, setLanguage }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LangContext);
}
