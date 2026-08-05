import {
  firstSessionDate,
  lastSessionDate,
  liveSessions,
  type Course,
} from "@/lib/courses";
import type { Locale } from "@/lib/i18n";
import { courseText, kurserDict, shortDate } from "@/lib/i18n/kurser";

/**
 * Titel och beskrivning för kurssidans metadata och OG-kort. Byggs av
 * livedata så att en delad länk visar rätt dag, tid och pris — inte en
 * generisk rubrik som blir fel vid nästa säsong.
 */
export function courseSummary(course: Course, locale: Locale) {
  const k = kurserDict[locale];
  const name = courseText(course.name.split("–")[0].trim() || course.name, locale);
  const day = course.schedule?.dayOfWeek ? k.weekdays[course.schedule.dayOfWeek] : null;
  const time = course.schedule?.startTime ?? null;
  const when = day && time ? k.weekdayTime(day, time) : null;
  const title = when ? `${name} — ${when}` : name;

  const price = `${course.priceSek.toLocaleString(
    locale === "sv" ? "sv-SE" : "en-GB",
  )} kr`;
  const sessions = liveSessions(course).length;
  const start = firstSessionDate(course);
  const end = lastSessionDate(course);

  const parts: string[] = [];
  if (sessions) parts.push(`${sessions} ${k.sessionsSuffix}`);
  if (start) parts.push(`${k.startLabel.toLowerCase()} ${shortDate(start, locale)}`);
  if (end && end !== start) parts.push(`${k.endLabel.toLowerCase()} ${shortDate(end, locale)}`);
  parts.push(price);
  parts.push("The Beach, Huddinge");

  return { title, description: parts.join(" · ") };
}
