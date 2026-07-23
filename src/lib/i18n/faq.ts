import type { Dict } from "@/lib/i18n";

export interface FaqDict {
  meta: { title: string; description: string };
  hero: { eyebrow: string; titleTop: string; titleAccent: string; intro: string };
  items: { q: string; a: string }[];
}

export const faqDict: Dict<FaqDict> = {
  sv: {
    meta: {
      title: "Vanliga frågor — The Beach",
      description:
        "Allt du undrar inför besöket: bokning, utrustning, duschar, parkering, mat och priser. Hittar du inte svaret? Mejla boka@thebeach.one.",
    },
    hero: {
      eyebrow: "FAQ",
      titleTop: "Vanliga",
      titleAccent: "frågor",
      intro:
        "Snabba svar inför besöket. Hittar du inte det du letar efter? Mejla boka@thebeach.one så svarar vi inom 24 timmar.",
    },
    items: [
      { q: "Hur bokar jag en bana?", a: "Banor bokas via vår [boka bana-sida](/boka). Ett vanligt pass är 1,5 timme. Event, skolbesök och grupper bokas via förfrågningsformuläret eller boka@thebeach.one." },
      { q: "Jag har aldrig spelat — kan jag ändå komma?", a: "Absolut. Grundkursen är byggd för nybörjare, och på prova-på-tillfällen och event behövs inga förkunskaper alls. Ta bara med träningskläder." },
      { q: "Vad behöver jag ta med?", a: "Bara dig själv och träningskläder. Bollar, nät och allt material finns på plats. Man spelar barfota i sanden — året runt, det är alltid varmt inne." },
      { q: "Finns duschar och omklädningsrum?", a: "Ja — 14 duschar och omklädningsrum finns i anläggningen." },
      { q: "Hur tar jag mig hit?", a: "Novavägen 35, 141 44 Huddinge. Pendeltåg till Flemingsberg eller Stuvsta och kort promenad, eller bil — det finns gott om parkering direkt vid hallen." },
      { q: "Finns det mat och dryck?", a: "Ja, vi har servering i loungen. För event ingår mat i paketen (Las Palmas, Algarve, Miami) och vi skräddarsyr gärna menyer för större sällskap." },
      { q: "Vad kostar ett event?", a: "Färdiga paket från 745 kr/person (Las Palmas). Mest bokad är Algarve, 945 kr/person. Konferenstillägg +395 kr/person. Företagspriser anges exklusive moms." },
      { q: "Kan barn spela hos er?", a: "Ja — vi har barn- och ungdomsträning, barnkalas (6–11 år) och tar emot skolklasser på vardagar. Se sidorna [Barnkalas](/barnkalas) och [Skolor](/skola)." },
      { q: "Hur avbokar jag träning eller kurs?", a: "Det beror på vad du vill avboka. Kurs (grund- eller fortsättningskurs): mejla boka@thebeach.one så snart du kan — kan din plats fyllas av någon annan får du behålla värdet tillgodo till nästa kursstart, och avbokar du i god tid innan kursen börjar krediterar vi dig. Träningsgrupp: då gäller villkoren du godkände i anmälan — läs [avanmälan & villkor](/avanmalan) och gör din avanmälan via formuläret där. Banbokning: avbokas direkt i MATCHi." },
      { q: "Jag är med i en träningsgrupp och är inte nöjd med gruppen. Hur går jag vidare?", a: "Fyll i en ändringsanmälan så jobbar vi på saken så snabbt vi kan. Känner du dig fel placerad nivåmässigt — prata först med din tränare efter passet och hör vad de tycker. Undvik att mejla bokningen eller hälsa via receptionen; det blir lätt missförstånd. Du behåller din plats tills något annat bestämts och meddelats skriftligt. Läs mer och gör din [ändringsanmälan](/andringsanmalan)." },
    ],
  },
  en: {
    meta: {
      title: "FAQ — The Beach",
      description:
        "Quick answers before your visit: booking, gear, showers, parking, food and prices. Can't find it? Email boka@thebeach.one.",
    },
    hero: {
      eyebrow: "FAQ",
      titleTop: "Frequently asked",
      titleAccent: "questions",
      intro:
        "Quick answers before your visit. Can't find what you're looking for? Email boka@thebeach.one and we'll reply within 24 hours.",
    },
    items: [
      { q: "How do I book a court?", a: "Courts are booked via our [book a court page](/en/book). A standard session is 1.5 hours. Events, school visits and groups are booked via the request form or boka@thebeach.one." },
      { q: "I've never played — can I still come?", a: "Absolutely. The beginner course is built for first-timers, and try-out sessions and events need no experience at all. Just bring workout clothes." },
      { q: "What do I need to bring?", a: "Just yourself and workout clothes. Balls, nets and all equipment are here. You play barefoot in the sand — all year round, it's always warm inside." },
      { q: "Are there showers and changing rooms?", a: "Yes — 14 showers and changing rooms on site." },
      { q: "How do I get there?", a: "Novavägen 35, 141 44 Huddinge. Commuter train to Flemingsberg or Stuvsta and a short walk, or by car — there's plenty of parking right by the hall." },
      { q: "Is there food and drink?", a: "Yes, there's a café and bar in the lounge. For events, food is included in the packages (Las Palmas, Algarve, Miami) and we're happy to tailor menus for larger groups." },
      { q: "What does an event cost?", a: "Ready-made packages from 745 SEK/person (Las Palmas). The most booked is Algarve, 945 SEK/person. Conference add-on +395 SEK/person. Corporate prices are excl. VAT." },
      { q: "Can children play?", a: "Yes — we run kids' and youth training, kids' parties (ages 6–11) and welcome school classes on weekdays. See [Schools](/en/school)." },
      { q: "How do I cancel training or a course?", a: "It depends what you want to cancel. Course (beginner or intermediate): email boka@thebeach.one as soon as you can — if your spot can be filled by someone else you keep the value as credit for the next course, and if you cancel in good time before it begins we credit you. Training group: the terms you accepted at registration apply — read [cancellation & terms](/avanmalan) and cancel via the form there. Court booking: cancel directly in MATCHi." },
      { q: "I'm in a training group and not happy with it. What do I do?", a: "Fill in a change request and we'll work on it as fast as we can. If you feel you're placed at the wrong level, talk to your coach after practice first. Avoid emailing the front desk or mentioning it in passing — it easily leads to misunderstandings. You keep your spot until something else is decided and confirmed in writing. Read more and file your [change request](/andringsanmalan)." },
    ],
  },
};
