import type { Dict } from "@/lib/i18n";

/**
 * Ordböcker för företagslandningssidorna (CorporateLanding):
 *   /konferens      → /en/conference
 *   /kickoff        → /en/kickoff
 *   /teambuilding   → /en/team-building
 *   /foretagsevent  → /en/corporate-events
 *   /firmafest      → /en/company-party
 * (/svensexa och /mohippa har svensk målgrupp och ingen engelsk version.)
 *
 * Svenska texterna är källan och bevaras exakt. Priser (745/945/1195/395 kr)
 * och konceptnamnen (Las Palmas/Algarve/Miami) är låsta på båda språken.
 * corporateUi är komponentens delade UI-texter; innehållet per sida ligger i
 * varsin ordbok som ruttfilerna matar in.
 */

export interface CorporateUiDict {
  included: string;
  why: string;
  faq: string;
  ready: string;
  readyBody: string;
  sendRequest: string;
  plan: string;
  seeVenue: string;
}

export interface CorporateContent {
  meta: { title: string; description: string };
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  intro: string;
  lead: string;
  included: string[];
  why: { h: string; p: string }[];
  faqs: { q: string; a: string }[];
}

export const corporateUi: Dict<CorporateUiDict> = {
  sv: {
    included: "Det här ingår",
    why: "Därför The Beach",
    faq: "Vanliga frågor",
    ready: "Redo att boka?",
    readyBody: "Skicka en förfrågan så återkommer vi inom 24 timmar med ett upplägg.",
    sendRequest: "Skicka förfrågan",
    plan: "Planera ert event",
    seeVenue: "Se lokalen",
  },
  en: {
    included: "What's included",
    why: "Why The Beach",
    faq: "Frequently asked questions",
    ready: "Ready to book?",
    readyBody: "Send a request and we'll get back to you within 24 hours with a proposal.",
    sendRequest: "Send a request",
    plan: "Plan your event",
    seeVenue: "See the venue",
  },
};

/** De tre standardkorten under "Därför The Beach" — delas av flera sidor. */
const WHY_SV = [
  { h: "Allt på ett ställe", p: "Aktivitet, mat, dryck och lounge under samma tak — ingen transport mellan moment, ingen logistik för er." },
  { h: "Mitt i Stockholm", p: "Novavägen 35 i Huddinge, 15 min från Stockholm C. 3 000 m² sand och 25°C inne, året runt." },
  { h: "Vi kan stora event", p: "10 till 900 gäster. Lång erfarenhet av komplexa produktioner — inklusive säkerhetsklassade evenemang — utan att tumma på känslan." },
];
const WHY_EN = [
  { h: "Everything in one place", p: "Activity, food, drinks and lounge under one roof — no transport between segments, no logistics for you." },
  { h: "In the middle of Stockholm", p: "Novavägen 35 in Huddinge, 15 min from Stockholm Central. 3,000 m² of sand and 25°C indoors, all year round." },
  { h: "We know big events", p: "10 to 900 guests. Long experience of complex productions — including security-classified events — without compromising the feeling." },
];

export const konferensDict: Dict<CorporateContent> = {
  sv: {
    meta: {
      title: "Konferens i Stockholm — The Beach | Konferens med aktivitet",
      description:
        "Konferens med sand mellan tårna i Huddinge, 15 min från Stockholm. Upp till 3 h möte med projektor + beachvolley, mat och dryck. 10–900 gäster, året runt.",
    },
    eyebrow: "Konferens",
    titleTop: "Konferens med",
    titleAccent: "sand mellan besluten",
    intro: "Möte och aktivitet på samma ställe — konferens med sand mellan tårna, 15 min från Stockholm C.",
    lead:
      "Kör konferensen där energin håller hela dagen. Upp till tre timmars konferens i loungen med projektor och duk, kombinerat med beachvolley, mat och dryck — allt under samma tak i vår inomhusarena. Perfekt för planeringsdagar, kickoffer och ledningskonferenser som ska ge något mer än ett mötesrum.",
    included: [
      "Upp till 3 timmars konferens i loungen",
      "Projektor och projektorduk",
      "Beachvolley med instruktör som aktivitet",
      "Mat och dryck — tapas, buffé eller BBQ",
      "Plats för 10–900 gäster",
      "Konferenstillägg 395 kr/person ovanpå valt eventpaket (Las Palmas 745, Algarve 945, Miami 1195 kr/person)",
    ],
    why: WHY_SV,
    faqs: [
      { q: "Vad kostar en konferens?", a: "Konferenstillägget är 395 kr/person och läggs ovanpå ett eventpaket — Las Palmas 745 kr, Algarve 945 kr eller Miami 1195 kr per person. Företagspriser anges exklusive moms." },
      { q: "Hur många rymmer ni?", a: "Från 10 upp till 900 gäster. Vi anpassar upplägg och yta efter gruppen." },
      { q: "Kan vi ha möte och aktivitet samma dag?", a: "Ja — det är hela poängen. Konferens i loungen och beachvolley i sanden, samma dag, samma ställe." },
      { q: "Finns teknik för presentationer?", a: "Ja, projektor och projektorduk ingår i konferenstillägget. Behöver ni något särskilt, säg till i förfrågan." },
      { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar med ett upplägg. Eller mejla boka@thebeach.one." },
    ],
  },
  en: {
    meta: {
      title: "Conference in Stockholm — The Beach | A conference with activity",
      description:
        "A conference with sand between your toes in Huddinge, 15 min from Stockholm. Up to 3 h of meetings with projector + beach volleyball, food and drinks. 10–900 guests, all year round.",
    },
    eyebrow: "Conference",
    titleTop: "A conference with",
    titleAccent: "sand between the decisions",
    intro: "Meeting and activity in one place — a conference with sand between your toes, 15 min from Stockholm Central.",
    lead:
      "Hold your conference where the energy lasts all day. Up to three hours of conference time in the lounge with projector and screen, combined with beach volleyball, food and drinks — all under one roof in our indoor arena. Perfect for planning days, kickoffs and management conferences meant to deliver more than a meeting room.",
    included: [
      "Up to 3 hours of conference time in the lounge",
      "Projector and projection screen",
      "Beach volleyball with an instructor as the activity",
      "Food and drinks — tapas, buffet or BBQ",
      "Room for 10–900 guests",
      "Conference add-on 395 kr/person on top of your chosen event package (Las Palmas 745, Algarve 945, Miami 1195 kr/person)",
    ],
    why: WHY_EN,
    faqs: [
      { q: "What does a conference cost?", a: "The conference add-on is 395 kr/person and is added on top of an event package — Las Palmas 745 kr, Algarve 945 kr or Miami 1195 kr per person. Corporate prices are excluding VAT." },
      { q: "How many can you host?", a: "From 10 up to 900 guests. We adapt the set-up and space to your group." },
      { q: "Can we have a meeting and an activity on the same day?", a: "Yes — that's the whole point. Conference in the lounge and beach volleyball in the sand, same day, same place." },
      { q: "Is there presentation equipment?", a: "Yes, a projector and projection screen are included in the conference add-on. If you need anything specific, mention it in your request." },
      { q: "How do we book?", a: "Send a request via the form and we'll get back to you within 24 hours with a proposal. Or email boka@thebeach.one." },
    ],
  },
};

export const kickoffDict: Dict<CorporateContent> = {
  sv: {
    meta: {
      title: "Kickoff i Stockholm — The Beach | Kickoff-aktivitet i sanden",
      description:
        "Kickoff som sätter tonen — beachvolley, mat och after beach-känsla i Huddinge, 15 min från Stockholm. Kväll eller dagtid, 10–900 personer, året runt.",
    },
    eyebrow: "Kickoff",
    titleTop: "Kickoff som",
    titleAccent: "sätter tonen",
    intro: "Aktivitet, mat och stämning som får hela gänget med sig — kickoff i sanden, mitt i Stockholm.",
    lead:
      "Starta terminen, projektet eller säsongen med en kickoff folk pratar om efteråt. Beachvolleyturnering med instruktör, mat och dryck, och en riktig after beach-känsla — kväll eller dagtid, 10 till 900 personer. Inga förkunskaper behövs, alla kan vara med från första bollen.",
    included: [
      "1,5 h beachvolleyturnering med instruktör",
      "Mat och dryck — välj nivå (tapas, buffé eller BBQ)",
      "Pris till dagens King & Queen of The Beach",
      "Kväll eller dagtid, vardag eller helg",
      "Plats för 10–900 gäster",
      "Färdiga paket: Las Palmas 745, Algarve 945, Miami 1195 kr/person",
    ],
    why: WHY_SV,
    faqs: [
      { q: "Vad kostar en kickoff?", a: "Färdiga paket från 745 kr/person (Las Palmas). Mest bokat är Algarve, 945 kr/person. Miami 1195 kr/person för helkväll. Exklusive moms för företag." },
      { q: "Behövs förkunskaper i beachvolley?", a: "Nej. En instruktör leder allt och det funkar för nybörjare — poängen är att alla ska med och ha kul." },
      { q: "Kväll eller dagtid?", a: "Båda funkar. Dagtid passar planeringsdagar och kickoffer, kväll blir mer fest och after beach." },
      { q: "Hur många kan vara med?", a: "Från 10 upp till 900 gäster." },
      { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar. Eller mejla boka@thebeach.one." },
    ],
  },
  en: {
    meta: {
      title: "Kickoff in Stockholm — The Beach | A kickoff activity in the sand",
      description:
        "A kickoff that sets the tone — beach volleyball, food and after-beach vibes in Huddinge, 15 min from Stockholm. Evening or daytime, 10–900 people, all year round.",
    },
    eyebrow: "Kickoff",
    titleTop: "A kickoff that",
    titleAccent: "sets the tone",
    intro: "Activity, food and an atmosphere that gets the whole crew on board — a kickoff in the sand, in the middle of Stockholm.",
    lead:
      "Start the term, the project or the season with a kickoff people talk about afterwards. A beach volleyball tournament with an instructor, food and drinks, and a proper after-beach feeling — evening or daytime, 10 to 900 people. No experience needed; everyone can join from the very first serve.",
    included: [
      "1.5 h beach volleyball tournament with an instructor",
      "Food and drinks — choose your level (tapas, buffet or BBQ)",
      "A prize for the day's King & Queen of The Beach",
      "Evening or daytime, weekday or weekend",
      "Room for 10–900 guests",
      "Ready-made packages: Las Palmas 745, Algarve 945, Miami 1195 kr/person",
    ],
    why: WHY_EN,
    faqs: [
      { q: "What does a kickoff cost?", a: "Ready-made packages from 745 kr/person (Las Palmas). The most booked is Algarve, 945 kr/person. Miami 1195 kr/person for a full evening. Excluding VAT for companies." },
      { q: "Do we need beach volleyball experience?", a: "No. An instructor leads everything and it works for beginners — the point is that everyone joins in and has fun." },
      { q: "Evening or daytime?", a: "Both work. Daytime suits planning days and kickoffs; evenings turn into more of a party and after beach." },
      { q: "How many can take part?", a: "From 10 up to 900 guests." },
      { q: "How do we book?", a: "Send a request via the form and we'll get back to you within 24 hours. Or email boka@thebeach.one." },
    ],
  },
};

export const teambuildingDict: Dict<CorporateContent> = {
  sv: {
    meta: {
      title: "Teambuilding i Stockholm — The Beach | Teambuilding inomhus året runt",
      description:
        "Teambuilding som bygger lag på riktigt — beachvolley är samarbete, skratt och lite tävling. Inomhus i Huddinge, 25°C året runt. Inga förkunskaper, 10–900 personer.",
    },
    eyebrow: "Teambuilding",
    titleTop: "Teambuilding",
    titleAccent: "i sanden",
    intro: "Beachvolley är samarbete, skratt och lite tävling — teambuilding som bygger lag på riktigt, inomhus året runt.",
    lead:
      "Inget svetsar ihop ett team som att kämpa, skratta och heja fram varandra i sanden. Instruktörsledd beachvolley som funkar för alla nivåer — nybörjare som vana — kombinerat med mat och dryck. Och eftersom vi är inomhus med 25°C är det lika bra i januari som i juli.",
    included: [
      "Instruktörsledd beachvolley för alla nivåer",
      "Inga förkunskaper — alla kan vara med",
      "Lagindelning och lekfull tävling",
      "Mat och dryck efter önskemål",
      "Inomhus, 25°C, året runt",
      "Plats för 10–900 gäster · paket från 745 kr/person",
    ],
    why: WHY_SV,
    faqs: [
      { q: "Behöver man kunna spela beachvolley?", a: "Nej. En instruktör leder passet och lägger nivån efter gruppen — hela poängen är att alla ska med, oavsett vana." },
      { q: "Funkar det på vintern?", a: "Ja. Vi är inomhus med 25°C året runt — teambuilding i sanden mitt i vintern är en av våra mest uppskattade grejer." },
      { q: "Hur stora grupper tar ni?", a: "Från 10 upp till 900 gäster." },
      { q: "Kan vi kombinera med mat eller konferens?", a: "Ja — lägg till mat och dryck, eller ett konferenstillägg (395 kr/person) om ni vill köra möte samma dag." },
      { q: "Vad kostar det?", a: "Färdiga paket från 745 kr/person (Las Palmas). Skicka en förfrågan så sätter vi ihop ett upplägg." },
    ],
  },
  en: {
    meta: {
      title: "Team Building in Stockholm — The Beach | Indoor team building all year round",
      description:
        "Team building that builds teams for real — beach volleyball is cooperation, laughter and a little competition. Indoors in Huddinge, 25°C all year round. No experience needed, 10–900 people.",
    },
    eyebrow: "Team building",
    titleTop: "Team building",
    titleAccent: "in the sand",
    intro: "Beach volleyball is cooperation, laughter and a little competition — team building that builds teams for real, indoors all year round.",
    lead:
      "Nothing bonds a team like battling, laughing and cheering each other on in the sand. Instructor-led beach volleyball that works for every level — beginners and seasoned players alike — combined with food and drinks. And since we're indoors at 25°C, it's just as good in January as in July.",
    included: [
      "Instructor-led beach volleyball for all levels",
      "No experience needed — everyone can join",
      "Team draw and playful competition",
      "Food and drinks as you wish",
      "Indoors, 25°C, all year round",
      "Room for 10–900 guests · packages from 745 kr/person",
    ],
    why: WHY_EN,
    faqs: [
      { q: "Do you need to know how to play beach volleyball?", a: "No. An instructor leads the session and sets the level to the group — the whole point is that everyone joins in, whatever their experience." },
      { q: "Does it work in winter?", a: "Yes. We're indoors at 25°C all year round — team building in the sand in the middle of winter is one of our most appreciated things." },
      { q: "How big groups do you take?", a: "From 10 up to 900 guests." },
      { q: "Can we combine it with food or a conference?", a: "Yes — add food and drinks, or a conference add-on (395 kr/person) if you want a meeting the same day." },
      { q: "What does it cost?", a: "Ready-made packages from 745 kr/person (Las Palmas). Send a request and we'll put together a proposal." },
    ],
  },
};

export const foretagseventDict: Dict<CorporateContent> = {
  sv: {
    meta: {
      title: "Företagsevent i Stockholm — The Beach | Från AW till storproduktion",
      description:
        "Företagsevent utöver det vanliga — från enkel after work till stora produktioner. Färdiga koncept eller skräddarsytt, 10–900 gäster, i Huddinge 15 min från Stockholm.",
    },
    eyebrow: "Företagsevent",
    titleTop: "Företagsevent",
    titleAccent: "utöver det vanliga",
    intro: "Från enkel after work till stora produktioner — färdiga koncept eller helt skräddarsytt, 10–900 gäster.",
    lead:
      "Oavsett om ni planerar en AW, kickoff, konferens, fest eller ett stort företagsevent har vi ett upplägg som funkar — utan krångel. Färdiga eventkoncept där aktivitet, mat, dryck och stämning sitter från start, eller ett skräddarsytt event byggt kring era behov. Sand mellan tårna, 15 min från Stockholm C.",
    included: [
      "Färdiga koncept: Las Palmas 745, Algarve 945, Miami 1195 kr/person",
      "Konferenstillägg 395 kr/person",
      "Beachvolley med instruktör, mat och dryck",
      "Skräddarsytt för större event och eventbyråer",
      "10–900 gäster, kväll eller dagtid",
      "Erfarenhet av komplexa och säkerhetsklassade event",
    ],
    why: WHY_SV,
    faqs: [
      { q: "Vad kostar ett företagsevent?", a: "Färdiga paket från 745 kr/person (Las Palmas), mest bokat är Algarve 945 kr, och Miami 1195 kr för helkväll. Konferenstillägg +395 kr/person. Större och skräddarsydda event offereras. Exklusive moms." },
      { q: "Hur stora event klarar ni?", a: "Från 10 upp till 900 gäster. Vi har lång erfarenhet av stora produktioner med komplex logistik — inklusive säkerhetsklassade evenemang." },
      { q: "Kan ni skräddarsy?", a: "Ja. Utöver de färdiga paketen bygger vi helt skräddarsydda upplägg för företag och eventbyråer — säg vad ni vill åstadkomma." },
      { q: "Ingår mat och dryck?", a: "Ja, i paketen. Vi skräddarsyr gärna menyer för större sällskap." },
      { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar med ett förslag. Eller mejla boka@thebeach.one." },
    ],
  },
  en: {
    meta: {
      title: "Corporate Events in Stockholm — The Beach | From after work to full-scale productions",
      description:
        "Corporate events beyond the ordinary — from a simple after work to large productions. Ready-made concepts or fully tailored, 10–900 guests, in Huddinge 15 min from Stockholm.",
    },
    eyebrow: "Corporate events",
    titleTop: "Corporate events",
    titleAccent: "beyond the ordinary",
    intro: "From a simple after work to large productions — ready-made concepts or fully tailored, 10–900 guests.",
    lead:
      "Whether you're planning an after work, a kickoff, a conference, a party or a large corporate event, we have a set-up that works — without the hassle. Ready-made event concepts where activity, food, drinks and atmosphere are in place from the start, or a tailor-made event built around your needs. Sand between your toes, 15 min from Stockholm Central.",
    included: [
      "Ready-made concepts: Las Palmas 745, Algarve 945, Miami 1195 kr/person",
      "Conference add-on 395 kr/person",
      "Beach volleyball with an instructor, food and drinks",
      "Tailor-made set-ups for larger events and event agencies",
      "10–900 guests, evening or daytime",
      "Experience of complex and security-classified events",
    ],
    why: WHY_EN,
    faqs: [
      { q: "What does a corporate event cost?", a: "Ready-made packages from 745 kr/person (Las Palmas), the most booked is Algarve at 945 kr, and Miami at 1195 kr for a full evening. Conference add-on +395 kr/person. Larger and tailor-made events are quoted individually. Excluding VAT." },
      { q: "How big events can you handle?", a: "From 10 up to 900 guests. We have long experience of large productions with complex logistics — including security-classified events." },
      { q: "Can you tailor an event?", a: "Yes. Beyond the ready-made packages we build fully tailored set-ups for companies and event agencies — tell us what you want to achieve." },
      { q: "Are food and drinks included?", a: "Yes, in the packages. We're happy to tailor menus for larger groups." },
      { q: "How do we book?", a: "Send a request via the form and we'll get back to you within 24 hours with a proposal. Or email boka@thebeach.one." },
    ],
  },
};

export const firmafestDict: Dict<CorporateContent> = {
  sv: {
    meta: {
      title: "Firmafest i Stockholm — The Beach | Festen på stranden, året runt",
      description:
        "Firmafest med sand mellan tårna — beachvolley, mat, bar och fest i 25 grader, 15 min från Stockholm C. 10–900 gäster, scen och eget kök. Boka i Huddinge.",
    },
    eyebrow: "Firmafest",
    titleTop: "Firmafesten de pratar om",
    titleAccent: "hela året",
    intro: "Byt konferenslokalen mot en strand. Aktivitet, middag, bar och dansgolv under samma tak — mitt i Stockholm, året runt.",
    lead:
      "En firmafest ska kännas — inte bara bockas av. Hos oss börjar kvällen med en beachvolleyturnering där alla kan vara med (shorts i december, ja verkligen), och fortsätter med mat och dryck i loungen, scen för tal eller DJ, och fest så länge ni vill. Samma arena där OS- och VM-guldmedaljörerna tränar, 15 minuter från Stockholm C.",
    included: [
      "1,5 h beachvolleyturnering med instruktör — inga förkunskaper behövs",
      "Mat och dryck — tapas, buffé eller BBQ, eget kök och full bar",
      "Lounge, scen och ljudanläggning för tal, prisutdelning eller DJ",
      "Pris till kvällens King & Queen of The Beach",
      "Plats för 10–900 gäster — hela arenan kan bli er",
      "Färdiga paket: Las Palmas 745, Algarve 945, Miami 1195 kr/person",
    ],
    why: [
      { h: "Allt under samma tak", p: "Aktivitet, middag, bar och fest utan transporter mellan momenten. Ni kommer hit — resten är löst." },
      { h: "Sommar mitt i vintern", p: "3 000 m² sand och 25°C inne, året runt. En firmafest i januari känns som Copacabana." },
      { h: "Vi kan stora fester", p: "10 till 900 gäster, scen, eget kök och lång erfarenhet av stora produktioner — utan att tumma på känslan." },
    ],
    faqs: [
      { q: "Var kan man ha firmafest i Stockholm?", a: "The Beach i Huddinge — en 3 000 m² inomhusstrand 15 minuter från Stockholm C. Beachvolley, middag, bar och fest under samma tak, för 10 till 900 gäster, året runt." },
      { q: "Vad kostar en firmafest?", a: "Färdiga paket från 745 kr/person (Las Palmas). Mest bokat är Algarve, 945 kr/person. Miami 1195 kr/person för helkväll med mer mat och dryck. Priser exklusive moms för företag." },
      { q: "Måste alla spela beachvolley?", a: "Nej. En instruktör leder turneringen och den funkar för alla nivåer — men den som hellre hejar från loungen gör det, med något gott i handen." },
      { q: "Kan vi ha fest för fler än 100 personer?", a: "Ja — arenan tar upp till 900 gäster, med scen och full servering. Vi har producerat allt från 10-personersfester till fullskaliga arrangemang." },
      { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar. Eller mejla boka@thebeach.one." },
    ],
  },
  en: {
    meta: {
      title: "Company Party in Stockholm — The Beach | The party on the beach, all year round",
      description:
        "A company party with sand between your toes — beach volleyball, food, bar and party at 25 degrees, 15 min from Stockholm Central. 10–900 guests, stage and in-house kitchen. Book in Huddinge.",
    },
    eyebrow: "Company party",
    titleTop: "The company party they'll talk about",
    titleAccent: "all year",
    intro: "Swap the conference venue for a beach. Activity, dinner, bar and dance floor under one roof — in the middle of Stockholm, all year round.",
    lead:
      "A company party should be felt — not just ticked off. Here, the evening starts with a beach volleyball tournament where everyone can join (shorts in December — yes, really), and continues with food and drinks in the lounge, a stage for speeches or a DJ, and a party for as long as you like. The same arena where the Olympic and World Championship gold medallists train, 15 minutes from Stockholm Central.",
    included: [
      "1.5 h beach volleyball tournament with an instructor — no experience needed",
      "Food and drinks — tapas, buffet or BBQ, in-house kitchen and a full bar",
      "Lounge, stage and sound system for speeches, prize-giving or a DJ",
      "A prize for the evening's King & Queen of The Beach",
      "Room for 10–900 guests — the whole arena can be yours",
      "Ready-made packages: Las Palmas 745, Algarve 945, Miami 1195 kr/person",
    ],
    why: [
      { h: "Everything under one roof", p: "Activity, dinner, bar and party without transport between segments. You get here — the rest is sorted." },
      { h: "Summer in the middle of winter", p: "3,000 m² of sand and 25°C indoors, all year round. A company party in January feels like Copacabana." },
      { h: "We know big parties", p: "10 to 900 guests, a stage, our own kitchen and long experience of large productions — without compromising the feeling." },
    ],
    faqs: [
      { q: "Where can you have a company party in Stockholm?", a: "The Beach in Huddinge — a 3,000 m² indoor beach 15 minutes from Stockholm Central. Beach volleyball, dinner, bar and party under one roof, for 10 to 900 guests, all year round." },
      { q: "What does a company party cost?", a: "Ready-made packages from 745 kr/person (Las Palmas). The most booked is Algarve, 945 kr/person. Miami 1195 kr/person for a full evening with more food and drinks. Prices excluding VAT for companies." },
      { q: "Does everyone have to play beach volleyball?", a: "No. An instructor leads the tournament and it works for all levels — but anyone who'd rather cheer from the lounge can do just that, with something nice in hand." },
      { q: "Can we have a party for more than 100 people?", a: "Yes — the arena takes up to 900 guests, with a stage and full service. We've produced everything from 10-person parties to full-scale events." },
      { q: "How do we book?", a: "Send a request via the form and we'll get back to you within 24 hours. Or email boka@thebeach.one." },
    ],
  },
};
