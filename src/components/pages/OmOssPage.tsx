import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SolarStats from "@/components/SolarStats";
import type { Locale } from "@/lib/i18n";
import { omOssDict } from "@/lib/i18n/om-oss";

export default function OmOssPage({ locale }: { locale: Locale }) {
  const t = omOssDict[locale];
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
              href={t.hero.ctaHref}
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              {t.hero.cta} <span aria-hidden="true">→</span>
            </a>
          }
        />

        {/* Milstolpar */}
        {/* Timeline dold under Ad Grants-granskning (3 dagar) — återställ: byt false→true */}
        {false && (
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              {t.resan.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              {t.resan.title}
            </h2>
          </Reveal>
          <div className="mx-auto max-w-3xl">
            {t.resan.milstolpar.map((m, i) => (
              <Reveal key={m.ar} delay={i * 0.04} className="flex items-start gap-6 border-b border-black/[0.07] py-5">
                <span className="w-16 shrink-0 font-display text-2xl text-black lg:text-3xl">{m.ar}</span>
                <p className="pt-1 text-[15px] leading-relaxed text-black/60">{m.text}</p>
              </Reveal>
            ))}
          </div>
        </section>
        )}

        {/* Teamet */}
        <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">{t.team.eyebrow}</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              {t.team.title1}<br />{t.team.title2}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
            {t.team.personer.map((p, i) => (
              <Reveal key={p.namn} delay={i * 0.06} className="flex flex-col border border-white/10 bg-white/[0.03] p-7 lg:p-8">
                <h3 className="font-display text-2xl uppercase leading-none text-bone">{p.namn}</h3>
                <p className="mb-3 mt-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-lime">{p.roll}</p>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-bone/55">{p.desc}</p>
                <a href={`mailto:${p.kontakt}`} className="text-[13px] font-semibold text-bone/80 underline-offset-4 hover:underline">
                  {p.kontakt}
                </a>
                {p.tel && p.telHref ? (
                  <a href={p.telHref} className="mt-1 block text-[13px] text-bone/45 underline-offset-4 hover:underline">{p.tel}</a>
                ) : null}
                {p.notis ? <p className="mt-2 text-[11px] leading-snug text-bone/30">{p.notis}</p> : null}
              </Reveal>
            ))}
          </div>
        </section>

        {/* SolarStats är sv-hårdkodad (ingen locale-prop ännu) och fanns aldrig på en-sidan */}
        {locale === "sv" ? <SolarStats /> : null}

        {/* Hitta hit + kontakt */}
        <section id={t.hitta.sectionId} className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
                {t.hitta.eyebrow}
              </p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black">
                {t.hitta.title1}<br />{t.hitta.title2}
              </h2>
              <p className="mb-6 max-w-md text-[15px] leading-relaxed text-black/60">
                {t.hitta.text}
              </p>
              <a
                href="https://maps.google.com/?q=The+Beach+Novav%C3%A4gen+35+Huddinge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                {t.hitta.mapsCta} <span aria-hidden="true">→</span>
              </a>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
                {t.kontakt.eyebrow}
              </p>
              <div className="flex flex-col divide-y divide-black/10 bg-white/40">
                {t.kontakt.rader.map((r) => (
                  <a key={r.label} href={r.href} className="flex items-center justify-between p-5 transition-colors hover:bg-white/60">
                    <span className="text-sm font-semibold text-black/70">{r.label}</span>
                    <span className="font-display text-lg text-black">{r.value}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
