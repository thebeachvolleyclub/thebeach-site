import type { Course } from "@/lib/courses";

/**
 * Länkbara kurs-URL:er: /kurser/grundkurs-tisdag-1900.
 *
 * Kurserna låg tidigare bara som ett ankare på /trana, vilket gjorde att de
 * inte gick att länka i ett utskick, en story eller en annons — och inte
 * heller att mäta per kurs. Sluggen byggs av nivå + veckodag + starttid
 * eftersom det är så en kund pratar om kursen ("grundkursen på tisdagar").
 *
 * Samma slug används på svenska och engelska. Ett enda kanoniskt slug-set
 * betyder att en delad länk aldrig pekar fel, och att /kurser/<slug> och
 * /en/courses/<slug> alltid är samma kurs.
 */

const WEEKDAY_SLUGS = [
  "",
  "mandag",
  "tisdag",
  "onsdag",
  "torsdag",
  "fredag",
  "lordag",
  "sondag",
];

/** "Fortsättning" → "fortsattningskurs". Plattformens nivåtext varierar. */
function levelSlug(level: string): string {
  const base = slugify(level);
  if (!base) return "kurs";
  if (base.startsWith("grund")) return "grundkurs";
  if (base.startsWith("fortsatt")) return "fortsattningskurs";
  return base;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/é/g, "e")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Sluggen utan kollisionssuffix. */
function baseSlug(course: Course): string {
  const day = course.schedule?.dayOfWeek;
  const time = course.schedule?.startTime;
  const dayPart = day && day >= 1 && day <= 7 ? WEEKDAY_SLUGS[day] : "";
  const timePart = time ? time.replace(/[^0-9]/g, "").slice(0, 4) : "";
  const parts = [levelSlug(course.level ?? ""), dayPart, timePart].filter(Boolean);
  // Utan schema finns inget att bygga av — falla tillbaka på kursnamnet.
  return parts.length > 1 ? parts.join("-") : slugify(course.name) || `kurs-${course.id}`;
}

/**
 * Sluggar hela listan på en gång. Vid kollision behåller den äldsta kursen
 * (lägst id) den rena adressen och de senare får `-<id>` — så att en länk vi
 * redan delat inte byter adress för att en ny kurs läggs till.
 */
export function courseSlugs(courses: Course[]): Map<number, string> {
  const byBase = new Map<string, Course[]>();
  for (const course of courses) {
    const base = baseSlug(course);
    byBase.set(base, [...(byBase.get(base) ?? []), course]);
  }

  const slugs = new Map<number, string>();
  for (const [base, group] of byBase) {
    const ordered = [...group].sort((a, b) => a.id - b.id);
    ordered.forEach((course, index) => {
      slugs.set(course.id, index === 0 ? base : `${base}-${course.id}`);
    });
  }
  return slugs;
}

export function courseSlug(courses: Course[], courseId: number): string | null {
  return courseSlugs(courses).get(courseId) ?? null;
}

export function findCourseBySlug(courses: Course[], slug: string): Course | null {
  const wanted = slug.toLowerCase();
  const slugs = courseSlugs(courses);
  return courses.find((course) => slugs.get(course.id) === wanted) ?? null;
}

/** Sökväg till kurssidan i rätt språkversion. */
export function coursePath(slug: string, locale: "sv" | "en"): string {
  return locale === "en" ? `/en/courses/${slug}` : `/kurser/${slug}`;
}
