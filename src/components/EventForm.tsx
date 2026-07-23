"use client";

import { useState } from "react";
import { postForm } from "@/lib/postForm";
import type { Locale } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";

const inputCls =
  "w-full border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-lime";
const labelCls =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-white/40";

/** Startsidans eventformulär — texter/form-id ur src/lib/i18n/home.ts
 *  ("event-startsida" sv / "event-startsida-en" en). */
export default function EventForm({ locale = "sv" }: { locale?: Locale }) {
  const t = homeDict[locale].form;
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <section id={t.sectionId} className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-2xl">
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.22em] text-lime">
          {t.eyebrow}
        </span>
        <h2 className="mb-2 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-white lg:text-[clamp(3rem,5.5vw,5rem)]">
          {t.title1}
          <br />
          {t.title2}
        </h2>
        <p className="mb-9 max-w-md text-sm leading-relaxed text-white/40">
          {t.lead}
        </p>

        {sent ? (
          <div className="border border-lime/40 bg-lime/10 p-8 text-center">
            <p className="font-display text-2xl uppercase text-lime">{t.tack}</p>
            <p className="mt-2 text-sm text-white/60">
              {t.tackText}
            </p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true); setErr(false);
              const ok = await postForm(e.currentTarget, t.formId);
              setBusy(false);
              if (ok) setSent(true); else setErr(true);
            }}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lp-name" className={labelCls}>{t.namn}</label>
                <input id="lp-name" name="namn" className={inputCls} type="text" placeholder={t.namnPh} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lp-email" className={labelCls}>{t.epost}</label>
                <input id="lp-email" name="epost" className={inputCls} type="email" placeholder={t.epostPh} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lp-tel" className={labelCls}>{t.telefon}</label>
                <input id="lp-tel" name="telefon" className={inputCls} type="tel" placeholder={t.telefonPh} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lp-date" className={labelCls}>{t.datum}</label>
                <input id="lp-date" name="datum" className={`${inputCls} [color-scheme:dark]`} type="date" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="lp-size" className={labelCls}>{t.antal}</label>
                <select id="lp-size" name="antal" className={inputCls} defaultValue="">
                  <option value="" disabled>
                    {t.antalPh}
                  </option>
                  {t.sizes.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className="flex flex-col gap-2.5">
              <legend className={labelCls}>{t.intresse}</legend>
              <div className="mt-1 flex flex-col gap-2.5">
                {t.paket.map((p, i) => (
                  <label
                    key={p}
                    className="flex cursor-pointer items-center gap-3 text-sm text-white/60"
                  >
                    <input
                      type="checkbox"
                      name="intresse"
                      value={p}
                      defaultChecked={i === 1}
                      className="h-[18px] w-[18px] shrink-0 accent-lime"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lp-msg" className={labelCls}>{t.meddelande}</label>
              <textarea
                id="lp-msg" name="meddelande"
                className={`${inputCls} min-h-[100px] resize-y`}
                placeholder={t.meddelandePh}
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full cursor-pointer bg-lime py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright"
              disabled={busy}
            >
              {busy ? t.skickar : t.skicka}
            </button>
            {err ? (
              <p className="text-center text-xs text-orange">
                {t.fel}
              </p>
            ) : null}
            <p className="mt-1 text-xs leading-relaxed text-white/25">
              {t.fotnot}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
