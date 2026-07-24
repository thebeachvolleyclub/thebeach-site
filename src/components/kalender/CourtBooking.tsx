import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { kalenderDict } from "@/lib/i18n/kalender";

/**
 * Boka bana — court booking info with price tiers.
 * Light (cream) section. Uses a real <table> for the price grid (a11y).
 * Prices sourced from thebeach.se — do not edit without confirmation.
 */

export default function CourtBooking({ locale }: { locale: Locale }) {
  const t = kalenderDict[locale].booking;
  const bookExt = t.bookHref.startsWith("http");
  return (
    <section
      id="boka-bana"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override: lime fails contrast on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.title1}
            <br />
            {t.title2}
          </h2>
        </div>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
            {t.lead}
          </p>
          <a
            href={t.bookHref}
            {...(bookExt ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-black bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:bg-black/80"
          >
            {t.bookLabel} <span aria-hidden="true">→</span>
          </a>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
        {/* Price table */}
        <Reveal className="overflow-hidden border border-black/10 bg-white">
          <div className="border-b border-black/10 px-6 py-4 lg:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">
              {t.tableTitle}
            </p>
          </div>
          <table className="w-full border-collapse">
            <caption className="sr-only">
              {t.tableCaption}
            </caption>
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th
                  scope="col"
                  className="py-3 pl-6 pr-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-black/40 lg:pl-8"
                >
                  {t.thTime}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-black/40"
                >
                  {t.thNonMember}
                </th>
                <th
                  scope="col"
                  className="py-3 pl-4 pr-6 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-black/70 lg:pr-8"
                >
                  {t.thMember}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row, i) => (
                <tr
                  key={row.time}
                  className={i < t.rows.length - 1 ? "border-b border-black/10" : ""}
                >
                  <td className="py-4 pl-6 pr-4 text-sm font-semibold text-black lg:pl-8">
                    {row.time}
                    <span className="mt-0.5 block text-[11px] font-normal leading-snug text-black/35">
                      {row.note}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-black/50">
                    {row.nonMember}
                  </td>
                  <td className="py-4 pl-4 pr-6 text-sm font-bold text-black lg:pr-8">
                    {row.member}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* Booking rules */}
        <Reveal delay={0.08} className="flex flex-col gap-0.5">
          {/* Standard booking */}
          <div className="flex-1 border border-black/10 bg-white p-6 lg:p-8">
            <h3 className="mb-3 font-display text-xl uppercase leading-none text-black lg:text-2xl">
              {t.standard.title}
            </h3>
            <ul className="border-t border-black/10">
              {t.standard.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 border-b border-black/10 py-2.5 text-xs leading-snug text-black/55"
                >
                  <span
                    className="shrink-0 pt-0.5 text-black/30"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pre-booking */}
          <div className="flex-1 border border-black/10 bg-white p-6 lg:p-8">
            <h3 className="mb-3 font-display text-xl uppercase leading-none text-black lg:text-2xl">
              {t.prebook.title}
            </h3>
            <p className="mb-3 text-[13px] leading-snug text-black/50">
              {t.prebook.pre}
              <a
                href={`mailto:${t.prebook.email}`}
                className="font-semibold text-black underline underline-offset-2 hover:text-black/60"
              >
                {t.prebook.email}
              </a>
              {t.prebook.post}
            </p>
          </div>

          {/* Subscription */}
          <div className="flex-1 border border-black/10 bg-white p-6 lg:p-8">
            <h3 className="mb-3 font-display text-xl uppercase leading-none text-black lg:text-2xl">
              {t.subscription.title}
            </h3>
            <p className="text-[13px] leading-snug text-black/50">
              {t.subscription.body}
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-0.5 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        <div className="border border-black/10 bg-white p-6 lg:p-8">
          <h3 className="mb-2 font-display text-lg uppercase leading-none text-black">{t.membershipBox.title}</h3>
          <p className="text-[13px] leading-snug text-black/50">
            {t.membershipBox.pre}
            <a href={t.membershipBox.linkHref} className="font-semibold text-black underline underline-offset-2 hover:text-black/60">{t.membershipBox.linkLabel}</a>{t.membershipBox.post}
          </p>
        </div>
        <div className="border border-black/10 bg-white p-6 lg:p-8">
          <h3 className="mb-2 font-display text-lg uppercase leading-none text-black">{t.schoolBox.title}</h3>
          <p className="text-[13px] leading-snug text-black/50">
            {t.schoolBox.pre}
            <a href={t.schoolBox.linkHref} className="font-semibold text-black underline underline-offset-2 hover:text-black/60">{t.schoolBox.linkLabel}</a>{t.schoolBox.post}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
