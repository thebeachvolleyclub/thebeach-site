"use client";

import { useEffect, useState } from "react";

import {
  clearCourseAttempt,
  courseSwishReturnInvoice,
  pendingCourseInvoice,
  pollCoursePayment,
  recentPaidCourseEnrolment,
} from "@/lib/coursePayment.core";
import type { Locale } from "@/lib/i18n";
import { kurserDict } from "@/lib/i18n/kurser";

type ReturnState =
  | { kind: "idle" | "checking" }
  | { kind: "paid"; courseName: string | null }
  | { kind: "error" };

type StoredInvoice = {
  courseId: number;
  invoiceId: string;
  createdAt: number;
};

class ReturnStatusError extends Error {
  constructor(readonly status: number) {
    super(`Payment status returned ${status}`);
  }
}

function cleanReturnUrl() {
  const target = new URL(window.location.href);
  target.searchParams.delete("swish-return");
  target.searchParams.delete("invoice");
  window.history.replaceState(window.history.state, "", target.toString());
}

export default function CoursePaymentReturn({
  locale,
  courseIds,
}: {
  locale: Locale;
  courseIds: number[];
}) {
  const t = kurserDict[locale];
  const [state, setState] = useState<ReturnState>({ kind: "idle" });
  const courseIdsKey = courseIds.join(",");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("swish-return") !== "course") return;

    const controller = new AbortController();
    const ids = courseIdsKey.split(",").map(Number).filter(Number.isSafeInteger);
    const showChecking = window.setTimeout(() => setState({ kind: "checking" }), 0);

    async function latestReceipt(expectedInvoiceId?: string) {
      const response = await fetch("/api/courses/mine", {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new ReturnStatusError(response.status);
      return recentPaidCourseEnrolment(
        await response.json(),
        Date.now(),
        2 * 60 * 60_000,
        expectedInvoiceId,
      );
    }

    async function reconcile() {
      const callbackInvoice = courseSwishReturnInvoice(window.location.search);
      const stored = ids.flatMap((courseId): StoredInvoice[] => {
        const pending = pendingCourseInvoice(courseId, window.sessionStorage);
        return pending ? [{ courseId, ...pending }] : [];
      });
      const matchingStored = callbackInvoice
        ? stored.find((item) => item.invoiceId === callbackInvoice)
        : stored[0];
      const invoiceId = callbackInvoice ?? matchingStored?.invoiceId ?? null;

      if (invoiceId) {
        const payment = await pollCoursePayment(
          async () => {
            const response = await fetch(
              `/api/courses/invoices/${encodeURIComponent(invoiceId)}/status`,
              { cache: "no-store", signal: controller.signal },
            );
            if (!response.ok) throw new ReturnStatusError(response.status);
            return response.json();
          },
          {
            signal: controller.signal,
            timeoutMs: 60_000,
            shouldRetry: (cause) =>
              !(cause instanceof ReturnStatusError) || ![401, 403, 404].includes(cause.status),
          },
        );
        if (payment.state === "paid") {
          for (const item of stored) {
            if (item.invoiceId === invoiceId) {
              clearCourseAttempt(item.courseId, window.sessionStorage);
            }
          }
          const receipt = await latestReceipt(invoiceId).catch(() => null);
          cleanReturnUrl();
          setState({ kind: "paid", courseName: receipt?.courseName ?? null });
          return;
        }
      }

      // Compatibility for returns created before the callback contained its
      // invoice id, and a final authority check if polling missed the callback.
      const receipt = await latestReceipt(callbackInvoice ?? undefined);
      if (receipt) {
        clearCourseAttempt(receipt.courseId, window.sessionStorage);
        cleanReturnUrl();
        setState({ kind: "paid", courseName: receipt.courseName });
        return;
      }
      setState({ kind: "error" });
    }

    void reconcile().catch((cause) => {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setState({ kind: "error" });
    });
    return () => {
      window.clearTimeout(showChecking);
      controller.abort();
    };
  }, [courseIdsKey]);

  return (
    <div id="kursbetalning" className="scroll-mt-24">
      {state.kind !== "idle" && (
        <div
          role={state.kind === "error" ? "alert" : "status"}
          aria-live="polite"
          aria-busy={state.kind === "checking"}
          className={`mb-10 border-2 border-black p-6 sm:p-8 ${
            state.kind === "paid" ? "bg-lime" : "bg-white"
          }`}
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
            Swish
          </p>
          <h3 className="font-display text-3xl uppercase leading-none text-black sm:text-4xl">
            {state.kind === "checking"
              ? t.paymentReturnCheckingTitle
              : state.kind === "paid"
                ? t.successTitle
                : t.paymentFailed}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/65">
            {state.kind === "checking"
              ? t.paymentReturnCheckingBody
              : state.kind === "paid"
                ? t.paymentReturnSuccessBody(state.courseName)
                : t.paymentReturnError}
          </p>
          {state.kind === "error" && (
            <a
              href="/konto#traningsgrupper"
              className="mt-4 inline-flex min-h-[44px] items-center border border-black px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-black"
            >
              {t.myCoursesCta} <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
