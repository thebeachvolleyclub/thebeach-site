/**
 * Karta svenska ↔ engelska sidor. Växlaren tar besökaren till samma
 * sida på andra språket. Saknas motsvarighet → språkets startsida.
 */
export const SV_TO_EN: Record<string, string> = {
  "/": "/en",
  "/events": "/en/events",
  "/lokalen": "/en",
  "/boka": "/en/book",
  "/skola": "/en/school",
  "/om-oss": "/en/about",
  "/faq": "/en/faq",
};

export const EN_TO_SV: Record<string, string> = Object.fromEntries(
  Object.entries(SV_TO_EN).map(([sv, en]) => [en, sv])
);

export function toEnglish(pathname: string): string {
  return SV_TO_EN[pathname] ?? "/en";
}
export function toSwedish(pathname: string): string {
  return EN_TO_SV[pathname] ?? "/";
}
