import { type Locale, getLocaleConfig } from "./config";

export function formatDate(date: string | Date, locale: Locale): string {
  const config = getLocaleConfig(locale);
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return new Intl.DateTimeFormat(config.numberLocale, config.dateFormat).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

export function formatDateTime(date: string | Date, locale: Locale): string {
  const config = getLocaleConfig(locale);
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return new Intl.DateTimeFormat(config.numberLocale, {
      ...config.dateFormat,
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

export function formatCurrency(value: number, locale: Locale, currency?: string): string {
  const config = getLocaleConfig(locale);
  const curr = currency || config.currency;
  try {
    return new Intl.NumberFormat(config.numberLocale, {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${curr} ${value.toFixed(2)}`;
  }
}

export function formatNumber(value: number, locale: Locale): string {
  const config = getLocaleConfig(locale);
  try {
    return new Intl.NumberFormat(config.numberLocale).format(value);
  } catch {
    return String(value);
  }
}

export function formatPercent(value: number, locale: Locale): string {
  const config = getLocaleConfig(locale);
  try {
    return new Intl.NumberFormat(config.numberLocale, {
      style: "percent",
      minimumFractionDigits: 0,
    }).format(value / 100);
  } catch {
    return `${value}%`;
  }
}
