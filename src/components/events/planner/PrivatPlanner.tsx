"use client";

/**
 * Privatplaneraren — lördagsfest-varianten av eventplaneraren (/events/privat).
 * Samma UI-mönster och klasser som EventPlanner.tsx, men endast svenska (v1),
 * alla priser ink moms och exklusivitetslogik vid 50 000 kr i totalomsättning.
 * Prislogiken bor i src/lib/privatplanner.ts.
 */

import { useMemo, useState } from "react";
import {
  PrivatState, initialState, TIERS, PARTYLBL,
  calcSummary, buildTimeline, welcomeLabel, fmt, MIN_EXCL,
  type PartyKey, type TierKey, type Policy, type BarMode,
} from "@/lib/privatplanner";
import { pushEvent } from "@/lib/gtm";

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

const STEPS = ["Vilken fest?", "Koncept", "Dryck & bar", "Mat & dukning", "Underhållning", "Förfrågan"];

const PARTIES: { key: PartyKey; title: string; desc: string }[] = [
  {
    key: "bday",
    title: "Födelsedag & jubileum",
    desc: "Runda år, jämna år eller bara ett år till — fira med sand mellan tårna.",
  },
  {
    key: "wedding",
    title: "Bröllop & förlovning",
    desc: "Sommarbröllop året runt — vi skräddarsyr gärna vidare, er plan blir vårt utgångsläge.",
  },
  {
    key: "sexa",
    title: "Svensexa & möhippa",
    desc: "Sista festen som fri — turnering, middag och en kväll att minnas.",
  },
  {
    key: "friends",
    title: "Kompisgäng & annat",
    desc: "Ingen anledning behövs — samla gänget och ta över stranden en lördag.",
  },
];

const TIERMETA: Record<TierKey, { meta1: string; meta2: string }> = {
  lp: { meta1: "Enkelt & socialt", meta2: "Turnering + instruktör · tapas · 1 dryck · King & Queen-pris" },
  alg: { meta1: "Fest & middag — mest bokad", meta2: "Turnering + instruktör · middagsbuffé · 1 dryck · King & Queen-pris" },
  mia: { meta1: "Helkväll & after beach", meta2: "Turnering + instruktör · BBQ-buffé · 2 drycker · King & Queen-pris" },
};

const POLICIES: Record<Policy, { title: string; desc: string }> = {
  none: {
    title: "Ingen alkohol",
    desc: "Helt alkoholfritt — dryckesenheterna blir alkoholfria och baren kör mocktails.",
  },
  std: {
    title: "Öl, vin, cider & cava",
    desc: "Klassikern. Ej sprit — bra tempo hela kvällen.",
  },
  full: {
    title: "Full bar",
    desc: "Hela sortimentet inklusive sprit och drinkar i baren.",
  },
};

const BARMODES: Record<BarMode, { title: string; desc: string }> = {
  guests: {
    title: "Gästerna betalar själva i baren",
    desc: "När paketets enheter är slut köper var och en själv — vanligast på privatfester.",
  },
  invoice: {
    title: "Öppen bar på faktura",
    desc: "Baren håller öppet och notan går på er — löpande enligt barpriser.",
  },
  card: {
    title: "Öppen bar — kortbetalning på plats",
    desc: "Ni bjuder och betalar med kort på plats i slutet av kvällen.",
  },
  pre: {
    title: "Vi förköper fler dryckesbiljetter",
    desc: "Biljetter som gästerna får vid ankomst — full koll på kostnaden.",
  },
};

export default function PrivatPlanner() {
  const [s, setS] = useState<PrivatState>(initialState);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  const sum = useMemo(() => calcSummary(s), [s]);
  const timeline = useMemo(() => buildTimeline(s), [s]);

  const up = (patch: Partial<PrivatState>) => setS((p) => ({ ...p, ...patch }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(false);
    const fd = new FormData(e.currentTarget);
    const wl = welcomeLabel(s);
    const data: Record<string, string> = {
      form: "privatplaneraren",
      sprak: "sv",
      festtyp: PARTYLBL[s.party],
      koncept: `${TIERS[s.tier].name} (${TIERS[s.tier].price} kr/p ink moms)`,
      aktivitet: s.volley ? "med beachvolley" : "utan spel",
      antal: `${s.guests} personer`,
      starttid: s.start,
      estimat: `${sum.fran ? "från " : ""}${fmt(sum.total)} kr ink moms (preliminärt)`,
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
        pushEvent("form_submit_lead", { form_id: "privatplaneraren" });
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
            Tack — er festplan är hos oss!
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/50">
            Vi återkommer inom 24 timmar med datum och en offert. Vill ni något under tiden? Mejla david@thebeach.one.
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
          {STEPS.map((label, i) => (
            <button key={label} type="button" onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                i === step ? "text-lime" : i < step ? "cursor-pointer text-white/70 hover:text-white" : "text-white/25"}`}>
              <span className={`flex h-6 w-6 items-center justify-center border text-[11px] ${
                i === step ? "border-lime bg-lime text-black" : i < step ? "border-white/40" : "border-white/15"}`}>
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
              {i < STEPS.length - 1 && <span className="mx-1 hidden h-px w-5 bg-white/15 lg:block" />}
            </button>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.65fr_1fr]">
          <div>
            {step === 0 && (
              <div className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>Vad firar ni?</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PARTIES.map((p) => (
                      <button key={p.key} type="button" onClick={() => up({ party: p.key })}
                        className={cardCls(s.party === p.key)}>
                        <span className="block text-sm font-bold text-white">{p.title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-white/40">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Note show>
                  Privatfester kör vi lördagskvällar — fest till 01.
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>Hur många är ni?</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Stepper value={s.guests} onChange={(guests) => up({ guests })} min={10} max={250} step={5} />
                    <span className="text-xs text-white/40">personer — paketen gäller upp till 250, fler? Skräddarsytt.</span>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>Välj koncept — alla priser ink moms</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(Object.keys(TIERS) as TierKey[]).map((k) => {
                      const Ti = TIERS[k];
                      return (
                        <button key={k} type="button" onClick={() => up({ tier: k })} className={cardCls(s.tier === k)}>
                          {k === "alg" && <Badge>Mest bokad</Badge>}
                          <span className="block font-display text-xl uppercase text-white">{Ti.name}</span>
                          <span className="mt-0.5 block text-sm text-white/70">
                            <span className="font-bold text-lime">{fmt(Ti.price)}</span> kr/p ink moms
                          </span>
                          <span className="mt-2 block text-xs leading-relaxed text-white/40">
                            {TIERMETA[k].meta2}<br />{TIERMETA[k].meta1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Spel eller bara häng?</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => up({ volley: true })} className={cardCls(s.volley)}>
                      <span className="block text-sm font-bold text-white">Med beachvolley</span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/40">
                        1,5 h turnering med instruktör — ingen behöver ha spelat förut.
                      </span>
                    </button>
                    <button type="button" onClick={() => up({ volley: false })} className={cardCls(!s.volley)}>
                      <span className="block text-sm font-bold text-white">Utan spel — mer häng, samma pris</span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/40">
                        Mingel i loungen och mer tid vid bordet — sanden finns där ändå.
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>Alkoholpolicy för er fest</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["none", "std", "full"] as Policy[]).map((k) => (
                      <button key={k} type="button" className={cardCls(s.policy === k)}
                        onClick={() => up({ policy: k, welcome: k === "none" && s.welcome !== "cava" ? null : s.welcome })}>
                        {k === "std" && <Badge>Standard</Badge>}
                        <span className="block text-sm font-bold text-white">{POLICIES[k].title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-white/40">{POLICIES[k].desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Note show={s.policy === "none"}>
                  Alkoholfritt hela vägen — vi byter till alkoholfria motsvarigheter och drar av 40 kr per dryckesenhet i paketet.
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>Välkomstdrink vid ankomst</p>
                  <div className="flex flex-col gap-2.5">
                    {s.policy === "none" ? (
                      <Addon sel={s.welcome === "cava"} title="Alkoholfritt bubbel vid ankomst"
                        sub="Ett glas alkoholfritt bubbel vid ankomst" price="61 kr/p"
                        onClick={() => up({ welcome: s.welcome === "cava" ? null : "cava" })} />
                    ) : (
                      <>
                        <Addon sel={s.welcome === "cava"} title="Cava vid ankomst"
                          sub="Ett glas bubbel vid ankomst" price="79 kr/p"
                          onClick={() => up({ welcome: s.welcome === "cava" ? null : "cava" })} />
                        <Addon sel={s.welcome === "aperol"} title="Aperol Spritz vid ankomst"
                          sub="Sommarklassikern — direkt semesterkänsla" price="96 kr/p"
                          onClick={() => up({ welcome: s.welcome === "aperol" ? null : "aperol" })} />
                        <Addon sel={s.welcome === "other"} title="Välkomstdrink 4 cl"
                          sub="Valfri enkel drink — vi föreslår i offerten" price="96 kr/p"
                          onClick={() => up({ welcome: s.welcome === "other" ? null : "other" })} />
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Extra dryckesenheter (förköpta)</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Stepper value={s.units} onChange={(units) => up({ units })} min={0} max={6} />
                    <span className="text-xs text-white/40">à {s.policy === "none" ? "39" : "79"} kr/person ink moms — utöver det som ingår i konceptet</span>
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>När paketets enheter är slut</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(["guests", "invoice", "card", "pre"] as BarMode[]).map((k) => (
                      <button key={k} type="button" className={cardCls(s.bar === k)} onClick={() => up({ bar: k })}>
                        {k === "guests" && <Badge>Standard</Badge>}
                        <span className="block text-sm font-bold text-white">{BARMODES[k].title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-white/40">{BARMODES[k].desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>Dukning & dekoration</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.dukning} title="Dukad middag i sanden"
                      sub="Långbord mitt i sanden i stället för loungen — wow-faktorn" price="+100 kr/p"
                      onClick={() => up({ dukning: !s.dukning })} />
                    <Addon sel={s.dekor} title="Extra dekoration"
                      sub="Blommor, ljus och tema — vid dukningen eller i loungen" price="79 kr/p"
                      onClick={() => up({ dekor: !s.dekor })} />
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

            {step === 4 && (
              <div className="flex flex-col gap-7">
                <Note show>
                  DJ, eldshow och liveband kräver att arenan är helt er — exklusiv arena från 50 000 kr ink moms i totalomsättning. Inget spärras: ligger totalen under räknas paketet upp, och summeringen visar direkt vad kvällen landar på.
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>Musik & show</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.dj} title="DJ" sub="Normalt ingår 22–01" price="från 5 000 kr"
                      onClick={() => up({ dj: !s.dj })} />
                    <Addon sel={s.eld} title="Eldshow" sub="Efter middagen — bryggan till dansgolvet" price="från 8 000 kr"
                      onClick={() => up({ eld: !s.eld })} />
                    <Addon sel={s.band} title="Liveband" sub="Vi bokar rätt band för er kväll" price="enligt offert"
                      onClick={() => up({ band: !s.band })} />
                    <Addon sel={s.trubadur} title="Trubadur" sub="Livemusik i lagom format — perfekt till middagen" price="enligt offert"
                      onClick={() => up({ trubadur: !s.trubadur })} />
                    <Addon sel={s.dans} title="Dansinstruktör" sub="Gemensam dansstund som får med alla" price="enligt offert"
                      onClick={() => up({ dans: !s.dans })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Fler aktiviteter</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.akt} title="Utökade aktiviteter" sub="Pingis, cornhole, kubb" price="enligt offert"
                      onClick={() => up({ akt: !s.akt, lek: s.akt ? false : s.lek })} />
                    <Addon sel={s.lek} dis={!s.akt} title="Med lekledare"
                      sub="Vi bemannar aktiviteterna och håller igång tempot" price="enligt offert"
                      onClick={() => up({ lek: !s.lek })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Scen & teknik</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.scen} title="Scen" sub="Scenen i stora hallen — tal, överraskningar, uppträdande" price="från 10 000 kr"
                      onClick={() => up({ scen: !s.scen })} />
                    <Addon sel={s.ljud} title="Ljud & ljus utöver standard" sub="Större produktion — vi specar med er" price="enligt offert"
                      onClick={() => up({ ljud: !s.ljud })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>Minnen & logistik</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.foto} title="Fotograf" sub="Proffsbilder från er kväll — minnen och sociala medier" price="från 10 000 kr"
                      onClick={() => up({ foto: !s.foto })} />
                    <Addon sel={s.buss} title="Busstransport" sub="Hämtning & hemresa — vi samarbetar med Interbus" price="enligt offert"
                      onClick={() => up({ buss: !s.buss })} />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <form onSubmit={submit} className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>Önskad starttid</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {["17:00", "18:00", "19:00"].map((tid) => (
                      <button key={tid} type="button" onClick={() => up({ start: tid })}
                        className={`border px-5 py-3 text-sm font-bold transition-colors ${
                          s.start === tid ? "border-lime bg-lime text-black" : "border-white/15 text-white hover:border-white/40"}`}>
                        {tid}
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
                      Exempel — lördagskväll, start {s.start.replace(":", ".")}
                    </p>
                    {timeline.map((r, i) => (
                      <div key={i} className="flex gap-4 border-b border-dashed border-white/10 py-1.5 text-sm last:border-0">
                        <span className="min-w-[92px] font-bold text-white">{r.time}</span>
                        <span className="text-white/60">{r.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/30">
                    Preliminärt exempel — körschemat spikar vi tillsammans i offerten. Ju fler ni är, desto mer tid behöver ombyte och mellanmoment.
                  </p>
                </div>

                <div>
                  <p className={`${labelCls} mb-3`}>
                    Datum — vi återkommer om tillgänglighet{" "}
                    <span className="normal-case tracking-normal text-white/30">(privatfester kör vi lördagkvällar)</span>
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pp-date1" className={labelCls}>Önskat datum * (en lördag)</label>
                      <input id="pp-date1" name="datum" required type="date" className={`${inputCls} [color-scheme:dark]`} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pp-date2" className={labelCls}>Alternativt datum</label>
                      <input id="pp-date2" name="alternativt datum" type="date" className={`${inputCls} [color-scheme:dark]`} />
                    </div>
                  </div>
                </div>

                <div>
                  <p className={`${labelCls} mb-3`}>Kontaktuppgifter</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pp-name" className={labelCls}>Namn *</label>
                      <input id="pp-name" name="namn" required type="text" placeholder="För- och efternamn" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pp-firas" className={labelCls}>Vem firas? (valfritt)</label>
                      <input id="pp-firas" name="vem firas" type="text" placeholder="T.ex. brudparet, jubilaren…" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pp-email" className={labelCls}>E-post *</label>
                      <input id="pp-email" name="epost" required type="email" placeholder="namn@mejl.se" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pp-tel" className={labelCls}>Telefon</label>
                      <input id="pp-tel" name="telefon" type="tel" placeholder="070-000 00 00" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label htmlFor="pp-msg" className={labelCls}>Något mer vi ska veta?</label>
                      <textarea id="pp-msg" name="meddelande" placeholder="Allergier, tema, överraskningar — allt är välkommet"
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
                    {busy ? "Skickar…" : "Skicka festplanen →"}
                  </button>
                </div>
                {err && (
                  <p className="text-xs text-orange">Något gick fel — försök igen eller mejla david@thebeach.one</p>
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
            <h3 className="font-display text-xl uppercase text-white">Er fest</h3>
            <p className="mb-4 text-xs text-white/40">
              {TIERS[s.tier].name} · lördagskväll · {s.guests} pers · {PARTYLBL[s.party]}
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
            <div className={`mt-4 border p-3 text-[12px] leading-relaxed ${
              sum.exclusive ? "border-lime/40 bg-lime/[0.08] text-lime" : "border-white/15 bg-white/[0.03] text-white/60"}`}>
              {sum.exclusive
                ? "Arenan är er — exklusivt."
                : `Under ${fmt(MIN_EXCL)} kr kan kvällen delas med annat sällskap — ni är ${fmt(sum.gap)} kr från att arenan blir helt er.`}
            </div>
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
              Preliminärt estimat ink moms. Slutlig offert bekräftar pris och innehåll. Vi svarar inom 24 h.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
