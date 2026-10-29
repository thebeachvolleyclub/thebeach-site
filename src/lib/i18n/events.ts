import type { Dict } from "@/lib/i18n";
import { EVENT_PACKAGES } from "@/lib/packages";

/**
 * Ordbok för eventsidan (/events resp. /en/events).
 * Svenska texterna är källan och bevaras exakt; engelskan speglar strukturen.
 * Priserna (745/670, 945/850, 1 195/1 075, +395, 350/450, 495) är låsta —
 * ändra aldrig siffror här utan beslut.
 */
export interface EventsDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  jsonld: {
    name: string;
    description: string;
    offers: { lasPalmas: string; algarve: string; miami: string };
  };
  hero: {
    eyebrow: string;
    titleTop: string;
    titleMid: string;
    titleAccent: string;
    intro: string;
    dayDeal: string;
    /** Primär knapp → förfrågningsformuläret (#forfragan / #request). Regel: vi ber
     *  besökaren önska ett datum — aldrig "se lediga datum". */
    ctaRequest: string;
    ctaConcepts: string;
    linkVenue: string;
  };
  paths: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { no: string; title: string; desc: string; href: string }[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    toggleAria: string;
    eve: string;
    day: string;
    dayBadge: string;
    perPerson: string;
    /** Kort-CTA → formuläret med paketet förbockat. */
    requestCta: string;
    menuLabel: string;
    menuNote: string;
    tiers: {
      tag: string;
      name: string;
      evePrice: string;
      dayPrice: string;
      desc: string;
      features: { text: string; eveVariant?: string; dayVariant?: string }[];
      /** Menyn för konceptet — visas i en utfällbar "Meny"-panel på kortet. */
      menu?: string[];
    }[];
  };
  /** "Därför finns vi" — idrotten först, under paketen. */
  why: { eyebrow: string; title: string; text: string };
  dayband: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    lead: string;
    combo: string;
    caption: string;
    colTier: string;
    colEve: string;
    colDay: string;
    rows: { name: string; eve: string; day: string }[];
  };
  conference: { title: string; desc: string; price: string; unit: string };
  kids: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: { tag: string; name: string; price: string; unit: string; desc: string; features: string[]; more?: { label: string; href: string } }[];
    cta: string;
  };
  privat: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    lead: string;
    cards: { title: string; desc: string }[];
    /** Kort 1 (privat): "Önska datum →", kort 2 (skräddarsytt): "Be om offert →" — båda → #forfragan. */
    ctaRequest: string;
    cta: string;
  };
  cta: {
    /** Ankar-id för förfrågningssektionen — "forfragan" (sv) / "request" (en).
     * Externa länkar (Navbar, Footer, landningssidor) pekar på dessa. */
    sectionId: string;
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    lead: string;
  };
  form: {
    /** Form-id till postForm/GTM: "event-sida" (sv) behålls, "event-en" (en). */
    formId: string;
    namn: string; namnPh: string;
    epost: string; epostPh: string;
    telefon: string; telefonPh: string;
    datum: string;
    antal: string; antalPh: string;
    sizes: string[];
    intresse: string;
    paket: string[];
    meddelande: string; meddelandePh: string;
    skicka: string; skickar: string; fel: string;
    fotnot: string; fotnotMail: string;
    tack: string; tackText: string;
  };
  marquee: { alt: string; ariaLabel: string };
}

export const eventsDict: Dict<EventsDict> = {
  sv: {
    meta: {
      title: "Boka event — The Beach | Beachvolley & strandevent i Stockholm",
      description:
        "Boka ett event som sticker ut. Färdiga koncept för företag, barnkalas, privata fester och skräddarsydda event. Kväll eller dagtid, från 10 upp till 900 gäster. Novavägen 35, Huddinge.",
      ogTitle: "Boka event — The Beach",
      ogDescription:
        "Sand mellan tårna mitt i Stockholm. Färdiga eventkoncept med aktivitet, mat och dryck. Las Palmas, Algarve, Miami och skräddarsytt.",
    },
    jsonld: {
      name: "Företagsevent & event på The Beach",
      description:
        "Färdiga eventkoncept med beachvolley, mat och dryck — kickoff, konferens, teambuilding, AW och firmafest, från 10 upp till 900 gäster.",
      offers: {
        lasPalmas: "Enkelt & socialt — 1,5 h beachvolley med instruktör, tapas och dryck.",
        algarve: "Mest bokad — aktivitet och middagsbuffé.",
        miami: "Helkväll — BBQ-buffé och två dryckesenheter.",
      },
    },
    hero: {
      eyebrow: "Event & konferens",
      titleTop: "Boka ett event",
      titleMid: "som",
      titleAccent: "sticker ut",
      intro:
        "The Beach är i grunden en idrottsanläggning med en stor träningsverksamhet för alla åldrar från 3 år upp till 70-årsåldern i alla nivåer från nybörjare till landslagsverksamhet. Varje event som bokas här är med och gör den möjlig.",
      dayDeal: "Kör ni en vardag dagtid? Då bjuder vi på 10% rabatt.",
      ctaRequest: "Önska datum",
      ctaConcepts: "Se koncepten",
      linkVenue: "Se lokalen",
    },
    paths: {
      eyebrow: "Hitta rätt event",
      title: "Fyra vägar in",
      lead: "Säg vilka ni är, så hittar ni rätt upplägg på två sekunder. Resten fixar vi.",
      items: [
        {
          no: "01",
          title: "Företag & organisation",
          desc: "After work, kickoff, konferens, team-building. Företag, kommun, region, förening — kväll eller dagtid.",
          href: "#foretag",
        },
        {
          no: "02",
          title: "Barn & ungdom",
          desc: "Barnkalas för de yngre och Teneriffa för ungdomslag och föreningar.",
          href: "#barn",
        },
        {
          no: "03",
          title: "Privat",
          desc: "Bröllop, födelsedagar och privata fester med sommarkänsla året runt.",
          href: "#privat",
        },
        {
          no: "04",
          title: "Skräddarsytt & större",
          desc: "Eventbyråer och företag som vill ha något utöver det vanliga. Upp till 900 gäster.",
          href: "#privat",
        },
      ],
    },
    pricing: {
      eyebrow: "Företag & organisation",
      title: "Tre nivåer",
      lead: "Samma spel och instruktör — skillnaden ligger i maten och drycken.",
      toggleAria: "Välj tid på dagen",
      eve: "Kväll",
      day: "Dagtid",
      dayBadge: "−10%",
      perPerson: "/person",
      requestCta: "Önska datum →",
      menuLabel: "Meny",
      menuNote: "Vi anpassar menyn efter allergier och specialkost. Vegetariskt alternativ finns alltid.",
      tiers: [
        {
          tag: "Enkelt & socialt",
          name: "Las Palmas",
          evePrice: "745 kr",
          dayPrice: "670 kr",
          desc: "After work, kickoff eller social aktivitet. Det enkla valet som alltid funkar — oavsett om ni är 10 eller 50.",
          menu: ["Säsongens kallskurna ostar och charkuterier", "Kex och nybakat bröd med havssaltat smör"],
          features: [
            { text: "1,5 h beachvolleyturnering med instruktör" },
            { text: "Tapas — ost & chark" },
            {
              eveVariant: "1 dryckesenhet (öl, vin eller alkoholfritt)",
              dayVariant: "1 dryckesenhet — alkoholfritt",
              text: "",
            },
            { text: "Pris till King & Queen of The Beach" },
            { text: "Rekommenderat: 10–50 pers" },
          ],
        },
        {
          tag: "Mest bokad",
          name: "Algarve",
          evePrice: "945 kr",
          dayPrice: "850 kr",
          desc: "Vårt mest bokade koncept. Aktivitet + middag — perfekt för företag som vill kombinera sport med ett riktigt socialt häng.",
          menu: ["Ört- och citrusmarinerad kycklingfilé", "Timjanrostad potatis", "Säsongens primörer", "Örtsås"],
          features: [
            { text: "1,5 h beachvolleyturnering med instruktör" },
            {
              eveVariant: "Middagsbuffé i loungen",
              dayVariant: "Lunchbuffé i loungen",
              text: "",
            },
            {
              eveVariant: "1 dryckesenhet (öl, vin eller alkoholfritt)",
              dayVariant: "1 dryckesenhet — alkoholfritt",
              text: "",
            },
            { text: "Pris till King & Queen of The Beach" },
            { text: "10–250 gäster" },
          ],
        },
        {
          tag: "Helkväll",
          name: "Miami",
          evePrice: "1 195 kr",
          dayPrice: "1 075 kr",
          desc: "När ni vill maxa upplevelsen. Mat, dryck, tempo och stämning — för den grupp som inte nöjer sig med halvmesyrer.",
          menu: ["The Beach's smoked pulled pork", "Baby back ribs", "Rostade primörer", "Grillad majskolv", "Melon- och fetaostmix", "Fräsch sallad"],
          features: [
            { text: "1,5 h beachvolleyturnering med instruktör" },
            {
              eveVariant: "Generös BBQ-buffé",
              dayVariant: "Generös BBQ-lunch",
              text: "",
            },
            {
              eveVariant: "2 dryckesenheter",
              dayVariant: "2 dryckesenheter — alkoholfritt",
              text: "",
            },
            { text: "Pris till King & Queen of The Beach" },
            { text: "15–250 gäster" },
          ],
        },
      ],
    },
    why: {
      eyebrow: "Därför finns vi",
      title: "Ert event håller sanden varm för nästa generation",
      text: "På dagarna och kvällarna tränar här 800 spelare i veckan — många av dem barn och ungdomar i föreningen The Beach Volley Club. Att hålla den verksamheten igång, till priser familjer klarar, går bara tack vare ideella krafter och de företag och sällskap som väljer att fira här. När ni bokar ett event är ni en del av det.",
    },
    dayband: {
      eyebrow: "Vardag dagtid",
      titleTop: "Fyll dagen,",
      titleAccent: "spara 10%",
      lead: "Samma upplevelse, lägre pris. Kör ni på en vardag dagtid får ni 10% rabatt på alla tre nivåerna — med lunch i stället för middag. Gjort för konferens, team-building och kommun/region som vill ha en aktiv dag tillsammans.",
      combo: "Kombinera med konferens på förmiddagen — hela dagen på ett ställe.",
      caption: "Prisjämförelse kväll vs dagtid per eventnivå",
      colTier: "Nivå",
      colEve: "Kväll",
      colDay: "Dagtid",
      rows: [
        { name: "Las Palmas", eve: "745 kr", day: "670 kr" },
        { name: "Algarve", eve: "945 kr", day: "850 kr" },
        { name: "Miami", eve: "1 195 kr", day: "1 075 kr" },
      ],
    },
    conference: {
      title: "+ Konferens i sanden",
      desc: "Lägg till upp till 3 h konferens med projektor, duk och konferensyta i loungen. Passar samtliga eventkoncept — mötet på förmiddagen, spel och mat på eftermiddagen.",
      price: "+395 kr",
      unit: "/person",
    },
    kids: {
      eyebrow: "Barn & ungdom",
      title: "För de yngre",
      lead: "Två färdiga koncept — ett aktivt barnkalas och ett prisvärt upplägg för ungdomslag.",
      cards: [
        {
          tag: "6–11 år",
          name: "Barnkalas",
          price: "från 350 kr",
          unit: "/barn",
          desc: "Ett aktivt kalas där barnen leker, spelar och rör på sig — avslutas med mat och firande i loungen.",
          features: [
            "2 timmar: aktivitet på bana + tid i loungen",
            "Halv pizza & läsk per barn",
            "450 kr/barn med instruktör · 350 kr utan",
            "Helger — i mån av plats på söndagar",
          ],
          more: { label: "Läs mer om barnkalas", href: "/barnkalas" },
        },
        {
          tag: "Ungdomslag",
          name: "Teneriffa",
          price: "495 kr",
          unit: "/person",
          desc: "Prisvärt koncept exklusivt för ungdomslag — perfekt för säsongsstart, säsongsavslut eller lagaktivitet med föreningen.",
          features: [
            "1,5 h turnering med instruktör",
            "Pizza & läsk + King & Queen-pris",
            "10–250 personer",
            "Söndagar i mån av plats",
          ],
          more: { label: "Läs mer om Teneriffa", href: "/teneriffa" },
        },
      ],
      cta: "Skicka förfrågan →",
    },
    privat: {
      eyebrow: "Privat & skräddarsytt",
      titleTop: "När det ska vara",
      titleAccent: "på riktigt",
      lead: "Två olika upplägg — privat fest eller fullskaligt skräddarsytt event. Båda offertbaserade.",
      cards: [
        {
          title: "Privat",
          desc: "Bröllop, födelsedagar och privata fester. Sommarkänsla mitt i Stockholm, spel om man vill, god mat och er egen del av anläggningen. Vi bygger kvällen helt efter er.",
        },
        {
          title: "Skräddarsytt & större",
          desc: "Större företagsevent, eventbyråer och specialupplägg — upp till 900 gäster, scen, full bar och kökskapacitet. Egen kontaktperson från idé till genomförande, även säkerhetsklassat.",
        },
      ],
      ctaRequest: "Önska datum →",
      cta: "Be om offert →",
    },
    cta: {
      sectionId: "forfragan",
      eyebrow: "Förfrågan",
      titleTop: "Önska",
      titleAccent: "datum",
      lead: "Skriv datum och antal – vi håller kvällen och återkommer inom 24 timmar.",
    },
    form: {
      formId: "event-sida",
      namn: "Namn", namnPh: "Ditt namn",
      epost: "E-post", epostPh: "din@epost.se",
      telefon: "Telefon", telefonPh: "070-000 00 00",
      datum: "Önskat datum",
      antal: "Antal personer (ungefär)", antalPh: "Välj storleksgrupp",
      sizes: ["10–25 personer", "25–50 personer", "50–100 personer", "100–250 personer", "250+ personer"],
      intresse: "Jag är intresserad av",
      // Kanonisk paketlista — importeras från packages.ts (samma strängar som övriga sv-formulär).
      paket: EVENT_PACKAGES,
      meddelande: "Övrig info (frivilligt)",
      meddelandePh: "Berätta mer om eventet, önskemål, tidsbegränsningar, om ni vill köra kväll eller dagtid etc.",
      skicka: "Skicka förfrågan →", skickar: "Skickar…",
      fel: "Något gick fel — försök igen eller mejla boka@thebeach.one",
      fotnot: "Vi svarar inom 24 timmar. Skickar du hellre mail? Kontakta oss på",
      fotnotMail: "boka@thebeach.one",
      tack: "Tack!", tackText: "Vi hör av oss inom 24 timmar.",
    },
    marquee: {
      alt: "Event på The Beach",
      ariaLabel: "Bilder från event på The Beach",
    },
  },
  en: {
    meta: {
      title: "Corporate events & parties — The Beach Stockholm",
      description:
        "Book a beach event in Stockholm: activity, food and drinks in one package. Three concepts, from 10 up to 900 guests. Conference add-on available.",
      ogTitle: "Book an event — The Beach",
      ogDescription:
        "Sand between your toes in the middle of Stockholm. Ready-made event concepts with activity, food and drinks. Las Palmas, Algarve, Miami and fully custom.",
    },
    jsonld: {
      name: "Corporate & group events at The Beach",
      description:
        "Ready-made event concepts with beach volleyball, food and drinks — kickoffs, conferences, team building, after work and company parties, from 10 up to 900 guests.",
      offers: {
        lasPalmas: "Simple & social — 1.5 h beach volleyball with instructor, tapas and a drink.",
        algarve: "Most booked — activity and dinner buffet.",
        miami: "The full evening — BBQ buffet and two drinks.",
      },
    },
    hero: {
      eyebrow: "Events & conferences",
      titleTop: "Book an event",
      titleMid: "that",
      titleAccent: "stands out",
      intro:
        "At its core, The Beach is a sports facility with a large training programme for all ages, from 3-year-olds to players in their seventies, and every level from beginner to the national team. Every event booked here helps make that possible.",
      dayDeal: "Booking a weekday during the day? We'll treat you to 10% off.",
      ctaRequest: "Request a date",
      ctaConcepts: "See the concepts",
      linkVenue: "See the venue",
    },
    paths: {
      eyebrow: "Find the right event",
      title: "Four ways in",
      lead: "Tell us who you are and you'll find the right set-up in two seconds. We'll take care of the rest.",
      items: [
        {
          no: "01",
          title: "Companies & organisations",
          desc: "After work, kickoff, conference, team building. Companies, municipalities, regions, clubs — evening or daytime.",
          href: "#foretag",
        },
        {
          no: "02",
          title: "Kids & youth",
          desc: "Kids parties for the younger ones and Teneriffa for youth teams and clubs.",
          href: "#barn",
        },
        {
          no: "03",
          title: "Private",
          desc: "Weddings, birthdays and private parties with summer vibes all year round.",
          href: "#privat",
        },
        {
          no: "04",
          title: "Custom & large-scale",
          desc: "Event agencies and companies looking for something out of the ordinary. Up to 900 guests.",
          href: "#privat",
        },
      ],
    },
    pricing: {
      eyebrow: "Companies & organisations",
      title: "Three tiers",
      lead: "Same game and instructor — the difference is in the food and drinks.",
      toggleAria: "Choose time of day",
      eve: "Evening",
      day: "Daytime",
      dayBadge: "−10%",
      perPerson: "/person",
      requestCta: "Request a date →",
      menuLabel: "Menu",
      menuNote: "We adapt the menu for allergies and dietary requirements. A vegetarian option is always available.",
      tiers: [
        {
          tag: "Simple & social",
          name: "Las Palmas",
          evePrice: "SEK 745",
          dayPrice: "SEK 670",
          desc: "After work, kickoff or a social get-together. The easy choice that always works — whether you're 10 or 50.",
          menu: ["A selection of seasonal cheeses and charcuterie", "Crackers and freshly baked bread with sea-salted butter"],
          features: [
            { text: "1.5 h beach volleyball tournament with instructor" },
            { text: "Tapas — cheese & charcuterie" },
            {
              eveVariant: "1 drink (beer, wine or non-alcoholic)",
              dayVariant: "1 drink — non-alcoholic",
              text: "",
            },
            { text: "Prize for King & Queen of The Beach" },
            { text: "Recommended: 10–50 people" },
          ],
        },
        {
          tag: "Most booked",
          name: "Algarve",
          evePrice: "SEK 945",
          dayPrice: "SEK 850",
          desc: "Our most booked concept. Activity + dinner — perfect for companies that want to combine sport with a proper social hang.",
          menu: ["Herb and citrus marinated chicken fillet", "Thyme-roasted potatoes", "Seasonal vegetables", "Herb sauce"],
          features: [
            { text: "1.5 h beach volleyball tournament with instructor" },
            {
              eveVariant: "Dinner buffet in the lounge",
              dayVariant: "Lunch buffet in the lounge",
              text: "",
            },
            {
              eveVariant: "1 drink (beer, wine or non-alcoholic)",
              dayVariant: "1 drink — non-alcoholic",
              text: "",
            },
            { text: "Prize for King & Queen of The Beach" },
            { text: "10–250 guests" },
          ],
        },
        {
          tag: "The full evening",
          name: "Miami",
          evePrice: "SEK 1,195",
          dayPrice: "SEK 1,075",
          desc: "For when you want to max out the experience. Food, drinks, tempo and atmosphere — for the group that doesn't settle for half measures.",
          menu: ["The Beach's smoked pulled pork", "Baby back ribs", "Roasted seasonal vegetables", "Grilled corn on the cob", "Melon and feta mix", "Fresh salad"],
          features: [
            { text: "1.5 h beach volleyball tournament with instructor" },
            {
              eveVariant: "Generous BBQ buffet",
              dayVariant: "Generous BBQ lunch",
              text: "",
            },
            {
              eveVariant: "2 drinks",
              dayVariant: "2 drinks — non-alcoholic",
              text: "",
            },
            { text: "Prize for King & Queen of The Beach" },
            { text: "15–250 guests" },
          ],
        },
      ],
    },
    why: {
      eyebrow: "Why we exist",
      title: "Your event keeps the sand warm for the next generation",
      text: "Day and evening, 800 players train here every week — many of them children and teenagers in our club, The Beach Volley Club. Keeping that going, at prices families can afford, is only possible thanks to volunteers and the companies and groups that choose to celebrate here. When you book an event, you are part of it.",
    },
    dayband: {
      eyebrow: "Weekday daytime",
      titleTop: "Fill the day,",
      titleAccent: "save 10%",
      lead: "Same experience, lower price. Run your event on a weekday during the day and you get 10% off all three tiers — with lunch instead of dinner. Made for conferences, team building and municipalities/regions that want an active day together.",
      combo: "Combine with a conference in the morning — the whole day in one place.",
      caption: "Price comparison evening vs daytime per event tier",
      colTier: "Tier",
      colEve: "Evening",
      colDay: "Daytime",
      rows: [
        { name: "Las Palmas", eve: "SEK 745", day: "SEK 670" },
        { name: "Algarve", eve: "SEK 945", day: "SEK 850" },
        { name: "Miami", eve: "SEK 1,195", day: "SEK 1,075" },
      ],
    },
    conference: {
      title: "+ Conference in the sand",
      desc: "Add up to 3 h of conference with projector, screen and conference space in the lounge. Works with every event concept — meeting in the morning, games and food in the afternoon.",
      price: "+SEK 395",
      unit: "/person",
    },
    kids: {
      eyebrow: "Kids & youth",
      title: "For the younger crowd",
      lead: "Two ready-made concepts — an active kids party and a great-value set-up for youth teams.",
      cards: [
        {
          tag: "Ages 6–11",
          name: "Kids party",
          price: "from SEK 350",
          unit: "/child",
          desc: "An active party where the kids play, compete and move — finishing with food and celebration in the lounge.",
          features: [
            "2 hours: court activity + time in the lounge",
            "Half a pizza & soft drink per child",
            "SEK 450/child with instructor · SEK 350 without",
            "Weekends — Sundays subject to availability",
          ],
          more: { label: "More about kids parties", href: "/en/kids-party" },
        },
        {
          tag: "Youth teams",
          name: "Teneriffa",
          price: "SEK 495",
          unit: "/person",
          desc: "A great-value concept exclusively for youth teams — perfect for season kick-offs, season finales or a team activity with the club.",
          features: [
            "1.5 h tournament with instructor",
            "Pizza & soft drinks + King & Queen prize",
            "10–250 people",
            "Sundays subject to availability",
          ],
          more: { label: "More about Teneriffa", href: "/en/tenerife" },
        },
      ],
      cta: "Send a request →",
    },
    privat: {
      eyebrow: "Private & custom",
      titleTop: "When it has to be",
      titleAccent: "the real deal",
      lead: "Two different set-ups — a private party or a fully tailor-made event. Both quote-based.",
      cards: [
        {
          title: "Private",
          desc: "Weddings, birthdays and private parties. Summer vibes in the middle of Stockholm, games if you like, great food and your own part of the venue. We build the evening entirely around you.",
        },
        {
          title: "Custom & large-scale",
          desc: "Larger corporate events, event agencies and special set-ups — up to 900 guests, stage, full bar and kitchen capacity. Your own contact person from idea to delivery, security-classified events included.",
        },
      ],
      ctaRequest: "Request a date →",
      cta: "Request a quote →",
    },
    cta: {
      sectionId: "request",
      eyebrow: "Request",
      titleTop: "Request",
      titleAccent: "a date",
      lead: "Tell us the date and how many you are – we'll hold the evening and get back to you within 24 hours.",
    },
    form: {
      formId: "event-en",
      namn: "Name", namnPh: "Your name",
      epost: "Email", epostPh: "you@company.com",
      telefon: "Phone", telefonPh: "+46 70 000 00 00",
      datum: "Preferred date",
      antal: "Group size (approx.)", antalPh: "Select group size",
      sizes: ["10–25 people", "25–50 people", "50–100 people", "100–250 people", "250+ people"],
      intresse: "I'm interested in",
      // Samma ordning som EVENT_PACKAGES — slug-mappningen (?paket=) bygger på index.
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
      meddelandePh: "Tell us more about the event — wishes, timing constraints, whether you'd like evening or daytime, etc.",
      skicka: "Send request →", skickar: "Sending…",
      fel: "Something went wrong — please try again or email boka@thebeach.one",
      fotnot: "We reply within 24 hours. Prefer email? Reach us at",
      fotnotMail: "boka@thebeach.one",
      tack: "Thank you!", tackText: "We'll get back to you within 24 hours.",
    },
    marquee: {
      alt: "Events at The Beach",
      ariaLabel: "Photos from events at The Beach",
    },
  },
};
