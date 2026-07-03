"use client";

import { useState } from "react";
import { postForm } from "@/lib/postForm";

const labelCls = "text-[0.65rem] font-bold uppercase tracking-[0.15em] text-black/50";
const inputCls =
  "w-full border border-black/15 bg-white px-4 py-3.5 text-[15px] text-black placeholder:text-black/30 focus:border-black focus:outline-none";

export default function SchoolFormEn() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  if (sent) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="mb-1 font-display text-2xl uppercase text-black">Thank you!</p>
        <p className="text-sm text-black/50">We&apos;ll reply within 24 hours with available times.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(false);
        const ok = await postForm(e.currentTarget, "school-en");
        setBusy(false);
        if (ok) setSent(true); else setErr(true);
      }}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="se-name" className={labelCls}>Your name</label>
          <input id="se-name" name="namn" className={inputCls} type="text" placeholder="First and last name" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="se-school" className={labelCls}>School</label>
          <input id="se-school" name="skola" className={inputCls} type="text" placeholder="School name" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="se-email" className={labelCls}>Email</label>
          <input id="se-email" name="epost" className={inputCls} type="email" placeholder="you@school.se" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="se-count" className={labelCls}>Number of students (approx.)</label>
          <input id="se-count" name="antal" className={inputCls} type="number" min={5} placeholder="e.g. 28" required />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="se-date" className={labelCls}>Preferred dates/times</label>
          <input id="se-date" name="datum" className={inputCls} type="text" placeholder="e.g. Tuesday mornings, weeks 38–40" required />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="se-msg" className={labelCls}>Anything else? (optional)</label>
        <textarea id="se-msg" name="meddelande" className={`${inputCls} min-h-[90px]`} placeholder="Ages, with or without instructor…" />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
        disabled={busy}
      >
        {busy ? "Sending…" : <>Send request <span aria-hidden="true">→</span></>}
      </button>
      {err ? (
        <p className="text-xs text-orange">Something went wrong — try again or email boka@thebeach.one</p>
      ) : null}
    </form>
  );
}
