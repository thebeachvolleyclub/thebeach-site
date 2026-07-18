"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Profile = {
  id: string;
  email: string;
  name: string | null;
  birthdate: string | null;
  swish_phone: string | null;
  emoji_icon: string;
  description: string | null;
  is_public: boolean;
  avatar_url: string | null;
  avatar_thumb_url: string | null;
  banner_url: string | null;
  profile_complete: boolean;
  canonical_player_id: number | null;
  // Set on a profile save that hit the duplicate guard: a master-registry
  // player with the same name (+ birthdate when known). BeachID creation is
  // deferred until the user picks a path — see the alert card.
  duplicate_match?: { player_id: number; masked_email: string | null; birthdate_match: boolean } | null;
};

type FamilyUser = { id: string; name?: string | null; emoji_icon?: string | null; avatar_thumb_url?: string | null };
type Booking = {
  id: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  priceSek: number;
  streamRequested: boolean;
};
type InvoiceLine = { group_name: string; day_time?: string | null; amount_sek: number };
type Invoice = { id: string; amount_sek: number; status: string; paid_at?: string | null; created_at?: string | null; lines?: InvoiceLine[] };
type InvoiceFeed = { invoices: Invoice[]; active_count?: number };
type TrainingGroup = { group_name: string; day_time: string; court: number | null };
type TrainingLookup = { found: boolean; groups: TrainingGroup[]; message?: string | null };
type EmailAddress = { email: string; is_primary: boolean };
type EmailFeed = { addresses: EmailAddress[] };
type ActivityEntry = { name: string; date: string | null; groups?: string[] };
type ActivityFeed = { events: ActivityEntry[]; training_groups: ActivityEntry[] };
type AccountTab = "overview" | "training" | "bookings" | "invoices" | "profile";
type OverviewAvailability = { bookings: boolean; invoices: boolean; training: boolean; activity: boolean };
type CancellationResult = {
  booking: Booking;
  refundAmountSek?: number | null;
  bookingFeeSek?: number | null;
  refundPolicy?: string | null;
};

const EMOJIS = ["🏐", "🌴", "☀️", "🌊", "🦩", "🦀", "🐚", "🥥", "😎", "🔥", "⚡", "💪"];

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (typeof init?.body === "string") headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...init, headers });
  let payload: Record<string, unknown> = {};
  try { payload = await response.json() as Record<string, unknown>; } catch { /* handled below */ }
  if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Något gick fel");
  return payload as T;
}

function statusText(status: string) {
  return ({ CONFIRMED: "Bekräftad", PENDING_PAYMENT: "Väntar på Swish", REFUND_PENDING: "Återbetalning pågår", CANCELLED: "Avbokad", EXPIRED: "Utgången", sent: "Att betala", paid: "Betald", refunded: "Återbetald" } as Record<string, string>)[status] ?? status;
}

function cancellationMessage(result: CancellationResult) {
  if (result.refundPolicy === "LATE_NO_REFUND") {
    return "Bokningen är avbokad. Eftersom det är mindre än 24 timmar kvar görs ingen återbetalning.";
  }
  if ((result.refundAmountSek ?? 0) > 0) {
    const fee = result.bookingFeeSek ?? 0;
    return fee > 0
      ? `Bokningen är avbokad. En återbetalning på ${result.refundAmountSek} kr har startats efter bokningsavgiften på ${fee} kr.`
      : `Bokningen är avbokad. En full återbetalning på ${result.refundAmountSek} kr har startats.`;
  }
  return "Bokningen är avbokad.";
}

export default function AccountPortal() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<AccountTab>("overview");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [family, setFamily] = useState<FamilyUser[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [swish, setSwish] = useState("");
  const [description, setDescription] = useState("");
  // Duplicate-account alert (profile-setup guard) + merge confirmation.
  const [dupAlert, setDupAlert] = useState<NonNullable<Profile["duplicate_match"]> | null>(null);
  const [mergeMessage, setMergeMessage] = useState("");
  const [emoji, setEmoji] = useState("🏐");
  const [isPublic, setIsPublic] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailAddresses, setEmailAddresses] = useState<EmailAddress[]>([]);
  const [emailsAvailable, setEmailsAvailable] = useState(true);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeInvoiceCount, setActiveInvoiceCount] = useState(0);
  const [trainingGroups, setTrainingGroups] = useState<TrainingGroup[]>([]);
  const [activity, setActivity] = useState<ActivityFeed>({ events: [], training_groups: [] });
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewAvailability, setOverviewAvailability] = useState<OverviewAvailability>({ bookings: false, invoices: false, training: false, activity: false });
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const applyProfile = useCallback((next: Profile) => {
    setProfile(next);
    setName(next.name ?? "");
    setBirthdate(next.birthdate ?? "");
    setSwish(next.swish_phone ?? "");
    setDescription(next.description ?? "");
    setEmoji(next.emoji_icon || "🏐");
    setIsPublic(next.is_public);
  }, []);

  // Profile-first hand-back (?next=/anmalan): pages that require a signed-in
  // profile send visitors here to log in / register, then get them back.
  // Redirect ONLY once the profile has a name — a brand-new registrant stays
  // to complete their profile first, and bounces back right after saving it.
  // Strictly same-origin relative paths; anything else is ignored.
  const [nextPath, setNextPath] = useState<string | null>(null);
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("next");
    if (raw && /^\/[a-zA-Z0-9\-_/]*$/.test(raw) && !raw.startsWith("//")) setNextPath(raw);
  }, []);
  useEffect(() => {
    // Hold the hand-back while the duplicate alert is open — the user must
    // pick a path (old login / merge / new player) before continuing.
    if (nextPath && profile?.name?.trim() && !dupAlert) window.location.assign(nextPath);
  }, [nextPath, profile?.name, dupAlert]);

  // A fresh account has no name yet — profile completion IS the next step,
  // so land new registrants straight on the profile tab.
  useEffect(() => {
    if (profile && !profile.name?.trim()) setTab("profile");
  }, [profile]);

  const loadSession = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api<{ authenticated: boolean; profile?: Profile }>("/api/account/session");
      if (result.authenticated && result.profile) applyProfile(result.profile);
      else setProfile(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Kunde inte läsa kontot");
    } finally {
      setLoading(false);
    }
  }, [applyProfile]);

  useEffect(() => {
    let active = true;
    api<{ authenticated: boolean; profile?: Profile }>("/api/account/session")
      .then((result) => {
        if (!active) return;
        if (result.authenticated && result.profile) applyProfile(result.profile);
        else setProfile(null);
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Kunde inte läsa kontot");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [applyProfile]);

  const profileId = profile?.id;
  useEffect(() => {
    if (!profileId) return;
    let active = true;
    setOverviewLoading(true);
    setEmailsLoading(true);

    Promise.allSettled([
      api<Booking[]>("/api/booking/mine"),
      api<InvoiceFeed>("/api/account/invoices"),
      api<TrainingLookup>("/api/account/training"),
      api<EmailFeed>("/api/account/profile/emails"),
      api<ActivityFeed>("/api/account/activity"),
    ]).then(([bookingResult, invoiceResult, trainingResult, emailResult, activityResult]) => {
      if (!active) return;
      if (bookingResult.status === "fulfilled") setBookings(bookingResult.value);
      if (invoiceResult.status === "fulfilled") {
        setInvoices(invoiceResult.value.invoices ?? []);
        setActiveInvoiceCount(invoiceResult.value.active_count ?? 0);
      }
      if (trainingResult.status === "fulfilled") setTrainingGroups(trainingResult.value.groups ?? []);
      if (emailResult.status === "fulfilled") setEmailAddresses(emailResult.value.addresses ?? []);
      setEmailsAvailable(emailResult.status === "fulfilled");
      setEmailsLoading(false);
      if (activityResult.status === "fulfilled") {
        setActivity({
          events: activityResult.value.events ?? [],
          training_groups: activityResult.value.training_groups ?? [],
        });
      }
      setOverviewAvailability({
        bookings: bookingResult.status === "fulfilled",
        invoices: invoiceResult.status === "fulfilled",
        training: trainingResult.status === "fulfilled",
        activity: activityResult.status === "fulfilled",
      });
      setOverviewLoading(false);
    });

    return () => { active = false; };
  }, [profileId]);

  const requestCode = async () => {
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await api<{ message: string }>("/api/account/auth/request-code", { method: "POST", body: JSON.stringify({ email }) });
      setCodeSent(true); setMessage(result.message || "Koden är skickad till din e-post.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte skicka kod"); }
    finally { setBusy(false); }
  };

  const verify = async () => {
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await api<{ authenticated?: boolean; requiresSelection?: boolean; familyUsers?: FamilyUser[] }>("/api/account/auth/verify", { method: "POST", body: JSON.stringify({ email, code }) });
      if (result.requiresSelection) setFamily(result.familyUsers ?? []);
      else await loadSession();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte logga in"); }
    finally { setBusy(false); }
  };

  const selectFamily = async (userId: string) => {
    setBusy(true); setError("");
    try {
      await api("/api/account/auth/select-family", { method: "POST", body: JSON.stringify({ userId, candidateIds: family.map((item) => item.id) }) });
      setFamily([]); await loadSession();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte välja profil"); }
    finally { setBusy(false); }
  };

  const saveProfile = async (confirmNewIdentity = false) => {
    setBusy(true); setError(""); setMessage("");
    try {
      const next = await api<Profile>("/api/account/profile", {
        method: "PUT",
        body: JSON.stringify({
          name, swish_phone: swish, description, emoji_icon: emoji, is_public: isPublic,
          birthdate: birthdate.trim() || undefined,
          // Duplicate guard: a name/birthdate match in the player registry
          // pauses BeachID creation and raises the alert card instead.
          check_duplicates: true,
          confirm_new_identity: confirmNewIdentity || undefined,
        }),
      });
      applyProfile(next);
      if (next.duplicate_match) {
        setDupAlert(next.duplicate_match);
      } else {
        setDupAlert(null);
        setMessage("Profilen är sparad och uppdaterad i appen.");
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte spara profilen"); }
    finally { setBusy(false); }
  };

  const requestMerge = async () => {
    if (!dupAlert) return;
    setBusy(true); setError("");
    try {
      const result = await api<{ success: boolean; message?: string }>(
        "/api/account/merge-request",
        { method: "POST", body: JSON.stringify({ player_id: dupAlert.player_id }) },
      );
      setMergeMessage(result.message || "Begäran är registrerad. Fortsätt att skapa din profil — vi kontaktar dig när vi hanterat sammanslagningen.");
      setDupAlert(null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte skicka begäran"); }
    finally { setBusy(false); }
  };

  const upload = async (kind: "avatar" | "banner", file?: File) => {
    if (!file) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const form = new FormData(); form.set("file", file);
      await api(`/api/account/profile/${kind}`, { method: "POST", body: form });
      await loadSession(); setMessage(kind === "avatar" ? "Profilbilden är uppdaterad." : "Omslagsbilden är uppdaterad.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte ladda upp bilden"); }
    finally { setBusy(false); }
  };

  const removeImage = async (kind: "avatar" | "banner") => {
    setBusy(true); setError("");
    try { await api(`/api/account/profile/${kind}`, { method: "DELETE" }); await loadSession(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte ta bort bilden"); }
    finally { setBusy(false); }
  };

  const requestEmailCode = async (address?: string) => {
    setBusy(true); setError(""); setMessage("");
    setEmailCodeSent(false); setEmailCode(""); setPendingEmail("");
    try {
      const target = (address ?? newEmail).trim().toLowerCase();
      const result = await api<{ message: string }>("/api/account/profile/email/request-code", { method: "POST", body: JSON.stringify({ new_email: target }) });
      setPendingEmail(target);
      setEmailCodeSent(true); setMessage(result.message);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte skicka kod"); }
    finally { setBusy(false); }
  };

  const confirmEmail = async () => {
    setBusy(true); setError("");
    try {
      await api("/api/account/profile/email/confirm", { method: "POST", body: JSON.stringify({ new_email: pendingEmail, code: emailCode }) });
      const [session, emailFeed] = await Promise.all([
        api<{ authenticated: boolean; profile?: Profile }>("/api/account/session"),
        api<EmailFeed>("/api/account/profile/emails"),
      ]);
      if (session.authenticated && session.profile) applyProfile(session.profile);
      setEmailAddresses(emailFeed.addresses ?? []);
      setEmailsAvailable(true);
      setEmailsLoading(false);
      setEmailCodeSent(false); setEmailCode(""); setPendingEmail(""); setNewEmail("");
      setMessage("Primär e-post är uppdaterad. Din tidigare adress finns kvar som sekundär.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte byta e-post"); }
    finally { setBusy(false); }
  };

  const removeSecondaryEmail = async (address: string) => {
    if (!window.confirm(`Ta bort ${address} som inloggningsadress?`)) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await api<EmailFeed>("/api/account/profile/emails", {
        method: "DELETE",
        body: JSON.stringify({ email: address }),
      });
      setEmailAddresses(result.addresses ?? []);
      setMessage("Den sekundära e-postadressen är borttagen.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte ta bort e-postadressen"); }
    finally { setBusy(false); }
  };

  const cancelBooking = async (booking: Booking) => {
    if (!window.confirm("Avboka banan? Inom en timme efter bokning återbetalas hela beloppet. Minst 24 timmar före start återbetalas beloppet minus 20 kr. Senare sker ingen återbetalning.")) return;
    setCancellingBookingId(booking.id); setError(""); setMessage("");
    try {
      const result = await api<CancellationResult>(`/api/booking/${booking.id}/cancel`, { method: "POST" });
      setBookings((current) => current.map((item) => item.id === booking.id ? result.booking : item));
      setMessage(cancellationMessage(result));
      api<Booking[]>("/api/booking/mine")
        .then((next) => setBookings(next))
        .catch(() => null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Kunde inte avboka bokningen");
    } finally {
      setCancellingBookingId(null);
    }
  };

  const logout = async () => {
    await api("/api/account/auth/logout", { method: "POST" }).catch(() => null);
    setProfile(null); setCodeSent(false); setCode(""); setMessage(""); setTab("overview");
    setBookings([]); setInvoices([]); setTrainingGroups([]); setActiveInvoiceCount(0);
    setEmailAddresses([]); setActivity({ events: [], training_groups: [] });
    setEmailsLoading(true);
    setNewEmail(""); setPendingEmail(""); setEmailCode(""); setEmailCodeSent(false);
    setOverviewLoading(true);
    setOverviewAvailability({ bookings: false, invoices: false, training: false, activity: false });
  };

  const now = new Date().toISOString().slice(0, 10);
  const visibleBookings = useMemo(() => bookings.filter((item) =>
    ["CONFIRMED", "PENDING_PAYMENT", "REFUND_PENDING"].includes(item.status)), [bookings]);
  const currentBookings = useMemo(() => visibleBookings
    .filter((item) => item.date >= now)
    .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`)), [visibleBookings, now]);
  const previousBookings = useMemo(() => visibleBookings
    .filter((item) => !currentBookings.includes(item))
    .sort((a, b) => `${b.date}T${b.startTime}`.localeCompare(`${a.date}T${a.startTime}`)), [visibleBookings, currentBookings]);
  const confirmedBookingCount = useMemo(() => visibleBookings.filter((item) => item.status === "CONFIRMED").length, [visibleBookings]);

  if (loading) return <div className="min-h-80 border border-white/10 bg-white/[0.03] p-8 text-bone/55">Hämtar ditt konto…</div>;

  if (!profile) {
    return <div className="mx-auto max-w-xl border border-white/10 bg-white p-7 text-black sm:p-10">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">The Beach-konto</p>
      <h2 className="font-display text-4xl">Logga in eller skapa konto</h2>
      <p className="mt-4 text-sm leading-relaxed text-black/55">Ange din e-post så skickar vi samma sexsiffriga kod som i appen. Om du är ny skapas kontot när adressen är verifierad.</p>
      {family.length ? <div className="mt-7 space-y-2"><strong className="block text-sm">Vem loggar in?</strong>{family.map((item) => <button key={item.id} type="button" disabled={busy} onClick={() => selectFamily(item.id)} className="flex w-full cursor-pointer items-center gap-3 border border-black/15 p-3 text-left hover:border-black"><span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-mint text-xl">{item.avatar_thumb_url ? <img src={item.avatar_thumb_url} alt="" className="h-full w-full object-cover" /> : item.emoji_icon || "🏐"}</span><span className="font-semibold">{item.name || "Spelare"}</span></button>)}</div> : <div className="mt-7 space-y-4">
        <label className="block"><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-black/55">E-post</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className="min-h-13 w-full border border-black/20 bg-cream px-4 text-base outline-none focus:border-black" /></label>
        {codeSent ? <label className="block"><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-black/55">Sexsiffrig kod</span><input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className="min-h-13 w-full border border-black/20 bg-cream px-4 text-center text-xl tracking-[0.35em] outline-none focus:border-black" /></label> : null}
        <button type="button" disabled={busy || !email || (codeSent && code.length !== 6)} onClick={codeSent ? verify : requestCode} className="min-h-13 w-full cursor-pointer bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime disabled:opacity-35">{busy ? "Vänta…" : codeSent ? "Logga in" : "Skicka kod"}</button>
        {codeSent ? <button type="button" onClick={() => { setCodeSent(false); setCode(""); setMessage(""); }} className="w-full cursor-pointer text-xs font-bold uppercase text-black/50 hover:text-black">Byt e-postadress</button> : null}
      </div>}
      {message ? <p className="mt-5 text-sm font-semibold text-teal">{message}</p> : null}
      {error ? <p role="alert" className="mt-5 text-sm font-semibold text-orange">{error}</p> : null}
    </div>;
  }

  return <div className="text-black">
    <div className="relative min-h-52 overflow-hidden bg-black">
      {profile.banner_url ? <img src={profile.banner_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="relative flex min-h-52 items-end gap-5 p-6 sm:p-8">
        <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-lime bg-mint text-4xl">{profile.avatar_thumb_url || profile.avatar_url ? <img src={profile.avatar_thumb_url || profile.avatar_url || ""} alt="" className="h-full w-full object-cover" /> : profile.emoji_icon || "🏐"}</span>
        <div className="min-w-0 text-white"><p className="text-xs font-bold uppercase tracking-[0.16em] text-lime">Mitt konto</p><h2 className="mt-2 font-display text-3xl">{profile.name || "Slutför din profil"}</h2><div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/65"><span className="break-all">{profile.email}</span><span className="rounded-full border border-white/25 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white">BeachID {profile.canonical_player_id ?? "—"}</span></div></div>
      </div>
    </div>
    <div className="flex flex-wrap border-x border-b border-black/10 bg-white p-2">{[["overview", "Översikt"], ["training", "Träningsgrupper"], ["bookings", "Bokningar"], ["invoices", "Fakturor"], ["profile", "Profil"]].map(([value, label]) => <button key={value} type="button" onClick={() => { setTab(value as AccountTab); setError(""); setMessage(""); }} className={`cursor-pointer px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] sm:px-5 ${tab === value ? "bg-black text-lime" : "text-black/55 hover:text-black"}`}>{label}</button>)}<button type="button" onClick={logout} className="ml-auto cursor-pointer px-4 py-3 text-xs font-bold uppercase text-orange sm:px-5">Logga ut</button></div>

    {(!profile.name || !profile.swish_phone) ? <div className="flex flex-wrap items-center justify-between gap-3 border-x border-b border-orange/30 bg-orange/10 p-5 text-sm"><span><strong>Slutför kontot.</strong> Namn krävs för kontot och Swish-nummer krävs när du bokar bana.</span><button type="button" onClick={() => setTab("profile")} className="cursor-pointer text-xs font-bold uppercase tracking-[0.08em] text-orange underline underline-offset-4">Öppna profil</button></div> : null}
    {message ? <p className="border-x border-b border-teal/20 bg-mint p-4 text-sm font-semibold text-teal">{message}</p> : null}
    {error ? <p role="alert" className="border-x border-b border-orange/30 bg-orange/10 p-4 text-sm font-semibold text-orange">{error}</p> : null}

    {tab === "overview" ? <AccountOverview
      profile={profile}
      loading={overviewLoading}
      confirmedBookingCount={confirmedBookingCount}
      currentBookings={currentBookings}
      previousBookings={previousBookings}
      trainingGroups={trainingGroups}
      activity={activity}
      activeInvoiceCount={activeInvoiceCount}
      availability={overviewAvailability}
      onOpenProfile={() => setTab("profile")}
      onOpenInvoices={() => setTab("invoices")}
      onCancelBooking={cancelBooking}
      cancellingBookingId={cancellingBookingId}
    /> : null}

    {tab === "training" ? <AccountTraining
      loading={overviewLoading}
      trainingGroups={trainingGroups}
      availability={overviewAvailability}
    /> : null}

    {tab === "profile" ? <>
    {dupAlert ? <div className="border-x border-b border-orange/40 bg-orange/10 p-6">
      <p className="font-display text-2xl uppercase text-black">Är det här du?</p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/75">
        En spelare med ditt namn{dupAlert.birthdate_match ? " och födelsedatum" : ""} finns redan i våra
        register{dupAlert.masked_email ? <>, kopplad till e-postadressen <strong className="text-black">{dupAlert.masked_email}</strong></> : null}.
      </p>
      <p className="mt-4 text-sm font-bold text-black">Om detta är din profil kan du:</p>
      <ol className="mt-2 max-w-2xl space-y-3 text-sm leading-relaxed text-black/75">
        <li className="flex gap-2"><span className="font-bold">1.</span><span>
          Om du fortfarande har tillgång till den e-postadressen: logga ut och logga in med den i stället.
          Du kan sedan ändra din e-post här under profilinställningarna.{" "}
          <button type="button" onClick={logout} className="cursor-pointer font-bold text-teal underline underline-offset-4">Logga ut och logga in med den →</button>
        </span></li>
        <li className="flex gap-2"><span className="font-bold">2.</span><span>
          Om du inte längre har tillgång till den e-postadressen: begär att din profil slås ihop med din
          gamla data så löser vi det inom kort. Fortsätt sedan att skapa din profil — vi kontaktar dig när
          vi hanterat sammanslagningen.{" "}
          <button type="button" onClick={requestMerge} disabled={busy} className="cursor-pointer font-bold text-teal underline underline-offset-4 disabled:opacity-40">Begär sammanslagning →</button>
        </span></li>
      </ol>
      <div className="mt-5 border-t border-black/10 pt-4">
        <p className="text-sm leading-relaxed text-black/60">Om detta inte är du kan du helt enkelt fortsätta att skapa din profil som vanligt.</p>
        <button type="button" onClick={() => saveProfile(true)} disabled={busy} className="mt-2 min-h-11 cursor-pointer bg-black px-5 text-xs font-bold uppercase tracking-[0.08em] text-lime disabled:opacity-35">Det är inte jag — fortsätt som vanligt</button>
      </div>
    </div> : null}
    {mergeMessage ? <div className="border-x border-b border-teal/30 bg-mint p-5 text-sm leading-relaxed text-teal">{mergeMessage}</div> : null}
    <div className="grid gap-0.5 bg-black/10 lg:grid-cols-2">
      <section className="bg-white p-6 sm:p-8"><p className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-black/45">Uppgifter</p><div className="space-y-4">
        <label className="block"><span className="mb-1 block text-xs font-bold uppercase text-black/50">Namn *</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="min-h-12 w-full border border-black/20 bg-cream px-4 outline-none focus:border-black" /><span className="mt-1 block text-xs text-black/45">Krävs — för- och efternamn.</span></label>
        <label className="block"><span className="mb-1 block text-xs font-bold uppercase text-black/50">Födelsedatum</span><input value={birthdate} onChange={(e) => setBirthdate(e.target.value)} placeholder="ÅÅÅÅ-MM-DD" inputMode="numeric" className="min-h-12 w-full border border-black/20 bg-cream px-4 outline-none focus:border-black" /><span className="mt-1 block text-xs text-black/45">Frivilligt — men hjälper oss koppla din spelhistorik och undvika dubbletter.</span></label>
        <label className="block"><span className="mb-1 block text-xs font-bold uppercase text-black/50">Swish-nummer</span><input value={swish} onChange={(e) => setSwish(e.target.value)} type="tel" autoComplete="tel" className="min-h-12 w-full border border-black/20 bg-cream px-4 outline-none focus:border-black" /><span className="mt-1 block text-xs text-black/45">Används för betalningsbegäran när du bokar.</span></label>
        <label className="block"><span className="mb-1 block text-xs font-bold uppercase text-black/50">Presentation</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={255} rows={4} className="w-full border border-black/20 bg-cream p-4 outline-none focus:border-black" /></label>
        <label className="flex items-center gap-3 border border-black/10 p-4 text-sm"><input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="h-5 w-5 accent-black" /><span><strong className="block">Offentlig spelarprofil</strong><span className="text-black/45">Gör att andra spelare kan hitta dig.</span></span></label>
        <button type="button" onClick={() => saveProfile()} disabled={busy || name.trim().length < 2} className="min-h-12 w-full cursor-pointer bg-black px-6 text-xs font-bold uppercase tracking-[0.08em] text-lime disabled:opacity-35">Spara profil</button>
      </div></section>
      <section className="bg-cream p-6 sm:p-8"><p className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-black/45">Avatar och bilder</p><strong className="mb-2 block text-sm">Emoji-avatar</strong><div className="mb-6 flex flex-wrap gap-2">{EMOJIS.map((item) => <button key={item} type="button" onClick={() => setEmoji(item)} className={`grid h-11 w-11 cursor-pointer place-items-center border text-xl ${emoji === item ? "border-black bg-black" : "border-black/15 bg-white"}`}>{item}</button>)}</div>
        <div className="space-y-3"><label className="flex cursor-pointer items-center justify-between border border-black/15 bg-white p-4 text-sm font-semibold"><span>Välj profilfoto</span><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => upload("avatar", e.target.files?.[0])} /><span>Välj →</span></label>{profile.avatar_url ? <button type="button" onClick={() => removeImage("avatar")} className="text-xs font-bold uppercase text-orange">Ta bort profilfoto</button> : null}<label className="flex cursor-pointer items-center justify-between border border-black/15 bg-white p-4 text-sm font-semibold"><span>Välj omslagsbild</span><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => upload("banner", e.target.files?.[0])} /><span>Välj →</span></label><button type="button" onClick={() => removeImage("banner")} className="text-xs font-bold uppercase text-orange">Återställ omslagsbild</button></div>
      </section>
      <section className="bg-white p-6 sm:p-8 lg:col-span-2">
        <div className="flex flex-col gap-3 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Identitet och inloggning</p><h3 className="mt-2 font-display text-3xl">Mina e-postadresser</h3></div><div className="shrink-0 border border-black/10 bg-cream px-4 py-3"><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-black/40">BeachID</span><strong className="font-display text-2xl">{profile.canonical_player_id ?? "Ej tilldelat"}</strong></div></div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/55">Alla adresser kan användas för inloggning. När du väljer en ny primär adress verifierar vi den med en kod och behåller den gamla som sekundär.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>{emailsLoading ? <OverviewLoading /> : emailsAvailable ? <div className="space-y-2">{emailAddresses.map((address) => <div key={address.email} className="flex flex-col gap-3 border border-black/10 bg-cream p-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><span className="break-all text-sm font-semibold">{address.email}</span>{address.is_primary ? <span className="ml-2 inline-flex rounded-full bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-lime">Primär</span> : <span className="ml-2 inline-flex rounded-full border border-black/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-black/45">Sekundär</span>}</div>{!address.is_primary ? <div className="flex flex-wrap gap-2"><button type="button" onClick={() => requestEmailCode(address.email)} disabled={busy} className="min-h-10 cursor-pointer border border-black px-3 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors hover:bg-black hover:text-lime disabled:opacity-35">Gör primär</button><button type="button" onClick={() => removeSecondaryEmail(address.email)} disabled={busy} className="min-h-10 cursor-pointer border border-orange px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-orange transition-colors hover:bg-orange hover:text-white disabled:opacity-35">Ta bort</button></div> : null}</div>)}</div> : <p className="border border-orange/20 bg-orange/5 p-4 text-sm text-black/55">Kunde inte hämta e-postadresserna just nu.</p>}</div>
          <div className="border border-black/10 p-5"><strong className="block text-sm">Lägg till ny primär adress</strong><p className="mt-1 text-xs leading-relaxed text-black/45">{profile.canonical_player_id ? "En verifieringskod skickas till den nya adressen." : "Spara ditt namn först så att kontot får ett BeachID."}</p><div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" autoComplete="email" placeholder="namn@exempel.se" disabled={!profile.canonical_player_id} className="min-h-11 min-w-0 flex-1 border border-black/20 bg-white px-3 outline-none focus:border-black disabled:bg-black/5" /><button type="button" onClick={() => requestEmailCode()} disabled={busy || !profile.canonical_player_id || !newEmail.trim() || newEmail.trim().toLowerCase() === profile.email.toLowerCase()} className="min-h-11 cursor-pointer bg-black px-4 text-xs font-bold uppercase text-lime disabled:opacity-35">Verifiera</button></div>
            {emailCodeSent ? <div className="mt-4 border-t border-black/10 pt-4"><p className="mb-2 text-xs text-black/55">Kod skickad till <strong className="break-all text-black">{pendingEmail}</strong></p><div className="flex flex-col gap-2 sm:flex-row"><input value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="Sexsiffrig kod" className="min-h-11 min-w-0 flex-1 border border-black/20 bg-white px-3 text-center tracking-[0.2em] outline-none" /><button type="button" onClick={confirmEmail} disabled={emailCode.length !== 6 || busy} className="min-h-11 bg-teal px-4 text-xs font-bold uppercase text-white disabled:opacity-35">Bekräfta</button><button type="button" onClick={() => { setEmailCodeSent(false); setEmailCode(""); setPendingEmail(""); }} className="min-h-11 px-3 text-xs font-bold uppercase text-black/45">Avbryt</button></div></div> : null}
          </div>
        </div>
      </section>
    </div></> : null}

    {tab === "bookings" ? <section className="bg-white p-6 sm:p-8"><h3 className="font-display text-3xl">Mina bokningar</h3><BookingList title="Kommande" items={currentBookings} empty="Du har inga kommande bokningar." onCancel={cancelBooking} cancellingBookingId={cancellingBookingId} /><BookingList title="Tidigare" items={previousBookings} empty="Du har inga tidigare bokningar." /></section> : null}
    {tab === "invoices" ? <section className="bg-white p-6 sm:p-8"><h3 className="font-display text-3xl">Mina fakturor</h3>{invoices.length === 0 ? <p className="mt-8 border border-black/10 bg-cream p-5 text-sm text-black/50">Inga genererade fakturor.</p> : <div className="mt-7 space-y-3">{invoices.map((invoice) => <article key={invoice.id} className="border border-black/10 p-5"><div className="flex items-start justify-between gap-4"><div><strong className="block">Träningsfaktura</strong><span className="text-sm text-black/45">{invoice.created_at?.slice(0, 10) || invoice.id.slice(0, 8)}</span></div><div className="text-right"><strong className="block text-xl">{invoice.amount_sek} kr</strong><span className="text-xs font-bold uppercase text-teal">{statusText(invoice.status)}</span></div></div>{invoice.lines?.length ? <ul className="mt-4 border-t border-black/10 pt-3 text-sm text-black/60">{invoice.lines.map((line, index) => <li key={`${invoice.id}-${index}`} className="flex justify-between gap-4 py-1"><span>{line.group_name}{line.day_time ? ` · ${line.day_time}` : ""}</span><span>{line.amount_sek} kr</span></li>)}</ul> : null}</article>)}</div>}</section> : null}
  </div>;
}

function AccountOverview({
  profile,
  loading,
  confirmedBookingCount,
  currentBookings,
  previousBookings,
  trainingGroups,
  activity,
  activeInvoiceCount,
  availability,
  onOpenProfile,
  onOpenInvoices,
  onCancelBooking,
  cancellingBookingId,
}: {
  profile: Profile;
  loading: boolean;
  confirmedBookingCount: number;
  currentBookings: Booking[];
  previousBookings: Booking[];
  trainingGroups: TrainingGroup[];
  activity: ActivityFeed;
  activeInvoiceCount: number;
  availability: OverviewAvailability;
  onOpenProfile: () => void;
  onOpenInvoices: () => void;
  onCancelBooking: (booking: Booking) => void;
  cancellingBookingId: string | null;
}) {
  const firstName = profile.name?.trim().split(/\s+/)[0] || "spelare";
  const featuredBooking = currentBookings[0] ?? previousBookings[0] ?? null;
  const featuredIsUpcoming = featuredBooking === currentBookings[0];

  return <section className="bg-cream p-5 sm:p-8 lg:p-10">
    <div className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal">Din plats på The Beach</p>
        <h3 className="mt-3 font-display text-4xl leading-none sm:text-5xl">Hej, {firstName}.</h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/55">Här hittar du dina banor, träningsgrupper och betalningar — samlat på ett ställe.</p>
      </div>
      <Link href="/boka" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 bg-black px-6 text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:bg-teal">
        Boka bana <span aria-hidden="true">→</span>
      </Link>
    </div>

    <div className="grid grid-cols-2 gap-px bg-black/10 lg:grid-cols-4">
      <OverviewStat value={loading || !availability.bookings ? "—" : confirmedBookingCount} label="Banor bokade" accent="text-teal" />
      <OverviewStat value={loading || !availability.bookings ? "—" : currentBookings.length} label="Kommande bantider" accent="text-orange" />
      <OverviewStat value={loading || !availability.training ? "—" : trainingGroups.length} label="Träningsgrupper" accent="text-black" />
      <OverviewStat value={loading || !availability.invoices ? "—" : activeInvoiceCount} label="Fakturor att hantera" accent={activeInvoiceCount ? "text-orange" : "text-teal"} />
    </div>

    <div className="mt-px">
      <article className="bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">{featuredIsUpcoming ? "Nästa banbokning" : "Senaste banbokning"}</p>
            <h4 className="mt-2 font-display text-3xl">Din tid på sanden</h4>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime text-2xl" aria-hidden="true">🏐</span>
        </div>
        {loading ? <OverviewLoading /> : !availability.bookings ? <OverviewUnavailable label="bokningar" /> : featuredBooking ? <div className="mt-8 border-l-4 border-lime bg-cream p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal">{formatBookingDate(featuredBooking.date)}</p>
          <strong className="mt-2 block text-2xl">{featuredBooking.startTime}–{featuredBooking.endTime}</strong>
          <p className="mt-1 text-sm text-black/55">{featuredBooking.courtName}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/10 pt-4 text-xs">
            <span className="font-bold uppercase tracking-wide text-teal">{statusText(featuredBooking.status)}</span>
            <span className="text-black/45">{featuredBooking.priceSek} kr</span>
            {featuredBooking.streamRequested ? <span className="text-black/45">BeachTV-stream beställd</span> : null}
          </div>
          {featuredIsUpcoming && featuredBooking.status === "CONFIRMED" ? <button type="button" onClick={() => onCancelBooking(featuredBooking)} disabled={cancellingBookingId === featuredBooking.id} className="mt-4 min-h-10 cursor-pointer border border-orange px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-orange transition-colors hover:bg-orange hover:text-white disabled:cursor-wait disabled:opacity-50">{cancellingBookingId === featuredBooking.id ? "Avbokar…" : "Avboka bokning"}</button> : null}
        </div> : <div className="mt-8 border border-dashed border-black/20 bg-cream p-6">
          <strong className="block">Ingen bana bokad ännu</strong>
          <p className="mt-2 text-sm leading-relaxed text-black/50">Hitta en ledig 90-minuterstid och boka direkt med Swish.</p>
          <Link href="/boka" className="mt-5 inline-flex text-xs font-bold uppercase tracking-[0.1em] text-teal underline underline-offset-4">Se lediga tider →</Link>
        </div>}
      </article>
    </div>

    {/* Player history together (Henric): events + previous training groups */}
    <div className="mt-px grid gap-px bg-black/10 lg:grid-cols-2">
      <ActivityHistoryCard title="Event jag deltagit i" eyebrow="Min Beach-historik" items={activity.events} loading={loading} available={availability.activity} kind="event" />
      <ActivityHistoryCard title="Tidigare träningsgrupper" eyebrow="Träningshistorik" items={activity.training_groups} loading={loading} available={availability.activity} kind="training" />
    </div>

    <div className="mt-px grid gap-px bg-black/10 sm:grid-cols-3">
      <DashboardAction eyebrow="Spela" title="Boka en bana" href="/boka" />
      <DashboardAction eyebrow="Håll koll" title="Se kalendern" href="/kalender" />
      <button type="button" onClick={activeInvoiceCount ? onOpenInvoices : onOpenProfile} className="group cursor-pointer bg-white p-5 text-left transition-colors hover:bg-black hover:text-white sm:p-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40 group-hover:text-lime">Ditt konto</span>
        <strong className="mt-2 flex items-center justify-between text-base"><span>{activeInvoiceCount ? "Hantera fakturor" : "Ändra profil"}</span><span className="text-teal group-hover:text-lime" aria-hidden="true">→</span></strong>
      </button>
    </div>
  </section>;
}

// Dedicated Träningsgrupper tab (Henric, 2026-07-18): current groups + signup
// status. (Training HISTORY lives with the rest of the player history on the
// Översikt tab.)
function AccountTraining({
  loading,
  trainingGroups,
  availability,
}: {
  loading: boolean;
  trainingGroups: TrainingGroup[];
  availability: OverviewAvailability;
}) {
  return <section className="bg-cream p-5 sm:p-8 lg:p-10">
    <div className="border-b border-black/10 pb-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal">Träning</p>
      <h3 className="mt-3 font-display text-4xl leading-none sm:text-5xl">Träningsgrupper</h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/55">Dina aktuella grupper och din anmälan.</p>
    </div>

    <SignupStatusCard />

    <div className="mt-px">
      <article className="bg-black p-6 text-cream sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime">Aktuellt</p>
        <h4 className="mt-2 font-display text-3xl text-cream">Mina träningsgrupper</h4>
        {loading ? <OverviewLoading /> : !availability.training ? <p className="mt-7 border border-white/15 bg-white/5 p-5 text-sm text-white/60">Kunde inte hämta dina träningsgrupper just nu.</p> : trainingGroups.length ? <div className="mt-7 space-y-2">{trainingGroups.map((group) => <div key={`${group.group_name}-${group.day_time}`} className="border border-white/15 bg-white/5 p-4">
          <strong className="block text-base text-cream">{group.group_name}</strong>
          <span className="mt-1 block text-sm text-cream/65">{group.day_time}{group.court ? ` · Bana ${group.court}` : ""}</span>
        </div>)}</div> : <div className="mt-7 border border-white/15 bg-white/5 p-5 text-sm leading-relaxed text-white/60">Du är inte placerad i någon aktiv träningsgrupp just nu.</div>}
        <Link href="/trana" className="mt-6 inline-flex text-xs font-bold uppercase tracking-[0.1em] text-lime underline underline-offset-4">Läs om träning →</Link>
      </article>
    </div>
  </section>;
}

type SignupMine = {
  submission: { id: number; created_at: string | null; changed_at: string | null; is_changed: boolean } | null;
  can_edit: boolean;
  is_open: boolean;
  can_signup: boolean;
  last_cancelled: { cancelled_at: string | null } | null;
};

function SignupStatusCard() {
  const [mine, setMine] = useState<SignupMine | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    api<SignupMine>("/api/signup/mine")
      .then((result) => { if (active) setMine(result); })
      .catch(() => null)
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  // Show nothing until we know — and nothing at all unless there's a
  // registration, a recent cancellation, or this viewer may sign up now
  // (public open, or preview open and they're a tester → can_signup).
  if (!loaded || (!mine?.submission && !mine?.can_signup && !mine?.last_cancelled)) return null;

  const sub = mine?.submission ?? null;
  const status = sub
    ? `Anmäld${sub.created_at ? ` ${sub.created_at.slice(0, 10)}` : ""}${sub.is_changed && sub.changed_at ? ` · ändrad ${sub.changed_at.slice(0, 10)}` : ""}${mine?.can_edit === false ? " · låst för ändringar" : ""}`
    : mine?.last_cancelled
      ? `Avbruten${mine.last_cancelled.cancelled_at ? ` ${mine.last_cancelled.cancelled_at.slice(0, 10)}` : ""}${mine?.can_signup ? " · du kan anmäla dig igen" : ""}`
      : "Anmälan är öppen — säkra din plats";

  return <div className="mt-px">
    <Link href="/anmalan" className="group flex flex-wrap items-center justify-between gap-3 bg-black p-5 text-cream transition-colors hover:bg-teal sm:p-6">
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-lime">Träningsgrupper</span>
        <strong className="mt-1 block text-base text-cream">Min anmälan — {status}</strong>
        <span className="mt-1 block text-xs text-cream/60">{sub ? (mine?.can_edit === false ? "Öppna och se din anmälan" : "Öppna, ändra eller avbryt din anmälan") : "Öppna anmälningsformuläret"}</span>
      </span>
      <span className="text-lime" aria-hidden="true">→</span>
    </Link>
  </div>;
}

function ActivityHistoryCard({ title, eyebrow, items, loading, available, kind }: { title: string; eyebrow: string; items: ActivityEntry[]; loading: boolean; available: boolean; kind: "event" | "training" }) {
  return <article className="bg-white p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal">{eyebrow}</p><h4 className="mt-2 font-display text-3xl">{title}</h4></div><span className={`grid h-11 min-w-11 place-items-center rounded-full text-lg ${kind === "event" ? "bg-pink" : "bg-mint"}`} aria-hidden="true">{kind === "event" ? "☀️" : "🏐"}</span></div>{loading ? <OverviewLoading /> : !available ? <p className="mt-7 border border-black/10 bg-cream p-5 text-sm text-black/50">Kunde inte hämta historiken just nu.</p> : items.length ? <div className="mt-7 space-y-2">{items.map((item) => <div key={`${kind}-${item.name}-${item.date ?? ""}`} className="border border-black/10 bg-cream p-4"><div className="flex items-start justify-between gap-3"><strong className="text-base">{item.name}</strong>{item.date ? <span className="shrink-0 text-xs font-bold text-black/40">{activityYear(item.date)}</span> : null}</div>{item.groups?.length ? <div className="mt-3 flex flex-wrap gap-1.5">{item.groups.map((group) => <span key={group} className="border border-black/10 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-black/55">{group}</span>)}</div> : null}</div>)}</div> : <p className="mt-7 border border-dashed border-black/20 bg-cream p-5 text-sm text-black/50">{kind === "event" ? "Inga registrerade event ännu." : "Ingen tidigare träningshistorik hittades."}</p>}<p className="mt-5 text-[11px] leading-relaxed text-black/40">Historiken bygger på registrerat deltagande. Inga spelarnivåer eller omdömen visas.</p></article>;
}

function activityYear(value: string) {
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? value.slice(0, 4) : new Intl.DateTimeFormat("sv-SE", { year: "numeric" }).format(parsed);
}

function OverviewStat({ value, label, accent }: { value: number | string; label: string; accent: string }) {
  return <div className="bg-white px-5 py-6 sm:px-6 sm:py-7"><strong className={`block font-display text-4xl ${accent}`}>{value}</strong><span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-black/45">{label}</span></div>;
}

function OverviewLoading() {
  return <div className="mt-8 space-y-3" aria-label="Hämtar aktivitet"><span className="block h-4 w-2/3 animate-pulse bg-black/10" /><span className="block h-16 animate-pulse bg-black/5" /></div>;
}

function OverviewUnavailable({ label }: { label: string }) {
  return <p className="mt-7 border border-black/10 bg-white/60 p-5 text-sm text-black/50">Kunde inte hämta dina {label} just nu.</p>;
}

function DashboardAction({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return <Link href={href} className="group bg-white p-5 transition-colors hover:bg-black hover:text-white sm:p-6"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40 group-hover:text-lime">{eyebrow}</span><strong className="mt-2 flex items-center justify-between text-base"><span>{title}</span><span className="text-teal group-hover:text-lime" aria-hidden="true">→</span></strong></Link>;
}

function formatBookingDate(date: string) {
  const value = new Date(`${date}T12:00:00`);
  if (Number.isNaN(value.getTime())) return date;
  const formatted = new Intl.DateTimeFormat("sv-SE", { weekday: "long", day: "numeric", month: "long" }).format(value);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function BookingList({ title, items, empty, onCancel, cancellingBookingId }: { title: string; items: Booking[]; empty: string; onCancel?: (booking: Booking) => void; cancellingBookingId?: string | null }) {
  return <div className="mt-8"><h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">{title}</h4>{items.length === 0 ? <p className="border border-black/10 bg-cream p-5 text-sm text-black/50">{empty}</p> : <div className="space-y-2">{items.map((booking) => <article key={booking.id} className="flex flex-wrap items-center gap-4 border border-black/10 p-4"><div className="min-w-44 flex-1"><strong className="block">{booking.courtName}</strong><span className="text-sm text-black/50">{booking.date} · {booking.startTime}–{booking.endTime}</span><span className="mt-1 block text-xs font-bold uppercase text-teal">{statusText(booking.status)}</span></div><div className="ml-auto text-right"><strong>{booking.priceSek} kr</strong>{booking.streamRequested ? <span className="block text-xs text-black/45">Kamera beställd</span> : null}</div>{onCancel && booking.status === "CONFIRMED" ? <button type="button" onClick={() => onCancel(booking)} disabled={cancellingBookingId === booking.id} className="min-h-10 w-full cursor-pointer border border-orange px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-orange transition-colors hover:bg-orange hover:text-white disabled:cursor-wait disabled:opacity-50 sm:w-auto">{cancellingBookingId === booking.id ? "Avbokar…" : "Avboka"}</button> : null}</article>)}</div>}</div>;
}
