"use client";

import { useState } from "react";
import Reveal from "./Reveal";

// Brevo double-opt-in list "Nyhetsbrev – webb & IG 2026". Posts straight to
// Brevo (no backend), so the visitor never leaves the page. Confirmation mail
// is sent by Brevo automatically.
const BREVO_ENDPOINT =
  "https://407ccf77.sibforms.com/serve/MUIFAFEOMibvaZ5ur4jcCa6kQeEtwIe3YnMA62Sgo4YlTJwJ28HlgGz4x16Tlb2YRcy1yEqhvpeM0zrIWRJ5HFOsJeiWoMOFK3oeQSbZl5cGH9xkcyKUq95BKScNgnPwAjLBw9uSiX71UOkhHF-1bQf34QMcicuB7yhbYg3GZ8D1-f35qwN8nDayK8Si5Tr2uFAy_d-w3hnLMqzJ";

// Kort landskodslista — nordiskt först, sen några vanliga. Default +46.
const COUNTRY_CODES = [
  { code: "+46", label: "🇸🇪 +46" },
  { code: "+47", label: "🇳🇴 +47" },
  { code: "+45", label: "🇩🇰 +45" },
  { code: "+358", label: "🇫🇮 +358" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+31", label: "🇳🇱 +31" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+34", label: "🇪🇸 +34" },
  { code: "+39", label: "🇮🇹 +39" },
];

const fieldBase =
  "border border-black/15 bg-white/70 px-4 py-3.5 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-black";
const inputCls = `w-full ${fieldBase}`;
const labelCls =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-black/70";

/**
 * Nyhetsbrevssektion (Brevo), inbäddad. Träningsgrupperna säljer slut på
 * timmar — listan är kanalen för att vara först. Dubbel opt-in är på i Brevo.
 * Samlar även in mobil/WhatsApp (frivilligt).
 */
export default function Newsletter() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (n: string) =>
      (form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement)?.value ?? "";

    // Honeypot: if a bot filled it, pretend success and skip the request.
    if (val("email_address_check")) {
      setSent(true);
      return;
    }

    setBusy(true);
    setErr(false);
    try {
      const fd = new FormData();
      fd.append("EMAIL", val("EMAIL"));
      fd.append("FIRSTNAME", val("FIRSTNAME"));
      fd.append("OPT_IN", "1");
      fd.append("email_address_check", "");
      fd.append("locale", "sv");

      // Mobil/WhatsApp är frivilligt. Skicka bara om ett nummer angetts.
      // Normalisera: bara siffror, drop ledande 0 (landskoden ersätter den).
      const raw = val("WHATSAPP").replace(/[^\d]/g, "").replace(/^0+/, "");
      if (raw) {
        fd.append("WHATSAPP", raw);
        fd.append("WHATSAPP__COUNTRY_CODE", val("WHATSAPP__COUNTRY_CODE"));
      }

      // Brevo's serve endpoint doesn't send CORS headers, so the response is
      // opaque. Double opt-in means the confirmation mail is what actually
      // completes the signup, so an accepted POST is success enough.
      const res = await fetch(BREVO_ENDPOINT, { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (data?.success) setSent(true);
      else setErr(true);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="nyhetsbrev" className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <div className="mx-auto flex max-w-[1500px] flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
            Nyhetsbrev
          </p>
          <h2 className="mb-4 font-display text-[clamp(2rem,9vw,3.5rem)] leading-[0.9] text-black">
            Var först att veta
          </h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-black/60">
            Träningsgrupperna släpps en gång per säsong och går fort. Med
            nyhetsbrevet får du släpp, event och sista-minuten-tider direkt i
            inkorgen — före alla andra.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="w-full shrink-0 lg:w-[460px]">
          {sent ? (
            <div className="border border-black/20 bg-white/70 p-8 text-center">
              <p className="font-display text-2xl uppercase text-black">
                Nästan klar! ☀️
              </p>
              <p className="mt-2 text-sm text-black/60">
                Vi har skickat ett bekräftelsemejl till dig — klicka på länken i
                det så är du med. Kolla skräpposten om det dröjer en minut.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nl-firstname" className={labelCls}>
                  Förnamn
                </label>
                <input
                  id="nl-firstname"
                  name="FIRSTNAME"
                  className={inputCls}
                  type="text"
                  placeholder="Ditt förnamn"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="nl-email" className={labelCls}>
                  E-post
                </label>
                <input
                  id="nl-email"
                  name="EMAIL"
                  className={inputCls}
                  type="email"
                  placeholder="din@epost.se"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="nl-phone" className={labelCls}>
                  Mobil / WhatsApp <span className="text-black/40">(frivilligt)</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="WHATSAPP__COUNTRY_CODE"
                    defaultValue="+46"
                    aria-label="Landskod"
                    className={`${fieldBase} shrink-0 [color-scheme:light]`}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.label} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    id="nl-phone"
                    name="WHATSAPP"
                    className={`${fieldBase} min-w-0 flex-1`}
                    type="tel"
                    inputMode="tel"
                    placeholder="70 123 45 67"
                    autoComplete="tel-national"
                  />
                </div>
              </div>

              {/* Honeypot — hidden from humans */}
              <input
                type="text"
                name="email_address_check"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <label className="mt-1 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-black/60">
                <input
                  type="checkbox"
                  name="OPT_IN"
                  value="1"
                  required
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-black"
                />
                Ja tack — jag vill få nyheter och erbjudanden från The Beach. Du
                kan avanmäla dig när som helst.
              </label>

              {err && (
                <p className="text-[13px] font-semibold text-orange">
                  Något gick fel. Försök igen om en stund.
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 bg-black px-10 py-5 text-sm font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Skickar…" : (
                  <>
                    Håll mig uppdaterad <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
