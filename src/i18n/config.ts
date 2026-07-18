export const locales = ["en", "ar", "fr", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export interface LocaleConfig {
  code: Locale;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
  dateFormat: Intl.DateTimeFormatOptions;
  currency: string;
  numberLocale: string;
}

export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: "en",
    label: "English",
    nativeLabel: "English",
    dir: "ltr",
    dateFormat: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    currency: "USD",
    numberLocale: "en-US",
  },
  ar: {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    dir: "rtl",
    dateFormat: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    currency: "USD",
    numberLocale: "ar-SA",
  },
  fr: {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    dir: "ltr",
    dateFormat: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    currency: "USD",
    numberLocale: "fr-FR",
  },
  es: {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    dir: "ltr",
    dateFormat: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    currency: "USD",
    numberLocale: "es-ES",
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return localeConfigs[locale];
}
