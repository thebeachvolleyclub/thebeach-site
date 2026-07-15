"use client";

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

const STORAGE_KEY = "thebeach_booking_ids";
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

function savedIds(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]; } catch { return []; }
}

function remember(id: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set([id, ...savedIds()])].slice(0, 20)));
}

function bookingLabel(status: Booking["status"]) {
  if (status === "CONFIRMED") return "Bekräftad";
  if (status === "PENDING_PAYMENT") return "Väntar på Swish";
  if (status === "REFUND_PENDING") return "Återbetalning pågår";
  if (status === "CANCELLED") return "Avbokad";
  return "Utgången";
}

export default function BookingWidget() {
  const dates = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    date.setHours(12, 0, 0, 0);
    return date;
  }), []);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [venueId, setVenueId] = useState("");
  const [date, setDate] = useState(localDate(dates[0]));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [swish, setSwish] = useState("");
  const [mine, setMine] = useState<Booking[]>([]);
  const [showMine, setShowMine] = useState(false);
  const pollStarted = useRef(0);

  const loadMine = useCallback(async () => {
    const results = await Promise.all(savedIds().map(async (id) => {
      try {
        const result = await api<{ booking: Booking }>(`/api/booking/${id}`);
        return result.booking;
      } catch { return null; }
    }));
    setMine(results.filter((value): value is Booking => Boolean(value)));
  }, []);

  const loadSlots = useCallback(async (selectedVenue: string, selectedDate: string) => {
    setLoading(true);
    setError("");
    setSelected(null);
    try {
      const result = await api<{ slots: Slot[] }>(`/api/booking/availability?venueId=${encodeURIComponent(selectedVenue)}&date=${selectedDate}`);
      setSlots(result.slots.filter((slot) => slot.available));
    } catch (cause) {
      setSlots([]);
      setError(cause instanceof Error ? cause.message : "Kunde inte hämta tider");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const config = await api<{ enabled: boolean }>("/api/booking/config");
        setEnabled(config.enabled);
        if (!config.enabled) { setLoading(false); return; }
        const venues = await api<Array<{ id: string }>>("/api/booking/venues");
        if (!venues[0]) throw new Error("Ingen bokningsbar anläggning hittades");
        setVenueId(venues[0].id);
        await loadMine();
      } catch (cause) {
        setEnabled(false);
        setError(cause instanceof Error ? cause.message : "Bokningen är inte tillgänglig");
        setLoading(false);
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
        if (result.booking.status === "CONFIRMED") {
          setConfirmed(result.booking);
          setSubmitting(false);
          await loadMine();
          return true;
        }
        if (["EXPIRED", "CANCELLED"].includes(result.booking.status)) {
          setError(result.paymentError || "Betalningen slutfördes inte och tiden släpptes.");
          setSubmitting(false);
          return true;
        }
      } catch { /* retry transient callback races */ }
      return false;
    };
    let stopped = false;
    const timer = setInterval(async () => {
      if (stopped || await poll() || Date.now() - pollStarted.current > 10 * 60_000) clearInterval(timer);
    }, 3000);
    poll();
    return () => { stopped = true; clearInterval(timer); };
  }, [bookingId, loadMine]);

  const grouped = useMemo(() => slots.reduce<Record<string, Slot[]>>((result, slot) => {
    const key = `${slot.startTime}–${slot.endTime}`;
    (result[key] ||= []).push(slot);
    return result;
  }, {}), [slots]);

  const checkout = async () => {
    if (!selected || !venueId) return;
    if (!name.trim() || !email.trim() || !phone.trim() || !swish.trim()) {
      setError("Fyll i namn, e-post, telefon och Swish-nummer.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await api<{ bookingId: string }>("/api/booking/checkout", {
        method: "POST",
        body: JSON.stringify({
          venueId,
          courtId: selected.courtId,
          date,
          startTime: selected.startTime,
          holderName: name,
          holderEmail: email,
          holderPhone: phone,
          payerAlias: swish,
          streamRequested: false,
          clientReference: `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        }),
      });
      remember(result.bookingId);
      setBookingId(result.bookingId);
    } catch (cause) {
      setSubmitting(false);
      setError(cause instanceof Error ? cause.message : "Kunde inte starta Swish");
    }
  };

  const cancel = async (id: string) => {
    if (!window.confirm("Avboka banan? En betald bokning återbetalas via Swish om avbokningsfristen inte har passerat.")) return;
    try {
      await api(`/api/booking/${id}/cancel`, { method: "POST" });
      await loadMine();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Kunde inte avboka");
    }
  };

  if (enabled === null) return <div className="flex min-h-72 items-center justify-center text-sm text-black/50">Hämtar bokningen…</div>;

  if (!enabled) {
    return (
      <div className="border border-black/10 bg-white p-7 lg:p-10">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">Pilot</p>
        <h3 className="mb-4 font-display text-3xl text-black">Snart bokar du direkt här</h3>
        <p className="max-w-2xl text-sm leading-relaxed text-black/55">
          Vi öppnar en första grupp banor i vårt nya bokningssystem. Fram till dess ligger de bokningsbara tiderna kvar i MATCHi.
        </p>
        {error ? <p className="mt-4 text-sm text-orange">{error}</p> : null}
        <a href="https://www.matchi.se/facilities/thebeach" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">
          Boka i MATCHi →
        </a>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="border-2 border-lime bg-white p-7 text-black lg:p-10">
        <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-lime">✓</span>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">Bokning klar</p>
        <h3 className="font-display text-4xl">Vi ses i sanden!</h3>
        <p className="mt-4 text-black/60">{confirmed.courtName}, {confirmed.date} kl. {confirmed.startTime}–{confirmed.endTime}</p>
        <p className="mt-2 font-bold">Betalt med Swish: {confirmed.priceSek} kr</p>
        <button type="button" onClick={() => { setConfirmed(null); setBookingId(null); setShowMine(true); loadMine(); }} className="mt-7 cursor-pointer bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Mina bokningar →</button>
      </div>
    );
  }

  return (
    <div className="grid gap-0.5 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="border border-black/10 bg-white p-5 text-black sm:p-7 lg:p-10">
        <div className="mb-7 flex items-center justify-between gap-4 border-b border-black/10 pb-5">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">Boka online</p><h3 className="mt-2 font-display text-3xl">400 kr / bana</h3></div>
          <button type="button" onClick={() => { setShowMine(!showMine); if (!showMine) loadMine(); }} className="cursor-pointer border border-black px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] hover:bg-black hover:text-lime">{showMine ? "Boka tid" : "Mina bokningar"}</button>
        </div>

        {showMine ? (
          <div className="space-y-2">
            {mine.length === 0 ? <p className="py-12 text-center text-sm text-black/45">Inga bokningar sparade i den här webbläsaren.</p> : mine.map((booking) => (
              <div key={booking.id} className="flex flex-wrap items-center gap-4 border border-black/10 p-4">
                <div className="flex-1"><strong className="block">{booking.courtName}</strong><span className="text-sm text-black/50">{booking.date} · {booking.startTime}–{booking.endTime}</span><span className="mt-1 block text-xs font-bold uppercase tracking-wide text-black/70">{bookingLabel(booking.status)}</span></div>
                {booking.status === "CONFIRMED" ? <button type="button" onClick={() => cancel(booking.id)} className="cursor-pointer px-3 py-2 text-xs font-bold uppercase text-orange hover:underline">Avboka</button> : null}
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">1. Välj dag</p>
            <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2">
              {dates.map((item, index) => {
                const value = localDate(item);
                const active = value === date;
                return <button type="button" key={value} onClick={() => setDate(value)} className={`min-w-16 cursor-pointer border px-3 py-3 text-center ${active ? "border-black bg-black text-lime" : "border-black/15 bg-cream hover:border-black"}`}><span className="block text-[10px] font-bold uppercase">{index === 0 ? "Idag" : weekdays[item.getDay()]}</span><span className="mt-1 block text-sm">{item.getDate()}/{item.getMonth() + 1}</span></button>;
              })}
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">2. Välj tid och bana</p>
            {loading ? <p className="py-10 text-center text-sm text-black/45">Hämtar lediga tider…</p> : Object.keys(grouped).length === 0 ? <p className="border border-black/10 bg-cream p-5 text-sm text-black/50">Inga lediga pilottider den här dagen.</p> : (
              <div className="space-y-5">{Object.entries(grouped).map(([time, timeSlots]) => <div key={time}><strong className="mb-2 block text-sm">{time}</strong><div className="flex flex-wrap gap-2">{timeSlots.map((slot) => {
                const active = selected?.courtId === slot.courtId && selected?.startTime === slot.startTime;
                return <button type="button" key={`${slot.courtId}-${slot.startTime}`} onClick={() => setSelected(slot)} className={`cursor-pointer border px-4 py-2.5 text-sm font-semibold ${active ? "border-black bg-black text-lime" : "border-black/15 hover:border-black"}`}>{slot.courtName}{slot.cameraEnabled ? " · ◉" : ""}</button>;
              })}</div></div>)}</div>
            )}
          </>
        )}
      </div>

      <div className="border border-black/10 bg-cream p-5 text-black sm:p-7 lg:p-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">3. Dina uppgifter</p>
        {selected ? <><h3 className="mt-3 font-display text-2xl">{selected.courtName}</h3><p className="mt-2 text-sm text-black/55">{date} · {selected.startTime}–{selected.endTime} · {selected.durationMin} min</p></> : <p className="mt-3 text-sm text-black/45">Välj en ledig tid för att fortsätta.</p>}
        <div className={`mt-7 space-y-3 ${!selected ? "pointer-events-none opacity-40" : ""}`}>
          {[{ label: "Namn", value: name, set: setName, type: "text", auto: "name" }, { label: "E-post", value: email, set: setEmail, type: "email", auto: "email" }, { label: "Telefon", value: phone, set: setPhone, type: "tel", auto: "tel" }, { label: "Swish-nummer", value: swish, set: setSwish, type: "tel", auto: "tel" }].map((field) => <label key={field.label} className="block"><span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-black/50">{field.label}</span><input type={field.type} autoComplete={field.auto} value={field.value} onChange={(event) => field.set(event.target.value)} className="min-h-12 w-full border border-black/20 bg-white px-4 text-base text-black outline-none focus:border-black" /></label>)}
        </div>
        {error ? <p role="alert" className="mt-4 text-sm font-semibold text-orange">{error}</p> : null}
        <button type="button" disabled={!selected || submitting} onClick={checkout} className="mt-6 min-h-13 w-full cursor-pointer bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime disabled:cursor-not-allowed disabled:opacity-35">{submitting ? "Godkänn betalningen i Swish…" : "Boka och betala 400 kr"}</button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-black/45">Tiden hålls i 10 minuter. En betalningsbegäran skickas till Swish-numret.</p>
      </div>
    </div>
  );
}
