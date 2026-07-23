import type { Dict } from "@/lib/i18n";
import { FAKTA, TYPER, YTOR, type TypKey, type YtaKey } from "@/lib/lokalen";

/**
 * Ordbok för lokalsidan (/lokalen resp. /en/venue).
 * Bild- och filmdatat i src/lib/lokalen.ts (filer, alt-texter, filmtitlar) ägs
 * av datat och översätts inte här — ordboken täcker UI-texter, faktarutan och
 * yt-/typetiketterna som driver filter och planlösningslistan.
 * Svenska sidan hämtar etiketterna direkt ur datat, så sv förblir exakt.
 */

/** Text för en yta i planlösningslistan och galleri-filtren. */
export interface YtaText {
  namn: string;
  banor?: string;
  matt?: string;
  kvm?: string;
  nedgang?: string;
  beskrivning: string;
}

export interface LokalenDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  /** JSON-LD (EventVenue) — kapacitet/adress är låsta i komponenten. */
  jsonldDescription: string;
  hero: { eyebrow: string; titleTop: string; titleAccent: string; intro: string; ctaTour: string; ctaPlan: string };
  snabbfakta: { eyebrow: string; title: string; fakta: { etikett: string; varde: string }[] };
  planlosning: { eyebrow: string; title: string; lead: string; planAlt: string; footnote: string };
  ytor: Record<YtaKey, YtaText>;
  typer: Record<TypKey, string>;
  galleri: {
    eyebrow: string;
    title: string;
    allaTillfallen: string;
    helaLokalen: string;
    tomt: string;
    konceptbild: string;
    konceptNot: string;
    stang: string;
    foregaende: string;
    nasta: string;
    bildSingular: string;
    bildPlural: string;
  };
  filmer: { eyebrow: string; title: string; playPrefix: string };
  planners: { eyebrow: string; title: string; argument: { rubrik: string; text: string }[] };
}

export const lokalenDict: Dict<LokalenDict> = {
  sv: {
    meta: {
      title: "Lokalen — The Beach | Eventlokal för 10–900 gäster i Stockholm",
      description:
        "Se lokalen: 3 150 m² med 10 sandbanor inomhus och 7 utomhus, scen, bar och kök. Planlösning, bilder och fakta för dig som planerar kickoff, fest, konferens eller mässa.",
      ogTitle: "Lokalen — The Beach",
      ogDescription:
        "3 150 m² eventlokal i Huddinge. Planlösning, bilder och snabbfakta för eventbyråer och eventbokare.",
    },
    jsonldDescription:
      "Inomhus beacharena och eventlokal på 3 150 m² med 10 sandbanor inomhus, 7 utomhus, scen, bar och kök. Plats för upp till 900 gäster.",
    hero: {
      eyebrow: "Lokalen",
      titleTop: "Här är det alltid",
      titleAccent: "sommar",
      intro: "3 150 m² sand, 25 grader och plats för 900 gäster. Tjugo minuter från city.",
      ctaTour: "Boka en visning",
      ctaPlan: "Se planlösningen",
    },
    snabbfakta: { eyebrow: "Snabbfakta", title: "Lokalen i siffror", fakta: FAKTA },
    planlosning: {
      eyebrow: "Planlösning",
      title: "Hela ytan, uppifrån",
      lead:
        "10 sandbanor inomhus och 7 utomhus, med bar och kök centralt placerade i mitten. Samtliga funktionsytor ligger 40 cm högre än sandytorna — man kliver ner i sanden och upp till loungen. Varje sandplan har en egen nedgång.",
      planAlt: "Planlösning över The Beach: 10 sandbanor inomhus, 7 utomhus, bar, kök, omklädning och entré",
      footnote:
        "Mått och ytor är hämtade ur bygglovsritningen (skala 1:300) och avrundade. Sandplan B är vinklad — ytan är exakt, måtten ungefärliga.",
    },
    ytor: Object.fromEntries(YTOR.map((y) => [y.key, y])) as unknown as Record<YtaKey, YtaText>,
    typer: Object.fromEntries(TYPER.map((t) => [t.key, t.namn])) as unknown as Record<TypKey, string>,
    galleri: {
      eyebrow: "Bilder",
      title: "Se hur det kan bli",
      allaTillfallen: "Alla tillfällen",
      helaLokalen: "Hela lokalen",
      tomt: "Inga bilder på den kombinationen än — prova en annan yta eller tillfälle.",
      konceptbild: "Konceptbild",
      konceptNot: "Konceptbild — visualisering av en möjlig uppbyggnad, inte ett foto.",
      stang: "Stäng",
      foregaende: "Föregående",
      nasta: "Nästa",
      bildSingular: "bild",
      bildPlural: "bilder",
    },
    filmer: { eyebrow: "Film", title: "Lokalen i rörelse", playPrefix: "Spela upp: " },
    planners: {
      eyebrow: "För dig som planerar",
      title: "Allt på ett ställe",
      argument: [
        { rubrik: "Aktivitet som bryter isen", text: "Beachvolley funkar oavsett kondition, ålder eller vem som är chef. Ingen behöver vara bra." },
        { rubrik: "Mat och dryck i huset", text: "Eget kök och bar — buffé, BBQ eller sittande middag. Ingen extern catering att koordinera." },
        { rubrik: "Scen, ljud och ljus", text: "Fast scen med riggat ljud och ljus. Ta in artist, DJ eller talare utan att bygga från noll." },
        { rubrik: "Er logga i hela huset", text: "Solnedgångsväggen bakom scenen blir er. Sju skärmar kör er grafik: 85\" i loungen, 75\" i entrén, 65\" i vardera omklädningsrum och 55\" i toalettrummet — plus två mobila 55\" på hjul. Fyra styrs från vårt CMS, tre via Chrome, USB eller HDMI. Därtill vepor, tyger och skyltning." },
        { rubrik: "En kontakt hela vägen", text: "Samma person från förfrågan till avslutad kväll. Inga överlämningar mitt i." },
        { rubrik: "20 minuter från city", text: "Huddinge, gratis parkering utanför dörren. Enkelt för alla att ta sig till." },
      ],
    },
  },
  en: {
    meta: {
      title: "The Venue — The Beach | Event venue for 10–900 guests in Stockholm",
      description:
        "See the venue: 3,150 m² with 10 indoor sand courts and 7 outdoor, stage, bar and kitchen. Floor plan, photos and facts for anyone planning a kickoff, party, conference or trade show.",
      ogTitle: "The Venue — The Beach",
      ogDescription:
        "3,150 m² event venue in Huddinge. Floor plan, photos and quick facts for event agencies and event planners.",
    },
    jsonldDescription:
      "Indoor beach arena and event venue of 3,150 m² with 10 indoor sand courts, 7 outdoor, stage, bar and kitchen. Room for up to 900 guests.",
    hero: {
      eyebrow: "The venue",
      titleTop: "Here it's always",
      titleAccent: "summer",
      intro: "3,150 m² of sand, 25 degrees and room for 900 guests. Twenty minutes from central Stockholm.",
      ctaTour: "Book a tour",
      ctaPlan: "See the floor plan",
    },
    snabbfakta: {
      eyebrow: "Quick facts",
      title: "The venue in numbers",
      fakta: [
        { etikett: "Area", varde: "approx. 3,150 m²" },
        { etikett: "Capacity", varde: "Up to 900 guests" },
        { etikett: "Indoor courts", varde: "10 sand courts" },
        { etikett: "Outdoor courts", varde: "7 sand courts" },
        { etikett: "Indoor sand area", varde: "approx. 2,200 m²" },
        { etikett: "Level change", varde: "0.4 m down into the sand" },
        { etikett: "Stage & sound", varde: "Fixed stage, sound and lighting" },
        { etikett: "Conference", varde: "Projector, screen and whiteboard" },
        { etikett: "Screens", varde: "7 — 4 via CMS, 3 via Chrome/HDMI" },
        { etikett: "Toilets", varde: "7 (6 unisex + accessible)" },
        { etikett: "Showers", varde: "14 (7 per changing room)" },
        { etikett: "Location", varde: "Huddinge — 20 min from central Stockholm" },
        { etikett: "Parking", varde: "Free, right outside" },
        { etikett: "Temperature", varde: "25°C all year round" },
      ],
    },
    planlosning: {
      eyebrow: "Floor plan",
      title: "The whole space, from above",
      lead:
        "10 indoor sand courts and 7 outdoor, with the bar and kitchen placed centrally in the middle. All service areas sit 40 cm above the sand — you step down into the sand and up to the lounge. Each sand area has its own entry point.",
      planAlt: "Floor plan of The Beach: 10 indoor sand courts, 7 outdoor, bar, kitchen, changing rooms and entrance",
      footnote:
        "Measurements and areas are taken from the building permit drawings (scale 1:300) and rounded. Sand area B is angled — the area is exact, the measurements approximate.",
    },
    ytor: {
      "sandplan-a": { namn: "Sand area A", banor: "Courts 1–2", matt: "21.9 × 20.0 m", kvm: "approx. 430 m²", nedgang: "1 entry point · 140 cm wide", beskrivning: "Closest to the entrance" },
      "sandplan-b": { namn: "Sand area B", banor: "Courts 3–5", matt: "approx. 21 × 33 m", kvm: "approx. 700 m²", nedgang: "1 entry point · 140 cm wide", beskrivning: "Angled area facing the entrance side" },
      "sandplan-c": { namn: "Sand area C", banor: "Courts 6–10", matt: "20.8 × 52.6 m", kvm: "approx. 1,080 m²", nedgang: "1 entry point · 140 cm wide", beskrivning: "The big one — sunset wall banner, 52 × 11 m" },
      tradack: { namn: "Deck & terrace", beskrivning: "The outdoor area facing the outdoor courts" },
      bar: { namn: "The bar", beskrivning: "The bar and service area — central, one level up" },
      lounge: { namn: "The lounge", beskrivning: "Seating, marble tables and mingle areas" },
      entre: { namn: "The entrance", beskrivning: "Arrival and entrance vestibule" },
      faciliteter: { namn: "Facilities", beskrivning: "Changing rooms, showers and toilets" },
      utebanor: { namn: "Outdoor courts", banor: "Courts 1–7", beskrivning: "7 courts outdoors" },
    },
    typer: {
      kickoff: "Kickoff",
      fest: "Party & banquet",
      konferens: "Conference",
      massa: "Expo & activation",
      turnering: "Tournament",
      brollop: "Wedding",
      julbord: "Christmas party",
    },
    galleri: {
      eyebrow: "Photos",
      title: "See what it can become",
      allaTillfallen: "All occasions",
      helaLokalen: "The whole venue",
      tomt: "No photos of that combination yet — try another area or occasion.",
      konceptbild: "Concept image",
      konceptNot: "Concept image — a visualisation of a possible build, not a photo.",
      stang: "Close",
      foregaende: "Previous",
      nasta: "Next",
      bildSingular: "photo",
      bildPlural: "photos",
    },
    filmer: { eyebrow: "Video", title: "The venue in motion", playPrefix: "Play: " },
    planners: {
      eyebrow: "For planners",
      title: "Everything in one place",
      argument: [
        { rubrik: "An activity that breaks the ice", text: "Beach volleyball works regardless of fitness, age or who's the boss. Nobody needs to be good." },
        { rubrik: "Food and drink in-house", text: "Our own kitchen and bar — buffet, BBQ or seated dinner. No external catering to coordinate." },
        { rubrik: "Stage, sound and lighting", text: "A fixed stage with rigged sound and lighting. Bring in an artist, DJ or speaker without building from scratch." },
        { rubrik: "Your logo throughout the venue", text: "The sunset wall behind the stage becomes yours. Seven screens run your graphics: 85\" in the lounge, 75\" in the entrance, 65\" in each changing room and 55\" in the restroom — plus two mobile 55\" screens on wheels. Four are run from our CMS, three via Chrome, USB or HDMI. Add banners, fabrics and signage on top." },
        { rubrik: "One contact the whole way", text: "The same person from first enquiry to the end of the night. No handovers halfway through." },
        { rubrik: "20 minutes from the city", text: "Huddinge, with free parking right outside the door. Easy for everyone to get to." },
      ],
    },
  },
};
