"use client";

import { useState } from "react";
import { EVENT_PACKAGES } from "@/lib/packages";
import { postForm } from "@/lib/postForm";

// Inputs retreated for lime background: dark-on-light tokens
const inputCls =
  "w-full border border-black/15 bg-black/[0.06] px-4 py-3.5 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-black";
const labelCls =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-black/70";

export default function EventRequestFormClient() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  if (sent) {
    return (
      <div className="border border-black/20 bg-black/[0.06] p-8 text-center">
        <p className="font-display text-2xl uppercase text-black">Tack!</p>
        <p className="mt-2 text-sm text-black/60">
          Vi hör av oss inom 24 timmar.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(false);
        const ok = await postForm(e.currentTarget, "event-sida");
        setBusy(false);
        if (ok) setSent(true); else setErr(true);
      }}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-name" className={labelCls}>
            Namn
          </label>
          <input
            id="ev-name"
            name="namn"
            className={inputCls}
            type="text"
            placeholder="Ditt namn"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-email" className={labelCls}>
            E-post
          </label>
          <input
            id="ev-email"
            name="epost"
            className={inputCls}
            type="email"
            placeholder="din@epost.se"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-tel" className={labelCls}>
            Telefon
          </label>
          <input
            id="ev-tel"
            name="telefon"
            className={inputCls}
            type="tel"
            placeholder="070-000 00 00"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ev-date" className={labelCls}>
            Önskat datum
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
            Antal personer (ungefär)
          </label>
          <select id="ev-size" name="antal" className={inputCls} defaultValue="">
            <option value="" disabled>
              Välj storleksgrupp
            </option>
            <option>10–25 personer</option>
            <option>25–50 personer</option>
            <option>50–100 personer</option>
            <option>100–250 personer</option>
            <option>250+ personer</option>
          </select>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className={labelCls}>Jag är intresserad av</legend>
        <div className="mt-1 flex flex-col gap-2.5">
          {EVENT_PACKAGES.map((p, i) => (
            <label
              key={p}
              className="flex cursor-pointer items-center gap-3 text-sm text-black/70"
            >
              <input
                type="checkbox"
                name="intresse"
                value={p}
                defaultChecked={i === 1}
                className="h-[18px] w-[18px] shrink-0 accent-black"
              />
              {p}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ev-msg" className={labelCls}>
          Övrig info (frivilligt)
        </label>
        <textarea
          id="ev-msg" name="meddelande"
          className={`${inputCls} min-h-[100px] resize-y`}
          placeholder="Berätta mer om eventet, önskemål, tidsbegränsningar, om ni vill köra kväll eller dagtid etc."
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full cursor-pointer bg-black py-4 text-[13px] font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-panel"
        disabled={busy}
      >
        {busy ? "Skickar…" : "Skicka förfrågan →"}
      </button>
      {err ? (
        <p className="text-center text-xs text-orange">
          Något gick fel — försök igen eller mejla boka@thebeach.one
        </p>
      ) : null}
      <p className="mt-1 text-xs leading-relaxed text-black/40">
        Vi svarar inom 24 timmar. Skickar du hellre mail? Kontakta oss på{" "}
        <a
          href="mailto:boka@thebeach.one"
          className="underline hover:text-black/70"
        >
          boka@thebeach.one
        </a>
      </p>
    </form>
  );
}
