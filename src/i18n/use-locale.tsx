"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Locale, type LocaleConfig, defaultLocale, getLocaleConfig, isLocale } from "./config";
import type { TranslationDictionary } from "./types";

const STORAGE_KEY = "app-locale";

interface LocaleContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  config: LocaleConfig;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
  loading: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function resolveNestedKey(obj: Record<string, unknown>, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
}

function getBrowserLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && isLocale(stored)) return stored;
  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const code = lang.split("-")[0];
    if (isLocale(code)) return code;
  }
  return null;
}

async function loadDictionary(locale: Locale): Promise<TranslationDictionary> {
  try {
    const mod = await import(`./dictionaries/${locale}.json`);
    return mod.default || mod;
  } catch {
    const fallback = await import("./dictionaries/en.json");
    return fallback.default || fallback;
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [dictionary, setDictionary] = useState<TranslationDictionary | null>(null);
  const [loading, setLoading] = useState(true);

  const applyLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = getLocaleConfig(newLocale).dir;
    setLoading(true);
    loadDictionary(newLocale).then((dict) => {
      setDictionary(dict);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const detected = getBrowserLocale() || defaultLocale;
    applyLocale(detected);
  }, [applyLocale]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      if (!dictionary) return key;
      const raw = resolveNestedKey(dictionary as unknown as Record<string, unknown>, key);
      let value = typeof raw === "string" ? raw : key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    },
    [dictionary]
  );

  const config = getLocaleConfig(locale);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        dir: config.dir,
        config,
        t,
        setLocale: applyLocale,
        loading,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

export function useTranslation() {
  const { t } = useLocale();
  return { t };
}

export function useDir(): "ltr" | "rtl" {
  return useLocale().dir;
}
