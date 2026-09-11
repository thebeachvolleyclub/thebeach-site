"use client";

import { useEffect, useRef, useState } from "react";
import { accountFetch, changeAccountContext } from "@/lib/accountClient";
import { isBirthdateValid } from "@/lib/birthdate";
import { normalizePersonName, validNameComponent } from "@/lib/personIdentity";
import { familyFailure, type FamilyProfilesFeed } from "@/lib/familyProfiles.core";

async function familyJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await accountFetch(url, init);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(familyFailure(payload, "Kunde inte läsa familjeprofilerna.").detail);
  return payload as T;
}

export default function FamilyProfiles({ currentProfileId }: { currentProfileId: number | null }) {
  const [feed, setFeed] = useState<FamilyProfilesFeed | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState<"M" | "W" | "">("");
  const [confirmed, setConfirmed] = useState(false);
  const [personalEmail, setPersonalEmail] = useState("");
  const [pendingPersonalEmail, setPendingPersonalEmail] = useState("");
  const [personalCode, setPersonalCode] = useState("");
  const [retireParent, setRetireParent] = useState(false);
  const attempt = useRef<{ body: string; key: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    familyJson<FamilyProfilesFeed>("/api/account/family", { signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        setFeed(result);
        try {
          const lastError = sessionStorage.getItem("tb-account-transition-error");
          if (lastError) setError(lastError);
          sessionStorage.removeItem("tb-account-transition-error");
        } catch { /* optional storage */ }
      })
      .catch((cause) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Kunde inte läsa familjeprofilerna."); });
    return () => controller.abort();
  }, [currentProfileId]);

  const createChild = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!validNameComponent(firstName) || !validNameComponent(lastName) || !isBirthdateValid(birthdate) || !gender || !confirmed) {
      setError("Fyll i barnets namn, födelsedatum och kön och bekräfta att du ansvarar för barnet.");
      return;
    }
    const body = JSON.stringify({
      first_name: normalizePersonName(firstName), last_name: normalizePersonName(lastName),
      birthdate, gender, parental_responsibility_confirmed: true, expected_contact_email: feed?.contact_email,
    });
    // Keep the key for retries of an uncertain response, not a different child.
    if (attempt.current?.body !== body) attempt.current = { body, key: crypto.randomUUID() };
    setBusy(true); setError(""); setMessage("");
    try {
      await familyJson("/api/account/family/children", {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.current.key }, body,
      });
      setFeed(await familyJson<FamilyProfilesFeed>("/api/account/family"));
      setCreating(false); setFirstName(""); setLastName(""); setBirthdate(""); setGender(""); setConfirmed(false);
      attempt.current = null;
      setMessage("Barnets profil är skapad. Välj Byt profil nedan för att använda barnets konto.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Kunde inte skapa barnets profil.");
      // Refresh the exact contact and require confirmation again on any failed
      // create, including a concurrent email change. Retain the retry key.
      setConfirmed(false);
      try { setFeed(await familyJson<FamilyProfilesFeed>("/api/account/family")); } catch { /* keep original error */ }
    }
    finally { setBusy(false); }
  };

  const switchProfile = async (playerId: number) => {
    if (busy) return;
    setBusy(true); setError("");
    try { await changeAccountContext("/api/account/family/switch", { player_id: playerId }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte byta profil."); setBusy(false); }
  };

  const requestPersonalEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const target = personalEmail.trim().toLowerCase();
      await familyJson("/api/account/family/personal-email/request", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ new_email: target }),
      });
      setPendingPersonalEmail(target); setPersonalCode(""); setRetireParent(false);
      setMessage(`En verifieringskod har skickats till ${target}. Föräldrakontakten ändras först när du bekräftar.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte skicka verifieringskoden."); }
    finally { setBusy(false); }
  };

  const confirmPersonalEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !retireParent || personalCode.length !== 6) return;
    setBusy(true); setError("");
    try {
      await familyJson("/api/account/family/personal-email/confirm", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_email: pendingPersonalEmail, code: personalCode, retire_parent_contact: true }),
      });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte bekräfta den egna adressen."); }
    finally { setBusy(false); }
  };

  const fieldClass = "min-h-11 w-full border border-black/20 bg-white px-3 text-sm outline-none focus:border-black";
  return <section className="border-b border-black/10 bg-white p-6 text-black sm:p-8" aria-labelledby="family-heading">
    <h3 id="family-heading" className="font-display text-3xl">Familjeprofiler</h3>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/60">Skapa en egen profil för ditt barn med ett eget BeachID. Din verifierade e-post används som föräldrakontakt, inte som barnets personliga adress. Du kan växla profil utan en ny inloggningskod.</p>
    {error ? <p role="alert" className="mt-4 border border-orange/30 bg-orange/5 p-3 text-sm">{error}</p> : null}
    {message ? <p role="status" className="mt-4 bg-mint p-3 text-sm">{message}</p> : null}
    {!feed && !error ? <p role="status" className="mt-4 text-sm text-black/50">Hämtar profiler…</p> : null}
    {feed ? <ul className="mt-5 space-y-2">{feed.profiles.map((item) => <li key={item.player_id} className="flex flex-wrap items-center justify-between gap-3 border border-black/10 bg-cream p-4">
      <div className="min-w-0"><strong className="block break-words">{item.emoji_icon || "🏐"} {item.name}</strong><span className="text-xs text-black/60">{item.relationship === "self" ? "Din profil" : "Barnprofil"} · BeachID {item.player_id}{item.email_type === "parent" ? " · Föräldrakontakt" : ""}</span></div>
      {item.is_current ? <span className="text-xs font-bold uppercase text-teal">Aktiv profil</span> : <button type="button" disabled={busy} onClick={() => switchProfile(item.player_id)} className="min-h-11 border border-black px-4 text-xs font-bold uppercase disabled:opacity-35">Byt profil</button>}
    </li>)}</ul> : null}
    {feed?.can_create_child && !creating ? <button type="button" onClick={() => setCreating(true)} disabled={busy} className="mt-5 min-h-11 bg-black px-5 text-xs font-bold uppercase text-lime disabled:opacity-35">Skapa barnprofil</button> : null}
    {creating ? <form onSubmit={createChild} className="mt-6 max-w-xl space-y-4 border-t border-black/10 pt-5">
      <h4 className="font-display text-2xl">Barnets uppgifter</h4>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Förnamn<input className={`${fieldClass} mt-1`} autoComplete="off" value={firstName} onChange={(event) => setFirstName(event.target.value)} maxLength={60} required disabled={busy} /></label><label className="block text-sm font-semibold">Efternamn<input className={`${fieldClass} mt-1`} autoComplete="off" value={lastName} onChange={(event) => setLastName(event.target.value)} maxLength={60} required disabled={busy} /></label></div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Födelsedatum<input className={`${fieldClass} mt-1`} type="date" value={birthdate} onChange={(event) => setBirthdate(event.target.value)} required disabled={busy} /></label><label className="block text-sm font-semibold">Kön<select className={`${fieldClass} mt-1`} value={gender} onChange={(event) => setGender(event.target.value as "M" | "W")} required disabled={busy}><option value="">Välj</option><option value="W">Flicka</option><option value="M">Pojke</option></select></label></div>
      <p className="text-xs leading-relaxed text-black/60">Barnets profil är privat från början. Ingen separat e-post behövs. När barnet får en egen adress kan den verifieras i barnets profil och föräldraadressen tas bort.</p>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} required disabled={busy} className="mt-1 h-4 w-4 shrink-0" /><span>Jag är vårdnadshavare eller har föräldraansvar för barnet och får skapa denna profil. Jag använder <strong className="break-all">{feed?.contact_email}</strong> som föräldrakontakt.</span></label>
      <div className="flex flex-wrap gap-3"><button type="submit" disabled={busy} className="min-h-11 bg-black px-5 text-xs font-bold uppercase text-lime disabled:opacity-35">{busy ? "Skapar…" : "Skapa barnprofil"}</button><button type="button" disabled={busy} onClick={() => setCreating(false)} className="min-h-11 border border-black px-5 text-xs font-bold uppercase">Avbryt</button></div>
    </form> : null}
    {feed?.current_has_parent_contact ? <div className="mt-6 max-w-xl space-y-4 border-t border-black/10 pt-5">
      <h4 className="font-display text-2xl">Egen e-post när barnet tar över</h4>
      <p className="text-sm leading-relaxed text-black/60">Verifiera barnets egen adress. När bytet bekräftas tas föräldrakontakten och förälderns möjlighet att byta till denna profil bort. Barnets BeachID, historik och anmälningar finns kvar.</p>
      <p className="break-all text-xs text-black/60">Föräldrakontakt: {(feed.current_parent_contacts ?? []).join(", ")}</p>
      {!pendingPersonalEmail ? <form onSubmit={requestPersonalEmail} className="space-y-3">
        <label className="block text-sm font-semibold">Barnets egen e-post<input type="email" autoComplete="off" required value={personalEmail} onChange={(event) => setPersonalEmail(event.target.value)} className={`${fieldClass} mt-1`} disabled={busy} /></label>
        <button type="submit" disabled={busy} className="min-h-11 border border-black px-4 text-xs font-bold uppercase disabled:opacity-35">Skicka verifieringskod</button>
      </form> : <form onSubmit={confirmPersonalEmail} className="space-y-3">
        <p className="break-all text-sm">Kod skickad till <strong>{pendingPersonalEmail}</strong></p>
        <label className="block text-sm font-semibold">Verifieringskod<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={personalCode} onChange={(event) => setPersonalCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className={`${fieldClass} mt-1`} disabled={busy} /></label>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" required checked={retireParent} onChange={(event) => setRetireParent(event.target.checked)} disabled={busy} className="mt-1 h-4 w-4 shrink-0" /><span>Jag bekräftar att barnet ska ta över med sin egen e-post och att föräldrakontakten och förälderns åtkomst ska tas bort.</span></label>
        <div className="flex flex-wrap gap-3"><button type="submit" disabled={busy || !retireParent || personalCode.length !== 6} className="min-h-11 bg-black px-4 text-xs font-bold uppercase text-lime disabled:opacity-35">Bekräfta och ta bort föräldrakontakt</button><button type="button" disabled={busy} onClick={() => { setPendingPersonalEmail(""); setPersonalCode(""); setRetireParent(false); }} className="min-h-11 border border-black px-4 text-xs font-bold uppercase">Avbryt</button></div>
      </form>}
    </div> : null}
  </section>;
}
