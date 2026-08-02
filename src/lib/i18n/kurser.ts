import type { Locale } from "@/lib/i18n";

/**
 * Etiketter för de API-drivna kurskorten. Ligger separat från trana.ts
 * eftersom trana.ts är redaktionell text medan det här är UI-etiketter runt
 * levande data (lediga platser, datum, anmälningsläge).
 */

export type KurserDict = {
  levelTagFallback: string;
  sessionsSuffix: string;
  startLabel: string;
  endLabel: string;
  weekdayTime: (day: string, start: string) => string;
  placesLeft: (n: number) => string;
  full: string;
  waitlistCount: (n: number) => string;
  closed: string;
  signupCta: string;
  waitlistCta: string;
  closedCta: string;
  coachLabel: string;
  terms: string;
  termsAccept: string;
  loginPrompt: string;
  loginCta: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  waitlistSuccessTitle: string;
  waitlistSuccessBody: string;
  errorGeneric: string;
  myCoursesCta: string;
  weekdays: string[];
};

const svWeekdays = ["", "måndagar", "tisdagar", "onsdagar", "torsdagar", "fredagar", "lördagar", "söndagar"];
const enWeekdays = ["", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"];

export const kurserDict: Record<Locale, KurserDict> = {
  sv: {
    levelTagFallback: "Kurs",
    sessionsSuffix: "pass",
    startLabel: "Start",
    endLabel: "Sista pass",
    weekdayTime: (day, start) => `${day} ${start}`,
    placesLeft: (n) => (n === 1 ? "1 plats kvar" : `${n} platser kvar`),
    full: "Fullbokad",
    waitlistCount: (n) => (n === 1 ? "1 person i kö" : `${n} personer i kö`),
    closed: "Anmälan stängd",
    signupCta: "Anmäl dig",
    waitlistCta: "Ställ dig i kö",
    closedCta: "Anmälan stängd",
    coachLabel: "Tränare",
    terms: "Kursvillkor",
    termsAccept: "Jag har läst och godkänner kursvillkoren. Anmälan är bindande.",
    loginPrompt: "Logga in med ditt The Beach-konto för att anmäla dig.",
    loginCta: "Logga in",
    submitting: "Skickar…",
    successTitle: "Du är anmäld",
    successBody: "Fakturan är på väg till din e-post. Platsen är din när betalningen är registrerad.",
    waitlistSuccessTitle: "Du står i kö",
    waitlistSuccessBody: "Vi hör av oss så fort en plats blir ledig.",
    errorGeneric: "Något gick fel. Försök igen, eller mejla oss så löser vi det.",
    myCoursesCta: "Mina kurser",
    weekdays: svWeekdays,
  },
  en: {
    levelTagFallback: "Course",
    sessionsSuffix: "sessions",
    startLabel: "Starts",
    endLabel: "Last session",
    weekdayTime: (day, start) => `${day} ${start}`,
    placesLeft: (n) => (n === 1 ? "1 place left" : `${n} places left`),
    full: "Fully booked",
    waitlistCount: (n) => (n === 1 ? "1 person waiting" : `${n} people waiting`),
    closed: "Registration closed",
    signupCta: "Sign up",
    waitlistCta: "Join the waitlist",
    closedCta: "Registration closed",
    coachLabel: "Coach",
    terms: "Course terms",
    termsAccept: "I have read and accept the course terms. Registration is binding.",
    loginPrompt: "Log in with your The Beach account to sign up.",
    loginCta: "Log in",
    submitting: "Sending…",
    successTitle: "You're signed up",
    successBody: "The invoice is on its way to your inbox. Your place is confirmed once payment is registered.",
    waitlistSuccessTitle: "You're on the waitlist",
    waitlistSuccessBody: "We'll be in touch as soon as a place opens up.",
    errorGeneric: "Something went wrong. Try again, or email us and we'll sort it.",
    myCoursesCta: "My courses",
    weekdays: enWeekdays,
  },
};

/** 2026-09-01 → "1 sep" / "1 Sep". Kort form, samma längd på båda språken. */
export function shortDate(iso: string, locale: Locale): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(d);
}

/**
 * TILLFÄLLIG ÖVERSÄTTNING — tas bort när kurs-API:t har språkfält.
 *
 * Kursens namn, nivå och förkunskapskrav kommer från plattformen och finns
 * bara på svenska (ett textfält per kurs). Plattformsärende #28 begär name_en
 * och description_en; tills dess mappas de strängar VI själva har författat,
 * så att /en/training inte blandar språk. Okänd text lämnas orörd — bättre
 * svenska än fel engelska.
 */
const enOverrides: Record<string, string> = {
  Grundkurs: "Beginner",
  Fortsättning: "Intermediate",
  "Grundkurs beachvolley": "Beginner beach volleyball",
  "Fortsättningskurs beachvolley": "Intermediate beach volleyball",
  "Inga förkunskaper krävs.": "No previous experience required.",
  "Genomförd grundkurs eller motsvarande spelvana.":
    "Completed beginner course or equivalent playing experience.",
};

/** Översätter plattformstext till engelska när vi har en känd motsvarighet. */
export function courseText(value: string, locale: Locale): string {
  if (locale === "sv") return value;
  return enOverrides[value.trim()] ?? value;
}
