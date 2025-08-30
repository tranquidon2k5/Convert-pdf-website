"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SupportedLanguage = "en" | "vi";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("app_language");
      if (stored === "en" || stored === "vi") {
        setLanguageState(stored);
      }
    } catch {}
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem("app_language", lang);
    } catch {}
  };

  const value = useMemo<LanguageContextValue>(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}


