"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";
import { postForm } from "@/lib/postForm";

// Inputs retreated for lime background: dark-on-light tokens
const inputCls =
  "w-full border border-black/15 bg-black/[0.06] px-4 py-3.5 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-black";
const labelCls =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-black/70";

// Slug (?paket=) → index i paketlistan (samma ordning som EVENT_PACKAGES i
// packages.ts på båda språken). Landningssidorna skickar sin slug så rätt
// ruta bockas i här.
const PAKET_INDEX: Record<string, number> = {
  laspalmas: 0,
  algarve: 1,
  miami: 2,
  konferens: 3,
  barnkalas: 4,
  teneriffa: 5,
  privat: 6,
  skraddarsytt: 7,
  julbord: 8,
};

// Default = Algarve (mest bokad) om ingen giltig slug finns.
const DEFAULT_INDEX = 1;

export default function EventRequestFormClient({ locale }: { locale: Locale }) {
  const t = eventsDict[locale];
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checked, setChecked] = useState<string[]>([t.form.paket[DEFAULT_INDEX]]);

  // Läs ?paket= efter mount (undviker dynamisk rendering av /events).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("paket");
    const idx = slug ? PAKET_INDEX[slug.toLowerCase()] : undefined;
    const paket = idx !== undefined ? t.form.paket[idx] : undefined;
    if (paket) setChecked([paket]);
  }, [t.form.paket]);

  const toggle = (p: string) =>
    setChecked((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  if (sent) {
    return (
      <div className="border border-black/20 bg-black/[0.06] p-8 text-center">
        <p className="font-display text-2xl uppercase text-black">{t.form.tack}</p>
        <p className="mt-2 text-sm text-black/60">
          {t.form.tackText}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(false);
        // Form-id: "event-sida" (sv) resp. "event-en" (en) — styr GTM/GA4-spårning.
        const ok = await postForm(e.currentTarget, t.form.formId);
        setBusy(false);
        if (ok) setSent(true); else setErr(true);
      }}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-name" className={labelCls}>
            {t.form.namn}
          </label>
          <input
            id="ev-name"
            name="namn"
            className={inputCls}
            type="text"
            placeholder={t.form.namnPh}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-email" className={labelCls}>
            {t.form.epost}
          </label>
          <input
            id="ev-email"
            name="epost"
            className={inputCls}
            type="email"
            placeholder={t.form.epostPh}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-tel" className={labelCls}>
            {t.form.telefon}
          </label>
          <input
            id="ev-tel"
            name="telefon"
            className={inputCls}
            type="tel"
            placeholder={t.form.telefonPh}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-date" className={labelCls}>
            {t.form.datum}
          </label>
          <input
            id="ev-date"
            name="datum"
            className={`${inputCls} [color-scheme:light]`}
            type="date"
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="ev-size" className={labelCls}>
            {t.form.antal}
          </label>
          <select id="ev-size" name="antal" className={inputCls} defaultValue="">
            <option value="" disabled>
              {t.form.antalPh}
            </option>
            {t.form.sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className={labelCls}>{t.form.intresse}</legend>
        <div className="mt-1 flex flex-col gap-2.5">
          {t.form.paket.map((p) => (
            <label
              key={p}
              className="flex cursor-pointer items-center gap-3 text-sm text-black/70"
            >
              <input
                type="checkbox"
                name="intresse"
                value={p}
                checked={checked.includes(p)}
                onChange={() => toggle(p)}
                className="h-[18px] w-[18px] shrink-0 accent-black"
              />
              {p}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ev-msg" className={labelCls}>
          {t.form.meddelande}
        </label>
        <textarea
          id="ev-msg" name="meddelande"
          className={`${inputCls} min-h-[100px] resize-y`}
          placeholder={t.form.meddelandePh}
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full cursor-pointer bg-black py-4 text-[13px] font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-panel"
        disabled={busy}
      >
        {busy ? t.form.skickar : t.form.skicka}
      </button>
      {err ? (
        <p className="text-center text-xs text-orange">
          {t.form.fel}
        </p>
      ) : null}
      <p className="mt-1 text-xs leading-relaxed text-black/40">
        {t.form.fotnot}{" "}
        <a
          href="mailto:boka@thebeach.one"
          className="underline hover:text-black/70"
        >
          {t.form.fotnotMail}
        </a>
      </p>
    </form>
  );
}
