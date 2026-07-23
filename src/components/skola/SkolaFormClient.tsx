"use client";

import { useState } from "react";
import { postForm } from "@/lib/postForm";
import type { Locale } from "@/lib/i18n";
import { skolaDict } from "@/lib/i18n/skola";

const labelCls =
  "text-[0.65rem] font-bold uppercase tracking-[0.15em] text-black/50";
const inputCls =
  "w-full border border-black/15 bg-white px-4 py-3.5 text-[15px] text-black placeholder:text-black/30 focus:border-black focus:outline-none";

/** Skolförfrågan — en komponent, texter via ordboken (sv/en). */
export default function SkolaFormClient({ locale = "sv" }: { locale?: Locale }) {
  const t = skolaDict[locale].form;
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  if (sent) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="mb-1 font-display text-2xl uppercase text-black">{t.tack}</p>
        <p className="text-sm text-black/50">{t.tackText}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(false);
        const ok = await postForm(e.currentTarget, locale === "en" ? "skola-en" : "skola");
        setBusy(false);
        if (ok) setSent(true); else setErr(true);
      }}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-name" className={labelCls}>{t.namn}</label>
          <input id="sk-name" name="namn" className={inputCls} type="text" placeholder={t.namnPh} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-school" className={labelCls}>{t.skola}</label>
          <input id="sk-school" name="skola" className={inputCls} type="text" placeholder={t.skolaPh} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-email" className={labelCls}>{t.epost}</label>
          <input id="sk-email" name="epost" className={inputCls} type="email" placeholder={t.epostPh} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-tel" className={labelCls}>{t.telefon}</label>
          <input id="sk-tel" name="telefon" className={inputCls} type="tel" placeholder={t.telefonPh} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-count" className={labelCls}>{t.antal}</label>
          <input id="sk-count" name="antal" className={inputCls} type="number" min={5} placeholder={t.antalPh} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-date" className={labelCls}>{t.datum}</label>
          <input id="sk-date" name="datum" className={inputCls} type="text" placeholder={t.datumPh} required />
        </div>
      </div>
      <fieldset className="mt-1">
        <legend className={labelCls}>{t.upplagg}</legend>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-black/70">
            <input type="radio" name="intresse" value={t.alt1} defaultChecked className="h-4 w-4 accent-black" />
            {t.alt1}
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-black/70">
            <input type="radio" name="intresse" value={t.alt2} className="h-4 w-4 accent-black" />
            {t.alt2}
          </label>
        </div>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sk-msg" className={labelCls}>{t.ovrigt}</label>
        <textarea id="sk-msg" name="meddelande" className={`${inputCls} min-h-[90px]`} placeholder={t.ovrigtPh} />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
        disabled={busy}
      >
        {busy ? t.skickar : <>{t.skicka} <span aria-hidden="true">→</span></>}
      </button>
      {err ? <p className="text-xs text-orange">{t.fel}</p> : null}
      <p className="text-[11px] leading-snug text-black/35">{t.fotnot}</p>
    </form>
  );
}
