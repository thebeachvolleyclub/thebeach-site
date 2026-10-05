"use client";

import { useState } from "react";
import { postForm } from "@/lib/postForm";

const labelCls = "text-[0.65rem] font-bold uppercase tracking-[0.15em] text-black/50";
const inputCls =
  "w-full border border-black/15 bg-white px-4 py-3.5 text-[15px] text-black placeholder:text-black/30 focus:border-black focus:outline-none";

export const ABONNEMANG_MAILTO =
  "mailto:boka@thebeach.one?subject=Abonnemang&body=" +
  encodeURIComponent(
    "Hej!\n\nJag vill fråga om ett banabonnemang.\n\nÖnskad veckodag och tid: \nStartvecka: \nNamn: \n",
  );

/**
 * Förfrågan om banabonnemang — postar till /api/forfragan med form="abonnemang"
 * (samma flöde som skol- och eventförfrågningarna: sparas i listan och mejlas
 * till boka@thebeach.one via Brevo). Mejl-länken under är reservutgång.
 */
export default function AbonnemangFormClient() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  if (sent) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="mb-1 font-display text-2xl uppercase text-black">Tack!</p>
        <p className="text-sm text-black/50">
          Vi kollar vad som är ledigt och hör av oss med ett erbjudande till din mejl.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(false);
        const ok = await postForm(e.currentTarget, "abonnemang");
        setBusy(false);
        if (ok) setSent(true); else setErr(true);
      }}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ab-name" className={labelCls}>Namn</label>
          <input id="ab-name" name="namn" className={inputCls} type="text" placeholder="För- och efternamn" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ab-email" className={labelCls}>E-post</label>
          <input id="ab-email" name="epost" className={inputCls} type="email" placeholder="du@exempel.se" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ab-tel" className={labelCls}>Telefon (valfritt)</label>
          <input id="ab-tel" name="telefon" className={inputCls} type="tel" placeholder="07x-xxx xx xx" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ab-time" className={labelCls}>Önskad veckodag och tid</label>
          <input id="ab-time" name="tid" className={inputCls} type="text" placeholder="t.ex. tisdagar 20.30" required />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="ab-start" className={labelCls}>Startvecka</label>
          <input id="ab-start" name="startvecka" className={inputCls} type="text" placeholder="t.ex. vecka 42, eller så snart som möjligt" required />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ab-msg" className={labelCls}>Övrigt</label>
        <textarea
          id="ab-msg"
          name="meddelande"
          className={`${inputCls} min-h-[90px]`}
          placeholder="Alternativa tider, hur många ni är, eller något annat vi bör veta"
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
        disabled={busy}
      >
        {busy ? "Skickar…" : <>Fråga om abonnemang <span aria-hidden="true">→</span></>}
      </button>
      {err ? (
        <p className="text-xs text-orange">
          Något gick fel. Prova igen eller{" "}
          <a href={ABONNEMANG_MAILTO} className="underline underline-offset-4">mejla oss direkt</a>.
        </p>
      ) : null}
      <p className="text-[11px] leading-snug text-black/35">
        Vi använder uppgifterna bara för att svara på din förfrågan. Hellre mejla?{" "}
        <a href={ABONNEMANG_MAILTO} className="underline underline-offset-4 hover:text-black/60">boka@thebeach.one</a>
      </p>
    </form>
  );
}
