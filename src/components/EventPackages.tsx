import Reveal from "./Reveal";
import MaskReveal from "./MaskReveal";
import PackageCarousel, { type Pkg } from "./PackageCarousel";
import ParallaxImage from "./ParallaxImage";

const PACKAGES: Pkg[] = [
  {
    name: "Las Palmas",
    price: "745",
    tagline: "Enkelt, socialt och proffsigt.",
    features: [
      "1,5 h beachvolleyturnering",
      "Instruktör som leder spelet",
      "Tapas mellan matcherna",
      "1 dryck (öl, vin eller alkfritt)",
      "Omklädning, dusch & parkering",
    ],
  },
  {
    name: "Algarve",
    price: "945",
    tagline: "Lite mer mat, lika mycket sand.",
    features: [
      "Allt i Las Palmas, plus:",
      "Middagsbuffé efter spelet",
      "King & Queen of The Beach-pris",
      "Längre tid i loungen",
      "Perfekt för kickoff & avtackning",
    ],
    popular: true,
  },
  {
    name: "Miami",
    price: "1 195",
    tagline: "Hela kvällen — från match till BBQ.",
    features: [
      "Allt i Algarve, plus:",
      "BBQ-meny för hela gänget",
      "Utökat dryckespaket",
      "Egen värd hela kvällen",
      "Tillval: konferens i loungen",
    ],
  },
];

export default function EventPackages() {
  return (
    <section
      id="event"
      className="relative overflow-hidden border-y border-line bg-panel"
    >
      {/* ── Cinematic banner: the photo IS the background and melts into the section ── */}
      <div className="relative isolate">
        <ParallaxImage
          src="/media/event.webp"
          alt="Stämningsfullt kvällsevent under tak på The Beach med dukade långbord och levande ljus"
        />
        {/* grade the photo into the Midnight Coast palette */}
        <div className="absolute inset-0 -z-10 bg-panel/30 mix-blend-multiply" />
        {/* left → right: solid for text legibility, opening up to reveal the room */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-panel via-panel/85 to-panel/15" />
        {/* top & bottom: dissolve the hard edges into the surrounding section */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-panel via-transparent to-panel" />
        {/* mobile: full-width text needs a stronger scrim than the side gradient gives */}
        <div className="absolute inset-0 -z-10 bg-black/35 sm:hidden" />
        {/* warm brass bloom from the candlelight */}
        <div className="pointer-events-none absolute -z-10 right-[12%] top-1/3 h-64 w-64 rounded-full bg-brass/15 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:py-48">
          <div className="max-w-xl">
            <Reveal>
              <p className="eyebrow mb-4">Event & Företag</p>
            </Reveal>
            <h2 className="text-4xl text-bone sm:text-5xl lg:text-6xl">
              <MaskReveal delay={0.05}>
                Fira <span className="italic-accent text-brass">på stranden</span>
              </MaskReveal>
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-lg font-light leading-relaxed text-bone/85 [text-shadow:0_2px_16px_rgba(7,15,20,0.55)]">
                Kickoff, konferens eller fest — vi sköter allt. Avslappnat,
                socialt och effektivt. Inga förkunskaper krävs; alla kan vara
                med.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── Packages ── */}
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pb-32 sm:pt-10">
        <PackageCarousel packages={PACKAGES} />

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-sm text-bone/65">
            Grupper 10–50 personer · Konferenstillägg 395 kr/pers · Skräddarsydda
            event, bröllop & barnkalas på förfrågan.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
