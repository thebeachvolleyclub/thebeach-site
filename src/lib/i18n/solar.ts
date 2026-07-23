import type { Dict } from "@/lib/i18n";

/**
 * Ordbok för SolarStats — den gröna arenasektionen som återanvänds på
 * hållbarhetssidan och företagslandningssidorna. Siffrorna kommer live ur
 * getSolarData() och formateras alltid likadant (sv-SE) — här styrs bara text.
 * OBS faktaregeln: "en av Sveriges största" — aldrig "Sveriges största".
 */
export interface SolarDict {
  eyebrow: string;
  badge: string;
  titlePre: string;
  titleAccent: string;
  titlePost: string;
  leadSummer: string;
  leadWinter: string;
  leadOffline: string;
  labels: {
    effektNu: string;
    solIdag: string;
    solIAr: string;
    totalSol: string;
    solpark: string;
    batteri: string;
    co2Sparat: string;
  };
  /** Enhet efter CO₂-siffran i statrutan, t.ex. "12,3 ton". */
  tonUnit: string;
  contributions: { title: string; body: string }[];
  people: string;
  /** Faktaraden: "72 kW {solarParkWord} · ~290 kWh {batteryWord}[ · X {co2FactsSuffix}]" */
  solarParkWord: string;
  batteryWord: string;
  co2FactsSuffix: string;
}

export const solarDict: Dict<SolarDict> = {
  sv: {
    eyebrow: "Grön arena",
    badge: "Driven av solen",
    titlePre: "Vi ger ",
    titleAccent: "energi",
    titlePost: " — på riktigt",
    leadSummer:
      "Solen driver arenan. Rörelsen driver människorna. Dagtid går The Beach i princip helt på egen sol — överskottet går ut till grannarna och batteriet stabiliserar elnätet. Hållbarhet hos oss är inget vi säger, det är något vi mäter och visar.",
    leadWinter:
      "Vår solpark och våra batterier jobbar året runt. Överskottet går ut på nätet till grannarna, och batterierna hjälper till att hålla elnätet i balans — även när solen är låg.",
    leadOffline:
      "Arenan drivs på egen sol från vårt eget tak. Överskottet går ut på nätet till grannarna, och våra batterier hjälper till att hålla elnätet i balans.",
    labels: {
      effektNu: "Effekt just nu",
      solIdag: "Sol idag",
      solIAr: "Sol i år",
      totalSol: "Total egen sol",
      solpark: "Solpark",
      batteri: "Batteri",
      co2Sparat: "CO₂ sparat",
    },
    tonUnit: "ton",
    contributions: [
      { title: "Vi delar med oss", body: "Överskottet vi inte använder går ut på nätet till grannarna." },
      { title: "Stabiliserar elnätet", body: "Batterierna hjälper till att hålla elnätet i balans." },
    ],
    people:
      "En av Sveriges största beachvolleyklubbar — ~800 spelare i veckan, alla åldrar. Grundarägd sedan 2006 och landslagshem för både dam och herr.",
    solarParkWord: "solpark",
    batteryWord: "batteri",
    co2FactsSuffix: "ton CO₂ sparat sedan start",
  },
  en: {
    eyebrow: "Green arena",
    badge: "Powered by the sun",
    titlePre: "We give ",
    titleAccent: "energy",
    titlePost: " — for real",
    leadSummer:
      "The sun powers the arena. Movement powers the people. During the day The Beach runs essentially entirely on its own solar power — the surplus goes out to our neighbours and the battery stabilises the grid. Sustainability here isn't something we say, it's something we measure and show.",
    leadWinter:
      "Our solar park and batteries work all year round. The surplus goes out on the grid to our neighbours, and the batteries help keep the power grid in balance — even when the sun is low.",
    leadOffline:
      "The arena runs on solar power from our own roof. The surplus goes out on the grid to our neighbours, and our batteries help keep the power grid in balance.",
    labels: {
      effektNu: "Output right now",
      solIdag: "Solar today",
      solIAr: "Solar this year",
      totalSol: "Total own solar",
      solpark: "Solar park",
      batteri: "Battery",
      co2Sparat: "CO₂ saved",
    },
    tonUnit: "tonnes",
    contributions: [
      { title: "We share", body: "The surplus we don't use goes out on the grid to our neighbours." },
      { title: "Stabilising the grid", body: "The batteries help keep the power grid in balance." },
    ],
    people:
      "One of Sweden's largest beach volleyball clubs — ~800 players a week, all ages. Founder-owned since 2006 and home base for both the women's and men's national teams.",
    solarParkWord: "solar park",
    batteryWord: "battery",
    co2FactsSuffix: "tonnes of CO₂ saved since day one",
  },
};
