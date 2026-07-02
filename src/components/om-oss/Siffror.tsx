import Reveal from "@/components/Reveal";

const STATS = [
  {
    value: "800+",
    label: "Spelare / vecka",
    note: null,
  },
  {
    value: "17",
    label: "Banor",
    note: "10 inne + 7 ute",
  },
  {
    value: "2006",
    label: "Grundat",
    note: null,
  },
  {
    value: "10–250",
    label: "Gäster / event",
    note: null,
  },
];

export default function Siffror() {
  return (
    <section
      id="siffror"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            The Beach i siffror
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Siffror
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/60 sm:text-right">
          Två decennier av beachvolley — varje vecka fylls sanden med spelare
          från hela Stockholm.
        </p>
      </Reveal>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-0.5 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 0.08}
            className="flex flex-col border border-black/10 bg-white p-7 lg:p-10"
          >
            <span className="font-display text-[clamp(2.5rem,8vw,4.5rem)] leading-none text-black">
              {stat.value}
            </span>
            <span className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-black/40">
              {stat.label}
            </span>
            {stat.note && (
              <span className="mt-1 text-[11px] text-black/30">{stat.note}</span>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
