import Reveal from "@/components/Reveal";

type Row = {
  day: string;
  time: string;
  price: string;
};

const SCHEDULE: Row[] = [
  { day: "Måndag", time: "17:30–19:00", price: "4 295 kr" },
  { day: "Måndag", time: "19:00–20:30", price: "4 995 kr" },
  { day: "Måndag", time: "20:30–22:00", price: "4 295 kr" },
  { day: "Onsdag", time: "19:00–20:30", price: "4 995 kr" },
  { day: "Onsdag", time: "20:30–22:00", price: "4 295 kr" },
  { day: "Söndag", time: "12:00–13:30 / 13:30–15:00", price: "3 995 kr" },
  { day: "Söndag", time: "17:00–18:30 / 18:30–20:00", price: "4 295 kr" },
];

const FAKTA = [
  { v: "15 pass", d: "varav en Gameday · sista pass 9 dec" },
  { v: "23 aug", d: "grupperna publiceras senast" },
  { v: "−20 %", d: "för dig under 26 år" },
];

export default function TrainingGroups() {
  return (
    <section
      id="traningsgrupper"
      className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          <p className="eyebrow mb-4">Höstsäsong 2026</p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
            Träningsgrupper
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/45">
            För dig som gått fortsättningskursen eller har motsvarande vana.
            Huvudtränare Mattias Magnusson och tränarteamet sätter ihop jämna
            grupper — placeringen utgår främst från din nivå, och dina
            önskemål om dagar, tider och kompisar vägs in. Start: söndagar
            30 aug, måndagar 31 aug och onsdagar vecka 36.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          {FAKTA.map((f) => (
            <div key={f.v} className="flex items-center gap-3">
              <span className="font-display text-xl text-lime">{f.v}</span>
              <span className="text-sm text-bone/50">{f.d}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Schedule table */}
      <Reveal>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Träningsgrupper höstsäsong 2026 — dag, tid och pris
            </caption>
            <thead>
              <tr className="border-b border-line bg-black">
                <th
                  scope="col"
                  className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40"
                >
                  Dag
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40"
                >
                  Tid
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-lime"
                >
                  Pris (15 pass)
                </th>
              </tr>
            </thead>
            <tbody>
              {SCHEDULE.map((row, i) => (
                <tr
                  key={`${row.day}-${row.time}`}
                  className={`border-b border-line text-sm ${
                    i % 2 === 0 ? "bg-panel" : "bg-black"
                  }`}
                >
                  <td className="px-5 py-4 font-semibold text-bone">
                    {row.day}
                  </td>
                  <td className="px-5 py-4 text-bone/60">{row.time}</td>
                  <td className="px-5 py-4 text-right font-bold text-lime">
                    {row.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* Notes band */}
      <Reveal delay={0.1}>
        <div className="mt-6 flex flex-col gap-4 border border-line bg-black p-6 sm:flex-row sm:items-start sm:gap-10 lg:p-8">
          <div className="flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
              Ungdomsrabatt
            </p>
            <p className="text-sm leading-relaxed text-bone/60">
              20% rabatt för spelare födda 2001 eller senare.
            </p>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
              Anmälan
            </p>
            <p className="text-sm leading-relaxed text-bone/60">
              Öppnar <strong className="text-bone">1 augusti kl 20:00</strong>.
              Vill du träna med kompisar? Ni placeras i gruppen som matchar den i gänget med lägst nivå — nivån är alltid huvudregeln. Markera alla tider du kan i formuläret, så ökar chansen till två eller tre pass i veckan. Anmälan är bindande — läs <a href="/avanmalan" className="text-bone underline underline-offset-4 transition-colors hover:text-lime">villkor &amp; avanmälan</a>. Redan med i en grupp och vill byta? Gör en <a href="/andringsanmalan" className="text-bone underline underline-offset-4 transition-colors hover:text-lime">ändringsanmälan</a>.
            </p>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
              Frågor
            </p>
            <p className="text-sm leading-relaxed text-bone/60">
              <a
                href="mailto:traning@thebeach.one"
                className="text-bone underline underline-offset-4 transition-colors hover:text-lime"
              >
                traning@thebeach.one
              </a>
            </p>
          </div>
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal delay={0.15} className="mt-10">
        <a
          href="/anmalan"
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
        >
          Till anmälan — öppnar 1 aug 20:00 <span aria-hidden="true">→</span>
        </a>
      </Reveal>
    </section>
  );
}
