import Reveal from "./Reveal";
import MaskReveal from "./MaskReveal";

const TEAM = [
  { name: "David Cabrera", role: "VD & medgrundare" },
  { name: "Mattias Magnusson", role: "Sportchef · 3× SM-guld" },
  { name: "Jeybee Ahlkoury", role: "Anläggningschef" },
  { name: "BeachTravels", role: "Systerbolag — träningsresor" },
];

export default function About() {
  return (
    <section
      id="om-oss"
      className="relative overflow-hidden border-t border-line bg-panel py-24 text-bone sm:py-32"
    >
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-seafoam/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brass/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">Om oss</p>
            </Reveal>
            <h2 className="text-4xl leading-[1.05] text-bone sm:text-5xl">
              <MaskReveal delay={0.05}>
                En plats där det{" "}
                <span className="italic-accent text-brass">alltid är sommar</span>
              </MaskReveal>
            </h2>
            <Reveal delay={0.1} className="mt-7 space-y-5 text-lg font-light leading-relaxed text-bone/70">
              <p>
                Allt började 2006 med en enkel dröm: en plats där vi kunde spela
                beachvolley året runt. Efter många års kamp öppnade vi 2022 vår
                anläggning i Huddinge — sjutton banor inne och ute, byggda för
                alla som älskar sanden.
              </p>
              <p>
                Idag är vi ett av Nordens största beachvolleycenter. Men vårt
                mål är detsamma: bästa möjliga förutsättningar för dig, oavsett
                om du är nybörjare eller proffs.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 font-display text-3xl italic text-brass">
                &ldquo;Alla är välkomna.&rdquo;
              </p>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-line bg-panel-2 p-6 transition duration-500 hover:-translate-y-1 hover:border-brass/30">
                  <div className="font-display text-2xl text-bone">{m.name}</div>
                  <div className="mt-1.5 text-sm text-bone/55">{m.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
