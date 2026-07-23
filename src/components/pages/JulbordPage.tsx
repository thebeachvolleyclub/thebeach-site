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
        <EventPhotoMarquee locale={locale} />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
            {t.punkter.map((p, i) => (
              <Reveal key={p.rubrik} delay={i * 0.06} className="border border-black/10 bg-white p-7 lg:p-10">
                <span className="mb-4 block font-display text-3xl text-black/15">0{i + 1}</span>
                <h3 className="mb-3 font-display text-2xl uppercase leading-none text-black lg:text-3xl">{p.rubrik}</h3>
                <p className="text-sm leading-relaxed text-black/55">{p.text}</p>
              </Reveal>
            ))}
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
