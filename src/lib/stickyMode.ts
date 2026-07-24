/**
 * Kontextläge för de flytande boknings-CTA:erna (MobileBookingBar +
 * DesktopStickies). Regel: stickyn får aldrig konkurrera med en pågående
 * funnel, och på eventsidor ska den driva MOT eventfunneln — inte bort
 * från den (en eventkund ska inte nedförsäljas till en banbokning).
 *
 *  - "hidden"  → aktiv funnel/verktygssida: visa ingenting
 *  - "event"   → eventintent-sida: en enda CTA → eventplaneraren
 *  - "default" → browse-sida: vanliga Event + Boka bana
 */
export type StickyMode = "default" | "event" | "hidden";

const HIDDEN_EXACT = new Set([
  "/boka",
  "/book",
  "/anmalan",
  "/avanmalan",
  "/andringsanmalan",
  "/konto",
]);

const HIDDEN_PREFIX = ["/events/planera", "/events/plan", "/skarm"];

const EVENT_PAGES = new Set([
  "/events",
  "/firmafest",
  "/company-party",
  "/foretagsevent",
  "/corporate-events",
  "/julbord",
  "/christmas-party",
  "/kickoff",
  "/konferens",
  "/conference",
  "/teambuilding",
  "/team-building",
  "/barnkalas",
  "/kids-party",
  "/mohippa",
  "/svensexa",
  "/skola",
  "/school",
  "/lokalen",
  "/venue",
]);

export function stickyMode(pathname: string): StickyMode {
  // Normalisera bort /en-prefixet så sv/en delar samma regler.
  const p = (pathname.replace(/^\/en(?=\/|$)/, "") || "/").replace(/\/+$/, "") || "/";

  if (HIDDEN_EXACT.has(p) || HIDDEN_PREFIX.some((h) => p === h || p.startsWith(h + "/"))) {
    return "hidden";
  }
  if (EVENT_PAGES.has(p)) return "event";
  return "default";
}
