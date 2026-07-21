import Image from "next/image";
import Reveal from "@/components/Reveal";
import { YTOR, HAR_PLANLOSNING } from "@/lib/lokalen";

/**
 * Planlösningen — skalenlig ritning över hela anläggningen.
 * Nästa steg: klickbara zoner som filtrerar galleriet på vald yta.
 */
export default function Planlosning() {
  return (
    <section id="planlosning" className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">Planlösning</p>
          <h2 className="mb-5 font-display text-[clamp(2rem,7vw,3.25rem)] uppercase leading-[0.95] tracking-[-0.02em] text-black">
            Hela ytan, uppifrån
          </h2>
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-black/60 lg:text-base">
            10 sandbanor inomhus och 7 utomhus, med bar och kök centralt placerade i mitten.
            Samtliga funktionsytor ligger en nivå högre än sandytorna — man kliver ner i sanden
            och upp till loungen.
          </p>
        </Reveal>

        {HAR_PLANLOSNING ? (
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-[#faf7f0]">
            <Image
              src="/media/lokalen/planlosning.webp"
              alt="Planlösning över The Beach: 10 sandbanor inomhus, 7 utomhus, bar, kök, omklädning och entré"
              width={1526}
              height={1700}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 1100px"
            />
          </div>
        ) : null}

        <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {YTOR.map((y) => (
            <li key={y.key} className="border-t border-black/15 pt-4">
              <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
                <span className="text-base font-semibold text-black">{y.namn}</span>
                {y.banor ? <span className="text-sm text-black/50">{y.banor}</span> : null}
              </div>
              {y.matt || y.kvm ? (
                <p className="mb-1 text-sm text-black/70">
                  {[y.matt, y.kvm].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              <p className="text-xs leading-relaxed text-black/45">{y.beskrivning}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-black/40">
          Mått och ytor är uppmätta ur ritningen och avrundade — hör av er så tar vi fram exakta
          siffror för just er uppställning.
        </p>
      </div>
    </section>
  );
}
