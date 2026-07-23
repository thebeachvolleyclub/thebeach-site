import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";

export default function DayBand({ locale }: { locale: Locale }) {
  const t = eventsDict[locale];
  return (
    <section className="relative overflow-hidden bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      {/* Topo lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="#D8FF77" strokeWidth="1.3">
          <path d="M0 80 Q300 40 600 80 T1200 80" />
          <path d="M0 140 Q300 100 600 140 T1200 140" />
          <path d="M0 200 Q300 160 600 200 T1200 200" />
          <path d="M0 260 Q300 220 600 260 T1200 260" />
          <path d="M0 320 Q300 280 600 320 T1200 320" />
        </g>
      </svg>

      <div className="relative">
        <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Copy */}
          <div>
            <p className="eyebrow mb-4">{t.dayband.eyebrow}</p>
            <h2 className="mb-5 font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.92] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              {t.dayband.titleTop}{" "}
              <span className="italic-accent">{t.dayband.titleAccent}</span>
            </h2>
            <p className="mb-4 max-w-lg text-[0.95rem] leading-relaxed text-bone/50">
              {t.dayband.lead}
            </p>
            <p className="text-sm font-semibold text-lime">
              {t.dayband.combo}
            </p>
          </div>

          {/* Price table */}
          <div className="overflow-hidden border border-line">
            <table className="w-full border-collapse">
              <caption className="sr-only">
                {t.dayband.caption}
              </caption>
              <thead>
                <tr className="border-b border-line bg-panel">
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40"
                  >
                    {t.dayband.colTier}
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40"
                  >
                    {t.dayband.colEve}
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-lime"
                  >
                    {t.dayband.colDay}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.dayband.rows.map((row, i) => (
                  <tr
                    key={row.name}
                    className={`text-sm ${
                      i < t.dayband.rows.length - 1 ? "border-b border-line" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-semibold text-bone">
                      {row.name}
                    </td>
                    <td className="px-5 py-4 text-bone/50">{row.eve}</td>
                    <td className="px-5 py-4 font-bold text-lime">{row.day}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
