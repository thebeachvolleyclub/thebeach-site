/**
 * Karta svenska ↔ engelska sidor. Växlaren tar besökaren till samma
 * sida på andra språket. Saknas motsvarighet → språkets startsida.
 */
export const SV_TO_EN: Record<string, string> = {
  "/": "/en",
  "/events": "/en/events",
  "/events/planera": "/en/events/plan",
  "/lokalen": "/en/venue",
  "/boka": "/en/book",
  "/skola": "/en/school",
  "/om-oss": "/en/about",
  "/faq": "/en/faq",
  "/julbord": "/en/christmas-party",
  "/barnkalas": "/en/kids-party",
  "/hallbarhet": "/en/sustainability",
  "/konferens": "/en/conference",
  "/kickoff": "/en/kickoff",
  "/teambuilding": "/en/team-building",
  "/foretagsevent": "/en/corporate-events",
  "/firmafest": "/en/company-party",
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
