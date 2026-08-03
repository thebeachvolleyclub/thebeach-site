import Reveal from "@/components/Reveal";
import CourseEnrolButton from "@/components/trana/CourseEnrolButton";
import CourseLadderStatic from "@/components/trana/CourseLadderStatic";
import CoursePaymentReturn from "@/components/trana/CoursePaymentReturn";
import { accountToken } from "@/lib/accountSession";
import {
  courseState,
  fetchCourses,
  firstSessionDate,
  lastSessionDate,
  liveSessions,
  SHOW_COACHES,
  type Course,
} from "@/lib/courses";
import type { Locale } from "@/lib/i18n";
import { courseText, kurserDict, shortDate } from "@/lib/i18n/kurser";
import { tranaDict } from "@/lib/i18n/trana";

/**
 * Kursstegen. Korten kommer från plattformens kurs-API (ersätter MATCHi).
 * Går API:t inte att nå faller sektionen tillbaka på den redaktionella
 * versionen med MATCHi-länkar — sidan ska aldrig stå tom.
 */
export default async function CourseLadder({ locale }: { locale: Locale }) {
  const courses = await fetchCourses();
  if (courses.length === 0) return <CourseLadderStatic locale={locale} />;

  const t = tranaDict[locale].courses;
  const loggedIn = Boolean(await accountToken());

  return (
    <section id="kurser" className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.title}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">{t.lead}</p>
      </Reveal>

      <CoursePaymentReturn locale={locale} courseIds={courses.map((course) => course.id)} />

      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        {courses.map((course, i) => (
          <CourseCard
            key={course.id}
            course={course}
            index={i}
            locale={locale}
            loggedIn={loggedIn}
          />
        ))}
      </div>
    </section>
  );
}

function CourseCard({
  course,
  index,
  locale,
  loggedIn,
}: {
  course: Course;
  index: number;
  locale: Locale;
  loggedIn: boolean;
}) {
  const k = kurserDict[locale];
  const state = courseState(course);
  const sessions = liveSessions(course);
  const start = firstSessionDate(course);
  const end = lastSessionDate(course);
  const day = course.schedule?.dayOfWeek ? k.weekdays[course.schedule.dayOfWeek] : null;
  const time = course.schedule?.startTime ?? null;

  // Kursnamnet bär redan dag och tid ("… – tisdagar 19:00 (höst 2026)").
  // Kortet visar det strukturerat i stället, så rubriken kortas vid tankstrecket.
  const title = courseText(course.name.split("–")[0].trim() || course.name, locale);

  // Dag och tid står som underrubrik — två kurser med samma nivå skiljs åt där.
  const subtitle = day && time ? k.weekdayTime(day, time) : null;

  const facts: string[] = [];
  if (sessions.length) facts.push(`${sessions.length} ${k.sessionsSuffix}`);
  if (start) facts.push(`${k.startLabel}: ${shortDate(start, locale)}`);
  if (end && end !== start) facts.push(`${k.endLabel}: ${shortDate(end, locale)}`);
  if (course.prerequisites) facts.push(courseText(course.prerequisites, locale));
  if (SHOW_COACHES && course.coaches.length) {
    facts.push(`${k.coachLabel}: ${course.coaches.map((c) => c.name).join(", ")}`);
  }

  return (
    <Reveal
      delay={index * 0.08}
      className="flex flex-col border border-black/10 bg-white p-7 lg:p-10"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/30">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="bg-black/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
          {course.level ? courseText(course.level, locale) : k.levelTagFallback}
        </span>
      </div>

      <h3 className="mb-1.5 font-display text-3xl uppercase leading-none text-black lg:text-4xl">
        {title}
      </h3>
      {subtitle && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">
          {subtitle}
        </p>
      )}

      <div className="mb-1 flex items-baseline gap-1.5 text-[13px] text-black/40">
        <strong className="font-display text-xl text-black lg:text-2xl">
          {course.priceSek.toLocaleString(locale === "sv" ? "sv-SE" : "en-GB")} kr
        </strong>
      </div>

      <p className="mb-4 text-[12px] font-semibold leading-snug">
        <PlaceStatus course={course} locale={locale} />
      </p>

      <ul className="mb-5 flex-1 border-t border-black/10">
        {facts.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 border-b border-black/10 py-2 text-xs leading-snug text-black/55"
          >
            <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">
              ↗
            </span>
            {f}
          </li>
        ))}
      </ul>

      {state === "closed" ? (
        <div className="mt-auto border-t border-black/10 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-black/35">
            {k.closedCta}
          </p>
        </div>
      ) : (
        <CourseEnrolButton
          locale={locale}
          courseId={course.id}
          termsVersion={course.termsVersion}
          termsMarkdown={course.termsMarkdown}
          waitlist={state === "waitlist"}
          loggedIn={loggedIn}
        />
      )}
    </Reveal>
  );
}

/** Platsstatus. Färgen bär betydelse men texten står på egna ben. */
function PlaceStatus({ course, locale }: { course: Course; locale: Locale }) {
  const k = kurserDict[locale];
  const state = courseState(course);

  if (state === "closed") return <span className="text-black/40">{k.closed}</span>;
  if (state === "waitlist") {
    return (
      <span className="text-orange">
        {k.full}
        {course.waitlistCount > 0 ? ` · ${k.waitlistCount(course.waitlistCount)}` : ""}
      </span>
    );
  }
  // Under en fjärdedel kvar räknas som bråttom.
  const scarce = course.remainingPlaces <= Math.max(2, Math.ceil(course.capacity / 4));
  return (
    <span className={scarce ? "text-orange" : "text-black/55"}>
      {k.placesLeft(course.remainingPlaces)}
    </span>
  );
}
