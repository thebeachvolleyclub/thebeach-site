import type { Dict } from "@/lib/i18n";
import type { When, TierKey, Policy, BarMode, WelcomeKey } from "@/lib/planner";

/**
 * Ordbok för eventplaneraren (/events/planera resp. /en/events/plan).
 * Svenska texterna är källan och bevaras exakt; engelskan speglar strukturen.
 * Priser och prislogik bor i src/lib/planner.ts och styrs INTE härifrån —
 * här finns bara text. Prissträngar i UI:t ("79 kr/p" osv) speglar planner.ts.
 *
 * OBS: det som skickas i förfrågan (data-objektet i EventPlanner.submit) är
 * ALLTID på svenska oavsett kundens språk — teamet läser internt på svenska.
 */
export interface PlannerDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  header: { eyebrow: string; titleTop: string; titleAccent: string; intro: string };
  /** Format-etiketter — slås upp av calcSummary/buildTimeline (WHENLBL = sv). */
  whenLbl: Record<When, string>;
  /** Välkomstdrink-etiketter — slås upp av welcomeLabel (WELCOME.lbl = sv). */
  welcome: Record<WelcomeKey, { lbl: string; lblNA?: string }>;
  polTxt: Record<Policy, string>;
  /** Summeringens rad- och offertetiketter (calcSummary). */
  sum: {
    exclusiveArena: string;
    minTurnoverPre: string;
    minTurnoverPost: string;
    noAlcDeduction: string;
    perUnit: string;
    unitSing: string;
    unitPlur: string;
    extraUnits: string;
    extraUnitsNoAlc: string;
    dukning: string;
    dekor: string;
    lemon: string;
    panna: string;
    kaffe: string;
    godis: string;
    konf: string;
    dj: string;
    eld: string;
    scen: string;
    foto: string;
    flatFee: string;
    from: string;
    format: string;
    startTime: string;
    alcoholPolicy: string;
    barPre: string;
    barInvoice: string;
    barGuests: string;
    band: string;
    trubadur: string;
    dans: string;
    akt: string;
    aktLek: string;
    ljud: string;
    buss: string;
  };
  /** Tidsplansetiketter (buildTimeline). */
  timeline: {
    lunch: string;
    dinner: string;
    arrival: string;
    volley: string;
    volleyTeam: string;
    shower: string;
    /** Tas bort ur välkomstdrinkens etikett i tidsplanen ("Cava vid ankomst" → "Cava"). */
    welcomeStrip: string;
    servedInBar: string;
    trubadurPlays: string;
    mealSand: string;
    mealLoungeShared: string;
    mealLounge: string;
    fireShow: string;
    danceFloor: string;
    withDj: string;
    withBand: string;
    end: string;
    conference: string;
    thanksDay: string;
    thanksEve: string;
  };
  ui: {
    steps: string[];
    stepperDec: string;
    stepperInc: string;
    next: string;
    back: string;
    step0: {
      whenLegend: string;
      dayBadge: string;
      dayTitle: string;
      dayDesc: string;
      weekeveTitle: string;
      weekeveDesc: string;
      friBadge: string;
      friTitle: string;
      friDesc: string;
      noteShared50: string;
      noteFriPre: string;
      noteFriPost: string;
      guestsLegend: string;
      guestsHint: string;
      tierLegend: string;
      mostBooked: string;
      tierMeta: Record<TierKey, { meta1: string; meta2Day: string; meta2Eve: string }>;
      perP: string;
    };
    step1: {
      policyLegend: string;
      stdBadge: string;
      policies: Record<Policy, { title: string; desc: string }>;
      noteNoAlc: string;
      welcomeLegend: string;
      welcomeNoAlc: { title: string; sub: string; price: string };
      welcomeCava: { title: string; sub: string; price: string };
      welcomeAperol: { title: string; sub: string; price: string };
      welcomeOther: { title: string; sub: string; price: string };
      unitsLegend: string;
      unitsPre: string;
      unitsPost: string;
      barLegend: string;
      barModes: Record<BarMode, { title: string; desc: string }>;
    };
    step2: {
      noteSand: string;
      dukningLegend: string;
      dukning: { title: string; sub: string; price: string };
      dekor: { title: string; sub: string; price: string };
      dessertLegend: string;
      lemon: { title: string; sub: string; price: string };
      panna: { title: string; sub: string; price: string };
      coffeeLegend: string;
      kaffe: { title: string; sub: string; price: string };
      godis: { title: string; sub: string; price: string };
    };
    step3: {
      noteParty: string;
      musicLegend: string;
      dj: { title: string; sub: string; price: string };
      eld: { title: string; sub: string; price: string };
      band: { title: string; sub: string; price: string };
      trubadur: { title: string; sub: string; price: string };
      dans: { title: string; sub: string; price: string };
      aktLegend: string;
      akt: { title: string; sub: string; price: string };
      lek: { title: string; sub: string; price: string };
    };
    step4: {
      konfLegend: string;
      konf: { title: string; sub: string; price: string };
      scenLegend: string;
      scen: { title: string; sub: string; price: string };
      ljud: { title: string; sub: string; price: string };
      logLegend: string;
      foto: { title: string; sub: string; price: string };
      buss: { title: string; sub: string; price: string };
    };
    step5: {
      startLegend: string;
      customStartAria: string;
      orOwnTime: string;
      timelineLegend: string;
      examplePre: string;
      exampleStart: string;
      timelineFine: string;
      dateLegend: string;
      dateHintDay: string;
      dateHintWeekeve: string;
      dateHintFri: string;
      date1: string;
      date2: string;
      contactLegend: string;
      nameLbl: string;
      namePh: string;
      orgLbl: string;
      orgPh: string;
      emailLbl: string;
      emailPh: string;
      telLbl: string;
      telPh: string;
      msgLbl: string;
      msgPh: string;
      sending: string;
      send: string;
      error: string;
    };
    sent: { title: string; body: string };
    aside: {
      title: string;
      pers: string;
      inQuote: string;
      estimate: string;
      estimateFrom: string;
      fine: string;
    };
  };
}

export const plannerDict: Dict<PlannerDict> = {
  sv: {
    meta: {
      title: "Planera ert event — The Beach | Bygg ert företagsevent steg för steg",
      description:
        "Bygg ert företagsevent själva — välj koncept, dryck, mat och underhållning och se prisbilden direkt. Skicka planen som förfrågan, vi svarar inom 24 timmar.",
      ogTitle: "Planera ert event — The Beach",
      ogDescription:
        "Välj koncept, dryck, mat och underhållning — se prisbilden direkt och skicka planen som förfrågan.",
    },
    header: {
      eyebrow: "Företag & organisation",
      titleTop: "Planera ert",
      titleAccent: "event",
      intro:
        "Bygg ert drömevent steg för steg — koncept, dryck, mat, underhållning. Ni ser prisbilden direkt och skickar planen som en förfrågan. Inga datum låses här — vi återkommer inom 24 timmar och håller gärna datumet i dialogen.",
    },
    whenLbl: {
      day: "vardag dagtid",
      weekeve: "kväll — mitt i beachlivet",
      fri: "helkväll — exklusiv arena (fre/lör)",
    },
    welcome: {
      cava: { lbl: "Cava vid ankomst", lblNA: "Alkoholfritt bubbel vid ankomst" },
      aperol: { lbl: "Aperol Spritz vid ankomst" },
      other: { lbl: "Välkomstdrink 4 cl", lblNA: "Välkomstmocktail" },
    },
    polTxt: {
      none: "Ingen alkohol",
      std: "Öl, vin, cider & cava (ej sprit)",
      full: "Full bar",
    },
    sum: {
      exclusiveArena: "Exklusiv arena fre/lör",
      minTurnoverPre: "minimiomsättning ",
      minTurnoverPost: " kr på paketet",
      noAlcDeduction: "Alkoholfritt — avdrag",
      perUnit: "kr/enhet",
      unitSing: "enhet",
      unitPlur: "enheter",
      extraUnits: "Extra dryckesenheter",
      extraUnitsNoAlc: " (alkoholfria)",
      dukning: "Dukad middag i sanden",
      dekor: "Extra dekoration",
      lemon: "Lemonposset",
      panna: "Pannacotta",
      kaffe: "Kaffe",
      godis: "Kaffe & godis",
      konf: "Konferenspaket",
      dj: "DJ (normalt 22–00/01)",
      eld: "Eldshow",
      scen: "Scen",
      foto: "Fotograf",
      flatFee: "fast tillägg",
      from: "från",
      format: "Format",
      startTime: "Önskad starttid",
      alcoholPolicy: "Alkoholpolicy",
      barPre: "Dryckesbiljetter vid ankomst (förköpta enheter)",
      barInvoice: "Efter paketets enheter: öppen bar på faktura",
      barGuests: "Efter paketets enheter: gästerna betalar själva",
      band: "Liveband",
      trubadur: "Trubadur",
      dans: "Dansinstruktör",
      akt: "Utökade aktiviteter (pingis, cornhole, kubb)",
      aktLek: " · med lekledare",
      ljud: "Ljud & ljus utöver standard",
      buss: "Busstransport (Interbus)",
    },
    timeline: {
      lunch: "Lunch",
      dinner: "Middag",
      arrival: "Ankomst och ombyte",
      volley: "Beachvolley — turnering med instruktör",
      volleyTeam: ", fokus teambuilding",
      shower: "Dusch och ombyte för de som vill",
      welcomeStrip: " vid ankomst",
      servedInBar: " serveras i baren",
      trubadurPlays: "trubadur spelar i loungen",
      mealSand: " — dukat långbord i sanden",
      mealLoungeShared: " i loungen — beachlivet pågår runt er",
      mealLounge: " i loungen",
      fireShow: "Eldshow — bryggan till dansgolvet",
      danceFloor: "Dansgolv",
      withDj: " med DJ",
      withBand: " — liveband",
      end: "Slut",
      conference: "Konferens (upp till 3 h)",
      thanksDay: "Tack för idag",
      thanksEve: "Tack för i kväll",
    },
    ui: {
      steps: ["Koncept", "Dryck & bar", "Mat & sött", "Underhållning", "Produktion", "Förfrågan"],
      stepperDec: "Minska",
      stepperInc: "Öka",
      next: "Nästa →",
      back: "← Tillbaka",
      step0: {
        whenLegend: "När kör ni?",
        dayBadge: "−10 %",
        dayTitle: "Vardag dagtid",
        dayDesc:
          "Samma upplevelse med lunch i stället för middag — 10 % lägre pris. Perfekt för konferens + aktivitet.",
        weekeveTitle: "Kväll — mitt i beachlivet",
        weekeveDesc:
          "Måndag–lördag. Ert event mitt i beachlivet — aktivitet, middag och häng i loungen medan arenan lever runt er. Perfekt för 10–50 pers, inget minimum.",
        friBadge: "Fre/lör",
        friTitle: "Helkväll — exklusiv arena",
        friDesc:
          "Arenan är er, exklusivt — dansgolv, DJ, eldshow och sen bar. Minimiomsättning 50 000 kr på paketet, i praktiken från ca 50 pers.",
        noteShared50:
          "Fler än 50 med delad arena? Skicka planen ändå — då återkommer vi med ett skräddarsytt förslag.",
        noteFriPre: "Helkväll betyder att ni bokar hela arenan exklusivt — minimiomsättning ",
        noteFriPost:
          " kr på paketet, i praktiken från ca 50 personer. Estimatet nedan räknar med minimibeloppet. Är ni ett mindre gäng? Välj \"Kväll — mitt i beachlivet\" — det funkar alla dagar, även fredag och lördag, utan minimum.",
        guestsLegend: "Hur många är ni?",
        guestsHint: "personer — paketen gäller upp till 250, fler? Skräddarsytt.",
        tierLegend: "Välj koncept",
        mostBooked: "Mest bokad",
        tierMeta: {
          lp: {
            meta1: "Enkelt & socialt · 10–50 pers",
            meta2Day: "Turnering + instruktör · tapas · 1 dryck",
            meta2Eve: "Turnering + instruktör · tapas · 1 dryck",
          },
          alg: {
            meta1: "Aktivitet & middag · 10–250 pers",
            meta2Day: "Turnering · lunchbuffé · 1 dryck",
            meta2Eve: "Turnering · middagsbuffé · 1 dryck",
          },
          mia: {
            meta1: "Helkväll & after beach · 15–250 pers",
            meta2Day: "Turnering · BBQ-lunch · 2 drycker",
            meta2Eve: "Turnering · BBQ-buffé · 2 drycker",
          },
        },
        perP: "kr/p",
      },
      step1: {
        policyLegend: "Alkoholpolicy för ert event",
        stdBadge: "Standard",
        policies: {
          none: {
            title: "Ingen alkohol",
            desc: "Helt alkoholfritt — dryckesenheterna blir alkoholfria och baren kör mocktails.",
          },
          std: {
            title: "Öl, vin, cider & cava",
            desc: "Klassikern. Ej sprit — bra tempo hela kvällen.",
          },
          full: {
            title: "Full bar",
            desc: "Hela sortimentet inklusive sprit och drinkar i baren.",
          },
        },
        noteNoAlc:
          "Alkoholfritt hela vägen — vi byter till alkoholfria motsvarigheter och drar av 40 kr per dryckesenhet i paketet.",
        welcomeLegend: "Välkomstdrink vid ankomst",
        welcomeNoAlc: {
          title: "Alkoholfritt bubbel vid ankomst",
          sub: "Ett glas alkoholfritt bubbel vid ankomst",
          price: "61 kr/p",
        },
        welcomeCava: { title: "Cava vid ankomst", sub: "Ett glas bubbel vid ankomst", price: "79 kr/p" },
        welcomeAperol: {
          title: "Aperol Spritz vid ankomst",
          sub: "Sommarklassikern — direkt semesterkänsla",
          price: "96 kr/p",
        },
        welcomeOther: {
          title: "Välkomstdrink 4 cl",
          sub: "Valfri enkel drink — vi föreslår i offerten",
          price: "96 kr/p",
        },
        unitsLegend: "Extra dryckesenheter (förköpta)",
        unitsPre: "à ",
        unitsPost: " kr/person — utöver det som ingår i konceptet",
        barLegend: "När de enheter som ingår i paketet är slut",
        barModes: {
          pre: {
            title: "Vi förköper fler enheter",
            desc: "Dryckesbiljetter som gästerna får vid ankomst — full koll på kostnaden.",
          },
          invoice: {
            title: "Öppen bar på faktura",
            desc: "Baren håller öppet och notan går på er — löpande enligt barpriser.",
          },
          guests: {
            title: "Gästerna betalar själva",
            desc: "När paketets enheter är slut köper gästerna själva i baren.",
          },
        },
      },
      step2: {
        noteSand:
          "Dukat i sanden kör vi dagtid och vid exklusiv arena — när arenan delas spelas det på banorna och middagen serveras i loungen.",
        dukningLegend: "Dukning",
        dukning: {
          title: "Dukad middag i sanden",
          sub: "Långbord mitt i sanden i stället för loungen — wow-faktorn",
          price: "+100 kr/p",
        },
        dekor: {
          title: "Extra dekoration",
          sub: "Blommor, ljus och tema — vid dukningen eller i loungen",
          price: "79 kr/p",
        },
        dessertLegend: "Dessert",
        lemon: { title: "Lemonposset", sub: "Syrlig, len och somrig", price: "75 kr/p" },
        panna: { title: "Pannacotta", sub: "Klassikern som alltid går hem", price: "75 kr/p" },
        coffeeLegend: "Kaffe & sött",
        kaffe: { title: "Kaffe", sub: "Till desserten eller minglet", price: "30 kr/p" },
        godis: { title: "Kaffe & godis", sub: "Kaffe med Dumle, smågodis och sött till", price: "45 kr/p" },
      },
      step3: {
        noteParty:
          "DJ, eldshow och liveband hör till helkvällsformatet med exklusiv arena (fredag & lördag). När arenan delas lever den runt ert event, och middagen i loungen är en del av charmen. Vill ni ta över hela arenan en vardag? Skriv det i meddelandet så återkommer vi med offert.",
        musicLegend: "Musik & show",
        dj: { title: "DJ", sub: "Normalt ingår 22–00 eller 22–01", price: "från 5 000 kr" },
        eld: { title: "Eldshow", sub: "Efter middagen — bryggan till dansgolvet", price: "från 8 000 kr" },
        band: { title: "Liveband", sub: "Vi bokar rätt band för er kväll", price: "enligt offert" },
        trubadur: {
          title: "Trubadur",
          sub: "Livemusik i lagom format — perfekt till middagen",
          price: "enligt offert",
        },
        dans: {
          title: "Dansinstruktör",
          sub: "Gemensam dansstund som får med alla",
          price: "enligt offert",
        },
        aktLegend: "Fler aktiviteter",
        akt: { title: "Utökade aktiviteter", sub: "Pingis, cornhole, kubb", price: "enligt offert" },
        lek: {
          title: "Med lekledare",
          sub: "Vi bemannar aktiviteterna och håller igång tempot",
          price: "enligt offert",
        },
      },
      step4: {
        konfLegend: "Möte & konferens",
        konf: {
          title: "Konferenspaket",
          sub: "Upp till 3 h möte, projektor + duk, konferensyta i loungen eller solstolskonferens i sanden",
          price: "395 kr/p",
        },
        scenLegend: "Scen & teknik",
        scen: {
          title: "Scen",
          sub: "Scenen i stora hallen — tal, prisutdelning, uppträdande",
          price: "från 10 000 kr",
        },
        ljud: {
          title: "Ljud & ljus utöver standard",
          sub: "Större produktion — vi specar med er",
          price: "enligt offert",
        },
        logLegend: "Minnen & logistik",
        foto: {
          title: "Fotograf",
          sub: "Proffsbilder från er kväll — till internt & sociala medier",
          price: "från 10 000 kr",
        },
        buss: {
          title: "Busstransport",
          sub: "Hämtning & hemresa — vi samarbetar med Interbus",
          price: "enligt offert",
        },
      },
      step5: {
        startLegend: "Önskad starttid för aktiviteten",
        customStartAria: "Egen starttid",
        orOwnTime: "eller egen tid",
        timelineLegend: "Exempel på tidsplan utifrån era val",
        examplePre: "Exempel — ",
        exampleStart: ", start ",
        timelineFine:
          "Preliminärt exempel — körschemat spikar vi tillsammans i offerten. Ju fler ni är, desto mer tid behöver ombyte och mellanmoment.",
        dateLegend: "Datum — vi återkommer om tillgänglighet",
        dateHintDay: "(en vardag, dagtid)",
        dateHintWeekeve: "(måndag–lördag, kväll)",
        dateHintFri: "(en fredag eller lördag)",
        date1: "Önskat datum *",
        date2: "Alternativt datum",
        contactLegend: "Kontaktuppgifter",
        nameLbl: "Namn *",
        namePh: "För- och efternamn",
        orgLbl: "Företag / organisation",
        orgPh: "Företagets namn",
        emailLbl: "E-post *",
        emailPh: "namn@foretag.se",
        telLbl: "Telefon",
        telPh: "070-000 00 00",
        msgLbl: "Något mer vi ska veta?",
        msgPh: "Allergier, tema, önskemål — allt är välkommet",
        sending: "Skickar…",
        send: "Skicka eventplanen →",
        error: "Något gick fel — försök igen eller mejla david@thebeach.one",
      },
      sent: {
        title: "Tack — er eventplan är hos oss!",
        body:
          "Vi återkommer inom 24 timmar med datum och en offert. Vill ni något under tiden? Mejla david@thebeach.one.",
      },
      aside: {
        title: "Ert event",
        pers: "pers",
        inQuote: "I offerten",
        estimate: "Estimat",
        estimateFrom: "Estimat från",
        fine: "Preliminärt estimat ex moms. Slutlig offert bekräftar pris och innehåll. Vi svarar inom 24 h.",
      },
    },
  },
  en: {
    meta: {
      title: "Plan your event — The Beach | Build your corporate event step by step",
      description:
        "Build your corporate event yourselves — choose concept, drinks, food and entertainment and see pricing instantly. Send the plan as a request — we reply within 24 hours.",
      ogTitle: "Plan your event — The Beach",
      ogDescription:
        "Choose concept, drinks, food and entertainment — see pricing instantly and send the plan as a request.",
    },
    header: {
      eyebrow: "Companies & organisations",
      titleTop: "Plan your",
      titleAccent: "event",
      intro:
        "Build your dream event step by step — concept, drinks, food, entertainment. You see the pricing instantly and send the plan as a request. No dates are locked here — we get back to you within 24 hours and are happy to hold the date while we talk.",
    },
    whenLbl: {
      day: "weekday daytime",
      weekeve: "evening — in the middle of beach life",
      fri: "full evening — exclusive arena (Fri/Sat)",
    },
    welcome: {
      cava: { lbl: "Cava on arrival", lblNA: "Alcohol-free bubbles on arrival" },
      aperol: { lbl: "Aperol Spritz on arrival" },
      other: { lbl: "Welcome drink 4 cl", lblNA: "Welcome mocktail" },
    },
    polTxt: {
      none: "No alcohol",
      std: "Beer, wine, cider & cava (no spirits)",
      full: "Full bar",
    },
    sum: {
      exclusiveArena: "Exclusive arena Fri/Sat",
      minTurnoverPre: "minimum spend ",
      minTurnoverPost: " kr on the package",
      noAlcDeduction: "Alcohol-free — deduction",
      perUnit: "kr/unit",
      unitSing: "unit",
      unitPlur: "units",
      extraUnits: "Extra drink units",
      extraUnitsNoAlc: " (alcohol-free)",
      dukning: "Seated dinner in the sand",
      dekor: "Extra decoration",
      lemon: "Lemon posset",
      panna: "Panna cotta",
      kaffe: "Coffee",
      godis: "Coffee & sweets",
      konf: "Conference package",
      dj: "DJ (typically 22–00/01)",
      eld: "Fire show",
      scen: "Stage",
      foto: "Photographer",
      flatFee: "flat fee",
      from: "from",
      format: "Format",
      startTime: "Preferred start time",
      alcoholPolicy: "Alcohol policy",
      barPre: "Drink tickets on arrival (pre-purchased units)",
      barInvoice: "After the package units: open bar on invoice",
      barGuests: "After the package units: guests pay for themselves",
      band: "Live band",
      trubadur: "Troubadour",
      dans: "Dance instructor",
      akt: "Extended activities (table tennis, cornhole, kubb)",
      aktLek: " · with games host",
      ljud: "Sound & light beyond standard",
      buss: "Bus transport (Interbus)",
    },
    timeline: {
      lunch: "Lunch",
      dinner: "Dinner",
      arrival: "Arrival and changing",
      volley: "Beach volleyball — tournament with instructor",
      volleyTeam: ", teambuilding focus",
      shower: "Shower and change for those who want to",
      welcomeStrip: " on arrival",
      servedInBar: " served in the bar",
      trubadurPlays: "troubadour plays in the lounge",
      mealSand: " — seated long table in the sand",
      mealLoungeShared: " in the lounge — beach life going on around you",
      mealLounge: " in the lounge",
      fireShow: "Fire show — the bridge to the dance floor",
      danceFloor: "Dance floor",
      withDj: " with DJ",
      withBand: " — live band",
      end: "End",
      conference: "Conference (up to 3 h)",
      thanksDay: "Thanks for today",
      thanksEve: "Thanks for tonight",
    },
    ui: {
      steps: ["Concept", "Drinks & bar", "Food & sweets", "Entertainment", "Production", "Request"],
      stepperDec: "Decrease",
      stepperInc: "Increase",
      next: "Next →",
      back: "← Back",
      step0: {
        whenLegend: "When's your event?",
        dayBadge: "−10 %",
        dayTitle: "Weekday daytime",
        dayDesc:
          "The same experience with lunch instead of dinner — 10% lower price. Perfect for conference + activity.",
        weekeveTitle: "Evening — in the middle of beach life",
        weekeveDesc:
          "Monday–Saturday. Your event in the middle of beach life — activity, dinner and hanging out in the lounge while the arena is alive around you. Perfect for 10–50 people, no minimum.",
        friBadge: "Fri/Sat",
        friTitle: "Full evening — exclusive arena",
        friDesc:
          "The arena is yours, exclusively — dance floor, DJ, fire show and late bar. Minimum spend of 50 000 kr on the package, in practice from about 50 people.",
        noteShared50:
          "More than 50 with a shared arena? Send the plan anyway — we'll come back with a tailored proposal.",
        noteFriPre: "A full evening means you book the entire arena exclusively — minimum spend of ",
        noteFriPost:
          " kr on the package, in practice from about 50 people. The estimate below uses the minimum amount. Smaller group? Choose \"Evening — in the middle of beach life\" — it works every day, including Friday and Saturday, with no minimum.",
        guestsLegend: "How many are you?",
        guestsHint: "people — the packages cover up to 250, more? We'll tailor it.",
        tierLegend: "Choose your concept",
        mostBooked: "Most booked",
        tierMeta: {
          lp: {
            meta1: "Simple & social · 10–50 people",
            meta2Day: "Tournament + instructor · tapas · 1 drink",
            meta2Eve: "Tournament + instructor · tapas · 1 drink",
          },
          alg: {
            meta1: "Activity & dinner · 10–250 people",
            meta2Day: "Tournament · lunch buffet · 1 drink",
            meta2Eve: "Tournament · dinner buffet · 1 drink",
          },
          mia: {
            meta1: "Full evening & after beach · 15–250 people",
            meta2Day: "Tournament · BBQ lunch · 2 drinks",
            meta2Eve: "Tournament · BBQ buffet · 2 drinks",
          },
        },
        perP: "kr/p",
      },
      step1: {
        policyLegend: "Alcohol policy for your event",
        stdBadge: "Standard",
        policies: {
          none: {
            title: "No alcohol",
            desc: "Completely alcohol-free — the drink units become non-alcoholic and the bar serves mocktails.",
          },
          std: {
            title: "Beer, wine, cider & cava",
            desc: "The classic. No spirits — a good pace all evening.",
          },
          full: {
            title: "Full bar",
            desc: "The whole range including spirits and cocktails in the bar.",
          },
        },
        noteNoAlc:
          "Alcohol-free all the way — we switch to non-alcoholic equivalents and deduct 40 kr per drink unit from the package.",
        welcomeLegend: "Welcome drink on arrival",
        welcomeNoAlc: {
          title: "Alcohol-free bubbles on arrival",
          sub: "A glass of alcohol-free bubbles on arrival",
          price: "61 kr/p",
        },
        welcomeCava: { title: "Cava on arrival", sub: "A glass of bubbles on arrival", price: "79 kr/p" },
        welcomeAperol: {
          title: "Aperol Spritz on arrival",
          sub: "The summer classic — instant holiday feeling",
          price: "96 kr/p",
        },
        welcomeOther: {
          title: "Welcome drink 4 cl",
          sub: "Any simple drink — we'll suggest one in the quote",
          price: "96 kr/p",
        },
        unitsLegend: "Extra drink units (pre-purchased)",
        unitsPre: "at ",
        unitsPost: " kr/person — beyond what's included in the concept",
        barLegend: "When the units included in the package run out",
        barModes: {
          pre: {
            title: "We pre-purchase more units",
            desc: "Drink tickets that guests receive on arrival — full control of the cost.",
          },
          invoice: {
            title: "Open bar on invoice",
            desc: "The bar stays open and the tab goes to you — ongoing at bar prices.",
          },
          guests: {
            title: "Guests pay for themselves",
            desc: "When the package units run out, guests buy their own drinks in the bar.",
          },
        },
      },
      step2: {
        noteSand:
          "Seated dining in the sand runs daytime and with the exclusive arena — when the arena is shared, the courts are in play and dinner is served in the lounge.",
        dukningLegend: "Table setting",
        dukning: {
          title: "Seated dinner in the sand",
          sub: "A long table right in the sand instead of the lounge — the wow factor",
          price: "+100 kr/p",
        },
        dekor: {
          title: "Extra decoration",
          sub: "Flowers, candles and theming — at the table or in the lounge",
          price: "79 kr/p",
        },
        dessertLegend: "Dessert",
        lemon: { title: "Lemon posset", sub: "Tangy, silky and summery", price: "75 kr/p" },
        panna: { title: "Panna cotta", sub: "The classic that always lands", price: "75 kr/p" },
        coffeeLegend: "Coffee & sweets",
        kaffe: { title: "Coffee", sub: "With dessert or the mingle", price: "30 kr/p" },
        godis: {
          title: "Coffee & sweets",
          sub: "Coffee with Dumle, pick'n'mix and sweet treats",
          price: "45 kr/p",
        },
      },
      step3: {
        noteParty:
          "DJ, fire show and live band belong to the full-evening format with exclusive arena (Friday & Saturday). When the arena is shared it's alive around your event, and dinner in the lounge is part of the charm. Want to take over the whole arena on a weekday? Mention it in your message and we'll come back with a quote.",
        musicLegend: "Music & show",
        dj: { title: "DJ", sub: "Typically included 22–00 or 22–01", price: "from 5 000 kr" },
        eld: {
          title: "Fire show",
          sub: "After dinner — the bridge to the dance floor",
          price: "from 8 000 kr",
        },
        band: { title: "Live band", sub: "We book the right band for your evening", price: "by quote" },
        trubadur: {
          title: "Troubadour",
          sub: "Live music in a cosy format — perfect with dinner",
          price: "by quote",
        },
        dans: {
          title: "Dance instructor",
          sub: "A shared dance moment that gets everyone involved",
          price: "by quote",
        },
        aktLegend: "More activities",
        akt: { title: "Extended activities", sub: "Table tennis, cornhole, kubb", price: "by quote" },
        lek: {
          title: "With games host",
          sub: "We staff the activities and keep the tempo up",
          price: "by quote",
        },
      },
      step4: {
        konfLegend: "Meeting & conference",
        konf: {
          title: "Conference package",
          sub: "Up to 3 h of meeting, projector + screen, conference area in the lounge or deckchair conference in the sand",
          price: "395 kr/p",
        },
        scenLegend: "Stage & tech",
        scen: {
          title: "Stage",
          sub: "The stage in the main hall — speeches, award ceremonies, performances",
          price: "from 10 000 kr",
        },
        ljud: {
          title: "Sound & light beyond standard",
          sub: "Bigger production — we spec it with you",
          price: "by quote",
        },
        logLegend: "Memories & logistics",
        foto: {
          title: "Photographer",
          sub: "Professional photos from your evening — for internal use & social media",
          price: "from 10 000 kr",
        },
        buss: {
          title: "Bus transport",
          sub: "Pick-up & journey home — we partner with Interbus",
          price: "by quote",
        },
      },
      step5: {
        startLegend: "Preferred start time for the activity",
        customStartAria: "Custom start time",
        orOwnTime: "or your own time",
        timelineLegend: "Sample schedule based on your choices",
        examplePre: "Example — ",
        exampleStart: ", start ",
        timelineFine:
          "Preliminary example — we lock the running order together in the quote. The more of you there are, the more time changing and transitions need.",
        dateLegend: "Dates — we'll come back on availability",
        dateHintDay: "(a weekday, daytime)",
        dateHintWeekeve: "(Monday–Saturday, evening)",
        dateHintFri: "(a Friday or Saturday)",
        date1: "Preferred date *",
        date2: "Alternative date",
        contactLegend: "Contact details",
        nameLbl: "Name *",
        namePh: "First and last name",
        orgLbl: "Company / organisation",
        orgPh: "Company name",
        emailLbl: "Email *",
        emailPh: "name@company.com",
        telLbl: "Phone",
        telPh: "+46 70 000 00 00",
        msgLbl: "Anything else we should know?",
        msgPh: "Allergies, themes, wishes — everything is welcome",
        sending: "Sending…",
        send: "Send your event plan →",
        error: "Something went wrong — try again or email david@thebeach.one",
      },
      sent: {
        title: "Thank you — your event plan is with us!",
        body:
          "We'll get back to you within 24 hours with dates and a quote. Need anything in the meantime? Email david@thebeach.one.",
      },
      aside: {
        title: "Your event",
        pers: "guests",
        inQuote: "In the quote",
        estimate: "Estimate",
        estimateFrom: "Estimate from",
        fine: "Preliminary estimate excl. VAT. The final quote confirms price and content. We reply within 24 hours.",
      },
    },
  },
};
