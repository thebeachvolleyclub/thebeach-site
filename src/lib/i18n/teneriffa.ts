import type { Dict } from "@/lib/i18n";

/**
 * Ordbok för Teneriffa-sidan (/teneriffa resp. /en/tenerife) —
 * eventkonceptet för ungdomslag. Låsta fakta: 495 kr/person,
 * 1,5 h turnering med instruktör, pizza & läsk, King & Queen-pris,
 * 10–250 personer, söndagar i mån av plats. Inget om moms.
 */
export interface TeneriffaDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: { eyebrow: string; titleTop: string; titleAccent: string; intro: string; cta: string };
  /** /events?paket=teneriffa#forfragan (sv) resp. /en/events?paket=teneriffa#request (en). */
  requestHref: string;
  photo1: { kicker: string; caption: string; alt: string };
  ingar: { eyebrow: string; rubrik: string; rader: { titel: string; text: string }[] };
  pris: { label: string; pris: string; per: string; text: string; badge: string };
  fakta: { label: string; value: string }[];
  steg: { eyebrow: string; rubrik: string; rader: { titel: string; text: string }[] };
  bilder: { alt: string }[];
  faq: { rubrik: string; rader: { q: string; a: string }[] };
  outro: { rubrik: string; text: string; cta: string };
}

export const teneriffaDict: Dict<TeneriffaDict> = {
  sv: {
    meta: {
      title: "Teneriffa — eventkoncept för ungdomslag | The Beach",
      description:
        "Ta med laget till stranden mitt i Huddinge. 1,5 h beachvolleyturnering med instruktör, pizza och läsk, pris till King & Queen of The Beach. 495 kr/person, 10–250 personer.",
      ogTitle: "Teneriffa — laget i sanden",
      ogDescription:
        "Säsongsstart, säsongsavslut eller lagaktivitet: turnering med instruktör, pizza och läsk. 495 kr/person.",
    },
    hero: {
      eyebrow: "Teneriffa · för ungdomslag",
      titleTop: "Laget",
      titleAccent: "i sanden",
      intro:
        "Ett prisvärt eventkoncept exklusivt för ungdomslag. Turnering med instruktör, pizza och läsk och ett pris till dagens King & Queen — sommarvärme mitt i Huddinge, oavsett väder.",
      cta: "Önska datum",
    },
    requestHref: "/events?paket=teneriffa#forfragan",
    photo1: {
      kicker: "Säsongsstart · säsongsavslut · lagaktivitet",
      caption: "Ingen behöver kunna beachvolley. Alla är med från första bollen.",
      alt: "Ungdomslag samlat med coach i sanden efter turnering",
    },
    ingar: {
      eyebrow: "Det här ingår",
      rubrik: "Allt på ett ställe. Ett pris.",
      rader: [
        { titel: "1,5 h turnering med instruktör", text: "Vår instruktör drar igång, delar upp lagen och håller tempot uppe. Fungerar lika bra för nybörjare som för de som spelat förut." },
        { titel: "Pizza och läsk", text: "Efter turneringen samlas laget i loungen och äter tillsammans. Enkelt, gott och uppskattat." },
        { titel: "King & Queen of The Beach", text: "Dagens bästa spelare koras och får pris. Det blir alltid snack om det på vägen hem." },
        { titel: "Riktig strandsand — inomhus", text: "3 000 kvadratmeter sand under tak, varmt och skönt året runt. Omklädningsrum och all utrustning finns på plats." },
      ],
    },
    pris: {
      label: "Pris",
      pris: "495 kr",
      per: "/person",
      text: "Samma pris för spelare och ledare. Turnering, instruktör, pizza och läsk ingår.",
      badge: "Exklusivt för ungdomslag",
    },
    fakta: [
      { label: "Längd", value: "1,5 h + mat" },
      { label: "Storlek", value: "10–250 personer" },
      { label: "När", value: "Söndagar, i mån av plats" },
      { label: "Var", value: "Novavägen 35, Huddinge" },
    ],
    steg: {
      eyebrow: "Så funkar det",
      rubrik: "Tre steg till lagets bästa dag.",
      rader: [
        { titel: "Önska datum", text: "Skriv vilken söndag ni vill komma och ungefär hur många ni blir. Vi svarar snabbt med vad som är ledigt." },
        { titel: "Vi bekräftar", text: "Ni får en bekräftelse med tid och upplägg. Ändras antalet lite på vägen är det lugnt." },
        { titel: "Kom och spela", text: "Byt om, in i sanden, turnering, pizza och prisutdelning. Vi sköter resten." },
      ],
    },
    bilder: [
      { alt: "Ungdomar firar en vunnen boll i sanden" },
      { alt: "Träningsgrupp med coach på banan" },
      { alt: "Laget samlat i sanden i dagsljus" },
    ],
    faq: {
      rubrik: "Vanliga frågor",
      rader: [
        { q: "Måste vi kunna spela beachvolley?", a: "Nej. Instruktören anpassar turneringen efter gruppen, och reglerna är enkla nog att lära sig på fem minuter." },
        { q: "Kan vi ta med flera lag eller hela föreningen?", a: "Ja, upp till 250 personer. Vi kör turneringen på flera banor parallellt." },
        { q: "Kan ledare och föräldrar vara med?", a: "Ledare spelar gärna med och betalar samma pris. Föräldrar som vill titta är välkomna att hänga i loungen." },
        { q: "Andra dagar än söndag?", a: "Konceptet erbjuds på söndagar i mån av plats. Har ni ett annat önskemål, skriv det i förfrågan så kollar vi." },
        { q: "Vi är ett annat lag än beachvolley — funkar det?", a: "Absolut. Fotboll, handboll, innebandy, hockey — de flesta lag vi tar emot har aldrig spelat beachvolley förut." },
      ],
    },
    outro: {
      rubrik: "Söndagarna går fort.",
      text: "Skriv datum och ungefärligt antal så håller vi tiden åt er.",
      cta: "Önska datum",
    },
  },
  en: {
    meta: {
      title: "Teneriffa — the youth team event | The Beach",
      description:
        "Bring the team to the beach in Huddinge. 1.5 h beach volleyball tournament with an instructor, pizza and soft drinks, King & Queen of The Beach prize. 495 SEK/person, 10–250 people.",
      ogTitle: "Teneriffa — the team in the sand",
      ogDescription:
        "Season kick-off, season finale or a team day out: tournament with instructor, pizza and soft drinks. 495 SEK/person.",
    },
    hero: {
      eyebrow: "Teneriffa · for youth teams",
      titleTop: "The team",
      titleAccent: "in the sand",
      intro:
        "An affordable event concept exclusively for youth teams. Tournament with instructor, pizza and soft drinks, and a prize for the day's King & Queen — summer warmth in the middle of Huddinge, whatever the weather.",
      cta: "Request a date",
    },
    requestHref: "/en/events?paket=teneriffa#request",
    photo1: {
      kicker: "Season kick-off · season finale · team day",
      caption: "Nobody needs to know beach volleyball. Everyone's in from the first ball.",
      alt: "Youth team gathered with their coach in the sand after a tournament",
    },
    ingar: {
      eyebrow: "What's included",
      rubrik: "Everything in one place. One price.",
      rader: [
        { titel: "1.5 h tournament with instructor", text: "Our instructor gets things going, splits the teams and keeps the tempo up. Works just as well for beginners as for players." },
        { titel: "Pizza and soft drinks", text: "After the tournament the team gathers in the lounge and eats together. Simple, tasty, always a hit." },
        { titel: "King & Queen of The Beach", text: "The best players of the day are crowned and get a prize. It's all they'll talk about on the way home." },
        { titel: "Real beach sand — indoors", text: "3,000 square metres of sand under one roof, warm all year round. Changing rooms and all equipment on site." },
      ],
    },
    pris: {
      label: "Price",
      pris: "495 SEK",
      per: "/person",
      text: "Same price for players and coaches. Tournament, instructor, pizza and soft drinks included.",
      badge: "Youth teams only",
    },
    fakta: [
      { label: "Length", value: "1.5 h + food" },
      { label: "Group size", value: "10–250 people" },
      { label: "When", value: "Sundays, subject to availability" },
      { label: "Where", value: "Novavägen 35, Huddinge" },
    ],
    steg: {
      eyebrow: "How it works",
      rubrik: "Three steps to the team's best day.",
      rader: [
        { titel: "Request a date", text: "Tell us which Sunday you'd like and roughly how many you are. We reply quickly with what's available." },
        { titel: "We confirm", text: "You get a confirmation with time and set-up. If the headcount shifts a little, no problem." },
        { titel: "Come and play", text: "Change, into the sand, tournament, pizza and prize ceremony. We handle the rest." },
      ],
    },
    bilder: [
      { alt: "Young players celebrating a won rally in the sand" },
      { alt: "Training group with coach on the court" },
      { alt: "The team gathered in the sand in daylight" },
    ],
    faq: {
      rubrik: "Common questions",
      rader: [
        { q: "Do we need to know how to play beach volleyball?", a: "No. The instructor adapts the tournament to the group, and the rules take five minutes to learn." },
        { q: "Can we bring several teams or the whole club?", a: "Yes, up to 250 people. We run the tournament on several courts in parallel." },
        { q: "Can coaches and parents join?", a: "Coaches are welcome to play at the same price. Parents who want to watch can hang out in the lounge." },
        { q: "Other days than Sunday?", a: "The concept is offered on Sundays, subject to availability. Have another wish? Put it in the request and we'll check." },
        { q: "We're not a beach volleyball team — does it work?", a: "Absolutely. Football, handball, floorball, hockey — most teams we host have never played beach volleyball before." },
      ],
    },
    outro: {
      rubrik: "Sundays go fast.",
      text: "Send us a date and a rough headcount and we'll hold the slot for you.",
      cta: "Request a date",
    },
  },
};
