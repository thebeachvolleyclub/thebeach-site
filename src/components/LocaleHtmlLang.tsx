"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sätter <html lang> per språk. Rot-layouten renderar lang="sv" server-side;
 * den här komponenten rättar till "en" på /en-rutterna så skärmläsare
 * uttalar engelskan rätt. (Crawlers får språksignalen via hreflang.)
 */
export default function LocaleHtmlLang() {
  const pathname = usePathname() ?? "/";
  useEffect(() => {
    const lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "sv";
    if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
  }, [pathname]);
  return null;
}
