/**
 * PROFIXIO-SYNK — hämtar SVBF:s tävlingskalender (Profixio) server-side,
 * filtrerar fram tävlingar där The Beach är arrangör och mergar in dem i
 * sajtens kalender (src/lib/kalender.ts).
 *
 * Regler:
 * - Manuella poster i kalender.ts VINNER alltid (samma dag + typ tournament
 *   → auto-posten hoppas över). Manuella poster rörs aldrig.
 * - Endast framtida tävlingar (idag och framåt, Europe/Stockholm) läggs till.
 * - Fallback-kedja om Profixio inte svarar eller bytt sidstruktur:
 *   senaste lyckade hämtning (minne) → committad seed (profixio-seed.json)
 *   → enbart manuella poster. Fel loggas med prefix [profixio-sync].
 * - Cache: 6 h i minnet + ISR-revalidate på sidorna som konsumerar datat.
 */

import { MONTHS as MANUAL_MONTHS, type Ev, type Month } from "./kalender";
import seed from "./profixio-seed.json";

export type ProfixioEvent = {
  date: string; // "2026-07-18"
  name: string; // "The Beach SBT1* 18 juli"
  klass: string; // "SBT Open Grön 1*"
  ibId: string;
};

const LOGIN_URL = "https://www.profixio.com/fx/login.php?login_public=SVBF.SE.SVB";
const LIST_URL = "https://www.profixio.com/fx/terminliste.php";
const PROFIXIO_PUBLIC = "https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB";
const CLUB = "The Beach";
const TTL_MS = 6 * 60 * 60 * 1000;

let cache: { at: number; events: ProfixioEvent[] } | null = null;

/* ---------------- Hämtning & parsning ---------------- */

async function fetchList(): Promise<ProfixioEvent[]> {
  // 1) Gäst-inloggning → session-cookie
  const login = await fetch(LOGIN_URL, { redirect: "manual", cache: "no-store" });
  const setCookies: string[] =
    typeof login.headers.getSetCookie === "function"
      ? login.headers.getSetCookie()
      : login.headers.get("set-cookie")
        ? [login.headers.get("set-cookie") as string]
        : [];
  const cookie = setCookies.map((c) => c.split(";")[0]).join("; ");
  if (!cookie) throw new Error("ingen session-cookie från gäst-inloggningen");

  // 2) Säsongskalendern
  const res = await fetch(LIST_URL, { headers: { cookie }, cache: "no-store" });
  if (!res.ok) throw new Error(`terminliste svarade ${res.status}`);
  const html = await res.text();

  // Radformat: <tr ...><td>2026.07.18</td> <td>07.18</td> <td>TP 10</td>
  // <td>Klubb</td> <td><a href='vis_innbydelse.php?ib_id=NNN'>Namn</a></td>
  // <td>Klass</td> <td>Kategorier</td></tr>
  // Namncellen kan vara en länk (publicerad inbjudan) ELLER ren text (ej publicerad än).
  const rowRe =
    /<tr[^>]*><td>(\d{4})\.(\d{2})\.(\d{2})<\/td>\s*<td>[\d.]*<\/td>\s*<td>[^<]*<\/td>\s*<td>([^<]*)<\/td>\s*<td>(?:<a href='vis_innbydelse\.php\?ib_id=(\d+)'[^>]*>([^<]*)<\/a>|([^<]*))<\/td>\s*<td>([^<]*)<\/td>/g;

  const all = [...html.matchAll(rowRe)];
  if (all.length === 0) {
    throw new Error("0 rader parsades — Profixio kan ha ändrat sidstrukturen");
  }
  const clean = (x?: string) => (x ?? "").replace(/&nbsp;/g, " ").trim();
  return all
    .filter((m) => clean(m[4]) === CLUB)
    .map((m) => ({
      date: `${m[1]}-${m[2]}-${m[3]}`,
      name: clean(m[6]) || clean(m[7]),
      klass: clean(m[8]),
      ibId: m[5] ?? "",
    }));
}

export async function getProfixioTheBeach(): Promise<ProfixioEvent[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.events;
  try {
    const events = await fetchList();
    cache = { at: Date.now(), events };
    return events;
  } catch (err) {
    console.error("[profixio-sync] hämtning misslyckades, använder fallback:", err);
    if (cache) return cache.events; // senaste lyckade
    return seed as ProfixioEvent[]; // committad snapshot
  }
}

/* ---------------- Presentation ---------------- */

const MONTH_NAMES = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December",
];
const WEEKDAYS = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

const STYCKE_ANMALAN =
  "Anmälan och betalning sker via Svenska Volleybollförbundets tävlingsplattform [Profixio](" +
  PROFIXIO_PUBLIC +
  "). Länken leder till säsongskalendern som uppdateras löpande — därifrån klickar du dig vidare till just den här turneringen. Din anmälan är giltig först när betalningen är genomförd i Profixio; ingen betalning före deadline = ingen anmälan.";

const stickeLicens = (rank: boolean) =>
  `För att ${rank ? "spela rankinggrundande turneringar" : "tävla"} krävs tävlingslicens via Svenska Volleybollförbundet. Du söker licens genom en förening — du är varmt välkommen att gå med i vår, [The Beach Volley Club Huddinge](/foreningen). Medlemskap + licens kostar 350 kr (190 kr för junior) och ger dessutom rabatt på bokningar. Licensen aktiveras inte automatiskt, så be om att få den aktiverad i god tid innan du anmäler dig.`;

const CTA = { label: "Anmäl via Profixio", href: PROFIXIO_PUBLIC };

function presentation(p: ProfixioEvent): Omit<Ev, "day" | "wd"> {
  const k = p.klass.toLowerCase();
  const n = p.name.toLowerCase();
  const stars = (p.klass.match(/(\d)\s*\*/) ?? p.name.match(/(\d)\s*\*/))?.[1];

  if (k.includes("sbt") || n.includes("sbt")) {
    const nivo = stars ? `SBT${stars}` : "SBT";
    const beskr =
      stars === "1"
        ? "SBT 1-stjärnig rankingtävling — instegsnivån i Stockholm Beach Tour, med både nybörjare och mer erfarna spelare. Välkommen att tävla oavsett om det är din första turnering eller om du jagar rankingpoäng mot de stora scenerna. Publik är varmt välkommen och serveringen är öppen hela dagen."
        : `SBT ${stars ?? ""}-stjärnig rankingtävling i Stockholm Beach Tour — här möts många av regionens bästa spelare. Publik är varmt välkommen och serveringen är öppen hela dagen.`;
    return {
      title: `${nivo} — Stockholm Beach Tour`,
      meta: "Rankingtävling · Anmälan & betalning via Profixio",
      badge: "SBT",
      type: "tournament",
      beskrivning: beskr,
      stycken: [STYCKE_ANMALAN, stickeLicens(true)],
      cta: CTA,
      skarm: true,
    };
  }
  if (k.includes("mixed") || n.includes("mixed")) {
    return {
      title: "Mixed Tournament",
      meta: "Tävling · Anmälan & betalning via Profixio",
      badge: "Mixed",
      type: "tournament",
      beskrivning:
        "Mixedturnering — kul format för alla nivåer, du behöver inte vara en rankad spelare. Välkommen att tävla oavsett om det är din första turnering eller om du bara vill spela en riktigt bra beachdag med världens bästa stämning.",
      stycken: [STYCKE_ANMALAN, stickeLicens(false)],
      cta: CTA,
      skarm: true,
    };
  }
  return {
    title: p.name.replace(/^The Beach\s*/i, "").trim() || p.name,
    meta: "Tävling · Anmälan & betalning via Profixio",
    badge: "Tävling",
    type: "tournament",
    beskrivning:
      "Tävling på The Beach. Anmälan och betalning sker via Profixio — se länken nedan.",
    stycken: [STYCKE_ANMALAN, stickeLicens(false)],
    cta: CTA,
    skarm: true,
  };
}

function slugFor(p: ProfixioEvent, title: string, taken: Set<string>): string {
  const d = new Date(p.date + "T12:00:00");
  const base = title.startsWith("SBT")
    ? title.split(" ")[0].toLowerCase()
    : title.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  let slug = `${base}-${d.getDate()}-${MONTH_NAMES[d.getMonth()].toLowerCase()}`;
  if (taken.has(slug)) slug = `${slug}-${p.ibId || p.date.replace(/-/g, "")}`;
  taken.add(slug);
  return slug;
}

/* ---------------- Merge ---------------- */

function todayStockholm(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });
}

function monthKey(label: string): number {
  const [name, year] = label.split(" ");
  const idx = MONTH_NAMES.findIndex((m) => m.toLowerCase() === (name ?? "").toLowerCase());
  return (parseInt(year ?? "0", 10) || 0) * 12 + (idx >= 0 ? idx : 0);
}

/** Sajtens kalender = manuella poster + framtida Profixio-tävlingar. */
export async function getMergedMonths(): Promise<Month[]> {
  const months: Month[] = JSON.parse(JSON.stringify(MANUAL_MONTHS));
  const today = todayStockholm();

  let profixio: ProfixioEvent[] = [];
  try {
    profixio = await getProfixioTheBeach();
  } catch (err) {
    console.error("[profixio-sync] oväntat fel, visar enbart manuella poster:", err);
  }

  const taken = new Set<string>(
    months.flatMap((m) => m.events.map((e) => e.slug)).filter(Boolean) as string[],
  );

  for (const p of profixio) {
    if (p.date < today) continue; // bara framtida

    const d = new Date(p.date + "T12:00:00");
    const label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    let month = months.find((m) => m.month.toLowerCase() === label.toLowerCase());
    if (!month) {
      month = { month: label, events: [] };
      months.push(month);
    }

    // Manuell post vinner: samma dag + tournament → hoppa över auto-posten.
    const day = String(d.getDate());
    if (month.events.some((e) => e.day === day && e.type === "tournament")) continue;

    const pres = presentation(p);
    month.events.push({
      ...pres,
      day,
      wd: WEEKDAYS[d.getDay()],
      slug: slugFor(p, pres.title, taken),
    });
  }

  months.sort((a, b) => monthKey(a.month) - monthKey(b.month));
  for (const m of months)
    m.events.sort((a, b) => parseInt(a.day, 10) - parseInt(b.day, 10));
  return months;
}

/* ---------------- Async-varianter av kalender.ts-hjälparna ---------------- */

export async function mergedAllEvents(): Promise<{ month: string; ev: Ev }[]> {
  return (await getMergedMonths()).flatMap((m) => m.events.map((ev) => ({ month: m.month, ev })));
}

export async function mergedBySlug(slug: string): Promise<{ month: string; ev: Ev } | undefined> {
  return (await mergedAllEvents()).find((x) => x.ev.slug === slug);
}

export async function mergedScreenEvents(): Promise<{ month: string; ev: Ev }[]> {
  return (await mergedAllEvents()).filter((x) => x.ev.skarm);
}
