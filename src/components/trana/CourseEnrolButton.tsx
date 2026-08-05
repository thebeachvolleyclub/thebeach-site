"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n";
import { kurserDict } from "@/lib/i18n/kurser";
import { courseSellerLine, COURSE_SELLER, holdClock } from "@/lib/courseSeller";
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
  priceLabel: string;
  priceSek: number;
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

type Phase = "idle" | "enrolling" | "startingSwish" | "waitingForSwish";

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
  priceLabel,
  priceSek,
  termsVersion,
  termsMarkdown,
  waitlist,
  loggedIn,
  returnPath,
}: Props) {
  const t = kurserDict[locale];
  const [accepted, setAccepted] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [swishHandoff, setSwishHandoff] = useState<SwishHandoff | null>(null);
  const [showDesktopSwish, setShowDesktopSwish] = useState(false);
  const [invoiceStartedAt, setInvoiceStartedAt] = useState<number | null>(null);
  const inFlight = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const fallbackAttemptKey = useRef(randomAttemptKey());

  // Kontoportalen finns bara på /konto (ingen /en-variant ännu).
  const here = returnPath ?? (locale === "en" ? "/en/training#kurser" : "/trana#kurser");
  const accountHref = `/konto?next=${encodeURIComponent(here)}`;

  useEffect(() => () => activeRequest.current?.abort(), []);

  async function submit() {
    if (inFlight.current) return;
    inFlight.current = true;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setResult(null);
    try {
      const storage = window.sessionStorage;
      const savedInvoice = pendingCourseInvoice(courseId, storage);
      if (savedInvoice) {
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
      const response = await fetch(`/api/courses/${courseId}/enrol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsVersion, idempotencyKey }),
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

      const invoiceId = courseInvoiceId(data);
      if (!invoiceId) {
        setResult({ ok: false, message: t.missingInvoice });
        return;
      }
      const invoiceCreatedAt = Date.now();
      setInvoiceStartedAt(invoiceCreatedAt);
      rememberCourseInvoice(courseId, invoiceId, storage, invoiceCreatedAt);

      setPhase("startingSwish");
      const chargeResponse = await fetch(
        `/api/courses/invoices/${encodeURIComponent(invoiceId)}/swish?locale=${locale}` +
          (returnPath ? `&returnPath=${encodeURIComponent(returnPath)}` : ""),
        { method: "POST", signal: controller.signal },
      );
      const charge = await json(chargeResponse);
      if (!chargeResponse.ok) {
        const detail = typeof charge.detail === "string" ? charge.detail : t.paymentFailed;
        setResult({ ok: false, message: detail });
        return;
      }
      const deepLinkUrl = courseSwishLaunchUrl(charge);
      if (!deepLinkUrl) {
        setResult({ ok: false, message: t.paymentFailed });
        return;
      }
      const qrCodeDataUrl = courseSwishQrCode(charge);
      const mobileDevice = courseSwishMobileDevice(
        window.navigator.userAgent,
        window.navigator.maxTouchPoints,
      );
      pushEvent("course_payment_start", {
        course_id: courseId,
        course_name: courseName,
        value: priceSek,
        currency: "SEK",
      });
      setSwishHandoff({ deepLinkUrl, qrCodeDataUrl });
      setShowDesktopSwish(!mobileDevice);
      rememberCourseInvoice(
        courseId,
        invoiceId,
        storage,
        invoiceCreatedAt,
        { deepLinkUrl, ...(qrCodeDataUrl ? { qrCodeDataUrl } : {}) },
      );

      setPhase("waitingForSwish");
      if (mobileDevice) window.location.assign(deepLinkUrl);
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
          value: priceSek,
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

  if (!loggedIn) {
    return (
      <div className="mt-auto border-t border-black/10 pt-5">
        <p className="mb-2 text-[13px] leading-snug text-black/70">{t.loginPrompt}</p>
        <p className="mb-3 text-[12px] leading-snug text-black/45">{t.loginWhy}</p>
        <a
          href={accountHref}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-black px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-opacity hover:opacity-80"
        >
          {t.loginCta} <span aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  if (result?.ok) {
    const waitlisted = result.kind === "waitlisted";
    return (
      <div className="mt-auto border-t border-black/10 pt-5">
        <p className="mb-1 font-display text-xl uppercase leading-none text-black">
          {waitlisted ? t.waitlistSuccessTitle : t.successTitle}
        </p>
        <p className="mb-4 text-[13px] leading-snug text-black/55">
          {waitlisted ? t.waitlistSuccessBody : t.successBody}
        </p>
        {!waitlisted && (
          <a
            href="/konto#traningsgrupper"
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-black/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-lime"
          >
            {t.myCoursesCta} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    );
  }

  const busy = phase !== "idle";
  const busyLabel =
    phase === "startingSwish"
      ? t.startingSwish
      : phase === "waitingForSwish"
        ? t.waitingForSwish
        : t.submitting;

  return (
    <div className="mt-auto border-t border-black/10 pt-5">
      <p className="mb-3 text-[12px] leading-snug text-black/45">{t.paymentNote}</p>

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
            {t.amountLabel(priceLabel)}
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
        disabled={!accepted || busy}
        onClick={submit}
        className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-black px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35"
      >
        {busy ? busyLabel : waitlist ? t.waitlistCta : t.signupCta}
        {!busy && <span aria-hidden="true">→</span>}
      </button>
      {busy && (
        <p role="status" aria-live="polite" className="sr-only">
          {busyLabel}
        </p>
      )}
      {result && !result.ok && (
        <div role="alert" className="mt-3 text-[13px] leading-snug text-orange">
          <p>{result.message}</p>
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
