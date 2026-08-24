import type { Dict } from "@/lib/i18n";

/**
 * Ordbok för träningssidan (/trana resp. /en/training).
 * Svenska texterna är källan och bevaras exakt; engelskan speglar strukturen.
 *
 * OBS: ordinarie priser (795 kr och 3 695 kr / 15 pass)
 * är låsta — härifrån styrs ENDAST text.
 * Under 21-copyn i PathFinder är Davids egen och ändras inte på svenska;
 * engelskan är en trogen översättning.
 *
 * Kursanmälan sker sedan augusti 2026 i VÅR EGEN kassa (CourseLadder +
 * CourseEnrolButton, Swish). Kurserna ligger kvar på MATCHi för Davids egen
 * manuella bemanningskoll — men vi länkar ALDRIG dit från kurs-CTA:erna.
 * items[].ctas nedan används bara av den statiska reservstegen när kurs-API:t
 * är nere; den pekar på boka@thebeach.one, inte på MATCHi.
 */

export type PathCta = { label: string; href: string; external?: boolean };
export type PathRec = { title: string; body: string; ctas: PathCta[]; note?: string };

export interface TranaDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: {
    eyebrow: string;
    title1: string;
    titleAccent: string;
    intro: string;
    ctaCourses: string;
    ctaGroups: string;
    ctaEvents: string;
    ctaEventsHref: string;
  };
  marquee: { ariaLabel: string };
  pathfinder: {
    eyebrow: string;
    title: string;
    lead: string;
    q1: string;
    q2: string;
    ageOptions: { under21: string; adult: string };
    expOptions: { never: string; comeback: string; regular: string };
    placeholder: string;
    paths: {
      under21Never: PathRec;
      under21Comeback: PathRec;
      under21Regular: PathRec;
      adultNever: PathRec;
      adultComeback: PathRec;
      adultRegular: PathRec;
      /** Visas i stället för adultRegular när gruppanmälan inte är öppen. */
      adultRegularClosed: PathRec;
    };
  };
  courses: {
    eyebrow: string;
    title: string;
    lead: string;
    noPriceLabel: string;
    /** Endast en: notis i den statiska reservstegen. */
    signupNote?: { pre: string; email: string; post: string };
    items: {
      no: string;
      tag: string;
      title: string;
      price: string;
      priceNote: string;
      details: string[];
      quote: string;
      ctas: { label: string; href: string }[];
    }[];
  };
  groups: {
    eyebrow: string;
    title: string;
    lead: string;
    fakta: { v: string; d: string }[];
    tableCaption: string;
    thDay: string;
    thTime: string;
    thPrice: string;
    schedule: { day: string; time: string; price: string }[];
    youth: { title: string; body: string };
    signup: {
      title: string;
      statusOpen: string;
      statusWaitlist: string;
      statusClosed: string;
      statusBeforeOpen: string;
      details1: string;
      termsLabel: string;
      details2: string;
      changeLabel: string;
      details3: string;
      ctaOpen: string;
      ctaWaitlist: string;
      ctaBeforeOpen: string;
      ctaClosed: string;
    };
    /** Överflödet från stängd gruppanmälan styrs till fortsättningskursen. */
    overflow: { title: string; body: string; cta: string };
    questionsTitle: string;
  };
  youth: {
    eyebrow: string;
    title1: string;
    title2: string;
    lead: string;
    quote: string;
    attribution: string;
    infoTitle: string;
    infoBody: string;
    items: string[];
    contactPre: string;
    cta: string;
  };
  pt: {
    eyebrow: string;
    title: string;
    lead: string;
    includedTitle: string;
    rows: { label: string; value: string }[];
    flex: { label: string; value: string };
    note: string;
    exampleEyebrow: string;
    exampleIntro: string;
    exCoachLabel: string;
    exCoachValue: string;
    exCourtLabel: string;
    exCourtValue: string;
    exTotalLabel: string;
    exTotalValue: string;
    cta: string;
  };
  schools: {
    eyebrow: string;
    title1: string;
    title2: string;
    lead: string;
    included: string[];
    school: {
      tag: string;
      title: string;
      price: string;
      priceUnit: string;
      pkg1: { pre: string; strong: string; post: string };
      pkg2: { pre: string; strong: string; post: string };
      cta: string;
      ctaHref: string;
    };
    company: { tag: string; title: string; body: string; cta: string; ctaHref: string };
  };
  coaches: {
    eyebrow: string;
    titlePre: string;
    titleAccent: string;
    lead: string;
    imgAlt: string;
    caption: string;
    role: string;
    name: string;
    bio: string;
    note: string;
  };
  membership: {
    eyebrow: string;
    titlePre: string;
    titleAccent: string;
    lead: string;
    tiers: { label: string; price: string; unit: string }[];
    benefitsTitle: string;
    benefits: string[];
    panel: { eyebrow: string; title1: string; title2: string; body: string; cta: string };
  };
  cta: {
    eyebrow: string;
    title1: string;
    titleAccent: string;
    body: string;
    ctaCourses: string;
    ctaContact: string;
    competePre: string;
    competeLabel: string;
    competeHref: string;
  };
}

export const tranaDict: Dict<TranaDict> = {
  sv: {
    meta: {
      title: "Träna — The Beach | Beachvolleykurser i Stockholm",
      description:
        "~800 spelare tränar varje vecka. Kurser och träningsgrupper för alla nivåer — nybörjare till avancerad, barn & ungdom, PT-grupp och skolor. Ledda av landslagscoacher på The Beach i Huddinge sedan 2006.",
      ogTitle: "Träna — The Beach",
      ogDescription:
        "Kurser och träningsgrupper för alla nivåer. Grundkurs 795 kr. Höstsäsong 2026 start 30 aug. The Beach, Novavägen 35, Huddinge.",
    },
    hero: {
      eyebrow: "Träna",
      title1: "Hitta din",
      titleAccent: "beachvolley träning",
      intro:
        "~800 spelare tränar varje vecka på The Beach. Kurser och träningsgrupper för alla nivåer — sedan 2006. Ledda av coacher i världsklass på sanden i Huddinge.",
      ctaCourses: "Säsongen startar 30 aug — se kurserna",
      ctaGroups: "Se träningsgrupperna",
      ctaEvents: "Boka event istället",
      ctaEventsHref: "/events",
    },
    marquee: { ariaLabel: "Bilder från träningen" },
    pathfinder: {
      eyebrow: "Ny här?",
      title: "Hitta din väg",
      lead: "Två snabba frågor — så pekar vi direkt på rätt kurs eller grupp för dig.",
      q1: "1. Hur gammal är du?",
      q2: "2. Har du spelat beachvolley?",
      ageOptions: { under21: "Under 21 år", adult: "21 år eller äldre" },
      expOptions: {
        never: "Aldrig spelat",
        comeback: "Spelat förr — men det var ett tag sen",
        regular: "Spelar regelbundet",
      },
      placeholder: "Svara på frågorna så visar vi din väg in i sanden.",
      paths: {
        under21Never: {
          title: "Du kan välja båda spåren",
          body: "Under 21? Du har två vägar in — juniorträning via klubben (terminsanmälan, lägre pris, medlemskap i föreningen) eller grundkursen som är öppen för alla åldrar (5 kvällspass på tisdagar eller torsdagar). Välj det som passar dig bäst.",
          ctas: [
            { label: "Juniorträning via Svenska Lag", href: "https://www.svenskalag.se/thebeach", external: true },
            { label: "Grundkursen", href: "#kurser" },
          ],
        },
        under21Comeback: {
          title: "Du kan välja båda spåren",
          body: "Under 21? Du har två vägar in — juniorträning via klubben (terminsanmälan, lägre pris, medlemskap i föreningen) eller grundkursen som är öppen för alla åldrar (5 kvällspass på tisdagar eller torsdagar). Även fortsättningskursen kan vara ett alternativ. Välj det som passar dig bäst.",
          ctas: [
            { label: "Juniorträning via Svenska Lag", href: "https://www.svenskalag.se/thebeach", external: true },
            { label: "Se kurserna", href: "#kurser" },
          ],
        },
        under21Regular: {
          title: "Du kan välja båda spåren",
          body: "Under 21 och spelar redan? Juniorträningen via klubben tränar hela terminen med jämnåriga — eller sikta på träningsgrupperna. Aktuell anmälningsstatus visas längre ner på sidan.",
          ctas: [
            { label: "Juniorträning via Svenska Lag", href: "https://www.svenskalag.se/thebeach", external: true },
            { label: "Se träningsgrupperna", href: "#traningsgrupper" },
          ],
        },
        adultNever: {
          title: "Grundkursen är din väg in",
          body: "5 pass × 1,5 h där du lär dig teknik, fotarbete, taktik och spel från grunden. Ingen erfarenhet krävs — ta bara med motivation.",
          ctas: [{ label: "Se grundkursen", href: "#kurser" }],
        },
        adultComeback: {
          title: "Fortsättningskursen — perfekt för comeback",
          body: "Spelat förr men det var länge sen? Du behöver inte börja om från noll. Fortsättningskursen fräschar upp grunderna och tar dig vidare i matchtempo — de flesta comeback-spelare landar rätt här.",
          ctas: [{ label: "Se fortsättningskursen", href: "#kurser" }],
          note: "Osäker på nivån? Mejla traning@thebeach.one så hjälper vi dig välja.",
        },
        adultRegular: {
          title: "Träningsgrupperna är nästa steg",
          body: "Spelar du regelbundet placeras du i en grupp som matchar din nivå — jämna grupper, 15 pass per säsong. Aktuell anmälningsstatus visas under träningsgrupperna.",
          ctas: [{ label: "Se träningsgrupperna", href: "#traningsgrupper" }],
        },
        adultRegularClosed: {
          title: "Missade du träningsgrupperna?",
          body: "Anmälan till höstens träningsgrupper är stängd. Fortsättningskursen har fortfarande några platser kvar — 15 pass med coach, tisdagar 19:00 eller torsdagar 20:30.",
          ctas: [
            { label: "Se fortsättningskursen", href: "#kurser" },
            { label: "Träningsgrupperna", href: "#traningsgrupper" },
          ],
        },
      },
    },
    courses: {
      eyebrow: "Börja träna",
      title: "Kursstegen",
      lead: "Har du aldrig spelat beachvolley — eller vill ta ditt spel till nästa nivå? Här är vägen in.",
      noPriceLabel: "Pris anges vid anmälan",
      items: [
        {
          no: "01",
          tag: "Nybörjare",
          title: "Grundkurs",
          price: "795 kr",
          priceNote: "Ditt personliga pris visas när du loggat in.",
          details: [
            "5 pass × 1,5 h (19:00–20:30 eller 20:30–22:00)",
            "Teknik, fotarbete, taktik och spel",
            "Inomhus",
            "Start: tisdagar fr.o.m. 1 sep eller torsdagar fr.o.m. 3 sep 2026",
          ],
          quote: "Ingen tidigare erfarenhet krävs. Ta bara med motivation och en bra attityd.",
          ctas: [{ label: "Mejla oss för anmälan", href: "mailto:boka@thebeach.one" }],
        },
        {
          no: "02",
          tag: "Mellannivå",
          title: "Fortsättningskurs",
          price: "3 695 kr",
          priceNote: "15 pass · ditt personliga pris visas när du loggat in.",
          details: [
            "15 pass × 1,5 h (19:00–20:30 eller 20:30–22:00)",
            "Rörelse & positionering, bollkontroll, försvar & attack",
            "Spelförståelse & matchspel i högre tempo",
            "Start: tisdagar 1 sep eller torsdagar 3 sep 2026",
          ],
          quote:
            "Spelat förr men det var länge sen? Det här är rätt ingång för din comeback — du behöver inte börja om från noll.",
          ctas: [{ label: "Mejla oss för anmälan", href: "mailto:boka@thebeach.one" }],
        },
      ],
    },
    groups: {
      eyebrow: "Höstsäsong 2026",
      title: "Träningsgrupper",
      lead: "För dig som gått fortsättningskursen eller har motsvarande vana. Huvudtränare Mattias Magnusson och tränarteamet sätter ihop jämna grupper — placeringen utgår främst från din nivå, och dina önskemål om dagar, tider och kompisar vägs in. Start: söndagar 30 aug, måndagar 31 aug och onsdagar vecka 36.",
      fakta: [
        { v: "15 pass", d: "varav en Gameday · sista pass 9 dec" },
        { v: "Senast tis", d: "grupperna publiceras — avisering i appen" },
        { v: "−30 / −20 %", d: "ungdomsrabatt för födda {y20} resp. {y26} eller senare" },
      ],
      tableCaption: "Träningsgrupper höstsäsong 2026 — dag, tid och pris",
      thDay: "Dag",
      thTime: "Tid",
      thPrice: "Pris (15 pass)",
      schedule: [
        { day: "Måndag", time: "17:30–19:00", price: "4 295 kr" },
        { day: "Måndag", time: "19:00–20:30", price: "4 995 kr" },
        { day: "Måndag", time: "20:30–22:00", price: "4 295 kr" },
        { day: "Onsdag", time: "19:00–20:30", price: "4 995 kr" },
        { day: "Onsdag", time: "20:30–22:00", price: "4 295 kr" },
        { day: "Söndag", time: "12:00–13:30 / 13:30–15:00", price: "3 995 kr" },
        { day: "Söndag", time: "17:00–18:30 / 18:30–20:00", price: "4 295 kr" },
      ],
      youth: {
        title: "Ungdomsrabatt",
        body: "30 % rabatt för dig under 20 år och 20 % under 26 (födda {y20} respektive {y26} eller senare). Rabatten kräver medlemskap i The Beach Volley Club Huddinge. Du behöver ingen aktiv tävlingslicens — men har du en ska den vara hos oss.",
      },
      signup: {
        title: "Anmälan",
        statusOpen: "Anmälan är öppen.",
        statusWaitlist: "Fullbokat. Nya anmälningar går till väntelistan och är bindande om du erbjuds en plats.",
        statusClosed: "Anmälan är stängd.",
        statusBeforeOpen: "Anmälan öppnar",
        details1: "Vill du träna med kompisar? Ni placeras i gruppen som matchar den i gänget med lägst nivå — nivån är alltid huvudregeln. Markera alla tider du kan i formuläret, så ökar chansen till två eller tre pass i veckan. Anmälan är bindande — läs ",
        termsLabel: "villkor & avanmälan",
        details2: ". Redan med i en grupp och vill byta? Gör en ",
        changeLabel: "ändringsanmälan",
        details3: ".",
        ctaOpen: "Till anmälan",
        ctaWaitlist: "Till väntelistan",
        ctaBeforeOpen: "Anmälan öppnar senare",
        ctaClosed: "Anmälan stängd",
      },
      overflow: {
        title: "Missade du träningsgrupperna?",
        body: "Fortsättningskursen har fortfarande några platser kvar — 15 pass med coach, hela hösten. Tisdagar 19:00 eller torsdagar 20:30.",
        cta: "Se fortsättningskursen",
      },
      questionsTitle: "Frågor",
    },
    youth: {
      eyebrow: "3–21 år",
      title1: "Barn &",
      title2: "ungdom",
      lead: "Framtidens stjärnor organiseras via vår hemmaklubb — ett lågt pris till barn- och ungdomsverksamheten är en del av vår identitet.",
      quote:
        "Framtidens stjärnor (3–21 år) organiseras genom vår hemmaklubb. Vi har som ambition att hålla ett lågt pris till barn & ungdomsverksamheten.",
      attribution: "The Beach Volley Club",
      infoTitle: "Schema & anmälan",
      infoBody:
        "Alla scheman och anmälningar sker via Svenska Lag — vår hemmaklubbsplattform. Där hittar du aktuella tider, grupper och kontaktpersoner.",
      items: ["Åldrar 3–21 år", "Prisvärd — stöds av klubbmedlemmarnas avgifter"],
      contactPre: "Kontakt: Måns Björn — ",
      cta: "Se schema på Svenska Lag",
    },
    pt: {
      eyebrow: "Privat gruppträning",
      title: "PT-grupp",
      lead: "Gå ihop 6–8 spelare som vill träna tillsammans och hyr en egen coach. Räknas som friskvård.",
      includedTitle: "Vad ingår",
      rows: [
        { label: "Coachavgift", value: "1 500–1 800 kr / pass" },
        { label: "Banavgift (kvällstid)", value: "100 kr / person" },
        { label: "Banavgift (dagtid vardag)", value: "50 kr / person" },
      ],
      flex: { label: "Flexibla tider", value: "Ja" },
      note: "Räknas som friskvård — kolla med din arbetsgivare.",
      exampleEyebrow: "Räkneexempel",
      exampleIntro: "6 personer, coach 1 500 kr/pass:",
      exCoachLabel: "Coach (6 pers)",
      exCoachValue: "250 kr / person",
      exCourtLabel: "Bana",
      exCourtValue: "100 kr / person",
      exTotalLabel: "Totalt",
      exTotalValue: "350 kr / person",
      cta: "Kontakta David",
    },
    schools: {
      eyebrow: "Skolor & företag",
      title1: "Aktivitet för",
      title2: "hela gruppen",
      lead: "1,5 h beachvolley med ledare — perfekt för idrottsdagar, klassaktiviteter och kickoffs. Allt ingår.",
      included: ["Nät och bollar", "Omklädningsrum & dusch", "Matservering", "Ledare på plats"],
      school: {
        tag: "Skolor",
        title: "Skolaktivitet",
        price: "100 kr",
        priceUnit: "/ elev",
        pkg1: { pre: "Ledarpaket: ", strong: "1 500 kr", post: " (upp till 40 elever)" },
        pkg2: { pre: "Ledarpaket: ", strong: "2 000 kr", post: " (fler än 40 elever)" },
        cta: "Läs mer & boka skolbesök",
        ctaHref: "/skola",
      },
      company: {
        tag: "Företag",
        title: "Kickoff & event",
        body: "Vill ni ha ett fullt eventkoncept med middag, dryck och skräddarsytt upplägg? Vi har färdiga paket för alla gruppers storlek och budget.",
        cta: "Se företagsevent",
        ctaHref: "/events",
      },
    },
    coaches: {
      eyebrow: "Världsklass",
      titlePre: "Våra",
      titleAccent: "coacher",
      lead: "The Beach grundades av coacher — och leds fortfarande av människor som lever och andas beachvolley på elitnivå.",
      imgAlt: "Mattias Magnusson med Tina och Sanna Thurin på The Beach",
      caption: "På bilden: Mattias med Tina & Sanna Thurin — sexfaldiga SM-vinnare och tränare hos oss.",
      role: "Sportchef & medgrundare",
      name: "Mattias Magnusson",
      bio: "Förbundskapten för det svenska damlandslaget och utsedd till “Coach of the Year” av Svenska Volleybollförbundet. Här leder han tränarstaben — spelare och coacher som lever och andas beachvolley på elitnivå.",
      note: "Våra coacher utbildar även andra tränare internt — kompetensen sprids i hela anläggningen.",
    },
    membership: {
      eyebrow: "Bli del av klubben",
      titlePre: "Bli",
      titleAccent: "medlem",
      lead: "Stöd ungdomsverksamheten och få rabatter — ett enkelt val om du spelar regelbundet på The Beach.",
      tiers: [
        { label: "Vuxen", price: "350 kr", unit: "/ år" },
        { label: "Junior", price: "190 kr", unit: "/ år" },
      ],
      benefitsTitle: "Fördelar",
      benefits: [
        "Lägre banavgifter",
        "Rabatterade träningspriser (junior)",
        "Tillgång till exklusiva event och erbjudanden",
        "Tävlingslicens ingår",
        "Du stödjer ungdomsverksamheten",
      ],
      panel: {
        eyebrow: "Redo att bli del av klubben?",
        title1: "Anmäl dig via",
        title2: "MATCHi",
        body: "Snabbt och enkelt — klicka nedan och välj medlemskap på The Beach-sidan i MATCHi.",
        cta: "Bli medlem via MATCHi",
      },
    },
    cta: {
      eyebrow: "Nästa steg",
      title1: "Redo att",
      titleAccent: "börja?",
      body: "Grund- och fortsättningskurserna anmäler du dig till direkt här på sajten. Du betalar med Swish, kort, Apple Pay eller Google Pay och platsen är din så fort betalningen gått igenom. Frågor? Hör av dig.",
      ctaCourses: "Se kurserna",
      ctaContact: "Kontakta oss",
      competePre: "Vill du tävla? ",
      competeLabel: "Se kalendern →",
      competeHref: "/kalender",
    },
  },
  en: {
    meta: {
      title: "Training — The Beach | Beach volleyball courses in Stockholm",
      description:
        "~800 players train every week. Courses and training groups for all levels — beginner to advanced, kids & youth, PT groups and schools. Led by national-team coaches at The Beach in Huddinge since 2006.",
      ogTitle: "Training — The Beach",
      ogDescription:
        "Courses and training groups for all levels. Beginner course 795 kr. Autumn season 2026 starts 30 Aug. The Beach, Novavägen 35, Huddinge.",
    },
    hero: {
      eyebrow: "Training",
      title1: "Find your",
      titleAccent: "beach volleyball training",
      intro:
        "~800 players train every week at The Beach. Courses and training groups for all levels — since 2006. Led by world-class coaches on the sand in Huddinge.",
      ctaCourses: "Season starts 30 Aug — see the courses",
      ctaGroups: "See the training groups",
      ctaEvents: "Book an event instead",
      ctaEventsHref: "/en/events",
    },
    marquee: { ariaLabel: "Photos from training" },
    pathfinder: {
      eyebrow: "New here?",
      title: "Find your path",
      lead: "Two quick questions — and we'll point you straight to the right course or group.",
      q1: "1. How old are you?",
      q2: "2. Have you played beach volleyball?",
      ageOptions: { under21: "Under 21", adult: "21 or older" },
      expOptions: {
        never: "Never played",
        comeback: "Played before — but it's been a while",
        regular: "Play regularly",
      },
      placeholder: "Answer the questions and we'll show you your way into the sand.",
      paths: {
        under21Never: {
          title: "You can choose either track",
          body: "Under 21? You have two ways in — junior training through the club (term-based sign-up, lower price, club membership included) or the beginner course, which is open to all ages (5 evening sessions on Tuesdays or Thursdays). Pick whichever suits you best.",
          ctas: [
            { label: "Junior training via Svenska Lag", href: "https://www.svenskalag.se/thebeach", external: true },
            { label: "The beginner course", href: "#kurser" },
          ],
        },
        under21Comeback: {
          title: "You can choose either track",
          body: "Under 21? You have two ways in — junior training through the club (term-based sign-up, lower price, club membership included) or the beginner course, which is open to all ages (5 evening sessions on Tuesdays or Thursdays). The continuation course can also be an option. Pick whichever suits you best.",
          ctas: [
            { label: "Junior training via Svenska Lag", href: "https://www.svenskalag.se/thebeach", external: true },
            { label: "See the courses", href: "#kurser" },
          ],
        },
        under21Regular: {
          title: "You can choose either track",
          body: "Under 21 and already playing? The junior programme through the club trains the whole term with players your own age — or aim for the training groups. The current registration status is shown further down the page.",
          ctas: [
            { label: "Junior training via Svenska Lag", href: "https://www.svenskalag.se/thebeach", external: true },
            { label: "See the training groups", href: "#traningsgrupper" },
          ],
        },
        adultNever: {
          title: "The beginner course is your way in",
          body: "5 sessions × 1.5 h where you learn technique, footwork, tactics and game play from the ground up. No experience required — just bring motivation.",
          ctas: [{ label: "See the beginner course", href: "#kurser" }],
        },
        adultComeback: {
          title: "The continuation course — perfect for a comeback",
          body: "Played before, but it was a long time ago? You don't need to start over from zero. The continuation course refreshes the basics and takes you onward at match tempo — most comeback players land right here.",
          ctas: [{ label: "See the continuation course", href: "#kurser" }],
          note: "Not sure about your level? Email traning@thebeach.one and we'll help you choose.",
        },
        adultRegular: {
          title: "The training groups are your next step",
          body: "If you play regularly you're placed in a group that matches your level — balanced groups, 15 sessions per season. The current registration status is shown with the training groups.",
          ctas: [{ label: "See the training groups", href: "#traningsgrupper" }],
        },
        adultRegularClosed: {
          title: "Missed the training groups?",
          body: "Registration for this autumn's training groups is closed. The continuation course still has a few places left — 15 coached sessions, Tuesdays 19:00 or Thursdays 20:30.",
          ctas: [
            { label: "See the continuation course", href: "#kurser" },
            { label: "The training groups", href: "#traningsgrupper" },
          ],
        },
      },
    },
    courses: {
      eyebrow: "Start training",
      title: "The course ladder",
      lead: "Never played beach volleyball — or want to take your game to the next level? This is your way in.",
      noPriceLabel: "Price given at sign-up",
      items: [
        {
          no: "01",
          tag: "Beginner",
          title: "Beginner course",
          price: "795 kr",
          priceNote: "Your personal price is shown after you sign in.",
          details: [
            "5 sessions × 1.5 h (19:00–20:30 or 20:30–22:00)",
            "Technique, footwork, tactics and game play",
            "Indoors",
            "Starts: Tuesdays from 1 Sep or Thursdays from 3 Sep 2026",
          ],
          quote: "No previous experience required. Just bring motivation and a good attitude.",
          ctas: [{ label: "Email us to sign up", href: "mailto:boka@thebeach.one" }],
        },
        {
          no: "02",
          tag: "Intermediate",
          title: "Continuation course",
          price: "3 695 kr",
          priceNote: "15 sessions · your personal price is shown after you sign in.",
          details: [
            "15 sessions × 1.5 h (19:00–20:30 or 20:30–22:00)",
            "Movement & positioning, ball control, defence & attack",
            "Game sense & match play at a higher tempo",
            "Starts: Tuesdays 1 Sep or Thursdays 3 Sep 2026",
          ],
          quote:
            "Played before, but it was a long time ago? This is the right way back in for your comeback — you don't need to start over from zero.",
          ctas: [{ label: "Email us to sign up", href: "mailto:boka@thebeach.one" }],
        },
      ],
    },
    groups: {
      eyebrow: "Autumn season 2026",
      title: "Training groups",
      lead: "For players who've completed the continuation course or have equivalent experience. Head coach Mattias Magnusson and the coaching team put together balanced groups — placement is based primarily on your level, and your preferences for days, times and friends are taken into account. Starts: Sundays 30 Aug, Mondays 31 Aug and Wednesdays week 36.",
      fakta: [
        { v: "15 sessions", d: "including one Gameday · last session 9 Dec" },
        { v: "By Tue", d: "groups published — app notification" },
        { v: "−30 / −20 %", d: "youth discount for those born {y20} and {y26} or later" },
      ],
      tableCaption: "Training groups autumn season 2026 — day, time and price",
      thDay: "Day",
      thTime: "Time",
      thPrice: "Price (15 sessions)",
      schedule: [
        { day: "Monday", time: "17:30–19:00", price: "4 295 kr" },
        { day: "Monday", time: "19:00–20:30", price: "4 995 kr" },
        { day: "Monday", time: "20:30–22:00", price: "4 295 kr" },
        { day: "Wednesday", time: "19:00–20:30", price: "4 995 kr" },
        { day: "Wednesday", time: "20:30–22:00", price: "4 295 kr" },
        { day: "Sunday", time: "12:00–13:30 / 13:30–15:00", price: "3 995 kr" },
        { day: "Sunday", time: "17:00–18:30 / 18:30–20:00", price: "4 295 kr" },
      ],
      youth: {
        title: "Youth discount",
        body: "30% off if you are under 20 and 20% if you are under 26 (born {y20} and {y26} or later respectively). The discount requires membership of The Beach Volley Club Huddinge. You do not need an active competition licence — but if you have one, it must be with us.",
      },
      signup: {
        title: "Sign-up",
        statusOpen: "Registration is open.",
        statusWaitlist: "Fully booked. New registrations go to the waiting list and are binding if you are offered a place.",
        statusClosed: "Registration is closed.",
        statusBeforeOpen: "Registration opens",
        details1: "Want to train with friends? You'll be placed in the group matching the lowest level in your crew — level is always the main rule. Tick every time you can make in the form to raise your chances of two or three sessions a week. Registration is binding — read the ",
        termsLabel: "terms & cancellation policy",
        details2: " (in Swedish). Already in a group and want to switch? Submit a ",
        changeLabel: "change request",
        details3: " (in Swedish).",
        ctaOpen: "Go to registration",
        ctaWaitlist: "Join the waiting list",
        ctaBeforeOpen: "Registration opens later",
        ctaClosed: "Registration closed",
      },
      overflow: {
        title: "Missed the training groups?",
        body: "The continuation course still has a few places left — 15 coached sessions, all autumn. Tuesdays 19:00 or Thursdays 20:30.",
        cta: "See the continuation course",
      },
      questionsTitle: "Questions",
    },
    youth: {
      eyebrow: "Ages 3–21",
      title1: "Kids &",
      title2: "youth",
      lead: "Our future stars are organised through our home club — keeping the price low for kids' and youth training is part of our identity.",
      quote:
        "Our future stars (ages 3–21) are organised through our home club. Our ambition is to keep the price low for the kids' & youth programme.",
      attribution: "The Beach Volley Club",
      infoTitle: "Schedule & sign-up",
      infoBody:
        "All schedules and sign-ups are handled via Svenska Lag — our home club platform (in Swedish). That's where you'll find current times, groups and contact people.",
      items: ["Ages 3–21", "Affordable — supported by club membership fees"],
      contactPre: "Contact: Måns Björn — ",
      cta: "See the schedule on Svenska Lag",
    },
    pt: {
      eyebrow: "Private group training",
      title: "PT group",
      lead: "Get together 6–8 players who want to train as a group and hire your own coach. Counts as friskvård (Swedish wellness allowance).",
      includedTitle: "What's included",
      rows: [
        { label: "Coach fee", value: "1 500–1 800 kr / session" },
        { label: "Court fee (evenings)", value: "100 kr / person" },
        { label: "Court fee (weekday daytime)", value: "50 kr / person" },
      ],
      flex: { label: "Flexible times", value: "Yes" },
      note: "Counts as friskvård (wellness allowance) — check with your employer.",
      exampleEyebrow: "Example",
      exampleIntro: "6 people, coach 1 500 kr/session:",
      exCoachLabel: "Coach (6 people)",
      exCoachValue: "250 kr / person",
      exCourtLabel: "Court",
      exCourtValue: "100 kr / person",
      exTotalLabel: "Total",
      exTotalValue: "350 kr / person",
      cta: "Contact David",
    },
    schools: {
      eyebrow: "Schools & companies",
      title1: "Activity for",
      title2: "the whole group",
      lead: "1.5 h of beach volleyball with an instructor — perfect for sports days, class activities and kickoffs. Everything included.",
      included: ["Nets and balls", "Changing rooms & showers", "Food service", "Instructor on site"],
      school: {
        tag: "Schools",
        title: "School activity",
        price: "100 kr",
        priceUnit: "/ student",
        pkg1: { pre: "Instructor package: ", strong: "1 500 kr", post: " (up to 40 students)" },
        pkg2: { pre: "Instructor package: ", strong: "2 000 kr", post: " (more than 40 students)" },
        cta: "Read more & book a school visit",
        ctaHref: "/en/school",
      },
      company: {
        tag: "Companies",
        title: "Kickoff & events",
        body: "Want a full event concept with dinner, drinks and a tailored set-up? We have ready-made packages for every group size and budget.",
        cta: "See corporate events",
        ctaHref: "/en/events",
      },
    },
    coaches: {
      eyebrow: "World class",
      titlePre: "Our",
      titleAccent: "coaches",
      lead: "The Beach was founded by coaches — and is still run by people who live and breathe beach volleyball at elite level.",
      imgAlt: "Mattias Magnusson with Tina and Sanna Thurin at The Beach",
      caption: "Pictured: Mattias with Tina & Sanna Thurin — six-time Swedish champions and coaches with us.",
      role: "Sporting director & co-founder",
      name: "Mattias Magnusson",
      bio: "Head coach of the Swedish women's national team and named “Coach of the Year” by the Swedish Volleyball Federation. Here he leads the coaching staff — players and coaches who live and breathe beach volleyball at elite level.",
      note: "Our coaches also train other coaches internally — the expertise spreads across the whole facility.",
    },
    membership: {
      eyebrow: "Join the club",
      titlePre: "Become a",
      titleAccent: "member",
      lead: "Support the youth programme and get discounts — an easy choice if you play regularly at The Beach.",
      tiers: [
        { label: "Adult", price: "350 kr", unit: "/ year" },
        { label: "Junior", price: "190 kr", unit: "/ year" },
      ],
      benefitsTitle: "Benefits",
      benefits: [
        "Lower court fees",
        "Discounted training prices (junior)",
        "Access to exclusive events and offers",
        "Competition licence included",
        "You support the youth programme",
      ],
      panel: {
        eyebrow: "Ready to join the club?",
        title1: "Sign up via",
        title2: "MATCHi",
        body: "Quick and easy — click below and choose membership on The Beach page in MATCHi (in Swedish).",
        cta: "Become a member via MATCHi",
      },
    },
    cta: {
      eyebrow: "Next step",
      title1: "Ready to",
      titleAccent: "start?",
      body: "Sign up for beginner and intermediate courses right here. Pay with Swish, card, Apple Pay or Google Pay; your place is confirmed when payment clears. Questions? Get in touch.",
      ctaCourses: "See the courses",
      ctaContact: "Contact us",
      competePre: "Want to compete? ",
      competeLabel: "See the calendar →",
      competeHref: "/en/calendar",
    },
  },
};
