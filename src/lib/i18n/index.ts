/**
 * i18n-grund — "en sida, två texter".
 *
 * Mönstret: varje sida har EN komponent (src/components/pages/*) och EN ordbok
 * (src/lib/i18n/*). Ordboken är typad Record<Locale, T> — saknas en engelsk
 * nyckel blir det ett byggfel, inte en tyst lucka. Ruttfilerna under /app är
 * tunna skal som bara väljer locale.
 */

export type Locale = "sv" | "en";
export const LOCALES: Locale[] = ["sv", "en"];

/** Typad ordbok: samma innehållstyp för alla språk. */
export type Dict<T> = Record<Locale, T>;

/** hreflang/canonical-block för metadata — samma på båda språkversionerna. */
export function altLang(svPath: string, enPath: string, locale: Locale) {
  return {
    canonical: locale === "sv" ? svPath : enPath,
    languages: { sv: svPath, en: enPath, "x-default": svPath },
  };
}
