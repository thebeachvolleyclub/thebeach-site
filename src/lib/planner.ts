/**
 * Eventplaneraren — data, prislogik och tidsplansgenerator.
 * Priser ex moms, satta av David 2026-07-23. "från"-priser gör estimatet
 * till "Estimat från". Poster utan pris hamnar under "I offerten".
 */

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

export const WHENLBL: Record<When, string> = {
  day: "vardag dagtid",
  weekeve: "kväll — mitt i beachlivet",
  fri: "helkväll — exklusiv arena (fre/lör)",
};

export const TIERS: Record<TierKey, { name: string; eve: number; day: number }> = {
  lp: { name: "Las Palmas", eve: 745, day: 670 },
  alg: { name: "Algarve", eve: 945, day: 850 },
  mia: { name: "Miami", eve: 1195, day: 1075 },
};

export const WELCOME: Record<WelcomeKey, { lbl: string; lblNA?: string; pp: number }> = {
  cava: { lbl: "Cava vid ankomst", lblNA: "Alkoholfritt bubbel vid ankomst", pp: 79 },
  aperol: { lbl: "Aperol Spritz vid ankomst", pp: 96 },
  other: { lbl: "Välkomstdrink 4 cl", lblNA: "Välkomstmocktail", pp: 96 },
};

export const PRICES = {
  unit: 79,
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

export function welcomeLabel(s: PlannerState): string | null {
  if (!s.welcome) return null;
  const w = WELCOME[s.welcome];
  return s.policy === "none" && w.lblNA ? w.lblNA : w.lbl;
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

export function calcSummary(s: PlannerState): Summary {
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
    sub: `${WHENLBL[s.when]} · ${tp} kr/p × ${g}`,
    amount: `${fmt(base)} kr`,
  });
  if (s.when === "fri" && base < MIN_FRI) {
    lines.push({
      t: "Exklusiv arena fre/lör",
      sub: `minimiomsättning ${fmt(MIN_FRI)} kr på paketet`,
      amount: `+${fmt(MIN_FRI - base)} kr`,
    });
  }
  const wl = welcomeLabel(s);
  if (wl && s.welcome) {
    const p = WELCOME[s.welcome].pp;
    lines.push({ t: wl, sub: `${p} kr/p × ${g}`, amount: `${fmt(p * g)} kr` });
    pp += p;
  }
  if (s.units > 0) {
    lines.push({
      t: `Extra dryckesenheter × ${s.units}`,
      sub: `${PRICES.unit} kr/p × ${g}`,
      amount: `${fmt(PRICES.unit * s.units * g)} kr`,
    });
    pp += PRICES.unit * s.units;
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
  if (s.konf) {
    lines.push({ t: "Konferenspaket", sub: `${PRICES.konf} kr/p × ${g}`, amount: `${fmt(PRICES.konf * g)} kr` });
    pp += PRICES.konf;
  }
  if (s.dj) { lines.push({ t: "DJ (normalt 22–00/01)", sub: "fast tillägg", amount: `från ${fmt(PRICES.dj)} kr` }); flat += PRICES.dj; fran = true; }
  if (s.eld) { lines.push({ t: "Eldshow", sub: "fast tillägg", amount: `från ${fmt(PRICES.eld)} kr` }); flat += PRICES.eld; fran = true; }
  if (s.scen) { lines.push({ t: "Scen", sub: "fast tillägg", amount: `från ${fmt(PRICES.scen)} kr` }); flat += PRICES.scen; fran = true; }
  if (s.foto) { lines.push({ t: "Fotograf", sub: "fast tillägg", amount: `från ${fmt(PRICES.foto)} kr` }); flat += PRICES.foto; fran = true; }

  const polTxt: Record<Policy, string> = {
    none: "Ingen alkohol",
    std: "Öl, vin, cider & cava (ej sprit)",
    full: "Full bar",
  };
  offert.push(`Format: ${WHENLBL[s.when]}`);
  offert.push(`Önskad starttid: ${s.start}`);
  offert.push(`Alkoholpolicy: ${polTxt[s.policy]}`);
  if (s.bar === "invoice") offert.push("Efter paketets enheter: öppen bar på faktura");
  else if (s.bar === "pre") offert.push("Dryckesbiljetter vid ankomst (förköpta enheter)");
  else offert.push("Efter paketets enheter: gästerna betalar själva");
  if (s.band) offert.push("Liveband");
  if (s.trubadur) offert.push("Trubadur");
  if (s.dans) offert.push("Dansinstruktör");
  if (s.akt) offert.push(`Utökade aktiviteter (pingis, cornhole, kubb)${s.lek ? " · med lekledare" : ""}`);
  if (s.ljud) offert.push("Ljud & ljus utöver standard");
  if (s.buss) offert.push("Busstransport (Interbus)");

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
export function buildTimeline(s: PlannerState): TimelineRow[] {
  const st = tmin(s.start || "17:30");
  const meal = s.when === "day" ? "Lunch" : "Middag";
  const rows: TimelineRow[] = [];
  rows.push({ time: tfmt(st - 15), label: "Ankomst och ombyte" });
  rows.push({
    time: `${tfmt(st)}–${tfmt(st + 90)}`,
    label: `Beachvolley — turnering med instruktör${st < tmin("17:00") ? ", fokus teambuilding" : ""}`,
  });
  rows.push({ time: tfmt(st + 90), label: "Dusch och ombyte för de som vill" });
  let m = st + 120;
  const dr: string[] = [];
  const wl = welcomeLabel(s);
  if (wl) dr.push(`${wl.replace(" vid ankomst", "")} serveras i baren`);
  if (s.trubadur) dr.push("trubadur spelar i loungen");
  if (dr.length) {
    const t = dr.join(" · ");
    rows.push({ time: tfmt(st + 120), label: t.charAt(0).toUpperCase() + t.slice(1) });
    m = st + 150;
  }
  const after = s.eld || s.dj || s.band;
  const mealPlace = s.dukning
    ? " — dukat långbord i sanden"
    : s.when === "weekeve"
      ? " i loungen — beachlivet pågår runt er"
      : " i loungen";
  rows.push({ time: after ? tfmt(m) : `${tfmt(m)}–${tfmt(m + 120)}`, label: meal + mealPlace });
  const cur = m + 120;
  if (s.eld) rows.push({ time: tfmt(cur - 30), label: "Eldshow — bryggan till dansgolvet" });
  if (s.dj || s.band) {
    rows.push({ time: tfmt(cur), label: `Dansgolv${s.dj ? " med DJ" : " — liveband"}` });
    rows.push({ time: s.when === "day" ? tfmt(cur + 120) : "00.00", label: "Slut" });
  } else if (s.konf && s.when === "day") {
    rows.push({ time: `${tfmt(cur)}–${tfmt(cur + 180)}`, label: "Konferens (upp till 3 h)" });
    rows.push({ time: tfmt(cur + 180), label: "Tack för idag" });
  } else {
    rows.push({ time: tfmt(cur), label: s.when === "day" ? "Tack för idag" : "Tack för i kväll" });
  }
  return rows;
}
