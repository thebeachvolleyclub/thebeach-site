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

/** Sidor med en egen kassa/anmälan i sidan — nudgen får inte ligga i vägen. */
const NUDGE_BLOCKED = new Set(["/", "/trana", "/training", "/kurser"]);

function normalise(pathname: string) {
  // Normalisera bort /en-prefixet så sv/en delar samma regler.
  return (pathname.replace(/^\/en(?=\/|$)/, "") || "/").replace(/\/+$/, "") || "/";
}

export function stickyMode(pathname: string): StickyMode {
  const p = normalise(pathname);

  if (HIDDEN_EXACT.has(p) || HIDDEN_PREFIX.some((h) => p === h || p.startsWith(h + "/"))) {
    return "hidden";
  }
  if (EVENT_PAGES.has(p)) return "event";
  return "default";
}

/**
 * Nyhetsbrevs-nudgen är en avbrytare. Den låg tidigare ovanpå kryssrutan och
 * Anmäl dig-knappen på första kurskortet på /trana och kostade oss anmälningar.
 * Regeln: aldrig på startsidan (som redan har nyhetsbrevssektionen), aldrig på
 * en sida med en pågående funnel, och aldrig på kurssidorna.
 */
export function newsletterNudgeAllowed(pathname: string): boolean {
  const p = normalise(pathname);
  if (NUDGE_BLOCKED.has(p) || p.startsWith("/kurser/")) return false;
  return stickyMode(pathname) !== "hidden";
}
