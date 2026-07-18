"use client";

import { useLocale } from "./use-locale";
import { locales, localeConfigs } from "./config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
      <Select value={locale} onValueChange={(v) => setLocale(v as typeof locale)}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {locales.map((code) => (
            <SelectItem key={code} value={code} className="text-xs">
              {localeConfigs[code].nativeLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
