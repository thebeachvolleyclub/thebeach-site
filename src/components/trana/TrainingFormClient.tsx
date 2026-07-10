"use client";

import { useState } from "react";
import { postForm } from "@/lib/postForm";

const inputCls =
  "w-full border border-black/15 bg-black/[0.04] px-4 py-3.5 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-black";
const labelCls = "text-[10px] font-bold uppercase tracking-[0.15em] text-black/70";

export default function TrainingFormClient({
  formName,
  groupLabel,
  reasonLabel,
  reasonPlaceholder,
  consentLabel,
  successText,
  note,
}: {
  formName: string;
  groupLabel: string;
  reasonLabel: string;
  reasonPlaceholder?: string;
  consentLabel: string;
  successText: string;
  note?: string;
}) {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  if (sent) {
    return (
      <div className="border border-black/20 bg-black/[0.04] p-8 text-center">
        <p className="font-display text-2xl uppercase text-black">Tack!</p>
        <p className="mt-2 text-sm text-black/60">{successText}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr(false);
        const ok = await postForm(e.currentTarget, formName);
        setBusy(false);
        if (ok) setSent(true);
        else setErr(true);
      }}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formName}-namn`} className={labelCls}>Namn</label>
          <input id={`${formName}-namn`} name="namn" className={inputCls} type="text" placeholder="För- och efternamn" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formName}-epost`} className={labelCls}>E-post</label>
          <input id={`${formName}-epost`} name="epost" className={inputCls} type="email" placeholder="din@epost.se" autoComplete="email" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formName}-tel`} className={labelCls}>Telefon</label>
          <input id={`${formName}-tel`} name="telefon" className={inputCls} type="tel" placeholder="070-000 00 00" autoComplete="tel" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formName}-grupp`} className={labelCls}>{groupLabel}</label>
          <input id={`${formName}-grupp`} name="grupp" className={inputCls} type="text" placeholder="T.ex. tisdag 19:00, nivå 3" required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formName}-msg`} className={labelCls}>{reasonLabel}</label>
        <textarea id={`${formName}-msg`} name="meddelande" className={`${inputCls} min-h-[110px] resize-y`} placeholder={reasonPlaceholder} />
      </div>

      <label className="mt-1 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-black/60">
        <input type="checkbox" name="bekraftelse" value={consentLabel} required className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-black" />
        {consentLabel}
      </label>

      {note ? <p className="text-[12px] leading-relaxed text-black/40">{note}</p> : null}

      {err && (
        <p className="text-[13px] font-semibold text-orange">Något gick fel. Försök igen om en stund.</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 self-start bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Skickar…" : <>Skicka <span aria-hidden="true">→</span></>}
      </button>
    </form>
  );
}
