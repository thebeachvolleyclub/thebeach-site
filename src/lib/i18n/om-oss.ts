import type { Dict } from "@/lib/i18n";

export interface OmOssDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: { eyebrow: string; titleTop: string; titleAccent: string; intro: string; cta: string; ctaHref: string };
  resan: { eyebrow: string; title: string; milstolpar: { ar: string; text: string }[] };
  /** "Så hänger det ihop" — idrotten och eventen, mellan Resan och Teamet. */
  motorer: { eyebrow: string; title: string; text: string; cta: string; ctaHref: string };
  team: {
    eyebrow: string;
    title1: string;
    title2: string;
    personer: { namn: string; roll: string; desc: string; kontakt: string; tel?: string; telHref?: string; notis?: string }[];
  };
  hitta: { sectionId: string; eyebrow: string; title1: string; title2: string; text: string; mapsCta: string };
  kontakt: { eyebrow: string; rader: { label: string; value: string; href: string }[] };
}

export const omOssDict: Dict<OmOssDict> = {
  sv: {
    meta: {
      title: "Om oss — The Beach | Beachvolleybollens hem i Stockholm",
      description:
        "Startade 2006 för att kunna spela beachvolley året runt. Idag: 3 000 kvm arena i Huddinge, träningsbas för landslaget och hem för ett community på 800 spelare i veckan.",
      ogTitle: "Om oss — The Beach",
      ogDescription:
        "Historien, teamet och vägen hit. The Beach — beachvolleybollens hem i Stockholm sedan 2006.",
    },
    hero: {
      eyebrow: "Om oss",
      titleTop: "Byggt av spelare,",
      titleAccent: "för spelare",
      intro:
        "Vi startade The Beach 2006 för att kunna spela beachvolley året runt. Målet har aldrig ändrats: världens bästa förutsättningar för alla som vill spela — från första bollkontakt till OS-guld. Idrotten är kärnan. Eventen och företagen som väljer oss är det som gör den möjlig.",
      cta: "Kontakta oss",
      ctaHref: "#kontakt",
    },
    resan: {
      eyebrow: "Resan",
      title: "20 år av sommar",
      milstolpar: [
        { ar: "2006", text: "The Beach öppnar i Södertälje — för att vi ville spela beachvolley året runt." },
        { ar: "2011", text: "BeachTravels startar: träningsresor till världens finaste stränder." },
        { ar: "2022", text: "Nybyggd anläggning i Huddinge invigs — 3 000 kvm, 10 banor inomhus, 7 utomhus." },
        { ar: "2024", text: "Åhman/Hellvig — som tränar på The Beach — tar OS-guld i Paris." },
        { ar: "2025", text: "Helsvensk VM-final i Adelaide. Båda lagen tränar här vintertid." },
        { ar: "2026", text: "Utsedda till Årets Företagare i Huddinge. Resan fortsätter." },
      ],
    },
    motorer: {
      eyebrow: "Så hänger det ihop",
      title: "En anläggning, två motorer",
      text: "800 spelare i veckan, en förening med en stor barn- och ungdomsverksamhet, landslaget som tränar här på vintrarna. Det är The Beach på vardagarna. På fredagar och lördagar blir samma sand en eventarena för upp till 900 gäster. Det ena finansierar det andra: utan eventen inga låga ungdomspriser, utan idrotten ingen plats värd att fira på. Många av eventen bokas av företag där någon som spelar här — eller vars barn gör det — tipsat sin arbetsplats. Det är vi stolta över.",
      cta: "Boka event →",
      ctaHref: "/events",
    },
    team: {
      eyebrow: "Teamet",
      title1: "Människorna bakom",
      title2: "sanden",
      personer: [
        {
          namn: "David Cabrera",
          roll: "VD & medgrundare",
          desc: "Event, affärer och det mesta bakom kulisserna.",
          kontakt: "david@thebeach.one",
        },
        {
          namn: "Mattias Magnusson",
          roll: "Sportchef & medgrundare",
          desc: "Träningsgrupper, kurser och tränarstaben. Trefaldig svensk mästare och Coach of the Year.",
          kontakt: "mattias@thebeach.one",
          tel: "0733-66 54 33 (helst SMS)",
          telHref: "tel:+46733665433",
        },
        {
          namn: "Jeybee Ahlkoury",
          roll: "Hallansvarig",
          desc: "Reception och daglig drift i anläggningen.",
          kontakt: "jb@thebeach.one",
          notis: "Pappaledig just nu.",
        },
        {
          namn: "Måns Björn",
          roll: "Barn- & ungdomsansvarig",
          desc: "Allt som rör barn- och ungdomsträningen — från första bollkontakt till U19.",
          kontakt: "mans@thebeach.one",
        },
        {
          namn: "Rasmus Boden",
          roll: "Verksamhetsutvecklare & tränare",
          desc: "Utvecklar verksamheten, tränar och håller i turneringar och seriespel.",
          kontakt: "rasmus.boden@thebeach.one",
        },
        {
          namn: "Rasmus Jonsson",
          roll: "VD BeachTravels",
          desc: "Leder vårt dotterbolag som arrangerar träningsresor — och är förbundskapten för herrlandslaget.",
          kontakt: "rasmus@beachtravels.se",
        },
      ],
    },
    hitta: {
      sectionId: "kontakt",
      eyebrow: "Hitta hit",
      title1: "15 min från",
      title2: "Stockholm C",
      text:
        "Novavägen 35, 141 44 Huddinge. Pendeltåg till Flemingsberg eller Stuvsta och en kort promenad — eller bil med gott om parkering direkt vid hallen.",
      mapsCta: "Öppna i Google Maps",
    },
    kontakt: {
      eyebrow: "Kontakt",
      rader: [
        { label: "Bokningar & event", value: "boka@thebeach.one", href: "mailto:boka@thebeach.one" },
        { label: "Företag & partnerskap", value: "david@thebeach.one", href: "mailto:david@thebeach.one" },
        { label: "Jobba hos oss", value: "Skicka din ansökan →", href: "mailto:boka@thebeach.one?subject=Jobba%20hos%20oss" },
      ],
    },
  },
  en: {
    meta: {
      title: "About us — The Beach Stockholm",
      description:
        "Founded in 2006 to play beach volleyball all year round. Today: a 3,000 m² arena in Huddinge, training base of Olympic champions and home to 800 weekly players.",
      ogTitle: "About us — The Beach",
      ogDescription:
        "The story, the team and the road here. The Beach — the home of beach volleyball in Stockholm since 2006.",
    },
    hero: {
      eyebrow: "About us",
      titleTop: "Built by players,",
      titleAccent: "for players",
      intro:
        "We started The Beach in 2006 to play beach volleyball all year round. The goal has never changed: the best conditions in the world for anyone who wants to play — from the first touch of the ball to Olympic gold. Sport is the core. The events and the companies that choose us are what make it possible.",
      cta: "Contact us",
      ctaHref: "#kontakt",
    },
    resan: {
      eyebrow: "The journey",
      title: "20 years of summer",
      milstolpar: [
        { ar: "2006", text: "The Beach opens in Södertälje — because we wanted to play beach volleyball all year round." },
        { ar: "2011", text: "BeachTravels launches: training camps on the world's finest beaches." },
        { ar: "2022", text: "Our purpose-built arena in Huddinge opens — 3,000 m², 10 indoor courts, 7 outdoor." },
        { ar: "2024", text: "Åhman/Hellvig — who train at The Beach — win Olympic gold in Paris." },
        { ar: "2025", text: "An all-Swedish World Championship final in Adelaide. Both teams train here in winter." },
        { ar: "2026", text: "Named Entrepreneur of the Year in Huddinge. The journey continues." },
      ],
    },
    motorer: {
      eyebrow: "How it fits together",
      title: "One venue, two engines",
      text: "800 players a week, a club with a large kids' and youth programme, the national team training here in winter. That is The Beach on weekdays. On Fridays and Saturdays the same sand becomes an event arena for up to 900 guests. One funds the other: without the events, no low youth prices; without the sport, no place worth celebrating in. Many of the events are booked by companies where someone who plays here — or whose child does — put the idea to their workplace. That makes us proud.",
      cta: "Book an event →",
      ctaHref: "/en/events",
    },
    team: {
      eyebrow: "The team",
      title1: "The people behind",
      title2: "the sand",
      personer: [
        {
          namn: "David Cabrera",
          roll: "CEO & co-founder",
          desc: "Events, partnerships and most things behind the scenes.",
          kontakt: "david@thebeach.one",
        },
        {
          namn: "Mattias Magnusson",
          roll: "Sports director & co-founder",
          desc: "Training groups, courses and the coaching staff. Three-time Swedish champion, Coach of the Year.",
          kontakt: "mattias@thebeach.one",
          tel: "+46 733 66 54 33 (SMS preferred)",
          telHref: "tel:+46733665433",
        },
        {
          namn: "Jeybee Ahlkoury",
          roll: "Facility manager",
          desc: "Reception and day-to-day operations in the venue.",
          kontakt: "jb@thebeach.one",
          notis: "Currently on parental leave.",
        },
        {
          namn: "Måns Björn",
          roll: "Head of youth",
          desc: "Everything kids & youth — from first touch to U19.",
          kontakt: "mans@thebeach.one",
        },
        {
          namn: "Rasmus Boden",
          roll: "Business developer & coach",
          desc: "Develops the operation, coaches, and runs tournaments and league play.",
          kontakt: "rasmus.boden@thebeach.one",
        },
        {
          namn: "Rasmus Jonsson",
          roll: "CEO, BeachTravels",
          desc: "Leads our subsidiary that runs training camps abroad — and is head coach of the Swedish men's national team.",
          kontakt: "rasmus@beachtravels.se",
        },
      ],
    },
    hitta: {
      sectionId: "kontakt",
      eyebrow: "Getting here",
      title1: "15 minutes from",
      title2: "Stockholm Central",
      text:
        "Novavägen 35, 141 44 Huddinge. Commuter rail to Flemingsberg or Stuvsta and a short walk — or drive, with plenty of parking right outside.",
      mapsCta: "Open in Google Maps",
    },
    kontakt: {
      eyebrow: "Contact",
      rader: [
        { label: "Bookings & events", value: "boka@thebeach.one", href: "mailto:boka@thebeach.one" },
        { label: "Corporate & partnerships", value: "david@thebeach.one", href: "mailto:david@thebeach.one" },
        { label: "Work with us", value: "Send your application →", href: "mailto:boka@thebeach.one?subject=Work%20with%20us" },
      ],
    },
  },
};
