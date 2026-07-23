"use client";

import { useMemo, useState } from "react";
import {
  PlannerState, initialState, TIERS, WELCOME, WHENLBL, PRICES,
  calcSummary, buildTimeline, partyAllowed, sandAllowed, tierPrice, fmt, MIN_FRI,
  type When, type TierKey, type Policy, type BarMode,
} from "@/lib/planner";
import { pushEvent } from "@/lib/gtm";

const STEPS = ["Koncept", "Dryck & bar", "Mat & sött", "Underhållning", "Produktion", "Förfrågan"];

const labelCls = "text-[10px] font-bold uppercase tracking-[0.15em] text-white/40";
const inputCls =
  "w-full border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-lime";

function cardCls(sel: boolean, dis = false) {
  return [
    "relative cursor-pointer border p-4 text-left transition-colors",
    sel ? "border-lime bg-lime/10" : "border-white/10 bg-white/[0.04] hover:border-white/30",
    dis ? "pointer-events-none opacity-40" : "",
  ].join(" ");
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-2.5 left-3 bg-lime px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">
      {children}
    </span>
  );
}

function Note({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div className="border border-lime/30 bg-lime/[0.07] p-3.5 text-[13px] leading-relaxed text-white/70">
      {children}
    </div>
  );
}

function Stepper({ value, onChange, min, max, step = 1 }: {
  value: number; onChange: (n: number) => void; min: number; max: number; step?: number;
}) {
  return (
    <div className="inline-flex items-center border border-white/15">
      <button type="button" aria-label="Minska" onClick={() => onChange(Math.max(min, value - step))}
        className="h-11 w-11 cursor-pointer text-lg text-white transition-colors hover:bg-white/10">−</button>
      <span className="w-16 text-center text-base font-bold text-white">{value}</span>
      <button type="button" aria-label="Öka" onClick={() => onChange(Math.min(max, value + step))}
        className="h-11 w-11 cursor-pointer text-lg text-white transition-colors hover:bg-white/10">+</button>
    </div>
  );
}

function Addon({ sel, dis, title, sub, price, onClick }: {
  sel: boolean; dis?: boolean; title: string; sub: string; price: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`${cardCls(sel, dis)} flex w-full items-center gap-3`}>
      <span className="flex-1">
        <span className="block text-sm font-bold text-white">{title}</span>
        <span className="block text-xs text-white/40">{sub}</span>
      </span>
      <span className="shrink-0 text-[13px] font-bold text-white/80">{price}</span>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] ${sel ? "border-lime bg-lime text-black" : "border-white/25 text-transparent"}`}>✓</span>
    </button>
  );
}

export default function EventPlanner({ initialTier }: { initialTier?: TierKey }) {
  const [s, setS] = useState<PlannerState>(
    initialTier ? { ...initialState, tier: initialTier } : initialState
  );
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  const sum = useMemo(() => calcSummary(s), [s]);
  const timeline = useMemo(() => buildTimeline(s), [s]);

  const up = (patch: Partial<PlannerState>) => setS((p) => ({ ...p, ...patch }));

  const setWhen = (when: When) => {
    setS((p) => {
      const n: PlannerState = { ...p, when };
      if (when === "day" && p.start === "17:30") n.start = "10:00";
      if (when !== "day" && p.start === "10:00") n.start = "17:30";
      if (when !== "fri") { n.dj = false; n.eld = false; n.band = false; }
      if (when === "weekeve") n.dukning = false;
      return n;
    });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(false);
    const fd = new FormData(e.currentTarget);
    const wl = s.welcome ? (s.policy === "none" && WELCOME[s.welcome].lblNA ? WELCOME[s.welcome].lblNA : WELCOME[s.welcome].lbl) : null;
    const data: Record<string, string> = {
      form: "eventplaneraren",
      koncept: `${TIERS[s.tier].name} (${tierPrice(s)} kr/p)`,
      format: WHENLBL[s.when],
      antal: `${s.guests} personer`,
      starttid: s.start,
      estimat: `${sum.fran ? "från " : ""}${fmt(sum.total)} kr ex moms (preliminärt)`,
      tillval: sum.lines.slice(1).map((l) => `${l.t} (${l.amount})`).join(", ") || "inga",
      "i offerten": sum.offert.join("; "),
      tidsplan: timeline.map((r) => `${r.time} ${r.label}`).join(" / "),
    };
    if (wl) data["välkomstdrink"] = wl;
    for (const [k, v] of fd.entries()) {
      const str = String(v);
      if (str) data[k] = str;
    }
    try {
      const res = await fetch("/api/forfragan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        pushEvent("form_submit_lead", { form_id: "eventplaneraren" });
        setSent(true);
      } else setErr(true);
    } catch {
      setErr(true);
    }
    setBusy(false);
  };

  if (sent) {
    return (
      <section className="bg-black px-5 py-24 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lime text-3xl text-black">✓</div>
          <h2 className="mb-4 font-display text-[clamp(2.25rem,8vw,3.75rem)] uppercase leading-[0.9] text-white">
            Tack — er eventplan är hos oss!
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/50">
            Vi återkommer inom 24 timmar med datum och en offert som bekräftar er plan.
            Vill ni något under tiden? Mejla boka@thebeach.one.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Stegindikator */}
        <div className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-2">
          {STEPS.map((t, i) => (
            <button key={t} type="button" onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                i === step ? "text-lime" : i < step ? "cursor-pointer text-white/70 hover:text-white" : "text-white/25"}`}>
              <span className={`flex h-6 w-6 items-center justify-center border text-[11px] ${
                i === step ? "border-lime bg-lime text-black" : i < step ? "border-white/40" : "border-white/15"}`}>
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{t}</span>
              {i < STEPS.length - 1 && <span className="mx-1 hidden h-px w-5 bg-white/15 lg:block" />}
            </button>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.65fr_1fr]">
          <div>
            {step === 0 && (
              <div className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>När kör ni?</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button type="button" onClick={() => setWhen("day")} className={cardCls(s.when === "day")}>
                      <Badge>−10 %</Badge>
                      <span className="block text-sm font-bold text-white">Vardag dagtid</span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/40">
                        Samma upplevelse med lunch i stället för middag — 10 % lägre pris. Perfekt för konferens + aktivitet.
                      </span>
                    </button>
                    <button type="button" onClick={() => setWhen("weekeve")} className={cardCls(s.when === "weekeve")}>
                      <span className="block text-sm font-bold text-white">Kväll — mitt i beachlivet</span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/40">
                        Måndag–lördag. Ert event mitt i beachlivet — aktivitet, middag och häng i loungen medan
                        arenan lever runt er. Perfekt för 10–50 pers, inget minimum.
                      </span>
                    </button>
                    <button type="button" onClick={() => setWhen("fri")} className={cardCls(s.when === "fri")}>
                      <Badge>Fre/lör</Badge>
                      <span className="block text-sm font-bold text-white">Helkväll — exklusiv arena</span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/40">
                        Arenan är er, exklusivt — dansgolv, DJ, eldshow och sen bar. Minimiomsättning 50 000 kr på paketet, i praktiken från ca 50 pers.
                      </span>
                    </button>
                  </div>
                </div>
                <Note show={s.when === "weekeve" && s.guests > 50}>
                  Fler än 50 med delad arena? Skicka planen ändå — då återkommer vi med ett skräddarsytt förslag.
                </Note>
                <Note show={s.when === "fri" && tierPrice(s) * s.guests < MIN_FRI}>
                  Helkväll betyder att ni bokar hela arenan exklusivt — minimiomsättning {fmt(MIN_FRI)} kr på
                  paketet, i praktiken från ca 50 personer. Estimatet nedan räknar med minimibeloppet. Är ni ett
                  mindre gäng? Välj "Kväll — mitt i beachlivet" — det funkar alla dagar, även fredag och lördag,
                  utan minimum.
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>Hur många är ni?</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Stepper value={s.guests} onChange={(guests) => up({ guests })} min={10} max={250} step={5} />
                    <span className="text-xs text-white/40">personer — paketen gäller upp till 250, fler? Skräddarsytt.</span>
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Välj koncept</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(Object.keys(TIERS) as TierKey[]).map((k) => {
                      const T = TIERS[k];
                      const price = s.when === "day" ? T.day : T.eve;
                      const meta: Record<TierKey, [string, string]> = {
                        lp: ["Enkelt & socialt · 10–50 pers", `Turnering + instruktör · tapas · 1 dryck`],
                        alg: ["Aktivitet & middag · 10–250 pers", `Turnering · ${s.when === "day" ? "lunchbuffé" : "middagsbuffé"} · 1 dryck`],
                        mia: ["Helkväll & after beach · 15–250 pers", `Turnering · ${s.when === "day" ? "BBQ-lunch" : "BBQ-buffé"} · 2 drycker`],
                      };
                      return (
                        <button key={k} type="button" onClick={() => up({ tier: k })} className={cardCls(s.tier === k)}>
                          {k === "alg" && <Badge>Mest bokad</Badge>}
                          <span className="block font-display text-xl uppercase text-white">{T.name}</span>
                          <span className="mt-0.5 block text-sm text-white/70">
                            {s.when === "day" && <s className="mr-1.5 text-white/30">{fmt(T.eve)}</s>}
                            <span className="font-bold text-lime">{fmt(price)}</span> kr/p
                          </span>
                          <span className="mt-2 block text-xs leading-relaxed text-white/40">{meta[k][1]}<br />{meta[k][0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>Alkoholpolicy för ert event</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {([
                      ["none", "Ingen alkohol", "Helt alkoholfritt — dryckesenheterna blir alkoholfria och baren kör mocktails."],
                      ["std", "Öl, vin, cider & cava", "Klassikern. Ej sprit — bra tempo hela kvällen."],
                      ["full", "Full bar", "Hela sortimentet inklusive sprit och drinkar i baren."],
                    ] as [Policy, string, string][]).map(([k, t, d]) => (
                      <button key={k} type="button" className={cardCls(s.policy === k)}
                        onClick={() => up({ policy: k, welcome: k === "none" && s.welcome === "aperol" ? null : s.welcome })}>
                        {k === "std" && <Badge>Standard</Badge>}
                        <span className="block text-sm font-bold text-white">{t}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-white/40">{d}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Note show={s.policy === "none"}>
                  Alkoholfritt hela vägen — vi byter bubbel och drycker till alkoholfria motsvarigheter, samma pris.
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>Välkomstdrink vid ankomst</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.welcome === "cava"} title={s.policy === "none" ? "Alkoholfritt bubbel vid ankomst" : "Cava vid ankomst"}
                      sub="Ett glas bubbel vid ankomst" price="79 kr/p"
                      onClick={() => up({ welcome: s.welcome === "cava" ? null : "cava" })} />
                    <Addon sel={s.welcome === "aperol"} dis={s.policy === "none"} title="Aperol Spritz vid ankomst"
                      sub="Sommarklassikern — direkt semesterkänsla" price="96 kr/p"
                      onClick={() => up({ welcome: s.welcome === "aperol" ? null : "aperol" })} />
                    <Addon sel={s.welcome === "other"} title={s.policy === "none" ? "Välkomstmocktail" : "Välkomstdrink 4 cl"}
                      sub="Valfri enkel drink — vi föreslår i offerten" price="96 kr/p"
                      onClick={() => up({ welcome: s.welcome === "other" ? null : "other" })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Extra dryckesenheter (förköpta)</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Stepper value={s.units} onChange={(units) => up({ units })} min={0} max={6} />
                    <span className="text-xs text-white/40">à 79 kr/person — utöver det som ingår i konceptet</span>
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>När de enheter som ingår i paketet är slut</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {([
                      ["pre", "Vi förköper fler enheter", "Dryckesbiljetter som gästerna får vid ankomst — full koll på kostnaden.", false],
                      ["invoice", "Öppen bar på faktura", "Baren håller öppet och notan går på er — löpande enligt barpriser.", true],
                      ["guests", "Gästerna betalar själva", "När paketets enheter är slut köper gästerna själva i baren.", false],
                    ] as [BarMode, string, string, boolean][]).map(([k, t, d, std]) => (
                      <button key={k} type="button" className={cardCls(s.bar === k)} onClick={() => up({ bar: k })}>
                        {std && <Badge>Standard</Badge>}
                        <span className="block text-sm font-bold text-white">{t}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-white/40">{d}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-7">
                <Note show={!sandAllowed(s)}>
                  Dukat i sanden kör vi dagtid och vid exklusiv arena — när arenan delas spelas det på banorna och middagen serveras i loungen.
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>Dukning</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.dukning} dis={!sandAllowed(s)} title="Dukad middag i sanden"
                      sub="Långbord mitt i sanden i stället för loungen — wow-faktorn" price="+100 kr/p"
                      onClick={() => up({ dukning: !s.dukning })} />
                    <Addon sel={s.dekor} title="Extra dekoration" sub="Blommor, ljus och tema — vid dukningen eller i loungen"
                      price="79 kr/p" onClick={() => up({ dekor: !s.dekor })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Dessert</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.dessert === "lemon"} title="Lemonposset" sub="Syrlig, len och somrig" price="75 kr/p"
                      onClick={() => up({ dessert: s.dessert === "lemon" ? null : "lemon" })} />
                    <Addon sel={s.dessert === "panna"} title="Pannacotta" sub="Klassikern som alltid går hem" price="75 kr/p"
                      onClick={() => up({ dessert: s.dessert === "panna" ? null : "panna" })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Kaffe & sött</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.coffee === "kaffe"} title="Kaffe" sub="Till desserten eller minglet" price="30 kr/p"
                      onClick={() => up({ coffee: s.coffee === "kaffe" ? null : "kaffe" })} />
                    <Addon sel={s.coffee === "godis"} title="Kaffe & godis" sub="Kaffe med Dumle, smågodis och sött till" price="45 kr/p"
                      onClick={() => up({ coffee: s.coffee === "godis" ? null : "godis" })} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-7">
                <Note show={!partyAllowed(s)}>
                  DJ, eldshow och liveband hör till helkvällsformatet med exklusiv arena (fredag & lördag). När
                  arenan delas lever den runt ert event, och middagen i loungen är en del av charmen. Vill ni ta
                  över hela arenan en vardag? Skriv det i meddelandet så återkommer vi med offert.
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>Musik & show</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.dj} dis={!partyAllowed(s)} title="DJ" sub="Normalt ingår 22–00 eller 22–01"
                      price="från 5 000 kr" onClick={() => up({ dj: !s.dj })} />
                    <Addon sel={s.eld} dis={!partyAllowed(s)} title="Eldshow" sub="Efter middagen — bryggan till dansgolvet"
                      price="från 8 000 kr" onClick={() => up({ eld: !s.eld })} />
                    <Addon sel={s.band} dis={!partyAllowed(s)} title="Liveband" sub="Vi bokar rätt band för er kväll"
                      price="enligt offert" onClick={() => up({ band: !s.band })} />
                    <Addon sel={s.trubadur} title="Trubadur" sub="Livemusik i lagom format — perfekt till middagen"
                      price="enligt offert" onClick={() => up({ trubadur: !s.trubadur })} />
                    <Addon sel={s.dans} title="Dansinstruktör" sub="Gemensam dansstund som får med alla"
                      price="enligt offert" onClick={() => up({ dans: !s.dans })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Fler aktiviteter</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.akt} title="Utökade aktiviteter" sub="Pingis, cornhole, kubb" price="enligt offert"
                      onClick={() => up({ akt: !s.akt, lek: s.akt ? false : s.lek })} />
                    <Addon sel={s.lek} dis={!s.akt} title="Med lekledare" sub="Vi bemannar aktiviteterna och håller igång tempot"
                      price="enligt offert" onClick={() => up({ lek: !s.lek })} />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>Möte & konferens</p>
                  <Addon sel={s.konf} title="Konferenspaket"
                    sub="Upp till 3 h möte, projektor + duk, konferensyta i loungen eller solstolskonferens i sanden"
                    price="395 kr/p" onClick={() => up({ konf: !s.konf })} />
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Scen & teknik</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.scen} title="Scen" sub="Scenen i stora hallen — tal, prisutdelning, uppträdande"
                      price="från 10 000 kr" onClick={() => up({ scen: !s.scen })} />
                    <Addon sel={s.ljud} title="Ljud & ljus utöver standard" sub="Större produktion — vi specar med er"
                      price="enligt offert" onClick={() => up({ ljud: !s.ljud })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Minnen & logistik</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.foto} title="Fotograf" sub="Proffsbilder från er kväll — till internt & sociala medier"
                      price="från 10 000 kr" onClick={() => up({ foto: !s.foto })} />
                    <Addon sel={s.buss} title="Busstransport" sub="Hämtning & hemresa — vi samarbetar med Interbus"
                      price="enligt offert" onClick={() => up({ buss: !s.buss })} />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <form onSubmit={submit} className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>Önskad starttid för aktiviteten</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {["16:00", "17:30"].map((t) => (
                      <button key={t} type="button" onClick={() => up({ start: t })}
                        className={`border px-5 py-3 text-sm font-bold transition-colors ${
                          s.start === t ? "border-lime bg-lime text-black" : "border-white/15 text-white hover:border-white/40"}`}>
                        {t}
                      </button>
                    ))}
                    <input type="time" aria-label="Egen starttid" value={s.start}
                      onChange={(e) => e.target.value && up({ start: e.target.value })}
                      className={`${inputCls} w-auto [color-scheme:dark]`} />
                    <span className="text-xs text-white/40">eller egen tid</span>
                  </div>
                </div>

                <div>
                  <p className={`${labelCls} mb-3`}>Exempel på tidsplan utifrån era val</p>
                  <div className="border border-white/10 bg-white/[0.04] p-5">
                    <p className="mb-3 font-display text-base uppercase text-lime">
                      Exempel — {WHENLBL[s.when]}, start {s.start.replace(":", ".")}
                    </p>
                    {timeline.map((r, i) => (
                      <div key={i} className="flex gap-4 border-b border-dashed border-white/10 py-1.5 text-sm last:border-0">
                        <span className="min-w-[92px] font-bold text-white">{r.time}</span>
                        <span className="text-white/60">{r.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/30">
                    Preliminärt exempel — körschemat spikar vi tillsammans i offerten. Ju fler ni är, desto mer tid behöver
                    ombyte och mellanmoment.
                  </p>
                </div>

                <div>
                  <p className={`${labelCls} mb-3`}>
                    Datum — vi återkommer om tillgänglighet{" "}
                    <span className="normal-case tracking-normal text-white/30">
                      ({s.when === "fri" ? "en fredag eller lördag" : s.when === "weekeve" ? "måndag–lördag, kväll" : "en vardag, dagtid"})
                    </span>
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-date1" className={labelCls}>Önskat datum *</label>
                      <input id="pl-date1" name="datum" required type="date" className={`${inputCls} [color-scheme:dark]`} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-date2" className={labelCls}>Alternativt datum</label>
                      <input id="pl-date2" name="alternativt datum" type="date" className={`${inputCls} [color-scheme:dark]`} />
                    </div>
                  </div>
                </div>

                <div>
                  <p className={`${labelCls} mb-3`}>Kontaktuppgifter</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-name" className={labelCls}>Namn *</label>
                      <input id="pl-name" name="namn" required type="text" placeholder="För- och efternamn" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-org" className={labelCls}>Företag / organisation</label>
                      <input id="pl-org" name="foretag" type="text" placeholder="Företagets namn" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-email" className={labelCls}>E-post *</label>
                      <input id="pl-email" name="epost" required type="email" placeholder="namn@foretag.se" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-tel" className={labelCls}>Telefon</label>
                      <input id="pl-tel" name="telefon" type="tel" placeholder="070-000 00 00" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label htmlFor="pl-msg" className={labelCls}>Något mer vi ska veta?</label>
                      <textarea id="pl-msg" name="meddelande" placeholder="Allergier, tema, önskemål — allt är välkommet"
                        className={`${inputCls} min-h-[90px] resize-y`} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setStep(step - 1)}
                    className="cursor-pointer border border-white/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/50">
                    ← Tillbaka
                  </button>
                  <button type="submit" disabled={busy}
                    className="cursor-pointer bg-lime px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright disabled:opacity-50">
                    {busy ? "Skickar…" : "Skicka eventplanen →"}
                  </button>
                </div>
                {err && (
                  <p className="text-xs text-orange">Något gick fel — försök igen eller mejla boka@thebeach.one</p>
                )}
              </form>
            )}

            {step < 5 && (
              <div className="mt-10 flex gap-3">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)}
                    className="cursor-pointer border border-white/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/50">
                    ← Tillbaka
                  </button>
                )}
                <button type="button" onClick={() => setStep(step + 1)}
                  className="cursor-pointer bg-lime px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright">
                  Nästa →
                </button>
              </div>
            )}
          </div>

          {/* Summering */}
          <aside className="h-fit border border-white/10 bg-white/[0.05] p-6 lg:sticky lg:top-24">
            <h3 className="font-display text-xl uppercase text-white">Ert event</h3>
            <p className="mb-4 text-xs text-white/40">
              {TIERS[s.tier].name} · {WHENLBL[s.when]} · {s.guests} pers
            </p>
            {sum.lines.map((l, i) => (
              <div key={i} className="flex justify-between gap-3 border-b border-white/10 py-2 text-sm">
                <span className="text-white/80">
                  {l.t}
                  <span className="block text-[11px] text-white/35">{l.sub}</span>
                </span>
                <span className="shrink-0 font-bold text-white">{l.amount}</span>
              </div>
            ))}
            {sum.offert.length > 0 && (
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className={`${labelCls} mb-1.5`}>I offerten</p>
                {sum.offert.map((o, i) => (
                  <p key={i} className="py-0.5 text-xs text-white/50">· {o}</p>
                ))}
              </div>
            )}
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xs text-white/50">{sum.fran ? "Estimat från" : "Estimat"}</span>
              <span className="font-display text-3xl text-lime">{fmt(sum.total)} kr</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/30">
              Preliminärt estimat ex moms. Slutlig offert bekräftar pris och innehåll. Vi svarar inom 24 h.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
