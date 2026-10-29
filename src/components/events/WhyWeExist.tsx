import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";

/** "Därför finns vi" — idrotten först. Lugn textsektion direkt under paketen på
 *  /events. Inga bilder (medvetet), bara eyebrow + rubrik + text i samma
 *  formspråk som EventPaths (cream). */
export default function WhyWeExist({ locale }: { locale: Locale }) {
  const t = eventsDict[locale].why;
  return (
    <section id="darfor" className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1500px] lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal>
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,8vw,3.25rem)] leading-[0.95] text-black lg:text-[clamp(2.5rem,4.5vw,4rem)]">
            {t.title}
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="mt-8 border-t border-black/10 pt-8 lg:mt-0 lg:border-t-0 lg:border-l lg:pl-16 lg:pt-2">
          <p className="max-w-2xl text-[17px] leading-relaxed text-black/70">
            {t.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
