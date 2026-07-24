import type { Dict } from "@/lib/i18n";

/**
 * Ordbok för kalendersidan (/kalender resp. /en/calendar).
 * Svenska texterna är källan och bevaras exakt; engelskan speglar strukturen.
 *
 * OBS: händelsedatat (Profixio + src/lib/kalender.ts) är svenskt och RÖRS
 * INTE — endast ramtexterna (rubriker, tabellhuvuden, tomtillstånd osv.)
 * översätts. Detaljsidorna /kalender/[slug] finns bara på svenska; även
 * /en/calendar länkar till de svenska sluggarna.
 */

export interface KalenderDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: {
    eyebrow: string;
    title1: string;
    title2: string;
    titleAccent: string;
    intro: string;
    ctaAll: string;
    ctaTrain: string;
    ctaTrainHref: string;
  };
  upcoming: { eyebrow: string; title1: string; title2: string; lead: string };
  types: {
    eyebrow: string;
    title1: string;
    titleAccent: string;
    lead: string;
    items: {
      no: string;
      title: string;
      body: string;
      note?: string;
      linkLabel: string;
      linkHref: string;
      external?: boolean;
    }[];
    profixio: { pre: string; label: string; mid: string; trainLabel: string; trainHref: string; post: string };
  };
  seasons: {
    eyebrow: string;
    title1: string;
    title2: string;
    lead1: string;
    leadStrong: string;
    lead2: string;
    daysLabel: string;
    passesLabel: string;
    items: { tag: string; name: string; days: string; passes: string; note: string }[];
    contactPre: string;
    crossLink: string;
    crossLinkHref: string;
  };
  tournaments: {
    eyebrow: string;
    title1: string;
    titleAccent: string;
    quote: string;
    band: { badge: string; recurring: string; title: string; body: string; cta: string };
    starWord: string;
    items: { tag: string; stars: string | null; desc: string }[];
    profixioLabel: string;
    tvLabel: string;
    licenseLabel: string;
    licenseHref: string;
  };
  booking: {
    eyebrow: string;
    title1: string;
    title2: string;
    lead: string;
    bookLabel: string;
    bookHref: string;
    tableTitle: string;
    tableCaption: string;
    thTime: string;
    thNonMember: string;
    thMember: string;
    rows: { time: string; note: string; member: string; nonMember: string }[];
    standard: { title: string; items: string[] };
    prebook: { title: string; pre: string; email: string; post: string };
    subscription: { title: string; body: string };
    membershipBox: { title: string; pre: string; linkLabel: string; linkHref: string; post: string };
    schoolBox: { title: string; pre: string; linkLabel: string; linkHref: string; post: string };
  };
  cta: {
    eyebrow: string;
    title1: string;
    titleAccent: string;
    ctaAll: string;
    ctaBook: string;
    ctaBookHref: string;
    tertiary: string;
    tertiaryHref: string;
  };
}

export const kalenderDict: Dict<KalenderDict> = {
  sv: {
    meta: {
      title: "Kalender — The Beach | Schema & händelser i Stockholm",
      description:
        "Träningsgrupper, seriespel, turneringar och event — allt som händer på The Beach i Huddinge, året runt. Boka bana via MATCHi eller prenumerera på kalendern.",
      ogTitle: "Kalender — The Beach",
      ogDescription:
        "Se kommande träningsgrupper, seriespel, SBT-turneringar och Mixed på The Beach, Novavägen 35, Huddinge.",
    },
    hero: {
      eyebrow: "Kalender",
      title1: "Vad händer",
      title2: "på ",
      titleAccent: "The Beach",
      intro: "Allt som händer på The Beach — träningsgrupper, seriespel, turneringar och event, året runt.",
      ctaAll: "Se hela kalendern",
      ctaTrain: "Träningsgrupper & kurser",
      ctaTrainHref: "/trana",
    },
    upcoming: {
      eyebrow: "Kommande",
      title1: "Vad väntar",
      title2: "på The Beach",
      lead: "Turneringar, kurser, seriespel och event — hela schemat, alltid uppdaterat. Bana bokar du via MATCHi.",
    },
    types: {
      eyebrow: "Så funkar det",
      title1: "Tre sätt att",
      titleAccent: "spela med",
      lead: "Oavsett om du vill träna regelbundet, tävla i serie eller delta i en turnering — det finns ett upplägg för dig.",
      items: [
        {
          no: "01",
          title: "Träningsgrupper",
          body: "Två säsonger per år: Sommarsäsong (måndagar & onsdagar, maj–början av juli, 7 pass) och Höstsäsong (söndagar, måndagar & onsdagar, sena augusti–december, 15 pass). Anmälan till höstens grupper öppnar 1 augusti kl 20:00 — efterfrågan är hög och platserna brukar fyllas snabbt.",
          note: "Frågor om träning: traning@thebeach.one",
          linkLabel: "Läs mer om träning →",
          linkHref: "/trana",
        },
        {
          no: "02",
          title: "Seriespel",
          body: "Sommarens tävlingsform: strukturerade matcher med garanterat spel varje omgång — Seriespel Sommar körs i 6 omgångar med start i maj. Under höst och vår går bantiden till kurser och träningsgrupper.",
          note: "\"Oavsett om det är din första turnering eller om du jagar rankingpoäng till de stora scenerna är vårt mål att du ska få en riktigt bra turneringsupplevelse hos oss.\"",
          linkLabel: "Se kalender →",
          linkHref: "https://kalendern på denna sida",
          external: true,
        },
        {
          no: "03",
          title: "Turneringar",
          body: "The Beach arrangerar SBT 1-stjärniga turneringar (nybörjarvänliga rankingtävlingar), Mixed-turneringar och U19 för juniorer. Stjärnsystemet går från 1 till 4 — The Beach fokuserar på 1-stjärniga och Mixed. Hela turneringskalendern hittas på Profixio. Tävlingslicens krävs.",
          linkLabel: "Så börjar du tävla →",
          linkHref: "/trana",
        },
      ],
      profixio: {
        pre: "Hela turneringskalendern på ",
        label: "profixio.com",
        mid: ". Tävlingslicens krävs — bli medlem och begär licens via ",
        trainLabel: "träningssidan",
        trainHref: "/trana",
        post: ".",
      },
    },
    seasons: {
      eyebrow: "Träningsgrupper",
      title1: "Sommar &",
      title2: "höst",
      lead1: "Träningsgrupperna löper i två säsonger. Anmälan till höstens grupper öppnar ",
      leadStrong: "1 aug kl 20:00",
      lead2: " — platserna brukar gå snabbt.",
      daysLabel: "Dagar:",
      passesLabel: "Antal pass:",
      items: [
        {
          tag: "Maj – början av juli",
          name: "Sommarsäsong",
          days: "Måndag & onsdag",
          passes: "7 pass",
          note: "Perfekt inledning på utomhussäsongen. Spela i det fina vädret och bygg upp formen inför hösten.",
        },
        {
          tag: "Sena aug – december",
          name: "Höstsäsong",
          days: "Söndag, måndag & onsdag",
          passes: "15 pass",
          note: "Den längre säsongen — god tid att utvecklas, hitta ett stabilt spelpartner och tävla i seriespel.",
        },
      ],
      contactPre: "Frågor om träning? ",
      crossLink: "Läs mer om träning & kurser",
      crossLinkHref: "/trana",
    },
    tournaments: {
      eyebrow: "Tävling",
      title1: "Seriespel &",
      titleAccent: "turneringar",
      quote:
        "\"Oavsett om det är din första turnering eller om du jagar rankingpoäng till de stora scenerna är vårt mål att du ska få en riktigt bra turneringsupplevelse hos oss.\"",
      band: {
        badge: "Seriespel",
        recurring: "Återkommande",
        title: "Sommarsäsong",
        body: "Seriespelet körs under sommarsäsongen — strukturerade omgångar med garanterat spel varje kväll. Du spelar mot likvärdiga motståndare och följer tabellen från vecka till vecka.",
        cta: "Se aktuella omgångar →",
      },
      starWord: "stjärna",
      items: [
        {
          tag: "SBT 1-stjärnig",
          stars: "1",
          desc: "Nybörjarvänlig rankingklassad tävling i Swedish Beach Tour-systemet. Bra startpunkt för dig som vill prova på tävlingsbeachvolley.",
        },
        {
          tag: "Mixed",
          stars: null,
          desc: "Blandat sällskaps- och klubbturnament. Kul format för alla nivåer — du behöver inte vara en rankad spelare.",
        },
        {
          tag: "U19",
          stars: null,
          desc: "Juniorturnering för spelare under 19 år. Bra scen att ta sina första tävlingssteg på.",
        },
      ],
      profixioLabel: "Turneringskalender på Profixio",
      tvLabel: "The Beach TV — matcher, resultat & stream",
      licenseLabel: "Tävlingslicens — så börjar du tävla",
      licenseHref: "/trana",
    },
    booking: {
      eyebrow: "Boka bana",
      title1: "Boka via",
      title2: "MATCHi",
      lead: "Snabb, enkel bokning — se lediga tider och boka direkt online. Inomhusbana, upp till 8 spelare, 1,5 h per pass.",
      bookLabel: "Boka bana",
      bookHref: "/boka",
      tableTitle: "Priser — inomhus (per bana, 1,5 h)",
      tableCaption: "Banavgifter — inomhus per bana 1,5 h",
      thTime: "Tid",
      thNonMember: "Icke-medlem",
      thMember: "Medlem",
      rows: [
        { time: "Dagtid", note: "Vardag, sluttid senast 16:00", member: "540 kr", nonMember: "600 kr" },
        { time: "Mellantid", note: "Vardag 16:00–17:30 & 20:30–22:00", member: "660 kr", nonMember: "720 kr" },
        { time: "Kvällstopp", note: "Vardag 17:30 & 19:00 samt helger", member: "720 kr", nonMember: "840 kr" },
      ],
      standard: {
        title: "Vanlig bokning",
        items: [
          "Bokas via MATCHi — max 7 dagar i förväg",
          "1,5 h per pass, upp till 8 spelare per bana",
          "Avbokning senast 24 h före start",
        ],
      },
      prebook: {
        title: "Förbokning",
        pre: "Behöver du boka bana längre fram än 7 dagar? Mejla ",
        email: "boka@thebeach.one",
        post: " med önskad tid. Förbokning kostar 2 000 kr/bana/pass, är ej av- eller ombokningsbar, och kräver förskottsbetalning — du får en betallänk via MATCHi för att bekräfta.",
      },
      subscription: {
        title: "Abonnemang",
        body: "Fast veckotid under hela vårterminen (vecka 3–22). Perfekt om du vill ha ett garanterat spelutrymme varje vecka.",
      },
      membershipBox: {
        title: "Medlemskap",
        pre: "Medlem betalar lägre banhyra. 350 kr/år (junior 190 kr) och tävlingslicens ingår. ",
        linkLabel: "Läs mer om medlemskap",
        linkHref: "/foreningen",
        post: ".",
      },
      schoolBox: {
        title: "Skolklasser",
        pre: "Vi tar emot skolklasser på vardagar till specialpris. ",
        linkLabel: "Se Skolor",
        linkHref: "/skola",
        post: ".",
      },
    },
    cta: {
      eyebrow: "Kom igång",
      title1: "Redo att spela",
      titleAccent: "på The Beach?",
      ctaAll: "Se hela kalendern",
      ctaBook: "Boka bana",
      ctaBookHref: "/boka",
      tertiary: "Vill du träna regelbundet? Läs om träningsgrupperna →",
      tertiaryHref: "/trana",
    },
  },
  en: {
    meta: {
      title: "Calendar — The Beach | Schedule & events in Stockholm",
      description:
        "Training groups, series play, tournaments and events — everything happening at The Beach in Huddinge, all year round. Book a court via MATCHi or subscribe to the calendar.",
      ogTitle: "Calendar — The Beach",
      ogDescription:
        "See upcoming training groups, series play, SBT tournaments and Mixed at The Beach, Novavägen 35, Huddinge.",
    },
    hero: {
      eyebrow: "Calendar",
      title1: "What's on",
      title2: "at ",
      titleAccent: "The Beach",
      intro: "Everything happening at The Beach — training groups, series play, tournaments and events, all year round.",
      ctaAll: "See the full calendar",
      ctaTrain: "Training groups & courses",
      ctaTrainHref: "/en/training",
    },
    upcoming: {
      eyebrow: "Upcoming",
      title1: "What's ahead",
      title2: "at The Beach",
      lead: "Tournaments, courses, series play and events — the whole schedule, always up to date. Event details are in Swedish. Courts are booked via MATCHi.",
    },
    types: {
      eyebrow: "How it works",
      title1: "Three ways to",
      titleAccent: "join the game",
      lead: "Whether you want to train regularly, compete in series play or enter a tournament — there's a format for you.",
      items: [
        {
          no: "01",
          title: "Training groups",
          body: "Two seasons per year: the Summer season (Mondays & Wednesdays, May–early July, 7 sessions) and the Autumn season (Sundays, Mondays & Wednesdays, late August–December, 15 sessions). Registration for the autumn groups opens 1 August at 20:00 — demand is high and spots tend to fill up fast.",
          note: "Questions about training: traning@thebeach.one",
          linkLabel: "More about training →",
          linkHref: "/en/training",
        },
        {
          no: "02",
          title: "Series play",
          body: "The summer competition format: structured matches with guaranteed play every round — Seriespel Sommar runs over 6 rounds starting in May. During autumn and spring, court time goes to courses and training groups.",
          note: "\"Whether it's your first tournament or you're chasing ranking points for the big stages, our goal is for you to have a really good tournament experience with us.\"",
          linkLabel: "See the calendar →",
          linkHref: "https://kalendern på denna sida",
          external: true,
        },
        {
          no: "03",
          title: "Tournaments",
          body: "The Beach hosts SBT 1-star tournaments (beginner-friendly ranked competitions), Mixed tournaments and U19 for juniors. The star system runs from 1 to 4 — The Beach focuses on 1-star and Mixed. The full tournament calendar is on Profixio. A competition licence is required.",
          linkLabel: "How to start competing →",
          linkHref: "/en/training",
        },
      ],
      profixio: {
        pre: "The full tournament calendar is on ",
        label: "profixio.com",
        mid: ". A competition licence is required — become a member and request a licence via ",
        trainLabel: "the training page",
        trainHref: "/en/training",
        post: ".",
      },
    },
    seasons: {
      eyebrow: "Training groups",
      title1: "Summer &",
      title2: "autumn",
      lead1: "The training groups run in two seasons. Registration for the autumn groups opens ",
      leadStrong: "1 Aug at 20:00",
      lead2: " — spots tend to go fast.",
      daysLabel: "Days:",
      passesLabel: "Sessions:",
      items: [
        {
          tag: "May – early July",
          name: "Summer season",
          days: "Monday & Wednesday",
          passes: "7 sessions",
          note: "The perfect start to the outdoor season. Play in the nice weather and build your form ahead of autumn.",
        },
        {
          tag: "Late Aug – December",
          name: "Autumn season",
          days: "Sunday, Monday & Wednesday",
          passes: "15 sessions",
          note: "The longer season — plenty of time to develop, find a steady playing partner and compete in series play.",
        },
      ],
      contactPre: "Questions about training? ",
      crossLink: "More about training & courses",
      crossLinkHref: "/en/training",
    },
    tournaments: {
      eyebrow: "Competition",
      title1: "Series play &",
      titleAccent: "tournaments",
      quote:
        "\"Whether it's your first tournament or you're chasing ranking points for the big stages, our goal is for you to have a really good tournament experience with us.\"",
      band: {
        badge: "Series play",
        recurring: "Recurring",
        title: "Summer season",
        body: "Series play runs during the summer season — structured rounds with guaranteed play every evening. You play opponents at your level and follow the standings week by week.",
        cta: "See current rounds →",
      },
      starWord: "star",
      items: [
        {
          tag: "SBT 1-star",
          stars: "1",
          desc: "Beginner-friendly ranked competition in the Swedish Beach Tour system. A great starting point if you want to try competitive beach volleyball.",
        },
        {
          tag: "Mixed",
          stars: null,
          desc: "A mixed social and club tournament. A fun format for all levels — you don't need to be a ranked player.",
        },
        {
          tag: "U19",
          stars: null,
          desc: "Junior tournament for players under 19. A great stage for your first steps in competition.",
        },
      ],
      profixioLabel: "Tournament calendar on Profixio",
      tvLabel: "The Beach TV — matches, results & stream",
      licenseLabel: "Competition licence — how to start competing",
      licenseHref: "/en/training",
    },
    booking: {
      eyebrow: "Book a court",
      title1: "Book via",
      title2: "MATCHi",
      lead: "Quick, easy booking — see available times and book directly online. Indoor court, up to 8 players, 1.5 h per session.",
      bookLabel: "Book a court",
      bookHref: "/en/book",
      tableTitle: "Prices — indoor (per court, 1.5 h)",
      tableCaption: "Court fees — indoor, per court, 1.5 h",
      thTime: "Time",
      thNonMember: "Non-member",
      thMember: "Member",
      rows: [
        { time: "Daytime", note: "Weekdays, ending by 16:00", member: "540 kr", nonMember: "600 kr" },
        { time: "Off-peak", note: "Weekdays 16:00–17:30 & 20:30–22:00", member: "660 kr", nonMember: "720 kr" },
        { time: "Evening peak", note: "Weekdays 17:30 & 19:00 plus weekends", member: "720 kr", nonMember: "840 kr" },
      ],
      standard: {
        title: "Standard booking",
        items: [
          "Booked via MATCHi — max 7 days in advance",
          "1.5 h per session, up to 8 players per court",
          "Cancellation no later than 24 h before start",
        ],
      },
      prebook: {
        title: "Advance booking",
        pre: "Need a court more than 7 days ahead? Email ",
        email: "boka@thebeach.one",
        post: " with your preferred time. Advance booking costs 2 000 kr/court/session, cannot be cancelled or rebooked, and requires prepayment — you'll get a payment link via MATCHi to confirm.",
      },
      subscription: {
        title: "Season slot",
        body: "A fixed weekly time for the whole spring term (weeks 3–22). Perfect if you want guaranteed court time every week.",
      },
      membershipBox: {
        title: "Membership",
        pre: "Members pay lower court fees. 350 kr/year (junior 190 kr), competition licence included. ",
        linkLabel: "Read more about membership",
        linkHref: "/foreningen",
        post: " (in Swedish).",
      },
      schoolBox: {
        title: "School classes",
        pre: "We welcome school classes on weekdays at a special price. ",
        linkLabel: "See Schools",
        linkHref: "/en/school",
        post: ".",
      },
    },
    cta: {
      eyebrow: "Get started",
      title1: "Ready to play",
      titleAccent: "at The Beach?",
      ctaAll: "See the full calendar",
      ctaBook: "Book a court",
      ctaBookHref: "/en/book",
      tertiary: "Want to train regularly? Read about the training groups →",
      tertiaryHref: "/en/training",
    },
  },
};
