import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SolarStats from "@/components/SolarStats";
import type { Locale } from "@/lib/i18n";
import { hallbarhetDict } from "@/lib/i18n/hallbarhet";

// Sätts när grundarfotot (Årets Företagare) finns i public/media.
const FOUNDER_PHOTO: string | null = "/media/uploads/2026/07/mattiasochdavid-7a71da4582.jpg";

export default function HallbarhetPage({ locale }: { locale: Locale }) {
  const t = hallbarhetDict[locale];
  const cta = (
    <Link
      href={t.requestHref}
      className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
    >
      {t.hero.cta} <span aria-hidden="true">→</span>
    </Link>
  );

  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <PageHero
          eyebrow={t.hero.eyebrow}
          title={<>{t.hero.titlePre}<span className="italic-accent">{t.hero.titleAccent}</span>{t.hero.titlePost}</>}
          intro={t.hero.intro}
          cta={cta}
        />

        {/* Miljö */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-5">
              <p className="eyebrow mb-4" style={{ color: "#639922" }}>{t.miljo.eyebrow}</p>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                {t.miljo.title}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-[17px] leading-relaxed text-black/70">
                {t.miljo.body}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Live-siffror */}
        <SolarStats compact locale={locale} />

        {/* Socialt */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-5">
              <p className="eyebrow mb-4" style={{ color: "#639922" }}>{t.socialt.eyebrow}</p>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                {t.socialt.title}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-[17px] leading-relaxed text-black/70">
                {t.socialt.body}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Grundare / långsiktighet */}
        <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <p className="eyebrow mb-4">{t.grundare.eyebrow}</p>
              <h2 className="mb-5 font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-bone">
                {t.grundare.title}
              </h2>
              <p className="mb-6 text-[17px] leading-relaxed text-bone/60">
                {t.grundare.body}
              </p>
              <p className="inline-flex items-center gap-3 border border-lime/40 bg-lime/10 px-5 py-3 text-sm font-semibold text-lime">
                {t.grundare.award}
              </p>
              <div className="mt-8">
                <img src="/media/svenska-volleyboll.svg" alt={t.grundare.logoAlt} className="h-10 w-auto" />
              </div>
            </Reveal>
            {FOUNDER_PHOTO ? (
              <Reveal delay={0.08}>
                <img
                  src={FOUNDER_PHOTO}
                  alt={t.grundare.fotoAlt}
                  className="w-full border border-white/10 object-cover"
                />
              </Reveal>
            ) : null}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-lime px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto flex max-w-[1500px] flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <Reveal>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                {t.cta.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">
                {t.cta.body}
              </p>
            </Reveal>
            <Reveal delay={0.06} className="shrink-0">
              <Link
                href={t.requestHref}
                className="inline-flex cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                {t.cta.button} <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
