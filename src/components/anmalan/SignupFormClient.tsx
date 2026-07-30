"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Season-signup form — the web port of the app's SeasonSignupScreen.
 * Talks to the same season-signup API through the /api/signup/* proxy
 * routes (identical semantics regardless of frontend): signed-in visitors
 * get a prefilled form and can open, change and cancel their registration
 * until the admin locks edits; signed-out visitors can register anonymously.
 */

type Lang = "sv" | "en";
type WishKind = "wish" | "demand";
type PilotFeedbackRating = "up" | "down";
type WishType =
  | "same_group" | "not_same_group" | "same_time" | "not_same_time"
  | "language_swedish" | "language_english" | "free_text";

const WISH_ORDER: WishType[] = [
  "same_group", "not_same_group", "same_time", "not_same_time",
  "free_text",
];
const PLAYER_TYPES: WishType[] = ["same_group", "not_same_group", "same_time", "not_same_time"];

type Slot = {
  key: string;
  label: string;
  time_label?: string;
  day_of_week: number;
  start_time: string;
  price_sek: number;
  note?: string;
  note_en?: string;
};

type JuniorPricing = {
  birth_year_from: number;
  discount_pct: number;
  membership_required: boolean;
  membership_fee_sek: number;
};

type Config = {
  config_version?: number;
  season_id: number;
  title: string;
  intro_md: string | null;
  is_open: boolean;
  preview_open: boolean;
  pilot_feedback_required: boolean;
  testers_only: boolean;
  edits_locked: boolean;
  contact_email: string;
  opens_at: string | null;
  closes_at: string | null;
  before_open: boolean;
  max_sessions_per_week: number;
  slots: Slot[];
  junior_pricing?: JuniorPricing;
  config: Record<string, unknown> & {
    title_en?: string; intro_en?: string;
    multi_session_note?: string; multi_session_note_en?: string;
    max_wishes?: number; max_demands?: number;
  };
};

type Prefill = {
  first_name: string | null; last_name: string | null; email: string | null;
  birthdate: string | null; gender: "M" | "W" | null; phone: string | null;
  description: string | null;
};

type SubmissionWish = {
  kind: WishKind; wish_type: WishType;
  target_player_id: number | null; target_name: string | null; free_text: string | null;
};

type Submission = {
  id: number;
  first_name: string | null; last_name: string | null; email: string | null;
  birthdate: string | null; gender: "M" | "W" | null; phone: string | null;
  address: string | null; postcode: string | null; city: string | null;
  player_description: string | null;
  sessions_per_week: number; any_slot: boolean;
  newsletter_opt_in: boolean; commitment_ack: boolean; payment_ack: boolean;
  cancellation_ack: boolean;
  pilot_feedback_rating: PilotFeedbackRating | null;
  pilot_feedback_comment: string | null;
  pilot_feedback_at: string | null;
  created_at: string | null; changed_at: string | null; cancelled_at: string | null;
  is_changed: boolean; is_cancelled: boolean;
  slot_prefs: { priority: number; slot_key: string }[];
  wishes: SubmissionWish[];
};

type MineState = {
  submission: Submission | null;
  can_edit: boolean;
  edits_locked: boolean;
  is_open: boolean;
  contact_email: string;
  last_cancelled: { id: number; cancelled_at: string | null } | null;
};

type WishRow = {
  id: string; kind: WishKind; wishType: WishType | "";
  targetPlayerId: number | null; targetName: string | null; freeText: string;
};

type SearchResult = { id: number; name: string; age?: number | null };
type MembershipFeed = { activeCount?: number; memberships?: { active?: boolean }[] };

let wishSeq = 0;
const newWishId = () => `w${++wishSeq}`;

const STR = {
  sv: {
    loading: "Laddar…",
    noOpen: "Det finns ingen öppen anmälan just nu.",
    opensLater: (d: string) => `Anmälan öppnar ${d} — här på hemsidan.`,
    closed: "Anmälan är stängd.",
    previewTitle: "Anmälan öppnar snart",
    previewBody: "Anmälan till träningsgrupperna öppnar för alla den 1 augusti. Just nu är den öppen endast för testare/admins.",
    previewLoginHint: "Är du testare? Logga in med samma e-post som i appen så kan du anmäla dig nu.",
    loginNudgeTitle: "Har du ett Beach-konto?",
    loginNudge: "Logga in så fyller vi i dina uppgifter — och du kan öppna och ändra din anmälan senare.",
    loginCta: "Logga in på Mitt konto",
    profileFirstTitle: "Skapa din Beach-profil först",
    profileFirstIntro: "Anmälan görs med din Beach-profil — så hämtas dina uppgifter automatiskt, och du kan öppna, ändra och avbryta din anmälan när du vill.",
    profileFirstStep1: "Logga in med din e-post — eller skapa en profil om du inte har någon (tar en minut).",
    profileFirstStep2: "Kom tillbaka hit och anmäl dig till träningsgrupperna.",
    profileFirstCta: "Logga in eller skapa profil",
    fromProfileHint: "Namn och e-post hämtas från din Beach-profil och kan inte ändras här.",
    updateProfileLink: "Uppdatera din profil",
    nameMissingTitle: "Din profil saknar namn",
    nameMissingBody: "Fyll i ditt namn i din profil, så kan du anmäla dig direkt efteråt.",
    loggedInAs: (n: string) => `Inloggad som ${n}`,
    editBanner: (d: string | null) => `Din anmälan är registrerad${d ? ` (${d})` : ""}. Du kan ändra den nedan och spara igen, eller avbryta den.`,
    changedNote: (d: string) => `Senast ändrad ${d}.`,
    cancelledBanner: (d: string | null, open: boolean) => `Din anmälan är avbruten${d ? ` (${d})` : ""}.${open ? " Du kan göra en ny anmälan nedan." : ""}`,
    lockedTitle: "Ändringsfönstret har stängt",
    lockedBody: (email: string) => `Din anmälan är låst och kan inte längre ändras här. Behöver du ändra eller avbryta något? Mejla ${email} så hjälper vi dig.`,
    detailsTitle: "Dina uppgifter",
    detailsHint: "Vi behöver dessa för att kontakta dig och placera dig rätt.",
    firstName: "Förnamn", lastName: "Efternamn", email: "E-post",
    birthdate: "Födelsedatum", iAm: "Jag är", woman: "Kvinna", man: "Man",
    phone: "Telefon", address: "Adress", postcode: "Postnummer", city: "Ort",
    aboutTitle: "Om dig som spelare",
    aboutHint: "Berätta din historia – det hjälper oss placera dig rätt.",
    describe: "Beskriv dig själv som spelare",
    describePh: "Erfarenhet, nivå, mål, vad du gillar…",
    sessionsTitle: "Hur ofta vill du träna?",
    sessionUnit: (n: number) => `${n} gång${n > 1 ? "er" : ""}/vecka`,
    timesTitle: "Tider",
    timesHint: "Markera alla tider som fungerar för dig.",
    anySlotTitle: "Vilken dag/tid som helst",
    anySlotDescription: "Välj detta om du är helt flexibel och prioriterar gruppens nivå framför dag och tid.",
    anySlotLabel: "Placera mig i bästa möjliga grupp – vilken dag/tid som helst.",
    firstChoice: "Förstahandsval", secondChoice: "Andrahandsval",
    anyChosenHelp: "Du har valt vilken dag/tid som helst. Första- och andrahandsval behövs därför inte.",
    primaryStatus: (c: number) => `Valda dagar: ${c}`,
    primaryHelp: "Välj gärna så många förstahandstider som möjligt. Ju fler tider du väljer, desto större chans har vi att placera dig i en träningsgrupp på så hög nivå som möjligt.",
    secondaryHelp: "Välj alla övriga tider som också fungerar. Ju fler andrahandsval du gör, desto större är chansen att vi kan erbjuda dig en plats i en träningsgrupp.",
    secondaryLocked: 'Välj ett förstahandsval först (eller "vilken dag/tid som helst").',
    wishesTitle: "Önskemål",
    wishesBadge: "INTE ETT KRAV",
    wishesHint: (m: number) => `Sådant du gärna vill, men som vi inte måste kunna uppfylla. Max ${m}.`,
    wishesDisc: "Lägg bara till önskemål som är viktiga för dig. Fler önskemål begränsar våra möjligheter att placera dig och kan innebära att du erbjuds en träningsgrupp på lägre nivå.",
    addWish: "+ Lägg till önskemål",
    demandsTitle: "Krav",
    demandsBadge: "MÅSTE UPPFYLLAS",
    demandsHint: (m: number) => `Endast helt nödvändiga villkor. De måste kunna uppfyllas för att anmälan ska gälla. Max ${m}.`,
    demandsDisc: "Lägg bara till krav som är helt nödvändiga. Varje krav begränsar våra möjligheter och kan innebära att vi inte kan erbjuda dig någon träningsgrupp alls.",
    addDemand: "+ Lägg till krav",
    selectWishType: "Välj typ av önskemål…", selectDemandType: "Välj typ av krav…",
    confirmTitle: "Bekräftelse",
    ackPayment: "Jag förbinder mig att betala avgiften för min plats.",
    ackCancellation: "Jag har läst och förstått reglerna för avbokning.",
    optNewsletter: "Jag vill ta emot nyhetsbrev från The Beach.",
    pilotTitle: "Snabb feedback på anmälan",
    pilotHint: "Hur upplevde du anmälningsflödet? Din feedback hjälper oss att göra det ännu bättre.",
    pilotUp: "Bra",
    pilotDown: "Behöver förbättras",
    pilotComment: "Berätta kort varför",
    pilotCommentPlaceholder: "Vad fungerade bra eller vad kan vi förbättra?",
    juniorMembershipTitle: "Ungdomsrabatt – inget aktivt medlemskap hittades",
    juniorMembershipBody: (discount: number, fee: number) =>
      `Du får ${discount} % rabatt på träningsavgiften. För rabatten behöver du vara medlem i The Beach Volley Club Huddinge. Vi hittar inget aktivt medlemskap just nu. Om medlemskapet fortfarande saknas när fakturan skickas lägger vi till junioravgiften ${fee} kr – du betalar fortfarande mindre totalt.`,
    submit: "Skicka anmälan", submitUpdate: "Spara ändringar", sending: "Skickar…",
    cancelBtn: "Avbryt min anmälan", cancelling: "Avbryter…",
    viewBanner: (d: string | null) => `Din anmälan är registrerad${d ? ` (${d})` : ""}.`,
    editBtn: "Ändra min anmälan",
    backToView: "← Tillbaka utan att spara",
    errDescription: "Beskriv dig själv som spelare.",
    phonePh: "+46 70 123 45 67",
    cancelConfirm: "Avbryta anmälan? Din anmälan tas bort ur säsongens gruppbygge. Du kan anmäla dig igen så länge anmälan är öppen.",
    errIdentity: "Fyll i namn, e-post, födelsedatum (ÅÅÅÅ-MM-DD) och kön.",
    errSlots: (n: number) => `Välj förstahandstider på minst ${n} olika ${n === 1 ? "dag" : "dagar"} – eller kryssa i "vilken dag/tid som helst".`,
    errAcks: "Du måste godkänna bekräftelserna för att skicka in.",
    errPilotFeedback: "Välj tumme upp eller tumme ner och skriv en kort kommentar.",
    genericError: "Något gick fel. Försök igen om en stund.",
    searchPh: "Sök spelare i registret…", searching: "Söker…", change: "Ändra",
    otherPlayer: "Annan spelare", otherPlayerNote: "Annan spelare",
    manualNameLabel: "Namn på spelare", manualAdd: "Lägg till",
    ageUnit: (a: number) => `${a} år`,
    freeTextPh: "Skriv ditt önskemål…",
    thanksTitle: "Tack för din anmälan! 🏐",
    thanksBody: "Vi hör av oss med gruppplacering inför säsongen.",
    thanksEditNote: "Vill du kunna ändra eller avbryta din anmälan senare? Logga in på Mitt konto med samma e-postadress.",
    updatedTitle: "Dina ändringar är sparade!",
    updatedBody: "Vi använder din senaste version när vi bygger grupperna.",
    backToForm: "Öppna anmälan igen",
    roSubmitted: (d: string | null) => `Anmäld${d ? ` ${d}` : ""}`,
    roSessions: "Pass per vecka", roAnySlot: "Vilken dag/tid som helst",
    roNoWishes: "Inga önskemål eller krav.",
    days: { 1: "Måndag", 2: "Tisdag", 3: "Onsdag", 4: "Torsdag", 5: "Fredag", 6: "Lördag", 7: "Söndag" } as Record<number, string>,
    wishTypes: {
      same_group: "Vill spela i samma grupp som …",
      not_same_group: "Vill INTE spela i samma grupp som …",
      same_time: "Vill spela på samma tid som …",
      not_same_time: "Vill INTE spela på samma tid som …",
      language_swedish: "Vill ha en grupp som coachas på svenska",
      language_english: "Vill ha en grupp som coachas på engelska",
      free_text: "Annat (fritext)",
    } as Record<WishType, string>,
  },
  en: {
    loading: "Loading…",
    noOpen: "There is no open registration right now.",
    opensLater: (d: string) => `Registration opens ${d} — right here on the website.`,
    closed: "Registration is closed.",
    previewTitle: "Registration opens soon",
    previewBody: "Registration for the training groups opens for everyone on 1 August. Right now it's open only to testers/admins.",
    previewLoginHint: "Are you a tester? Sign in with the same email as in the app to register now.",
    loginNudgeTitle: "Have a Beach account?",
    loginNudge: "Sign in and we prefill your details — and you can open and change your registration later.",
    loginCta: "Sign in to My account",
    profileFirstTitle: "Create your Beach profile first",
    profileFirstIntro: "Registration uses your Beach profile — your details are filled in automatically, and you can open, change and cancel your registration whenever you like.",
    profileFirstStep1: "Sign in with your email — or create a profile if you don't have one (takes a minute).",
    profileFirstStep2: "Come back here and sign up for the training groups.",
    profileFirstCta: "Sign in or create a profile",
    fromProfileHint: "Name and email come from your Beach profile and can't be changed here.",
    updateProfileLink: "Update your profile",
    nameMissingTitle: "Your profile has no name yet",
    nameMissingBody: "Add your name to your profile, then sign up right after.",
    loggedInAs: (n: string) => `Signed in as ${n}`,
    editBanner: (d: string | null) => `Your registration is on file${d ? ` (${d})` : ""}. You can change it below and save again, or cancel it.`,
    changedNote: (d: string) => `Last changed ${d}.`,
    cancelledBanner: (d: string | null, open: boolean) => `Your registration is cancelled${d ? ` (${d})` : ""}.${open ? " You can register again below." : ""}`,
    lockedTitle: "The change window has closed",
    lockedBody: (email: string) => `Your registration is locked and can no longer be changed here. Need to change or cancel something? Email ${email} and we'll help you.`,
    detailsTitle: "Your details",
    detailsHint: "We need these to contact you and place you correctly.",
    firstName: "First name", lastName: "Last name", email: "Email",
    birthdate: "Date of birth", iAm: "I am", woman: "Woman", man: "Man",
    phone: "Phone", address: "Address", postcode: "Post code", city: "City",
    aboutTitle: "About you as a player",
    aboutHint: "Tell us your story — it helps us place you in the right group.",
    describe: "Describe yourself as a player",
    describePh: "Experience, level, goals, what you enjoy…",
    sessionsTitle: "How often do you want to train?",
    sessionUnit: (n: number) => `${n} session${n > 1 ? "s" : ""}/week`,
    timesTitle: "Times",
    timesHint: "Select every time that works for you.",
    anySlotTitle: "Any day, any time",
    anySlotDescription: "Select this if you are completely flexible and prioritize the group level over the day and time.",
    anySlotLabel: "Place me in the best possible group — any day, any time.",
    firstChoice: "First choice", secondChoice: "Second choice",
    anyChosenHelp: "You've selected any day/any time, so first and second choices aren't needed.",
    primaryStatus: (c: number) => `Days selected: ${c}`,
    primaryHelp: "Select as many first-choice times as possible. The more times you select, the better our chance of placing you in a training group at the highest possible level.",
    secondaryHelp: "Select every other time that also works. The more second choices you select, the better the chance that we can offer you a place in a training group.",
    secondaryLocked: 'Choose a first choice first (or "any day/any time").',
    wishesTitle: "Wishes",
    wishesBadge: "NOT A REQUIREMENT",
    wishesHint: (m: number) => `Something you'd like, but that we do not have to be able to meet. Max ${m}.`,
    wishesDisc: "Only add wishes that are important to you. More wishes limit our placement options and may mean that you are offered a lower-level training group.",
    addWish: "+ Add wish",
    demandsTitle: "Requirements",
    demandsBadge: "MUST BE MET",
    demandsHint: (m: number) => `Only essential conditions. They must be met for your registration to be valid. Max ${m}.`,
    demandsDisc: "Only add requirements that are absolutely necessary. Every requirement limits our options and may mean that we cannot offer you a training group at all.",
    addDemand: "+ Add requirement",
    selectWishType: "Select type of wish…", selectDemandType: "Select type of requirement…",
    confirmTitle: "Confirmation",
    ackPayment: "I commit to paying the fee for my spot.",
    ackCancellation: "I have read and understood the cancellation rules.",
    optNewsletter: "I'd like to receive newsletters from The Beach.",
    pilotTitle: "Quick registration feedback",
    pilotHint: "How did you find the registration flow? Your feedback helps us make it even better.",
    pilotUp: "Good",
    pilotDown: "Needs improvement",
    pilotComment: "Tell us briefly why",
    pilotCommentPlaceholder: "What worked well, or what could we improve?",
    juniorMembershipTitle: "Youth discount – no active membership found",
    juniorMembershipBody: (discount: number, fee: number) =>
      `You receive ${discount}% off the training fee. The discount requires membership of The Beach Volley Club Huddinge. We cannot find an active membership right now. If it is still missing when the invoice is sent, the SEK ${fee} junior membership fee will be added – your total will still be lower.`,
    submit: "Submit registration", submitUpdate: "Save changes", sending: "Sending…",
    cancelBtn: "Cancel my registration", cancelling: "Cancelling…",
    viewBanner: (d: string | null) => `Your registration is on file${d ? ` (${d})` : ""}.`,
    editBtn: "Change my registration",
    backToView: "← Back without saving",
    errDescription: "Describe yourself as a player.",
    phonePh: "+46 70 123 45 67",
    cancelConfirm: "Cancel your registration? It is removed from the season group planning. You can register again while registration is open.",
    errIdentity: "Fill in name, email, date of birth (YYYY-MM-DD) and gender.",
    errSlots: (n: number) => `Choose first-choice times on at least ${n} separate ${n === 1 ? "day" : "days"} — or tick "any day/any time".`,
    errAcks: "You must accept the confirmations to submit.",
    errPilotFeedback: "Choose thumbs up or thumbs down and write a short comment.",
    genericError: "Something went wrong. Please try again shortly.",
    searchPh: "Search players in the registry…", searching: "Searching…", change: "Change",
    otherPlayer: "Other player", otherPlayerNote: "Other player",
    manualNameLabel: "Player's name", manualAdd: "Add",
    ageUnit: (a: number) => `${a} yrs`,
    freeTextPh: "Write your wish…",
    thanksTitle: "Thank you for your registration! 🏐",
    thanksBody: "We'll be in touch with your group placement before the season.",
    thanksEditNote: "Want to change or cancel your registration later? Sign in to My account with the same email address.",
    updatedTitle: "Your changes are saved!",
    updatedBody: "We use your latest version when we build the groups.",
    backToForm: "Open the registration again",
    roSubmitted: (d: string | null) => `Registered${d ? ` ${d}` : ""}`,
    roSessions: "Sessions per week", roAnySlot: "Any day/any time",
    roNoWishes: "No wishes or requirements.",
    days: { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday" } as Record<number, string>,
    wishTypes: {
      same_group: "Want to play in the same group as …",
      not_same_group: "Do NOT want to play in the same group as …",
      same_time: "Want to play at the same time as …",
      not_same_time: "Do NOT want to play at the same time as …",
      language_swedish: "Want a group coached in Swedish",
      language_english: "Want a group coached in English",
      free_text: "Other (free text)",
    } as Record<WishType, string>,
  },
};

type Strings = typeof STR.sv;

const inputCls =
  "w-full border border-black/15 bg-black/[0.04] px-4 py-3.5 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-black";
const labelCls = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-black/70";
const cardCls = "border border-black/10 bg-white p-6 sm:p-8";
const headingCls = "font-display text-2xl uppercase text-black";
const hintCls = "mt-1 text-sm leading-relaxed text-black/55";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (typeof init?.body === "string") headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...init, headers });
  let payload: Record<string, unknown> = {};
  try { payload = await response.json() as Record<string, unknown>; } catch { /* handled below */ }
  if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Något gick fel");
  return payload as T;
}

function fmtDate(iso: string | null | undefined) {
  return iso ? iso.slice(0, 10) : null;
}

const DEFAULT_JUNIOR_PRICING: JuniorPricing = {
  birth_year_from: 2007,
  discount_pct: 30,
  membership_required: true,
  membership_fee_sek: 190,
};

function juniorDiscountApplies(birthdate: string, pricing: JuniorPricing) {
  const normalized = birthdate.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return false;
  const birthYear = Number(normalized.slice(0, 4));
  return Number.isInteger(birthYear) && birthYear >= pricing.birth_year_from;
}

function discountedPriceSek(priceSek: number, discountPct: number) {
  const safePrice = Math.max(0, Number(priceSek) || 0);
  const safeDiscount = Math.min(100, Math.max(0, Number(discountPct) || 0));
  return Math.round(safePrice * (100 - safeDiscount) / 100);
}

function fmtOpens(iso: string, lang: Lang) {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  }).format(parsed);
}

export default function SignupFormClient() {
  const [lang, setLang] = useState<Lang>("sv");
  const t = STR[lang];

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<Config | null>(null);
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [mine, setMine] = useState<MineState | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [viewerIsTester, setViewerIsTester] = useState(false);
  const [membershipConfirmed, setMembershipConfirmed] = useState<boolean | null>(null);

  const [busy, setBusy] = useState(false);
  // Read-only-first (Henric, 2026-07-18): an existing registration OPENS as a
  // read-only view; editing is an explicit separate step into the form.
  const [editing, setEditing] = useState(false);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<"created" | "updated" | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState<"M" | "W" | null>(null);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [sessions, setSessions] = useState(1);
  const [anySlot, setAnySlot] = useState(false);
  const [primarySlots, setPrimarySlots] = useState<string[]>([]);
  const [secondarySlots, setSecondarySlots] = useState<string[]>([]);
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [paymentAck, setPaymentAck] = useState(false);
  const [cancellationAck, setCancellationAck] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [pilotFeedbackRating, setPilotFeedbackRating] = useState<PilotFeedbackRating | null>(null);
  const [pilotFeedbackComment, setPilotFeedbackComment] = useState("");

  const applySubmission = useCallback((sub: Submission) => {
    setFirstName(sub.first_name ?? "");
    setLastName(sub.last_name ?? "");
    setEmail(sub.email ?? "");
    setBirthdate(sub.birthdate ?? "");
    setGender(sub.gender ?? null);
    setPhone(sub.phone ?? "");
    setDescription(sub.player_description ?? "");
    setSessions(sub.sessions_per_week);
    setAnySlot(sub.any_slot);
    setPrimarySlots(sub.slot_prefs.filter((p) => p.priority === 1).map((p) => p.slot_key));
    setSecondarySlots(sub.slot_prefs.filter((p) => p.priority === 2).map((p) => p.slot_key));
    setWishes(sub.wishes.filter((w) => WISH_ORDER.includes(w.wish_type)).map((w) => ({
      id: newWishId(), kind: w.kind, wishType: w.wish_type,
      targetPlayerId: w.target_player_id, targetName: w.target_name,
      freeText: w.free_text ?? "",
    })));
    setPaymentAck(sub.payment_ack);
    setCancellationAck(sub.cancellation_ack);
    setNewsletterOptIn(sub.newsletter_opt_in);
    setPilotFeedbackRating(sub.pilot_feedback_rating);
    setPilotFeedbackComment(sub.pilot_feedback_comment ?? "");
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setEditing(false);
    try {
      const cfg = await api<Config>("/api/signup/config").catch(() => null);
      setConfig(cfg);
      const session = await api<{ authenticated: boolean; profile?: { name?: string | null; is_app_tester?: boolean } }>(
        "/api/account/session",
      ).catch(() => null);
      if (session?.authenticated) {
        setAuthed(true);
        setAccountName(session.profile?.name ?? null);
        setViewerIsTester(!!session.profile?.is_app_tester);
        const [pf, mineState, membershipFeed] = await Promise.all([
          api<Prefill>("/api/signup/prefill").catch(() => null),
          api<MineState>("/api/signup/mine").catch(() => null),
          api<MembershipFeed>("/api/account/membership").catch(() => null),
        ]);
        setMembershipConfirmed((membershipFeed?.activeCount ?? 0) > 0);
        if (pf) {
          setPrefill(pf);
          setFirstName(pf.first_name ?? "");
          setLastName(pf.last_name ?? "");
          setEmail(pf.email ?? "");
          setBirthdate(pf.birthdate ?? "");
          setGender(pf.gender ?? null);
          setPhone(pf.phone ?? "");
          setDescription(pf.description ?? "");
        }
        setMine(mineState);
        if (mineState?.submission) {
          applySubmission(mineState.submission);
          // Identity is PROFILE-authoritative (printed read-only): re-apply
          // it over the stored submission's copy so the display always shows
          // current profile data — the server stores the same on save.
          if (pf) {
            setFirstName(pf.first_name ?? "");
            setLastName(pf.last_name ?? "");
            setEmail(pf.email ?? "");
            if (pf.birthdate) setBirthdate(pf.birthdate);
            if (pf.gender) setGender(pf.gender);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [applySubmission]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const existing = mine?.submission ?? null;
  const readOnly = !!existing && mine?.can_edit === false;
  // Fail CLOSED against a legacy/partial API: v3 also carries the
  // server-authoritative pilot-feedback requirement.
  const SIGNUP_CONFIG_VERSION = 3;
  const gateAware = (config?.config_version ?? 0) >= SIGNUP_CONFIG_VERSION;
  // Who may sign up: publicly open (everyone), or an app-tester during the
  // pre-launch preview. The API enforces this too — this only governs the UI.
  const canSignup = !!config && gateAware && (config.is_open || (config.preview_open && viewerIsTester));

  const title = (lang === "en" && config?.config?.title_en) || config?.title || "";
  const intro = (lang === "en" && config?.config?.intro_en) || config?.intro_md || "";
  const multiNote = (lang === "en" && config?.config?.multi_session_note_en) || config?.config?.multi_session_note || "";
  const maxWishes = Number(config?.config?.max_wishes ?? 5);
  const maxDemands = Number(config?.config?.max_demands ?? 5);
  const juniorPricing = config?.junior_pricing ?? DEFAULT_JUNIOR_PRICING;
  const hasJuniorDiscount = juniorDiscountApplies(birthdate, juniorPricing);
  const juniorDiscountPct = hasJuniorDiscount ? juniorPricing.discount_pct : 0;
  const showJuniorMembershipNotice = hasJuniorDiscount
    && juniorPricing.membership_required
    && membershipConfirmed !== true;
  const wishCount = wishes.filter((w) => w.kind === "wish").length;
  const demandCount = wishes.filter((w) => w.kind === "demand").length;

  const slotsByDay = useMemo(() => {
    const m: Record<number, Slot[]> = {};
    (config?.slots ?? []).forEach((s) => { (m[s.day_of_week] ??= []).push(s); });
    return m;
  }, [config]);
  const dayOrder = useMemo(() => Object.keys(slotsByDay).map(Number).sort((a, b) => a - b), [slotsByDay]);
  const slotDay = useMemo(
    () => Object.fromEntries((config?.slots ?? []).map((s) => [s.key, s.day_of_week])),
    [config],
  );
  const primaryDayCount = useMemo(
    () => new Set(primarySlots.map((k) => slotDay[k])).size,
    [primarySlots, slotDay],
  );
  const secondaryEnabled = !anySlot && primarySlots.length >= 1;
  const slotsOk = anySlot || primaryDayCount >= sessions;
  const birthdateValid = /^\d{4}-\d{2}-\d{2}$/.test(birthdate.trim());
  const identityOk = !!(firstName.trim() && lastName.trim() && email.trim() && birthdateValid && gender);
  const acksOk = paymentAck && cancellationAck;
  const descriptionOk = !!description.trim();
  const pilotFeedbackOk = !config?.pilot_feedback_required
    || (!!pilotFeedbackRating && pilotFeedbackComment.trim().length > 0);
  const canSubmit = identityOk && descriptionOk && acksOk && slotsOk && pilotFeedbackOk;

  const togglePrimary = useCallback((key: string) => {
    setPrimarySlots((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    setSecondarySlots((prev) => prev.filter((k) => k !== key));
  }, []);
  const toggleSecondary = useCallback((key: string) => {
    if (primarySlots.includes(key)) return;
    setSecondarySlots((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, [primarySlots]);

  const toggleAnySlot = useCallback(() => {
    setAnySlot((current) => {
      const next = !current;
      if (next) {
        setPrimarySlots([]);
        setSecondarySlots([]);
      }
      return next;
    });
  }, []);

  const addWishRow = useCallback((kind: WishKind) => {
    setWishes((prev) => [...prev, { id: newWishId(), kind, wishType: "", targetPlayerId: null, targetName: null, freeText: "" }]);
  }, []);
  const updateWish = useCallback((id: string, patch: Partial<WishRow>) => {
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);
  const removeWish = useCallback((id: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const corrections = useMemo(() => {
    if (!prefill) return null;
    const c: Record<string, unknown> = {};
    if ((prefill.first_name ?? "") !== firstName) c.first_name = { from: prefill.first_name, to: firstName };
    if ((prefill.last_name ?? "") !== lastName) c.last_name = { from: prefill.last_name, to: lastName };
    if ((prefill.email ?? "") !== email) c.email = { from: prefill.email, to: email };
    if ((prefill.birthdate ?? "") !== birthdate) c.birthdate = { from: prefill.birthdate, to: birthdate };
    if ((prefill.gender ?? null) !== gender) c.gender = { from: prefill.gender, to: gender };
    if ((prefill.phone ?? "") !== phone) c.phone = { from: prefill.phone, to: phone };
    return Object.keys(c).length ? c : null;
  }, [prefill, firstName, lastName, email, birthdate, gender, phone]);

  const submit = useCallback(async () => {
    setError("");
    if (!identityOk) { setError(t.errIdentity); return; }
    if (!descriptionOk) { setError(t.errDescription); return; }
    if (!acksOk) { setError(t.errAcks); return; }
    if (!slotsOk) { setError(t.errSlots(sessions)); return; }
    if (!pilotFeedbackOk) { setError(t.errPilotFeedback); return; }

    const cleanWishes = wishes
      .filter((w) => !!w.wishType)
      .filter((w) => WISH_ORDER.includes(w.wishType as WishType))
      .filter((w) => w.wishType !== "free_text" || w.freeText.trim())
      .filter((w) => !PLAYER_TYPES.includes(w.wishType as WishType)
        || w.targetPlayerId || (w.targetName ?? "").trim())
      .map((w) => ({
        kind: w.kind, wish_type: w.wishType,
        target_player_id: w.targetPlayerId, target_name: w.targetName,
        free_text: w.freeText.trim() || null,
      }));
    const slotPrefs = anySlot ? [] : [
      ...primarySlots.map((k) => ({ priority: 1, slot_key: k })),
      ...secondarySlots.filter((k) => !primarySlots.includes(k)).map((k) => ({ priority: 2, slot_key: k })),
    ];

    setBusy(true);
    try {
      const wasUpdate = !!existing;
      await api("/api/signup/submit", {
        method: "POST",
        body: JSON.stringify({
          season_id: config?.season_id,
          source: "web",
          // Identity is profile-authoritative server-side — these merely
          // echo the printed values (and fill birthdate/gender gaps).
          first_name: firstName.trim(), last_name: lastName.trim(), email: email.trim(),
          birthdate: birthdate.trim(), gender,
          // Address fields are hidden (unused — master has no address data);
          // nulls are PATCH-preserved server-side.
          phone: phone.trim() || null,
          player_description: description.trim() || null,
          sessions_per_week: sessions, any_slot: anySlot, language_pref: null,
          newsletter_opt_in: newsletterOptIn,
          payment_ack: paymentAck, cancellation_ack: cancellationAck,
          pilot_feedback_rating: config?.pilot_feedback_required ? pilotFeedbackRating : null,
          pilot_feedback_comment: config?.pilot_feedback_required ? pilotFeedbackComment.trim() : null,
          slot_prefs: slotPrefs, wishes: cleanWishes,
          prefill_corrections: corrections,
        }),
      });
      setDone(wasUpdate ? "updated" : "created");
      window.scrollTo({ top: 0 });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.genericError);
    } finally {
      setBusy(false);
    }
  }, [identityOk, descriptionOk, acksOk, slotsOk, pilotFeedbackOk, t, sessions, wishes, primarySlots, secondarySlots,
    existing, config, firstName, lastName, email, birthdate, gender, phone,
    description, anySlot, newsletterOptIn, paymentAck,
    cancellationAck, pilotFeedbackRating, pilotFeedbackComment, corrections]);

  const cancelSignup = useCallback(async () => {
    if (!window.confirm(t.cancelConfirm)) return;
    setCancelBusy(true);
    setError("");
    try {
      await api("/api/signup/cancel", { method: "POST" });
      const mineState = await api<MineState>("/api/signup/mine").catch(() => null);
      setMine(mineState);
      window.scrollTo({ top: 0 });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.genericError);
    } finally {
      setCancelBusy(false);
    }
  }, [t]);

  const langRow = (
    <div className="mb-6 flex gap-2">
      {(["sv", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`min-h-11 flex-1 cursor-pointer border px-4 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
            lang === l ? "border-black bg-black text-lime" : "border-black/20 bg-white text-black/60 hover:text-black"
          }`}
        >
          {l === "sv" ? "Svenska" : "English"}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return <div className={`${cardCls} text-black/50`}>{t.loading}</div>;
  }

  if (!config) {
    return (
      <div>
        {langRow}
        <div className={`${cardCls} text-black/60`}>{t.noOpen}</div>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        {langRow}
        <div className={`${cardCls} text-center`}>
          <p className="font-display text-3xl uppercase text-black">
            {done === "updated" ? t.updatedTitle : t.thanksTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-black/60">
            {done === "updated" ? t.updatedBody : t.thanksBody}
          </p>
          {!authed ? (
            <p className="mt-4 border-t border-black/10 pt-4 text-sm leading-relaxed text-black/55">
              {t.thanksEditNote}{" "}
              <Link href="/konto" className="font-semibold text-teal underline underline-offset-4">
                {t.loginCta} →
              </Link>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => { setDone(null); load(); }}
              className="mt-5 inline-flex cursor-pointer text-xs font-bold uppercase tracking-[0.08em] text-teal underline underline-offset-4"
            >
              {t.backToForm}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Admin has locked edits — the registration is read-only.
  if (readOnly && existing) {
    return (
      <div>
        {langRow}
        <div className="mb-6 border-l-4 border-orange bg-orange/10 p-5">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-orange">{t.lockedTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-black/70">
            {t.lockedBody(mine?.contact_email ?? "mattias@thebeach.one")}
          </p>
        </div>
        <ReadOnlySummary sub={existing} config={config} t={t} />
      </div>
    );
  }

  // Pre-launch preview and this viewer isn't a tester → "opens 1 Aug".
  // Only when the server speaks the gate contract (fail closed otherwise).
  if (!canSignup && !existing && gateAware && config.preview_open) {
    return (
      <div>
        {langRow}
        <div className={cardCls}>
          <p className="font-display text-2xl uppercase text-black">{t.previewTitle}</p>
          <p className={hintCls}>{t.previewBody}</p>
          {mine?.last_cancelled ? (
            <p className={hintCls}>{t.cancelledBanner(fmtDate(mine.last_cancelled.cancelled_at), false)}</p>
          ) : null}
          {!authed ? (
            <p className="mt-4 border-t border-black/10 pt-4 text-sm text-black/55">
              {t.previewLoginHint}{" "}
              <Link href="/konto" className="font-semibold text-teal underline underline-offset-4">{t.loginCta} →</Link>
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  // Signup closed and nothing to edit.
  if (!canSignup && !existing) {
    const opensInFuture = config.before_open && !!config.opens_at;
    return (
      <div>
        {langRow}
        <div className={`${cardCls}`}>
          <p className="font-display text-2xl uppercase text-black">
            {opensInFuture ? t.opensLater(fmtOpens(config.opens_at as string, lang)) : t.closed}
          </p>
          {mine?.last_cancelled ? (
            <p className={hintCls}>{t.cancelledBanner(fmtDate(mine.last_cancelled.cancelled_at), false)}</p>
          ) : !opensInFuture ? (
            <p className={hintCls}>{t.noOpen}</p>
          ) : null}
          {!authed ? (
            <p className="mt-4 border-t border-black/10 pt-4 text-sm text-black/55">
              {t.loginNudge}{" "}
              <Link href="/konto" className="font-semibold text-teal underline underline-offset-4">{t.loginCta} →</Link>
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  // PROFILE-FIRST (Henric, 2026-07-18): the flow is register/log in on your
  // Beach profile, THEN sign up — no anonymous form. The API enforces the
  // same (submit requires a verified bearer); this is the friendly half.
  if (!authed) {
    return (
      <div>
        {langRow}
        {!!title && <h2 className="mb-2 font-display text-3xl uppercase text-black">{title}</h2>}
        {!!intro && <p className="mb-6 text-[15px] leading-relaxed text-black/70">{intro}</p>}
        <div className={cardCls}>
          <p className="font-display text-2xl uppercase text-black">{t.profileFirstTitle}</p>
          <p className={hintCls}>{t.profileFirstIntro}</p>
          <ol className="mt-5 space-y-3">
            {[t.profileFirstStep1, t.profileFirstStep2].map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center bg-black font-display text-sm text-lime">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-black/70">{step}</span>
              </li>
            ))}
          </ol>
          <Link
            href="/konto?next=/anmalan"
            className="mt-6 inline-flex min-h-12 items-center justify-center bg-black px-6 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-teal"
          >
            {t.profileFirstCta} →
          </Link>
        </div>
      </div>
    );
  }

  // Read-only-first (Henric, 2026-07-18): an existing registration OPENS as
  // a read-only view; the form is a separate, explicit "Ändra" step.
  if (existing && !editing) {
    return (
      <div>
        {langRow}
        {!!title && <h2 className="mb-2 font-display text-3xl uppercase text-black">{title}</h2>}
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-black/45">
          {t.loggedInAs(accountName || email || "–")}
        </p>
        <div className="mb-6 border border-teal/25 bg-mint p-5 text-sm leading-relaxed text-teal">
          {t.viewBanner(fmtDate(existing.created_at))}
          {existing.is_changed && existing.changed_at ? ` ${t.changedNote(fmtDate(existing.changed_at) as string)}` : ""}
        </div>
        <ReadOnlySummary sub={existing} config={config} t={t} />
        {error ? (
          <p role="alert" className="mt-4 border border-orange/30 bg-orange/10 p-4 text-sm font-semibold text-orange">{error}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => { setError(""); setEditing(true); }}
            className="inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 bg-black px-9 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
          >
            {t.editBtn} <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            onClick={cancelSignup}
            disabled={cancelBusy}
            className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center border border-orange px-6 text-xs font-bold uppercase tracking-[0.08em] text-orange transition-colors hover:bg-orange hover:text-white disabled:cursor-wait disabled:opacity-50"
          >
            {cancelBusy ? t.cancelling : t.cancelBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {langRow}

      {!!title && <h2 className="mb-2 font-display text-3xl uppercase text-black">{title}</h2>}
      {!!intro && <p className="mb-6 text-[15px] leading-relaxed text-black/70">{intro}</p>}

      <p className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-black/45">
        {t.loggedInAs(accountName || email || "–")}
      </p>

      {existing ? (
        <div className="mb-6 border border-teal/25 bg-mint p-5 text-sm leading-relaxed text-teal">
          <p>
            {t.editBanner(fmtDate(existing.created_at))}
            {existing.is_changed && existing.changed_at ? ` ${t.changedNote(fmtDate(existing.changed_at) as string)}` : ""}
          </p>
          <button
            type="button"
            onClick={() => { setError(""); setEditing(false); }}
            className="mt-2 cursor-pointer text-xs font-bold uppercase tracking-[0.08em] text-teal underline underline-offset-4"
          >
            {t.backToView}
          </button>
        </div>
      ) : mine?.last_cancelled ? (
        <div className="mb-6 border border-teal/25 bg-mint p-5 text-sm leading-relaxed text-teal">
          {t.cancelledBanner(fmtDate(mine.last_cancelled.cancelled_at), config.is_open)}
        </div>
      ) : null}

      <div className="space-y-6">
        {/* Identity — PRINTED from the Beach profile, not editable here.
            Only genuine profile gaps (birthdate/gender a fresh web account
            lacks) render as inputs; the server enforces the same contract. */}
        <section className={cardCls}>
          <h3 className={headingCls}>{t.detailsTitle}</h3>
          <p className={`${hintCls} mb-6`}>{t.detailsHint}</p>
          {!firstName.trim() || !lastName.trim() ? (
            <div className="mb-5 border-l-4 border-orange bg-orange/10 p-4">
              <p className="text-sm font-bold text-orange">{t.nameMissingTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-black/70">
                {t.nameMissingBody}{" "}
                <Link href="/konto?next=/anmalan" className="font-semibold text-teal underline underline-offset-4">
                  {t.updateProfileLink} →
                </Link>
              </p>
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className={labelCls}>{t.firstName}</span>
              <p className="min-h-6 text-[15px] font-semibold text-black">{firstName || "–"}</p>
            </div>
            <div>
              <span className={labelCls}>{t.lastName}</span>
              <p className="min-h-6 text-[15px] font-semibold text-black">{lastName || "–"}</p>
            </div>
            <div>
              <span className={labelCls}>{t.email}</span>
              <p className="min-h-6 text-[15px] font-semibold text-black">{email || "–"}</p>
            </div>
            {prefill?.birthdate ? (
              <div>
                <span className={labelCls}>{t.birthdate}</span>
                <p className="min-h-6 text-[15px] font-semibold text-black">{birthdate || "–"}</p>
              </div>
            ) : (
              <div>
                <label htmlFor="su-birth" className={labelCls}>{t.birthdate} (ÅÅÅÅ-MM-DD) *</label>
                <input id="su-birth" className={inputCls} value={birthdate} onChange={(e) => setBirthdate(e.target.value)} placeholder="1990-05-15" inputMode="numeric" />
              </div>
            )}
          </div>
          {prefill?.gender ? (
            <div className="mt-4">
              <span className={labelCls}>{t.iAm}</span>
              <p className="min-h-6 text-[15px] font-semibold text-black">{gender === "W" ? t.woman : gender === "M" ? t.man : "–"}</p>
            </div>
          ) : (
            <div className="mt-4">
              <span className={labelCls}>{t.iAm} *</span>
              <div className="flex gap-2">
                {([["W", t.woman], ["M", t.man]] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGender(value)}
                    className={`min-h-12 flex-1 cursor-pointer border text-sm font-semibold transition-colors ${
                      gender === value ? "border-black bg-black text-lime" : "border-black/15 bg-white text-black hover:border-black"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Plain /konto (no ?next): a named profile would bounce straight
              back before the user could edit anything. */}
          <p className="mt-5 border-t border-black/10 pt-4 text-xs leading-relaxed text-black/50">
            {t.fromProfileHint}{" "}
            <Link href="/konto" className="font-semibold text-teal underline underline-offset-4">
              {t.updateProfileLink} →
            </Link>
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="su-phone" className={labelCls}>{t.phone}</label>
              <input id="su-phone" type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phonePh} autoComplete="tel" />
            </div>
          </div>
        </section>

        {/* About */}
        <section className={cardCls}>
          <h3 className={headingCls}>{t.aboutTitle}</h3>
          <p className={`${hintCls} mb-6`}>{t.aboutHint}</p>
          <label htmlFor="su-desc" className={labelCls}>{t.describe} *</label>
          <textarea
            id="su-desc"
            className={`${inputCls} min-h-[110px] resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.describePh}
          />
        </section>

        {/* Sessions per week */}
        <section className={cardCls}>
          <h3 className={headingCls}>{t.sessionsTitle}</h3>
          {!!multiNote && <p className={`${hintCls} mb-6`}>{multiNote}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from({ length: config.max_sessions_per_week }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSessions(n)}
                className={`min-h-12 flex-1 cursor-pointer border px-3 text-sm font-semibold transition-colors ${
                  sessions === n ? "border-black bg-black text-lime" : "border-black/15 bg-white text-black hover:border-black"
                }`}
              >
                {t.sessionUnit(n)}
              </button>
            ))}
          </div>
        </section>

        {/* Slots */}
        <section className={cardCls}>
          <h3 className={headingCls}>{t.timesTitle}</h3>
          <p className={`${hintCls} mb-5`}>{t.timesHint}</p>
          <h4 className="text-[15px] font-bold text-black">{t.anySlotTitle}</h4>
          <p className="mb-3 mt-1 text-[13px] leading-relaxed text-black/55">{t.anySlotDescription}</p>
          <CheckRow checked={anySlot} onToggle={toggleAnySlot} label={t.anySlotLabel} />

          <div className="my-6 border-t border-black/15" />

          <div className="flex items-start justify-between gap-3">
            <h4 className={`text-[15px] font-bold ${anySlot ? "text-black/35" : "text-black"}`}>{t.firstChoice}</h4>
            {!anySlot ? (
              <span className="shrink-0 bg-mint px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-teal">
                {t.primaryStatus(primaryDayCount)}
              </span>
            ) : null}
          </div>
          <p className="mb-3 text-[13px] leading-relaxed text-black/50">
            {anySlot ? t.anyChosenHelp : t.primaryHelp}
          </p>
          <SlotPicker
            slotsByDay={slotsByDay} dayOrder={dayOrder} t={t} lang={lang}
            isSelected={(s) => primarySlots.includes(s.key)}
            isDisabled={() => anySlot}
            isStruck={() => anySlot}
            discountPct={juniorDiscountPct}
            onToggle={togglePrimary}
          />

          <div className="my-6 border-t border-black/15" />

          <h4 className={`text-[15px] font-bold ${(anySlot || !secondaryEnabled) ? "text-black/35" : "text-black"}`}>
            {t.secondChoice}
          </h4>
          <p className={`mb-3 mt-1 text-[13px] leading-relaxed ${anySlot ? "text-black/30" : "text-black/50"}`}>
            {t.secondaryHelp}
          </p>
          {(secondaryEnabled || anySlot) ? (
            <>
              <SlotPicker
                slotsByDay={slotsByDay} dayOrder={dayOrder} t={t} lang={lang}
                isSelected={(s) => secondarySlots.includes(s.key)}
                isDisabled={() => anySlot}
                isStruck={(s) => anySlot || primarySlots.includes(s.key)}
                discountPct={juniorDiscountPct}
                onToggle={toggleSecondary}
              />
            </>
          ) : (
            <p className="text-[13px] text-black/45">{t.secondaryLocked}</p>
          )}
        </section>

        {/* Wishes */}
        <section className={cardCls}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={headingCls}>{t.wishesTitle}</h3>
            <span className="bg-mint px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-teal">
              {t.wishesBadge}
            </span>
          </div>
          <p className={`${hintCls} mb-4`}>{t.wishesHint(maxWishes)}</p>
          <div className="mb-4 border border-teal/20 bg-mint p-4 text-[13px] leading-relaxed text-teal">{t.wishesDisc}</div>
          <div className="space-y-3">
            {wishes.filter((w) => w.kind === "wish").map((w) => (
              <WishEditor key={w.id} wish={w} t={t} onChange={updateWish} onRemove={removeWish} />
            ))}
          </div>
          {wishCount < maxWishes && (
            <button type="button" onClick={() => addWishRow("wish")}
              className="mt-3 w-full cursor-pointer border border-dashed border-teal bg-mint px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-teal transition-colors hover:bg-teal hover:text-white">
              {t.addWish}
            </button>
          )}
        </section>

        {/* Demands */}
        <section className={cardCls}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={headingCls}>{t.demandsTitle}</h3>
            <span className="bg-orange/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-orange">
              {t.demandsBadge}
            </span>
          </div>
          <p className={`${hintCls} mb-4`}>{t.demandsHint(maxDemands)}</p>
          <div className="mb-4 border-l-4 border-orange bg-orange/10 p-4 text-[13px] leading-relaxed text-black/70">{t.demandsDisc}</div>
          <div className="space-y-3">
            {wishes.filter((w) => w.kind === "demand").map((w) => (
              <WishEditor key={w.id} wish={w} t={t} onChange={updateWish} onRemove={removeWish} />
            ))}
          </div>
          {demandCount < maxDemands && (
            <button type="button" onClick={() => addWishRow("demand")}
              className="mt-3 w-full cursor-pointer border border-dashed border-teal bg-mint px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-teal transition-colors hover:bg-teal hover:text-white">
              {t.addDemand}
            </button>
          )}
        </section>

        {/* Acknowledgements */}
        <section className={cardCls}>
          <h3 className={`${headingCls} mb-4`}>{t.confirmTitle}</h3>
          <div className="space-y-3">
            <CheckRow checked={paymentAck} onToggle={() => setPaymentAck((v) => !v)} label={t.ackPayment} />
            <CheckRow checked={cancellationAck} onToggle={() => setCancellationAck((v) => !v)} label={t.ackCancellation} />
            <CheckRow checked={newsletterOptIn} onToggle={() => setNewsletterOptIn((v) => !v)} label={t.optNewsletter} />
          </div>
        </section>

        {config.pilot_feedback_required ? (
          <section className={cardCls}>
            <h3 className={headingCls}>{t.pilotTitle}</h3>
            <p className={`${hintCls} mb-5`}>{t.pilotHint}</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                ["up", "👍", t.pilotUp],
                ["down", "👎", t.pilotDown],
              ] as const).map(([value, icon, label]) => {
                const selected = pilotFeedbackRating === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPilotFeedbackRating(value)}
                    className={`min-h-14 cursor-pointer border px-3 text-sm font-semibold transition-colors ${
                      selected
                        ? "border-black bg-black text-lime"
                        : "border-black/15 bg-white text-black hover:border-black"
                    }`}
                  >
                    <span aria-hidden="true" className="mr-2">{icon}</span>
                    {label}
                  </button>
                );
              })}
            </div>
            <label htmlFor="su-pilot-comment" className={`${labelCls} mt-5`}>
              {t.pilotComment} *
            </label>
            <textarea
              id="su-pilot-comment"
              className={`${inputCls} min-h-[110px] resize-y`}
              value={pilotFeedbackComment}
              maxLength={2000}
              onChange={(event) => setPilotFeedbackComment(event.target.value)}
              placeholder={t.pilotCommentPlaceholder}
            />
          </section>
        ) : null}

        {showJuniorMembershipNotice ? (
          <aside className="border border-orange/40 bg-orange/10 p-5 text-black" aria-live="polite">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
              {t.juniorMembershipTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-black/70">
              {t.juniorMembershipBody(
                juniorPricing.discount_pct,
                juniorPricing.membership_fee_sek,
              )}
            </p>
          </aside>
        ) : null}

        {error ? (
          <p role="alert" className="border border-orange/30 bg-orange/10 p-4 text-sm font-semibold text-orange">{error}</p>
        ) : null}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={busy || !canSubmit}
            className="inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 bg-black px-9 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? t.sending : <>{existing ? t.submitUpdate : t.submit} <span aria-hidden="true">→</span></>}
          </button>
          {!canSubmit && (
            <p className="text-center text-[13px] text-black/45">
              {!identityOk
                ? t.errIdentity
                : !descriptionOk
                  ? t.errDescription
                  : !slotsOk
                    ? t.errSlots(sessions)
                    : !acksOk
                      ? t.errAcks
                      : t.errPilotFeedback}
            </p>
          )}
          {existing ? (
            <button
              type="button"
              onClick={cancelSignup}
              disabled={cancelBusy}
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center border border-orange px-6 text-xs font-bold uppercase tracking-[0.08em] text-orange transition-colors hover:bg-orange hover:text-white disabled:cursor-wait disabled:opacity-50"
            >
              {cancelBusy ? t.cancelling : t.cancelBtn}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CheckRow({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-black/75">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-black"
      />
      {label}
    </label>
  );
}

function SlotPicker({
  slotsByDay, dayOrder, t, lang, isSelected, isDisabled, isStruck, discountPct, onToggle,
}: {
  slotsByDay: Record<number, Slot[]>; dayOrder: number[]; t: Strings; lang: Lang;
  isSelected: (s: Slot) => boolean; isDisabled: (s: Slot) => boolean;
  isStruck: (s: Slot) => boolean; discountPct?: number; onToggle: (key: string) => void;
}) {
  return (
    <div className="space-y-4">
      {dayOrder.map((day) => (
        <div key={day}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-teal">
            {t.days[day] ?? `Dag ${day}`}
          </p>
          <div className="space-y-2">
            {(slotsByDay[day] ?? []).map((s) => {
              const on = isSelected(s);
              const struck = isStruck(s);
              const disabled = isDisabled(s) || struck;
              const note = (lang === "en" && s.note_en) || s.note;
              const discountedPrice = discountPct
                ? discountedPriceSek(s.price_sek, discountPct)
                : null;
              return (
                <button
                  key={s.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => onToggle(s.key)}
                  className={`flex w-full items-center gap-3 border px-4 py-3.5 text-left text-sm transition-colors ${
                    on ? "border-black bg-black text-cream"
                      : disabled ? "cursor-not-allowed border-black/10 bg-black/[0.03] text-black/35"
                      : "cursor-pointer border-black/15 bg-white text-black hover:border-black"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`grid h-5 w-5 shrink-0 place-items-center border text-[11px] font-bold ${
                      on ? "border-lime bg-lime text-black" : "border-black/25 bg-white"
                    }`}
                  >
                    {on ? "✓" : ""}
                  </span>
                  <span className={`flex-1 ${struck ? "line-through" : ""}`}>
                    <span className="block font-semibold">{s.time_label ?? s.start_time}</span>
                    {note ? <span className={`mt-0.5 block text-[11px] ${on ? "text-cream/70" : "text-black/45"}`}>{note}</span> : null}
                  </span>
                  <span className="shrink-0 text-right text-[13px]">
                    {discountedPrice !== null ? (
                      <>
                        <span className={`block text-[11px] line-through ${on ? "text-cream/55" : "text-black/40"}`}>
                          {s.price_sek} kr
                        </span>
                        <span className={`block font-bold ${struck ? "line-through" : ""} ${on ? "text-lime" : "text-orange"}`}>
                          {discountedPrice} kr
                        </span>
                      </>
                    ) : (
                      <span className={`${struck ? "line-through" : ""} ${on ? "text-cream/80" : "text-black/50"}`}>
                        {s.price_sek} kr
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function WishEditor({ wish, t, onChange, onRemove }: {
  wish: WishRow; t: Strings;
  onChange: (id: string, patch: Partial<WishRow>) => void; onRemove: (id: string) => void;
}) {
  const isPlayer = !!wish.wishType && PLAYER_TYPES.includes(wish.wishType as WishType);
  const isFree = wish.wishType === "free_text";
  return (
    <div className="relative border border-black/15 bg-cream p-4">
      <button
        type="button"
        onClick={() => onRemove(wish.id)}
        aria-label="Ta bort"
        className="absolute right-2 top-2 cursor-pointer px-2 text-lg leading-none text-orange hover:text-black"
      >
        ×
      </button>
      <select
        value={wish.wishType}
        onChange={(e) => onChange(wish.id, {
          wishType: e.target.value as WishType | "",
          targetPlayerId: null, targetName: null, freeText: "",
        })}
        className={`${inputCls} cursor-pointer pr-8`}
      >
        <option value="" disabled>
          {wish.kind === "demand" ? t.selectDemandType : t.selectWishType}
        </option>
        {WISH_ORDER.map((wt) => (
          <option key={wt} value={wt}>{t.wishTypes[wt]}</option>
        ))}
      </select>
      {isPlayer ? (
        <PlayerSearch
          t={t}
          chosenName={wish.targetName}
          chosenManual={!wish.targetPlayerId && !!wish.targetName}
          onPick={(p) => onChange(wish.id, { targetPlayerId: p.id, targetName: p.name })}
          onManual={(name) => onChange(wish.id, { targetPlayerId: null, targetName: name })}
          onClear={() => onChange(wish.id, { targetPlayerId: null, targetName: null })}
        />
      ) : null}
      {isFree ? (
        <input
          className={`${inputCls} mt-3`}
          value={wish.freeText}
          onChange={(e) => onChange(wish.id, { freeText: e.target.value })}
          placeholder={t.freeTextPh}
        />
      ) : null}
    </div>
  );
}

function PlayerSearch({ t, chosenName, chosenManual, onPick, onManual, onClear }: {
  t: Strings; chosenName: string | null; chosenManual: boolean;
  onPick: (p: SearchResult) => void; onManual: (name: string) => void; onClear: () => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualName, setManualName] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const reset = () => { setQ(""); setResults([]); setSearched(false); setManualMode(false); setManualName(""); };

  const onChangeQ = (text: string) => {
    setQ(text);
    setManualMode(false);
    if (timer.current) clearTimeout(timer.current);
    if (text.trim().length < 2) { setResults([]); setSearched(false); return; }
    timer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await api<{ results: SearchResult[] }>(
          `/api/signup/search-players?q=${encodeURIComponent(text.trim())}`,
        );
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      }
      setSearching(false);
      setSearched(true);
    }, 250);
  };

  if (chosenName) {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="inline-flex bg-teal px-3 py-1.5 text-sm font-bold text-white">{chosenName}</span>
        {chosenManual ? <span className="text-[11px] text-black/45">({t.otherPlayerNote})</span> : null}
        <button type="button" onClick={() => { onClear(); reset(); }}
          className="cursor-pointer text-xs font-bold uppercase tracking-[0.08em] text-teal underline underline-offset-4">
          {t.change}
        </button>
      </div>
    );
  }

  const nameCounts: Record<string, number> = {};
  results.forEach((p) => { nameCounts[p.name] = (nameCounts[p.name] ?? 0) + 1; });

  return (
    <div className="mt-3">
      <input className={inputCls} value={q} onChange={(e) => onChangeQ(e.target.value)}
        placeholder={t.searchPh} autoComplete="off" />
      {searching ? <p className="mt-1 text-xs text-black/45">{t.searching}</p> : null}
      {results.length > 0 ? (
        <div className="mt-1 max-h-56 overflow-auto border border-black/15 bg-white">
          {results.map((p) => {
            const showAge = nameCounts[p.name] > 1 && p.age != null;
            return (
              <button key={p.id} type="button" onClick={() => { onPick(p); reset(); }}
                className="block w-full cursor-pointer border-b border-black/5 px-4 py-2.5 text-left text-sm text-black hover:bg-mint">
                {p.name}
                {showAge ? <span className="text-black/45">{`  ·  ${t.ageUnit(p.age as number)}`}</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
      {searched && !searching && !manualMode ? (
        <button type="button" onClick={() => { setManualMode(true); setManualName(""); }}
          className="mt-2 cursor-pointer border border-dashed border-teal bg-mint px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-teal">
          {t.otherPlayer}
        </button>
      ) : null}
      {manualMode ? (
        <div className="mt-2 flex gap-2">
          <input className={`${inputCls} flex-1`} value={manualName}
            onChange={(e) => setManualName(e.target.value)} placeholder={t.manualNameLabel}
            onKeyDown={(e) => {
              if (e.key === "Enter" && manualName.trim()) { e.preventDefault(); onManual(manualName.trim()); reset(); }
            }} />
          <button type="button" disabled={!manualName.trim()}
            onClick={() => { if (manualName.trim()) { onManual(manualName.trim()); reset(); } }}
            className="cursor-pointer bg-teal px-4 text-xs font-bold uppercase text-white disabled:opacity-40">
            {t.manualAdd}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ReadOnlySummary({ sub, config, t }: { sub: Submission; config: Config; t: Strings }) {
  const slotByKey = Object.fromEntries((config.slots ?? []).map((s) => [s.key, s]));
  const slotLabel = (key: string) => {
    const s = slotByKey[key];
    if (!s) return key;
    return `${t.days[s.day_of_week] ?? ""} ${s.time_label ?? s.start_time}`.trim();
  };
  const primary = sub.slot_prefs.filter((p) => p.priority === 1).map((p) => slotLabel(p.slot_key));
  const secondary = sub.slot_prefs.filter((p) => p.priority === 2).map((p) => slotLabel(p.slot_key));
  const row = (label: string, value: string | null | undefined) =>
    value ? (
      <div key={label} className="border-b border-black/5 py-2.5 last:border-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-teal">{label}</span>
        <span className="mt-0.5 block whitespace-pre-line text-sm text-black">{value}</span>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <section className={cardCls}>
        <h3 className={headingCls}>{t.detailsTitle}</h3>
        <p className={`${hintCls} mb-4`}>{t.roSubmitted(fmtDate(sub.created_at))}</p>
        {row(t.firstName, sub.first_name)}
        {row(t.lastName, sub.last_name)}
        {row(t.email, sub.email)}
        {row(t.birthdate, sub.birthdate)}
        {row(t.iAm, sub.gender === "W" ? t.woman : sub.gender === "M" ? t.man : null)}
        {row(t.phone, sub.phone)}
        {row(t.address, sub.address)}
        {row(t.postcode, sub.postcode)}
        {row(t.city, sub.city)}
        {row(t.describe, sub.player_description)}
      </section>
      <section className={cardCls}>
        <h3 className={`${headingCls} mb-4`}>{t.timesTitle}</h3>
        {row(t.roSessions, String(sub.sessions_per_week))}
        {sub.any_slot ? row(t.roAnySlot, "✓") : null}
        {primary.length ? row(t.firstChoice, primary.join("\n")) : null}
        {secondary.length ? row(t.secondChoice, secondary.join("\n")) : null}
      </section>
      <section className={cardCls}>
        <h3 className={`${headingCls} mb-4`}>{`${t.wishesTitle} & ${t.demandsTitle}`}</h3>
        {sub.wishes.length === 0 ? (
          <p className="text-sm text-black/50">{t.roNoWishes}</p>
        ) : (
          sub.wishes.map((w, i) => (
            <div key={i} className="border-b border-black/5 py-2.5 last:border-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-teal">
                {w.kind === "demand" ? t.demandsTitle : t.wishesTitle}
              </span>
              <span className="mt-0.5 block text-sm text-black">
                {t.wishTypes[w.wish_type] ?? w.wish_type}
                {w.target_name ? ` ${w.target_name}` : ""}
                {w.free_text ? `: ${w.free_text}` : ""}
              </span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
