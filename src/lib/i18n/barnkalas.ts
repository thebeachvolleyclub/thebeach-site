import type { Dict } from "@/lib/i18n";

/**
 * Ordbok för barnkalassidan (/barnkalas resp. /en/kids-party).
 * Svenska texterna är källan och bevaras exakt. Priserna (450/350/100 kr)
 * är låsta och identiska på båda språken.
 */
export interface BarnkalasDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: { eyebrow: string; titleTop: string; titleAccent: string; intro: string; cta: string };
  /** /events?paket=barnkalas#forfragan (sv) resp. /en/events?paket=barnkalas#request (en). */
  requestHref: string;
  fakta: { rubrik: string; rader: string[] }[];
  pris: {
    med: { label: string; pris: string; per: string; text: string };
    utan: { label: string; pris: string; per: string; text: string };
  };
  outro: { text: string; cta: string };
}

export const barnkalasDict: Dict<BarnkalasDict> = {
  sv: {
    meta: {
      title: "Barnkalas — The Beach | Aktivt kalas med sand mellan tårna",
      description:
        "Fira födelsedagen på stranden mitt i Huddinge. 2 timmar med lek, beachvolley eller beachfotboll + pizza och firande i loungen. Från 350 kr/barn.",
      ogTitle: "Barnkalas på The Beach",
      ogDescription:
        "Aktivt barnkalas 6–11 år: spel på sanden + pizza i loungen. Lördagar & söndagar. Från 350 kr/barn.",
    },
    hero: {
      eyebrow: "Barnkalas",
      titleTop: "Kalaset de pratar om",
      titleAccent: "hela terminen",
      intro:
        "Sand mellan tårna, rörelse och glädje. Barnen leker och spelar på riktig strandsand — och avslutar med pizza och firande i vår lounge. Tryggt för föräldrar, oförglömligt för barnen.",
      cta: "Boka kalas",
    },
    requestHref: "/events?paket=barnkalas#forfragan",
    fakta: [
      { rubrik: "För vem?", rader: ["Rekommenderad ålder ca 6–11 år", "Alla kan vara med — inga förkunskaper", "Perfekt för barn som gillar rörelse"] },
      { rubrik: "När?", rader: ["Lördagar 09.00–11.00", "Söndagar 09.00–11.00", "Söndagar 10.30–12.30"] },
      { rubrik: "Upplägg — 2 h totalt", rader: ["60–90 min aktivitet på banan", "30–60 min mat & firande i loungen", "Tempot anpassas efter gruppen"] },
      { rubrik: "Ingår", rader: ["Halv pizza per barn", "Trocadero eller Cuba-Cola", "Bollar, utrustning, omklädningsrum"] },
    ],
    pris: {
      med: {
        label: "Med instruktör",
        pris: "450 kr",
        per: "/barn",
        text:
          "Vår personal leder och anpassar aktiviteten — lek, beachvolley eller beachfotboll/footvolley för de fotbollstokiga.",
      },
      utan: {
        label: "Utan instruktör",
        pris: "350 kr",
        per: "/barn",
        text:
          "En förälder leder aktiviteten. Extra timme i loungen: 100 kr/barn. Vill ni dekorera eller ta med egen tårta? Vi hjälper gärna till.",
      },
    },
    outro: {
      text: "Skicka en förfrågan med önskat datum så återkommer vi inom 24 timmar och skräddarsyr kalaset.",
      cta: "Skicka förfrågan →",
    },
  },
  en: {
    meta: {
      title: "Kids' Party — The Beach | An active party with sand between the toes",
      description:
        "Celebrate the birthday on the beach in Huddinge. 2 hours of games, beach volleyball or beach football + pizza and celebration in the lounge. From 350 kr/child.",
      ogTitle: "Kids' party at The Beach",
      ogDescription:
        "An active kids' party for ages 6–11: games in the sand + pizza in the lounge. Saturdays & Sundays. From 350 kr/child.",
    },
    hero: {
      eyebrow: "Kids' party",
      titleTop: "The party they'll talk about",
      titleAccent: "all term",
      intro:
        "Sand between the toes, movement and joy. The kids play and compete on real beach sand — and finish with pizza and celebration in our lounge. Reassuring for parents, unforgettable for the kids.",
      cta: "Book a party",
    },
    requestHref: "/en/events?paket=barnkalas#request",
    fakta: [
      { rubrik: "Who is it for?", rader: ["Recommended age approx. 6–11", "Everyone can join — no experience needed", "Perfect for kids who love to move"] },
      { rubrik: "When?", rader: ["Saturdays 09.00–11.00", "Sundays 09.00–11.00", "Sundays 10.30–12.30"] },
      { rubrik: "The set-up — 2 h in total", rader: ["60–90 min of activity on the court", "30–60 min of food & celebration in the lounge", "The pace is adapted to the group"] },
      { rubrik: "Included", rader: ["Half a pizza per child", "Trocadero or Cuba-Cola", "Balls, equipment, changing rooms"] },
    ],
    pris: {
      med: {
        label: "With instructor",
        pris: "450 kr",
        per: "/child",
        text:
          "Our staff lead and adapt the activity — games, beach volleyball, or beach football/footvolley for the football-mad.",
      },
      utan: {
        label: "Without instructor",
        pris: "350 kr",
        per: "/child",
        text:
          "A parent leads the activity. Extra hour in the lounge: 100 kr/child. Want to decorate or bring your own cake? We're happy to help.",
      },
    },
    outro: {
      text: "Send a request with your preferred date and we'll get back to you within 24 hours and tailor the party to you.",
      cta: "Send a request →",
    },
  },
};
