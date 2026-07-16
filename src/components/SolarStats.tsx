import Reveal from "@/components/Reveal";
import { getSolarData } from "@/lib/solar";

// Fasta hårdvarufakta — fysiska, ändras aldrig.
const SOLAR_KW = "72 kW";
const BATTERY = "~290 kWh";

const fmtInt = (n: number) => n.toLocaleString("sv-SE");
const fmt1 = (n: number) =>
  n.toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type Stat = { value: string; label: string };

function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.06} className="bg-base px-4 py-9 text-center">
          <div className="font-display text-4xl text-lime sm:text-5xl">{s.value}</div>
          <div className="mt-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-cream/60">
            {s.label}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Contribution({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 border border-line bg-panel p-5">
      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
      <div>
        <h3 className="font-display text-lg uppercase leading-none text-cream">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-cream/55">{body}</p>
      </div>
    </div>
  );
}

/** Grön arena-sektion. Säsongsanpassad: sommar leder med produktion, vinter med batteri/nät. */
export default async function SolarStats() {
  const data = await getSolarData();

  // Sommar = april–september. Annars vinterläge.
  const month = new Date().getMonth();
  const isSummer = month >= 3 && month <= 8;

  const co2Line = data ? ` · ${fmt1(data.co2Ton)} ton CO₂ sparat sedan start` : "";
  const facts = `${SOLAR_KW} solpark · ${BATTERY} batteri${co2Line}`;

  let stats: Stat[];
  let lead: string;

  if (data && isSummer) {
    lead =
      "Dagtid driver vi The Beach i princip helt på solen från vårt eget tak. Överskottet går ut på nätet till grannarna, och våra batterier hjälper till att hålla elnätet i balans.";
    stats = [
      { value: `${fmtInt(data.realTimePowerKw)} kW`, label: "Effekt just nu" },
      { value: `${fmtInt(data.dailyEnergyKwh)} kWh`, label: "Sol idag" },
      { value: `${fmt1(data.yearEnergyMwh)} MWh`, label: "Sol i år" },
      { value: `${fmtInt(data.totalEnergyMwh)} MWh`, label: "Total egen sol" },
    ];
  } else if (data) {
    lead =
      "Vår solpark och våra batterier jobbar året runt. Överskottet går ut på nätet till grannarna, och batterierna hjälper till att hålla elnätet i balans — även när solen är låg.";
    stats = [
      { value: `${fmtInt(data.totalEnergyMwh)} MWh`, label: "Total egen sol" },
      { value: SOLAR_KW, label: "Solpark" },
      { value: BATTERY, label: "Batteri" },
      { value: `${fmt1(data.co2Ton)} ton`, label: "CO₂ sparat" },
    ];
  } else {
    // Livedata nere — visa bara de fasta fakta, inga trasiga siffror.
    lead =
      "Arenan drivs på egen sol från vårt eget tak. Överskottet går ut på nätet till grannarna, och våra batterier hjälper till att hålla elnätet i balans.";
    stats = [
      { value: SOLAR_KW, label: "Solpark" },
      { value: BATTERY, label: "Batteri" },
    ];
  }

  return (
    <section className="border-y border-line bg-base px-5 py-16 sm:px-8 lg:px-14 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex items-center justify-between gap-4">
          <p className="eyebrow">Grön arena</p>
          <span className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/50">
            <span className="h-2 w-2 rounded-full bg-lime" aria-hidden="true" />
            Driven av solen
          </span>
        </div>

        <Reveal>
          <h2 className="font-display text-[clamp(1.75rem,6vw,3rem)] leading-[0.95] text-cream">
            Arenan drivs på <span className="italic-accent">egen sol</span>
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mb-10 mt-4 max-w-2xl text-[15px] leading-relaxed text-cream/60">{lead}</p>
        </Reveal>

        <StatGrid stats={stats} />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Contribution title="Vi delar med oss" body="Överskottet vi inte använder går ut på nätet till grannarna." />
          <Contribution title="Stabiliserar elnätet" body="Batterierna hjälper till att hålla elnätet i balans." />
        </div>

        <p className="mt-7 text-[0.7rem] uppercase tracking-[0.18em] text-cream/45">{facts}</p>
      </div>
    </section>
  );
}
