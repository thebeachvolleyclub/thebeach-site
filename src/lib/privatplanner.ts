/**
 * Privatplaneraren — data, prislogik och tidsplansgenerator för lördagsfester
 * (/events/privat). Ren logik som src/lib/planner.ts, men för privatpersoner:
 * ALLA priser ink moms (samma siffror som företagens ex moms, Davids beslut
 * 2026-07-24). "från"-priser gör estimatet till "Estimat från". Poster utan
 * pris hamnar under "I offerten".
 *
 * Endast svenska i v1 — därför inga locale-parametrar här.
 *
 * Exklusivitetslogiken: 50 000 kr ink moms i totalomsättning = garanterat
 * exklusiv arena. DJ, eldshow och liveband kräver exklusiv nivå — de spärras
 * inte, men ligger totalen (inkl dem) under tröskeln räknas paketdelen upp
 * med en egen rad till minimiomsättningen.
 */

export type PartyKey = "bday" | "wedding" | "sexa" | "friends";
export type TierKey = "lp" | "alg" | "mia";
export type Policy = "none" | "std" | "full";
export type BarMode = "guests" | "invoice" | "card" | "pre";
export type WelcomeKey = "cava" | "aperol" | "other";
export type DessertKey = "lemon" | "panna";
export type CoffeeKey = "kaffe" | "godis";

export interface PrivatState {
  party: PartyKey;
  guests: number;
  tier: TierKey;
  volley: boolean; // med beachvolley / utan spel (samma pris)
  start: string; // "HH:MM"
  policy: Policy;
  welcome: WelcomeKey | null;
  units: number;
  bar: BarMode;
  dukning: boolean;
  dekor: boolean;
  dessert: DessertKey | null;
  coffee: CoffeeKey | null;
  dj: boolean;
  eld: boolean;
  band: boolean;
  trubadur: boolean;
  dans: boolean;
  akt: boolean;
  lek: boolean;
  scen: boolean;
  ljud: boolean;
  foto: boolean;
  buss: boolean;
}

export const initialState: PrivatState = {
  party: "bday",
  guests: 30,
  tier: "alg",
  volley: true,
  start: "18:00",
  policy: "std",
  welcome: null,
  units: 0,
  bar: "guests",
  dukning: false,
  dekor: false,
  dessert: null,
  coffee: null,
  dj: false,
  eld: false,
  band: false,
  trubadur: false,
  dans: false,
  akt: false,
  lek: false,
  scen: false,
  ljud: false,
  foto: false,
  buss: false,
};

/** Festtypsetiketter — endast copy/förfrågningsdata, ingen prislogik. */
export const PARTYLBL: Record<PartyKey, string> = {
  bday: "Födelsedag & jubileum",
  wedding: "Bröllop & förlovning",
  sexa: "Svensexa & möhippa",
  friends: "Kompisgäng & annat",
};

export const TIERS: Record<TierKey, { name: string; price: number; units: number }> = {
  lp: { name: "Las Palmas", price: 745, units: 1 },
  alg: { name: "Algarve", price: 945, units: 1 },
  mia: { name: "Miami", price: 1195, units: 2 },
};

export const WELCOME: Record<WelcomeKey, { lbl: string; lblNA?: string; pp: number }> = {
  cava: { lbl: "Cava vid ankomst", lblNA: "Alkoholfritt bubbel vid ankomst", pp: 79 },
  aperol: { lbl: "Aperol Spritz vid ankomst", pp: 96 },
  other: { lbl: "Välkomstdrink 4 cl", lblNA: "Välkomstmocktail", pp: 96 },
};

export const NOALC_UNIT_DISCOUNT = 40; // avdrag per dryckesenhet vid alkoholfritt (ink moms)

export const PRICES = {
  unit: 79,
  unitNoAlc: 39, // 79 − 40
  bubbelNoAlc: 61,
  dukning: 100,
  dekor: 79,
  dessert: 75,
  kaffe: 30,
  godis: 45,
  dj: 5000, // från
  eld: 8000, // från
  scen: 10000, // från
  foto: 10000, // från
};

/** Minimiomsättning ink moms för garanterat exklusiv arena. */
export const MIN_EXCL = 50000;

export const BARLBL: Record<BarMode, string> = {
  guests: "Efter paketets enheter: gästerna betalar själva i baren",
  invoice: "Efter paketets enheter: öppen bar på faktura",
  card: "Efter paketets enheter: öppen bar — kortbetalning på plats",
  pre: "Efter paketets enheter: vi förköper fler dryckesbiljetter",
};

export const POLLBL: Record<Policy, string> = {
  none: "Ingen alkohol",
  std: "Öl, vin, cider & cava (ej sprit)",
  full: "Full bar",
};

export const fmt = (n: number) => n.toLocaleString("sv-SE");

export function welcomeLabel(s: PrivatState): string | null {
  if (!s.welcome) return null;
  const w = WELCOME[s.welcome];
  return s.policy === "none" && w.lblNA ? w.lblNA : w.lbl;
}

/** Vid alkoholfritt finns bara alkoholfri bubbel (61 kr) som välkomstdrink. */
export function welcomePrice(s: PrivatState): number {
  if (!s.welcome) return 0;
  return s.policy === "none" ? PRICES.bubbelNoAlc : WELCOME[s.welcome].pp;
}

/** DJ, eldshow och liveband kräver exklusiv arena. */
export const needsExclusive = (s: PrivatState) => s.dj || s.eld || s.band;

export interface SummaryLine {
  t: string;
  sub: string;
  amount: string;
}

export interface Summary {
  lines: SummaryLine[];
  offert: string[];
  total: number;
  fran: boolean;
  /** Totalen når exklusiv nivå (≥ 50 000 kr ink moms, ev. via uppräkning). */
  exclusive: boolean;
  /** Kr kvar till exklusiv arena (0 när exclusive). */
  gap: number;
}

export function calcSummary(s: PrivatState): Summary {
  const tp = TIERS[s.tier].price;
  const g = s.guests;
  const lines: SummaryLine[] = [];
  const offert: string[] = [];
  let pp = 0; // tillval per person
  let flat = 0;
  let fran = false;

  const base = tp * g;
  lines.push({
    t: TIERS[s.tier].name,
    sub: `lördagskväll · ${tp} kr/p ink moms × ${g}`,
    amount: `${fmt(base)} kr`,
  });
  if (s.policy === "none") {
    const disc = NOALC_UNIT_DISCOUNT * TIERS[s.tier].units;
    lines.push({
      t: "Alkoholfritt — avdrag",
      sub: `−${NOALC_UNIT_DISCOUNT} kr/enhet × ${TIERS[s.tier].units} ${TIERS[s.tier].units > 1 ? "enheter" : "enhet"} × ${g}`,
      amount: `−${fmt(disc * g)} kr`,
    });
    pp -= disc;
  }
  const wl = welcomeLabel(s);
  if (wl && s.welcome) {
    const p = welcomePrice(s);
    lines.push({ t: wl, sub: `${p} kr/p × ${g}`, amount: `${fmt(p * g)} kr` });
    pp += p;
  }
  if (s.units > 0) {
    const up = s.policy === "none" ? PRICES.unitNoAlc : PRICES.unit;
    lines.push({
      t: `Extra dryckesenheter${s.policy === "none" ? " (alkoholfria)" : ""} × ${s.units}`,
      sub: `${up} kr/p × ${g}`,
      amount: `${fmt(up * s.units * g)} kr`,
    });
    pp += up * s.units;
  }
  if (s.dukning) {
    lines.push({ t: "Dukad middag i sanden", sub: `${PRICES.dukning} kr/p × ${g}`, amount: `${fmt(PRICES.dukning * g)} kr` });
    pp += PRICES.dukning;
  }
  if (s.dekor) {
    lines.push({ t: "Extra dekoration", sub: `${PRICES.dekor} kr/p × ${g}`, amount: `${fmt(PRICES.dekor * g)} kr` });
    pp += PRICES.dekor;
  }
  if (s.dessert) {
    lines.push({ t: s.dessert === "lemon" ? "Lemonposset" : "Pannacotta", sub: `${PRICES.dessert} kr/p × ${g}`, amount: `${fmt(PRICES.dessert * g)} kr` });
    pp += PRICES.dessert;
  }
  if (s.coffee) {
    const [p, t] = s.coffee === "kaffe" ? [PRICES.kaffe, "Kaffe"] : [PRICES.godis, "Kaffe & godis"];
    lines.push({ t, sub: `${p} kr/p × ${g}`, amount: `${fmt(p * g)} kr` });
    pp += p;
  }
  if (s.dj) { lines.push({ t: "DJ", sub: "Normalt ingår 22–01", amount: `från ${fmt(PRICES.dj)} kr` }); flat += PRICES.dj; fran = true; }
  if (s.eld) { lines.push({ t: "Eldshow", sub: "Efter middagen — bryggan till dansgolvet", amount: `från ${fmt(PRICES.eld)} kr` }); flat += PRICES.eld; fran = true; }
  if (s.scen) { lines.push({ t: "Scen", sub: "fast tillägg", amount: `från ${fmt(PRICES.scen)} kr` }); flat += PRICES.scen; fran = true; }
  if (s.foto) { lines.push({ t: "Fotograf", sub: "fast tillägg", amount: `från ${fmt(PRICES.foto)} kr` }); flat += PRICES.foto; fran = true; }

  let total = base + pp * g + flat;

  /* DJ, eldshow och liveband kräver exklusiv arena — ligger totalen
     (inkl dem) under 50 000 räknas paketdelen upp till minimiomsättningen. */
  if (needsExclusive(s) && total < MIN_EXCL) {
    lines.push({
      t: "Exklusiv arena — minimiomsättning 50 000 kr ink moms",
      sub: "DJ, eldshow och liveband kräver att arenan är helt er",
      amount: `+${fmt(MIN_EXCL - total)} kr`,
    });
    total = MIN_EXCL;
  }

  const exclusive = total >= MIN_EXCL;

  offert.push(`Festtyp: ${PARTYLBL[s.party]}`);
  offert.push(
    s.volley
      ? "Med beachvolley — 1,5 h turnering med instruktör"
      : "Utan spel — mer häng, samma pris"
  );
  offert.push(`Önskad starttid: ${s.start}`);
  offert.push(`Alkoholpolicy: ${POLLBL[s.policy]}`);
  offert.push(BARLBL[s.bar]);
  if (s.band) offert.push("Liveband");
  if (s.trubadur) offert.push("Trubadur");
  if (s.dans) offert.push("Dansinstruktör");
  if (s.akt) offert.push(`Utökade aktiviteter (pingis, cornhole, kubb)${s.lek ? " · med lekledare" : ""}`);
  if (s.ljud) offert.push("Ljud & ljus utöver standard");
  if (s.buss) offert.push("Busstransport (Interbus)");

  return { lines, offert, total, fran, exclusive, gap: exclusive ? 0 : MIN_EXCL - total };
}

const tmin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const tfmt = (m: number) => {
  m = ((m % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}.${String(m % 60).padStart(2, "0")}`;
};

export interface TimelineRow {
  time: string;
  label: string;
}

/** Exempel-tidsplan utifrån valen. Preliminär — körschemat spikas i offerten. */
export function buildTimeline(s: PrivatState): TimelineRow[] {
  const st = tmin(s.start || "18:00");
  const rows: TimelineRow[] = [];
  rows.push({
    time: tfmt(st - 15),
    label: `Ankomst${s.welcome ? " — välkomstdrink i baren" : ""}`,
  });
  let dinner: number;
  if (s.volley) {
    rows.push({ time: `${tfmt(st)}–${tfmt(st + 90)}`, label: "Beachvolley — turnering med instruktör" });
    rows.push({ time: tfmt(st + 90), label: "Dusch och ombyte för de som vill" });
    dinner = st + 150;
  } else {
    rows.push({ time: tfmt(st), label: "Mingel i loungen" });
    dinner = st + 60;
  }
  const exclusive = calcSummary(s).exclusive;
  const after = s.eld || exclusive;
  rows.push({
    time: after ? tfmt(dinner) : `${tfmt(dinner)}–${tfmt(dinner + 120)}`,
    label: `Middag${s.dukning ? " — dukat långbord i sanden" : " i loungen"}`,
  });
  let dance = tmin("22:00");
  if (s.eld) {
    const eldT = Math.max(tmin("21:30"), dinner + 90);
    rows.push({ time: tfmt(eldT), label: "Eldshow — bryggan till dansgolvet" });
    dance = Math.max(dance, eldT + 30);
  }
  if (exclusive) {
    rows.push({
      time: tfmt(dance),
      label: `Dansgolv${s.dj ? " med DJ" : s.band ? " — liveband" : ""}`,
    });
    rows.push({ time: "01.00", label: "Slut" });
  } else {
    rows.push({ time: tfmt(dinner + 120), label: "Tack för i kväll" });
  }
  return rows;
}
