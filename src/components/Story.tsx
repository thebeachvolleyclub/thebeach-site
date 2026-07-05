import Reveal from "./Reveal";
import Counter from "./Counter";

const STATS: { to: number; suffix?: string; lbl: string }[] = [
  { to: 800, lbl: "Spelare / vecka" },
  { to: 17, lbl: "Banor inne & ute" },
  { to: 3000, suffix: " m²", lbl: "Sand" },
  { to: 20, lbl: "År i sanden" },
];

/** Lime credibility section — "Basecamp för världens bästa". */
export default function Story() {
  return (
    <section
      id="om-oss"
      className="grid grid-cols-1 gap-12 bg-lime px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-14 lg:py-28"
    >
      <Reveal>
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
          Om The Beach
        </span>
        <h2 className="mb-6 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
          Basecamp för
          <br />
          världens bästa
        </h2>

        <p className="mb-4 max-w-lg text-[15px] leading-[1.7] text-black/65 lg:text-[17px]">
          The Beach är hemmaplan för svensk beachvolley när det gäller som mest.
          Här tränar Åhman/Hellvig — OS-guld och VM-guld. Och VM-guldet avgjordes
          i en helsvensk final: Åhman/Hellvig mot Hölting Nilsson/Andersson — två
          svenska par från vår sand som spelade om titeln med varandra. Så galet
          är det.
        </p>
        <p className="mb-4 max-w-lg text-[15px] leading-[1.7] text-black/65 lg:text-[17px]">
          Hos oss har dessutom hela den svenska landslagsverksamheten sitt hem —
          samtliga förbundskaptener och landslag, junior som senior.
        </p>
        <p className="mb-4 max-w-lg text-[15px] leading-[1.7] text-black/65 lg:text-[17px]">
          Sedan 2006 har vi byggt en anläggning och ett community som är öppet
          för alla. Oavsett om du satsar mot stjärnorna eller spelar för skojs
          skull är du lika välkommen i sanden. 10 inomhusbanor och 7 utomhus —
          plats för både världstoppen och nybörjaren.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <span className="bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-lime">🥇 OS-guld · Paris 2024</span>
          <span className="bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-lime">🥇 VM-guld · Adelaide 2025</span>
        </div>
        <div className="my-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-black/15 pt-8 sm:grid-cols-4 lg:my-10">
          {STATS.map((s) => (
            <div key={s.lbl}>
              <div className="font-display text-[40px] uppercase leading-none text-black lg:text-[48px]">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black/45">
                {s.lbl}
              </div>
            </div>
          ))}
        </div>

        <div className="border-l-[2.5px] border-black pl-5">
          <p className="mb-2 text-[17px] italic leading-snug text-black">
            &ldquo;A miniature Copacabana in a warehouse south of Stockholm.&rdquo;
          </p>
          <cite className="text-[10px] font-bold uppercase not-italic tracking-[0.15em] text-black/45">
            Al Jazeera
          </cite>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-black lg:aspect-[3/4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/landslag-fotosession.webp"
              alt="Åhman/Hellvig och Andersson/Hölting Nilsson tränar på The Beach — helsvensk VM-final 2025"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* brand line-pattern overlay — only at the bottom, fading up so the
                top of the photo stays untouched */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/patterns/linePatternB-green.svg"
              alt=""
              aria-hidden="true"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to top, #000 0%, #000 22%, transparent 58%)",
                maskImage:
                  "linear-gradient(to top, #000 0%, #000 22%, transparent 58%)",
              }}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-screen"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-8 text-xs font-semibold text-white/90">
              Åhman/Hellvig &amp; Andersson/Hölting Nilsson tränar på The Beach · helsvensk VM-final 2025
            </div>
          </div>
          <div className="absolute -right-3 -top-3 flex h-24 w-24 items-center justify-center bg-black text-center font-display text-[11px] uppercase leading-tight tracking-[0.08em] text-lime">
            Nationell
            <br />
            Tränings-
            <br />
            bas
          </div>
        </div>
      </Reveal>
    </section>
  );
}
