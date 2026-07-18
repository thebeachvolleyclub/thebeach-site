import { Volleyball, Trophy, PartyPopper, ArrowRight } from "./icons";
import Reveal from "./Reveal";
import MaskReveal from "./MaskReveal";

const PILLARS = [
  {
    id: "boka",
    icon: Volleyball,
    n: "01",
    title: "Spela",
    desc: "Boka en bana med vänner eller kollegor. Drop-in eller fast tid — 1,5 h på riktig strandsand, mitt i Stockholm.",
    cta: "Boka bana",
    href: "/boka",
    external: false,
  },
  {
    id: "trana",
    icon: Trophy,
    n: "02",
    title: "Träna",
    desc: "Kurser och träningsgrupper för alla nivåer — från nybörjare till elit. Barn, ungdom, vuxna, skola och PT.",
    cta: "Hitta din grupp",
    href: "#trana",
    external: false,
  },
  {
    id: "fira",
    icon: PartyPopper,
    n: "03",
    title: "Fira",
    desc: "Kickoff, konferens, möhippa eller barnkalas. Vi fixar turnering, mat och dryck — ni får en oförglömlig dag.",
    cta: "Boka event",
    href: "#event",
    external: false,
  },
] as const;

export default function Pillars() {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="eyebrow mb-4">Vad vill du göra idag?</p>
          </Reveal>
          <h2 className="text-4xl text-bone sm:text-5xl">
            <MaskReveal delay={0.05}>
              Tre sätt att hamna{" "}
              <span className="italic-accent text-brass">på sanden</span>
            </MaskReveal>
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.id} delay={i * 0.1} className="h-full">
                <a
                  id={p.id}
                  href={p.href}
                  target={p.external ? "_blank" : undefined}
                  rel={p.external ? "noopener noreferrer" : undefined}
                  className="group flex h-full cursor-pointer flex-col bg-panel p-10 transition-colors duration-500 hover:bg-panel-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-brass/40 text-brass transition-colors duration-500 group-hover:bg-brass group-hover:text-base">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-2xl text-bone/25">
                      {p.n}
                    </span>
                  </div>
                  <h3 className="mt-8 text-3xl text-bone">{p.title}</h3>
                  <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-bone/65">
                    {p.desc}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-brass">
                    {p.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
