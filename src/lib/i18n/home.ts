import type { Dict } from "@/lib/i18n";
import { EVENT_PACKAGES } from "@/lib/packages";
import type { EventPkg } from "@/components/EventCarousel";

/**
 * Ordbok för startsidan (/ resp. /en).
 * Svenska texterna är källan och bevaras exakt; engelskan speglar strukturen.
 * Sakuppgifter (siffror, priser, öppettider, antal banor) är låsta — ändra
 * aldrig dem här utan beslut. Påstå aldrig "Sveriges/världens största".
 */
export interface HomeDict {
  /** sv-metadatan speglar sajtens standard i src/app/layout.tsx — ändras den
   *  där ska den ändras här. en-metadatan används av /en:s page-skal. */
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: {
    chips: string[];
    titleTop: string;
    titleAccent: string;
    titleBottom: string;
    leadStrong: string;
    lead: string;
    ctaEvent: string;
    /** Ankare till formulärsektionen — "#event" (sv) / "#request" (en). */
    ctaEventHref: string;
    ctaCourt: string;
    ctaCourtHref: string;
  };
  /** img/pos är identiska i båda språken. /trana och /kalender saknar engelska
   *  rutter (se src/lib/routes.ts) — de svenska URL:erna används även på /en. */
  quicknav: { n: string; title: string; href: string; img: string; alt: string; pos: string }[];
  photoBreak: { alt: string; kicker: string; caption: string };
  story: {
    eyebrow: string;
    title1: string;
    title2: string;
    lead: string;
    badges: string[];
    /** Siffrorna är låsta — samma i båda språken. */
    stats: { to: number; suffix?: string; lbl: string }[];
    quote: string;
    cite: string;
    ctaBook: string;
    ctaBookHref: string;
    ctaStory: string;
    ctaStoryHref: string;
    imgAlt: string;
    imgCaption: string;
    cornerBadge: string[];
  };
  events: {
    eyebrow: string;
    title1: string;
    title2: string;
    lead: string;
    linkPlanner: string;
    /** Planeraren: /events/planera (sv) resp. /en/events/plan (en). */
    linkPlannerHref: string;
    linkCustom: string;
    linkCustomHref: string;
    /** Bild/position/featured identiska — bara texterna skiljer. Priserna
     *  (745/945/1 195, +395) är låsta. */
    packages: EventPkg[];
    from: string;
    perPerson: string;
    cardCta: string;
    cardCtaHref: string;
    /** aria-label-prefix för karusellens prickar: "Visa {namn}" / "Show {name}". */
    showAria: string;
    confTitle: string;
    confDesc: string;
    confPrice: string;
    confUnit: string;
    outro: string;
    outroCtaShort: string;
    outroCtaLong: string;
    outroCtaHref: string;
  };
  /** Kalenderhändelserna (månader, titlar, badges) kommer från Profixio/
   *  lib/kalender och är svenska i båda versionerna — bara ramtexterna översätts.
   *  /kalender saknar engelsk rutt. */
  calendar: { eyebrow: string; title1: string; title2: string; subscribe: string; seeAll: string; seeAllHref: string };
  form: {
    /** Sektions-id — Heros CTA ankrar hit: "event" (sv) / "request" (en). */
    sectionId: string;
    /** Form-id till postForm/GTM: "event-startsida" (sv) / "event-startsida-en" (en). */
    formId: string;
    eyebrow: string; title1: string; title2: string; lead: string;
    namn: string; namnPh: string;
    epost: string; epostPh: string;
    telefon: string; telefonPh: string;
    datum: string;
    antal: string; antalPh: string;
    sizes: string[];
    intresse: string;
    /** Samma ordning som EVENT_PACKAGES (src/lib/packages.ts). */
    paket: string[];
    meddelande: string; meddelandePh: string;
    skicka: string; skickar: string; fel: string; fotnot: string;
    tack: string; tackText: string;
  };
  /** /trana saknar engelsk rutt — de svenska URL:erna används även på /en. */
  training: {
    eyebrow: string; title1: string; title2: string;
    photoAlt: string; photoCaption: string;
    cards: { level: string; title: string; when: string; desc: string; badge: string; spots: "open" | "few"; href: string }[];
    ctaKicker: string; ctaTitle: string; ctaHref: string;
  };
}

export const homeDict: Dict<HomeDict> = {
  sv: {
    meta: {
      title: "The Beach — Beachvolley & strandevent året runt",
      description:
        "Stockholms hem för beachvolley. 17 banor inomhus & utomhus i Huddinge. Spela, träna och fira — sommar året runt. Alla är välkomna.",
      ogTitle: "The Beach — Sommar året runt",
      ogDescription:
        "Beachvolley & strandevent året runt i Huddinge, Stockholm. Boka bana, träna eller fira ditt event på sanden.",
    },
    hero: {
      chips: ["Beachvolley & Event", "Novavägen 35 · Huddinge", "Sedan 2006"],
      titleTop: "Där det",
      titleAccent: "Alltid",
      titleBottom: "Är sommar",
      leadStrong: "En av världens främsta beachvolleyanläggningar.",
      lead: "17 banor, event för upp till 900 gäster och ett community som ingen annan kan matcha. Alla är välkomna — från nybörjare till världsmästare.",
      ctaEvent: "Boka ett event",
      ctaEventHref: "#event",
      ctaCourt: "Boka bana",
      ctaCourtHref: "/boka",
    },
    quicknav: [
      { n: "01", title: "Spela", href: "/boka", img: "/media/wilson-boll-sand.webp", alt: "Beachvolleyboll i sanden", pos: "object-[50%_65%]" },
      { n: "02", title: "Träna", href: "/trana", img: "/media/coach.webp", alt: "Coach på The Beach", pos: "object-[50%_12%]" },
      { n: "03", title: "Tävla", href: "/kalender", img: "/media/vm-silver.webp", alt: "Tävling — VM-silver", pos: "object-[50%_15%]" },
      { n: "04", title: "Event & konferens", href: "/events", img: "/media/event.webp", alt: "Företagsevent på The Beach", pos: "object-center" },
    ],
    photoBreak: {
      alt: "Hallen på The Beach — 3 000 m² sand",
      kicker: "Anläggningen",
      caption: "3 000 m² sand. 15 min från Stockholm City.",
    },
    story: {
      eyebrow: "Om The Beach",
      title1: "Basecamp för",
      title2: "världens bästa",
      lead: "Här tränar Åhman/Hellvig — OS-guld och VM-guld — och hela svenska landslagsverksamheten har sitt hem hos oss. Sedan 2006 har vi byggt ett community öppet för alla: samma sand för världstoppen och nybörjaren.",
      badges: ["🥇 OS-guld · Paris 2024", "🥇 VM-guld · Adelaide 2025"],
      stats: [
        { to: 800, lbl: "Spelare / vecka" },
        { to: 17, lbl: "Banor inne & ute" },
        { to: 3000, suffix: " m²", lbl: "Sand" },
        { to: 20, lbl: "År i sanden" },
      ],
      quote: "“A miniature Copacabana in a warehouse south of Stockholm.”",
      cite: "Al Jazeera",
      ctaBook: "Boka bana",
      ctaBookHref: "/boka",
      ctaStory: "Hela historien",
      ctaStoryHref: "/om-oss",
      imgAlt: "Åhman/Hellvig och Andersson/Hölting Nilsson tränar på The Beach — helsvensk VM-final 2025",
      imgCaption: "Åhman/Hellvig & Andersson/Hölting Nilsson tränar på The Beach · helsvensk VM-final 2025",
      cornerBadge: ["Nationell", "Tränings-", "bas"],
    },
    events: {
      eyebrow: "Eventkoncept",
      title1: "Boka ett event",
      title2: "som sticker ut",
      lead: "Färdiga paket från after work till fullskala corporate event. Aktivitet, mat och dryck — allt ingår.",
      linkPlanner: "Planera ert event →",
      linkPlannerHref: "/events/planera",
      linkCustom: "Skräddarsytt event →",
      linkCustomHref: "/events",
      packages: [
        {
          img: "/media/event-laspalmas.webp",
          imgPos: "center 80%",
          tag: "Enkelt & socialt",
          name: "Las Palmas",
          price: "745 kr",
          desc: "After work, kickoff eller social aktivitet. Det enkla valet som alltid funkar — oavsett om ni är 10 eller 50.",
          features: ["1,5 h beachvolleyturnering med instruktör", "Tapas — ost & chark", "1 dryckesenhet (öl, vin eller alkoholfritt)", "Pris till King & Queen of The Beach", "Rekommenderat: 10–50 pers"],
        },
        {
          img: "/media/event-algarve.webp",
          tag: "Mest bokad",
          name: "Algarve",
          price: "945 kr",
          desc: "Vårt mest bokade koncept. Aktivitet + middag — perfekt för företag som vill kombinera sport med ett riktigt socialt häng.",
          features: ["1,5 h beachvolleyturnering med instruktör", "Middagsbuffé i loungen", "1 dryckesenhet (öl, vin eller alkoholfritt)", "Pris till King & Queen of The Beach", "10–250 gäster"],
          featured: true,
        },
        {
          img: "/media/event-miami.webp",
          tag: "Helkväll",
          name: "Miami",
          price: "1 195 kr",
          desc: "När ni vill maxa upplevelsen. Mat, dryck, tempo och stämning — för den grupp som inte nöjer sig med halvmesyrer.",
          features: ["1,5 h beachvolleyturnering med instruktör", "Generös BBQ-buffé", "2 dryckesenheter", "Pris till King & Queen of The Beach", "15–250 gäster"],
        },
      ],
      from: "från",
      perPerson: "/person",
      cardCta: "Skicka förfrågan →",
      cardCtaHref: "/events#forfragan",
      showAria: "Visa",
      confTitle: "+ Konferens i sanden",
      confDesc: "Lägg till upp till 3 h konferens med projektor, duk och konferensyta i loungen. Passar samtliga eventkoncept.",
      confPrice: "+395 kr",
      confUnit: "/person",
      outro: "Behöver ni något utöver de färdiga paketen? Vi har lång erfarenhet av stora events, produktlanseringar, bröllop och säkerhetsklassade evenemang — alltid skräddarsytt.",
      outroCtaShort: "Be om offert →",
      outroCtaLong: "Be om offert på skräddarsytt event →",
      outroCtaHref: "/events",
    },
    calendar: {
      eyebrow: "Kalender",
      title1: "Vad händer",
      title2: "på The Beach",
      subscribe: "Missa aldrig ett event — prenumerera på kalendern",
      seeAll: "Se hela kalendern →",
      seeAllHref: "/kalender#kommande",
    },
    form: {
      sectionId: "event",
      formId: "event-startsida",
      eyebrow: "Boka event",
      title1: "Berätta om",
      title2: "ditt event",
      lead: "Vi hör av oss inom 24 timmar med ett förslag som passar er grupp och budget. Ingen bindning.",
      namn: "Namn", namnPh: "Ditt namn",
      epost: "E-post", epostPh: "din@epost.se",
      telefon: "Telefon", telefonPh: "070-000 00 00",
      datum: "Önskat datum",
      antal: "Antal personer (ungefär)", antalPh: "Välj storleksgrupp",
      sizes: ["10–25 personer", "25–50 personer", "50–100 personer", "100–250 personer", "250+ personer"],
      intresse: "Jag är intresserad av",
      paket: EVENT_PACKAGES,
      meddelande: "Övrig info (frivilligt)",
      meddelandePh: "Berätta mer om eventet, eventuella önskemål, tidsbegränsningar etc.",
      skicka: "Skicka förfrågan →", skickar: "Skickar…",
      fel: "Något gick fel — försök igen eller mejla boka@thebeach.one",
      fotnot: "Vi svarar inom 24 timmar. Skickar du hellre mail? Kontakta oss på boka@thebeach.one",
      tack: "Tack!", tackText: "Vi hör av oss inom 24 timmar.",
    },
    training: {
      eyebrow: "Träning",
      title1: "Hitta din",
      title2: "träningsgrupp",
      photoAlt: "Coach instruerar på The Beach",
      photoCaption: "Alla grupper leds av utbildade coacher",
      cards: [
        { level: "Nybörjare", title: "Grundkurs", when: "Startar 1 sept & 3 sept · Kvällstider", desc: "Spela, träna och lär känna sporten från grunden.", badge: "Anmälan öppen", spots: "open", href: "/trana#kurser" },
        { level: "Mellannivå", title: "Fortsättningskurs", when: "Startar 1 sept & 3 sept · Kvällstider", desc: "Du kan grunderna — nu tar vi ditt spel till nästa nivå.", badge: "Anmälan öppen", spots: "open", href: "/trana#kurser" },
        { level: "Avancerat", title: "Träningsgrupper", when: "Höstsäsong · Start 30 aug", desc: "Jämna grupper på din nivå — träning med coacher på nationell nivå.", badge: "Anmälan öppnar 1 aug 20:00", spots: "few", href: "/trana#traningsgrupper" },
        { level: "Barn & Ungdom", title: "Juniorträning", when: "Hela terminen · Weekends", desc: "För barn och unga som vill lära sig beachvolley på riktigt.", badge: "Anmälan öppen", spots: "open", href: "/trana#ungdom" },
      ],
      ctaKicker: "Kurserna: öppna nu · Grupperna: 1 aug 20:00",
      ctaTitle: "Se alla kurser & anmäl dig",
      ctaHref: "/trana",
    },
  },
  en: {
    meta: {
      title: "The Beach — Beach volleyball & beach events in Stockholm",
      description:
        "Stockholm's indoor beach arena: 10 courts, a 3,000 m² beach, food & drinks — 15 minutes from the city centre. Corporate events, team days and play, all year round.",
      ogTitle: "The Beach — Where it's always summer",
      ogDescription:
        "Indoor beach arena in Stockholm. Corporate events for 10–900 guests, beach volleyball all year round.",
    },
    hero: {
      chips: ["Beach volleyball & events", "Novavägen 35 · Huddinge", "Since 2006"],
      titleTop: "Where it's",
      titleAccent: "Always",
      titleBottom: "Summer",
      leadStrong: "One of the world's premier beach volleyball facilities.",
      lead: "17 courts, events for up to 900 guests and a community no one else can match. Everyone is welcome — from first-timers to world champions.",
      ctaEvent: "Book an event",
      ctaEventHref: "#request",
      ctaCourt: "Book a court",
      ctaCourtHref: "/en/book",
    },
    quicknav: [
      { n: "01", title: "Play", href: "/en/book", img: "/media/wilson-boll-sand.webp", alt: "Beach volleyball in the sand", pos: "object-[50%_65%]" },
      { n: "02", title: "Train", href: "/trana", img: "/media/coach.webp", alt: "Coach at The Beach", pos: "object-[50%_12%]" },
      { n: "03", title: "Compete", href: "/kalender", img: "/media/vm-silver.webp", alt: "Competition — World Championship silver", pos: "object-[50%_15%]" },
      { n: "04", title: "Events & conference", href: "/en/events", img: "/media/event.webp", alt: "Corporate event at The Beach", pos: "object-center" },
    ],
    photoBreak: {
      alt: "The hall at The Beach — 3,000 m² of sand",
      kicker: "The facility",
      caption: "3,000 m² of sand. 15 min from Stockholm City.",
    },
    story: {
      eyebrow: "About The Beach",
      title1: "Basecamp for",
      title2: "the world's best",
      lead: "Åhman/Hellvig train here — Olympic gold and World Championship gold — and the entire Swedish national team programme has its home with us. Since 2006 we've built a community open to everyone: the same sand for the world elite and the first-timer.",
      badges: ["🥇 Olympic gold · Paris 2024", "🥇 World Championship gold · Adelaide 2025"],
      stats: [
        { to: 800, lbl: "Players / week" },
        { to: 17, lbl: "Courts indoor & outdoor" },
        { to: 3000, suffix: " m²", lbl: "Sand" },
        { to: 20, lbl: "Years in the sand" },
      ],
      quote: "“A miniature Copacabana in a warehouse south of Stockholm.”",
      cite: "Al Jazeera",
      ctaBook: "Book a court",
      ctaBookHref: "/en/book",
      ctaStory: "The full story",
      ctaStoryHref: "/en/about",
      imgAlt: "Åhman/Hellvig and Andersson/Hölting Nilsson training at The Beach — all-Swedish World Championship final 2025",
      imgCaption: "Åhman/Hellvig & Andersson/Hölting Nilsson train at The Beach · all-Swedish World Championship final 2025",
      cornerBadge: ["National", "Training", "Base"],
    },
    events: {
      eyebrow: "Event concepts",
      title1: "Book an event",
      title2: "that stands out",
      lead: "Ready-made packages from after work to full-scale corporate events. Activity, food and drinks — everything included.",
      linkPlanner: "Plan your event →",
      linkPlannerHref: "/en/events/plan",
      linkCustom: "Custom event →",
      linkCustomHref: "/en/events",
      packages: [
        {
          img: "/media/event-laspalmas.webp",
          imgPos: "center 80%",
          tag: "Simple & social",
          name: "Las Palmas",
          price: "SEK 745",
          desc: "After work, kickoff or a social get-together. The easy choice that always works — whether you're 10 or 50.",
          features: ["1.5 h beach volleyball tournament with instructor", "Tapas — cheese & charcuterie", "1 drink token (beer, wine or non-alcoholic)", "Prize for King & Queen of The Beach", "Recommended: 10–50 people"],
        },
        {
          img: "/media/event-algarve.webp",
          tag: "Most booked",
          name: "Algarve",
          price: "SEK 945",
          desc: "Our most booked concept. Activity + dinner — perfect for companies that want to combine sport with a proper social night.",
          features: ["1.5 h beach volleyball tournament with instructor", "Dinner buffet in the lounge", "1 drink token (beer, wine or non-alcoholic)", "Prize for King & Queen of The Beach", "10–250 guests"],
          featured: true,
        },
        {
          img: "/media/event-miami.webp",
          tag: "Full night",
          name: "Miami",
          price: "SEK 1,195",
          desc: "When you want to max the experience. Food, drinks, tempo and atmosphere — for the group that doesn't settle for half measures.",
          features: ["1.5 h beach volleyball tournament with instructor", "Generous BBQ buffet", "2 drink tokens", "Prize for King & Queen of The Beach", "15–250 guests"],
        },
      ],
      from: "from",
      perPerson: "/person",
      cardCta: "Send a request →",
      cardCtaHref: "/en/events#request",
      showAria: "Show",
      confTitle: "+ Conference in the sand",
      confDesc: "Add up to 3 h of conference with projector, screen and conference space in the lounge. Works with every event concept.",
      confPrice: "+SEK 395",
      confUnit: "/person",
      outro: "Need something beyond the ready-made packages? We have long experience of large events, product launches, weddings and security-classed events — always tailor-made.",
      outroCtaShort: "Request a quote →",
      outroCtaLong: "Request a quote for a custom event →",
      outroCtaHref: "/en/events",
    },
    calendar: {
      eyebrow: "Calendar",
      title1: "What's on",
      title2: "at The Beach",
      subscribe: "Never miss an event — subscribe to the calendar",
      seeAll: "See the full calendar →",
      // Kalendersidan finns bara på svenska — länken pekar på den svenska rutten.
      seeAllHref: "/kalender#kommande",
    },
    form: {
      sectionId: "request",
      formId: "event-startsida-en",
      eyebrow: "Book an event",
      title1: "Tell us about",
      title2: "your event",
      lead: "We reply within 24 hours with a proposal that fits your group and budget. No strings attached. English-speaking hosts available.",
      namn: "Name", namnPh: "Your name",
      epost: "Email", epostPh: "you@company.com",
      telefon: "Phone", telefonPh: "+46 70 000 00 00",
      datum: "Preferred date",
      antal: "Group size (approx.)", antalPh: "Select group size",
      sizes: ["10–25 people", "25–50 people", "50–100 people", "100–250 people", "250+ people"],
      intresse: "I'm interested in",
      // Samma ordning som EVENT_PACKAGES — håll listorna i synk.
      paket: [
        "Las Palmas — SEK 745/person",
        "Algarve — SEK 945/person",
        "Miami — SEK 1,195/person",
        "+ Conference in the sand (+SEK 395/person)",
        "Kids party",
        "Teneriffa (youth teams)",
        "Private party (wedding / birthday)",
        "Custom & large-scale event",
        "Christmas party (seasonal)",
      ],
      meddelande: "Anything else? (optional)",
      meddelandePh: "Tell us about the occasion, dietary needs, timing…",
      skicka: "Send request →", skickar: "Sending…",
      fel: "Something went wrong — please try again or email boka@thebeach.one",
      fotnot: "We reply within 24 hours. Prefer email? Reach us at boka@thebeach.one",
      tack: "Thank you!", tackText: "We'll get back to you within 24 hours.",
    },
    training: {
      eyebrow: "Training",
      title1: "Find your",
      title2: "training group",
      photoAlt: "Coach instructing at The Beach",
      photoCaption: "All groups are led by trained coaches",
      cards: [
        { level: "Beginner", title: "Beginner course", when: "Starts 1 Sept & 3 Sept · Evenings", desc: "Play, train and get to know the sport from the ground up.", badge: "Registration open", spots: "open", href: "/trana#kurser" },
        { level: "Intermediate", title: "Continuation course", when: "Starts 1 Sept & 3 Sept · Evenings", desc: "You know the basics — now we take your game to the next level.", badge: "Registration open", spots: "open", href: "/trana#kurser" },
        { level: "Advanced", title: "Training groups", when: "Autumn season · Starts 30 Aug", desc: "Balanced groups at your level — training with coaches at national level.", badge: "Registration opens 1 Aug 20:00", spots: "few", href: "/trana#traningsgrupper" },
        { level: "Kids & youth", title: "Junior training", when: "All term · Weekends", desc: "For kids and teens who want to learn beach volleyball for real.", badge: "Registration open", spots: "open", href: "/trana#ungdom" },
      ],
      ctaKicker: "Courses: open now · Groups: 1 Aug 20:00",
      ctaTitle: "See all courses & sign up",
      ctaHref: "/trana",
    },
  },
};
