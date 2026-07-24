import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { foreningenDict } from "@/lib/i18n/foreningen";

const MATCHI = "https://www.matchi.se/facilities/thebeach";

export default function ForeningenPage({ locale }: { locale: Locale }) {
  const t = foreningenDict[locale];
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <PageHero
          eyebrow={t.hero.eyebrow}
          title={<>{t.hero.title1}<br /><span className="italic-accent">{t.hero.titleAccent}</span></>}
          intro={t.hero.intro}
          cta={
            <a href={MATCHI} target="_blank" rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright">
              {t.hero.cta} <span aria-hidden="true">→</span>
            </a>
          }
        />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">{t.medlem.eyebrow}</p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black">
                {t.medlem.title1}<br />{t.medlem.title2}
              </h2>
              <p className="mb-6 max-w-md text-[15px] leading-relaxed text-black/55">{t.medlem.intro}</p>
              <div className="flex flex-wrap gap-3">
                <a href={MATCHI} target="_blank" rel="noopener noreferrer"
                  className="cursor-pointer bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85">
                  {t.medlem.cta}
                </a>
              </div>
              <p className="mt-6 max-w-md text-[12px] leading-relaxed text-black/35">
                {t.medlem.fine1}
                <a href="https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black/60">Profixio</a>
                {t.medlem.fine2}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ul className="divide-y divide-black/10 border border-black/10 bg-white">
                {t.medlem.formaner.map((f) => (
                  <li key={f} className="flex items-start gap-3 p-5 text-[15px] leading-snug text-black/70">
                    <span className="shrink-0 pt-0.5 text-lime [text-shadow:0_0_1px_rgba(0,0,0,0.35)]" aria-hidden="true">↗</span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="tavla" className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">{t.tavla.eyebrow}</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              {t.tavla.title1}<br />{t.tavla.title2}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
            <Reveal className="border border-white/10 bg-white/[0.03] p-7 lg:p-10">
              <span className="mb-4 block font-display text-3xl text-lime/40">01</span>
              <h3 className="mb-3 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">{t.tavla.c1title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-bone/55">
                {t.tavla.c1body1}
                <a href={`mailto:${t.tavla.c1email}`} className="text-bone underline underline-offset-4">{t.tavla.c1email}</a>
                {t.tavla.c1body2}
              </p>
              <p className="text-[12px] leading-relaxed text-bone/35">{t.tavla.c1fine}</p>
            </Reveal>
            <Reveal delay={0.06} className="border border-white/10 bg-white/[0.03] p-7 lg:p-10">
              <span className="mb-4 block font-display text-3xl text-lime/40">02</span>
              <h3 className="mb-3 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">{t.tavla.c2title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-bone/55">{t.tavla.c2body}</p>
              <Link href={t.tavla.c2href} className="text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright">
                {t.tavla.c2link}
              </Link>
            </Reveal>
          </div>

          <div className="mt-0.5 grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
            {t.tavla.sbt.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05} className="border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <h4 className="mb-2 font-display text-xl uppercase text-lime">{s.n}</h4>
                <p className="text-[13px] leading-relaxed text-bone/55">{s.d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-10 border-t border-white/10 pt-8">
            <p className="max-w-2xl text-sm leading-relaxed text-bone/45">{t.tavla.footer}</p>
          </Reveal>
        </section>

        <section className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">{t.ungdom.eyebrow}</p>
              <h2 className="mb-4 font-display text-[clamp(2rem,8vw,3rem)] leading-[0.9] text-black">
                {t.ungdom.title1}<br />{t.ungdom.title2}
              </h2>
              <p className="mb-5 max-w-md text-[15px] leading-relaxed text-black/60">{t.ungdom.body}</p>
              <a href="https://www.svenskalag.se/thebeach" target="_blank" rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85">
                {t.ungdom.cta} <span aria-hidden="true">→</span>
              </a>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">{t.ungdom.histEyebrow}</p>
              <p className="max-w-md text-[15px] leading-relaxed text-black/60">{t.ungdom.histBody}</p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
