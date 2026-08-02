"use client";

import { useState } from "react";

import type { Locale } from "@/lib/i18n";
import { kurserDict } from "@/lib/i18n/kurser";

type Props = {
  locale: Locale;
  courseId: number;
  termsVersion: string;
  termsMarkdown: string | null;
  /** true när kursen är full — anmälan blir en köplats i stället. */
  waitlist: boolean;
  loggedIn: boolean;
};

type Result = { ok: true; waitlisted: boolean } | { ok: false; message: string };

/**
 * Anmälan sker mot /api/courses/[id]/enrol som håller kontotoken serverside.
 * Idempotency-nyckeln skapas en gång per monterad knapp så att ett omförsök
 * efter timeout återanvänder samma anmälan i stället för att skapa två.
 */
export default function CourseEnrolButton({
  locale,
  courseId,
  termsVersion,
  termsMarkdown,
  waitlist,
  loggedIn,
}: Props) {
  const t = kurserDict[locale];
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [idempotencyKey] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 32)
      : `k${Date.now()}${Math.floor(Math.random() * 1e6)}`,
  );

  // Kontoportalen finns bara på /konto (ingen /en-variant ännu).
  const accountHref = `/konto?next=${encodeURIComponent(
    locale === "en" ? "/en/training#kurser" : "/trana#kurser",
  )}`;

  if (!loggedIn) {
    return (
      <div className="mt-auto border-t border-black/10 pt-5">
        <p className="mb-3 text-[13px] leading-snug text-black/50">{t.loginPrompt}</p>
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
    return (
      <div className="mt-auto border-t border-black/10 pt-5">
        <p className="mb-1 font-display text-xl uppercase leading-none text-black">
          {result.waitlisted ? t.waitlistSuccessTitle : t.successTitle}
        </p>
        <p className="text-[13px] leading-snug text-black/55">
          {result.waitlisted ? t.waitlistSuccessBody : t.successBody}
        </p>
      </div>
    );
  }

  async function submit() {
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch(`/api/courses/${courseId}/enrol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsVersion, idempotencyKey }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        status?: string;
        detail?: string;
      };
      if (!response.ok) {
        setResult({ ok: false, message: data.detail || t.errorGeneric });
        return;
      }
      setResult({ ok: true, waitlisted: data.status === "waitlisted" });
    } catch {
      setResult({ ok: false, message: t.errorGeneric });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-auto border-t border-black/10 pt-5">
      {termsMarkdown && (
        <p className="mb-3 text-[12px] leading-snug text-black/45">{termsMarkdown}</p>
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
        {busy ? t.submitting : waitlist ? t.waitlistCta : t.signupCta}
        {!busy && <span aria-hidden="true">→</span>}
      </button>
      {result && !result.ok && (
        <p role="alert" className="mt-3 text-[13px] leading-snug text-orange">
          {result.message}
        </p>
      )}
    </div>
  );
}
