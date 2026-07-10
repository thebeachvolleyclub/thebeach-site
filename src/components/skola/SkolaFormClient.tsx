"use client";

import { useState } from "react";
import { postForm } from "@/lib/postForm";

const labelCls =
  "text-[0.65rem] font-bold uppercase tracking-[0.15em] text-black/50";
const inputCls =
  "w-full border border-black/15 bg-white px-4 py-3.5 text-[15px] text-black placeholder:text-black/30 focus:border-black focus:outline-none";

/**
 * Skolförfrågan. OBS: samma "sent"-mekanik som övriga formulär —
 * kopplas till riktig ändpunkt när e-postutskick (Brevo) är på plats.
 */
export default function SkolaFormClient() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  if (sent) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="mb-1 font-display text-2xl uppercase text-black">Tack!</p>
        <p className="text-sm text-black/50">
          Vi hör av oss inom 24 timmar med förslag på tider.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(false);
        const ok = await postForm(e.currentTarget, "skola");
        setBusy(false);
        if (ok) setSent(true); else setErr(true);
      }}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-name" className={labelCls}>Ditt namn</label>
          <input id="sk-name" name="namn" className={inputCls} type="text" placeholder="För- och efternamn" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-school" className={labelCls}>Skola</label>
          <input id="sk-school" name="skola" className={inputCls} type="text" placeholder="Skolans namn" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-email" className={labelCls}>E-post</label>
          <input id="sk-email" name="epost" className={inputCls} type="email" placeholder="din@skola.se" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-tel" className={labelCls}>Telefon</label>
          <input id="sk-tel" name="telefon" className={inputCls} type="tel" placeholder="070-000 00 00" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-count" className={labelCls}>Antal elever (cirka)</label>
          <input id="sk-count" name="antal" className={inputCls} type="number" min={5} placeholder="t.ex. 28" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sk-date" className={labelCls}>Önskade datum/tider</label>
          <input id="sk-date" name="datum" className={inputCls} type="text" placeholder="t.ex. tisdagar v. 38–40, fm" required />
        </div>
      </div>
      <fieldset className="mt-1">
        <legend className={labelCls}>Upplägg</legend>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-black/70">
            <input type="radio" name="intresse" value="Läraren leder (100 kr/elev)" defaultChecked className="h-4 w-4 accent-black" />
            Läraren leder (100 kr/elev, 1,5 h)
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-black/70">
            <input type="radio" name="intresse" value="Med instruktör — beachvolleyskola + turnering" className="h-4 w-4 accent-black" />
            Med instruktör — beachvolleyskola + turnering
          </label>
        </div>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sk-msg" className={labelCls}>Övrigt (valfritt)</label>
        <textarea id="sk-msg" name="meddelande" className={`${inputCls} min-h-[90px]`} placeholder="Åldrar, särskilda önskemål…" />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
        disabled={busy}
      >
        {busy ? "Skickar…" : <>Skicka förfrågan <span aria-hidden="true">→</span></>}
      </button>
      {err ? (
        <p className="text-xs text-orange">
          Något gick fel — försök igen eller mejla boka@thebeach.one
        </p>
      ) : null}
      <p className="text-[11px] leading-snug text-black/35">
        Vi svarar inom 24 timmar. Frågor? Mejla{" "}
        <a href="mailto:boka@thebeach.one" className="underline">boka@thebeach.one</a>
      </p>
    </form>
  );
}
