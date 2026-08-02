import "server-only";

import { appApi } from "@/lib/appApi";

/**
 * Kurser från plattformens publika API (`/training/courses` på app-backend).
 *
 * Kurshanteringen ersätter MATCHi. API:t returnerar ENDAST publicerade kurser,
 * så listan är redan kundsäker — utkast och avbrutna kurser kommer aldrig hit.
 *
 * Tränarnamn returneras publikt av API:t men ska INTE visas för kund — se
 * SHOW_COACHES nedan.
 */

/**
 * Tränarnamn på kurskorten.
 *
 * BESLUTAT AV MATTIAS 2026-08-02: inga tränare publikt. Kopplingen finns kvar
 * internt (närvaro och löneunderlag bygger på den) men namnen renderas inte
 * på sajten. Ändra inte utan att stämma av med Mattias — det låser oss vid
 * tränarbyten och sjukdom.
 */
export const SHOW_COACHES = false;

export type CourseSession = {
  id: number;
  date: string;
  number: number;
  cancelled: boolean;
};

export type Course = {
  id: number;
  name: string;
  level: string;
  description: string | null;
  prerequisites: string | null;
  termsMarkdown: string | null;
  termsVersion: string;
  season: { id: number; name: string } | null;
  schedule: { dayOfWeek: number | null; startTime: string | null } | null;
  coaches: { id: number; name: string }[];
  capacity: number;
  remainingPlaces: number;
  waitlistCount: number;
  priceSek: number;
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  sessions: CourseSession[];
};

/** Pass som faktiskt går av stapeln — inställda räknas inte. */
export function liveSessions(course: Course): CourseSession[] {
  return (course.sessions ?? [])
    .filter((s) => !s.cancelled)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function firstSessionDate(course: Course): string | null {
  return liveSessions(course)[0]?.date ?? null;
}

export function lastSessionDate(course: Course): string | null {
  const s = liveSessions(course);
  return s.length ? s[s.length - 1].date : null;
}

/**
 * Anmälningsläge. `closed` vinner över `full` — en stängd kurs ska inte
 * locka med väntelista.
 */
export type CourseState = "open" | "waitlist" | "closed";

export function courseState(course: Course, now = new Date()): CourseState {
  const opens = course.registrationOpensAt ? new Date(course.registrationOpensAt) : null;
  const closes = course.registrationClosesAt ? new Date(course.registrationClosesAt) : null;
  if (opens && now < opens) return "closed";
  if (closes && now > closes) return "closed";
  return course.remainingPlaces > 0 ? "open" : "waitlist";
}

/** Sorterar grundkurser före fortsättning, därefter kronologiskt. */
function sortCourses(courses: Course[]): Course[] {
  const rank = (c: Course) => (/grund/i.test(c.level) ? 0 : 1);
  return [...courses].sort((a, b) => {
    const r = rank(a) - rank(b);
    if (r !== 0) return r;
    return (firstSessionDate(a) ?? "").localeCompare(firstSessionDate(b) ?? "");
  });
}

/**
 * Hämtar publicerade kurser. Returnerar tom lista när API:t är nere så att
 * sidan faller tillbaka på den redaktionella texten i stället för att krascha.
 */
export async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await appApi("/training/courses");
    if (!response.ok) return [];
    const data = (await response.json()) as { courses?: Course[] };
    return sortCourses(data.courses ?? []);
  } catch {
    return [];
  }
}
