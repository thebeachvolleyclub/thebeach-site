import Reveal from "@/components/Reveal";

const PRICE_TABLE = [
  { name: "Las Palmas", eve: "745 kr", day: "670 kr" },
  { name: "Algarve", eve: "945 kr", day: "850 kr" },
  { name: "Miami", eve: "1 195 kr", day: "1 075 kr" },
];

export default function DayBand() {
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
            <p className="eyebrow mb-4">Vardag dagtid</p>
            <h2 className="mb-5 font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.92] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Fyll dagen,{" "}
              <span className="italic-accent">spara 10%</span>
            </h2>
            <p className="mb-4 max-w-lg text-[0.95rem] leading-relaxed text-bone/50">
              Samma upplevelse, lägre pris. Kör ni på en vardag dagtid får ni
              10% rabatt på alla tre nivåerna — med lunch i stället för middag.
              Gjort för konferens, team-building och kommun/region som vill ha
              en aktiv dag tillsammans.
            </p>
            <p className="text-sm font-semibold text-lime">
              Kombinera med konferens på förmiddagen — hela dagen på ett ställe.
            </p>
          </div>

          {/* Price table */}
          <div className="overflow-hidden border border-line">
            <table className="w-full border-collapse">
              <caption className="sr-only">
                Prisjämförelse kväll vs dagtid per eventnivå
              </caption>
              <thead>
                <tr className="border-b border-line bg-panel">
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40"
                  >
                    Nivå
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40"
                  >
                    Kväll
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-lime"
                  >
                    Dagtid
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICE_TABLE.map((row, i) => (
                  <tr
                    key={row.name}
                    className={`text-sm ${
                      i < PRICE_TABLE.length - 1 ? "border-b border-line" : ""
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
