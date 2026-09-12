import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PhotoBreak from "@/components/PhotoBreak";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { teneriffaDict } from "@/lib/i18n/teneriffa";

/** Teneriffa-bilder (Davids urval, sep 2026). Byt här, inte i ordboken. */
const U = "/media/uploads/2026/09/";
const PHOTO_BREAK = U + "teneriffa-hall-orig-ef4292f9a5.webp";
const GRID = [U + "teneriffa-laget-1f218dad8a.webp", U + "teneriffa-duo-c289a4e42a.webp", U + "teneriffa-set-e4b9fbe7f1.webp"];

const ctaLime =
  "inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright";

export default function TeneriffaPage({ locale }: { locale: Locale }) {
  const t = teneriffaDict[locale];
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <PageHero
          eyebrow={t.hero.eyebrow}
          title={<>{t.hero.titleTop}{" "}<br /><span className="italic-accent">{t.hero.titleAccent}</span></>}
          intro={t.hero.intro}
          cta={
            <>
              <Link href={t.requestHref} className={ctaLime}>
                {t.hero.cta} <span aria-hidden="true">→</span>
              </Link>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-bone/45">
                {t.pris.pris} {t.pris.per} · {t.fakta[1].value}
              </span>
            </>
          }
        />

        <PhotoBreak src={PHOTO_BREAK} alt={t.photo1.alt} kicker={t.photo1.kicker} caption={t.photo1.caption} />

        {/* Ingår + pris */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 max-w-2xl lg:mb-14">
            <p className="eyebrow eyebrow-ink mb-4">{t.ingar.eyebrow}</p>
            <h2 className="font-display text-4xl uppercase leading-[0.92] text-black sm:text-5xl lg:text-6xl">{t.ingar.rubrik}</h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
            {t.ingar.rader.map((r, i) => (
              <Reveal key={r.titel} delay={i * 0.05} className="border border-black/10 bg-white p-7 lg:p-8">
                <span className="mb-5 block font-display text-3xl leading-none text-black/20">0{i + 1}</span>
                <h3 className="mb-3 font-display text-2xl uppercase leading-none text-black">{r.titel}</h3>
                <p className="text-sm leading-relaxed text-black/60">{r.text}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-0.5 lg:mt-14 lg:grid-cols-5">
            <Reveal className="bg-lime p-8 lg:col-span-2 lg:p-11">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/50">{t.pris.label}</p>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="font-display text-6xl text-black lg:text-7xl">{t.pris.pris}</span>
                <span className="text-sm text-black/50">{t.pris.per}</span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-black/60">{t.pris.text}</p>
              <span className="mt-6 inline-block border border-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
                {t.pris.badge}
              </span>
            </Reveal>
            <div className="grid grid-cols-2 gap-0.5 lg:col-span-3">
              {t.fakta.map((f, i) => (
                <Reveal key={f.label} delay={0.06 + i * 0.04} className="flex flex-col justify-between bg-white p-6 lg:p-8">
                  <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.15em] text-black/40">{f.label}</p>
                  <p className="font-display text-2xl uppercase leading-none text-black lg:text-3xl">{f.value}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Så funkar det */}
        <section className="bg-black px-5 py-16 text-bone sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 max-w-2xl lg:mb-14">
            <p className="eyebrow mb-4">{t.steg.eyebrow}</p>
            <h2 className="font-display text-4xl uppercase leading-[0.92] sm:text-5xl lg:text-6xl">{t.steg.rubrik}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-3">
            {t.steg.rader.map((s, i) => (
              <Reveal key={s.titel} delay={i * 0.06} className="bg-black p-7 lg:p-10">
                <span className="mb-6 block font-display text-5xl leading-none text-lime">0{i + 1}</span>
                <h3 className="mb-3 font-display text-2xl uppercase leading-none">{s.titel}</h3>
                <p className="text-sm leading-relaxed text-bone/55">{s.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-10 lg:mt-14">
            <Link href={t.requestHref} className={ctaLime}>
              {t.hero.cta} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </section>

        {/* Bildrad */}
        <section className="grid grid-cols-1 gap-0.5 bg-cream sm:grid-cols-3">
          {GRID.map((src, i) => (
            <div key={src} className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
              <Image src={src} alt={t.bilder[i]?.alt ?? ""} fill className="object-cover" sizes="(min-width: 640px) 33vw, 100vw" />
            </div>
          ))}
        </section>

        {/* FAQ + outro */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-4">
              <h2 className="font-display text-4xl uppercase leading-[0.92] text-black sm:text-5xl">{t.faq.rubrik}</h2>
            </Reveal>
            <div className="lg:col-span-8">
              {t.faq.rader.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.04} className="border-t border-black/10 py-6">
                  <h3 className="mb-2 text-base font-bold text-black">{f.q}</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-black/60">{f.a}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1} className="mt-14 flex flex-col items-start gap-6 border-t border-black/10 pt-10 lg:mt-20 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="mb-3 font-display text-4xl uppercase leading-[0.92] text-black sm:text-5xl">{t.outro.rubrik}</h2>
              <p className="max-w-xl text-sm leading-relaxed text-black/50">{t.outro.text}</p>
            </div>
            <Link
              href={t.requestHref}
              className="shrink-0 cursor-pointer bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
            >
              {t.outro.cta} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
