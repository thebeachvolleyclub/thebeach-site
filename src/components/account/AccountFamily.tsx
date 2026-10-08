"use client";

import { useEffect, useRef, useState } from "react";
import { leaveAccountDrafts, reloadAccountDocument, type FamilyProfile, type FamilyProfiles } from "@/lib/accountFamily.core";
import { isBirthdateValid, normalizeBirthdate } from "@/lib/birthdate";

async function familyApi<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store", ...(body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(typeof payload.detail === "string" ? payload.detail : "Kunde inte slutföra. Försök igen."), { code: payload.code });
  }
  return payload as T;
}

function accountBoundary() {
  for (const kind of ["sessionStorage", "localStorage"] as const) {
    try { leaveAccountDrafts(window[kind]); } catch { /* Disabled storage must not prevent a verified switch. */ }
  }
  // A new document discards every old profile's feed, form, media and polling timer.
  // Do not preserve ?next= or provider return parameters across different people.
  reloadAccountDocument(true);
}

export default function AccountFamily({ onTransition }: { onTransition: (active: boolean) => void }) {
  const [family, setFamily] = useState<FamilyProfiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState<"M" | "W" | "">("");
  const [confirmed, setConfirmed] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const submitting = useRef(false);
  const creationKey = useRef("");
  const switching = useRef<{ playerId: number; key: string } | null>(null);

  useEffect(() => {
    let active = true;
    familyApi<FamilyProfiles>("/api/account/family/profiles")
      .then((result) => { if (active) setFamily(result); })
      .catch((cause) => { if (active) setError(cause.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const refresh = async () => {
    setLoading(true); setError("");
    try { setFamily(await familyApi<FamilyProfiles>("/api/account/family/profiles")); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte hämta profilerna."); }
    finally { setLoading(false); }
  };

  const switchTo = async (playerId: number) => {
    if (submitting.current) return;
    submitting.current = true; setBusy(true); setError(""); setMessage(""); onTransition(true);
    if (switching.current?.playerId !== playerId) switching.current = { playerId, key: crypto.randomUUID() };
    try {
      await familyApi("/api/account/family/switch", { playerId, idempotencyKey: switching.current.key });
      accountBoundary();
    } catch (cause) {
      onTransition(false);
      setError(cause instanceof Error ? cause.message : "Kunde inte byta profil.");
      if ((cause as { code?: string }).code === "FAMILY_EMAIL_VERIFICATION_REQUIRED") await refresh();
      // Keep the exact key after an uncertain response. The BFF recovers the
      // original switch even when its Set-Cookie arrived before the body failed.
    } finally { submitting.current = false; setBusy(false); }
  };

  const verifyInbox = async () => {
    if (submitting.current || !family) return;
    submitting.current = true; setBusy(true); setError("");
    try {
      if (!codeSent) {
        await familyApi("/api/account/auth/request-code", { email: family.contact_email });
        setCodeSent(true); setMessage(`En kod har skickats till ${family.contact_email}.`);
      } else {
        onTransition(true);
        await familyApi("/api/account/family/verify-inbox", { code });
        accountBoundary();
      }
    } catch (cause) { onTransition(false); setError(cause instanceof Error ? cause.message : "Kunde inte verifiera adressen."); }
    finally { submitting.current = false; setBusy(false); }
  };

  const changeDraft = (update: () => void) => { update(); creationKey.current = ""; setError(""); };
  const create = async () => {
    if (submitting.current || !family) return;
    const normalized = normalizeBirthdate(birthdate);
    if (!first.trim() || !last.trim() || !isBirthdateValid(normalized) || !gender || !confirmed) {
      setError("Fyll i namn, ett giltigt födelsedatum, kön och bekräfta ditt föräldraansvar."); return;
    }
    submitting.current = true; setBusy(true); setError(""); setMessage("");
    if (!creationKey.current) creationKey.current = crypto.randomUUID();
    try {
      const result = await familyApi<{ child: FamilyProfile }>("/api/account/family/children", {
        first_name: first.trim(), last_name: last.trim(), birthdate: normalized, gender,
        parental_responsibility_confirmed: confirmed, expected_contact_email: family.contact_email,
        idempotencyKey: creationKey.current,
      });
      setFamily({ ...family, profiles: [...family.profiles.filter((item) => item.player_id !== result.child.player_id), result.child] });
      setFirst(""); setLast(""); setBirthdate(""); setGender(""); setConfirmed(false);
      creationKey.current = ""; setCreating(false);
      setMessage("Barnets privata profil är skapad. Du är fortfarande i din egen profil. Välj barnet för att slutföra profilen eller hantera medlemskapet.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Kunde inte skapa barnprofilen.");
      if ((cause as { code?: string }).code === "FAMILY_CONTACT_CHANGED") { setConfirmed(false); creationKey.current = ""; await refresh(); }
      // Retain the draft and request key after a lost response; the server
      // replays the same child and never allocates another BeachID.
    } finally { submitting.current = false; setBusy(false); }
  };

  const button = "min-h-12 cursor-pointer bg-black px-5 py-3 text-sm font-bold text-white disabled:cursor-default disabled:opacity-40";
  const input = "min-h-12 w-full min-w-0 border border-black/20 bg-cream px-3 text-base outline-none focus:border-black";
  const requiresProof = family?.requires_email_verification || family?.shared_profiles_require_email_verification;
  return <section className="bg-white p-6 sm:p-8" aria-busy={busy || loading}>
    <h3 className="font-display text-3xl">Familj och profiler</h3>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/60">Byt mellan din egen profil och profiler kopplade till din verifierade e-postadress. Medlemskap, kurser, bokningar och profiluppgifter gäller alltid den person du har valt.</p>
    {loading ? <p role="status" className="mt-6 text-sm">Hämtar profiler…</p> : null}
    {error ? <p role="alert" className="mt-5 border border-orange/30 bg-orange/10 p-4 text-sm">{error}</p> : null}
    {message ? <p role="status" className="mt-5 border border-teal/20 bg-mint p-4 text-sm">{message}</p> : null}
    {!family && !loading ? <button type="button" className={`${button} mt-5`} onClick={refresh}>Försök igen</button> : null}
    {family && requiresProof ? <div className="mt-6 border border-black/15 bg-cream p-5">
      <p className="text-sm leading-relaxed">Verifiera din e-postadress en gång för att även visa befintliga profiler som delar adressen. Du stannar i din nuvarande profil.</p>
      <p className="mt-2 break-all text-sm font-bold">{family.contact_email}</p>
      {codeSent ? <label className="mt-4 block"><span className="mb-2 block text-sm font-semibold">Verifieringskod</span><input aria-label="Verifieringskod" value={code} disabled={busy} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className={input} /></label> : null}
      <button type="button" disabled={busy || (codeSent && code.length !== 6)} onClick={verifyInbox} className={`${button} mt-4`}>{codeSent ? "Verifiera och visa profiler" : "Skicka verifieringskod"}</button>
    </div> : null}
    {family ? <div className="mt-6 space-y-3">{family.profiles.map((item) => <button key={item.player_id} type="button" disabled={busy || item.is_current} onClick={() => switchTo(item.player_id)} aria-label={`${item.name}${item.is_current ? " · Aktiv profil" : " · Byt profil"}`} className={`flex min-h-20 w-full items-center gap-3 border p-4 text-left disabled:cursor-default ${item.is_current ? "border-teal bg-mint" : "cursor-pointer border-black/15 hover:border-black"}`}>
      <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-orange bg-cream text-2xl">{item.avatar_thumb_url ? <img src={item.avatar_thumb_url} alt="" className="h-full w-full object-cover" /> : item.emoji_icon || "🏐"}</span>
      <span className="min-w-0 flex-1"><strong className="block break-words">{item.name || "Spelare"}</strong><span className="mt-1 block text-xs text-black/55">BeachID {item.player_id} · {item.relationship === "child" ? "Barnprofil" : item.relationship === "shared_email" ? "Samma verifierade e-postadress" : "Din profil"}</span></span>
      <span className="shrink-0 text-xs font-bold">{item.is_current ? "Aktiv" : "Byt →"}</span>
    </button>)}</div> : null}
    {family && !loading ? <div className="mt-8 border-t border-black/10 pt-6">
      {family.can_create_child ? <>
        {!creating ? <button type="button" disabled={busy} onClick={() => { setCreating(true); setMessage(""); }} className={button}>Lägg till barn</button> : <form onSubmit={(event) => { event.preventDefault(); void create(); }}>
          <h4 className="font-display text-2xl">Skapa barnprofil</h4>
          <p className="mt-3 text-sm leading-relaxed text-black/60">Barnet får ett eget BeachID och en privat profil. Befintliga MATCHi-medlemskap kontrolleras automatiskt. Skapa inte en ny profil om barnet redan finns i listan ovan.</p>
          <p className="mt-3 break-all text-sm">Föräldrakontakt: <strong>{family.contact_email}</strong></p>
          <fieldset disabled={busy} className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-semibold">Barnets förnamn<input required aria-label="Barnets förnamn" value={first} maxLength={59} onChange={(event) => changeDraft(() => setFirst(event.target.value))} autoComplete="off" className={`${input} mt-2`} /></label>
            <label className="min-w-0 text-sm font-semibold">Barnets efternamn<input required aria-label="Barnets efternamn" value={last} maxLength={60} onChange={(event) => changeDraft(() => setLast(event.target.value))} autoComplete="off" className={`${input} mt-2`} /></label>
            <label className="min-w-0 text-sm font-semibold">Barnets födelsedatum<input required aria-label="Barnets födelsedatum" type="date" value={birthdate} max={new Date().toISOString().slice(0, 10)} onChange={(event) => changeDraft(() => setBirthdate(event.target.value))} className={`${input} mt-2`} /></label>
            <label className="min-w-0 text-sm font-semibold">Kön<select required aria-label="Kön" value={gender} onChange={(event) => changeDraft(() => setGender(event.target.value as "M" | "W" | ""))} className={`${input} mt-2`}><option value="">Välj</option><option value="W">Flicka</option><option value="M">Pojke</option></select></label>
            <label className="flex items-start gap-3 text-sm leading-relaxed sm:col-span-2"><input required type="checkbox" checked={confirmed} onChange={(event) => changeDraft(() => setConfirmed(event.target.checked))} className="mt-1 h-5 w-5 shrink-0 accent-black" /><span>Jag har föräldraansvar för barnet och vill använda e-postadressen ovan som föräldrakontakt.</span></label>
          </fieldset>
          <div className="mt-5 flex flex-wrap gap-3"><button type="submit" disabled={busy || !confirmed} className={button}>{busy ? "Skapar…" : "Skapa barnprofil"}</button><button type="button" disabled={busy} onClick={() => setCreating(false)} className="min-h-12 cursor-pointer border border-black px-5 text-sm font-semibold">Tillbaka</button></div>
        </form>}
      </> : <p className="text-sm text-black/55">{requiresProof ? "Verifiera adressen ovan för att hantera familjen." : family.current_player_id !== family.actor_player_id ? "Byt tillbaka till din egen profil för att lägga till ett barn." : "Ditt konto kan inte skapa en barnprofil just nu."}</p>}
    </div> : null}
  </section>;
}
