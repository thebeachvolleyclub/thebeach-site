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
  punkter: { rubrik: string; text: string }[];
  outro: { text: string; cta: string };
}

export const julbordDict: Dict<JulbordDict> = {
  sv: {
    meta: {
      title: "Julbord — The Beach | Julfesten med sand mellan tårna",
      description:
        "Trött på vanliga julbord? Fira med teamet på stranden i Huddinge: beachvolley, julbord och sommarvärme mitt i vintern. Säsong november–december.",
      ogTitle: "Julbord på The Beach",
      ogDescription:
        "Det alternativa julbordet: aktivitet på sanden + julmat och fest. 25 grader varmt i december.",
    },
    hero: {
      eyebrow: "Julbord · november–december",
      titleTop: "Julfest i",
      titleAccent: "25 grader",
      intro:
        "Trött på samma julbord varje år? Ta med teamet till stranden: turnering på sanden, julmat i loungen och sommarkänsla mitt i vintern. Boka tidigt — helgerna går först.",
      cta: "Be om förslag",
    },
    requestHref: "/events?paket=julbord#forfragan",
    punkter: [
      { rubrik: "Aktivitet först", text: "Beachvolleyturnering med instruktör — eller lekar för blandade grupper. Alla kan vara med, i shorts mitt i december." },
      { rubrik: "Sedan julbord", text: "Julmat och dryck serverat i loungen med utsikt över banorna. Vi skräddarsyr menyn efter er grupp." },
      { rubrik: "Hela kvällen", text: "Stanna kvar, spela mer, umgås. Konferensdel och full servering finns — gör det till årets julfest, inte årets transportsträcka." },
    ],
    outro: {
      text:
        "Grupper från 10 till 900 personer. Berätta hur många ni är och när ni vill fira, så kommer vi tillbaka med ett upplägg och pris inom 24 timmar.",
      cta: "Skicka förfrågan →",
    },
  },
  en: {
    meta: {
      title: "Christmas Party — The Beach | The Christmas party with sand between your toes",
      description:
        "Tired of the usual Christmas buffet? Celebrate with your team on the beach in Huddinge: beach volleyball, Christmas food and summer warmth in the middle of winter. Season November–December.",
      ogTitle: "Christmas party at The Beach",
      ogDescription:
        "The alternative Christmas party: activity in the sand + Christmas food and celebration. 25 degrees warm in December.",
    },
    hero: {
      eyebrow: "Christmas party · November–December",
      titleTop: "A Christmas party at",
      titleAccent: "25 degrees",
      intro:
        "Tired of the same Christmas buffet every year? Bring the team to the beach: a tournament in the sand, Christmas food in the lounge and summer vibes in the middle of winter. Book early — the weekends go first.",
      cta: "Ask for a proposal",
    },
    requestHref: "/en/events?paket=julbord#request",
    punkter: [
      { rubrik: "Activity first", text: "A beach volleyball tournament with an instructor — or games for mixed groups. Everyone can join in, in shorts in the middle of December." },
      { rubrik: "Then the Christmas feast", text: "Christmas food and drinks served in the lounge overlooking the courts. We tailor the menu to your group." },
      { rubrik: "All evening", text: "Stay on, play more, hang out. Conference space and full service available — make it the Christmas party of the year, not the transport leg of the year." },
    ],
    outro: {
      text:
        "Groups from 10 to 900 people. Tell us how many you are and when you want to celebrate, and we'll come back with a proposal and price within 24 hours.",
      cta: "Send a request →",
    },
  },
};
