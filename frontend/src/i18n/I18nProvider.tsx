"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Locale } from "./types";
import { SUPPORTED_LOCALES } from "./types";
import { translations } from "./translations";

const STORAGE_KEY = "basispilot-locale";

function detectLocale(): Locale {
  if (typeof window === "undefined") return "zh-CN";

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }

  const nav = navigator.language;
  if (nav.startsWith("zh-TW") || nav.startsWith("zh-Hant")) return "zh-TW";
  if (nav.startsWith("zh")) return "zh-CN";
  if (nav.startsWith("en")) return "en";

  return "zh-CN";
}

type TFunction = (key: string, params?: Record<string, string | number>) => string;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TFunction;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  // Sync html lang on mount
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t: TFunction = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const entry = translations[key];
      if (!entry) return key;
      let text = entry[locale] ?? entry["zh-CN"] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return text;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
