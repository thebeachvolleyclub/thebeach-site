"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Slot = {
  courtId: string;
  courtName: string;
  environment: "INDOOR" | "OUTDOOR";
  cameraEnabled: boolean;
  startTime: string;
  endTime: string;
  durationMin: number;
  priceSek: number;
  available: boolean;
};
type Booking = {
  id: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING_PAYMENT" | "CONFIRMED" | "REFUND_PENDING" | "CANCELLED" | "EXPIRED";
  priceSek: number;
};
type Profile = { name: string | null; email: string; swish_phone: string | null; emoji_icon: string; avatar_thumb_url: string | null };

const weekdays = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  let payload: Record<string, unknown> = {};
  try { payload = await response.json() as Record<string, unknown>; } catch { /* handled below */ }
  if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Något gick fel");
  return payload as T;
}

function bookingLabel(status: Booking["status"]) {
  if (status === "CONFIRMED") return "Bekräftad";
  if (status === "PENDING_PAYMENT") return "Väntar på Swish";
  if (status === "REFUND_PENDING") return "Återbetalning pågår";
  if (status === "CANCELLED") return "Avbokad";
  return "Utgången";
}

function shortCourt(name: string) {
  const number = name.match(/\d+/)?.[0];
  return number ? `Bana ${number}` : name;
}

function compareCourts(a: Slot, b: Slot) {
  return a.courtName.localeCompare(b.courtName, "sv-SE", {
    numeric: true,
    sensitivity: "base",
  });
}

function CameraMark() {
  return <span className="ml-2 inline-flex items-center border-l border-current/25 pl-2" title="BeachTV-kamera finns på banan" aria-label="BeachTV-kamera finns på banan"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="2"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg></span>;
}

export default function BookingWidget() {
  const dates = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() + index); date.setHours(12, 0, 0, 0); return date;
  }), []);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [venueId, setVenueId] = useState("");
  const [date, setDate] = useState(localDate(dates[0]));
  const [hideToday, setHideToday] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selected, setSelected] = useState<Slot | null>(null);
  const [streamRequested, setStreamRequested] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [mine, setMine] = useState<Booking[]>([]);
  const [showMine, setShowMine] = useState(false);
  const pollStarted = useRef(0);

  const loadMine = useCallback(async () => {
    try { setMine(await api<Booking[]>("/api/booking/mine")); }
    catch { setMine([]); }
  }, []);

  const loadSlots = useCallback(async (selectedVenue: string, selectedDate: string) => {
    setLoading(true); setError(""); setSelectedTime(""); setSelected(null); setStreamRequested(false);
    try {
      const result = await api<{ slots: Slot[] }>(`/api/booking/availability?venueId=${encodeURIComponent(selectedVenue)}&date=${selectedDate}`);
      const available = result.slots.filter((slot) => slot.available);
      if (selectedDate === localDate(dates[0]) && available.length === 0) {
        setHideToday(true);
        setDate(localDate(dates[1]));
        setSlots([]);
        return;
      }
      setSlots(available);
    } catch (cause) {
      setSlots([]); setError(cause instanceof Error ? cause.message : "Kunde inte hämta tider");
    } finally { setLoading(false); }
  }, [dates]);

  useEffect(() => {
    (async () => {
      try {
        const [config, session] = await Promise.all([
          api<{ enabled: boolean }>("/api/booking/config"),
          api<{ authenticated: boolean; profile?: Profile }>("/api/account/session"),
        ]);
        setProfile(session.authenticated ? session.profile ?? null : null);
        setAccountLoading(false);
        setEnabled(config.enabled);
        if (!config.enabled) { setLoading(false); return; }
        const venues = await api<Array<{ id: string }>>("/api/booking/venues");
        if (!venues[0]) throw new Error("Ingen bokningsbar anläggning hittades");
        setVenueId(venues[0].id);
        if (session.authenticated) await loadMine();
      } catch (cause) {
        setEnabled(false); setAccountLoading(false);
        setError(cause instanceof Error ? cause.message : "Bokningen är inte tillgänglig"); setLoading(false);
      }
    })();
  }, [loadMine]);

  useEffect(() => {
    if (!enabled || !venueId) return;
    const timer = window.setTimeout(() => loadSlots(venueId, date), 0);
    return () => window.clearTimeout(timer);
  }, [date, enabled, loadSlots, venueId]);

  useEffect(() => {
    if (!bookingId) return;
    pollStarted.current = Date.now();
    const poll = async () => {
      try {
        const result = await api<{ booking: Booking; paymentError?: string }>(`/api/booking/${bookingId}`);
        if (result.booking.status === "CONFIRMED") { setConfirmed(result.booking); setSubmitting(false); await loadMine(); return true; }
        if (["EXPIRED", "CANCELLED"].includes(result.booking.status)) { setError(result.paymentError || "Betalningen slutfördes inte och tiden släpptes."); setSubmitting(false); return true; }
      } catch { /* retry transient callback races */ }
      return false;
    };
    let stopped = false;
    const timer = setInterval(async () => { if (stopped || await poll() || Date.now() - pollStarted.current > 10 * 60_000) clearInterval(timer); }, 3000);
    poll();
    return () => { stopped = true; clearInterval(timer); };
  }, [bookingId, loadMine]);

  const grouped = useMemo(() => slots.reduce<Record<string, Slot[]>>((result, slot) => {
    const key = `${slot.startTime}–${slot.endTime}`; (result[key] ||= []).push(slot); return result;
  }, {}), [slots]);
  const selectedTimeSlots = selectedTime
    ? [...(grouped[selectedTime] ?? [])].sort(compareCourts)
    : [];
  const visibleDates = hideToday ? dates.slice(1) : dates;
  const todayValue = localDate(dates[0]);
  const tomorrowValue = localDate(dates[1]);

  const checkout = async () => {
    if (!selected || !venueId || !profile) return;
    if (!profile.name || !profile.swish_phone) { setError("Slutför namn och Swish-nummer under Mitt konto före bokning."); return; }
    setSubmitting(true); setError("");
    try {
      const result = await api<{ bookingId: string }>("/api/booking/checkout", { method: "POST", body: JSON.stringify({ venueId, courtId: selected.courtId, date, startTime: selected.startTime, streamRequested, clientReference: `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}` }) });
      setBookingId(result.bookingId);
    } catch (cause) { setSubmitting(false); setError(cause instanceof Error ? cause.message : "Kunde inte starta Swish"); }
  };

  const cancel = async (id: string) => {
    if (!window.confirm("Avboka banan? Inom en timme efter bokning återbetalas hela beloppet. Minst 24 timmar före start återbetalas beloppet minus 20 kr. Senare sker ingen återbetalning.")) return;
    try { await api(`/api/booking/${id}/cancel`, { method: "POST" }); await loadMine(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Kunde inte avboka"); }
  };

  if (enabled === null) return <div className="flex min-h-72 items-center justify-center text-sm text-black/50">Hämtar bokningen…</div>;
  if (!enabled) return <div className="border border-black/10 bg-white p-7 lg:p-10"><p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">Pilot</p><h3 className="mb-4 font-display text-3xl text-black">Snart bokar du direkt här</h3><p className="max-w-2xl text-sm leading-relaxed text-black/55">Vi öppnar en första grupp banor i vårt nya bokningssystem. Fram till dess ligger de bokningsbara tiderna kvar i MATCHi.</p>{error ? <p className="mt-4 text-sm text-orange">{error}</p> : null}<a href="https://www.matchi.se/facilities/thebeach" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Boka i MATCHi →</a></div>;

  if (confirmed) return <div className="border-2 border-lime bg-white p-7 text-black lg:p-10"><span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-lime">✓</span><p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">Bokning klar</p><h3 className="font-display text-4xl">Vi ses i sanden!</h3><p className="mt-4 text-black/60">{confirmed.courtName}, {confirmed.date} kl. {confirmed.startTime}–{confirmed.endTime}</p><p className="mt-2 font-bold">Betalt med Swish: {confirmed.priceSek} kr</p><button type="button" onClick={() => { setConfirmed(null); setBookingId(null); setShowMine(true); loadMine(); }} className="mt-7 cursor-pointer bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Mina bokningar →</button></div>;

  const profileReady = Boolean(profile?.name && profile?.swish_phone);
  return <div className="grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)] gap-0.5 overflow-hidden lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
    <div className="min-w-0 overflow-hidden border border-black/10 bg-white p-5 text-black sm:p-7 lg:p-10">
      <div className="mb-7 flex flex-col items-stretch gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">Boka online</p><h3 className="mt-2 font-display text-3xl">Välj din tid</h3><p className="mt-1 text-xs text-black/45">Priset visas för varje vald tid och bana.</p></div><button type="button" onClick={() => { setShowMine(!showMine); if (!showMine && profile) loadMine(); }} className="w-full cursor-pointer border border-black px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] hover:bg-black hover:text-lime sm:w-auto sm:shrink-0">{showMine ? "Boka tid" : "Mina bokningar"}</button></div>
      {showMine ? (!profile ? <div className="border border-black/10 bg-cream p-6 text-center"><p className="text-sm text-black/55">Logga in för att se bokningar från både webben och appen.</p><Link href="/konto" className="mt-4 inline-flex bg-black px-6 py-3 text-xs font-bold uppercase text-lime">Logga in eller skapa konto</Link></div> : <div className="space-y-2">{mine.length === 0 ? <p className="py-12 text-center text-sm text-black/45">Du har inga bokningar ännu.</p> : mine.map((booking) => <div key={booking.id} className="flex flex-wrap items-center gap-4 border border-black/10 p-4"><div className="flex-1"><strong className="block">{booking.courtName}</strong><span className="text-sm text-black/50">{booking.date} · {booking.startTime}–{booking.endTime}</span><span className="mt-1 block text-xs font-bold uppercase tracking-wide text-black/70">{bookingLabel(booking.status)}</span></div>{booking.status === "CONFIRMED" ? <button type="button" onClick={() => cancel(booking.id)} className="cursor-pointer px-3 py-2 text-xs font-bold uppercase text-orange hover:underline">Avboka</button> : null}</div>)}</div>) : <>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">1. Välj dag</p><div className="no-scrollbar mb-8 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2">{visibleDates.map((item) => { const value = localDate(item), active = value === date; return <button type="button" key={value} onClick={() => setDate(value)} className={`min-w-16 shrink-0 cursor-pointer border px-3 py-3 text-center ${active ? "border-black bg-black text-lime" : "border-black/15 bg-cream hover:border-black"}`}><span className="block text-[10px] font-bold uppercase">{value === todayValue ? "Idag" : value === tomorrowValue ? "Imorgon" : weekdays[item.getDay()]}</span><span className="mt-1 block text-sm">{item.getDate()}/{item.getMonth() + 1}</span></button>; })}</div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">2. Välj tid</p>{loading ? <p className="py-10 text-center text-sm text-black/45">Hämtar lediga tider…</p> : Object.keys(grouped).length === 0 ? <p className="border border-black/10 bg-cream p-5 text-sm text-black/50">Inga lediga pilottider den här dagen.</p> : <><div className="mb-7 flex min-w-0 flex-wrap gap-2">{Object.keys(grouped).map((time) => <button type="button" key={time} onClick={() => { setSelectedTime(time); setSelected(null); setStreamRequested(false); }} className={`max-w-full cursor-pointer whitespace-normal border px-3 py-2 text-sm font-semibold ${selectedTime === time ? "border-black bg-black text-lime" : "border-black/15 bg-white hover:border-black"}`}>{time}</button>)}</div><p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">3. Välj bana</p>{selectedTime ? <div className="min-w-0">{(["INDOOR", "OUTDOOR"] as const).map((environment) => { const courts = selectedTimeSlots.filter((slot) => slot.environment === environment); return courts.length ? <div key={environment} className="mb-4 min-w-0"><span className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-black/40">{environment === "INDOOR" ? "Inne" : "Ute"}</span><div className="flex min-w-0 flex-wrap gap-2">{courts.map((slot) => { const active = selected?.courtId === slot.courtId; return <button type="button" key={slot.courtId} onClick={() => { setSelected(slot); setStreamRequested(false); }} className={`inline-flex max-w-full cursor-pointer items-center border px-3 py-2 text-sm font-semibold ${active ? "border-black bg-black text-lime" : "border-black/15 bg-white hover:border-black"}`}><span>{shortCourt(slot.courtName)}</span>{slot.cameraEnabled ? <CameraMark /> : null}</button>; })}</div></div> : null; })}</div> : <p className="border border-black/10 bg-cream p-4 text-sm text-black/45">Välj först en tid för att se lediga banor.</p>}</>}
      </>}
    </div>

    <div className="min-w-0 overflow-hidden border border-black/10 bg-cream p-5 text-black sm:p-7 lg:p-10"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">4. Konto och betalning</p>{selected ? <><h3 className="mt-3 break-words font-display text-2xl">{selected.courtName}</h3><p className="mt-2 break-words text-sm text-black/55">{date} · {selected.startTime}–{selected.endTime} · {selected.durationMin} min</p><p className="mt-2 text-lg font-bold">{selected.priceSek} kr</p></> : <p className="mt-3 text-sm text-black/45">Välj en ledig tid och bana för att fortsätta.</p>}
      <div className="mt-7 min-w-0 border border-black/10 bg-white p-4">{accountLoading ? <p className="text-sm text-black/45">Kontrollerar konto…</p> : !profile ? <><strong className="block">Logga in för att boka</strong><p className="mt-1 text-sm text-black/50">Ett konto krävs. Du loggar in eller skapar konto med e-post och en sexsiffrig kod.</p><Link href="/konto" className="mt-4 inline-flex max-w-full bg-black px-5 py-3 text-center text-xs font-bold uppercase text-lime">Logga in eller skapa konto</Link></> : !profileReady ? <><strong className="block">Slutför din profil</strong><p className="mt-1 text-sm text-black/50">Lägg till namn och Swish-nummer. Bokningen hämtar uppgifterna automatiskt.</p><Link href="/konto" className="mt-4 inline-flex max-w-full bg-black px-5 py-3 text-center text-xs font-bold uppercase text-lime">Öppna mitt konto</Link></> : <div className="flex min-w-0 items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-mint text-xl">{profile.avatar_thumb_url ? <img src={profile.avatar_thumb_url} alt="" className="h-full w-full object-cover" /> : profile.emoji_icon || "🏐"}</span><div className="min-w-0 flex-1"><strong className="block truncate">{profile.name}</strong><span className="block truncate text-xs text-black/45">Swish {profile.swish_phone}</span></div><Link href="/konto" className="shrink-0 text-xs font-bold uppercase text-teal">Ändra</Link></div>}</div>
      {selected?.cameraEnabled && profileReady ? <label className="mt-4 flex cursor-pointer items-start gap-3 border border-black/10 bg-white p-4"><input type="checkbox" checked={streamRequested} onChange={(event) => setStreamRequested(event.target.checked)} className="mt-0.5 h-5 w-5 accent-black" /><span className="text-sm"><strong className="flex items-center gap-2"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="2"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg>Beställ BeachTV-stream</strong><span className="mt-1 block text-black/45">Tillgänglig eftersom banan har kamera.</span></span></label> : null}
      {error ? <div role="alert" className="mt-4 border border-orange/25 bg-orange/10 p-4 text-sm font-semibold text-orange"><p>{error}</p>{error.toLowerCase().includes("profil") ? <Link href="/konto" className="mt-3 inline-flex text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-4">Kontrollera Swish-numret →</Link> : null}</div> : null}<button type="button" disabled={!selected || submitting || !profileReady} onClick={checkout} className="mt-6 min-h-13 w-full cursor-pointer bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime disabled:cursor-not-allowed disabled:opacity-35">{submitting ? "Godkänn betalningen i Swish…" : selected ? `Boka och betala ${selected.priceSek} kr` : "Välj tid och bana"}</button><p className="mt-3 text-center text-[11px] leading-relaxed text-black/45">Tiden hålls i 10 minuter. Betalningsbegäran skickas till Swish-numret i din profil.</p><p className="mt-2 text-center text-[11px] leading-relaxed text-black/45">Avboka inom en timme för full återbetalning. Därefter återbetalas beloppet minus 20 kr fram till 24 timmar före start.</p>
    </div>
  </div>;
}
