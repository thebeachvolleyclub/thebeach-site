import Reveal from "@/components/Reveal";

export default function Historien() {
  return (
    <section
      id="historien"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override on cream — .eyebrow hard-codes lime, fails contrast */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Sedan 2006
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Historien
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/60 sm:text-right">
          Från en dröm om helårssand till en av Sveriges ledande beachvolleyanläggningar.
        </p>
      </Reveal>

      {/* Story content */}
      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
        {/* Story text */}
        <Reveal className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
          <p className="flex-1 text-sm leading-relaxed text-black/60">
            Allt började 2006 med en enkel dröm: en plats där vi kunde spela
            beachvolley året runt. I Södertälje byggde vi upp ett centrum som
            snabbt blev ett hem för hundratals spelare.{" "}
            {/* TODO(operator): confirm merger year (2016 vs 2017) if you want the 08 Beachvolley Club merger mentioned; confirm any milestone years 2006–2022 */}
            2022 tog vi steget till Huddinge — en nybyggd anläggning med 17
            banor, byggd för att hålla i generationer.
          </p>
        </Reveal>

        {/* Timeline milestones */}
        <Reveal delay={0.08} className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
          <h3 className="mb-5 font-display text-2xl uppercase leading-none text-black">
            Milstolpar
          </h3>
          <ul className="border-t border-black/10">
            <li className="flex items-start gap-4 border-b border-black/10 py-3">
              <span className="shrink-0 font-display text-xl text-black/30">
                2006
              </span>
              <span className="text-sm leading-snug text-black/60">
                The Beach grundas — beachvolley året runt i Södertälje
              </span>
            </li>
            {/* TODO(operator): confirm merger year and exact event for 2016/2017 milestone */}
            <li className="flex items-start gap-4 border-b border-black/10 py-3">
              <span className="shrink-0 font-display text-xl text-black/30">
                2022
              </span>
              <span className="text-sm leading-snug text-black/60">
                Ny anläggning öppnar i Huddinge — 17 banor, byggd för generationer
              </span>
            </li>
            <li className="flex items-start gap-4 py-3">
              <span className="shrink-0 font-display text-xl text-black/30">
                Idag
              </span>
              <span className="text-sm leading-snug text-black/60">
                800+ spelare/vecka, 10 inomhus- + 7 utomhusbanor, Novavägen 35 Huddinge
              </span>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
