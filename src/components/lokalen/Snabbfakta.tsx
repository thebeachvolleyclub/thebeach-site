import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { lokalenDict } from "@/lib/i18n/lokalen";

/** Faktarutan — som i en bostadsannons: allt en bokare behöver på en skärm. */
export default function Snabbfakta({ locale = "sv" }: { locale?: Locale } = {}) {
  const t = lokalenDict[locale].snabbfakta;
  return (
    <section id="fakta" className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/40">{t.eyebrow}</p>
          <h2 className="mb-10 font-display text-[clamp(2rem,7vw,3.25rem)] uppercase leading-[0.95] tracking-[-0.02em] text-white">
            {t.title}
          </h2>
        </Reveal>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
          {t.fakta.map((f) => (
            <div key={f.etikett} className="border-t border-white/15 pt-4">
              <dt className="mb-1 text-[0.7rem] uppercase tracking-[0.16em] text-white/40">{f.etikett}</dt>
              <dd className="text-base leading-snug text-white lg:text-lg">{f.varde}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
