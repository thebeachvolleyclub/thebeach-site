"use client";

import { useMemo, useState } from "react";
import {
  PlannerState, initialState, TIERS, WELCOME, WHENLBL,
  calcSummary, buildTimeline, partyAllowed, sandAllowed, tierPrice, fmt, MIN_FRI,
  type When, type TierKey, type Policy, type BarMode,
} from "@/lib/planner";
import type { Locale } from "@/lib/i18n";
import { plannerDict } from "@/lib/i18n/planner";
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

function Stepper({ value, onChange, min, max, step = 1, dec, inc }: {
  value: number; onChange: (n: number) => void; min: number; max: number; step?: number;
  dec: string; inc: string;
}) {
  return (
    <div className="inline-flex items-center border border-white/15">
      <button type="button" aria-label={dec} onClick={() => onChange(Math.max(min, value - step))}
        className="h-11 w-11 cursor-pointer text-lg text-white transition-colors hover:bg-white/10">−</button>
      <span className="w-16 text-center text-base font-bold text-white">{value}</span>
      <button type="button" aria-label={inc} onClick={() => onChange(Math.min(max, value + step))}
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

export default function EventPlanner({ initialTier, locale = "sv" }: { initialTier?: TierKey; locale?: Locale }) {
  const T = plannerDict[locale].ui;
  const [s, setS] = useState<PlannerState>(
    initialTier ? { ...initialState, tier: initialTier } : initialState
  );
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  const sum = useMemo(() => calcSummary(s, locale), [s, locale]);
  const timeline = useMemo(() => buildTimeline(s, locale), [s, locale]);
  const whenLbl = plannerDict[locale].whenLbl;

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
    /* Förfrågningsdatat är ALLTID på svenska oavsett kundens språk — teamet
       läser internt på svenska. Kundens egna fält (namn osv) skickas som de är. */
    const sumSv = locale === "sv" ? sum : calcSummary(s);
    const tlSv = locale === "sv" ? timeline : buildTimeline(s);
    const wl = s.welcome ? (s.policy === "none" && WELCOME[s.welcome].lblNA ? WELCOME[s.welcome].lblNA : WELCOME[s.welcome].lbl) : null;
    const data: Record<string, string> = {
      form: "eventplaneraren",
      sprak: locale,
      koncept: `${TIERS[s.tier].name} (${tierPrice(s)} kr/p)`,
      format: WHENLBL[s.when],
      antal: `${s.guests} personer`,
      starttid: s.start,
      estimat: `${sumSv.fran ? "från " : ""}${fmt(sumSv.total)} kr ex moms (preliminärt)`,
      tillval: sumSv.lines.slice(1).map((l) => `${l.t} (${l.amount})`).join(", ") || "inga",
      "i offerten": sumSv.offert.join("; "),
      tidsplan: tlSv.map((r) => `${r.time} ${r.label}`).join(" / "),
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
            {T.sent.title}
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/50">
            {T.sent.body}
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
          {T.steps.map((label, i) => (
            <button key={label} type="button" onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                i === step ? "text-lime" : i < step ? "cursor-pointer text-white/70 hover:text-white" : "text-white/25"}`}>
              <span className={`flex h-6 w-6 items-center justify-center border text-[11px] ${
                i === step ? "border-lime bg-lime text-black" : i < step ? "border-white/40" : "border-white/15"}`}>
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
              {i < T.steps.length - 1 && <span className="mx-1 hidden h-px w-5 bg-white/15 lg:block" />}
            </button>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.65fr_1fr]">
          <div>
            {step === 0 && (
              <div className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step0.whenLegend}</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button type="button" onClick={() => setWhen("day")} className={cardCls(s.when === "day")}>
                      <Badge>{T.step0.dayBadge}</Badge>
                      <span className="block text-sm font-bold text-white">{T.step0.dayTitle}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/40">
                        {T.step0.dayDesc}
                      </span>
                    </button>
                    <button type="button" onClick={() => setWhen("weekeve")} className={cardCls(s.when === "weekeve")}>
                      <span className="block text-sm font-bold text-white">{T.step0.weekeveTitle}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/40">
                        {T.step0.weekeveDesc}
                      </span>
                    </button>
                    <button type="button" onClick={() => setWhen("fri")} className={cardCls(s.when === "fri")}>
                      <Badge>{T.step0.friBadge}</Badge>
                      <span className="block text-sm font-bold text-white">{T.step0.friTitle}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/40">
                        {T.step0.friDesc}
                      </span>
                    </button>
                  </div>
                </div>
                <Note show={s.when === "weekeve" && s.guests > 50}>
                  {T.step0.noteShared50}
                </Note>
                <Note show={s.when === "fri" && tierPrice(s) * s.guests < MIN_FRI}>
                  {T.step0.noteFriPre}{fmt(MIN_FRI)}{T.step0.noteFriPost}
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step0.guestsLegend}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Stepper value={s.guests} onChange={(guests) => up({ guests })} min={10} max={250} step={5}
                      dec={T.stepperDec} inc={T.stepperInc} />
                    <span className="text-xs text-white/40">{T.step0.guestsHint}</span>
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step0.tierLegend}</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(Object.keys(TIERS) as TierKey[]).map((k) => {
                      const Ti = TIERS[k];
                      const price = s.when === "day" ? Ti.day : Ti.eve;
                      const tm = T.step0.tierMeta[k];
                      const meta2 = s.when === "day" ? tm.meta2Day : tm.meta2Eve;
                      return (
                        <button key={k} type="button" onClick={() => up({ tier: k })} className={cardCls(s.tier === k)}>
                          {k === "alg" && <Badge>{T.step0.mostBooked}</Badge>}
                          <span className="block font-display text-xl uppercase text-white">{Ti.name}</span>
                          <span className="mt-0.5 block text-sm text-white/70">
                            {s.when === "day" && <s className="mr-1.5 text-white/30">{fmt(Ti.eve)}</s>}
                            <span className="font-bold text-lime">{fmt(price)}</span> {T.step0.perP}
                          </span>
                          <span className="mt-2 block text-xs leading-relaxed text-white/40">{meta2}<br />{tm.meta1}</span>
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
                  <p className={`${labelCls} mb-3`}>{T.step1.policyLegend}</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["none", "std", "full"] as Policy[]).map((k) => (
                      <button key={k} type="button" className={cardCls(s.policy === k)}
                        onClick={() => up({ policy: k, welcome: k === "none" && s.welcome !== "cava" ? null : s.welcome })}>
                        {k === "std" && <Badge>{T.step1.stdBadge}</Badge>}
                        <span className="block text-sm font-bold text-white">{T.step1.policies[k].title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-white/40">{T.step1.policies[k].desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Note show={s.policy === "none"}>
                  {T.step1.noteNoAlc}
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step1.welcomeLegend}</p>
                  <div className="flex flex-col gap-2.5">
                    {s.policy === "none" ? (
                      <Addon sel={s.welcome === "cava"} title={T.step1.welcomeNoAlc.title}
                        sub={T.step1.welcomeNoAlc.sub} price={T.step1.welcomeNoAlc.price}
                        onClick={() => up({ welcome: s.welcome === "cava" ? null : "cava" })} />
                    ) : (
                      <>
                        <Addon sel={s.welcome === "cava"} title={T.step1.welcomeCava.title}
                          sub={T.step1.welcomeCava.sub} price={T.step1.welcomeCava.price}
                          onClick={() => up({ welcome: s.welcome === "cava" ? null : "cava" })} />
                        <Addon sel={s.welcome === "aperol"} title={T.step1.welcomeAperol.title}
                          sub={T.step1.welcomeAperol.sub} price={T.step1.welcomeAperol.price}
                          onClick={() => up({ welcome: s.welcome === "aperol" ? null : "aperol" })} />
                        <Addon sel={s.welcome === "other"} title={T.step1.welcomeOther.title}
                          sub={T.step1.welcomeOther.sub} price={T.step1.welcomeOther.price}
                          onClick={() => up({ welcome: s.welcome === "other" ? null : "other" })} />
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step1.unitsLegend}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Stepper value={s.units} onChange={(units) => up({ units })} min={0} max={6}
                      dec={T.stepperDec} inc={T.stepperInc} />
                    <span className="text-xs text-white/40">{T.step1.unitsPre}{s.policy === "none" ? "39" : "79"}{T.step1.unitsPost}</span>
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step1.barLegend}</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["pre", "invoice", "guests"] as BarMode[]).map((k) => (
                      <button key={k} type="button" className={cardCls(s.bar === k)} onClick={() => up({ bar: k })}>
                        {k === "invoice" && <Badge>{T.step1.stdBadge}</Badge>}
                        <span className="block text-sm font-bold text-white">{T.step1.barModes[k].title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-white/40">{T.step1.barModes[k].desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-7">
                <Note show={!sandAllowed(s)}>
                  {T.step2.noteSand}
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step2.dukningLegend}</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.dukning} dis={!sandAllowed(s)} title={T.step2.dukning.title}
                      sub={T.step2.dukning.sub} price={T.step2.dukning.price}
                      onClick={() => up({ dukning: !s.dukning })} />
                    <Addon sel={s.dekor} title={T.step2.dekor.title} sub={T.step2.dekor.sub}
                      price={T.step2.dekor.price} onClick={() => up({ dekor: !s.dekor })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step2.dessertLegend}</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.dessert === "lemon"} title={T.step2.lemon.title} sub={T.step2.lemon.sub} price={T.step2.lemon.price}
                      onClick={() => up({ dessert: s.dessert === "lemon" ? null : "lemon" })} />
                    <Addon sel={s.dessert === "panna"} title={T.step2.panna.title} sub={T.step2.panna.sub} price={T.step2.panna.price}
                      onClick={() => up({ dessert: s.dessert === "panna" ? null : "panna" })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step2.coffeeLegend}</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.coffee === "kaffe"} title={T.step2.kaffe.title} sub={T.step2.kaffe.sub} price={T.step2.kaffe.price}
                      onClick={() => up({ coffee: s.coffee === "kaffe" ? null : "kaffe" })} />
                    <Addon sel={s.coffee === "godis"} title={T.step2.godis.title} sub={T.step2.godis.sub} price={T.step2.godis.price}
                      onClick={() => up({ coffee: s.coffee === "godis" ? null : "godis" })} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-7">
                <Note show={!partyAllowed(s)}>
                  {T.step3.noteParty}
                </Note>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step3.musicLegend}</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.dj} dis={!partyAllowed(s)} title={T.step3.dj.title} sub={T.step3.dj.sub}
                      price={T.step3.dj.price} onClick={() => up({ dj: !s.dj })} />
                    <Addon sel={s.eld} dis={!partyAllowed(s)} title={T.step3.eld.title} sub={T.step3.eld.sub}
                      price={T.step3.eld.price} onClick={() => up({ eld: !s.eld })} />
                    <Addon sel={s.band} dis={!partyAllowed(s)} title={T.step3.band.title} sub={T.step3.band.sub}
                      price={T.step3.band.price} onClick={() => up({ band: !s.band })} />
                    <Addon sel={s.trubadur} title={T.step3.trubadur.title} sub={T.step3.trubadur.sub}
                      price={T.step3.trubadur.price} onClick={() => up({ trubadur: !s.trubadur })} />
                    <Addon sel={s.dans} title={T.step3.dans.title} sub={T.step3.dans.sub}
                      price={T.step3.dans.price} onClick={() => up({ dans: !s.dans })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step3.aktLegend}</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.akt} title={T.step3.akt.title} sub={T.step3.akt.sub} price={T.step3.akt.price}
                      onClick={() => up({ akt: !s.akt, lek: s.akt ? false : s.lek })} />
                    <Addon sel={s.lek} dis={!s.akt} title={T.step3.lek.title} sub={T.step3.lek.sub}
                      price={T.step3.lek.price} onClick={() => up({ lek: !s.lek })} />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step4.konfLegend}</p>
                  <Addon sel={s.konf} title={T.step4.konf.title}
                    sub={T.step4.konf.sub}
                    price={T.step4.konf.price} onClick={() => up({ konf: !s.konf })} />
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step4.scenLegend}</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.scen} title={T.step4.scen.title} sub={T.step4.scen.sub}
                      price={T.step4.scen.price} onClick={() => up({ scen: !s.scen })} />
                    <Addon sel={s.ljud} title={T.step4.ljud.title} sub={T.step4.ljud.sub}
                      price={T.step4.ljud.price} onClick={() => up({ ljud: !s.ljud })} />
                  </div>
                </div>
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step4.logLegend}</p>
                  <div className="flex flex-col gap-2.5">
                    <Addon sel={s.foto} title={T.step4.foto.title} sub={T.step4.foto.sub}
                      price={T.step4.foto.price} onClick={() => up({ foto: !s.foto })} />
                    <Addon sel={s.buss} title={T.step4.buss.title} sub={T.step4.buss.sub}
                      price={T.step4.buss.price} onClick={() => up({ buss: !s.buss })} />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <form onSubmit={submit} className="flex flex-col gap-7">
                <div>
                  <p className={`${labelCls} mb-3`}>{T.step5.startLegend}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {["16:00", "17:30"].map((tid) => (
                      <button key={tid} type="button" onClick={() => up({ start: tid })}
                        className={`border px-5 py-3 text-sm font-bold transition-colors ${
                          s.start === tid ? "border-lime bg-lime text-black" : "border-white/15 text-white hover:border-white/40"}`}>
                        {tid}
                      </button>
                    ))}
                    <input type="time" aria-label={T.step5.customStartAria} value={s.start}
                      onChange={(e) => e.target.value && up({ start: e.target.value })}
                      className={`${inputCls} w-auto [color-scheme:dark]`} />
                    <span className="text-xs text-white/40">{T.step5.orOwnTime}</span>
                  </div>
                </div>

                <div>
                  <p className={`${labelCls} mb-3`}>{T.step5.timelineLegend}</p>
                  <div className="border border-white/10 bg-white/[0.04] p-5">
                    <p className="mb-3 font-display text-base uppercase text-lime">
                      {T.step5.examplePre}{whenLbl[s.when]}{T.step5.exampleStart}{s.start.replace(":", ".")}
                    </p>
                    {timeline.map((r, i) => (
                      <div key={i} className="flex gap-4 border-b border-dashed border-white/10 py-1.5 text-sm last:border-0">
                        <span className="min-w-[92px] font-bold text-white">{r.time}</span>
                        <span className="text-white/60">{r.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/30">
                    {T.step5.timelineFine}
                  </p>
                </div>

                <div>
                  <p className={`${labelCls} mb-3`}>
                    {T.step5.dateLegend}{" "}
                    <span className="normal-case tracking-normal text-white/30">
                      {s.when === "fri" ? T.step5.dateHintFri : s.when === "weekeve" ? T.step5.dateHintWeekeve : T.step5.dateHintDay}
                    </span>
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-date1" className={labelCls}>{T.step5.date1}</label>
                      <input id="pl-date1" name="datum" required type="date" className={`${inputCls} [color-scheme:dark]`} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-date2" className={labelCls}>{T.step5.date2}</label>
                      <input id="pl-date2" name="alternativt datum" type="date" className={`${inputCls} [color-scheme:dark]`} />
                    </div>
                  </div>
                </div>

                <div>
                  <p className={`${labelCls} mb-3`}>{T.step5.contactLegend}</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-name" className={labelCls}>{T.step5.nameLbl}</label>
                      <input id="pl-name" name="namn" required type="text" placeholder={T.step5.namePh} className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-org" className={labelCls}>{T.step5.orgLbl}</label>
                      <input id="pl-org" name="foretag" type="text" placeholder={T.step5.orgPh} className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-email" className={labelCls}>{T.step5.emailLbl}</label>
                      <input id="pl-email" name="epost" required type="email" placeholder={T.step5.emailPh} className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pl-tel" className={labelCls}>{T.step5.telLbl}</label>
                      <input id="pl-tel" name="telefon" type="tel" placeholder={T.step5.telPh} className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label htmlFor="pl-msg" className={labelCls}>{T.step5.msgLbl}</label>
                      <textarea id="pl-msg" name="meddelande" placeholder={T.step5.msgPh}
                        className={`${inputCls} min-h-[90px] resize-y`} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setStep(step - 1)}
                    className="cursor-pointer border border-white/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/50">
                    {T.back}
                  </button>
                  <button type="submit" disabled={busy}
                    className="cursor-pointer bg-lime px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright disabled:opacity-50">
                    {busy ? T.step5.sending : T.step5.send}
                  </button>
                </div>
                {err && (
                  <p className="text-xs text-orange">{T.step5.error}</p>
                )}
              </form>
            )}

            {step < 5 && (
              <div className="mt-10 flex gap-3">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)}
                    className="cursor-pointer border border-white/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/50">
                    {T.back}
                  </button>
                )}
                <button type="button" onClick={() => setStep(step + 1)}
                  className="cursor-pointer bg-lime px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright">
                  {T.next}
                </button>
              </div>
            )}
          </div>

          {/* Summering */}
          <aside className="h-fit border border-white/10 bg-white/[0.05] p-6 lg:sticky lg:top-24">
            <h3 className="font-display text-xl uppercase text-white">{T.aside.title}</h3>
            <p className="mb-4 text-xs text-white/40">
              {TIERS[s.tier].name} · {whenLbl[s.when]} · {s.guests} {T.aside.pers}
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
                <p className={`${labelCls} mb-1.5`}>{T.aside.inQuote}</p>
                {sum.offert.map((o, i) => (
                  <p key={i} className="py-0.5 text-xs text-white/50">· {o}</p>
                ))}
              </div>
            )}
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xs text-white/50">{sum.fran ? T.aside.estimateFrom : T.aside.estimate}</span>
              <span className="font-display text-3xl text-lime">{fmt(sum.total)} kr</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/30">
              {T.aside.fine}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
