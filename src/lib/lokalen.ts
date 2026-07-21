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
const NY = "/media/lokalen/";

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
  // === Uppladdade 2026-07-21 (public/media/lokalen/) ===

  // --- Bankett & middag ---
  { fil: NY + "bankett-marschaller.webp", alt: "Långbord med marschaller och levande ljus dukade direkt i sanden", yta: ["sandplan-a"], typ: ["fest", "julbord", "brollop"], format: "liggande", prio: 1 },
  { fil: NY + "bankett-dukning.webp", alt: "Dukat långbord med glas och ljus i sanden", yta: ["sandplan-a"], typ: ["fest", "julbord", "brollop"], format: "liggande", prio: 1 },

  // --- Konferens & dagsljus ---
  { fil: NY + "konferens-skarm.webp", alt: "Konferens i hallen med storbildsskärm, scen och solstolar i biosittning", yta: ["sandplan-a"], typ: ["konferens", "kickoff"], format: "liggande", prio: 1 },
  { fil: NY + "konferens-solstolar.webp", alt: "Rader av solstolar uppställda för konferens i sanden", yta: ["sandplan-a"], typ: ["konferens", "kickoff"], format: "staende", prio: 1 },
  { fil: NY + "gruppbild-sand.webp", alt: "Gruppbild framför solnedgångsväggen med palmer och sand", yta: ["sandplan-a"], typ: ["kickoff", "konferens"], format: "staende", prio: 2 },

  // --- Fest & scen ---
  { fil: NY + "scen-publik.webp", alt: "Publik framför scenen under ett kvällsevent", yta: ["sandplan-a"], typ: ["fest", "kickoff"], format: "liggande", prio: 1 },
  { fil: NY + "mingel.webp", alt: "Gäster minglar i hallen under ett företagsevent", yta: ["sandplan-a"], typ: ["fest", "kickoff"], format: "liggande", prio: 2 },

  // --- Bar & lounge ---
  { fil: NY + "bar-tom.webp", alt: "Baren med grön växtvägg, redo för event", yta: ["bar"], typ: ["fest", "massa"], format: "liggande", prio: 2 },
  { fil: NY + "lounge-hogbord.webp", alt: "Loungeyta med högbord och rottinglampor", yta: ["bar"], typ: ["fest", "massa"], format: "staende", prio: 2 },
  { fil: NY + "lounge-rod.webp", alt: "Den röda salongen med sammetssoffa och mönstrad tapet", yta: ["bar"], typ: ["fest", "brollop"], format: "liggande", prio: 2 },

  // --- Lokalen tom (skala och struktur) ---
  { fil: NY + "tom-oversikt.webp", alt: "Hallen uppifrån med sandbanor och nät", yta: ["sandplan-a", "sandplan-b", "sandplan-c"], typ: ["turnering"], format: "liggande", prio: 2 },
  { fil: NY + "tom-hall1.webp", alt: "Sandbanorna i den tomma hallen", yta: ["sandplan-a"], typ: ["turnering"], format: "liggande", prio: 3 },
  { fil: NY + "boka-vagg.webp", alt: "Banorna framför den orange väggvepan i hallen", yta: ["sandplan-a"], typ: ["turnering"], format: "liggande", prio: 3 },
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
export const HAR_PLANLOSNING = true;
