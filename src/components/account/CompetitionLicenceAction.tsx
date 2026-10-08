"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LICENCE_PERSONNUMMER_ERROR, normalizeLicencePersonnummer } from "@/lib/licencePersonnummer.core";

export default function CompetitionLicenceAction({ year, busy, onRequest }: {
  year: number;
  busy: boolean;
  onRequest: (personnummer: string) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [personnummer, setPersonnummer] = useState("");
  const [error, setError] = useState("");
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const generation = useRef(0);
  const mounted = useRef(true);
  const submitting = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  const close = () => { generation.current++; setPersonnummer(""); setError(""); setOpen(false); };
  const submit = async () => {
    if (busy || submitting.current) return;
    const normalized = normalizeLicencePersonnummer(personnummer);
    if (!normalized) { setError(LICENCE_PERSONNUMMER_ERROR); input.current?.focus(); return; }
    submitting.current = true;
    const attempt = generation.current;
    // Do not retain the entered number while waiting, even after an uncertain
    // result. Only the existing opaque retry key may survive a retry.
    setPersonnummer(""); setError("");
    try {
      const sent = await onRequest(normalized);
      if (!mounted.current || generation.current !== attempt) return;
      if (sent) close();
      else setError("Begäran kunde inte bekräftas. Ange personnumret igen om du vill försöka på nytt.");
    } finally { submitting.current = false; }
  };
  const button = "inline-flex min-h-11 cursor-pointer items-center justify-center bg-black px-5 py-3 text-xs font-bold uppercase tracking-[0.09em] text-white disabled:cursor-wait disabled:opacity-45";
  if (!open) return <button type="button" disabled={busy} onClick={() => setOpen(true)} aria-label={`Begär tävlingslicens ${year}`} className={button}>Begär tävlingslicens</button>;
  return <form aria-label={`Begär tävlingslicens ${year}`} data-analytics-ignore="true" data-hj-suppress noValidate onSubmit={(event) => { event.preventDefault(); void submit(); }} className="ph-no-capture max-w-xl border border-black/15 bg-white p-4 sm:p-5" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } }}>
    <h5 className="text-base font-bold">Tävlingslicens {year}</h5>
    <p id={`${inputId}-purpose`} className="mt-3 text-sm leading-relaxed text-black/60">Ditt fullständiga personnummer behövs för att registrera tävlingslicensen. Det används endast för licensregistreringen och är bara tillgängligt för behörig klubbpersonal, inte för andra spelare.</p>
    <label htmlFor={inputId} className="mt-4 block text-sm font-semibold">Personnummer (ÅÅÅÅMMDD-XXXX)</label>
    <input ref={input} id={inputId} aria-label="Personnummer för tävlingslicens" aria-describedby={`${inputId}-purpose${error ? ` ${inputId}-error` : ""}`} aria-invalid={Boolean(error)} required type="text" inputMode="numeric" autoComplete="off" spellCheck={false} value={personnummer} disabled={busy} onChange={(event) => { setPersonnummer(event.target.value); setError(""); }} placeholder="ÅÅÅÅMMDD-XXXX" className="mt-2 min-h-12 w-full min-w-0 border border-black/25 bg-cream px-3 text-base text-black outline-none focus:border-black" />
    {error ? <p id={`${inputId}-error`} role="alert" className="mt-3 text-sm text-orange">{error}</p> : null}
    <div className="mt-4 flex flex-wrap gap-3"><button type="submit" disabled={busy} className={button}>{busy ? "Skickar…" : "Skicka licensbegäran"}</button><button type="button" onClick={close} className="min-h-11 cursor-pointer border border-black px-5 py-3 text-xs font-semibold">Avbryt</button></div>
  </form>;
}
