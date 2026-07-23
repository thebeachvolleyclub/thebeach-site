import Image from "next/image";
import Reveal from "@/components/Reveal";
import { YTOR, HAR_PLANLOSNING } from "@/lib/lokalen";
import type { Locale } from "@/lib/i18n";
import { lokalenDict } from "@/lib/i18n/lokalen";

/**
 * Planlösningen — skalenlig ritning över hela anläggningen.
 * Nästa steg: klickbara zoner som filtrerar galleriet på vald yta.
 */
export default function Planlosning({ locale = "sv" }: { locale?: Locale } = {}) {
  const t = lokalenDict[locale].planlosning;
  const ytor = lokalenDict[locale].ytor;
  return (
    <section id="planlosning" className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">{t.eyebrow}</p>
          <h2 className="mb-5 font-display text-[clamp(2rem,7vw,3.25rem)] uppercase leading-[0.95] tracking-[-0.02em] text-black">
            {t.title}
          </h2>
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-black/60 lg:text-base">
            {t.lead}
          </p>
        </Reveal>

        {HAR_PLANLOSNING ? (
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-[#faf7f0]">
            <Image
              src="/media/lokalen/planlosning.webp"
              alt={t.planAlt}
              width={1526}
              height={1700}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 1100px"
            />
          </div>
        ) : null}

        <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {YTOR.map((y) => {
            const yt = ytor[y.key];
            return (
              <li key={y.key} className="border-t border-black/15 pt-4">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-base font-semibold text-black">{yt.namn}</span>
                  {yt.banor ? <span className="text-sm text-black/50">{yt.banor}</span> : null}
                </div>
                {yt.matt || yt.kvm ? (
                  <p className="mb-1 text-sm text-black/70">
                    {[yt.matt, yt.kvm].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                {yt.nedgang ? (
                  <p className="mb-1 text-sm text-black/70">{yt.nedgang}</p>
                ) : null}
                <p className="text-xs leading-relaxed text-black/45">{yt.beskrivning}</p>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-black/40">
          {t.footnote}
        </p>
      </div>
    </section>
  );
}
