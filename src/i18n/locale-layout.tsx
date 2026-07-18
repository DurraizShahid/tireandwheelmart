"use client";

import { type ReactNode, useEffect, useState } from "react";
import { LocaleProvider, useLocale } from "./use-locale";

function HtmlUpdater({ children }: { children: ReactNode }) {
  const { dir, locale } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    setMounted(true);
  }, [dir, locale]);

  if (!mounted) return <>{children}</>;
  return <>{children}</>;
}

export function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <HtmlUpdater>{children}</HtmlUpdater>
    </LocaleProvider>
  );
}
