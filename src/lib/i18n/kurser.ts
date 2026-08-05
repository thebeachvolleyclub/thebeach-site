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
  termsOpen: string;
  /** Endast engelska: villkoren finns bara på svenska. Tom sträng döljer raden. */
  termsLanguageNote: string;
  termsAccept: string;
  paymentNote: string;
  /** Betalrutan: belopp, reservationstid, kvitto och trygghetsrader. */
  amountLabel: (amount: string) => string;
  holdNotice: (clock: string) => string;
  holdExpired: string;
  afterPayment: string;
  swishSecurity: string;
  sellerLabel: string;
  paymentHelp: (email: string) => string;
  loginPrompt: string;
  loginWhy: string;
  loginCta: string;
  submitting: string;
  startingSwish: string;
  waitingForSwish: string;
  desktopSwishTitle: string;
  desktopSwishBody: string;
  swishQrAlt: string;
  openSwishCta: string;
  paymentQrUnavailable: string;
  successTitle: string;
  successBody: string;
  waitlistSuccessTitle: string;
  waitlistSuccessBody: string;
  errorGeneric: string;
  missingInvoice: string;
  paymentFailed: string;
  paymentTimeout: string;
  paymentUnavailable: string;
  paymentReturnCheckingTitle: string;
  paymentReturnCheckingBody: string;
  paymentReturnSuccessBody: (courseName: string | null) => string;
  paymentReturnError: string;
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
    termsOpen: "Läs kursvillkoren",
    termsLanguageNote: "",
    termsAccept: "Jag har läst och godkänner kursvillkoren.",
    paymentNote: "Efter anmälan betalar du med Swish i mobilen. Platsen bekräftas först när betalningen är klar.",
    amountLabel: (amount) => `Att betala: ${amount}`,
    holdNotice: (clock) => `Platsen är reserverad åt dig ${clock} till.`,
    holdExpired: "Reservationen gick ut. Klicka på Anmäl dig igen så startar vi en ny betalning — platsen finns kvar så länge kursen har plats.",
    afterPayment: "När betalningen gått igenom är platsen din direkt. Bekräftelse och kvitto mejlas till adressen på ditt konto.",
    swishSecurity: "Betalningen sker i Swish-appen. Vi ser aldrig dina bank- eller kortuppgifter.",
    sellerLabel: "Säljare",
    paymentHelp: (email) => `Något som strular? Mejla ${email} så löser vi det.`,
    loginPrompt: "Logga in med ditt The Beach-konto för att anmäla dig.",
    loginWhy: "Kontot är gratis och tar en halv minut — du fyller i din e-post och får en engångskod. I kontot ser du sedan dina kurser, bokningar och kvitton.",
    loginCta: "Logga in",
    submitting: "Skickar…",
    startingSwish: "Startar Swish…",
    waitingForSwish: "Väntar på Swish…",
    desktopSwishTitle: "Betala med mobilen",
    desktopSwishBody: "Öppna Swish i mobilen, tryck på Skanna och rikta kameran mot QR-koden. Sidan bekräftar anmälan automatiskt.",
    swishQrAlt: "Swish QR-kod för kursbetalning",
    openSwishCta: "Öppna Swish på den här enheten",
    paymentQrUnavailable: "QR-koden kunde inte visas. Öppna Swish på den här enheten eller kontrollera Mitt konto innan du försöker igen.",
    successTitle: "Betalt och klart",
    successBody: "Betalningen är registrerad. Öppna Mina kurser för att se aktuell platsstatus.",
    waitlistSuccessTitle: "Du står i kö",
    waitlistSuccessBody: "Vi hör av oss så fort en plats blir ledig.",
    errorGeneric: "Något gick fel. Försök igen, eller mejla oss så löser vi det.",
    missingInvoice: "Anmälan skapades men betalningen kunde inte startas. Öppna Mitt konto eller kontakta oss innan du försöker igen.",
    paymentFailed: "Swish-betalningen slutfördes inte. Din plats är inte bekräftad.",
    paymentTimeout: "Vi har ännu inte fått betalningsbeskedet. Kontrollera Mitt konto innan du försöker igen.",
    paymentUnavailable: "Betalningsstatusen kan inte läsas. Logga in igen eller kontrollera Mitt konto.",
    paymentReturnCheckingTitle: "Kontrollerar betalningen",
    paymentReturnCheckingBody: "Vänta kvar – vi hämtar betalningsbekräftelsen från Swish.",
    paymentReturnSuccessBody: (courseName) => courseName
      ? `Din betalning är mottagen och anmälan till ${courseName} är klar.`
      : "Din betalning är mottagen och kursanmälan är klar.",
    paymentReturnError: "Vi kunde inte visa betalningsbekräftelsen här. Kontrollera Mina kurser innan du försöker igen.",
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
    termsOpen: "Read the course terms",
    termsLanguageNote: "The course terms are in Swedish. Email us and we\u2019ll walk you through them.",
    termsAccept: "I have read and accept the course terms.",
    paymentNote: "After registration, pay with Swish on your phone. Your place is confirmed only after payment.",
    amountLabel: (amount) => `To pay: ${amount}`,
    holdNotice: (clock) => `Your place is reserved for another ${clock}.`,
    holdExpired: "The reservation ran out. Press Sign up again to start a new payment — the place is still there as long as the course has room.",
    afterPayment: "The moment the payment clears, the place is yours. We email the confirmation and receipt to the address on your account.",
    swishSecurity: "Payment happens inside the Swish app. We never see your bank or card details.",
    sellerLabel: "Seller",
    paymentHelp: (email) => `Something not working? Email ${email} and we'll sort it.`,
    loginPrompt: "Log in with your The Beach account to sign up.",
    loginWhy: "The account is free and takes about thirty seconds — enter your email and we send you a one-time code. It's where you'll find your courses, bookings and receipts.",
    loginCta: "Log in",
    submitting: "Sending…",
    startingSwish: "Starting Swish…",
    waitingForSwish: "Waiting for Swish…",
    desktopSwishTitle: "Pay with your phone",
    desktopSwishBody: "Open Swish on your phone, tap Scan, and point the camera at the QR code. This page confirms your registration automatically.",
    swishQrAlt: "Swish QR code for the course payment",
    openSwishCta: "Open Swish on this device",
    paymentQrUnavailable: "The QR code could not be displayed. Open Swish on this device or check My account before trying again.",
    successTitle: "Payment complete",
    successBody: "Your payment is registered. Open My courses to see the current place status.",
    waitlistSuccessTitle: "You're on the waitlist",
    waitlistSuccessBody: "We'll be in touch as soon as a place opens up.",
    errorGeneric: "Something went wrong. Try again, or email us and we'll sort it.",
    missingInvoice: "Registration was created but payment could not start. Check My account or contact us before trying again.",
    paymentFailed: "The Swish payment was not completed. Your place is not confirmed.",
    paymentTimeout: "We have not received the payment result yet. Check My account before trying again.",
    paymentUnavailable: "Payment status is unavailable. Log in again or check My account.",
    paymentReturnCheckingTitle: "Checking your payment",
    paymentReturnCheckingBody: "Please wait – we are retrieving the payment confirmation from Swish.",
    paymentReturnSuccessBody: (courseName) => courseName
      ? `Your payment was received and your registration for ${courseName} is complete.`
      : "Your payment was received and your course registration is complete.",
    paymentReturnError: "We could not display the payment confirmation here. Check My courses before trying again.",
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
