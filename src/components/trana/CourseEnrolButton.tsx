"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n";
import type { CoursePersonalPriceStatus } from "@/lib/coursePricing";
import {
  parseCoursePromotionLookup,
  type CoursePromotionLookupResult,
} from "@/lib/coursePromotion";
import { kurserDict } from "@/lib/i18n/kurser";
import { courseSellerLine, COURSE_SELLER, holdClock } from "@/lib/courseSeller";
import { courseStripeCheckoutUrl } from "@/lib/coursePaymentRoute.core";
import { isBirthdateValid, normalizeBirthdate } from "@/lib/birthdate";
import { normalizePersonName, splitValidFullName, validNameComponent } from "@/lib/personIdentity";
import { pushEvent } from "@/lib/gtm";
import {
  clearCourseAttempt,
  courseAttemptKey,
  courseInvoiceId,
  courseSwishLaunchUrl,
  courseSwishMobileDevice,
  courseSwishQrCode,
  pendingCourseInvoice,
  pollCoursePayment,
  remainingCoursePaymentTimeout,
  rememberCourseInvoice,
} from "@/lib/coursePayment.core";

type Props = {
  locale: Locale;
  courseId: number;
  /** Visas i betalrutan så kunden ser vad hen betalar för — och hur mycket. */
  courseName: string;
  priceSek: number;
  priceStatus: CoursePersonalPriceStatus;
  termsVersion: string;
  termsMarkdown: string | null;
  /** true när kursen är full — anmälan blir en köplats i stället. */
  waitlist: boolean;
  loggedIn: boolean;
  /**
   * Sidan anmälan sker på. Styr både vart inloggningen lämnar tillbaka och
   * vart Swish returnerar på mobil — annars hamnar den som betalade från en
   * kurssida på /trana och undrar om betalningen gick igenom.
   */
  returnPath?: string;
};

type Result =
  | { ok: true; kind: "paid" | "waitlisted" }
  | { ok: false; message: string };

type Phase = "idle" | "enrolling" | "startingSwish" | "startingStripe" | "waitingForSwish";

type PromotionLookupState =
  | { kind: "idle" }
  | { kind: "loading"; code: string }
  | { kind: "valid"; code: string; preview: Extract<CoursePromotionLookupResult, { valid: true }> }
  | { kind: "invalid"; code: string }
  | { kind: "error"; code: string };

/**
 * Utfallet av en inskriven kampanjkod. "none" betyder att anmälan gick igenom
 * men att plattformen inte räknade av något — kunden ska se det innan hen
 * betalar, inte efteråt på kvittot.
 */
type DiscountOutcome =
  | { kind: "applied"; code: string; grossSek: number; discountSek: number; netSek: number }
  | { kind: "none"; code: string };

type SwishHandoff = {
  deepLinkUrl: string;
  qrCodeDataUrl: string | null;
};

async function json(response: Response): Promise<Record<string, unknown>> {
  return response.json().catch(() => ({})) as Promise<Record<string, unknown>>;
}

class PaymentStatusError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Beloppen från plattformen är hela kronor. Allt annat behandlas som saknat. */
function amountSek(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

/** Fältet håller sig till samma tecken som API-rutten släpper igenom. */
function cleanPromotionCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

function cleanReferralCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 24);
}

async function lookupPromotion(
  courseId: number,
  code: string,
  signal?: AbortSignal,
): Promise<CoursePromotionLookupResult> {
  const response = await fetch("/api/courses/promotions/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, code }),
    signal,
  });
  const data = await json(response);
  if (!response.ok) throw new Error("promotion lookup failed");
  return parseCoursePromotionLookup(data);
}

function randomAttemptKey() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, "").slice(0, 32)
    : `k${Date.now()}${Math.floor(Math.random() * 1e6)}`;
}

/**
 * Anmälan sker mot /api/courses/[id]/enrol som håller kontotoken serverside.
 * Idempotency-nyckeln skapas en gång per monterad knapp så att ett omförsök
 * efter timeout återanvänder samma anmälan i stället för att skapa två.
 */
export default function CourseEnrolButton({
  locale,
  courseId,
  courseName,
  priceSek,
  priceStatus,
  termsVersion,
  termsMarkdown,
  waitlist,
  loggedIn,
  returnPath,
}: Props) {
  const t = kurserDict[locale];
  const uid = useId();
  const [accepted, setAccepted] = useState(false);
  const [promotionOpen, setPromotionOpen] = useState(false);
  const [promotionCode, setPromotionCode] = useState("");
  const [promotionLookup, setPromotionLookup] = useState<PromotionLookupState>({ kind: "idle" });
  const [referralCode, setReferralCode] = useState("");
  const [discount, setDiscount] = useState<DiscountOutcome | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [swishHandoff, setSwishHandoff] = useState<SwishHandoff | null>(null);
  const [showDesktopSwish, setShowDesktopSwish] = useState(false);
  const [invoiceStartedAt, setInvoiceStartedAt] = useState<number | null>(null);
  const [paymentPriceSek, setPaymentPriceSek] = useState(priceSek);
  const paymentPriceRef = useRef(priceSek);
  const inFlight = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const promotionRequest = useRef<AbortController | null>(null);
  const fallbackAttemptKey = useRef(randomAttemptKey());

  // Kontoportalen finns bara på /konto (ingen /en-variant ännu).
  const here = returnPath ?? (locale === "en" ? "/en/training#kurser" : "/trana#kurser");
  const accountHref = `/konto?next=${encodeURIComponent(here)}`;
  const formatSek = (value: number) =>
    `${value.toLocaleString(locale === "sv" ? "sv-SE" : "en-GB")} kr`;

  useEffect(() => () => {
    activeRequest.current?.abort();
    promotionRequest.current?.abort();
  }, []);

  // Campaign links remain useful before login. A successful lookup is written
  // back in one canonical URL shape so the code survives inline login and can
  // be shared. Referral codes stay attribution-only and are never represented
  // as a discount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetCourse = params.get("kurs") ?? params.get("courseId");
    if (targetCourse && targetCourse !== String(courseId)) return;
    const linkedReferral = cleanReferralCode(params.get("tipskod") ?? params.get("ref") ?? "");
    const linkedCode = cleanPromotionCode(
      params.get("kampanjkod") ?? params.get("promotionCode") ?? params.get("promo") ?? "",
    );
    // A generic listing can contain several courses with different campaign
    // scopes. Require an explicit course there; a dedicated course page has a
    // returnPath and is unambiguous without the extra parameter.
    const shouldLookup = linkedCode.length >= 3 && Boolean(targetCourse || returnPath);
    if (!linkedReferral && !shouldLookup) return;
    let active = true;
    let controller: AbortController | null = null;
    queueMicrotask(() => {
      if (!active) return;
      if (linkedReferral) setReferralCode(linkedReferral);
      setPromotionOpen(true);
      if (!shouldLookup) return;
      setPromotionCode(linkedCode);
      setPromotionLookup({ kind: "loading", code: linkedCode });
      controller = new AbortController();
      promotionRequest.current = controller;
      void lookupPromotion(courseId, linkedCode, controller.signal)
        .then((preview) => {
          if (!active) return;
          setPromotionLookup(
            preview.valid
              ? { kind: "valid", code: linkedCode, preview }
              : { kind: "invalid", code: linkedCode },
          );
        })
        .catch((cause) => {
          if (active && !(cause instanceof DOMException && cause.name === "AbortError")) {
            setPromotionLookup({ kind: "error", code: linkedCode });
          }
        });
    });
    return () => {
      active = false;
      controller?.abort();
    };
  }, [courseId, loggedIn, returnPath]);

  const busy = phase !== "idle";

  function clearPromotionFromUrl() {
    const url = new URL(window.location.href);
    for (const key of ["kampanjkod", "promotionCode", "promo", "kurs", "courseId"]) {
      url.searchParams.delete(key);
    }
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }

  async function checkPromotion() {
    const code = cleanPromotionCode(promotionCode);
    if (code.length < 3) {
      setPromotionLookup({ kind: "invalid", code });
      return;
    }
    promotionRequest.current?.abort();
    const controller = new AbortController();
    promotionRequest.current = controller;
    setPromotionLookup({ kind: "loading", code });
    try {
      const preview = await lookupPromotion(courseId, code, controller.signal);
      if (!preview.valid) {
        setPromotionLookup({ kind: "invalid", code });
        return;
      }
      setPromotionLookup({ kind: "valid", code, preview });
      const url = new URL(window.location.href);
      url.searchParams.set("kampanjkod", code);
      url.searchParams.set("kurs", String(courseId));
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        setPromotionLookup({ kind: "error", code });
      }
    } finally {
      if (promotionRequest.current === controller) promotionRequest.current = null;
    }
  }

  async function submit(paymentProvider: "SWISH" | "STRIPE") {
    const submittedCode = cleanPromotionCode(promotionCode);
    if (
      submittedCode
      && !(promotionLookup.kind === "valid" && promotionLookup.code === submittedCode)
    ) {
      setResult({ ok: false, message: t.promotionValidateFirst });
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setResult(null);
    setDiscount(null);

    const startStripeCheckout = async (
      invoiceId: string,
      requestController: AbortController,
    ) => {
      setPhase("startingStripe");
      const chargeResponse = await fetch(
        `/api/courses/invoices/${encodeURIComponent(invoiceId)}/stripe`,
        { method: "POST", signal: requestController.signal },
      );
      const charge = await json(chargeResponse);
      if (!chargeResponse.ok) {
        throw new PaymentStatusError(
          chargeResponse.status,
          typeof charge.detail === "string" ? charge.detail : t.paymentFailed,
        );
      }
      const checkoutUrl = courseStripeCheckoutUrl(charge);
      if (!checkoutUrl) throw new PaymentStatusError(502, t.paymentFailed);
      pushEvent("course_payment_start", {
        course_id: courseId,
        course_name: courseName,
        value: paymentPriceRef.current,
        currency: "SEK",
        payment_provider: "stripe",
      });
      window.location.assign(checkoutUrl);
    };

    const startSwishCheckout = async (
      invoiceId: string,
      requestController: AbortController,
      storage: Storage,
      invoiceCreatedAt: number,
      amountSek: number,
      autoOpen: boolean,
    ) => {
      setPhase("startingSwish");
      const chargeResponse = await fetch(
        `/api/courses/invoices/${encodeURIComponent(invoiceId)}/swish?locale=${locale}` +
          (returnPath ? `&returnPath=${encodeURIComponent(returnPath)}` : ""),
        { method: "POST", signal: requestController.signal },
      );
      const charge = await json(chargeResponse);
      if (!chargeResponse.ok) {
        throw new PaymentStatusError(
          chargeResponse.status,
          typeof charge.detail === "string" ? charge.detail : t.paymentFailed,
        );
      }
      const deepLinkUrl = courseSwishLaunchUrl(charge);
      if (!deepLinkUrl) throw new PaymentStatusError(502, t.paymentFailed);
      const qrCodeDataUrl = courseSwishQrCode(charge);
      const mobileDevice = courseSwishMobileDevice(
        window.navigator.userAgent,
        window.navigator.maxTouchPoints,
      );
      pushEvent("course_payment_start", {
        course_id: courseId,
        course_name: courseName,
        value: paymentPriceRef.current,
        currency: "SEK",
        payment_provider: "swish",
      });
      setSwishHandoff({ deepLinkUrl, qrCodeDataUrl });
      setShowDesktopSwish(!mobileDevice);
      rememberCourseInvoice(
        courseId,
        invoiceId,
        storage,
        invoiceCreatedAt,
        { deepLinkUrl, ...(qrCodeDataUrl ? { qrCodeDataUrl } : {}), amountSek },
      );
      if (mobileDevice && autoOpen) window.location.assign(deepLinkUrl);
    };

    try {
      const storage = window.sessionStorage;
      const savedInvoice = pendingCourseInvoice(courseId, storage);
      if (savedInvoice) {
        if (savedInvoice.amountSek !== undefined) {
          paymentPriceRef.current = savedInvoice.amountSek;
          setPaymentPriceSek(savedInvoice.amountSek);
        }
        if (savedInvoice.deepLinkUrl) {
          setSwishHandoff({
            deepLinkUrl: savedInvoice.deepLinkUrl,
            qrCodeDataUrl: savedInvoice.qrCodeDataUrl ?? null,
          });
          setShowDesktopSwish(!courseSwishMobileDevice(
            window.navigator.userAgent,
            window.navigator.maxTouchPoints,
          ));
        }
        setInvoiceStartedAt(savedInvoice.createdAt);
        if (paymentProvider === "STRIPE") {
          await startStripeCheckout(savedInvoice.invoiceId, controller);
          return;
        }
        if (!savedInvoice.deepLinkUrl) {
          await startSwishCheckout(
            savedInvoice.invoiceId,
            controller,
            storage,
            savedInvoice.createdAt,
            savedInvoice.amountSek ?? paymentPriceRef.current,
            true,
          );
        }
        setPhase("waitingForSwish");
        await finishPayment(savedInvoice.invoiceId, controller, storage, savedInvoice.createdAt);
        return;
      }

      setPhase("enrolling");
      pushEvent("course_signup_start", {
        course_id: courseId,
        course_name: courseName,
        waitlist,
      });
      const idempotencyKey = courseAttemptKey(
        courseId,
        storage,
        () => fallbackAttemptKey.current,
      );
      const submittedReferral = cleanReferralCode(referralCode);
      const response = await fetch(`/api/courses/${courseId}/enrol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          termsVersion,
          idempotencyKey,
          ...(submittedCode ? { promotionCode: submittedCode } : {}),
          ...(submittedReferral ? { referralCode: submittedReferral } : {}),
        }),
        signal: controller.signal,
      });
      const data = await json(response);
      if (!response.ok) {
        setResult({
          ok: false,
          message: typeof data.detail === "string" ? data.detail : t.errorGeneric,
        });
        return;
      }

      if (data.status === "waitlisted") {
        clearCourseAttempt(courseId, storage);
        pushEvent("course_waitlisted", { course_id: courseId, course_name: courseName });
        setResult({ ok: true, kind: "waitlisted" });
        return;
      }

      const netSek = amountSek(data.netAmountSek);
      const netAmountSek = netSek ?? priceSek;
      // Plattformens discountAmountSek includes both the age-qualified price
      // and the campaign discount. Attribute only the difference from this
      // viewer's already-resolved price to the campaign code in customer copy.
      const promotionDiscountSek = Math.max(0, priceSek - netAmountSek);
      const outcome: DiscountOutcome | null = submittedCode
        ? promotionDiscountSek > 0
          ? {
              kind: "applied",
              code: submittedCode,
              grossSek: priceSek,
              discountSek: promotionDiscountSek,
              netSek: netAmountSek,
            }
          : { kind: "none", code: submittedCode }
        : null;
      setDiscount(outcome);
      paymentPriceRef.current = netAmountSek;
      setPaymentPriceSek(netAmountSek);

      // 100 %-kod: nettot är noll och det finns ingen betalning att göra. Swish
      // kan inte debitera 0 kr, så anmälan är klar redan här. Sparat betalförsök
      // rensas så att inget ligger kvar och pollar en faktura som aldrig betalas.
      if (netSek === 0) {
        clearCourseAttempt(courseId, storage);
        pushEvent("course_purchase", {
          course_id: courseId,
          course_name: courseName,
          value: 0,
          currency: "SEK",
        });
        setSwishHandoff(null);
        setShowDesktopSwish(false);
        setInvoiceStartedAt(null);
        setResult({ ok: true, kind: "paid" });
        return;
      }

      const invoiceId = courseInvoiceId(data);
      if (!invoiceId) {
        setResult({ ok: false, message: t.missingInvoice });
        return;
      }
      const invoiceCreatedAt = Date.now();
      setInvoiceStartedAt(invoiceCreatedAt);
      rememberCourseInvoice(courseId, invoiceId, storage, invoiceCreatedAt, { amountSek: netAmountSek });

      if (paymentProvider === "STRIPE") {
        await startStripeCheckout(invoiceId, controller);
        return;
      }

      await startSwishCheckout(
        invoiceId,
        controller,
        storage,
        invoiceCreatedAt,
        netAmountSek,
        outcome?.kind !== "none",
      );
      setPhase("waitingForSwish");
      await finishPayment(invoiceId, controller, storage, invoiceCreatedAt);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setResult({
        ok: false,
        message: cause instanceof PaymentStatusError ? cause.message : t.errorGeneric,
      });
    } finally {
      inFlight.current = false;
      if (activeRequest.current === controller) activeRequest.current = null;
      setPhase("idle");
    }

    async function finishPayment(
      invoiceId: string,
      requestController: AbortController,
      storage: Storage,
      invoiceCreatedAt: number,
    ) {
      const payment = await pollCoursePayment(
        async () => {
          const statusResponse = await fetch(
            `/api/courses/invoices/${encodeURIComponent(invoiceId)}/status`,
            { signal: requestController.signal },
          );
          const status = await json(statusResponse);
          if (!statusResponse.ok) {
            throw new PaymentStatusError(
              statusResponse.status,
              typeof status.detail === "string" ? status.detail : t.paymentUnavailable,
            );
          }
          return status;
        },
        {
          signal: requestController.signal,
          timeoutMs: remainingCoursePaymentTimeout(invoiceCreatedAt),
          shouldRetry: (cause) =>
            !(cause instanceof PaymentStatusError) || ![401, 403, 404].includes(cause.status),
        },
      );
      setInvoiceStartedAt(null);
      if (payment.state === "paid") {
        clearCourseAttempt(courseId, storage);
        pushEvent("course_purchase", {
          course_id: courseId,
          course_name: courseName,
          value: paymentPriceRef.current,
          currency: "SEK",
        });
        setSwishHandoff(null);
        setShowDesktopSwish(false);
        setResult({ ok: true, kind: "paid" });
      } else if (payment.state === "failed") {
        clearCourseAttempt(courseId, storage);
        setSwishHandoff(null);
        setShowDesktopSwish(false);
        setResult({ ok: false, message: t.paymentFailed });
      } else {
        pushEvent("course_payment_timeout", { course_id: courseId, course_name: courseName });
        setSwishHandoff(null);
        setShowDesktopSwish(false);
        setResult({ ok: false, message: t.paymentTimeout });
      }
    }
  }

  const validPromotion = promotionLookup.kind === "valid" ? promotionLookup.preview : null;
  const promotionNeedsValidation = Boolean(
    promotionCode
    && !(promotionLookup.kind === "valid" && promotionLookup.code === promotionCode),
  );
  const promotionPanel = (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setPromotionOpen((open) => !open)}
        aria-expanded={promotionOpen}
        aria-controls={`${uid}-promotion`}
        className={inlineQuiet}
      >
        {t.promotionToggle}
      </button>
      <div id={`${uid}-promotion`}>
        {promotionOpen && (
          <div className="mt-2">
            <label className={inlineLabel} htmlFor={`${uid}-promotion-code`}>
              {t.promotionLabel}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id={`${uid}-promotion-code`}
                name="promotion-code"
                value={promotionCode}
                onChange={(event) => {
                  promotionRequest.current?.abort();
                  setPromotionCode(cleanPromotionCode(event.target.value));
                  setPromotionLookup({ kind: "idle" });
                  setResult(null);
                  clearPromotionFromUrl();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && promotionCode.length >= 3 && !busy) {
                    event.preventDefault();
                    void checkPromotion();
                  }
                }}
                placeholder={t.promotionPlaceholder}
                autoComplete="off"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                disabled={busy || promotionLookup.kind === "loading"}
                className={inlineField}
              />
              <button
                type="button"
                onClick={() => void checkPromotion()}
                disabled={busy || promotionLookup.kind === "loading" || promotionCode.length < 3}
                className="inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center bg-black px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-lime disabled:cursor-not-allowed disabled:opacity-35"
              >
                {promotionLookup.kind === "loading" ? t.promotionChecking : t.promotionApply}
              </button>
            </div>
            <span className={inlineHelp}>{t.promotionHelp}</span>

            {validPromotion && (
              <div role="status" aria-live="polite" className="mt-3 border border-teal/40 bg-teal/10 p-4">
                <p className="font-display text-xl uppercase leading-none text-black">
                  {t.promotionPreviewTitle}
                </p>
                {validPromotion.personalPriceSek !== null ? (
                  <p className="mt-2 text-[15px] font-bold text-black">
                    <span className="mr-2 font-normal text-black/45 line-through">
                      {formatSek(priceSek)}
                    </span>
                    {formatSek(validPromotion.personalPriceSek)}
                  </p>
                ) : (
                  <div className="mt-2 space-y-1 text-[12px] leading-snug text-black/65">
                    <p>{t.promotionPreviewRegular(formatSek(validPromotion.priceSek))}</p>
                    {validPromotion.priceTiers.map((tier) => (
                      <p key={tier.birthYearFrom}>
                        {t.promotionPreviewTier(tier.birthYearFrom, formatSek(tier.priceSek))}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
            {promotionLookup.kind === "invalid" && (
              <p role="alert" className="mt-2 text-[12px] font-semibold leading-snug text-orange">
                {t.promotionInvalid}
              </p>
            )}
            {promotionLookup.kind === "error" && (
              <p role="alert" className="mt-2 text-[12px] font-semibold leading-snug text-orange">
                {t.promotionLookupUnavailable}
              </p>
            )}
            {promotionNeedsValidation && promotionLookup.kind === "idle" && (
              <p className="mt-2 text-[11px] leading-snug text-black/45">
                {t.promotionValidateFirst}
              </p>
            )}
          </div>
        )}
      </div>
      {referralCode && (
        <p className="mt-2 text-[11px] leading-snug text-black/45">
          {t.referralAttribution(referralCode)}
        </p>
      )}
    </div>
  );

  // Utloggad besökare: hela inloggningen sker i kortet. Sidbytet till /konto
  // och tillbaka via ?next= tappade folk mitt i anmälan.
  if (!loggedIn) return (
    <>
      <div className="mt-auto border-t border-black/10 pt-5">{promotionPanel}</div>
      <InlineSignup locale={locale} accountHref={accountHref} />
    </>
  );

  // The surrounding course card/detail places the profile error directly by
  // the price. Do not render terms or an enrol button until that price exists.
  if (priceStatus !== "resolved") return null;

  if (result?.ok) {
    const waitlisted = result.kind === "waitlisted";
    const applied = discount?.kind === "applied" ? discount : null;
    // Hela avgiften betald av koden — då är "Betalt och klart" fel besked.
    const free = applied !== null && applied.netSek === 0;
    return (
      <div className="mt-auto border-t border-black/10 pt-5">
        <p className="mb-1 font-display text-xl uppercase leading-none text-black">
          {waitlisted ? t.waitlistSuccessTitle : free ? t.promotionFreeTitle : t.successTitle}
        </p>
        <p className="text-[13px] leading-snug text-black/55">
          {waitlisted ? t.waitlistSuccessBody : free ? t.promotionFreeBody(applied.code) : t.successBody}
        </p>
        {!waitlisted && applied && !free && (
          <p className="mt-1 text-[13px] font-semibold leading-snug text-teal">
            {t.promotionAppliedNote(applied.code, formatSek(applied.discountSek))}
          </p>
        )}
        {!waitlisted && (
          <a
            href="/konto#traningsgrupper"
            className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-black/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-lime"
          >
            {t.myCoursesCta} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    );
  }

  const paymentPriceLabel = formatSek(paymentPriceSek);
  const busyLabel =
    phase === "startingSwish"
      ? t.startingSwish
      : phase === "startingStripe"
        ? locale === "sv" ? "Öppnar säker kortbetalning…" : "Opening secure card payment…"
      : phase === "waitingForSwish"
        ? t.waitingForSwish
        : t.submitting;

  return (
    <div className="mt-auto border-t border-black/10 pt-5">
      <p className="mb-3 text-[12px] leading-snug text-black/45">{t.paymentNote}</p>

      {promotionPanel}

      {discount?.kind === "applied" && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 border border-teal/40 bg-teal/10 p-4"
        >
          <p className="font-display text-xl uppercase leading-none text-black">
            {t.promotionAppliedTitle}
          </p>
          <p className="mt-2 text-[15px] font-bold text-black">
            <span className="mr-2 font-normal text-black/45 line-through">
              <span className="sr-only">{t.promotionWasLabel(formatSek(discount.grossSek))}</span>
              <span aria-hidden="true">{formatSek(discount.grossSek)}</span>
            </span>
            <span>
              <span className="sr-only">{t.promotionNowLabel(formatSek(discount.netSek))}</span>
              <span aria-hidden="true">{formatSek(discount.netSek)}</span>
            </span>
          </p>
          <p className="mt-1 text-[12px] leading-snug text-black/60">
            {t.promotionAppliedNote(discount.code, formatSek(discount.discountSek))}
          </p>
        </div>
      )}

      {discount?.kind === "none" && (
        <div role="alert" className="mb-4 border border-orange/40 bg-orange/10 p-4">
          <p className="font-display text-xl uppercase leading-none text-black">
            {t.promotionNoDiscountTitle}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-black/75">
            {t.promotionNoDiscountBody(discount.code)}
          </p>
        </div>
      )}

      {swishHandoff && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 border border-black/15 bg-white p-4 text-center"
        >
          <p className="font-display text-xl uppercase leading-none text-black">
            {t.desktopSwishTitle}
          </p>
          <p className="mt-2 text-[13px] font-bold text-black">
            {t.amountLabel(paymentPriceLabel)}
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-black/45">{courseName}</p>
          {invoiceStartedAt !== null && (
            <HoldCountdown
              key={invoiceStartedAt}
              startedAt={invoiceStartedAt}
              notice={t.holdNotice}
              expired={t.holdExpired}
            />
          )}
          {showDesktopSwish && (
          <p className="mx-auto mt-3 max-w-xs text-[12px] leading-snug text-black/55">
            {t.desktopSwishBody}
          </p>
          )}
          {showDesktopSwish && (swishHandoff.qrCodeDataUrl ? (
            <Image
              src={swishHandoff.qrCodeDataUrl}
              alt={t.swishQrAlt}
              width={300}
              height={300}
              unoptimized
              className="mx-auto mt-4 size-[220px] border border-black/10 bg-white p-2"
            />
          ) : (
            <p role="alert" className="mt-4 text-[13px] leading-snug text-orange">
              {t.paymentQrUnavailable}
            </p>
          ))}
          <a
            href={swishHandoff.deepLinkUrl}
            className="mt-3 inline-flex min-h-[44px] items-center text-[11px] font-bold uppercase tracking-[0.08em] text-black underline underline-offset-4"
          >
            {t.openSwishCta}
          </a>
          <p className="mt-3 border-t border-black/10 pt-3 text-[11px] leading-snug text-black/45">
            {t.afterPayment}
          </p>
        </div>
      )}

      {termsMarkdown && (
        <details className="mb-3 border border-black/10 bg-cream/60">
          <summary className="cursor-pointer list-none px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-black/60 hover:text-black">
            {t.termsOpen} <span aria-hidden="true">↓</span>
          </summary>
          <div className="border-t border-black/10 px-4 py-3 text-[12px] leading-relaxed text-black/60">
            {t.termsLanguageNote && (
              <p className="mb-3 font-semibold text-black/45">{t.termsLanguageNote}</p>
            )}
            <TermsBody markdown={termsMarkdown} />
          </div>
        </details>
      )}

      <label className="mb-4 flex cursor-pointer items-start gap-2.5 text-[12px] leading-snug text-black/55">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-black"
        />
        {t.termsAccept}
      </label>

      <button
        type="button"
        disabled={!accepted || busy || promotionNeedsValidation}
        onClick={() => submit("SWISH")}
        className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-black px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35"
      >
        {busy ? busyLabel : waitlist ? t.waitlistCta : t.signupCta}
        {!busy && <span aria-hidden="true">→</span>}
      </button>
      {!waitlist && (
        <button
          type="button"
          disabled={!accepted || busy || promotionNeedsValidation}
          onClick={() => submit("STRIPE")}
          className="ml-0 mt-3 inline-flex min-h-[44px] cursor-pointer items-center gap-2 border-2 border-black bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-black transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-35 sm:ml-3 sm:mt-0"
        >
          {busy ? busyLabel : locale === "sv" ? "Kort, Apple Pay eller Google Pay" : "Card, Apple Pay or Google Pay"}
          {!busy && <span aria-hidden="true">→</span>}
        </button>
      )}
      {busy && (
        <p role="status" aria-live="polite" className="sr-only">
          {busyLabel}
        </p>
      )}
      {result && !result.ok && (
        <div role="alert" className="mt-3 text-[13px] leading-snug text-orange">
          <p>{result.message}</p>
          {result.message.toLocaleLowerCase("sv-SE").includes("födelsedatum") && (
            <a
              href="/konto#profil"
              className="mt-2 inline-flex font-bold text-black underline underline-offset-4"
            >
              {locale === "sv" ? "Lägg till födelsedatum i profilen" : "Add your date of birth in your profile"}
            </a>
          )}
        </div>
      )}

      <div className="mt-4 space-y-1 border-t border-black/10 pt-3 text-[11px] leading-snug text-black/40">
        <p>{t.swishSecurity}</p>
        <p>
          {t.sellerLabel}: {courseSellerLine()}
        </p>
        <p>{t.paymentHelp(COURSE_SELLER.supportEmail)}</p>
      </div>
    </div>
  );
}

type InlineStep = "email" | "code" | "family" | "profile" | "duplicate" | "merged" | "done";
type InlinePending =
  | null
  | "sendCode"
  | "resend"
  | "verify"
  | "saveProfile"
  | "samePerson"
  | "newPerson";
type DuplicateMatch = { player_id: number; masked_email: string | null; birthdate_match: boolean };
type InlineProfile = {
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  birthdate?: string | null;
  identity_status?: "pending_identity" | "duplicate_review" | "merge_pending" | "active";
  identity_onboarding_v2_enabled?: boolean;
  duplicate_match?: DuplicateMatch | null;
};
type InlineIdentityCandidate = DuplicateMatch & { name: string };
type InlineIdentityState = {
  identity_status: "pending_identity" | "duplicate_review" | "merge_pending" | "active";
  first_name: string | null;
  last_name: string | null;
  birthdate: string | null;
  candidates: InlineIdentityCandidate[];
  message: string | null;
};

const inlinePrimary =
  "inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 bg-black px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35";
const inlineSecondary =
  "inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 border border-black/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-lime disabled:cursor-not-allowed disabled:opacity-35";
const inlineQuiet =
  "inline-flex min-h-[44px] cursor-pointer items-center text-[11px] font-bold uppercase tracking-[0.08em] text-black/50 underline underline-offset-4 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-35";
// text-black/caret-black ar inte dekoration: kortet arver cream textfarg fran
// sin sektion, och falten har cream bakgrund. Utan explicit farg blir det
// cream pa cream — man ser varken det man skriver eller markoren.
const inlineField =
  "min-h-12 w-full border border-black/20 bg-cream px-4 text-[14px] text-black caret-black placeholder:text-black/35 outline-none focus:border-black disabled:bg-black/5 disabled:text-black/45";
const inlineLabel = "mb-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-black/50";
const inlineHelp = "mt-1 block text-[11px] leading-snug text-black/45";
const inlineHeading = "mb-1 font-display text-xl uppercase leading-none text-black";

/**
 * Inline-anmälan för utloggade besökare — allt i samma kort, utan sidbyte.
 *
 * Steg: e-post → engångskod → (namn + födelsedatum om profilen saknar dem) →
 * router.refresh(). Efter refreshen renderar serverkomponenten om med inloggad
 * session och personligt pris, och den vanliga villkorsrutan + Swish-knappen
 * dyker upp av sig själva. Vi anmäler ALDRIG automatiskt och startar aldrig en
 * betalning åt kunden: kursvillkoren måste godkännas aktivt.
 *
 * Två fall lämnar kortet med flit: familjekonton (väljaren bor i kontoportalen)
 * och dubbletthanteringen, som följer AccountPortal:s semantik — sammanslagning
 * via /api/account/merge-request, ny person via confirm_new_identity.
 */
function InlineSignup({ locale, accountHref }: { locale: Locale; accountHref: string }) {
  const t = kurserDict[locale];
  const router = useRouter();
  // Explicit etikettkoppling i stallet for nastlad input: Chrome behandlar
  // autofyll pa fält inuti <label> annorlunda, vilket kan gora att
  // forslagslistan fungerar men tangentbordet inte landar i faltet.
  const uid = useId();
  const [step, setStep] = useState<InlineStep>("email");
  const [pending, setPending] = useState<InlinePending>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [duplicate, setDuplicate] = useState<DuplicateMatch | null>(null);
  const [identityV2, setIdentityV2] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // Ref, inte state: ett dubbelklick hinner före nästa render och skulle
  // annars skicka två koder.
  const running = useRef(false);

  const busy = pending !== null;
  const address = email.trim().toLowerCase();
  const cleanBirthdate = normalizeBirthdate(birthdate) || birthdate.trim();
  const profileBlocker = identityV2 && !validNameComponent(firstName)
    ? locale === "sv" ? "Ange ett giltigt förnamn med minst två bokstäver." : "Enter a valid first name with at least two letters."
    : identityV2 && !validNameComponent(lastName)
      ? locale === "sv" ? "Ange ett giltigt efternamn med minst två bokstäver." : "Enter a valid last name with at least two letters."
    : !identityV2 && !splitValidFullName(name)
      ? t.inlineNameInvalid
    : isBirthdateValid(cleanBirthdate)
      ? ""
      : t.inlineBirthdateInvalid;

  /** API-fel visas som de kommer (`detail`), aldrig som ett generiskt fel. */
  async function call<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...init,
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    });
    const data = await json(response);
    if (!response.ok) {
      throw new Error(typeof data.detail === "string" && data.detail ? data.detail : t.errorGeneric);
    }
    return data as T;
  }

  async function run(mode: Exclude<InlinePending, null>, task: () => Promise<void>) {
    if (running.current) return;
    running.current = true;
    setPending(mode);
    setError("");
    try {
      await task();
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : t.errorGeneric);
    } finally {
      running.current = false;
      setPending(null);
    }
  }

  function finish() {
    setStep("done");
    router.refresh();
  }

  async function sendCode(resend: boolean) {
    await call("/api/account/auth/request-code", {
      method: "POST",
      body: JSON.stringify({ email: address }),
    });
    setCode("");
    setStep("code");
    setNotice(resend ? t.inlineResent : "");
  }

  async function verify() {
    setNotice("");
    const result = await call<{ requiresSelection?: boolean }>("/api/account/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email: address, code }),
    });
    if (result.requiresSelection) {
      setStep("family");
      return;
    }
    const profile = await call<InlineProfile>("/api/account/profile");
    const usesIdentityV2 = Boolean(profile.identity_onboarding_v2_enabled);
    setIdentityV2(usesIdentityV2);
    if (usesIdentityV2) {
      const parts = profile.first_name?.trim() && profile.last_name?.trim()
        ? { firstName: profile.first_name.trim(), lastName: profile.last_name.trim() }
        : splitValidFullName(profile.name ?? "");
      setFirstName(parts?.firstName ?? "");
      setLastName(parts?.lastName ?? "");
    }
    if (usesIdentityV2 && profile.identity_status !== "active") {
      const state = await call<InlineIdentityState>("/api/account/identity");
      setFirstName(state.first_name ?? "");
      setLastName(state.last_name ?? "");
      setBirthdate(state.birthdate?.slice(0, 10) ?? "");
      if (state.identity_status === "duplicate_review" && state.candidates[0]) {
        setDuplicate(state.candidates[0]);
        setStep("duplicate");
      } else if (state.identity_status === "merge_pending") {
        setNotice(state.message ?? t.inlineMergeQueued);
        setStep("merged");
      } else {
        setStep("profile");
      }
      return;
    }
    const savedName = (profile.name ?? "").trim();
    const savedBirthdate = (profile.birthdate ?? "").slice(0, 10);
    if (savedName.length >= 2 && isBirthdateValid(savedBirthdate)) {
      finish();
      return;
    }
    setName(savedName);
    setBirthdate(isBirthdateValid(savedBirthdate) ? savedBirthdate : "");
    setStep("profile");
  }

  /** true = profilen är klar. false = dubbletten måste besvaras först. */
  async function saveProfile(confirmNewIdentity: boolean): Promise<boolean> {
    const trimmedName = name.trim();
    if (identityV2) {
      if (!validNameComponent(firstName)) throw new Error(locale === "sv" ? "Ange ett giltigt förnamn." : "Enter a valid first name.");
      if (!validNameComponent(lastName)) throw new Error(locale === "sv" ? "Ange ett giltigt efternamn." : "Enter a valid last name.");
    } else if (!splitValidFullName(trimmedName)) throw new Error(t.inlineNameInvalid);
    // Utan födelsedatum kan plattformen inte räkna fram rätt kurspris och
    // nekar anmälan med 422 — därför stoppar vi redan här.
    if (!isBirthdateValid(cleanBirthdate)) throw new Error(t.inlineBirthdateInvalid);
    setBirthdate(cleanBirthdate);
    if (identityV2) {
      const state = await call<InlineIdentityState>("/api/account/identity", {
        method: "PUT",
        body: JSON.stringify({
          first_name: normalizePersonName(firstName),
          last_name: normalizePersonName(lastName),
          birthdate: cleanBirthdate,
        }),
      });
      if (state.identity_status === "duplicate_review" && state.candidates[0]) {
        setDuplicate(state.candidates[0]);
        setStep("duplicate");
        return false;
      }
      if (state.identity_status === "merge_pending") {
        setNotice(state.message ?? t.inlineMergeQueued);
        setStep("merged");
        return false;
      }
      await call("/api/account/profile/match-rating", { method: "POST" }).catch(() => null);
      return state.identity_status === "active";
    }
    const saved = await call<InlineProfile>("/api/account/profile", {
      method: "PUT",
      body: JSON.stringify({
        name: trimmedName,
        birthdate: cleanBirthdate,
        check_duplicates: true,
        confirm_new_identity: confirmNewIdentity || undefined,
      }),
    });
    if (saved.duplicate_match) {
      setDuplicate(saved.duplicate_match);
      setStep("duplicate");
      return false;
    }
    // Samma identitetsupplösning som kontoportalen kör efter ett sparat
    // namn/födelsedatum. Misslyckas den är profilen ändå sparad.
    await call("/api/account/profile/match-rating", { method: "POST" }).catch(() => null);
    return true;
  }

  const onSendCode = () => run("sendCode", () => sendCode(false));
  const onResend = () => run("resend", () => sendCode(true));
  const onVerify = () => run("verify", verify);
  const onSaveProfile = () => run("saveProfile", async () => {
    if (await saveProfile(false)) finish();
  });
  const onSamePerson = () => run("samePerson", async () => {
    if (!duplicate) return;
    if (identityV2) {
      const state = await call<InlineIdentityState>(`/api/account/identity/${duplicate.player_id}`, {
        method: "POST",
        body: JSON.stringify({ decision: "yes" }),
      });
      setNotice(state.message ?? t.inlineMergeQueued);
      setStep("merged");
      return;
    }
    const result = await call<{ message?: string }>("/api/account/merge-request", {
      method: "POST",
      body: JSON.stringify({ player_id: duplicate.player_id }),
    });
    setNotice(result.message || t.inlineMergeQueued);
    // Kontoportalen sparar med confirm_new_identity direkt efter begäran:
    // profilen skapas nu, sammanslagningen hanteras av oss efteråt.
    if (await saveProfile(true)) setStep("merged");
  });
  const onNewPerson = () => run("newPerson", async () => {
    if (identityV2 && duplicate) {
      const state = await call<InlineIdentityState>(`/api/account/identity/${duplicate.player_id}`, {
        method: "POST",
        body: JSON.stringify({ decision: "no" }),
      });
      if (state.identity_status === "duplicate_review" && state.candidates[0]) {
        setDuplicate(state.candidates[0]);
        setStep("duplicate");
        return;
      }
      if (state.identity_status === "active") finish();
      return;
    }
    if (await saveProfile(true)) finish();
  });

  return (
    <div className="mt-auto border-t border-black/10 pt-5">
      {(step === "email" || step === "code") && (
        <>
          <p className={inlineHeading}>{t.inlineTitle}</p>
          <p className="mb-4 text-[12px] leading-snug text-black/45">{t.inlineIntro}</p>
          <div className="mb-3 block">
            <label className={inlineLabel} htmlFor={`${uid}-email`}>{t.inlineEmailLabel}</label>
            <input
              id={`${uid}-email`}
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && step === "email" && address && !busy) {
                  e.preventDefault();
                  onSendCode();
                }
              }}
              type="email"
              enterKeyHint="send"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={t.inlineEmailPlaceholder}
              disabled={step === "code"}
              className={inlineField}
            />
          </div>
          {step === "code" && (
            <>
              <p className="mb-3 text-[12px] leading-snug text-black/55">
                {t.inlineCodeSentTo(address)}
              </p>
              <div className="mb-3 block">
                <label className={inlineLabel} htmlFor={`${uid}-code`}>{t.inlineCodeLabel}</label>
                <input
                  id={`${uid}-code`}
                  name="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && code.length === 6 && !busy) {
                      e.preventDefault();
                      onVerify();
                    }
                  }}
                  inputMode="numeric"
                  enterKeyHint="go"
                  autoComplete="one-time-code"
                  className="min-h-12 w-full border border-black/20 bg-cream px-4 text-center text-lg tracking-[0.35em] text-black caret-black outline-none focus:border-black"
                />
              </div>
            </>
          )}
          <button
            type="button"
            onClick={step === "code" ? onVerify : onSendCode}
            disabled={busy || (step === "code" ? code.length !== 6 : !address)}
            className={inlinePrimary}
          >
            {step === "code"
              ? pending === "verify" ? t.inlineVerifying : t.inlineVerify
              : pending === "sendCode" ? t.inlineSendingCode : t.inlineSendCode}
          </button>
          {step === "code" && (
            <div className="mt-1 flex flex-wrap items-center gap-x-5">
              <button type="button" onClick={onResend} disabled={busy} className={inlineQuiet}>
                {pending === "resend" ? t.inlineResending : t.inlineResend}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setNotice("");
                  setError("");
                }}
                disabled={busy}
                className={inlineQuiet}
              >
                {t.inlineChangeEmail}
              </button>
            </div>
          )}
        </>
      )}

      {step === "family" && (
        <>
          <p className={inlineHeading}>{t.inlineFamilyTitle}</p>
          <p className="mb-4 text-[13px] leading-snug text-black/55">{t.inlineFamilyBody}</p>
          <a href={accountHref} className={inlinePrimary}>
            {t.inlineFamilyCta} <span aria-hidden="true">→</span>
          </a>
        </>
      )}

      {step === "profile" && (
        <>
          <p className={inlineHeading}>{t.inlineProfileTitle}</p>
          <p className="mb-4 text-[12px] leading-snug text-black/45">{t.inlineProfileIntro}</p>
          {identityV2 ? <>
            <div className="mb-3 block">
              <label className={inlineLabel} htmlFor={`${uid}-first-name`}>{locale === "sv" ? "Förnamn" : "First name"}</label>
              <input id={`${uid}-first-name`} name="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" maxLength={60} className={inlineField} />
            </div>
            <div className="mb-3 block">
              <label className={inlineLabel} htmlFor={`${uid}-last-name`}>{locale === "sv" ? "Efternamn" : "Last name"}</label>
              <input id={`${uid}-last-name`} name="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" maxLength={60} className={inlineField} />
              <span className={inlineHelp}>{t.inlineNameHelp}</span>
            </div>
          </> : <div className="mb-3 block">
            <label className={inlineLabel} htmlFor={`${uid}-name`}>{t.inlineNameLabel}</label>
            <input id={`${uid}-name`} name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inlineField} />
            <span className={inlineHelp}>{t.inlineNameHelp}</span>
          </div>}
          <div className="mb-4 block">
            <label className={inlineLabel} htmlFor={`${uid}-birthdate`}>{t.inlineBirthdateLabel}</label>
            <input
              id={`${uid}-birthdate`}
              name="bday"
              type="date"
              min="1900-01-01"
              required
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              autoComplete="bday"
              className={inlineField}
            />
            <span className={inlineHelp}>{t.inlineBirthdateHelp}</span>
          </div>
          <button
            type="button"
            onClick={onSaveProfile}
            disabled={busy || Boolean(profileBlocker)}
            className={inlinePrimary}
          >
            {pending === "saveProfile" ? t.inlineSavingProfile : t.inlineSaveProfile}
          </button>
          {/* Aldrig en död grå knapp utan förklaring — samma regel som i kontot. */}
          {profileBlocker && (
            <p className="mt-2 text-[12px] font-semibold leading-snug text-orange">{profileBlocker}</p>
          )}
        </>
      )}

      {step === "duplicate" && duplicate && (
        <div className="border border-orange/40 bg-orange/10 p-4">
          <p className="font-display text-xl uppercase leading-none text-black">
            {t.inlineDuplicateTitle}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-black/75">
            {t.inlineDuplicateBody(duplicate.masked_email, duplicate.birthdate_match)}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-black/75">{t.inlineDuplicateChoice}</p>
          <div className="mt-4 space-y-2">
            <button type="button" onClick={onSamePerson} disabled={busy} className={inlinePrimary}>
              {pending === "samePerson" ? t.inlineDuplicateSameBusy : t.inlineDuplicateSame}
            </button>
            <button type="button" onClick={onNewPerson} disabled={busy} className={inlineSecondary}>
              {pending === "newPerson" ? t.inlineDuplicateNewBusy : t.inlineDuplicateNew}
            </button>
          </div>
        </div>
      )}

      {step === "merged" && (
        <div role="status" aria-live="polite">
          <p className={inlineHeading}>{t.inlineMergeTitle}</p>
          <p className="mb-4 text-[13px] leading-snug text-black/55">{notice || t.inlineMergeQueued}</p>
          {identityV2 ? <a href={accountHref} className={inlineSecondary}>
            {locale === "sv" ? "Öppna mitt konto" : "Open my account"} <span aria-hidden="true">→</span>
          </a> : <button type="button" onClick={finish} className={inlinePrimary}>
            {t.inlineContinue} <span aria-hidden="true">→</span>
          </button>}
        </div>
      )}

      {step === "done" && (
        <div role="status" aria-live="polite">
          <p className={inlineHeading}>{t.inlineDoneTitle}</p>
          <p className="text-[13px] leading-snug text-black/55">{t.inlineDoneBody}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`mt-1 ${inlineQuiet}`}
          >
            {t.inlineReload}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-[13px] leading-snug text-orange">
          {error}
        </p>
      )}
      {notice && step !== "merged" && (
        <p className="mt-3 text-[13px] font-semibold leading-snug text-teal">{notice}</p>
      )}
    </div>
  );
}

/**
 * Nedräkning på platsreservationen. Betalfönstret är ~15 minuter och gick
 * tidigare ut helt tyst — kunden såg "Väntar på Swish…" och fick sedan ett
 * timeout-fel utan att ha förstått att det tickade en klocka.
 */
function HoldCountdown({
  startedAt,
  notice,
  expired,
}: {
  startedAt: number;
  notice: (clock: string) => string;
  expired: string;
}) {
  // Föräldern monterar om komponenten via key={invoiceStartedAt}, så
  // initialvärdet räcker — effekten behöver bara hålla intervallet igång.
  const [remaining, setRemaining] = useState(() =>
    remainingCoursePaymentTimeout(startedAt),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(remainingCoursePaymentTimeout(startedAt));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return remaining > 0 ? (
    <p className="mt-2 text-[12px] font-semibold tabular-nums text-black/60">
      {notice(holdClock(remaining))}
    </p>
  ) : (
    <p role="alert" className="mt-2 text-[12px] font-semibold leading-snug text-orange">
      {expired}
    </p>
  );
}

/**
 * Villkorstexten kommer som markdown från plattformen men håller sig till
 * stycken och punktlistor. Renderas utan markdown-bibliotek för att hålla
 * kortet lätt — okänd syntax visas som vanlig text.
 */
function TermsBody({ markdown }: { markdown: string }) {
  const blocks = markdown.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l));
        if (isList) {
          return (
            <ul key={i} className="mb-3 list-disc space-y-1 pl-4 last:mb-0">
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^[-*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mb-3 last:mb-0">
            {lines.join(" ")}
          </p>
        );
      })}
    </>
  );
}
