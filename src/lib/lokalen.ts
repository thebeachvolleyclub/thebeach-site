/**
 * /lokalen — datadriven bildbank för lokalsidan.
 *
 * Lägg till bilder genom att lägga en rad i BILDER. Ingen komponent behöver ändras;
 * filtren byggs automatiskt av de ytor och typer som faktiskt förekommer.
 *
 * Filer ligger i public/media/lokalen/ (nya) eller public/media/event-snurra/ (befintliga).
 */

export type YtaKey =
  | "sandplan-a"
  | "sandplan-b"
  | "sandplan-c"
  | "tradack"
  | "bar"
  | "utebanor";

export type TypKey =
  | "kickoff"
  | "fest"
  | "konferens"
  | "massa"
  | "turnering"
  | "brollop"
  | "julbord";

export const YTOR: { key: YtaKey; namn: string; beskrivning: string }[] = [
  { key: "sandplan-a", namn: "Sandplan A", beskrivning: "Banor 6–10 — den stora ytan, scen och dansgolv" },
  { key: "sandplan-b", namn: "Sandplan B", beskrivning: "Banor 1–2 — intill entrén" },
  { key: "sandplan-c", namn: "Sandplan C", beskrivning: "Banor 3–5" },
  { key: "tradack", namn: "Trädäck & altan", beskrivning: "Uteytan mot utebanorna" },
  { key: "bar", namn: "Bar & lounge", beskrivning: "Bar, reception och loungeytor" },
  { key: "utebanor", namn: "Utebanor", beskrivning: "7 banor utomhus" },
];

export const TYPER: { key: TypKey; namn: string }[] = [
  { key: "kickoff", namn: "Kickoff" },
  { key: "fest", namn: "Fest & bankett" },
  { key: "konferens", namn: "Konferens" },
  { key: "massa", namn: "Mässa & aktivering" },
  { key: "turnering", namn: "Turnering" },
  { key: "brollop", namn: "Bröllop" },
  { key: "julbord", namn: "Julbord" },
];

export type Bild = {
  fil: string;
  alt: string;
  yta: YtaKey[];
  typ: TypKey[];
  format: "liggande" | "staende";
  /** 1 = starkast, visas först. */
  prio?: number;
};

const SNURRA = "/media/event-snurra/";

export const HERO = {
  fil: SNURRA + "alfa_laval_245.webp",
  alt: "Scen med ljus och publik i sanden under ett företagsevent på The Beach",
};

export const BILDER: Bild[] = [
  // --- Fest, scen & bankett ---
  { fil: SNURRA + "alfa_laval_245.webp", alt: "Scen med ljuseffekter och publik i sanden", yta: ["sandplan-a"], typ: ["fest", "kickoff"], format: "liggande", prio: 1 },
  { fil: SNURRA + "alfa_laval_192.webp", alt: "Gäster dansar med armarna i luften framför scenen", yta: ["sandplan-a"], typ: ["fest"], format: "liggande", prio: 1 },
  { fil: SNURRA + "508687863_18506196583011036_836687121168.webp", alt: "Liveband på scenen under ett kvällsevent", yta: ["sandplan-a"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: SNURRA + "505470545_18505253833011036_905929504629.webp", alt: "Scenen i blått ljus sedd över sanden", yta: ["sandplan-a"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: SNURRA + "pxl_20260124_194423008mp.webp", alt: "Långbord dukade för middag i hallen", yta: ["sandplan-a"], typ: ["fest", "julbord"], format: "liggande", prio: 1 },
  { fil: SNURRA + "dji_20251128_210558_170.webp", alt: "Fullsatt hall med gäster under takkonstruktionen", yta: ["sandplan-a"], typ: ["fest"], format: "liggande", prio: 2 },

  // --- Bar & lounge ---
  { fil: SNURRA + "464906822_18461757397011036_773880143378.webp", alt: "Bartender häller upp en drink i baren", yta: ["bar"], typ: ["fest"], format: "liggande", prio: 2 },

  // --- Mässa & aktivering ---
  { fil: SNURRA + "caia.webp", alt: "Publik och energi under ett aktiveringsevent", yta: ["sandplan-a"], typ: ["massa", "fest"], format: "liggande", prio: 2 },
  { fil: SNURRA + "caia2.webp", alt: "Gäster firar under ett lanseringsevent i hallen", yta: ["sandplan-a"], typ: ["massa", "fest"], format: "liggande", prio: 3 },
  { fil: SNURRA + "caia_4.webp", alt: "Dansande gäster i sanden", yta: ["sandplan-a"], typ: ["massa", "fest"], format: "liggande", prio: 3 },

  // --- Kundens varumärke i lokalen ---
  { fil: SNURRA + "avanza-logga_dji_20251128_194332_727.webp", alt: "Kundens logotyp projicerad på solnedgångsväggen bakom scenen", yta: ["sandplan-a"], typ: ["kickoff", "fest", "massa"], format: "liggande", prio: 1 },
];

/** Snabbfakta — bostadsannonsens faktaruta. */
export const FAKTA: { etikett: string; varde: string }[] = [
  { etikett: "Yta", varde: "ca 3 150 m²" },
  { etikett: "Kapacitet", varde: "Upp till 900 gäster" },
  { etikett: "Banor inomhus", varde: "10 sandbanor" },
  { etikett: "Banor utomhus", varde: "7 sandbanor" },
  { etikett: "Scen & ljud", varde: "Fast scen, ljud och ljus" },
  { etikett: "Mat & dryck", varde: "Eget kök och bar" },
  { etikett: "Konferens", varde: "Projektor, skärm och whiteboard" },
  { etikett: "Läge", varde: "Huddinge — 20 min från city" },
  { etikett: "Parkering", varde: "Gratis, direkt utanför" },
  { etikett: "Temperatur", varde: "25°C året om" },
];

/** Ytor/typer som faktiskt har bilder — driver filterknapparna. */
export function aktivaYtor(bilder: Bild[] = BILDER) {
  const s = new Set(bilder.flatMap((b) => b.yta));
  return YTOR.filter((y) => s.has(y.key));
}
export function aktivaTyper(bilder: Bild[] = BILDER) {
  const s = new Set(bilder.flatMap((b) => b.typ));
  return TYPER.filter((t) => s.has(t.key));
}

/** Planlösningen — sätts till true när bilden är uppladdad. */
export const HAR_PLANLOSNING = false;
