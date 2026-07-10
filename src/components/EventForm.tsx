"use client";

import { useState } from "react";
import { EVENT_PACKAGES } from "@/lib/packages";
import { postForm } from "@/lib/postForm";

const inputCls =
  "w-full border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-lime";
const labelCls =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-white/40";

export default function EventForm() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <section id="event" className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-2xl">
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.22em] text-lime">
          Boka event
        </span>
        <h2 className="mb-2 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-white lg:text-[clamp(3rem,5.5vw,5rem)]">
          Berätta om
          <br />
          ditt event
        </h2>
        <p className="mb-9 max-w-md text-sm leading-relaxed text-white/40">
          Vi hör av oss inom 24 timmar med ett förslag som passar er grupp och
          budget. Ingen bindning.
        </p>

        {sent ? (
          <div className="border border-lime/40 bg-lime/10 p-8 text-center">
            <p className="font-display text-2xl uppercase text-lime">Tack!</p>
            <p className="mt-2 text-sm text-white/60">
              Vi hör av oss inom 24 timmar.
            </p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true); setErr(false);
              const ok = await postForm(e.currentTarget, "event-startsida");
              setBusy(false);
              if (ok) setSent(true); else setErr(true);
            }}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lp-name" className={labelCls}>Namn</label>
                <input id="lp-name" name="namn" className={inputCls} type="text" placeholder="Ditt namn" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lp-email" className={labelCls}>E-post</label>
                <input id="lp-email" name="epost" className={inputCls} type="email" placeholder="din@epost.se" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lp-tel" className={labelCls}>Telefon</label>
                <input id="lp-tel" name="telefon" className={inputCls} type="tel" placeholder="070-000 00 00" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lp-date" className={labelCls}>Önskat datum</label>
                <input id="lp-date" name="datum" className={`${inputCls} [color-scheme:dark]`} type="date" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="lp-size" className={labelCls}>Antal personer (ungefär)</label>
                <select id="lp-size" name="antal" className={inputCls} defaultValue="">
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
              <label htmlFor="lp-msg" className={labelCls}>Övrig info (frivilligt)</label>
              <textarea
                id="lp-msg" name="meddelande"
                className={`${inputCls} min-h-[100px] resize-y`}
                placeholder="Berätta mer om eventet, eventuella önskemål, tidsbegränsningar etc."
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full cursor-pointer bg-lime py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright"
              disabled={busy}
            >
              {busy ? "Skickar…" : "Skicka förfrågan →"}
            </button>
            {err ? (
              <p className="text-center text-xs text-orange">
                Något gick fel — försök igen eller mejla boka@thebeach.one
              </p>
            ) : null}
            <p className="mt-1 text-xs leading-relaxed text-white/25">
              Vi svarar inom 24 timmar. Skickar du hellre mail? Kontakta oss på
              boka@thebeach.one
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
