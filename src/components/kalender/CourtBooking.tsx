import Reveal from "@/components/Reveal";

/**
 * Boka bana — court booking info with price tiers.
 * Light (cream) section. Uses a real <table> for the price grid (a11y).
 * Prices sourced from thebeach.se — do not edit without confirmation.
 */

const PRICE_ROWS = [
  { time: "Dagtid",     note: "Vardag, sluttid senast 16:00", member: "540 kr", nonMember: "600 kr" },
  { time: "Mellantid",  note: "Vardag 16:00–17:30 & 20:30–22:00", member: "660 kr", nonMember: "720 kr" },
  { time: "Kvällstopp", note: "Vardag 17:30 & 19:00 samt helger", member: "720 kr", nonMember: "840 kr" },
];

export default function CourtBooking({
  bookHref = "/boka",
  bookLabel = "Boka bana",
}: {
  bookHref?: string;
  bookLabel?: string;
} = {}) {
  const bookExt = bookHref.startsWith("http");
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
            Boka bana
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Boka via
            <br />
            MATCHi
          </h2>
        </div>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
            Snabb, enkel bokning — se lediga tider och boka direkt online.
            Inomhusbana, upp till 8 spelare, 1,5 h per pass.
          </p>
          <a
            href={bookHref}
            {...(bookExt ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-black bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:bg-black/80"
          >
            {bookLabel} <span aria-hidden="true">→</span>
          </a>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
        {/* Price table */}
        <Reveal className="overflow-hidden border border-black/10 bg-white">
          <div className="border-b border-black/10 px-6 py-4 lg:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">
              Priser — inomhus (per bana, 1,5 h)
            </p>
          </div>
          <table className="w-full border-collapse">
            <caption className="sr-only">
              Banavgifter — inomhus per bana 1,5 h
            </caption>
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th
                  scope="col"
                  className="py-3 pl-6 pr-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-black/40 lg:pl-8"
                >
                  Tid
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-black/40"
                >
                  Icke-medlem
                </th>
                <th
                  scope="col"
                  className="py-3 pl-4 pr-6 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-black/70 lg:pr-8"
                >
                  Medlem
                </th>
              </tr>
            </thead>
            <tbody>
              {PRICE_ROWS.map((row, i) => (
                <tr
                  key={row.time}
                  className={i < PRICE_ROWS.length - 1 ? "border-b border-black/10" : ""}
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
              Vanlig bokning
            </h3>
            <ul className="border-t border-black/10">
              {[
                "Bokas via MATCHi — max 7 dagar i förväg",
                "1,5 h per pass, upp till 8 spelare per bana",
                "Avbokning senast 24 h före start",
              ].map((item) => (
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
              Förbokning
            </h3>
            <p className="mb-3 text-[13px] leading-snug text-black/50">
              Behöver du boka bana längre fram än 7 dagar? Mejla{" "}
              <a
                href="mailto:boka@thebeach.one"
                className="font-semibold text-black underline underline-offset-2 hover:text-black/60"
              >
                boka@thebeach.one
              </a>{" "}
              med önskad tid. Förbokning kostar 2 000 kr/bana/pass, är ej av-
              eller ombokningsbar, och kräver förskottsbetalning — du får en
              betallänk via MATCHi för att bekräfta.
            </p>
          </div>

          {/* Subscription */}
          <div className="flex-1 border border-black/10 bg-white p-6 lg:p-8">
            <h3 className="mb-3 font-display text-xl uppercase leading-none text-black lg:text-2xl">
              Abonnemang
            </h3>
            <p className="text-[13px] leading-snug text-black/50">
              Fast veckotid under hela vårterminen (vecka 3–22). Perfekt om du
              vill ha ett garanterat spelutrymme varje vecka.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-0.5 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        <div className="border border-black/10 bg-white p-6 lg:p-8">
          <h3 className="mb-2 font-display text-lg uppercase leading-none text-black">Medlemskap</h3>
          <p className="text-[13px] leading-snug text-black/50">
            Medlem betalar lägre banhyra. 350 kr/år (junior 190 kr) och
            tävlingslicens ingår.{" "}
            <a href="/foreningen" className="font-semibold text-black underline underline-offset-2 hover:text-black/60">Läs mer om medlemskap</a>.
          </p>
        </div>
        <div className="border border-black/10 bg-white p-6 lg:p-8">
          <h3 className="mb-2 font-display text-lg uppercase leading-none text-black">Skolklasser</h3>
          <p className="text-[13px] leading-snug text-black/50">
            Vi tar emot skolklasser på vardagar till specialpris.{" "}
            <a href="/skola" className="font-semibold text-black underline underline-offset-2 hover:text-black/60">Se Skolor</a>.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
