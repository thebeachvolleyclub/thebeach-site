import Reveal from "@/components/Reveal";

const COURSES = [
  {
    no: "01",
    tag: "Nybörjare",
    title: "Grundkurs",
    price: "795 kr",
    priceNote: "Under 26 år: effektivt 395 kr (400 kr MATCHi-kredit tillbaka)",
    details: [
      "5 pass × 1,5 h (19:00–20:30 eller 20:30–22:00)",
      "Teknik, fotarbete, taktik och spel",
      "Inomhus",
      "Start: tisdagar fr.o.m. 1 sep eller torsdagar fr.o.m. 3 sep 2026",
    ],
    quote: "Ingen tidigare erfarenhet krävs. Ta bara med motivation och en bra attityd.",
    cta: { label: "Boka via MATCHi", href: "https://www.matchi.se/facilities/thebeach" },
  },
  {
    no: "02",
    tag: "Mellannivå",
    title: "Fortsättningskurs",
    price: null, // price gap — do not show
    priceNote: null,
    details: [
      "Rörelse & positionering",
      "Bollkontroll, försvar & attack",
      "Spelförståelse & matchspel i högre tempo",
      "Start: tisdagar 1 sep eller torsdagar 3 sep 2026",
    ],
    quote: null,
    cta: { label: "Boka via MATCHi", href: "https://www.matchi.se/facilities/thebeach" },
  },
];

export default function CourseLadder() {
  return (
    <section
      id="kurser"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override: .eyebrow lime fails contrast on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Börja träna
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Kursstegen
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
          Har du aldrig spelat beachvolley — eller vill ta ditt spel till nästa
          nivå? Här är vägen in.
        </p>
      </Reveal>

      {/* Course cards */}
      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        {COURSES.map((c, i) => (
          <Reveal
            key={c.title}
            delay={i * 0.08}
            className="flex flex-col border border-black/10 bg-white p-7 lg:p-10"
          >
            {/* Number + tag row */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/30">
                {c.no}
              </span>
              <span className="bg-black/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
                {c.tag}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-3 font-display text-3xl uppercase leading-none text-black lg:text-4xl">
              {c.title}
            </h3>

            {/* Price */}
            {c.price ? (
              <div className="mb-1 flex items-baseline gap-1.5 text-[13px] text-black/40">
                <strong className="font-display text-xl text-black lg:text-2xl">
                  {c.price}
                </strong>
              </div>
            ) : (
              <div className="mb-1 text-[13px] text-black/40">
                Pris anges vid anmälan
              </div>
            )}
            {c.priceNote && (
              <p className="mb-4 text-[12px] leading-snug text-black/45">
                {c.priceNote}
              </p>
            )}
            {!c.priceNote && <div className="mb-4" />}

            {/* Details list */}
            <ul className="mb-5 flex-1 border-t border-black/10">
              {c.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 border-b border-black/10 py-2 text-xs leading-snug text-black/55"
                >
                  <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">
                    ↗
                  </span>
                  {d}
                </li>
              ))}
            </ul>

            {/* Verbatim quote (Grundkurs only) */}
            {c.quote && (
              <blockquote className="mb-5 border-l-2 border-lime pl-4 text-[13px] italic leading-snug text-black/50">
                &ldquo;{c.quote}&rdquo;
              </blockquote>
            )}

            {/* CTA — both courses link to external sites */}
            <a
              href={c.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-colors hover:text-black/60"
            >
              {c.cta.label} <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
