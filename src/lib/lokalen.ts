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
  | "lounge"
  | "entre"
  | "faciliteter"
  | "utebanor";

export type TypKey =
  | "kickoff"
  | "fest"
  | "konferens"
  | "massa"
  | "turnering"
  | "brollop"
  | "julbord";

export const YTOR: {
  key: YtaKey;
  namn: string;
  banor?: string;
  matt?: string;
  kvm?: string;
  nedgang?: string;
  beskrivning: string;
}[] = [
  { key: "sandplan-a", namn: "Sandplan A", banor: "Banor 1–2", matt: "21,9 × 20,0 m", kvm: "ca 430 m²", nedgang: "1 nedgång · 140 cm bred", beskrivning: "Närmast entrén" },
  { key: "sandplan-b", namn: "Sandplan B", banor: "Banor 3–5", matt: "ca 21 × 33 m", kvm: "ca 700 m²", nedgang: "1 nedgång · 140 cm bred", beskrivning: "Vinklad yta mot entrésidan" },
  { key: "sandplan-c", namn: "Sandplan C", banor: "Banor 6–10", matt: "20,8 × 52,6 m", kvm: "ca 1 080 m²", nedgang: "1 nedgång · 140 cm bred", beskrivning: "Den stora ytan — scen och dansgolv" },
  { key: "tradack", namn: "Trädäck & altan", beskrivning: "Uteytan mot utebanorna" },
  { key: "bar", namn: "Baren", beskrivning: "Baren och serveringen — centralt, en nivå upp" },
  { key: "lounge", namn: "Loungen", beskrivning: "Sittningar, marmorbord och mingelytor" },
  { key: "entre", namn: "Entrén", beskrivning: "Ankomst och entrésluss" },
  { key: "faciliteter", namn: "Faciliteter", beskrivning: "Omklädning, dusch och toaletter" },
  { key: "utebanor", namn: "Utebanor", banor: "Banor 1–7", beskrivning: "7 banor utomhus" },
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
  /** Visualisering, inte foto — märks tydligt i galleriet. */
  koncept?: boolean;
};

const SNURRA = "/media/event-snurra/";
const NY = "/media/lokalen/";

export const HERO = {
  fil: NY + "c-dans.webp",
  alt: "Gäster dansar i sanden framför scenen under ett kvällsevent på The Beach",
};

export const BILDER: Bild[] = [
  { fil: NY + "b-palmer-mot-lounge.webp", alt: "Palmer och solnedgångsvägg sedda mot loungen", yta: ["sandplan-b"], typ: ["fest", "kickoff"], format: "staende", prio: 1 },
  { fil: NY + "b-konferens-biosittning.webp", alt: "Konferens med biosittning mot storbildsskärm", yta: ["sandplan-b"], typ: ["konferens", "kickoff"], format: "staende", prio: 1 },
  { fil: NY + "b-dukning-detalj.webp", alt: "Dukat bord med lyktor och levande ljus i sanden", yta: ["sandplan-b"], typ: ["fest", "brollop", "julbord"], format: "staende", prio: 1 },
  { fil: NY + "c-scen-band.webp", alt: "Band på scenen under kvällsevent", yta: ["sandplan-c"], typ: ["fest"], format: "liggande", prio: 1 },
  { fil: NY + "bar-bartender.webp", alt: "Bartender häller upp en drink", yta: ["bar"], typ: ["fest"], format: "liggande", prio: 1 },
  { fil: NY + "b-livemusik.webp", alt: "Liveartister på scenen under ett kvällsevent", yta: ["sandplan-b"], typ: ["fest"], format: "staende", prio: 1 },
  { fil: SNURRA + "caia3_bianca.webp", alt: "Lanseringsfest i sanden — varumärkesaktivering med influencers", yta: ["sandplan-b"], typ: ["massa","fest"], format: "staende", prio: 2 },
  { fil: NY + "a-konferens-solstolar.webp", alt: "Konferens med biosittning i solstolar och storbildsskärm", yta: ["sandplan-a"], typ: ["konferens", "kickoff"], format: "staende", prio: 4 },
  { fil: NY + "b-brollop-langbord.webp", alt: "Bröllopsdukning med långbord, ljusslingor och grönska i sanden", yta: ["sandplan-b"], typ: ["brollop", "fest"], format: "liggande", prio: 2 },
  { fil: NY + "b-brollop-oversikt.webp", alt: "Dukade långbord sedda över hela sandplanen", yta: ["sandplan-b"], typ: ["brollop", "fest", "julbord"], format: "liggande", prio: 2 },
  { fil: NY + "b-dukning-langbord.webp", alt: "Långbord dukat för middag med ljus längs hela raden", yta: ["sandplan-b"], typ: ["fest", "julbord", "brollop"], format: "liggande", prio: 2 },
  { fil: NY + "b-fullmoon-middag.webp", alt: "Full moon-fest med middag i sanden och blått scenljus", yta: ["sandplan-b"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: NY + "b-konferens-mot-lounge.webp", alt: "Konferenssittning med utsikt mot loungen", yta: ["sandplan-b"], typ: ["konferens"], format: "liggande", prio: 2 },
  { fil: NY + "b-lagbild-dagsljus.webp", alt: "Lagbild i sanden i dagsljus", yta: ["sandplan-b"], typ: ["kickoff", "turnering"], format: "liggande", prio: 2 },
  { fil: NY + "b-middag-oversikt.webp", alt: "Middag i sanden med dukade bord och stämningsbelysning", yta: ["sandplan-b"], typ: ["fest", "julbord"], format: "liggande", prio: 2 },
  { fil: NY + "b-oktagon-fest-2.webp", alt: "Barinredning i vit bambu under lanseringsfest", yta: ["sandplan-b"], typ: ["massa", "fest"], format: "staende", prio: 3 },
  { fil: NY + "b-oktagon-fest.webp", alt: "Festuppbyggnad med vit bambu och neonskylt", yta: ["sandplan-b"], typ: ["massa", "fest"], format: "liggande", prio: 2 },
  { fil: NY + "b-picknick-middag.webp", alt: "Middag i picknickstil direkt i sanden", yta: ["sandplan-b"], typ: ["fest", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "b-pingis.webp", alt: "Pingisbord uppställt i sanden som aktivitet", yta: ["sandplan-b"], typ: ["kickoff", "massa"], format: "staende", prio: 3 },
  { fil: NY + "b-sandlekar.webp", alt: "Lekar och aktiviteter i sanden under event", yta: ["sandplan-b"], typ: ["kickoff"], format: "staende", prio: 3 },
  { fil: NY + "b-solstolar-prepp.webp", alt: "Solstolar uppställda i rader inför konferens", yta: ["sandplan-b"], typ: ["konferens"], format: "staende", prio: 4 },
  { fil: NY + "bankett-dukning.webp", alt: "Dukat långbord med glas och ljus i sanden", yta: ["sandplan-c"], typ: ["fest", "julbord", "brollop"], format: "liggande", prio: 2 },
  { fil: NY + "bankett-marschaller.webp", alt: "Långbord med marschaller och levande ljus dukade direkt i sanden", yta: ["sandplan-c"], typ: ["fest", "julbord", "brollop"], format: "liggande", prio: 2 },
  { fil: NY + "bar-cava.webp", alt: "Glas uppställda för bubbelservering", yta: ["bar"], typ: ["fest", "brollop"], format: "liggande", prio: 2 },
  { fil: NY + "bar-cavatorn.webp", alt: "Champagnetorn i baren", yta: ["bar"], typ: ["fest", "brollop"], format: "staende", prio: 2 },
  { fil: NY + "bar-drinkar.webp", alt: "Drinkar färdiga för servering", yta: ["bar"], typ: ["fest"], format: "staende", prio: 2 },
  { fil: NY + "bar-mingel.webp", alt: "Mingel vid baren under företagsevent", yta: ["bar"], typ: ["fest", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "bar-plockmat-2.webp", alt: "Snittar och plockmat på baren", yta: ["bar"], typ: ["fest", "kickoff", "julbord"], format: "staende", prio: 2 },
  { fil: NY + "bar-plockmat.webp", alt: "Plockmat och tilltugg upplagt på fat", yta: ["bar"], typ: ["fest", "kickoff", "julbord"], format: "staende", prio: 2 },
  { fil: NY + "bar-publik.webp", alt: "Gäster vid baren under event", yta: ["bar"], typ: ["fest"], format: "liggande", prio: 3 },
  { fil: NY + "bar-servering.webp", alt: "Servering i baren", yta: ["bar"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: NY + "bar-welcomedrinks-2.webp", alt: "Bartender dukar upp welcome drinks", yta: ["bar"], typ: ["fest", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "bar-welcomedrinks.webp", alt: "Welcome drinks uppdukade på baren", yta: ["bar"], typ: ["fest", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "boka-vagg.webp", alt: "Banorna framför den orange väggvepan i hallen", yta: ["sandplan-c"], typ: ["turnering"], format: "liggande", prio: 3 },
  { fil: NY + "c-aktivitet-dagsljus-2.webp", alt: "Deltagare samlade för beachvolley i dagsljus", yta: ["sandplan-c"], typ: ["kickoff", "turnering"], format: "liggande", prio: 2 },
  { fil: NY + "c-aktivitet-dagsljus-3.webp", alt: "Uppvärmning i sanden inför turnering", yta: ["sandplan-c"], typ: ["kickoff", "turnering"], format: "liggande", prio: 2 },
  { fil: NY + "c-aktivitet-dagsljus.webp", alt: "Gruppaktivitet i sanden framför solnedgångsväggen", yta: ["sandplan-c"], typ: ["kickoff", "turnering"], format: "staende", prio: 2 },
  { fil: NY + "c-buffe-2.webp", alt: "Gäster vid buffén", yta: ["sandplan-c"], typ: ["fest", "julbord"], format: "liggande", prio: 2 },
  { fil: NY + "c-buffe.webp", alt: "Buffé serverad under kvällsevent", yta: ["sandplan-c"], typ: ["fest", "julbord"], format: "liggande", prio: 2 },
  { fil: NY + "c-dans-scen.webp", alt: "Dansgolv i sanden framför scenen", yta: ["sandplan-c"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: NY + "c-dans.webp", alt: "Dansande gäster i sanden", yta: ["sandplan-c"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: NY + "c-eldshow-publik.webp", alt: "Publik samlad runt eldshowen", yta: ["sandplan-c"], typ: ["fest"], format: "staende", prio: 2 },
  { fil: NY + "c-eldshow.webp", alt: "Eldshow i sanden framför publiken", yta: ["sandplan-c"], typ: ["fest"], format: "staende", prio: 2 },
  { fil: NY + "c-gruppbild-2.webp", alt: "Gruppbild med hela sällskapet i sanden", yta: ["sandplan-c"], typ: ["kickoff", "konferens"], format: "staende", prio: 2 },
  { fil: NY + "c-gruppbild.webp", alt: "Stor gruppbild i sanden framför solnedgångsväggen", yta: ["sandplan-c"], typ: ["kickoff", "konferens"], format: "liggande", prio: 2 },
  { fil: NY + "c-lagbild-vit.webp", alt: "Lagbild i matchande tröjor framför solnedgångsväggen", yta: ["sandplan-c"], typ: ["kickoff", "turnering"], format: "staende", prio: 2 },
  { fil: NY + "c-publikhav.webp", alt: "Fullsatt sandplan under livekonsert", yta: ["sandplan-c"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: NY + "c-scen-kundlogga.webp", alt: "Scenen med kundens logotyp på solnedgångsväggen", yta: ["sandplan-c"], typ: ["kickoff", "fest", "massa"], format: "staende", prio: 2 },
  { fil: NY + "c-scen-livemusik.webp", alt: "Liveband på scenen med publik i sanden", yta: ["sandplan-c"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: NY + "c-scen-publik.webp", alt: "Publikhav med händerna i luften framför scenen", yta: ["sandplan-c"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: NY + "c-scen-pyro.webp", alt: "Scen med pyroteknik och jublande publik", yta: ["sandplan-c"], typ: ["fest"], format: "liggande", prio: 2 },
  { fil: NY + "c-scen-tom.webp", alt: "Scenen riggad och redo, sedd över tom sandplan", yta: ["sandplan-c"], typ: ["fest", "konferens"], format: "liggande", prio: 2 },
  { fil: NY + "c-solstolar-middag.webp", alt: "Solstolssittning med middag och projektion", yta: ["sandplan-c"], typ: ["konferens", "fest"], format: "liggande", prio: 2 },
  { fil: NY + "c-solstolar-projektion.webp", alt: "Solstolar och projektion på väggen", yta: ["sandplan-c"], typ: ["konferens", "fest"], format: "staende", prio: 2 },
  { fil: NY + "fac-dusch.webp", alt: "Duschrum med sju duschplatser", yta: ["faciliteter"], typ: ["konferens", "turnering"], format: "staende", prio: 2 },
  { fil: NY + "fac-omkladning-dam.webp", alt: "Damernas omklädningsrum", yta: ["faciliteter"], typ: ["konferens", "turnering"], format: "staende", prio: 2 },
  { fil: NY + "fac-omkladning-herr.webp", alt: "Herrarnas omklädningsrum", yta: ["faciliteter"], typ: ["konferens", "turnering"], format: "staende", prio: 2 },
  { fil: NY + "fac-roda-salongen-2.webp", alt: "Sammetssoffa och spegel i den röda salongen", yta: ["faciliteter"], typ: ["fest", "brollop"], format: "liggande", prio: 2 },
  { fil: NY + "fac-roda-salongen.webp", alt: "Den röda salongen intill omklädningsrummen", yta: ["faciliteter"], typ: ["fest", "brollop"], format: "liggande", prio: 2 },
  { fil: NY + "fac-toalett-detalj.webp", alt: "Inredningsdetalj i toalettrummet", yta: ["faciliteter"], typ: ["fest"], format: "staende", prio: 3 },
  { fil: NY + "fac-toalett-speglar.webp", alt: "Spegelvägg och handfat i toalettrummet", yta: ["faciliteter"], typ: ["konferens", "fest"], format: "staende", prio: 2 },
  { fil: NY + "fac-toaletter.webp", alt: "Toalettrummet med sex unisextoaletter", yta: ["faciliteter"], typ: ["konferens", "fest"], format: "staende", prio: 2 },
  { fil: NY + "gruppbild-sand.webp", alt: "Gruppbild framför solnedgångsväggen med palmer och sand", yta: ["sandplan-c"], typ: ["kickoff", "konferens"], format: "staende", prio: 2 },
  { fil: NY + "koncept-b-uppbyggnad.webp", alt: "Konceptbild: möjlig uppbyggnad med scen och barhus i sanden", yta: ["sandplan-b"], typ: ["massa", "fest"], format: "liggande", prio: 3, koncept: true },
  { fil: NY + "konferens-skarm.webp", alt: "Konferens i hallen med storbildsskärm, scen och solstolar i biosittning", yta: ["sandplan-a"], typ: ["konferens", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "konferens-solstolar.webp", alt: "Rader av solstolar uppställda för konferens i sanden", yta: ["sandplan-c"], typ: ["konferens", "kickoff"], format: "staende", prio: 4 },
  { fil: NY + "lounge-branding.webp", alt: "Baren med The Beach-branding", yta: ["lounge"], typ: ["massa", "fest"], format: "staende", prio: 3 },
  { fil: NY + "lounge-catering.webp", alt: "Enklare catering uppdukad i loungen", yta: ["lounge"], typ: ["konferens", "kickoff"], format: "staende", prio: 2 },
  { fil: NY + "lounge-dukning.webp", alt: "Dukning i loungen med rottinglampor", yta: ["lounge"], typ: ["fest", "konferens"], format: "staende", prio: 2 },
  { fil: NY + "lounge-hogbord.webp", alt: "Loungeyta med högbord och rottinglampor", yta: ["lounge"], typ: ["fest", "massa"], format: "staende", prio: 2 },
  { fil: NY + "lounge-konferencier.webp", alt: "Konferencier på scenen i loungen", yta: ["lounge"], typ: ["konferens", "fest"], format: "staende", prio: 2 },
  { fil: NY + "lounge-marmorbord-2.webp", alt: "Loungens marmorbord och höga stolar", yta: ["lounge"], typ: ["fest", "konferens"], format: "liggande", prio: 2 },
  { fil: NY + "lounge-marmorbord-3.webp", alt: "Dukat marmorbord med stämningsljus", yta: ["lounge"], typ: ["fest", "brollop"], format: "staende", prio: 2 },
  { fil: NY + "lounge-marmorbord.webp", alt: "Marmorbord dukat i loungen", yta: ["lounge"], typ: ["fest", "konferens"], format: "liggande", prio: 2 },
  { fil: NY + "lounge-mingel-sittande.webp", alt: "Sittande mingel i loungen i dagsljus", yta: ["lounge"], typ: ["konferens", "kickoff"], format: "staende", prio: 2 },
  { fil: NY + "lounge-mingel.webp", alt: "Mingel i loungen", yta: ["lounge"], typ: ["fest", "kickoff", "massa"], format: "liggande", prio: 2 },
  { fil: NY + "lounge-rod.webp", alt: "Den röda salongen med sammetssoffa och mönstrad tapet", yta: ["lounge"], typ: ["fest", "brollop"], format: "liggande", prio: 2 },
  { fil: NY + "mingel.webp", alt: "Gäster minglar i hallen under ett företagsevent", yta: ["sandplan-c"], typ: ["fest", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "scen-publik.webp", alt: "Publik framför scenen under ett kvällsevent", yta: ["sandplan-c"], typ: ["fest", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "tom-hall1.webp", alt: "Sandbanorna i den tomma hallen", yta: ["sandplan-c"], typ: ["turnering"], format: "liggande", prio: 3 },
  { fil: NY + "tom-oversikt.webp", alt: "Hallen uppifrån med sandbanor och nät", yta: ["sandplan-a", "sandplan-b", "sandplan-c"], typ: ["turnering"], format: "liggande", prio: 2 },
  { fil: NY + "ute-banor.webp", alt: "Utebanorna en sommardag", yta: ["utebanor"], typ: ["turnering", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "ute-beachtennis.webp", alt: "Beachtennis på utebanorna", yta: ["utebanor"], typ: ["turnering", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "ute-mingel.webp", alt: "Mingel med dryck på uteytan", yta: ["utebanor"], typ: ["kickoff", "fest"], format: "liggande", prio: 2 },
  { fil: NY + "ute-spel.webp", alt: "Spel på utebanorna", yta: ["utebanor"], typ: ["turnering", "kickoff"], format: "liggande", prio: 2 },
  { fil: NY + "ute-turnering.webp", alt: "Turnering på utebanorna med publik", yta: ["utebanor"], typ: ["turnering", "kickoff"], format: "liggande", prio: 2 },
];

/** Snabbfakta — bostadsannonsens faktaruta. */
export const FAKTA: { etikett: string; varde: string }[] = [
  { etikett: "Yta", varde: "ca 3 150 m²" },
  { etikett: "Kapacitet", varde: "Upp till 900 gäster" },
  { etikett: "Banor inomhus", varde: "10 sandbanor" },
  { etikett: "Banor utomhus", varde: "7 sandbanor" },
  { etikett: "Sandyta inomhus", varde: "ca 2 200 m²" },
  { etikett: "Nivåskillnad", varde: "0,4 m ner i sanden" },
  { etikett: "Scen & ljud", varde: "Fast scen, ljud och ljus" },
  { etikett: "Mat & dryck", varde: "Eget kök och bar" },
  { etikett: "Konferens", varde: "Projektor, skärm och whiteboard" },
  { etikett: "Skärmar", varde: "7 st — 4 i CMS, 3 via Chrome/HDMI" },
  { etikett: "Toaletter", varde: "7 st (6 unisex + HWC)" },
  { etikett: "Duschar", varde: "14 st (7 per omklädningsrum)" },
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

/** Filmer — poster laddas som bild, videon först vid klick. */
export type Film = {
  fil: string;
  poster: string;
  titel: string;
  yta: YtaKey[];
  typ: TypKey[];
  format: "liggande" | "staende";
};

const V = "/media/lokalen/film/";

export const FILMER: Film[] = [
  { fil: V + "entre-inflygning.mp4", poster: V + "entre-inflygning.webp", titel: "Ankomst — genom entrén innan gästerna kommer", yta: ["entre"], typ: ["kickoff","fest"], format: "liggande" },
  { fil: V + "entre-till-lounge.mp4", poster: V + "entre-till-lounge.webp", titel: "Från entrén in i loungen under mingel", yta: ["entre","lounge"], typ: ["fest","kickoff"], format: "liggande" },
  { fil: V + "entre-b-till-c.mp4", poster: V + "entre-b-till-c.webp", titel: "Genom hallen från Sandplan B till C", yta: ["entre","sandplan-b","sandplan-c"], typ: ["turnering","kickoff"], format: "staende" },
  { fil: V + "entre-lounge-passage.mp4", poster: V + "entre-lounge-passage.webp", titel: "Passagen mellan entrén och loungen", yta: ["entre","lounge"], typ: ["fest"], format: "liggande" },
  { fil: V + "lounge-mingel.mp4", poster: V + "lounge-mingel.webp", titel: "Mingel i loungen", yta: ["lounge"], typ: ["fest","kickoff"], format: "liggande" },
  { fil: V + "lounge-speaker-slowmo.mp4", poster: V + "lounge-speaker-slowmo.webp", titel: "Talare i loungen", yta: ["lounge"], typ: ["konferens","kickoff"], format: "liggande" },
  { fil: V + "bar-mingel.mp4", poster: V + "bar-mingel.webp", titel: "Mingel vid baren", yta: ["bar"], typ: ["fest","kickoff"], format: "liggande" },
  { fil: V + "bar-personal.mp4", poster: V + "bar-personal.webp", titel: "Bartendrarna i arbete", yta: ["bar"], typ: ["fest"], format: "liggande" },
  { fil: V + "bar-plockmat.mp4", poster: V + "bar-plockmat.webp", titel: "Plockmat och servering", yta: ["bar"], typ: ["fest","kickoff","julbord"], format: "liggande" },
  { fil: V + "b-dans.mp4", poster: V + "b-dans.webp", titel: "Dans i sanden på Sandplan B", yta: ["sandplan-b"], typ: ["fest"], format: "liggande" },
  { fil: V + "b-pingis.mp4", poster: V + "b-pingis.webp", titel: "Pingis som aktivitet i sanden", yta: ["sandplan-b"], typ: ["kickoff","massa"], format: "liggande" },
  { fil: V + "b-livemusik-oktagon.mp4", poster: V + "b-livemusik-oktagon.webp", titel: "Livemusik i festuppbyggnaden", yta: ["sandplan-b"], typ: ["fest","massa"], format: "liggande" },
  { fil: V + "b-klipp-1.mp4", poster: V + "b-klipp-1.webp", titel: "Stämning på Sandplan B", yta: ["sandplan-b"], typ: ["fest"], format: "staende" },
  { fil: V + "b-klipp-2.mp4", poster: V + "b-klipp-2.webp", titel: "Kvällsevent på Sandplan B", yta: ["sandplan-b"], typ: ["fest"], format: "staende" },
  { fil: V + "b-klipp-3.mp4", poster: V + "b-klipp-3.webp", titel: "Fest i sanden", yta: ["sandplan-b"], typ: ["fest"], format: "staende" },
  { fil: V + "b-klipp-4.mp4", poster: V + "b-klipp-4.webp", titel: "Gäster på Sandplan B", yta: ["sandplan-b"], typ: ["fest"], format: "staende" },
  { fil: V + "b-klipp-5.mp4", poster: V + "b-klipp-5.webp", titel: "Sent på kvällen på Sandplan B", yta: ["sandplan-b"], typ: ["fest"], format: "staende" },
  { fil: V + "c-publikhav.mp4", poster: V + "c-publikhav.webp", titel: "Publikhav framför scenen", yta: ["sandplan-c"], typ: ["fest"], format: "liggande" },
  { fil: V + "c-livemusik-hey-ya.mp4", poster: V + "c-livemusik-hey-ya.webp", titel: "Liveband på scenen", yta: ["sandplan-c"], typ: ["fest"], format: "liggande" },
  { fil: V + "c-livemusik-kort.mp4", poster: V + "c-livemusik-kort.webp", titel: "Scenen under konserten", yta: ["sandplan-c"], typ: ["fest"], format: "liggande" },
  { fil: V + "c-livemusik-snack.mp4", poster: V + "c-livemusik-snack.webp", titel: "Peppsnack från scenen", yta: ["sandplan-c"], typ: ["kickoff","fest"], format: "liggande" },
  { fil: V + "c-discodans-panorering.mp4", poster: V + "c-discodans-panorering.webp", titel: "Panorering över dansgolvet och satellitbaren", yta: ["sandplan-c","bar"], typ: ["fest"], format: "liggande" },
  { fil: V + "c-discodans.mp4", poster: V + "c-discodans.webp", titel: "Disco i sanden", yta: ["sandplan-c"], typ: ["fest"], format: "liggande" },
  { fil: V + "c-klipp-1.mp4", poster: V + "c-klipp-1.webp", titel: "Kvällsstämning på Sandplan C", yta: ["sandplan-c"], typ: ["fest"], format: "staende" },
  { fil: V + "c-klipp-2.mp4", poster: V + "c-klipp-2.webp", titel: "Event på Sandplan C", yta: ["sandplan-c"], typ: ["fest"], format: "staende" },
  { fil: V + "ute-turnering-dronare.mp4", poster: V + "ute-turnering-dronare.webp", titel: "Drönarvy över utebanorna under turnering", yta: ["utebanor"], typ: ["turnering","kickoff"], format: "staende" },
  { fil: V + "ute-klubblags-sm.mp4", poster: V + "ute-klubblags-sm.webp", titel: "Klubblags-SM på utebanorna", yta: ["utebanor"], typ: ["turnering"], format: "staende" },
  { fil: V + "brollop-reel.mp4", poster: V + "brollop-reel.webp", titel: "Bröllop på The Beach", yta: ["sandplan-b"], typ: ["brollop"], format: "staende" },
];
