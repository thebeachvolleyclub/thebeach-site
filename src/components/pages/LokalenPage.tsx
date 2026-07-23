import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import EventCTA from "@/components/events/EventCTA";
import Snabbfakta from "@/components/lokalen/Snabbfakta";
import Planlosning from "@/components/lokalen/Planlosning";
import Galleri from "@/components/lokalen/Galleri";
import Filmer from "@/components/lokalen/Filmer";
import { HERO } from "@/lib/lokalen";
import type { Locale } from "@/lib/i18n";
import { lokalenDict } from "@/lib/i18n/lokalen";
import { eventsDict } from "@/lib/i18n/events";

/** JSON-LD — beskrivningen ur ordboken, kapacitet/adress är låsta fakta. */
function lokalenLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "The Beach",
    description: lokalenDict[locale].jsonldDescription,
    maximumAttendeeCapacity: 900,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Novavägen 35",
      addressLocality: "Huddinge",
      addressCountry: "SE",
    },
    url: locale === "en" ? "https://thebeach.one/en/venue" : "https://thebeach.one/lokalen",
  };
}

export default function LokalenPage({ locale }: { locale: Locale }) {
  const t = lokalenDict[locale];
  return (
    <>
      <JsonLd data={lokalenLd(locale)} />
      <Navbar locale={locale} />
      <main className="flex-1">
        <section className="relative min-h-[70svh] w-full overflow-hidden bg-black">
          <Image src={HERO.fil} alt={HERO.alt} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/35" />
          <div className="relative z-10 flex min-h-[70svh] flex-col justify-end px-5 pb-14 sm:px-8 lg:px-14 lg:pb-20">
            <div className="mx-auto w-full max-w-6xl">
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-lime">{t.hero.eyebrow}</p>
              <h1 className="mb-5 max-w-3xl font-display text-[clamp(2.5rem,11vw,5.5rem)] uppercase leading-[0.88] tracking-[-0.02em] text-white">
                {t.hero.titleTop}
                <br />
                <span className="italic-accent">{t.hero.titleAccent}</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-white lg:text-[1.0625rem]">
                {t.hero.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`#${eventsDict[locale].cta.sectionId}`} className="rounded-full bg-lime px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">
                  {t.hero.ctaTour}
                </a>
                <a href="#planlosning" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white">
                  {t.hero.ctaPlan}
                </a>
              </div>
            </div>
          </div>
        </section>

        <Snabbfakta locale={locale} />
        <Planlosning locale={locale} />
        <Galleri locale={locale} />
        <Filmer locale={locale} />

        <section className="bg-sand px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">{t.planners.eyebrow}</p>
              <h2 className="mb-10 font-display text-[clamp(2rem,7vw,3.25rem)] uppercase leading-[0.95] tracking-[-0.02em] text-black">
                {t.planners.title}
              </h2>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {t.planners.argument.map((k) => (
                <div key={k.rubrik} className="border-t border-black/15 pt-4">
                  <h3 className="mb-2 text-base font-semibold text-black">{k.rubrik}</h3>
                  <p className="text-sm leading-relaxed text-black/60">{k.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <EventCTA locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
