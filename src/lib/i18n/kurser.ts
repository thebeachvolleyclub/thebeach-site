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
  fewLeft: string;
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
  /**
   * Kampanjkoden: utfällbart fält vid villkorsrutan, och utfallet som visas
   * innan betalningen startar (rabatt avdragen, kod utan rabatt, gratis plats).
   */
  promotionToggle: string;
  promotionLabel: string;
  promotionPlaceholder: string;
  promotionHelp: string;
  promotionApply: string;
  promotionChecking: string;
  promotionInvalid: string;
  promotionLookupUnavailable: string;
  promotionPreviewTitle: string;
  promotionPreviewRegular: (amount: string) => string;
  promotionPreviewTier: (year: number, amount: string) => string;
  promotionValidateFirst: string;
  referralAttribution: (code: string) => string;
  promotionAppliedTitle: string;
  promotionAppliedNote: (code: string, amount: string) => string;
  promotionWasLabel: (amount: string) => string;
  promotionNowLabel: (amount: string) => string;
  promotionNoDiscountTitle: string;
  promotionNoDiscountBody: (code: string) => string;
  promotionFreeTitle: string;
  promotionFreeBody: (code: string) => string;
  /**
   * Inline-inloggningen i kurskortet: e-post → kod → namn/födelsedatum.
   * Ersätter den gamla omvägen till /konto med ?next=.
   */
  inlineTitle: string;
  inlineIntro: string;
  inlineEmailLabel: string;
  inlineEmailPlaceholder: string;
  inlineSendCode: string;
  inlineSendingCode: string;
  inlineCodeSentTo: (email: string) => string;
  inlineCodeLabel: string;
  inlineVerify: string;
  inlineVerifying: string;
  inlineResend: string;
  inlineResending: string;
  inlineResent: string;
  inlineChangeEmail: string;
  inlineFamilyTitle: string;
  inlineFamilyBody: string;
  inlineFamilyCta: string;
  inlineProfileTitle: string;
  inlineProfileIntro: string;
  inlineNameLabel: string;
  inlineNameHelp: string;
  inlineNameInvalid: string;
  inlineBirthdateLabel: string;
  inlineBirthdateHelp: string;
  inlineBirthdateInvalid: string;
  inlineSaveProfile: string;
  inlineSavingProfile: string;
  /** Dubblettvarningen — samma semantik och ordval som kontoportalen. */
  inlineDuplicateTitle: string;
  inlineDuplicateBody: (maskedEmail: string | null, birthdateMatch: boolean) => string;
  inlineDuplicateChoice: string;
  inlineDuplicateSame: string;
  inlineDuplicateSameBusy: string;
  inlineDuplicateNew: string;
  inlineDuplicateNewBusy: string;
  inlineMergeTitle: string;
  inlineMergeQueued: string;
  inlineContinue: string;
  inlineDoneTitle: string;
  inlineDoneBody: string;
  inlineReload: string;
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
    fewLeft: "Få platser kvar",
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
    paymentNote: "Efter anmälan väljer du Swish eller säker kortbetalning via Stripe. Platsen bekräftas först när betalningen är klar.",
    amountLabel: (amount) => `Att betala: ${amount}`,
    holdNotice: (clock) => `Platsen är reserverad åt dig ${clock} till.`,
    holdExpired: "Reservationen gick ut. Klicka på Anmäl dig igen så startar vi en ny betalning — platsen finns kvar så länge kursen har plats.",
    afterPayment: "När betalningen gått igenom är platsen din direkt. Bekräftelse och kvitto mejlas till adressen på ditt konto.",
    swishSecurity: "Swish sker i Swish-appen och kortbetalning på Stripes betalsida. Vi ser aldrig dina bank- eller kortuppgifter.",
    sellerLabel: "Säljare",
    paymentHelp: (email) => `Något som strular? Mejla ${email} så löser vi det.`,
    promotionToggle: "Har du en kampanjkod?",
    promotionLabel: "Kampanjkod",
    promotionPlaceholder: "T.EX. SOMMAR25",
    promotionHelp: "Skriv koden precis som du fått den. Rabatten dras av innan du betalar.",
    promotionApply: "Kontrollera kod",
    promotionChecking: "Kontrollerar…",
    promotionInvalid: "Koden är inte giltig för den här kursen. Kontrollera stavningen och försök igen.",
    promotionLookupUnavailable: "Koden kunde inte kontrolleras just nu. Vänta en stund och försök igen.",
    promotionPreviewTitle: "Ditt rabatterade pris",
    promotionPreviewRegular: (amount) => `Ordinarie åldersgrupp: ${amount}`,
    promotionPreviewTier: (year, amount) => `Född ${year} eller senare: ${amount}`,
    promotionValidateFirst: "Kontrollera koden för att se priset innan du anmäler dig.",
    referralAttribution: (code) => `Tipskod ${code} kopplas till anmälan. Den påverkar inte priset.`,
    promotionAppliedTitle: "Rabatten är avdragen",
    promotionAppliedNote: (code, amount) => `Kampanjkoden ${code} gav ${amount} i rabatt.`,
    promotionWasLabel: (amount) => `Ordinarie pris ${amount}`,
    promotionNowLabel: (amount) => `Ditt pris ${amount}`,
    promotionNoDiscountTitle: "Koden gav ingen rabatt",
    promotionNoDiscountBody: (code) =>
      `Vi kunde inte räkna av någon rabatt för ${code}. Kontrollera stavningen, och att koden gäller den här kursen och fortfarande är giltig. Din plats är reserverad — fortsätter du betalar du ordinarie pris.`,
    promotionFreeTitle: "Klart — inget att betala",
    promotionFreeBody: (code) =>
      `Kampanjkoden ${code} täckte hela kursavgiften. Din plats är bekräftad och bekräftelsen mejlas till adressen på ditt konto.`,
    inlineTitle: "Ange din e-post så anmäler vi dig",
    inlineIntro: "Du får en engångskod på mejlen. Är du ny skapas kontot på köpet — du behöver inte lämna sidan.",
    inlineEmailLabel: "E-post",
    inlineEmailPlaceholder: "namn@exempel.se",
    inlineSendCode: "Skicka kod",
    inlineSendingCode: "Skickar…",
    inlineCodeSentTo: (email) => `Vi har skickat en sexsiffrig kod till ${email}. Kolla gärna skräpposten om den dröjer.`,
    inlineCodeLabel: "Sexsiffrig kod",
    inlineVerify: "Fortsätt",
    inlineVerifying: "Kontrollerar…",
    inlineResend: "Skicka ny kod",
    inlineResending: "Skickar ny kod…",
    inlineResent: "En ny kod är på väg.",
    inlineChangeEmail: "Byt e-postadress",
    inlineFamilyTitle: "Flera personer på samma adress",
    inlineFamilyBody: "Adressen är kopplad till flera personer. Logga in i Mitt konto och välj vem anmälan gäller — sedan kommer du tillbaka hit och slutför.",
    inlineFamilyCta: "Välj person i Mitt konto",
    inlineProfileTitle: "Nästan klart",
    inlineProfileIntro: "Vi behöver ditt namn och födelsedatum. Födelsedatumet avgör vilket kurspris som gäller för dig — utan det kan vi inte ta emot anmälan.",
    inlineNameLabel: "Namn",
    inlineNameHelp: "För- och efternamn.",
    inlineNameInvalid: "Fyll i för- och efternamn.",
    inlineBirthdateLabel: "Födelsedatum",
    inlineBirthdateHelp: "Välj ditt födelsedatum.",
    inlineBirthdateInvalid: "Välj ett giltigt födelsedatum.",
    inlineSaveProfile: "Spara och fortsätt",
    inlineSavingProfile: "Sparar…",
    inlineDuplicateTitle: "Är det här du?",
    inlineDuplicateBody: (maskedEmail, birthdateMatch) =>
      `En spelare med ditt namn${birthdateMatch ? " och födelsedatum" : ""} finns redan i våra register${maskedEmail ? `, kopplad till e-postadressen ${maskedEmail}` : ""}.`,
    inlineDuplicateChoice: "Är det du? Då kopplar vi ihop din anmälan med din befintliga profil.",
    inlineDuplicateSame: "Ja, det är jag",
    inlineDuplicateSameBusy: "Kopplar ihop…",
    inlineDuplicateNew: "Det är inte jag — fortsätt som vanligt",
    inlineDuplicateNewBusy: "Fortsätter…",
    inlineMergeTitle: "Tack — vi tar hand om det",
    inlineMergeQueued: "Begäran är registrerad. Vi kontaktar dig när profilerna är ihopslagna — du kan slutföra anmälan som vanligt.",
    inlineContinue: "Fortsätt till anmälan",
    inlineDoneTitle: "Du är inloggad",
    inlineDoneBody: "Vi hämtar ditt pris. Godkänn kursvillkoren här nedanför så tar vi dig vidare till Swish.",
    inlineReload: "Ladda om sidan",
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
    fewLeft: "Few places left",
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
    paymentNote: "After registration, choose Swish or secure card payment through Stripe. Your place is confirmed only after payment.",
    amountLabel: (amount) => `To pay: ${amount}`,
    holdNotice: (clock) => `Your place is reserved for another ${clock}.`,
    holdExpired: "The reservation ran out. Press Sign up again to start a new payment — the place is still there as long as the course has room.",
    afterPayment: "The moment the payment clears, the place is yours. We email the confirmation and receipt to the address on your account.",
    swishSecurity: "Swish opens in the Swish app and card payment opens on Stripe Checkout. We never see your bank or card details.",
    sellerLabel: "Seller",
    paymentHelp: (email) => `Something not working? Email ${email} and we'll sort it.`,
    promotionToggle: "Got a promo code?",
    promotionLabel: "Promo code",
    promotionPlaceholder: "E.G. SUMMER25",
    promotionHelp: "Enter the code exactly as you received it. The discount comes off before you pay.",
    promotionApply: "Check code",
    promotionChecking: "Checking…",
    promotionInvalid: "This code is not valid for this course. Check the spelling and try again.",
    promotionLookupUnavailable: "We cannot check the code right now. Wait a moment and try again.",
    promotionPreviewTitle: "Your discounted price",
    promotionPreviewRegular: (amount) => `Standard age group: ${amount}`,
    promotionPreviewTier: (year, amount) => `Born ${year} or later: ${amount}`,
    promotionValidateFirst: "Check the code to see the price before signing up.",
    referralAttribution: (code) => `Referral code ${code} is linked to the signup. It does not change the price.`,
    promotionAppliedTitle: "Discount applied",
    promotionAppliedNote: (code, amount) => `Promo code ${code} took ${amount} off.`,
    promotionWasLabel: (amount) => `Regular price ${amount}`,
    promotionNowLabel: (amount) => `Your price ${amount}`,
    promotionNoDiscountTitle: "The code gave no discount",
    promotionNoDiscountBody: (code) =>
      `We could not apply any discount for ${code}. Check the spelling, and that the code is valid for this course and still active. Your place is reserved — if you continue, you pay the regular price.`,
    promotionFreeTitle: "All set — nothing to pay",
    promotionFreeBody: (code) =>
      `Promo code ${code} covered the full course fee. Your place is confirmed and we email the confirmation to the address on your account.`,
    inlineTitle: "Enter your email and we'll sign you up",
    inlineIntro: "We'll email you a one-time code. New here? Your account is created along the way — no need to leave this page.",
    inlineEmailLabel: "Email",
    inlineEmailPlaceholder: "name@example.com",
    inlineSendCode: "Send code",
    inlineSendingCode: "Sending…",
    inlineCodeSentTo: (email) => `We sent a six-digit code to ${email}. Check your spam folder if it takes a moment.`,
    inlineCodeLabel: "Six-digit code",
    inlineVerify: "Continue",
    inlineVerifying: "Checking…",
    inlineResend: "Send a new code",
    inlineResending: "Sending a new code…",
    inlineResent: "A new code is on its way.",
    inlineChangeEmail: "Use a different email",
    inlineFamilyTitle: "Several people on this address",
    inlineFamilyBody: "This address is linked to more than one person. Sign in to My account, pick who the registration is for, and you'll come straight back here to finish.",
    inlineFamilyCta: "Choose person in My account",
    inlineProfileTitle: "Almost there",
    inlineProfileIntro: "We need your name and date of birth. Your date of birth decides which course price applies to you — without it we cannot accept the registration.",
    inlineNameLabel: "Name",
    inlineNameHelp: "First and last name.",
    inlineNameInvalid: "Enter your first and last name.",
    inlineBirthdateLabel: "Date of birth",
    inlineBirthdateHelp: "Select your date of birth.",
    inlineBirthdateInvalid: "Select a valid date of birth.",
    inlineSaveProfile: "Save and continue",
    inlineSavingProfile: "Saving…",
    inlineDuplicateTitle: "Is this you?",
    inlineDuplicateBody: (maskedEmail, birthdateMatch) =>
      `A player with your name${birthdateMatch ? " and date of birth" : ""} is already in our records${maskedEmail ? `, linked to the email address ${maskedEmail}` : ""}.`,
    inlineDuplicateChoice: "Is that you? Then we'll link this registration to your existing profile.",
    inlineDuplicateSame: "Yes, that's me",
    inlineDuplicateSameBusy: "Linking…",
    inlineDuplicateNew: "That's not me — carry on",
    inlineDuplicateNewBusy: "Carrying on…",
    inlineMergeTitle: "Thanks — we'll take it from here",
    inlineMergeQueued: "Your request is registered. We'll be in touch once the profiles are merged — you can finish your registration as usual.",
    inlineContinue: "Continue to sign-up",
    inlineDoneTitle: "You're signed in",
    inlineDoneBody: "We're fetching your price. Accept the course terms just below and we'll take you to Swish.",
    inlineReload: "Reload the page",
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
 * Compatibility translations for older records and shared single-language
 * fields such as level/prerequisites. New course names and descriptions come
 * from the platform's nameEn/descriptionEn fields; unknown legacy text remains
 * Swedish rather than being guessed incorrectly.
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
