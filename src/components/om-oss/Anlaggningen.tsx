import Reveal from "@/components/Reveal";

const FACTS = [
  { label: "Inomhusbanor", value: "10" },
  { label: "Utomhusbanor", value: "7" },
  { label: "Totalt", value: "17 banor" },
  { label: "Öppnat", value: "Hösten 2022" },
  { label: "Max per bana", value: "8 spelare" },
  { label: "Bokningstid", value: "1,5 h / slot" },
];

const HOURS = [
  { day: "Måndag–fredag", time: "10:00–22:00" },
  { day: "Lördag", time: "09:00–21:00" },
  { day: "Söndag", time: "09:00–21:30" },
];

export default function Anlaggningen() {
  return (
    <section
      id="anlaggningen"
      className="relative overflow-hidden bg-mint px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Light topo decoration on mint */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="#14160f" strokeWidth="1.3">
          <path d="M0 80 Q300 40 600 80 T1200 80" />
          <path d="M0 150 Q300 110 600 150 T1200 150" />
          <path d="M0 220 Q300 180 600 220 T1200 220" />
          <path d="M0 300 Q300 260 600 300 T1200 300" />
          <path d="M0 370 Q300 330 600 370 T1200 370" />
        </g>
      </svg>

      <div className="relative">
        {/* Header */}
        <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
          <div>
            {/* eyebrow override on mint — .eyebrow hard-codes lime, fails contrast */}
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              Novavägen 35, Huddinge
            </p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              Anläggningen
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-black/55 sm:text-right">
            Tio inomhusbanor håller sanden varm året runt. När sommarvärmen
            slår till öppnas portarna till sju utomhusbanor. Samma strandsand,
            oavsett månad.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
          {/* Fact grid */}
          <Reveal className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
            <h3 className="mb-5 font-display text-2xl uppercase leading-none text-black">
              Fakta
            </h3>
            <ul className="border-t border-black/10">
              {FACTS.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center justify-between border-b border-black/10 py-3 text-sm"
                >
                  <span className="text-black/55">{f.label}</span>
                  <span className="font-semibold text-black">{f.value}</span>
                </li>
              ))}
              <li className="flex items-center justify-between py-3 text-sm">
                <span className="text-black/55">Adress</span>
                <span className="font-semibold text-black">
                  Novavägen 35, 141 44 Huddinge
                </span>
              </li>
            </ul>
            {/* TODO(operator): full amenity list (dusch, parkering, café) */}
          </Reveal>

          {/* Opening hours table */}
          <Reveal delay={0.08} className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
            <h3 className="mb-5 font-display text-2xl uppercase leading-none text-black">
              Öppettider
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  The Beach öppettider per veckodag
                </caption>
                <thead>
                  <tr className="border-b border-black/10">
                    <th
                      scope="col"
                      className="py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40"
                    >
                      Dag
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-black/40"
                    >
                      Tid
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((row, i) => (
                    <tr
                      key={row.day}
                      className={`border-b border-black/10 text-sm ${
                        i % 2 === 0 ? "" : "bg-black/[0.02]"
                      }`}
                    >
                      <td className="py-3 text-black/60">{row.day}</td>
                      <td className="py-3 text-right font-semibold text-black">
                        {row.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Address note */}
            <div className="mt-6 flex items-start gap-3 border-t border-black/10 pt-5">
              <span className="shrink-0 text-black/30" aria-hidden="true">
                ↗
              </span>
              <p className="text-xs leading-snug text-black/50">
                Novavägen 35, 141 44 Huddinge
                {/* TODO(operator): confirm transport time / "15 min från Stockholm" before adding */}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
