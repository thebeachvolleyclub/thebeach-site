import Link from "next/link";
import Reveal from "./Reveal";
import EventCarousel, { type EventPkg } from "./EventCarousel";

const PACKAGES: EventPkg[] = [
  {
    img: "/media/event-laspalmas.jpg",
    tag: "Enkelt & socialt",
    name: "Las Palmas",
    price: "745 kr",
    desc: "After work, kickoff eller social aktivitet. Det enkla valet som alltid funkar — oavsett om ni är 10 eller 50.",
    features: ["1,5 h beachvolleyturnering med instruktör", "Tapas — ost & chark", "1 dryckesenhet (öl, vin eller alkoholfritt)", "Pris till King & Queen of The Beach", "Rekommenderat: 10–50 pers"],
  },
  {
    img: "/media/event-algarve.jpg",
    tag: "Mest bokad",
    name: "Algarve",
    price: "945 kr",
    desc: "Vårt mest bokade koncept. Aktivitet + middag — perfekt för företag som vill kombinera sport med ett riktigt socialt häng.",
    features: ["1,5 h beachvolleyturnering med instruktör", "Middagsbuffé i loungen", "1 dryckesenhet (öl, vin eller alkoholfritt)", "Pris till King & Queen of The Beach", "10–250 gäster"],
    featured: true,
  },
  {
    img: "/media/event-miami.jpg",
    tag: "Helkväll",
    name: "Miami",
    price: "1 195 kr",
    desc: "När ni vill maxa upplevelsen. Mat, dryck, tempo och stämning — för den grupp som inte nöjer sig med halvmesyrer.",
    features: ["1,5 h beachvolleyturnering med instruktör", "Generös BBQ-buffé", "2 dryckesenheter", "Pris till King & Queen of The Beach", "15–250 gäster"],
  },
];

export default function Events() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <Reveal className="mb-10 lg:mb-16 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
        <div>
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
            Eventkoncept
          </span>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Boka ett event
            <br />
            som sticker ut
          </h2>
        </div>
        <div className="mt-3 max-w-xs lg:mt-0 lg:text-right">
          <p className="mb-3 text-sm leading-relaxed text-black/40">
            Färdiga paket från after work till fullskala corporate event.
            Aktivitet, mat och dryck — allt ingår.
          </p>
          <Link href="/events" className="text-xs font-bold uppercase tracking-[0.1em] text-lime [text-shadow:0_0_1px_rgba(0,0,0,0.4)]">
            <span className="text-orange">Skräddarsytt event →</span>
          </Link>
        </div>
      </Reveal>

      <EventCarousel packages={PACKAGES} />

      {/* Conference add-on */}
      <div className="mt-0.5 flex flex-col items-start gap-4 bg-mint p-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:p-11">
        <div>
          <h3 className="mb-1.5 font-display text-[22px] uppercase text-black lg:text-[28px]">
            + Konferens i sanden
          </h3>
          <p className="max-w-xl text-sm leading-snug text-black/50">
            Lägg till upp till 3 h konferens med projektor, duk och konferensyta
            i loungen. Passar samtliga eventkoncept.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-6">
          <div className="font-display text-[28px] text-black lg:text-[32px]">
            +395 kr <span className="font-body text-[13px] font-normal text-black/40">/person</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-10 flex flex-col items-start gap-4 border-t border-black/10 pt-8 lg:mt-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:pt-12">
        <p className="max-w-xl text-sm leading-relaxed text-black/40 lg:text-[15px]">
          Behöver ni något utöver de färdiga paketen? Vi har lång erfarenhet av
          stora events, produktlanseringar, bröllop och säkerhetsklassade
          evenemang — alltid skräddarsytt.
        </p>
        <Link
          href="/events"
          className="shrink-0 cursor-pointer bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright"
        >
          Be om offert på skräddarsytt event →
        </Link>
      </div>
    </section>
  );
}
