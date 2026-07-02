import Reveal from "./Reveal";

const STATS = [
  { value: "17", label: "Banor inne & ute" },
  { value: "2006", label: "På sanden sedan" },
  { value: "365", label: "Dagar om året" },
  { value: "3–99", label: "Alla åldrar" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-line bg-panel">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="border-line px-4 py-12 text-center [&:nth-child(odd)]:border-r md:[&:not(:last-child)]:border-r md:[&:nth-child(odd)]:border-r"
          >
            <div className="font-display text-5xl text-brass sm:text-6xl">
              {s.value}
            </div>
            <div className="mt-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-bone/65">
              {s.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
