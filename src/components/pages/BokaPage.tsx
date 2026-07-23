import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import BookingWidget from "@/components/booking/BookingWidget";
import type { Locale } from "@/lib/i18n";
import { bokaDict } from "@/lib/i18n/boka";

export default function BokaPage({ locale }: { locale: Locale }) {
  const t = bokaDict[locale];
  return <>
    <Navbar locale={locale} />
    <main className="flex-1">
      <PageHero minH="min-h-[52svh]" eyebrow={t.hero.eyebrow} title={<>{t.hero.titleTop}<br /><span className="italic-accent">{t.hero.titleAccent}</span></>} intro={t.hero.intro} cta={<a href="#bokning" className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright">{t.hero.cta} <span aria-hidden="true">↓</span></a>} />

      <section id="bokning" className="scroll-mt-8 bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <Reveal className="mb-9 border-b border-black/10 pb-8 text-black lg:mb-12">
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">{t.direct.eyebrow}</p>
          <h2 className="font-display text-[clamp(2.3rem,8vw,5rem)] leading-[0.9]">{t.direct.title}</h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/55">{t.direct.lead}</p>
        </Reveal>
        <BookingWidget locale={locale} />
      </section>

      <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <Reveal className="mb-10"><p className="eyebrow mb-4">{t.steps.eyebrow}</p><h2 className="font-display text-[clamp(2.25rem,9vw,4.5rem)] text-bone">{t.steps.title}</h2></Reveal>
        <div className="grid gap-0.5 lg:grid-cols-3">{t.steps.items.map((step, index) => <Reveal key={step.title} delay={index * 0.06} className="border border-white/10 bg-white/[0.03] p-7 lg:p-9"><span className="mb-4 block font-display text-3xl text-lime/40">0{index + 1}</span><h3 className="mb-3 font-display text-2xl text-bone">{step.title}</h3><p className="text-sm leading-relaxed text-bone/55">{step.text}</p></Reveal>)}</div>
      </section>

      <section className="bg-mint px-5 py-14 text-black sm:px-8 lg:px-14 lg:py-20"><div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between"><Reveal><h2 className="mb-2 font-display text-[clamp(1.75rem,7vw,2.75rem)]">{t.mint.title}</h2><p className="max-w-xl text-sm leading-relaxed text-black/50">{t.mint.lead}</p></Reveal><Reveal delay={0.06} className="flex flex-wrap gap-3"><Link href={t.mint.ctaTrainHref} className="bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">{t.mint.ctaTrain}</Link><Link href={t.mint.ctaEventsHref} className="border border-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black">{t.mint.ctaEvents}</Link></Reveal></div></section>
    </main>
    <Footer locale={locale} />
  </>;
}
