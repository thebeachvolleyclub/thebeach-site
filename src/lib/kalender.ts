/**
 * KALENDERN — sajtens enda källa för händelser. Navet.
 *
 * Uppdatera HÄR (eller be Lisa/AI-teamet — tar under en minut).
 * - slug         → händelsen får en egen sida på /kalender/<slug>
 * - beskrivning  → brödtext på händelsesidan
 * - skarm        → true = visas i skärmslingan på /skarm (Smartsign)
 */

export type Ev = {
  day: string;
  wd: string;
  title: string;
  meta: string;
  badge: string;
  type: "tournament" | "event" | "free" | "closed" | "training";
  slug?: string;
  beskrivning?: string;
  stycken?: string[];
  cta?: { label: string; href: string };
  skarm?: boolean;
};

export type Month = { month: string; events: Ev[] };

export const MONTHS: Month[] = [
  {
    month: "Juli 2026",
    events: [
      { day: "4", wd: "Lör", title: "Mixed Tournament", meta: "Tävling · Anmälan & betalning via Profixio", badge: "Mixed", type: "tournament",
        slug: "mixed-4-juli", skarm: true,
        beskrivning: "Välkommen att tävla hos oss. Oavsett om det är din första turnering eller om du jagar rankingpoäng mot de stora scenerna är målet detsamma: en riktigt bra turneringsupplevelse med tydlig struktur och världens bästa stämning — både på och vid sidan av banan.",
        stycken: [
          "Anmälan och betalning sker via Svenska Volleybollförbundets tävlingsplattform [Profixio](https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB). Länken leder till säsongskalendern som uppdateras löpande — därifrån klickar du dig vidare till just den här turneringen. Din anmälan är giltig först när betalningen är genomförd i Profixio; ingen betalning före deadline = ingen anmälan.",
          "För att tävla krävs tävlingslicens via Svenska Volleybollförbundet. Du söker licens genom en förening — du är varmt välkommen att gå med i vår, [The Beach Volley Club Huddinge](/foreningen). Medlemskap + licens kostar 350 kr (190 kr för junior) och ger dessutom rabatt på bokningar. Licensen aktiveras inte automatiskt, så be om att få den aktiverad i god tid innan du anmäler dig.",
        ],
        cta: { label: "Anmäl via Profixio", href: "https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB" } },
      { day: "11", wd: "Lör", title: "SBT1 — Swedish Beach Tour", meta: "Rankingtävling · Anmälan & betalning via Profixio", badge: "SBT", type: "tournament",
        slug: "sbt1-11-juli", skarm: true,
        beskrivning: "SBT 1-stjärnig rankingtävling — instegsnivån i Swedish Beach Tour, med både nybörjare och mer erfarna spelare. Välkommen att tävla oavsett om det är din första turnering eller om du jagar rankingpoäng mot de stora scenerna. Publik är varmt välkommen och serveringen är öppen hela dagen.",
        stycken: [
          "Anmälan och betalning sker via Svenska Volleybollförbundets tävlingsplattform [Profixio](https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB). Länken leder till säsongskalendern som uppdateras löpande — därifrån klickar du dig vidare till just den här turneringen. Din anmälan är giltig först när betalningen är genomförd i Profixio; ingen betalning före deadline = ingen anmälan.",
          "För att spela rankinggrundande turneringar krävs tävlingslicens via Svenska Volleybollförbundet. Du söker licens genom en förening — du är varmt välkommen att gå med i vår, [The Beach Volley Club Huddinge](/foreningen). Medlemskap + licens kostar 350 kr (190 kr för junior) och ger dessutom rabatt på bokningar. Licensen aktiveras inte automatiskt, så be om att få den aktiverad i god tid innan du anmäler dig.",
        ],
        cta: { label: "Anmäl via Profixio", href: "https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB" } },
      { day: "25", wd: "Lör", title: "Mixed Tournament", meta: "Tävling · Anmälan & betalning via Profixio", badge: "Mixed", type: "tournament",
        slug: "mixed-25-juli",
        beskrivning: "Sommarens andra mixedturnering. Välkommen att tävla oavsett om det är din första turnering eller om du jagar rankingpoäng mot de stora scenerna — tydlig struktur och världens bästa stämning, på och vid sidan av banan.",
        stycken: [
          "Anmälan och betalning sker via Svenska Volleybollförbundets tävlingsplattform [Profixio](https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB). Länken leder till säsongskalendern som uppdateras löpande — därifrån klickar du dig vidare till just den här turneringen. Din anmälan är giltig först när betalningen är genomförd i Profixio; ingen betalning före deadline = ingen anmälan.",
          "För att tävla krävs tävlingslicens via Svenska Volleybollförbundet. Du söker licens genom en förening — du är varmt välkommen att gå med i vår, [The Beach Volley Club Huddinge](/foreningen). Medlemskap + licens kostar 350 kr (190 kr för junior) och ger dessutom rabatt på bokningar. Licensen aktiveras inte automatiskt, så be om att få den aktiverad i god tid innan du anmäler dig.",
        ],
        cta: { label: "Anmäl via Profixio", href: "https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB" } },
    ],
  },
  {
    month: "Augusti 2026",
    events: [
      { day: "1", wd: "Lör", title: "SBT1 + Träningsgrupper öppnar", meta: "Rankingtävling · Anmälan till träningsgrupper 20:00", badge: "SBT + Träning", type: "tournament",
        slug: "1-augusti", skarm: true,
        beskrivning: "Dubbeldag: SBT 1-stjärnig rankingtävling på sanden — och klockan 20:00 öppnar anmälan till [höstens träningsgrupper](/trana#traningsgrupper) här på hemsidan. Grupperna publiceras senast 23 augusti.",
        stycken: [
          "Anmälan och betalning sker via Svenska Volleybollförbundets tävlingsplattform [Profixio](https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB). Länken leder till säsongskalendern som uppdateras löpande — därifrån klickar du dig vidare till just den här turneringen. Din anmälan är giltig först när betalningen är genomförd i Profixio; ingen betalning före deadline = ingen anmälan.",
          "För att spela rankinggrundande turneringar krävs tävlingslicens via Svenska Volleybollförbundet. Du söker licens genom en förening — du är varmt välkommen att gå med i vår, [The Beach Volley Club Huddinge](/foreningen). Medlemskap + licens kostar 350 kr (190 kr för junior) och ger dessutom rabatt på bokningar. Licensen aktiveras inte automatiskt, så be om att få den aktiverad i god tid innan du anmäler dig.",
        ],
        cta: { label: "Anmäl via Profixio", href: "https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB" } },
      { day: "8", wd: "Lör", title: "SBT1 — Swedish Beach Tour", meta: "Rankingtävling · Anmälan & betalning via Profixio", badge: "SBT", type: "tournament",
        slug: "sbt1-8-augusti",
        beskrivning: "Säsongens sista hemma-SBT — 1-stjärnig rankingtävling på instegsnivå. Välkommen att tävla oavsett om det är din första turnering eller om du jagar rankingpoäng mot de stora scenerna. Publik är varmt välkommen och serveringen är öppen hela dagen.",
        stycken: [
          "Anmälan och betalning sker via Svenska Volleybollförbundets tävlingsplattform [Profixio](https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB). Länken leder till säsongskalendern som uppdateras löpande — därifrån klickar du dig vidare till just den här turneringen. Din anmälan är giltig först när betalningen är genomförd i Profixio; ingen betalning före deadline = ingen anmälan.",
          "För att spela rankinggrundande turneringar krävs tävlingslicens via Svenska Volleybollförbundet. Du söker licens genom en förening — du är varmt välkommen att gå med i vår, [The Beach Volley Club Huddinge](/foreningen). Medlemskap + licens kostar 350 kr (190 kr för junior) och ger dessutom rabatt på bokningar. Licensen aktiveras inte automatiskt, så be om att få den aktiverad i god tid innan du anmäler dig.",
        ],
        cta: { label: "Anmäl via Profixio", href: "https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB" } },
      { day: "23", wd: "Sön", title: "Träningsgrupper publiceras", meta: "Gruppindelningen mejlas ut och publiceras", badge: "Träning", type: "training",
        beskrivning: "Senast idag publiceras höstens gruppindelning. Håll koll på mejlen." },
      { day: "30", wd: "Sön", title: "Träningsgrupper startar — söndagar", meta: "Höstsäsongen drar igång · 15 pass", badge: "Träning", type: "training", skarm: true },
      { day: "31", wd: "Mån", title: "Träningsgrupper startar — måndagar", meta: "Höstsäsongen drar igång · 15 pass", badge: "Träning", type: "training" },
    ],
  },
  {
    month: "September 2026",
    events: [
      { day: "5", wd: "Lör", title: "Klubblags-SM för ungdomar — U16 & U18", meta: "Tvådagars mästerskap 5–6 sep · Anmälan via Profixio", badge: "Tävling", type: "tournament",
        slug: "klubblags-sm-ungdomar", skarm: true,
        beskrivning: "Ungdomarnas Klubblagsmästerskap spelas på The Beach! U18-SM och U16-mästerskapet avgörs 5–6 september — 48 lag, två dagar av intensiv beachvolley där klubbkänsla och laganda står i centrum när utomhussäsongen avslutas hos oss.",
        stycken: [
          "Tävlingen växer: 48 lag i två klasser — U18-SM (spelare födda 2009 eller senare) och U16-mästerskapet (spelare födda 2011 eller senare), med 12 flicklag och 12 pojklag per klass. Flera lag per klubb kan anmälas, och matcher spelas både inne och ute beroende på väder.",
          "Anmälan öppnade 3 juli och stänger 10 augusti kl 22:00 — anmälan och betalning sker via [Profixio](https://www.profixio.com/app/klubblagsmesterskap-for-ungdomar-2026). Sista dag att anmäla spelare är 31 augusti. Mer information finns hos [Svensk Volleyboll](https://volleyboll.se/beachvolley/klubblags-sm/ungdomstavlingen).",
        ],
        cta: { label: "Anmäl via Profixio", href: "https://www.profixio.com/app/klubblagsmesterskap-for-ungdomar-2026" } },
      { day: "1", wd: "Tis", title: "Kursstart — grund- & fortsättningskurs", meta: "Båda kurserna, tisdagar · Boka via MATCHi", badge: "Kurs", type: "training",
        slug: "kursstart-hosten",
        beskrivning: "Höstens kurser drar igång: grundkurs för dig som är ny och fortsättningskurs för dig som vill ta nästa steg. Båda kurserna går både tisdagar och torsdagar. Bokas via [MATCHi](https://www.matchi.se/facilities/thebeach)." },
      { day: "3", wd: "Tor", title: "Kursstart — grund- & fortsättningskurs", meta: "Båda kurserna, torsdagar · Boka via MATCHi", badge: "Kurs", type: "training" },
      { day: "2", wd: "Ons", title: "Träningsgrupper startar — onsdagar", meta: "Höstsäsongen drar igång · 15 pass", badge: "Träning", type: "training" },
    ],
  },
];

/** De N närmaste händelserna, för startsidan. */
export function upcoming(n: number): { month: string; ev: Ev }[] {
  const out: { month: string; ev: Ev }[] = [];
  for (const m of MONTHS)
    for (const ev of m.events) {
      if (out.length < n) out.push({ month: m.month, ev });
    }
  return out;
}

export function allEvents(): { month: string; ev: Ev }[] {
  return MONTHS.flatMap((m) => m.events.map((ev) => ({ month: m.month, ev })));
}

export function bySlug(slug: string): { month: string; ev: Ev } | undefined {
  return allEvents().find((x) => x.ev.slug === slug);
}

export function screenEvents(): { month: string; ev: Ev }[] {
  return allEvents().filter((x) => x.ev.skarm);
}
