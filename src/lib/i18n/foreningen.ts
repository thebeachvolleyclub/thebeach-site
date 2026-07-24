import type { Dict } from "@/lib/i18n";

export interface ForeningenDict {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title1: string; titleAccent: string; intro: string; cta: string };
  medlem: {
    eyebrow: string; title1: string; title2: string; intro: string; cta: string;
    fine1: string; fine2: string;
    formaner: string[];
  };
  tavla: {
    eyebrow: string; title1: string; title2: string;
    c1title: string; c1body1: string; c1email: string; c1body2: string; c1fine: string;
    c2title: string; c2body: string; c2link: string; c2href: string;
    sbt: { n: string; d: string }[];
    footer: string;
  };
  ungdom: {
    eyebrow: string; title1: string; title2: string; body: string; cta: string;
    histEyebrow: string; histBody: string;
  };
}

export const foreningenDict: Dict<ForeningenDict> = {
  sv: {
    meta: {
      title: "Föreningen — The Beach Volley Club | Bli medlem & våga börja tävla",
      description:
        "Bli medlem i The Beach Volley Club för 350 kr/år (junior 190 kr): billigare banhyra, medlemsevent, gratis licensregistrering — och stötta ungdomsverksamheten. Så tar du steget till din första turnering.",
    },
    hero: {
      eyebrow: "The Beach Volley Club",
      title1: "Klubben för dig som", titleAccent: "vill mer",
      intro: "Föreningen är hjärtat i The Beach — ungdomarna, tävlingsspelarna och alla däremellan. Som medlem får du förmåner och är samtidigt med och bygger svensk beachvolleys framtid, på samma sand som OS-guldmedaljörerna.",
      cta: "Bli medlem — 350 kr/år",
    },
    medlem: {
      eyebrow: "Medlemskap", title1: "Därför ska du", title2: "bli medlem",
      intro: "350 kr per kalenderår — 190 kr för juniorer. Alla är välkomna: nybörjare, motionär eller på väg mot toppen. Medlemskapet tecknas via MATCHi och gäller direkt.",
      cta: "Bli medlem via MATCHi →",
      fine1: "Klubbens Swish (endast när det anges): 123 351 1474 · Bankgiro: 5124-1545. Turneringsavgifter betalas via ",
      fine2: ". Klubben hette tidigare 08 Beachvolley Club — namnbytet till The Beach Volley Club är registrerat hos Svenska Volleybollförbundet och Riksidrottsförbundet.",
      formaner: [
        "Billigare banhyra — perfekt om du vill spela mer",
        "Rabatterade priser på aktiviteter och träning (idag junior & ungdom)",
        "Medlemsexklusiva event, aktiviteter och erbjudanden",
        "Gratis registrering av tävlingslicens — och plats i vårt tävlingsgäng",
        "Du stöttar prisvärd ungdomsträning och bättre villkor för alla spelare",
      ],
    },
    tavla: {
      eyebrow: "Våga börja tävla", title1: "Din första turnering", title2: "är närmare än du tror",
      c1title: "Skaffa licens & klubb",
      c1body1: "För att tävla i Sverige behöver du en tävlingslicens, som utfärdas via en registrerad klubb. Som medlem i The Beach Volley Club ingår licensen — men den registreras inte automatiskt. Mejla ",
      c1email: "rasmus.boden@thebeach.one",
      c1body2: " så fixar vi den.",
      c1fine: "Licensregistreringen sker manuellt och kan ta några dagar — ansök i god tid, inte dagen före anmälningsdeadline.",
      c2title: "Hitta rätt turnering",
      c2body: "Det finns tävlingar för alla nivåer — och det svåraste är att ta första steget. Anmäl dig, utmana dig själv och ha kul. Vi ses i sanden!",
      c2link: "Se kommande turneringar hos oss →", c2href: "/kalender",
      sbt: [
        { n: "SBT 1★", d: "Instegsnivån — nybörjare och rutinerade sida vid sida. Perfekt första turnering. Arrangeras regelbundet här på The Beach." },
        { n: "SBT 2–3★", d: "För dig med lite tävlingsvana som vill utmanas. På 3★-nivån dyker inte sällan landslagsspelare upp." },
        { n: "SBT 4–5★", d: "Sveriges absoluta toppspelare." },
        { n: "Mixed & U19", d: "Avslappnad stämning respektive åldersbaserat — båda arrangeras på The Beach." },
      ],
      footer: "The Beach är en stolt och aktiv del av svensk volleyboll — både damlandslagets förbundskapten Mattias Magnusson och herrarnas Rasmus Jonsson utgår från vår anläggning. Bor du någon annanstans? Vi hjälper dig gärna hitta en klubb nära dig.",
    },
    ungdom: {
      eyebrow: "Ungdom", title1: "Från första nudden", title2: "till U19",
      body: "Barn- och ungdomsträningen leds av utbildade coacher under Måns Björn. Anmälan och info via Svenskalag.",
      cta: "Ungdomsträning",
      histEyebrow: "Klubbhistoria",
      histBody: "Grundad 2006 som Beachhallen BVC i Södertälje. 2016 gick vi ihop med spelarna från Bromma BVC och blev 08 Beachvolley Club — och ja, det var vi som var med och byggde banorna med riktig sand på Gärdet. Idag heter vi The Beach Volley Club, med hela verksamheten samlad under ett tak i Huddinge.",
    },
  },
  en: {
    meta: {
      title: "Membership — The Beach Volley Club | Join & start competing",
      description:
        "Join The Beach Volley Club for SEK 350/year (juniors SEK 190): cheaper court hire, member events, free competition licence registration — and support youth training. Plus how to enter your first tournament.",
    },
    hero: {
      eyebrow: "The Beach Volley Club",
      title1: "The club for those who", titleAccent: "want more",
      intro: "The club is the heart of The Beach — the juniors, the competitive players and everyone in between. As a member you get real perks while helping build the future of Swedish beach volleyball, in the same sand as the Olympic champions.",
      cta: "Become a member — SEK 350/year",
    },
    medlem: {
      eyebrow: "Membership", title1: "Why you should", title2: "become a member",
      intro: "SEK 350 per calendar year — SEK 190 for juniors. Everyone is welcome: beginner, casual player or on your way to the top. Membership is signed up via MATCHi (available in English) and is active immediately.",
      cta: "Join via MATCHi →",
      fine1: "Club Swish (only when stated): 123 351 1474 · Bankgiro: 5124-1545. Tournament fees are paid via ",
      fine2: ". The club was previously named 08 Beachvolley Club — the name change to The Beach Volley Club is registered with the Swedish Volleyball Federation and the Swedish Sports Confederation.",
      formaner: [
        "Cheaper court hire — perfect if you want to play more",
        "Discounted prices on activities and training (currently juniors & youth)",
        "Member-exclusive events, activities and offers",
        "Free competition licence registration — and a place in our competing crew",
        "You support affordable youth training and better conditions for all players",
      ],
    },
    tavla: {
      eyebrow: "Start competing", title1: "Your first tournament", title2: "is closer than you think",
      c1title: "Get a licence & club",
      c1body1: "To compete in Sweden you need a competition licence, issued through a registered club. As a member of The Beach Volley Club the licence is included — but it isn't registered automatically. Email ",
      c1email: "rasmus.boden@thebeach.one",
      c1body2: " and we'll sort it.",
      c1fine: "Licence registration is manual and can take a few days — apply in good time, not the day before the entry deadline.",
      c2title: "Find the right tournament",
      c2body: "There are tournaments for every level — and the hardest part is taking the first step. Sign up, challenge yourself and have fun. See you in the sand!",
      c2link: "See upcoming tournaments here →", c2href: "/en/calendar",
      sbt: [
        { n: "SBT 1★", d: "The entry level — beginners and seasoned players side by side. The perfect first tournament. Held regularly here at The Beach." },
        { n: "SBT 2–3★", d: "For players with some competition experience who want a challenge. At 3★ level, national team players show up more often than you'd think." },
        { n: "SBT 4–5★", d: "Sweden's very best players." },
        { n: "Mixed & U19", d: "Relaxed vibes and age-based play respectively — both held at The Beach." },
      ],
      footer: "The Beach is a proud and active part of Swedish volleyball — both the women's national team head coach Mattias Magnusson and the men's Rasmus Jonsson are based at our facility. Live somewhere else? We're happy to help you find a club near you.",
    },
    ungdom: {
      eyebrow: "Youth", title1: "From first touch", title2: "to U19",
      body: "Kids' and youth training is led by qualified coaches under Måns Björn. Sign-up and info via Svenskalag.",
      cta: "Youth training",
      histEyebrow: "Club history",
      histBody: "Founded in 2006 as Beachhallen BVC in Södertälje. In 2016 we merged with the players of Bromma BVC and became 08 Beachvolley Club — and yes, we helped build the real-sand courts at Gärdet. Today we are The Beach Volley Club, with everything under one roof in Huddinge.",
    },
  },
};
