import type { Dict } from "@/lib/i18n";

/**
 * Ordbok för hållbarhetssidan (/hallbarhet resp. /en/sustainability).
 * Svenska texterna är källan och bevaras exakt. Siffrorna (72 kW, ~290 kWh,
 * 443 medlemmar osv.) är låsta och identiska på båda språken.
 * OBS faktaregeln: "en av Sveriges största" — aldrig "Sveriges största".
 */
export interface HallbarhetDict {
  meta: { title: string; description: string };
  hero: { eyebrow: string; titlePre: string; titleAccent: string; titlePost: string; intro: string; cta: string };
  /** /events#forfragan (sv) resp. /en/events#request (en). */
  requestHref: string;
  miljo: { eyebrow: string; title: string; body: string };
  socialt: { eyebrow: string; title: string; body: string };
  grundare: { eyebrow: string; title: string; body: string; award: string; fotoAlt: string; logoAlt: string };
  cta: { title: string; body: string; button: string };
}

export const hallbarhetDict: Dict<HallbarhetDict> = {
  sv: {
    meta: {
      title: "Hållbarhet — The Beach | Soldriven beacharena i Huddinge",
      description:
        "Solen driver arenan, rörelsen driver människorna. The Beach körs till stor del på egen sol (72 kW + ~290 kWh batteri), och är en av Sveriges största beachvolleyklubbar. Hållbarhet vi mäter och visar — inte påstår.",
    },
    hero: {
      eyebrow: "Hållbarhet",
      titlePre: "Vi ger ",
      titleAccent: "energi",
      titlePost: " — på riktigt",
      intro:
        "Solen driver arenan. Rörelsen driver människorna. Hållbarhet hos oss är inget vi säger — det är något vi mäter och visar.",
      cta: "Boka ett event",
    },
    requestHref: "/events#forfragan",
    miljo: {
      eyebrow: "Miljö",
      title: "Vi driver arenan på solen",
      body:
        "På taket sitter en solpark på 72 kW och ett batteri på ~290 kWh. Mitt på dagen går The Beach i princip helt på egen sol — det vi inte använder skickar vi ut på nätet till grannarna, och batteriet hjälper till att hålla hela elnätet i balans, själva förutsättningen för att Sverige ska kunna bygga ut mer förnybart. Huset värms med lokal fjärrvärme och byggdes med extra isolerade väggar. Att vi investerat i sol och batteri med 15–20 års återbetalning säger det viktigaste: vi menar allvar, och vi tänker vara kvar.",
    },
    socialt: {
      eyebrow: "Socialt",
      title: "En arena ger energi åt två håll",
      body:
        "Här rör sig runt 800 människor i veckan, året runt, i alla åldrar från 3 till 99. Vår förening är en av Sveriges största — 443 tävlingslicensierade medlemmar (2025), nästan hälften kvinnor, och 250 barn och ungdomar. Vi är träningsbas för landslaget som tog OS-guld. Det är folkhälsa, gemenskap och jämställdhet på riktigt — motgift mot stillasittande och ensamhet.",
    },
    grundare: {
      eyebrow: "Långsiktighet",
      title: "Byggt och ägt av grundarna",
      body:
        "Bakom The Beach står samma två personer sedan 2006. David Cabrera och Mattias Magnusson äger både anläggningen och bolaget som driver den, och har i 20 år återinvesterat allt i verksamheten. Mattias är förbundskapten för damlandslaget, och Rasmus Jonsson leder tillsammans med Anders Kristiansson herrlandslaget. Tillsammans med vår personal, våra tränare och ledare i föreningen är vi en stolt medlem i Svenska Volleybollförbundet med ett djupt, väletablerat samarbete.",
      award: "Årets Företagare i Huddinge 2026",
      fotoAlt: "David Cabrera och Mattias Magnusson med diplomen för Årets Företagare i Huddinge 2026",
      logoAlt: "Svenska Volleybollförbundet",
    },
    cta: {
      title: "Vill ni lägga ert event under solen?",
      body:
        "Skicka en förfrågan så återkommer vi inom 24 timmar — och till varje företagsevent kan vi ta fram en rapport på hur mycket av dagen som drevs av sol.",
      button: "Skicka förfrågan",
    },
  },
  en: {
    meta: {
      title: "Sustainability — The Beach | A solar-powered beach arena in Huddinge",
      description:
        "The sun powers the arena, movement powers the people. The Beach largely runs on its own solar power (72 kW + ~290 kWh battery) and is one of Sweden's largest beach volleyball clubs. Sustainability we measure and show — not just claim.",
    },
    hero: {
      eyebrow: "Sustainability",
      titlePre: "We give ",
      titleAccent: "energy",
      titlePost: " — for real",
      intro:
        "The sun powers the arena. Movement powers the people. Sustainability here isn't something we say — it's something we measure and show.",
      cta: "Book an event",
    },
    requestHref: "/en/events#request",
    miljo: {
      eyebrow: "Environment",
      title: "We run the arena on the sun",
      body:
        "On the roof sits a 72 kW solar park and a ~290 kWh battery. In the middle of the day The Beach runs essentially entirely on its own solar power — what we don't use goes out on the grid to our neighbours, and the battery helps keep the whole power grid in balance, the very precondition for Sweden to build out more renewables. The building is heated with local district heating and was built with extra-insulated walls. That we've invested in solar and battery with a 15–20 year payback says what matters most: we're serious, and we intend to stay.",
    },
    socialt: {
      eyebrow: "Social",
      title: "An arena that gives energy both ways",
      body:
        "Around 800 people move here every week, all year round, at every age from 3 to 99. Our club is one of Sweden's largest — 443 members with competition licences (2025), nearly half of them women, and 250 children and youth players. We're the training base for the national team that won Olympic gold. That's public health, community and equality for real — an antidote to sedentary lives and loneliness.",
    },
    grundare: {
      eyebrow: "The long game",
      title: "Built and owned by the founders",
      body:
        "The same two people have stood behind The Beach since 2006. David Cabrera and Mattias Magnusson own both the facility and the company that runs it, and for 20 years they have reinvested everything in the business. Mattias is head coach of the women's national team, and Rasmus Jonsson leads the men's national team together with Anders Kristiansson. Together with our staff, our coaches and the leaders of our club, we are a proud member of the Swedish Volleyball Federation with a deep, well-established partnership.",
      award: "Entrepreneur of the Year in Huddinge 2026",
      fotoAlt: "David Cabrera and Mattias Magnusson with their diplomas as Entrepreneur of the Year in Huddinge 2026",
      logoAlt: "The Swedish Volleyball Federation",
    },
    cta: {
      title: "Want to put your event under the sun?",
      body:
        "Send a request and we'll get back to you within 24 hours — and for every corporate event we can produce a report on how much of the day ran on solar.",
      button: "Send a request",
    },
  },
};
