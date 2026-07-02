/**
 * KALENDERN — sajtens enda källa för händelser.
 *
 * Uppdatera HÄR (eller be Lisa/AI-teamet göra det — tar under en minut).
 * Sajten byggs om automatiskt vid deploy; inga andra filer behöver röras.
 * Startsidan visar de närmaste händelserna, /kalender visar allt.
 */

export type Ev = {
  day: string;
  wd: string;
  title: string;
  meta: string;
  badge: string;
  type: "tournament" | "event" | "free" | "closed" | "training";
};

export type Month = { month: string; events: Ev[] };

export const MONTHS: Month[] = [
  {
    month: "Juli 2026",
    events: [
      { day: "4", wd: "Lör", title: "Mixed Tournament", meta: "Intern tävling för alla nivåer · Anmälan öppnar snart", badge: "Mixed", type: "event" },
      { day: "11", wd: "Lör", title: "SBT1 — Stockholm Beach Tour", meta: "Rankingtävling · Anmälan öppnar 1 juli", badge: "SBT", type: "tournament" },
      { day: "25", wd: "Lör", title: "Mixed Tournament", meta: "Intern tävling · Anmälan öppnar 11 juli", badge: "Mixed", type: "event" },
    ],
  },
  {
    month: "Augusti 2026",
    events: [
      { day: "1", wd: "Lör", title: "SBT1 + Träningsgrupper öppnar", meta: "Rankingtävling · Anmälan till träningsgrupper 20:00", badge: "SBT + Träning", type: "tournament" },
      { day: "8", wd: "Lör", title: "SBT1 — Stockholm Beach Tour", meta: "Rankingtävling · Anmälan öppnar 25 juli", badge: "SBT", type: "tournament" },
    ],
  },
  {
    month: "September 2026",
    events: [
      { day: "1", wd: "Tis", title: "Grundkurs startar (tisdagar)", meta: "5 pass × 1,5 h · Boka via MATCHi", badge: "Kurs", type: "training" },
      { day: "3", wd: "Tor", title: "Grundkurs startar (torsdagar)", meta: "5 pass × 1,5 h · Boka via MATCHi", badge: "Kurs", type: "training" },
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
