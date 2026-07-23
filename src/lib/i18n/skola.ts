import type { Dict } from "@/lib/i18n";

export interface SkolaDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: { eyebrow: string; titleTop: string; titleAccent: string; intro: string; cta: string };
  ingar: { eyebrow: string; title1: string; title2: string; items: string[] };
  priser: {
    eyebrow: string; title: string;
    cards: { rubrik: string; pris: string; enhet: string; desc: string }[];
    braAttVetaLabel: string; braAttVeta: string;
  };
  forfragan: {
    eyebrow: string; title1: string; title2: string; intro: string;
  };
  form: {
    namn: string; namnPh: string; skola: string; skolaPh: string;
    epost: string; epostPh: string; telefon: string; telefonPh: string;
    antal: string; antalPh: string; datum: string; datumPh: string;
    upplagg: string; alt1: string; alt2: string;
    ovrigt: string; ovrigtPh: string;
    skicka: string; skickar: string; fel: string; fotnot: string;
    tack: string; tackText: string;
  };
}

export const skolaDict: Dict<SkolaDict> = {
  sv: {
    meta: {
      title: "Skolor — The Beach | En roligare idrottslektion i Huddinge",
      description:
        "Ta med klassen till Stockholms beachvolleyarena. 100 kr/elev för 1,5 timme — allt ingår. Instruktörsledd beachvolleyskola, turneringar och gratis fortbildning för idrottslärare.",
      ogTitle: "Skolor — The Beach",
      ogDescription: "En roligare idrottslektion: beachvolley för skolklasser på The Beach i Huddinge. 100 kr/elev, allt ingår.",
    },
    hero: {
      eyebrow: "Skolor", titleTop: "En roligare", titleAccent: "idrottslektion",
      intro: "Ta med klassen till Stockholms beachvolleyarena i Huddinge. Sand mellan tårna, rörelse och spel för alla — inga förkunskaper krävs, allt material ingår.",
      cta: "Skicka förfrågan",
    },
    ingar: {
      eyebrow: "Allt ingår", title1: "Kom som ni är —", title2: "vi har resten",
      items: [
        "10 banor inomhus — plats för hela klassen",
        "Nät, linjer, antenner och bollar",
        "14 duschar och omklädningsrum",
        "Medföljande lärare deltar gratis",
        "Värme året runt — sommar även i januari",
        "Parkering och pendel (Flemingsberg/Stuvsta) nära",
      ],
    },
    priser: {
      eyebrow: "Pris", title: "Enkelt att räkna på",
      cards: [
        { rubrik: "Spela själva", pris: "100 kr", enhet: "/elev · 1,5 h", desc: "Läraren håller i trådarna, vi står för banor och allt material. Förläng med 30 kr/elev per extra halvtimme." },
        { rubrik: "Beachvolleyskola + turnering", pris: "1 500 kr", enhet: "upp till 40 elever", desc: "Vår instruktör kör uppvärmning, teknikskola och avslutande turnering. 2 000 kr för fler än 40 elever. Tillkommer utöver elevpriset." },
        { rubrik: "Fortbildning för idrottslärare", pris: "Gratis", enhet: "för grupper", desc: "Är ni några idrottslärare som vill lära er mer om beachvolley? Vi bjuder på fortbildning — hör av dig så bokar vi in ett pass." },
      ],
      braAttVetaLabel: "Bra att veta:",
      braAttVeta: "för att kunna hålla skolpriset lågt kör vi enkel service dagtid — ansvarig lärare följer med klassen och hjälper till med ordningen. Bäst tillgång på banor är vardagar 07–16.",
    },
    forfragan: {
      eyebrow: "Boka skolbesök", title1: "Skicka en förfrågan —", title2: "vi löser resten",
      intro: "Berätta när ni vill komma och hur många ni är, så återkommer vi inom 24 timmar med förslag. Det går lika bra att mejla direkt till boka@thebeach.one.",
    },
    form: {
      namn: "Ditt namn", namnPh: "För- och efternamn",
      skola: "Skola", skolaPh: "Skolans namn",
      epost: "E-post", epostPh: "din@skola.se",
      telefon: "Telefon", telefonPh: "070-000 00 00",
      antal: "Antal elever (cirka)", antalPh: "t.ex. 28",
      datum: "Önskade datum/tider", datumPh: "t.ex. tisdagar v. 38–40, fm",
      upplagg: "Upplägg",
      alt1: "Läraren leder (100 kr/elev, 1,5 h)",
      alt2: "Med instruktör — beachvolleyskola + turnering",
      ovrigt: "Övrigt (valfritt)", ovrigtPh: "Åldrar, särskilda önskemål…",
      skicka: "Skicka förfrågan", skickar: "Skickar…",
      fel: "Något gick fel — försök igen eller mejla boka@thebeach.one",
      fotnot: "Vi svarar inom 24 timmar. Frågor? Mejla boka@thebeach.one",
      tack: "Tack!", tackText: "Vi hör av oss inom 24 timmar med förslag på tider.",
    },
  },
  en: {
    meta: {
      title: "Schools — The Beach Stockholm | A better PE lesson",
      description:
        "Bring your class to Stockholm's beach volleyball arena. SEK 100 per student for 1.5 hours — everything included. Instructor-led sessions, tournaments and free PE-teacher clinics.",
      ogTitle: "Schools — The Beach",
      ogDescription: "A better PE lesson: beach volleyball for school classes at The Beach in Huddinge. SEK 100/student, everything included.",
    },
    hero: {
      eyebrow: "Schools", titleTop: "A better", titleAccent: "PE lesson",
      intro: "Bring your class to Stockholm's beach volleyball arena in Huddinge. Sand between the toes, movement and play for everyone — no experience needed, all equipment included.",
      cta: "Send a request",
    },
    ingar: {
      eyebrow: "Everything included", title1: "Come as you are —", title2: "we've got the rest",
      items: [
        "10 indoor courts — room for the whole class",
        "Nets, lines, antennas and balls",
        "14 showers and changing rooms",
        "Accompanying teachers join for free",
        "Warm all year — summer even in January",
        "Parking and commuter rail (Flemingsberg/Stuvsta) nearby",
      ],
    },
    priser: {
      eyebrow: "Prices", title: "Easy to budget",
      cards: [
        { rubrik: "Play on your own", pris: "SEK 100", enhet: "/student · 1.5 h", desc: "The teacher runs the session, we provide courts and all equipment. Extend for SEK 30/student per extra 30 minutes." },
        { rubrik: "Clinic + tournament", pris: "SEK 1,500", enhet: "up to 40 students", desc: "Our instructor runs a warm-up, technique clinic and closing tournament. SEK 2,000 for more than 40 students, on top of the per-student price." },
        { rubrik: "PE-teacher clinics", pris: "Free", enhet: "for groups", desc: "A group of PE teachers who want to learn more about beach volleyball? The clinic is on us — get in touch and we'll book a session." },
      ],
      braAttVetaLabel: "Good to know:",
      braAttVeta: "to keep the school price low we run simple daytime service — the accompanying teacher stays with the class and helps keep order. Best court availability is weekdays 07:00–16:00.",
    },
    forfragan: {
      eyebrow: "Book a school visit", title1: "Send a request —", title2: "we'll sort the rest",
      intro: "Tell us when you'd like to come and how many you are, and we'll reply within 24 hours with suggested times. You can also email boka@thebeach.one directly.",
    },
    form: {
      namn: "Your name", namnPh: "First and last name",
      skola: "School", skolaPh: "Name of the school",
      epost: "Email", epostPh: "you@school.se",
      telefon: "Phone", telefonPh: "+46 70 000 00 00",
      antal: "Number of students (approx.)", antalPh: "e.g. 28",
      datum: "Preferred dates/times", datumPh: "e.g. Tuesdays weeks 38–40, mornings",
      upplagg: "Set-up",
      alt1: "Teacher-led (SEK 100/student, 1.5 h)",
      alt2: "With instructor — clinic + tournament",
      ovrigt: "Anything else (optional)", ovrigtPh: "Ages, special requests…",
      skicka: "Send request", skickar: "Sending…",
      fel: "Something went wrong — try again or email boka@thebeach.one",
      fotnot: "We reply within 24 hours. Questions? Email boka@thebeach.one",
      tack: "Thank you!", tackText: "We'll get back to you within 24 hours with suggested times.",
    },
  },
};
