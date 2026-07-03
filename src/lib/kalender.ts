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
  skarm?: boolean;
};

export type Month = { month: string; events: Ev[] };

export const MONTHS: Month[] = [
  {
    month: "Juli 2026",
    events: [
      { day: "4", wd: "Lör", title: "Mixed Tournament", meta: "Intern tävling för alla nivåer · Anmälan öppnar snart", badge: "Mixed", type: "event",
        slug: "mixed-4-juli", skarm: true,
        beskrivning: "Intern mixedturnering öppen för alla nivåer. Lottade lag, garanterat flera matcher och prisutdelning i loungen efteråt. Perfekt första turnering om du aldrig tävlat." },
      { day: "11", wd: "Lör", title: "SBT1 — Stockholm Beach Tour", meta: "Rankingtävling · Anmälan öppnar 1 juli", badge: "SBT", type: "tournament",
        slug: "sbt1-11-juli", skarm: true,
        beskrivning: "SBT 1-stjärnig rankingtävling på The Beach. Anmälan via Profixio från 1 juli. Publik är varmt välkommen — servering öppen hela dagen." },
      { day: "25", wd: "Lör", title: "Mixed Tournament", meta: "Intern tävling · Anmälan öppnar 11 juli", badge: "Mixed", type: "event",
        slug: "mixed-25-juli",
        beskrivning: "Sommarens andra mixedturnering. Lottade lag och garanterat spel — alla nivåer välkomna." },
    ],
  },
  {
    month: "Augusti 2026",
    events: [
      { day: "1", wd: "Lör", title: "SBT1 + Träningsgrupper öppnar", meta: "Rankingtävling · Anmälan till träningsgrupper 20:00", badge: "SBT + Träning", type: "tournament",
        slug: "1-augusti", skarm: true,
        beskrivning: "Dubbeldag: SBT1-rankingtävling på sanden — och klockan 20:00 öppnar anmälan till höstens träningsgrupper här på hemsidan. Grupperna publiceras senast 23 augusti." },
      { day: "8", wd: "Lör", title: "SBT1 — Stockholm Beach Tour", meta: "Rankingtävling · Anmälan öppnar 25 juli", badge: "SBT", type: "tournament",
        slug: "sbt1-8-augusti",
        beskrivning: "Säsongens sista hemma-SBT. Anmälan via Profixio från 25 juli." },
      { day: "23", wd: "Sön", title: "Träningsgrupper publiceras", meta: "Gruppindelningen mejlas ut och publiceras", badge: "Träning", type: "training",
        beskrivning: "Senast idag publiceras höstens gruppindelning. Håll koll på mejlen." },
      { day: "30", wd: "Sön", title: "Träningsgrupper startar — söndagar", meta: "Höstsäsongen drar igång · 15 pass", badge: "Träning", type: "training", skarm: true },
      { day: "31", wd: "Mån", title: "Träningsgrupper startar — måndagar", meta: "Höstsäsongen drar igång · 15 pass", badge: "Träning", type: "training" },
    ],
  },
  {
    month: "September 2026",
    events: [
      { day: "1", wd: "Tis", title: "Kursstart — grund- & fortsättningskurs", meta: "Båda kurserna, tisdagar · Boka via MATCHi", badge: "Kurs", type: "training",
        slug: "kursstart-hosten",
        beskrivning: "Höstens kurser drar igång: grundkurs för dig som är ny och fortsättningskurs för dig som vill ta nästa steg. Båda kurserna går både tisdagar och torsdagar. Bokas via MATCHi." },
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
