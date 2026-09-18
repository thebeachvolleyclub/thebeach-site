import type { Dict } from "@/lib/i18n";

/**
 * Ordbok för julbordssidan (/julbord resp. /en/christmas-party).
 * Svenska texterna är källan och bevaras exakt.
 */
export interface JulbordDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: { eyebrow: string; titleTop: string; titleAccent: string; intro: string; cta: string };
  /** Förfrågningslänken — /events?paket=julbord#forfragan (sv) resp. /en/events?paket=julbord#request (en). */
  requestHref: string;
  /** Planeringsverktyget — /events/planera resp. /en/events/planera. */
  plannerHref: string;
  story: string;
  paket: {
    eyebrow: string;
    namn: string;
    pris: string;
    prisSuffix: string;
    ingar: string[];
    menyRubrik: string;
    meny: { rubrik: string; text: string }[];
    fotnot: string;
  };
  exklusivt: { rubrik: string; text: string; villkor: string };
  outro: { text: string; cta: string; ctaPlanera: string };
}

export const julbordDict: Dict<JulbordDict> = {
  sv: {
    meta: {
      title: "Julbord — The Beach | Julfest i sanden",
      description:
        "Byt ut hotellets julbord mot värme, sand och en turnering ingen glömmer. Beach Jul 1 295 kr/person: beachvolleyturnering med instruktör, julbord och två drycker. Säsong november–december i Huddinge.",
      ogTitle: "Julfest i sanden — The Beach",
      ogDescription:
        "Beach Jul: turnering på sanden, julbord i loungen, sommarvärme mitt i vintern. 1 295 kr/person.",
    },
    hero: {
      eyebrow: "Julbord · november–december",
      titleTop: "Julfest i",
      titleAccent: "sanden",
      intro:
        "Byt ut hotellets julbord mot värme, sand och en turnering ingen glömmer. Boka tidigt — fredagarna i december går först.",
      cta: "Be om förslag",
    },
    requestHref: "/events?paket=julbord#forfragan",
    plannerHref: "/events/planera",
    story:
      "Ni kommer när mörkret redan har lagt sig utanför. Innanför dörrarna är det sommar. Skorna av, fötterna i sanden, och en instruktör som sätter upp en beachvolleyturnering där alla är med — från den som aldrig rört en boll till den som spelar varje vecka. Efter 1,5 timme i sanden väntar julbordet i loungen, med utsikt över banorna.",
    paket: {
      eyebrow: "Paketet",
      namn: "Beach Jul",
      pris: "1 295 kr",
      prisSuffix: "per person",
      ingar: [
        "1,5 h beachvolleyturnering med instruktör",
        "Julbord i loungen",
        "2 drycker (öl, vin eller alkoholfritt)",
        "Pris till King & Queen",
      ],
      menyRubrik: "Julbordet",
      meny: [
        { rubrik: "Vid ankomst", text: "Glögg och pepparkakor." },
        {
          rubrik: "Kallt",
          text: "Gravad lax med hovmästarsås, senapssill och löksill, julskinka med grovkornig senap, ägghalvor med räkor, rödbetssallad. Vörtbröd, knäcke och lagrad ost.",
        },
        { rubrik: "Varmt", text: "Ribs med julglaze, köttbullar, Janssons frestelse, rödkål." },
        { rubrik: "Grönt", text: "Grönkålssallad med apelsin och granatäpple, rostade rotfrukter med honung och timjan." },
      ],
      fotnot: "Baren är öppen hela kvällen. Vardagar dagtid: 10 % lägre pris, med julbordet som lunch.",
    },
    exklusivt: {
      rubrik: "Vill ni ha hela arenan för er själva?",
      text: "Fredag och lördag kan arenan bli er — dansgolv, DJ, eldshow och sen bar. Samma turnering och samma julbord, men lokalen är er hela kvällen.",
      villkor: "Från 50 000 kr i ordervärde, i praktiken från cirka 50 personer. Fredagarna i december går först, så hör av er tidigt.",
    },
    outro: {
      text: "10–900 personer · Novavägen 35, Huddinge · Offert inom 24 timmar. Berätta hur många ni är och när ni vill fira, så återkommer vi med upplägg och pris.",
      cta: "Begär offert →",
      ctaPlanera: "Planera ert event",
    },
  },
  en: {
    meta: {
      title: "Christmas Party — The Beach | A Christmas party in the sand",
      description:
        "Swap the hotel Christmas buffet for warmth, sand and a tournament nobody forgets. Beach Jul 1 295 SEK/person: beach volleyball tournament with instructor, Christmas buffet and two drinks. Season November–December in Huddinge.",
      ogTitle: "A Christmas party in the sand — The Beach",
      ogDescription:
        "Beach Jul: a tournament in the sand, a Christmas buffet in the lounge, summer warmth in the middle of winter. 1 295 SEK/person.",
    },
    hero: {
      eyebrow: "Christmas party · November–December",
      titleTop: "A Christmas party in",
      titleAccent: "the sand",
      intro:
        "Swap the hotel Christmas buffet for warmth, sand and a tournament nobody forgets. Book early — the Fridays in December go first.",
      cta: "Ask for a proposal",
    },
    requestHref: "/en/events?paket=julbord#request",
    plannerHref: "/en/events/plan",
    story:
      "You arrive when it's already dark outside. Inside, it's summer. Shoes off, feet in the sand, and an instructor who sets up a beach volleyball tournament where everyone plays — from the person who has never touched a ball to the one who plays every week. After 1.5 hours in the sand, the Christmas buffet is waiting in the lounge, overlooking the courts.",
    paket: {
      eyebrow: "The package",
      namn: "Beach Jul",
      pris: "1 295 SEK",
      prisSuffix: "per person",
      ingar: [
        "1.5 h beach volleyball tournament with instructor",
        "Christmas buffet in the lounge",
        "2 drinks (beer, wine or non-alcoholic)",
        "Prize for King & Queen",
      ],
      menyRubrik: "The Christmas buffet",
      meny: [
        { rubrik: "On arrival", text: "Mulled wine (glögg) and gingerbread." },
        {
          rubrik: "Cold",
          text: "Cured salmon with mustard-dill sauce, two kinds of pickled herring, Christmas ham with coarse mustard, egg halves with shrimp, beetroot salad. Wort bread, crispbread and aged cheese.",
        },
        { rubrik: "Hot", text: "Ribs with Christmas glaze, meatballs, Jansson's temptation, red cabbage." },
        { rubrik: "Greens", text: "Kale salad with orange and pomegranate, roasted root vegetables with honey and thyme." },
      ],
      fotnot: "The bar is open all evening. Weekdays daytime: 10% lower price, with the buffet served as lunch.",
    },
    exklusivt: {
      rubrik: "Want the whole arena to yourselves?",
      text: "On Fridays and Saturdays the arena can be yours — dance floor, DJ, fire show and late bar. Same tournament, same buffet, but the venue is yours all evening.",
      villkor: "From SEK 50,000 in order value, in practice from around 50 people. The Fridays in December go first, so get in touch early.",
    },
    outro: {
      text: "10–900 people · Novavägen 35, Huddinge · Quote within 24 hours. Tell us how many you are and when you want to celebrate, and we'll come back with a proposal and price.",
      cta: "Request a quote →",
      ctaPlanera: "Plan your event",
    },
  },
};
