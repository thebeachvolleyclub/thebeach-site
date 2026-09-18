import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import EventPhotoMarquee from "@/components/events/EventPhotoMarquee";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { julbordDict } from "@/lib/i18n/julbord";

export default function JulbordPage({ locale }: { locale: Locale }) {
  const t = julbordDict[locale];
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <PageHero
          eyebrow={t.hero.eyebrow}
          title={<>{t.hero.titleTop}{" "}<br /><span className="italic-accent">{t.hero.titleAccent}</span></>}
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
        <EventPhotoMarquee locale={locale} />

        {/* Berättelsen */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <Reveal className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-black/70 lg:text-xl">{t.story}</p>
          </Reveal>
        </section>

        {/* Paketet + menyn */}
        <section className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-5">
            <Reveal className="border border-black/10 bg-cream p-7 lg:col-span-2 lg:p-10">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.12em] text-black/40">{t.paket.eyebrow}</span>
              <h2 className="font-display text-4xl uppercase leading-none text-black lg:text-5xl">{t.paket.namn}</h2>
              <p className="mt-4 font-display text-3xl text-black lg:text-4xl">
                {t.paket.pris} <span className="text-base font-sans normal-case text-black/50">{t.paket.prisSuffix}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm leading-relaxed text-black/70">
                {t.paket.ingar.map((rad) => (
                  <li key={rad} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-lime" />
                    <span>{rad}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-black/45">{t.paket.fotnot}</p>
            </Reveal>
            <Reveal delay={0.06} className="border border-black/10 bg-white p-7 lg:col-span-3 lg:p-10">
              <h3 className="mb-6 font-display text-2xl uppercase leading-none text-black lg:text-3xl">{t.paket.menyRubrik}</h3>
              <dl className="space-y-5">
                {t.paket.meny.map((m) => (
                  <div key={m.rubrik}>
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">{m.rubrik}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-black/70">{m.text}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Exklusivt */}
        <section className="bg-black px-5 py-16 text-cream sm:px-8 lg:px-14 lg:py-24">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl uppercase leading-none lg:text-5xl">{t.exklusivt.rubrik}</h2>
            <p className="mt-6 text-base leading-relaxed text-cream/80 lg:text-lg">{t.exklusivt.text}</p>
            <p className="mt-4 text-sm leading-relaxed text-cream/55">{t.exklusivt.villkor}</p>
          </Reveal>
        </section>

        {/* Outro */}
        <section className="bg-cream px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <Reveal className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-black/50">{t.outro.text}</p>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href={t.requestHref}
                className="cursor-pointer bg-black px-9 py-4 text-center text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                {t.outro.cta}
              </Link>
              <Link
                href={t.plannerHref}
                className="cursor-pointer border border-black px-9 py-4 text-center text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-lime"
              >
                {t.outro.ctaPlanera}
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
