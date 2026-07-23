/**
 * Eventplaneraren — data, prislogik och tidsplansgenerator.
 * Priser ex moms, satta av David 2026-07-23. "från"-priser gör estimatet
 * till "Estimat från". Poster utan pris hamnar under "I offerten".
 *
 * i18n: textproducerande funktioner (welcomeLabel, calcSummary, buildTimeline)
 * tar locale (default "sv") och slår upp etiketter i src/lib/i18n/planner.ts.
 * WHENLBL/WELCOME behålls som svenska konstanter för bakåtkompatibilitet —
 * förfrågningsdatat som skickas till teamet är alltid på svenska.
 */

import type { Locale } from "@/lib/i18n";
import { plannerDict } from "@/lib/i18n/planner";

export type When = "day" | "weekeve" | "fri";
export type TierKey = "lp" | "alg" | "mia";
export type Policy = "none" | "std" | "full";
export type BarMode = "pre" | "invoice" | "guests";
export type WelcomeKey = "cava" | "aperol" | "other";
export type DessertKey = "lemon" | "panna";
export type CoffeeKey = "kaffe" | "godis";

export interface PlannerState {
  when: When;
  guests: number;
  tier: TierKey;
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
  konf: boolean;
  scen: boolean;
  ljud: boolean;
  foto: boolean;
  buss: boolean;
}

export const initialState: PlannerState = {
  when: "fri",
  guests: 25,
  tier: "alg",
  start: "17:30",
  policy: "std",
  welcome: null,
  units: 0,
  bar: "invoice",
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
  konf: false,
  scen: false,
  ljud: false,
  foto: false,
  buss: false,
};

/** Svenska format-etiketter — används i förfrågningsdatat (alltid sv). */
export const WHENLBL: Record<When, string> = {
  day: "vardag dagtid",
  weekeve: "kväll — mitt i beachlivet",
  fri: "helkväll — exklusiv arena (fre/lör)",
};

export const TIERS: Record<TierKey, { name: string; eve: number; day: number; units: number }> = {
  lp: { name: "Las Palmas", eve: 745, day: 670, units: 1 },
  alg: { name: "Algarve", eve: 945, day: 850, units: 1 },
  mia: { name: "Miami", eve: 1195, day: 1075, units: 2 },
};

/** Svenska etiketter + priser — etiketterna används i förfrågningsdatat (alltid sv). */
export const WELCOME: Record<WelcomeKey, { lbl: string; lblNA?: string; pp: number }> = {
  cava: { lbl: "Cava vid ankomst", lblNA: "Alkoholfritt bubbel vid ankomst", pp: 79 },
  aperol: { lbl: "Aperol Spritz vid ankomst", pp: 96 },
  other: { lbl: "Välkomstdrink 4 cl", lblNA: "Välkomstmocktail", pp: 96 },
};

export const NOALC_UNIT_DISCOUNT = 40; // avdrag per dryckesenhet vid alkoholfritt (ex moms)

export const PRICES = {
  unit: 79,
  unitNoAlc: 39, // 79 − 40
  bubbelNoAlc: 61,
  dukning: 100,
  dekor: 79,
  dessert: 75,
  kaffe: 30,
  godis: 45,
  konf: 395,
  dj: 5000, // från
  eld: 8000, // från
  scen: 10000, // från
  foto: 10000, // från
};

export const MIN_FRI = 50000; // minimiomsättning på paketet vid exklusiv arena fre/lör

export const partyAllowed = (s: PlannerState) => s.when === "fri";
export const sandAllowed = (s: PlannerState) => s.when !== "weekeve";
export const tierPrice = (s: PlannerState) =>
  s.when === "day" ? TIERS[s.tier].day : TIERS[s.tier].eve;

export const fmt = (n: number) => n.toLocaleString("sv-SE");

export function welcomeLabel(s: PlannerState, locale: Locale = "sv"): string | null {
  if (!s.welcome) return null;
  const w = plannerDict[locale].welcome[s.welcome];
  return s.policy === "none" && w.lblNA ? w.lblNA : w.lbl;
}

/** Vid alkoholfritt finns bara alkoholfri bubbel (61 kr) som välkomstdrink. */
export function welcomePrice(s: PlannerState): number {
  if (!s.welcome) return 0;
  return s.policy === "none" ? PRICES.bubbelNoAlc : WELCOME[s.welcome].pp;
}

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
}

export function calcSummary(s: PlannerState, locale: Locale = "sv"): Summary {
  const T = plannerDict[locale];
  const tp = tierPrice(s);
  const g = s.guests;
  const lines: SummaryLine[] = [];
  const offert: string[] = [];
  let pp = 0; // tillval per person
  let flat = 0;
  let fran = false;

  const base = tp * g;
  const packageTotal = s.when === "fri" ? Math.max(base, MIN_FRI) : base;
  lines.push({
    t: TIERS[s.tier].name,
    sub: `${T.whenLbl[s.when]} · ${tp} kr/p × ${g}`,
    amount: `${fmt(base)} kr`,
  });
  if (s.when === "fri" && base < MIN_FRI) {
    lines.push({
      t: T.sum.exclusiveArena,
      sub: `${T.sum.minTurnoverPre}${fmt(MIN_FRI)}${T.sum.minTurnoverPost}`,
      amount: `+${fmt(MIN_FRI - base)} kr`,
    });
  }
  if (s.policy === "none") {
    const disc = NOALC_UNIT_DISCOUNT * TIERS[s.tier].units;
    lines.push({
      t: T.sum.noAlcDeduction,
      sub: `−${NOALC_UNIT_DISCOUNT} ${T.sum.perUnit} × ${TIERS[s.tier].units} ${TIERS[s.tier].units > 1 ? T.sum.unitPlur : T.sum.unitSing} × ${g}`,
      amount: `−${fmt(disc * g)} kr`,
    });
    pp -= disc;
  }
  const wl = welcomeLabel(s, locale);
  if (wl && s.welcome) {
    const p = welcomePrice(s);
    lines.push({ t: wl, sub: `${p} kr/p × ${g}`, amount: `${fmt(p * g)} kr` });
    pp += p;
  }
  if (s.units > 0) {
    const up = s.policy === "none" ? PRICES.unitNoAlc : PRICES.unit;
    lines.push({
      t: `${T.sum.extraUnits}${s.policy === "none" ? T.sum.extraUnitsNoAlc : ""} × ${s.units}`,
      sub: `${up} kr/p × ${g}`,
      amount: `${fmt(up * s.units * g)} kr`,
    });
    pp += up * s.units;
  }
  if (s.dukning) {
    lines.push({ t: T.sum.dukning, sub: `${PRICES.dukning} kr/p × ${g}`, amount: `${fmt(PRICES.dukning * g)} kr` });
    pp += PRICES.dukning;
  }
  if (s.dekor) {
    lines.push({ t: T.sum.dekor, sub: `${PRICES.dekor} kr/p × ${g}`, amount: `${fmt(PRICES.dekor * g)} kr` });
    pp += PRICES.dekor;
  }
  if (s.dessert) {
    lines.push({ t: s.dessert === "lemon" ? T.sum.lemon : T.sum.panna, sub: `${PRICES.dessert} kr/p × ${g}`, amount: `${fmt(PRICES.dessert * g)} kr` });
    pp += PRICES.dessert;
  }
  if (s.coffee) {
    const [p, t] = s.coffee === "kaffe" ? [PRICES.kaffe, T.sum.kaffe] : [PRICES.godis, T.sum.godis];
    lines.push({ t, sub: `${p} kr/p × ${g}`, amount: `${fmt(p * g)} kr` });
    pp += p;
  }
  if (s.konf) {
    lines.push({ t: T.sum.konf, sub: `${PRICES.konf} kr/p × ${g}`, amount: `${fmt(PRICES.konf * g)} kr` });
    pp += PRICES.konf;
  }
  if (s.dj) { lines.push({ t: T.sum.dj, sub: T.sum.flatFee, amount: `${T.sum.from} ${fmt(PRICES.dj)} kr` }); flat += PRICES.dj; fran = true; }
  if (s.eld) { lines.push({ t: T.sum.eld, sub: T.sum.flatFee, amount: `${T.sum.from} ${fmt(PRICES.eld)} kr` }); flat += PRICES.eld; fran = true; }
  if (s.scen) { lines.push({ t: T.sum.scen, sub: T.sum.flatFee, amount: `${T.sum.from} ${fmt(PRICES.scen)} kr` }); flat += PRICES.scen; fran = true; }
  if (s.foto) { lines.push({ t: T.sum.foto, sub: T.sum.flatFee, amount: `${T.sum.from} ${fmt(PRICES.foto)} kr` }); flat += PRICES.foto; fran = true; }

  offert.push(`${T.sum.format}: ${T.whenLbl[s.when]}`);
  offert.push(`${T.sum.startTime}: ${s.start}`);
  offert.push(`${T.sum.alcoholPolicy}: ${T.polTxt[s.policy]}`);
  if (s.bar === "invoice") offert.push(T.sum.barInvoice);
  else if (s.bar === "pre") offert.push(T.sum.barPre);
  else offert.push(T.sum.barGuests);
  if (s.band) offert.push(T.sum.band);
  if (s.trubadur) offert.push(T.sum.trubadur);
  if (s.dans) offert.push(T.sum.dans);
  if (s.akt) offert.push(`${T.sum.akt}${s.lek ? T.sum.aktLek : ""}`);
  if (s.ljud) offert.push(T.sum.ljud);
  if (s.buss) offert.push(T.sum.buss);

  return { lines, offert, total: packageTotal + pp * g + flat, fran };
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
export function buildTimeline(s: PlannerState, locale: Locale = "sv"): TimelineRow[] {
  const T = plannerDict[locale];
  const st = tmin(s.start || "17:30");
  const meal = s.when === "day" ? T.timeline.lunch : T.timeline.dinner;
  const rows: TimelineRow[] = [];
  rows.push({ time: tfmt(st - 15), label: T.timeline.arrival });
  rows.push({
    time: `${tfmt(st)}–${tfmt(st + 90)}`,
    label: `${T.timeline.volley}${st < tmin("17:00") ? T.timeline.volleyTeam : ""}`,
  });
  rows.push({ time: tfmt(st + 90), label: T.timeline.shower });
  let m = st + 120;
  const dr: string[] = [];
  const wl = welcomeLabel(s, locale);
  if (wl) dr.push(`${wl.replace(T.timeline.welcomeStrip, "")}${T.timeline.servedInBar}`);
  if (s.trubadur) dr.push(T.timeline.trubadurPlays);
  if (dr.length) {
    const t = dr.join(" · ");
    rows.push({ time: tfmt(st + 120), label: t.charAt(0).toUpperCase() + t.slice(1) });
    m = st + 150;
  }
  const after = s.eld || s.dj || s.band;
  const mealPlace = s.dukning
    ? T.timeline.mealSand
    : s.when === "weekeve"
      ? T.timeline.mealLoungeShared
      : T.timeline.mealLounge;
  rows.push({ time: after ? tfmt(m) : `${tfmt(m)}–${tfmt(m + 120)}`, label: meal + mealPlace });
  const cur = m + 120;
  if (s.eld) rows.push({ time: tfmt(cur - 30), label: T.timeline.fireShow });
  if (s.dj || s.band) {
    rows.push({ time: tfmt(cur), label: `${T.timeline.danceFloor}${s.dj ? T.timeline.withDj : T.timeline.withBand}` });
    rows.push({ time: s.when === "day" ? tfmt(cur + 120) : "00.00", label: T.timeline.end });
  } else if (s.konf && s.when === "day") {
    rows.push({ time: `${tfmt(cur)}–${tfmt(cur + 180)}`, label: T.timeline.conference });
    rows.push({ time: tfmt(cur + 180), label: T.timeline.thanksDay });
  } else {
    rows.push({ time: tfmt(cur), label: s.when === "day" ? T.timeline.thanksDay : T.timeline.thanksEve });
  }
  return rows;
}
