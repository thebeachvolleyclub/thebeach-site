import Reveal from "./Reveal";

type Locale = "sv" | "en";

const COPY: Record<Locale, {
  eyebrow: string;
  head: string[];
  intro: string;
  features: string[];
  soon: string;
  rows: { label: string; hi?: boolean; dim?: boolean }[];
  appStore: string;
  googlePlay: string;
}> = {
  sv: {
    eyebrow: "The Beach-appen",
    head: ["The Beach", "i fickan"],
    intro:
      "Spela mer, missa inget. Nyheter, resultat, matchmaking, turneringar och gänget — allt samlat, så du bara behöver dyka upp i sanden.",
    features: [
      "Nyheter & event",
      "Resultat",
      "Matchmaking",
      "Turneringsklient",
      "Träningskalender",
      "Träningsfilmer",
      "Vänner & chatt",
    ],
    soon: "Boka bana — kommer snart",
    rows: [
      { label: "Senaste nytt från The Beach", hi: true },
      { label: "Veckans resultat" },
      { label: "Matchmaking — hitta spel", hi: true },
      { label: "After Beach — turneringsklient" },
      { label: "Din träningskalender" },
      { label: "Träningsfilmer" },
      { label: "Boka bana — kommer snart", dim: true },
    ],
    appStore: "App Store",
    googlePlay: "Google Play",
  },
  en: {
    eyebrow: "The Beach app",
    head: ["The Beach", "in your pocket"],
    intro:
      "Play more, miss nothing. News, results, matchmaking, tournaments and your crew — all in one place, so you just show up in the sand.",
    features: [
      "News & events",
      "Results",
      "Matchmaking",
      "Tournament client",
      "Training calendar",
      "Training clips",
      "Friends & chat",
    ],
    soon: "Court booking — coming soon",
    rows: [
      { label: "Latest from The Beach", hi: true },
      { label: "Results of the week" },
      { label: "Matchmaking — find a game", hi: true },
      { label: "After Beach — tournament client" },
      { label: "Your training calendar" },
      { label: "Training clips" },
      { label: "Court booking — coming soon", dim: true },
    ],
    appStore: "App Store",
    googlePlay: "Google Play",
  },
};

export default function AppSection({ locale = "sv" }: { locale?: Locale }) {
  const t = COPY[locale];
  return (
    <section className="grid grid-cols-1 items-center gap-10 bg-mint px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-14 lg:py-28">
      <Reveal>
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
          {t.eyebrow}
        </span>
        <h2 className="mb-4 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
          {t.head[0]}
          <br />
          {t.head[1]}
        </h2>
        <p className="mb-8 max-w-md text-[15px] leading-[1.7] text-black/60 lg:text-[17px]">
          {t.intro}
        </p>
        <div className="mb-6 flex flex-wrap gap-1.5">
          {t.features.map((f) => (
            <span key={f} className="bg-black/[0.07] px-3.5 py-2 text-[13px] font-semibold text-black">
              {f}
            </span>
          ))}
        </div>
        <p className="mb-8 inline-flex items-center gap-2 border border-black/15 px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-black/45">
          <span className="h-1.5 w-1.5 rounded-full bg-orange" aria-hidden="true" />
          {t.soon}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://apps.apple.com/us/app/the-beach/id6759973444"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.94-.19 1.84-.86 3.19-.76 1.54.12 2.7.73 3.44 1.85-3.17 1.9-2.42 6.07.49 7.24-.6 1.5-1.36 2.98-2.2 3.84zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            {t.appStore}
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.thebeachvolleyclub.thebeach"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 border border-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4"><path d="M3.6 1.8 13.7 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1zm11.5 8.8L5.9 1.4l11.6 6.7-2.4 2.5zm3.2-2 2.9 1.7c.9.5.9 1.8 0 2.3l-2.9 1.7-2.7-2.9 2.7-2.8zM5.9 22.6l9.2-9.2 2.4 2.5-11.6 6.7z"/></svg>
            {t.googlePlay}
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="flex justify-center">
        <div className="flex h-[440px] w-[220px] items-center justify-center rounded-[32px] bg-black shadow-2xl shadow-black/20 lg:h-[520px] lg:w-[260px]">
          <div className="flex h-[412px] w-[194px] flex-col gap-2.5 overflow-hidden rounded-[24px] bg-[#1a1c11] px-4 pb-4 pt-8 lg:h-[490px] lg:w-[230px]">
            <div className="mb-1.5 font-display text-sm uppercase tracking-wide text-white/15">
              The Beach
            </div>
            {t.rows.map((r, i) => (
              <div
                key={i}
                className={`rounded-md px-3.5 py-3 text-[11px] font-semibold ${
                  r.hi
                    ? "bg-lime text-black"
                    : r.dim
                    ? "border border-dashed border-white/15 bg-transparent text-white/30"
                    : "bg-lime/[0.08] text-white/40"
                }`}
              >
                {r.label}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
