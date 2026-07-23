import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";

export default function ConferenceBand({ locale }: { locale: Locale }) {
  const t = eventsDict[locale];
  return (
    <section className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <Reveal>
        <div className="flex flex-col items-start gap-4 bg-mint p-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:p-11">
          <div>
            <h3 className="mb-1.5 font-display text-[22px] uppercase text-black lg:text-[28px]">
              {t.conference.title}
            </h3>
            <p className="max-w-xl text-sm leading-snug text-black/55">
              {t.conference.desc}
            </p>
          </div>
          <div className="shrink-0">
            <div className="font-display text-[28px] text-black lg:text-[32px]">
              {t.conference.price}{" "}
              <span className="text-[13px] font-normal text-black/40">
                {t.conference.unit}
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
