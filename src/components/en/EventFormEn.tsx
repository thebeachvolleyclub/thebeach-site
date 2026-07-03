"use client";

import { useState } from "react";
import { postForm } from "@/lib/postForm";

const PACKAGES_EN = [
  "Las Palmas — from SEK 745/person",
  "Algarve — from SEK 945/person",
  "Miami — from SEK 1,195/person",
  "+ Conference in the sand (+SEK 395/person)",
  "Kids party",
  "Private party (wedding / birthday)",
  "Custom & large-scale event",
  "Christmas party (seasonal)",
];

const inputCls =
  "w-full border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-lime";
const labelCls =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-white/40";

export default function EventFormEn() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <section id="request" className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-2xl">
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.22em] text-lime">
          Book an event
        </span>
        <h2 className="mb-2 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-white lg:text-[clamp(3rem,5.5vw,5rem)]">
          Tell us about
          <br />
          your event
        </h2>
        <p className="mb-9 max-w-md text-sm leading-relaxed text-white/40">
          We reply within 24 hours with a proposal that fits your group and
          budget. No strings attached. English-speaking hosts available.
        </p>

        {sent ? (
          <div className="border border-lime/40 bg-lime/10 p-8 text-center">
            <p className="font-display text-2xl uppercase text-lime">Thank you!</p>
            <p className="mt-2 text-sm text-white/60">
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true); setErr(false);
              const ok = await postForm(e.currentTarget, "event-en");
              setBusy(false);
              if (ok) setSent(true); else setErr(true);
            }}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="en-name" className={labelCls}>Name</label>
                <input id="en-name" name="namn" className={inputCls} type="text" placeholder="Your name" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="en-email" className={labelCls}>Email</label>
                <input id="en-email" name="epost" className={inputCls} type="email" placeholder="you@company.com" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="en-tel" className={labelCls}>Phone (optional)</label>
                <input id="en-tel" name="telefon" className={inputCls} type="tel" placeholder="+46 ..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="en-date" className={labelCls}>Preferred date</label>
                <input id="en-date" name="datum" className={`${inputCls} [color-scheme:dark]`} type="date" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="en-size" className={labelCls}>Group size (approx.)</label>
                <select id="en-size" name="antal" className={inputCls} defaultValue="">
                  <option value="" disabled>Select group size</option>
                  <option>10–25 people</option>
                  <option>25–50 people</option>
                  <option>50–100 people</option>
                  <option>100–250 people</option>
                  <option>250+ people</option>
                </select>
              </div>
            </div>

            <fieldset className="flex flex-col gap-2.5">
              <legend className={labelCls}>I&apos;m interested in</legend>
              <div className="mt-1 flex flex-col gap-2.5">
                {PACKAGES_EN.map((p, i) => (
                  <label key={p} className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
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
              <label htmlFor="en-msg" className={labelCls}>Anything else? (optional)</label>
              <textarea
                id="en-msg" name="meddelande"
                className={`${inputCls} min-h-[100px] resize-y`}
                placeholder="Tell us about the occasion, dietary needs, timing…"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full cursor-pointer bg-lime py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright"
              disabled={busy}
            >
              {busy ? "Sending…" : "Send request →"}
            </button>
            {err ? (
              <p className="text-center text-xs text-orange">
                Something went wrong — please try again or email boka@thebeach.one
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
