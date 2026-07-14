import Reveal from "./Reveal";

/** Training section med foto-tile i griddet. */
type Card = {
  level: string;
  title: string;
  when: string;
  desc: string;
  badge: string;
  spots: "open" | "few";
};

const CARDS: Card[] = [
  { level: "Nybörjare", title: "Grundkurs", when: "Startar 1 sept & 3 sept · Kvällstider", desc: "Spela, träna och lär känna sporten från grunden.", badge: "Anmälan öppen", spots: "open" },
  { level: "Mellannivå", title: "Fortsättningskurs", when: "Startar 1 sept & 3 sept · Kvällstider", desc: "Du kan grunderna — nu tar vi ditt spel till nästa nivå.", badge: "Anmälan öppen", spots: "open" },
  { level: "Avancerat", title: "Senior & Elitträning", when: "Schema bekräftas 1 aug", desc: "Träning med coacher på nationell nivå.", badge: "Anmälan öppnar 1 aug 20:00", spots: "few" },
  { level: "Barn & Ungdom", title: "Juniorträning", when: "Hela terminen · Weekends", desc: "För barn och unga som vill lära sig beachvolley på riktigt.", badge: "Anmälan öppen", spots: "open" },
  { level: "Drop-in", title: "Prova på gratis", when: "28 juni 15:00–16:30", desc: "Gratis provpass för nya spelare. Inga förkunskaper krävs.", badge: "Begränsade platser", spots: "few" },
];

export default function Training() {
  return (
    <section id="training" className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <Reveal>
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
          Träning
        </span>
        <h2 className="mb-10 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:mb-16 lg:text-[clamp(3rem,5.5vw,5rem)]">
          Hitta din
          <br />
          träningsgrupp
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Photo tile — coach in action */}
        <Reveal className="h-full">
          <figure className="relative h-full min-h-[240px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/coach.webp"
              alt="Coach instruerar på The Beach"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_12%]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-10 text-[11px] font-bold uppercase tracking-[0.1em] text-white/90">
              Alla grupper leds av utbildade coacher
            </figcaption>
          </figure>
        </Reveal>

        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06} className="h-full">
            <div className="flex h-full cursor-pointer flex-col bg-white p-7 transition-colors duration-300 hover:bg-lime/40 lg:p-10">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
                {c.level}
              </div>
              <div className="mb-1.5 font-display text-[22px] uppercase text-black lg:text-2xl">
                {c.title}
              </div>
              <div className="mb-5 flex-1 text-[13px] leading-relaxed text-black/45">
                {c.when}
                <br />
                {c.desc}
              </div>
              <span
                className={`self-start px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                  c.spots === "open" ? "bg-lime text-black" : "bg-pink text-white"
                }`}
              >
                {c.badge}
              </span>
            </div>
          </Reveal>
        ))}

        {/* CTA card */}
        <Reveal delay={0.3} className="h-full">
          <a
            href="/trana"
            className="flex h-full cursor-pointer flex-col justify-between bg-orange p-7 lg:p-10"
          >
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                Anmälan öppnar 1 aug kl 20:00
              </div>
              <div className="font-display text-xl uppercase text-white">
                Se alla kurser & anmäl dig
              </div>
            </div>
            <div className="mt-6 text-4xl text-white lg:mt-8 lg:text-[40px]">→</div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
