"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AlternativePaymentOption,
  SwishButtonLabel,
} from "@/components/payments/PaymentMethodOptions";
import type { Locale } from "@/lib/i18n";
import { bokaDict, type BokaWidgetDict } from "@/lib/i18n/boka";
import { availableSubscriptionCredit, creditMoney, creditPriceQuoteFromWire, subscriptionCreditsFromWire, type CreditPriceQuote, type SubscriptionCreditFeed } from "@/lib/subscriptionCredit.core";
import { bookingCreditAttemptFromStorage, bookingCreditAttemptKey, type BookingCreditAttempt } from "@/lib/bookingCreditAttempt.core";

type Slot = {
  productId?: string | null;
  courtId: string;
  courtName: string;
  environment: "INDOOR" | "OUTDOOR";
  cameraEnabled: boolean;
  startTime: string;
  endTime: string;
  durationMin: number;
  priceSek: number;
  // Optional server-authored pricing metadata. `priceSek` remains the current
  // backwards-compatible contract; the browser never submits any of these
  // amounts as checkout authority.
  actualPriceSek?: number | null;
  ordinaryPriceSek?: number | null;
  originalPriceSek?: number | null;
  priceLabel?: string | null;
  discountSek?: number | null;
  discountAmountSek?: number | null;
  quoteId?: string | null;
  priceQuoteId?: string | null;
  quoteExpiresAt?: string | null;
  pricingCatalogVersion?: string | number | null;
  entitlementVersion?: string | number | null;
  available: boolean;
};
type Booking = {
  id: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING_PAYMENT" | "CONFIRMED" | "REFUND_PENDING" | "CANCELLED" | "EXPIRED";
  priceSek: number;
};
type Profile = { id: string; name: string | null; email: string; swish_phone: string | null; emoji_icon: string; avatar_thumb_url: string | null };

type ApiErrorPayload = {
  detail?: unknown;
  code?: unknown;
  errorCode?: unknown;
  conflictCode?: unknown;
  actualPriceSek?: unknown;
  priceSek?: unknown;
  quoteId?: unknown;
  quoteExpiresAt?: unknown;
};

class BookingApiError extends Error {
  constructor(readonly payload: ApiErrorPayload, fallback: string, readonly status: number) {
    const detail = payload.detail && typeof payload.detail === "object" ? payload.detail as Record<string, unknown> : {};
    super(typeof payload.detail === "string" ? payload.detail : typeof detail.message === "string" ? detail.message : fallback);
  }
}

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function api<T>(url: string, init?: RequestInit, fallback = "Något gick fel"): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  let payload: Record<string, unknown> = {};
  try { payload = await response.json() as Record<string, unknown>; } catch { /* handled below */ }
  if (!response.ok) throw new BookingApiError(payload, fallback, response.status);
  return payload as T;
}

function sek(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function actualPrice(slot: Slot): number {
  return sek(slot.actualPriceSek) ?? sek(slot.priceSek) ?? 0;
}

function ordinaryPrice(slot: Slot): number | null {
  return sek(slot.ordinaryPriceSek) ?? sek(slot.originalPriceSek);
}

function priceDiscount(slot: Slot): number | null {
  const explicit = sek(slot.discountSek) ?? sek(slot.discountAmountSek);
  if (explicit !== null && explicit > 0) return explicit;
  const ordinary = ordinaryPrice(slot);
  const actual = actualPrice(slot);
  return ordinary !== null && ordinary > actual ? ordinary - actual : null;
}

function quoteTime(value: string | null | undefined, locale: Locale): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function errorCode(error: BookingApiError): string {
  const detail = error.payload.detail && typeof error.payload.detail === "object" ? error.payload.detail as Record<string, unknown> : {};
  const value = error.payload.code ?? error.payload.errorCode ?? error.payload.conflictCode ?? detail.code;
  return typeof value === "string" ? value.toUpperCase() : "";
}

function bookingLabel(status: Booking["status"], t: BokaWidgetDict) {
  if (status === "CONFIRMED") return t.status.confirmed;
  if (status === "PENDING_PAYMENT") return t.status.pendingPayment;
  if (status === "REFUND_PENDING") return t.status.refundPending;
  if (status === "CANCELLED") return t.status.cancelled;
  return t.status.expired;
}

function shortCourt(name: string, prefix: string) {
  const number = name.match(/\d+/)?.[0];
  return number ? `${prefix} ${number}` : name;
}

function compareCourts(a: Slot, b: Slot) {
  return a.courtName.localeCompare(b.courtName, "sv-SE", {
    numeric: true,
    sensitivity: "base",
  });
}

function CameraMark({ label }: { label: string }) {
  return <span className="ml-2 inline-flex items-center border-l border-current/25 pl-2" title={label} aria-label={label}><svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="2"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg></span>;
}

// Publikt bokningsfönster: rullande idag + 7 dagar. Beslut David 2026-08-17
// (ändrat samma dag från idag + 6). Konstanten är ANTALET valbara datum i raden,
// alltså 8 rutor: idag och sju dagar framåt.
// Admin/personal bokar utan gräns via admin-konsolen — den bindande regeln ligger
// server-side i beach-booking-api. Här är bara den publika UI-gränsen, och den får
// inte visa fler dagar än venue.publicBookingDays, annars ger sista rutan 422.
const BOOKING_WINDOW_DAYS = 8;

export default function BookingWidget({ locale = "sv" }: { locale?: Locale }) {
  const t = bokaDict[locale].widget;
  const dates = useMemo(() => Array.from({ length: BOOKING_WINDOW_DAYS }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() + index); date.setHours(12, 0, 0, 0); return date;
  }), []);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [venueId, setVenueId] = useState("");
  const [date, setDate] = useState(localDate(dates[0]));
  const [hideToday, setHideToday] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selected, setSelected] = useState<Slot | null>(null);
  const [streamRequested, setStreamRequested] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [mine, setMine] = useState<Booking[]>([]);
  const [showMine, setShowMine] = useState(false);
  const [creditFeed, setCreditFeed] = useState<SubscriptionCreditFeed | null>(null);
  const [creditOwnerId, setCreditOwnerId] = useState<string | null>(null);
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditError, setCreditError] = useState(false);
  const [useStoredValue, setUseStoredValue] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState<{ creditOre: number; remainingOre: number } | null>(null);
  const [quoteRevision, setQuoteRevision] = useState(0);
  const [quotes, setQuotes] = useState<{ key: string; SWISH?: CreditPriceQuote; STRIPE?: CreditPriceQuote }>({ key: "" });
  const [quoteError, setQuoteError] = useState("");
  const [uncertainAttempt, setUncertainAttempt] = useState<BookingCreditAttempt | null>(null);
  const [attemptOwnerReady, setAttemptOwnerReady] = useState<string | null>(null);
  const pendingAttempt = useRef<BookingCreditAttempt | null>(null);
  const checkoutInFlight = useRef(false);
  const creditRequestGeneration = useRef(0);
  const currentProfileId = useRef(profile?.id);
  useLayoutEffect(() => { currentProfileId.current = profile?.id; }, [profile?.id]);
  const pollStarted = useRef(0);
  const paymentPanel = useRef<HTMLDivElement>(null);
  const bookingPath = locale === "en" ? "/en/book" : "/boka";
  const accountHref = `/konto?next=${encodeURIComponent(bookingPath)}`;
  const availableCreditOre = availableSubscriptionCredit(creditOwnerId === profile?.id ? creditFeed : null, venueId);
  const creditSelected = useStoredValue;
  const quoteKey = JSON.stringify([profile?.id, venueId, date, selected?.courtId, selected?.startTime, selected?.productId, creditSelected, availableCreditOre, quoteRevision]);
  const swishQuote = quotes.key === quoteKey ? quotes.SWISH : undefined;
  const stripeQuote = quotes.key === quoteKey ? quotes.STRIPE : undefined;
  const selectedPrice = swishQuote?.priceSek ?? (selected ? actualPrice(selected) : null);
  const fullCredit = creditSelected && swishQuote?.remainingAmountOre === 0;
  const previewCreditOre = swishQuote?.storedValueAppliedOre ?? 0;
  const previewRemainingOre = swishQuote?.remainingAmountOre ?? 0;
  const money = (amountOre: number) => creditMoney(amountOre, locale === "sv" ? "sv-SE" : "en-GB");

  const loadCredit = useCallback(async (signal?: AbortSignal) => {
    const ownerId = profile?.id;
    if (!ownerId) return;
    const generation = ++creditRequestGeneration.current;
    const stale = () => signal?.aborted || generation !== creditRequestGeneration.current || currentProfileId.current !== ownerId;
    setCreditLoading(true);
    try {
      const result = await api<unknown>("/api/account/subscriptions/credits", { cache: "no-store", signal });
      if (stale()) return;
      setCreditFeed(subscriptionCreditsFromWire(result));
      setCreditOwnerId(ownerId);
      setCreditError(false);
    } catch {
      if (stale()) return;
      setCreditFeed(null);
      setCreditError(true);
    } finally {
      if (!stale()) setCreditLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    const ownerId = profile?.id;
    creditRequestGeneration.current += 1;
    pendingAttempt.current = null;
    const timer = window.setTimeout(() => {
      setCreditFeed(null); setCreditOwnerId(null); setUseStoredValue(false); setQuotes({ key: "" });
      let restored: BookingCreditAttempt | null = null;
      if (ownerId) {
        try { restored = bookingCreditAttemptFromStorage(window.sessionStorage.getItem(bookingCreditAttemptKey(ownerId)), ownerId); } catch { /* storage may be disabled */ }
      }
      pendingAttempt.current = restored;
      setUncertainAttempt(restored);
      setAttemptOwnerReady(ownerId ?? null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [profile?.id]);

  useEffect(() => {
    if (!profile) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadCredit(controller.signal), 0);
    const refresh = () => void loadCredit(controller.signal);
    window.addEventListener("focus", refresh);
    return () => { controller.abort(); window.clearTimeout(timer); window.removeEventListener("focus", refresh); };
  }, [profile, loadCredit]);

  useEffect(() => {
    if (!selected || !venueId || !profile) return;
    const controller = new AbortController();
    const providers = stripeEnabled ? ["SWISH", "STRIPE"] as const : ["SWISH"] as const;
    void Promise.allSettled(providers.map(async (paymentProvider) => {
      const value = await api<unknown>("/api/booking/quotes", {
        method: "POST", signal: controller.signal,
        body: JSON.stringify({ venueId, courtId: selected.courtId, date, startTime: selected.startTime, productId: selected.productId, useStoredValue: creditSelected, paymentProvider }),
      }, t.genericError);
      const quote = creditPriceQuoteFromWire(value);
      if (!quote) throw new Error(t.genericError);
      return { paymentProvider, quote };
    })).then((results) => {
      if (controller.signal.aborted) return;
      const next: typeof quotes = { key: quoteKey };
      let failure = "";
      for (const result of results) {
        if (result.status === "fulfilled") next[result.value.paymentProvider] = result.value.quote;
        else failure = result.reason instanceof Error ? result.reason.message : t.genericError;
      }
      setQuotes(next);
      setQuoteError(failure);
    });
    return () => controller.abort();
  // The key includes every slot/payment input and changes immediately before a new quote is requested.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteKey, profile, stripeEnabled, t]);

  const selectCourt = (slot: Slot) => {
    setSelected(slot);
    setStreamRequested(false);
    window.requestAnimationFrame(() => {
      if (!window.matchMedia("(max-width: 1023px)").matches) return;
      paymentPanel.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const loadMine = useCallback(async () => {
    try { setMine(await api<Booking[]>("/api/booking/mine", undefined, t.genericError)); }
    catch { setMine([]); }
  }, [t]);

  const loadSlots = useCallback(async (selectedVenue: string, selectedDate: string) => {
    setLoading(true); setError(""); setSelectedTime(""); setSelected(null); setStreamRequested(false);
    try {
      const result = await api<{ slots: Slot[] }>(`/api/booking/availability?venueId=${encodeURIComponent(selectedVenue)}&date=${selectedDate}`, undefined, t.genericError);
      const available = result.slots.filter((slot) => slot.available);
      if (selectedDate === localDate(dates[0]) && available.length === 0) {
        setHideToday(true);
        setDate(localDate(dates[1]));
        setSlots([]);
        return;
      }
      setSlots(available);
    } catch (cause) {
      setSlots([]); setError(cause instanceof Error ? cause.message : t.fetchSlotsError);
    } finally { setLoading(false); }
  }, [dates, t]);

  useEffect(() => {
    (async () => {
      try {
        const [config, session] = await Promise.all([
          api<{ enabled: boolean; stripeEnabled?: boolean }>("/api/booking/config", undefined, t.genericError),
          api<{ authenticated: boolean; profile?: Profile }>("/api/account/session", undefined, t.genericError),
        ]);
        setProfile(session.authenticated ? session.profile ?? null : null);
        setAccountLoading(false);
        setEnabled(config.enabled);
        setStripeEnabled(config.stripeEnabled === true);
        if (!config.enabled) { setLoading(false); return; }
        const venues = await api<Array<{ id: string }>>("/api/booking/venues", undefined, t.genericError);
        if (!venues[0]) throw new Error(t.noVenueError);
        setVenueId(venues[0].id);
        if (session.authenticated) await loadMine();
      } catch (cause) {
        setEnabled(false); setAccountLoading(false);
        setError(cause instanceof Error ? cause.message : t.unavailableError); setLoading(false);
      }
    })();
  }, [loadMine, t]);

  useEffect(() => {
    if (!enabled || !venueId) return;
    const timer = window.setTimeout(() => loadSlots(venueId, date), 0);
    return () => window.clearTimeout(timer);
  }, [date, enabled, loadSlots, venueId]);

  useEffect(() => {
    if (!bookingId) return;
    pollStarted.current = Date.now();
    const poll = async () => {
      try {
        const result = await api<{ booking: Booking; paymentError?: string }>(`/api/booking/${bookingId}`, undefined, t.genericError);
        if (result.booking.status === "CONFIRMED") { setConfirmed(result.booking); setSubmitting(false); await Promise.all([loadMine(), loadCredit()]); return true; }
        if (["EXPIRED", "CANCELLED"].includes(result.booking.status)) { setError(result.paymentError || t.paymentFailed); setSubmitting(false); setPaymentAmounts(null); await loadCredit(); return true; }
      } catch { /* retry transient callback races */ }
      return false;
    };
    let stopped = false;
    const timer = setInterval(async () => { if (stopped || await poll() || Date.now() - pollStarted.current > 10 * 60_000) clearInterval(timer); }, 3000);
    poll();
    return () => { stopped = true; clearInterval(timer); };
  }, [bookingId, loadMine, loadCredit, t]);

  const grouped = useMemo(() => slots.reduce<Record<string, Slot[]>>((result, slot) => {
    const key = `${slot.startTime}–${slot.endTime}`; (result[key] ||= []).push(slot); return result;
  }, {}), [slots]);
  const selectedTimeSlots = selectedTime
    ? [...(grouped[selectedTime] ?? [])].sort(compareCourts)
    : [];
  const visibleDates = hideToday ? dates.slice(1) : dates;
  const todayValue = localDate(dates[0]);
  const tomorrowValue = localDate(dates[1]);

  const submitAttempt = async (attempt: BookingCreditAttempt) => {
    if (attempt.ownerId !== profile?.id || checkoutInFlight.current) return;
    checkoutInFlight.current = true;
    pendingAttempt.current = attempt;
    try { window.sessionStorage.setItem(bookingCreditAttemptKey(attempt.ownerId), JSON.stringify(attempt)); } catch { /* memory still protects this page */ }
    setSubmitting(true); setError(""); setPaymentAmounts(null);
    const clearAttempt = () => {
      pendingAttempt.current = null;
      setUncertainAttempt(null);
      try { window.sessionStorage.removeItem(bookingCreditAttemptKey(attempt.ownerId)); } catch { /* optional */ }
    };
    try {
      const result = await api<{ bookingId: string; status?: string; checkoutUrl?: string; storedValueAppliedOre?: number; remainingAmountOre?: number }>("/api/booking/checkout", { method: "POST", body: JSON.stringify(attempt.body) }, t.genericError);
      if (currentProfileId.current !== attempt.ownerId) return;
      if (attempt.body.paymentProvider === "STRIPE" && result.status !== "CONFIRMED" && !result.checkoutUrl) throw new Error(locale === "sv" ? "Betalsidan saknas" : "The payment page is missing");
      clearAttempt();
      setBookingId(result.bookingId);
      if (typeof result.storedValueAppliedOre === "number" && typeof result.remainingAmountOre === "number") {
        setPaymentAmounts({ creditOre: result.storedValueAppliedOre, remainingOre: result.remainingAmountOre });
      }
      if (attempt.body.paymentProvider === "STRIPE" && result.status !== "CONFIRMED") window.location.assign(result.checkoutUrl!);
    } catch (cause) {
      if (currentProfileId.current !== attempt.ownerId) return;
      setSubmitting(false);
      // A lost response may follow a committed reservation. Only replay the
      // exact original submission until the backend gives a definitive answer.
      const authRequired = cause instanceof BookingApiError && [401, 403].includes(cause.status);
      if (!(cause instanceof BookingApiError) || cause.status >= 500 || cause.status === 408 || authRequired) {
        setUncertainAttempt(attempt);
        if (authRequired) setError(locale === "sv" ? "Logga in igen för att kontrollera bokningsförsöket. Om åtkomsten fortfarande saknas, kontakta The Beach." : "Sign in again to check this booking attempt. If access is still unavailable, contact The Beach.");
        return;
      }
      clearAttempt();
      void loadCredit();
      setQuoteRevision((revision) => revision + 1);
      const code = errorCode(cause);
      if (["PRICE_CHANGED", "QUOTE_EXPIRED", "SLOT_TAKEN"].includes(code)) {
        await loadSlots(attempt.body.venueId, attempt.body.date);
        setError(code === "SLOT_TAKEN" ? t.pay.slotTaken : code === "QUOTE_EXPIRED" ? t.pay.quoteExpired : t.pay.priceChanged);
      } else {
        setError(cause.message);
      }
    } finally {
      checkoutInFlight.current = false;
    }
  };

  const checkout = async (paymentProvider: "SWISH" | "STRIPE") => {
    if (!selected || !venueId || !profile || attemptOwnerReady !== profile.id) return;
    if (pendingAttempt.current?.ownerId === profile.id) {
      await submitAttempt(pendingAttempt.current);
      return;
    }
    const quote = paymentProvider === "SWISH" ? swishQuote : stripeQuote;
    if (!quote || Date.parse(quote.expiresAt) <= Date.now()) {
      setQuoteRevision((revision) => revision + 1);
      setError(t.pay.quoteExpired);
      return;
    }
    if (!profile.name || (paymentProvider === "SWISH" && !fullCredit && !profile.swish_phone)) {
      setError(t.completeProfileError);
      return;
    }
    await submitAttempt({
      ownerId: profile.id, courtName: selected.courtName,
      body: { venueId, courtId: selected.courtId, date, startTime: selected.startTime, productId: selected.productId, quoteId: quote.quoteId, streamRequested, paymentProvider, useStoredValue: creditSelected, expectedStoredValueAppliedOre: quote.storedValueAppliedOre, expectedRemainingAmountOre: quote.remainingAmountOre, clientReference: `web-${window.crypto.randomUUID()}` },
    });
  };

  const cancel = async (id: string) => {
    if (!window.confirm(t.cancelConfirm)) return;
    try { await api(`/api/booking/${id}/cancel`, { method: "POST" }, t.genericError); await Promise.all([loadMine(), loadCredit()]); }
    catch (cause) { setError(cause instanceof Error ? cause.message : t.cancelError); }
  };

  if (uncertainAttempt?.ownerId === profile?.id && uncertainAttempt) return <section className="border border-orange/30 bg-white p-6 sm:p-10" role="status">
    <h3 className="font-display text-3xl">{locale === "sv" ? "Kontrollera din bokning" : "Check your booking"}</h3>
    <p className="mt-4 text-sm">{locale === "sv" ? "Vi fick inget säkert svar. Kontrollera samma bokningsförsök innan du väljer en annan tid eller betalning." : "We did not receive a confirmed response. Check the same booking attempt before choosing a different time or payment."}</p>
    <p className="mt-3 font-semibold">{uncertainAttempt.courtName} · {uncertainAttempt.body.date} · {uncertainAttempt.body.startTime}</p>
    <p className="mt-2 text-sm">{t.pay.creditApplied}: {money(uncertainAttempt.body.expectedStoredValueAppliedOre)} · {t.pay.creditRemaining}: {money(uncertainAttempt.body.expectedRemainingAmountOre)}</p>
    {error ? <div role="alert" className="mt-4 text-sm text-orange"><p>{error}</p><Link href={accountHref} className="mt-3 inline-flex min-h-11 items-center font-semibold underline">{t.pay.loginCta}</Link></div> : null}
    <button type="button" disabled={submitting} onClick={() => void submitAttempt(uncertainAttempt)} className="mt-5 min-h-12 cursor-pointer bg-black px-6 text-xs font-bold uppercase text-lime disabled:opacity-40">{submitting ? t.pay.submitting : locale === "sv" ? "Kontrollera bokningsförsöket" : "Check booking attempt"}</button>
  </section>;

  if (enabled === null) return <div className="flex min-h-72 items-center justify-center text-sm text-black/50">{t.loadingWidget}</div>;
  if (!enabled) return <div className="border border-black/10 bg-white p-7 lg:p-10"><p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">{t.pilot.tag}</p><h3 className="mb-4 font-display text-3xl text-black">{t.pilot.title}</h3><p className="max-w-2xl text-sm leading-relaxed text-black/55">{t.pilot.body}</p>{error ? <p className="mt-4 text-sm text-orange">{error}</p> : null}<a href="mailto:boka@thebeach.one" className="mt-7 inline-flex bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">{t.pilot.matchiCta}</a></div>;

  if (confirmed) return <div className="border-2 border-lime bg-white p-7 text-black lg:p-10"><span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-lime">✓</span><p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">{t.confirmedPanel.tag}</p><h3 className="font-display text-4xl">{t.confirmedPanel.title}</h3><p className="mt-4 text-black/60">{confirmed.courtName}, {confirmed.date} {t.confirmedPanel.timePrefix}{confirmed.startTime}–{confirmed.endTime}</p><p className="mt-2 font-bold">{t.confirmedPanel.paidPrefix}{confirmed.priceSek}{t.priceSuffix}</p><button type="button" onClick={() => { setConfirmed(null); setBookingId(null); setPaymentAmounts(null); setUseStoredValue(false); setShowMine(true); loadMine(); }} className="mt-7 cursor-pointer bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">{t.confirmedPanel.myBookingsCta}</button></div>;

  const profileReady = Boolean(profile?.name);
  const swishReady = Boolean(profile?.name && profile?.swish_phone);
  const selectedOrdinaryPrice = selected ? ordinaryPrice(selected) : null;
  const selectedDiscount = selected ? priceDiscount(selected) : null;
  const selectedQuoteTime = selected ? quoteTime(selected.quoteExpiresAt, locale) : null;
  const selectedPriceLabel = selected?.priceLabel?.trim()
    || (selectedOrdinaryPrice !== null && selectedPrice !== null && selectedOrdinaryPrice > selectedPrice
      ? t.pay.personalPriceFallback
      : null);
  return <div className="grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)] gap-0.5 overflow-hidden lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
    <div className="min-w-0 overflow-hidden border border-black/10 bg-white p-5 text-black sm:p-7 lg:p-10">
      <div className="mb-7 flex flex-col items-stretch gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">{t.header.tag}</p><h3 className="mt-2 font-display text-3xl">{t.header.title}</h3><p className="mt-1 text-xs text-black/45">{t.header.sub}</p></div><button type="button" onClick={() => { setShowMine(!showMine); if (!showMine && profile) loadMine(); }} className="w-full cursor-pointer border border-black px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] hover:bg-black hover:text-lime sm:w-auto sm:shrink-0">{showMine ? t.header.toggleBook : t.header.toggleMine}</button></div>
      {showMine ? (!profile ? <div className="border border-black/10 bg-cream p-6 text-center"><p className="text-sm text-black/55">{t.mine.loginPrompt}</p><Link href={accountHref} className="mt-4 inline-flex bg-black px-6 py-3 text-xs font-bold uppercase text-lime">{t.mine.loginCta}</Link></div> : <div className="space-y-2">{mine.length === 0 ? <p className="py-12 text-center text-sm text-black/45">{t.mine.empty}</p> : mine.map((booking) => <div key={booking.id} className="flex flex-wrap items-center gap-4 border border-black/10 p-4"><div className="flex-1"><strong className="block">{booking.courtName}</strong><span className="text-sm text-black/50">{booking.date} · {booking.startTime}–{booking.endTime}</span><span className="mt-1 block text-xs font-bold uppercase tracking-wide text-black/70">{bookingLabel(booking.status, t)}</span></div>{booking.status === "CONFIRMED" ? <button type="button" onClick={() => cancel(booking.id)} className="cursor-pointer px-3 py-2 text-xs font-bold uppercase text-orange hover:underline">{t.mine.cancel}</button> : null}</div>)}</div>) : <>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">{t.stepDay}</p><div className="no-scrollbar mb-8 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2">{visibleDates.map((item) => { const value = localDate(item), active = value === date; return <button type="button" key={value} onClick={() => setDate(value)} className={`min-w-16 shrink-0 cursor-pointer border px-3 py-3 text-center ${active ? "border-black bg-black text-lime" : "border-black/15 bg-cream hover:border-black"}`}><span className="block text-[10px] font-bold uppercase">{value === todayValue ? t.today : value === tomorrowValue ? t.tomorrow : t.weekdays[item.getDay()]}</span><span className="mt-1 block text-sm">{item.getDate()}/{item.getMonth() + 1}</span></button>; })}</div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">{t.stepTime}</p>{loading ? <p className="py-10 text-center text-sm text-black/45">{t.loadingSlots}</p> : Object.keys(grouped).length === 0 ? <p className="border border-black/10 bg-cream p-5 text-sm text-black/50">{t.noSlots}</p> : <><div className="mb-7 flex min-w-0 flex-wrap gap-2">{Object.keys(grouped).map((time) => <button type="button" key={time} onClick={() => { setSelectedTime(time); setSelected(null); setStreamRequested(false); }} className={`max-w-full cursor-pointer whitespace-normal border px-3 py-2 text-sm font-semibold ${selectedTime === time ? "border-black bg-black text-lime" : "border-black/15 bg-white hover:border-black"}`}>{time}</button>)}</div><p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">{t.stepCourt}</p>{selectedTime ? <div className="min-w-0">{(["INDOOR", "OUTDOOR"] as const).map((environment) => { const courts = selectedTimeSlots.filter((slot) => slot.environment === environment); return courts.length ? <div key={environment} className="mb-4 min-w-0"><span className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-black/40">{environment === "INDOOR" ? t.indoor : t.outdoor}</span><div className="flex min-w-0 flex-wrap gap-2">{courts.map((slot) => { const active = selected?.courtId === slot.courtId; return <button type="button" key={slot.courtId} onClick={() => selectCourt(slot)} className={`inline-flex max-w-full cursor-pointer items-center border px-3 py-2 text-sm font-semibold ${active ? "border-black bg-black text-lime" : "border-black/15 bg-white hover:border-black"}`}><span>{shortCourt(slot.courtName, t.courtPrefix)}</span>{slot.cameraEnabled ? <CameraMark label={t.cameraOnCourt} /> : null}</button>; })}</div></div> : null; })}</div> : <p className="border border-black/10 bg-cream p-4 text-sm text-black/45">{t.pickTimeFirst}</p>}</>}
      </>}
    </div>

    <div ref={paymentPanel} className="min-w-0 scroll-mt-20 overflow-hidden border border-black/10 bg-cream p-5 text-black sm:p-7 lg:p-10"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">{t.pay.tag}</p>{selected ? <><h3 className="mt-3 break-words font-display text-2xl">{selected.courtName}</h3><p className="mt-2 break-words text-sm text-black/55">{date} · {selected.startTime}–{selected.endTime} · {selected.durationMin} min</p><div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">{selectedOrdinaryPrice !== null && selectedPrice !== null && selectedOrdinaryPrice > selectedPrice ? <span className="text-sm text-black/45 line-through" aria-label={`${t.pay.ordinaryPrice} ${selectedOrdinaryPrice}${t.priceSuffix}`}>{selectedOrdinaryPrice}{t.priceSuffix}</span> : null}<strong className="text-xl">{selectedPrice}{t.priceSuffix}</strong>{selectedPriceLabel ? <span className="rounded-full bg-lime px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-black">{selectedPriceLabel}</span> : null}</div>{selectedDiscount !== null ? <p className="mt-1 text-xs font-semibold text-teal">{t.pay.discount} {selectedDiscount}{t.priceSuffix}</p> : null}{selectedQuoteTime ? <p className="mt-1 text-[11px] text-black/45">{t.pay.quoteUntil} {selectedQuoteTime}</p> : null}</> : <p className="mt-3 text-sm text-black/45">{t.pay.pickPrompt}</p>}
      <div className="mt-7 min-w-0 border border-black/10 bg-white p-4">{accountLoading ? <p className="text-sm text-black/45">{t.pay.checkingAccount}</p> : !profile ? <><strong className="block">{t.pay.loginTitle}</strong><p className="mt-1 text-sm text-black/50">{t.pay.loginBody}</p><Link href={accountHref} className="mt-4 inline-flex max-w-full bg-black px-5 py-3 text-center text-xs font-bold uppercase text-lime">{t.pay.loginCta}</Link></> : !profileReady ? <><strong className="block">{t.pay.profileTitle}</strong><p className="mt-1 text-sm text-black/50">{t.pay.profileBody}</p><Link href={accountHref} className="mt-4 inline-flex max-w-full bg-black px-5 py-3 text-center text-xs font-bold uppercase text-lime">{t.pay.profileCta}</Link></> : <div className="flex min-w-0 items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-mint text-xl">{profile.avatar_thumb_url ? <img src={profile.avatar_thumb_url} alt="" className="h-full w-full object-cover" /> : profile.emoji_icon || "🏐"}</span><div className="min-w-0 flex-1"><strong className="block truncate">{profile.name}</strong><span className="block truncate text-xs text-black/45">{profile.swish_phone ? `${t.pay.swishPrefix}${profile.swish_phone}` : profile.email}</span></div><Link href={accountHref} className="shrink-0 text-xs font-bold uppercase text-teal">{t.pay.edit}</Link></div>}</div>
      {selected?.cameraEnabled && profileReady ? <label className="mt-4 flex cursor-pointer items-start gap-3 border border-black/10 bg-white p-4"><input type="checkbox" checked={streamRequested} onChange={(event) => setStreamRequested(event.target.checked)} className="mt-0.5 h-5 w-5 accent-black" /><span className="text-sm"><strong className="flex items-center gap-2"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="2"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg>{t.pay.streamTitle}</strong><span className="mt-1 block text-black/45">{t.pay.streamBody}</span></span></label> : null}
      {error ? <div role="alert" className="mt-4 border border-orange/25 bg-orange/10 p-4 text-sm font-semibold text-orange"><p>{error}</p>{error.toLowerCase().includes("profil") ? <Link href={accountHref} className="mt-3 inline-flex text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-4">{t.pay.checkSwish}</Link> : null}</div> : null}
      {profileReady ? <div className="mt-4 border border-black/10 bg-white p-4 text-sm">
        <strong className="block">{t.pay.credit}</strong>
        {creditLoading ? <p className="mt-2 text-black/55">{t.pay.creditLoading}</p> : creditError ? <><p className="mt-2 text-black/55">{t.pay.creditUnavailable}</p><button type="button" onClick={() => void loadCredit()} className="mt-2 min-h-11 cursor-pointer text-xs font-bold text-teal underline">{t.pay.creditRetry}</button></> : <>
          <p className="mt-1 font-semibold">{money(availableCreditOre)}</p>
          <Link href="/konto#abonnemang" className="mt-2 inline-flex min-h-11 items-center text-xs font-bold text-teal underline">{t.pay.creditDetails}</Link>
        </>}
        {availableCreditOre > 0 || creditSelected ? <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3"><input type="checkbox" checked={creditSelected} disabled={submitting} onChange={(event) => setUseStoredValue(event.target.checked)} className="h-5 w-5 accent-black" /><span>{t.pay.creditUse}</span></label> : null}
        {creditSelected && selected && swishQuote ? <dl className="mt-3 space-y-1 border-t border-black/10 pt-3"><div className="flex justify-between gap-2"><dt>{t.pay.creditApplied}</dt><dd>−{money(paymentAmounts?.creditOre ?? previewCreditOre)}</dd></div><div className="flex justify-between gap-2 font-semibold"><dt>{t.pay.creditRemaining}</dt><dd>{money(paymentAmounts?.remainingOre ?? previewRemainingOre)}</dd></div></dl> : null}
        {creditSelected && stripeQuote && swishQuote && stripeQuote.remainingAmountOre !== swishQuote.remainingAmountOre ? <p className="mt-3 text-xs text-black/55">{t.pay.creditCardMinimum} ({money(stripeQuote.remainingAmountOre)})</p> : null}
      </div> : null}
      {selected && profileReady && quotes.key !== quoteKey ? <p role="status" className="mt-4 text-sm text-black/55">{locale === "sv" ? "Kontrollerar pris och tillgodohavande…" : "Checking price and credit…"}</p> : null}
      {selected && quotes.key === quoteKey && quoteError ? <div role="alert" className="mt-4 text-sm text-orange"><p>{quoteError}</p><button type="button" onClick={() => setQuoteRevision((revision) => revision + 1)} className="min-h-11 cursor-pointer font-semibold underline">{t.pay.creditRetry}</button></div> : null}
      <button type="button" disabled={!selected || !swishQuote || attemptOwnerReady !== profile?.id || submitting || !(fullCredit ? profileReady : swishReady)} onClick={() => checkout("SWISH")} className="mt-6 min-h-13 w-full cursor-pointer bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime disabled:cursor-not-allowed disabled:opacity-35">{fullCredit ? (submitting ? t.pay.submitting : t.pay.creditPay) : <SwishButtonLabel>{submitting ? t.pay.submitting : selected && selectedPrice !== null ? `${t.pay.submitPrefix}${previewRemainingOre / 100}${t.priceSuffix}` : t.pay.submitEmpty}</SwishButtonLabel>}</button>
      {stripeEnabled && !fullCredit ? (
        <AlternativePaymentOption
          busy={submitting}
          disabled={!selected || !stripeQuote || attemptOwnerReady !== profile?.id || submitting || !profileReady}
          locale={locale}
          onClick={() => checkout("STRIPE")}
        />
      ) : null}
      <p className="mt-3 text-center text-[11px] leading-relaxed text-black/45">{t.pay.fine1}</p><p className="mt-2 text-center text-[11px] leading-relaxed text-black/45">{t.pay.fine2}</p>
    </div>
  </div>;
}
