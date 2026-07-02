import Reveal from "@/components/Reveal";

const VARDERINGAR = [
  {
    no: "01",
    title: "Alla är välkomna.",
    body: "I Huddinge tränar alla i samma sand — från kompletta nybörjare till världsklass.",
  },
  {
    no: "02",
    title: "Glädje och ansvar.",
    body: "Vi skapar en miljö där välmående, respekt och gemenskap går hand i hand med tävling och utveckling.",
    // TODO(operator): confirm preferred copy for "Glädje och ansvar" if you have a verbatim brand line
  },
  {
    no: "03",
    title: "Vi gör det som fungerar.",
    body: "Inga onödiga krångel — vi fokuserar på det som ger spelare bäst förutsättningar att utvecklas.",
    // TODO(operator): confirm preferred copy for "Vi gör det som fungerar"
  },
  // TODO(operator): add a 4th elit/prestanda värdering here if desired
];

export default function VadViStarFor() {
  return (
    <section
      id="vad-vi-star-for"
      className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          <p className="eyebrow mb-4">Vår mission</p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
            Vad vi{" "}
            <span className="italic-accent">står för</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-bone/45 sm:text-right">
          Bästa möjliga förutsättningar för alla som vill spela beachvolley —
          nybörjare som proffs.
        </p>
      </Reveal>

      {/* Värderingar cards */}
      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-3">
        {VARDERINGAR.map((v, i) => (
          <Reveal
            key={v.no}
            delay={i * 0.08}
            className="flex flex-col border border-line p-7 lg:p-10"
          >
            <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-bone/30">
              {v.no}
            </span>
            <h3 className="mb-3 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">
              {v.title}
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-bone/55">
              {v.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
