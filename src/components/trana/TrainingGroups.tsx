import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";

export default function TrainingGroups({ locale }: { locale: Locale }) {
  const t = tranaDict[locale].groups;
  return (
    <section
      id="traningsgrupper"
      className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.title}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/45">
            {t.lead}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          {t.fakta.map((f) => (
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
              {t.tableCaption}
            </caption>
            <thead>
              <tr className="border-b border-line bg-black">
                <th
                  scope="col"
                  className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40"
                >
                  {t.thDay}
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40"
                >
                  {t.thTime}
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-lime"
                >
                  {t.thPrice}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.schedule.map((row, i) => (
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
              {t.youth.title}
            </p>
            <p className="text-sm leading-relaxed text-bone/60">
              {t.youth.body}
            </p>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
              {t.signup.title}
            </p>
            <p className="text-sm leading-relaxed text-bone/60">
              {t.signup.body1}<strong className="text-bone">{t.signup.strong}</strong>{t.signup.body2}<a href="/avanmalan" className="text-bone underline underline-offset-4 transition-colors hover:text-lime">{t.signup.termsLabel}</a>{t.signup.body3}<a href="/andringsanmalan" className="text-bone underline underline-offset-4 transition-colors hover:text-lime">{t.signup.changeLabel}</a>{t.signup.body4}
            </p>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
              {t.questionsTitle}
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
          {t.cta} <span aria-hidden="true">→</span>
        </a>
      </Reveal>
    </section>
  );
}
