import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import CourseEnrolButton from "@/components/trana/CourseEnrolButton";
import CoursePaymentReturn from "@/components/trana/CoursePaymentReturn";
import {
  courseState,
  firstSessionDate,
  lastSessionDate,
  liveSessions,
  localizedCourseDescription,
  localizedCourseName,
  type Course,
} from "@/lib/courses";
import { courseHero } from "@/lib/courseHero";
import type { Locale } from "@/lib/i18n";
import { courseText, kurserDict, shortDate } from "@/lib/i18n/kurser";
import { kursSidaDict } from "@/lib/i18n/kursSida";
import {
  coursePriceHeadline,
  coursePriceNeedsBirthdate,
  coursePublicPriceOptions,
  coursePersonalPriceStatus,
} from "@/lib/coursePricing";

/**
 * Egen sida per kurs. Finns för att kurserna ska gå att LÄNKA — i ett utskick,
 * en story, en annons — och för att varje kurs ska kunna mätas för sig.
 * Anmälan sker i samma CourseEnrolButton som på /trana, så det finns bara en
 * kassa att underhålla.
 */
export default function CourseDetail({
  course,
  locale,
  loggedIn,
  path,
}: {
  course: Course;
  locale: Locale;
  loggedIn: boolean;
  path: string;
}) {
  const k = kurserDict[locale];
  const t = kursSidaDict[locale];
  const state = courseState(course);
  const sessions = liveSessions(course);
  const start = firstSessionDate(course);
  const end = lastSessionDate(course);
  const day = course.schedule?.dayOfWeek ? k.weekdays[course.schedule.dayOfWeek] : null;
  const time = course.schedule?.startTime ?? null;
  const localizedName = localizedCourseName(course, locale);
  const title = courseText(localizedName.split("–")[0].trim() || localizedName, locale);
  const subtitle = day && time ? k.weekdayTime(day, time) : null;
  const priceLabel = coursePriceHeadline(course, locale);
  const priceStatus = coursePersonalPriceStatus(course);
  const publicPriceOptions = coursePublicPriceOptions(course, locale);

  const facts: { label: string; value: string }[] = [];
  if (sessions.length) facts.push({ label: t.factSessions, value: `${sessions.length}` });
  if (start) facts.push({ label: k.startLabel, value: shortDate(start, locale) });
  if (end && end !== start) facts.push({ label: k.endLabel, value: shortDate(end, locale) });
  if (subtitle) facts.push({ label: t.factWhen, value: subtitle });
  facts.push({ label: t.factWhere, value: t.venue });
  facts.push({ label: t.factPrice, value: priceLabel });

  // Beskrivningen från plattformen är radbruten klartext, inte markdown.
  const paragraphs = (localizedCourseDescription(course, locale) ?? "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const hero = courseHero(course.level);

  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <section className="bg-black px-5 pb-14 pt-32 sm:px-8 lg:px-14 lg:pb-20 lg:pt-40">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Link
                href={locale === "en" ? "/en/training#kurser" : "/trana#kurser"}
                className="mb-6 inline-flex text-[11px] font-bold uppercase tracking-[0.16em] text-lime underline underline-offset-4 hover:text-lime-bright"
              >
                ← {t.backToCourses}
              </Link>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/40">
                {course.level ? courseText(course.level, locale) : k.levelTagFallback}
              </p>
              <h1 className="font-display text-[clamp(2.25rem,9vw,3.75rem)] uppercase leading-[0.9] text-bone lg:text-[clamp(3rem,5vw,4.5rem)]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-lime">
                  {subtitle}
                </p>
              )}
            </Reveal>
          </div>
        </section>

        {/* Hjältebild. Kurssidan är oftast det första en värvad person ser —
            en länk från en kompis leder hit, inte till startsidan. Utan bild
            läser sidan som ett kvitto i stället för som en inbjudan. */}
        <section className="bg-black px-5 pb-14 sm:px-8 lg:px-14">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              {/* Originalen ar kvadratiska (900x900). En panoramabeskarning
                  kapar ansiktena, och det ar ansiktena som saljer kursen —
                  darfor 4:3 och en aning ovanfor mitten. */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={hero.src}
                  alt={hero.alt[locale === "en" ? "en" : "sv"]}
                  fill
                  priority
                  sizes="(min-width: 1024px) 48rem, 100vw"
                  className="object-cover object-[50%_38%]"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-cream px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <Reveal>
              <dl className="mb-8 grid grid-cols-2 gap-x-6 border-t border-black/10 sm:grid-cols-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="border-b border-black/10 py-3">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/35">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm text-black/70">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              {course.prerequisites && (
                <p className="mb-6 border-l-2 border-lime pl-4 text-[13px] leading-snug text-black/55">
                  {courseText(course.prerequisites, locale)}
                </p>
              )}

              {paragraphs.length > 0 && (
                <div className="space-y-4 text-[15px] leading-relaxed text-black/65">
                  {paragraphs.map((block, i) => (
                    <p key={i}>{block}</p>
                  ))}
                </div>
              )}
            </Reveal>

            <Reveal delay={0.08}>
              <div id="anmalan" className="flex flex-col border border-black/10 bg-white p-7 lg:p-8">
                <CoursePaymentReturn locale={locale} courseIds={[course.id]} />
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black/35">
                  {t.signupHeading}
                </p>
                <p className={`mb-1 font-display text-3xl uppercase leading-none ${coursePriceNeedsBirthdate(course) ? "text-orange" : "text-black"}`}>
                  {priceLabel}
                </p>
                {priceStatus === "sign_in_required" && (
                  <div className="mb-4 text-[12px] leading-snug text-black/55">
                    <p className="mb-1 font-bold uppercase tracking-[0.1em] text-black/35">
                      {locale === "sv" ? "Ordinarie pris" : "Standard price"}
                    </p>
                    {publicPriceOptions.map((option) => <p key={option}>{option}</p>)}
                  </div>
                )}
                {coursePriceNeedsBirthdate(course) && (
                  <div role="alert" className="mb-4 border-l-2 border-orange pl-3 text-[12px] leading-snug text-orange">
                    <p>
                      {locale === "sv"
                        ? "Ange ditt födelsedatum i profilen för att se rätt pris och kunna anmäla dig."
                        : "Add your date of birth to your profile to see the correct price and enrol."}
                    </p>
                    <Link href="/konto#profil" className="mt-2 inline-flex font-bold text-black underline underline-offset-4">
                      {locale === "sv" ? "Öppna profil" : "Open profile"}
                    </Link>
                  </div>
                )}
                {state !== "open" && (
                  <p className="mb-4 text-[12px] font-semibold text-black/55">
                    {state === "closed" ? k.closed : k.full}
                  </p>
                )}

                {state === "closed" ? (
                  <p className="border-t border-black/10 pt-5 text-xs font-bold uppercase tracking-[0.1em] text-black/35">
                    {k.closedCta}
                  </p>
                ) : (
                  <CourseEnrolButton
                    locale={locale}
                    courseId={course.id}
                    courseName={subtitle ? `${title} · ${subtitle}` : title}
                    priceSek={course.personalPriceSek ?? course.priceSek}
                    priceStatus={priceStatus}
                    termsVersion={course.termsVersion}
                    termsMarkdown={course.termsMarkdown}
                    waitlist={state === "waitlist"}
                    loggedIn={loggedIn}
                    returnPath={path}
                  />
                )}
              </div>
            </Reveal>
          </div>
        </section>

        <Newsletter locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
