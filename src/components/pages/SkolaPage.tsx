import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SkolaFormClient from "@/components/skola/SkolaFormClient";
import type { Locale } from "@/lib/i18n";
import { skolaDict } from "@/lib/i18n/skola";

export default function SkolaPage({ locale }: { locale: Locale }) {
  const t = skolaDict[locale];
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <PageHero
          eyebrow={t.hero.eyebrow}
          title={<>{t.hero.titleTop}<br /><span className="italic-accent">{t.hero.titleAccent}</span></>}
          intro={t.hero.intro}
          cta={
            <a
              href="#forfragan"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              {t.hero.cta} <span aria-hidden="true">→</span>
            </a>
          }
        />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              {t.ingar.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              {t.ingar.title1}<br />{t.ingar.title2}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
            {t.ingar.items.map((f, i) => (
              <Reveal key={f} delay={i * 0.05} className="border border-black/10 bg-white p-6 lg:p-8">
                <span className="mb-3 block text-lime [text-shadow:0_0_1px_rgba(0,0,0,0.35)]" aria-hidden="true">↗</span>
                <p className="text-[15px] leading-snug text-black/70">{f}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">{t.priser.eyebrow}</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              {t.priser.title}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
            {t.priser.cards.map((p, i) => (
              <Reveal key={p.rubrik} delay={i * 0.06} className="flex flex-col border border-white/10 bg-white/[0.03] p-7 lg:p-10">
                <h3 className="mb-4 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">{p.rubrik}</h3>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-lime lg:text-5xl">{p.pris}</span>
                  <span className="text-[13px] text-bone/45">{p.enhet}</span>
                </div>
                <p className="text-sm leading-relaxed text-bone/55">{p.desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-8 border-l-2 border-lime/60 bg-white/[0.03] p-6 lg:p-8">
            <p className="max-w-3xl text-sm leading-relaxed text-bone/55">
              <strong className="text-bone/80">{t.priser.braAttVetaLabel}</strong> {t.priser.braAttVeta}
            </p>
          </Reveal>
        </section>

        <section id="forfragan" className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
                {t.forfragan.eyebrow}
              </p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black lg:text-[clamp(2.75rem,4.5vw,4.5rem)]">
                {t.forfragan.title1}<br />{t.forfragan.title2}
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-black/60">{t.forfragan.intro}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <SkolaFormClient locale={locale} />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
