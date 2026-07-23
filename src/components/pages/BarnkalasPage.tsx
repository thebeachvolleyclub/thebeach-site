import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { barnkalasDict } from "@/lib/i18n/barnkalas";

export default function BarnkalasPage({ locale }: { locale: Locale }) {
  const t = barnkalasDict[locale];
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <PageHero
          eyebrow={t.hero.eyebrow}
          title={<>{t.hero.titleTop}<br /><span className="italic-accent">{t.hero.titleAccent}</span></>}
          intro={t.hero.intro}
          cta={
            <Link
              href={t.requestHref}
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              {t.hero.cta} <span aria-hidden="true">→</span>
            </Link>
          }
        />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
            {t.fakta.map((f, i) => (
              <Reveal key={f.rubrik} delay={i * 0.05} className="border border-black/10 bg-white p-7 lg:p-8">
                <h3 className="mb-4 font-display text-2xl uppercase leading-none text-black">{f.rubrik}</h3>
                <ul className="space-y-2">
                  {f.rader.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm leading-snug text-black/60">
                      <span className="shrink-0 pt-0.5 opacity-40">↗</span>{r}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          {/* Pris */}
          <div className="mt-10 grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:mt-14">
            <Reveal className="bg-lime p-8 lg:p-11">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/50">{t.pris.med.label}</p>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="font-display text-5xl text-black">{t.pris.med.pris}</span>
                <span className="text-sm text-black/50">{t.pris.med.per}</span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-black/60">
                {t.pris.med.text}
              </p>
            </Reveal>
            <Reveal delay={0.06} className="bg-white p-8 lg:p-11">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/40">{t.pris.utan.label}</p>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="font-display text-5xl text-black">{t.pris.utan.pris}</span>
                <span className="text-sm text-black/40">{t.pris.utan.per}</span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-black/50">
                {t.pris.utan.text}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-10 flex flex-col items-start gap-4 border-t border-black/10 pt-8 lg:mt-14 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-black/40">
              {t.outro.text}
            </p>
            <Link
              href={t.requestHref}
              className="shrink-0 cursor-pointer bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
            >
              {t.outro.cta}
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
