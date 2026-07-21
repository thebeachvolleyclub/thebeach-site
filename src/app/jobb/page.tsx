import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";

const TITLE = "Köksansvarig till The Beach";
const DESC =
  "Vi söker en köksansvarig som älskar mat, gillar människor och vill skapa ett kök som blir en självklar del av upplevelsen på The Beach. Anställning eller konsultuppdrag, deltid till heltid.";

export const metadata: Metadata = {
  title: `${TITLE} — Jobba hos oss | The Beach`,
  description: DESC,
  alternates: { canonical: "/jobb" },
  openGraph: {
    title: `${TITLE} — The Beach`,
    description: DESC,
    url: "/jobb",
    type: "website",
  },
};

const ANSVAR = [
  "Den dagliga driften av köket",
  "Menyer & produkter",
  "Inköp och planering av råvaror",
  "Hög kvalitet på mat, presentation och service",
  "Att maten blir en naturlig del av våra event",
  "Att fler av våra dagliga gäster väljer mat och dryck hos oss",
  "Att leda köksteamet under större arrangemang",
];

const ERBJUDER = [
  "Stor frihet under ansvar och möjlighet att sätta din egen prägel",
  "Ett kreativt jobb där nya idéer uppskattas",
  "Ett engagerat team med korta beslutsvägar",
  "En unik arbetsplats fylld av människor, träning, event och glädje",
  "Anställning eller konsultuppdrag — deltid till heltid beroende på rätt person",
  "Lön enligt överenskommelse. Provanställning tillämpas vid anställning.",
];

const jobPosting = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: TITLE,
  description: DESC,
  employmentType: ["FULL_TIME", "PART_TIME", "CONTRACTOR"],
  hiringOrganization: {
    "@type": "Organization",
    name: "The Beach Volley Club Huddinge",
    sameAs: "https://thebeach.one",
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Novavägen 35",
      postalCode: "141 44",
      addressLocality: "Huddinge",
      addressCountry: "SE",
    },
  },
  applicantLocationRequirements: { "@type": "Country", name: "SE" },
  directApply: true,
};

export default function JobbPage() {
  const cta = (
    <a
      href="mailto:david@thebeach.one?subject=Ansökan%20%E2%80%94%20Köksansvarig%20The%20Beach"
      className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
    >
      Skicka din ansökan <span aria-hidden="true">→</span>
    </a>
  );

  return (
    <>
      <JsonLd data={jobPosting} />
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Jobba hos oss"
          title={<>Skapa ett kök folk <span className="italic-accent">längtar</span> tillbaka till</>}
          intro="Vi söker dig som älskar mat, gillar människor och får energi av att skapa upplevelser. Med dig ska köket bli en ännu större del av hela upplevelsen — inte en service vid sidan av."
          cta={cta}
        />

        {/* Vem vi söker */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-5">
              <p className="eyebrow mb-4" style={{ color: "#639922" }}>Vem vi söker</p>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                Rätt person före rätt meritlista
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="space-y-5 text-[17px] leading-relaxed text-black/70">
                <p>
                  Inte nödvändigtvis den mest meriterade kökschefen — men gärna någon med erfarenhet nog
                  att driva ett kök själv. Framför allt söker vi dig som älskar mat, gillar människor och
                  får energi av att skapa upplevelser.
                </p>
                <p>
                  Du är personen som kommer till jobbet och säger: <em>&rdquo;Jag testade ett nytt recept
                  igår kväll — ni måste smaka!&rdquo;</em> Du ser möjligheter där andra ser rutiner, och du
                  drivs av att få folk att trivas och stanna kvar lite längre.
                </p>
                <p>
                  Du är självgående och tar initiativ, men prestigelös. Ibland leder du, ibland kliver du
                  tillbaka när någon annan har den bästa lösningen. Hos oss gäller laget före jaget.
                </p>
                <p>
                  Och du gillar att möta gästerna. Du kliver gärna ut från köket och berättar om maten innan
                  ett event drar igång — vad rätterna är, tanken bakom dem. Lika gärna går du ut efteråt och
                  frågar rakt ut: <em>&rdquo;Smakade det bra? Jag är kocken, ni får vara ärliga.&rdquo;</em>{" "}
                  Hos oss får köket ta plats, och mötet med gästen är en del av upplevelsen.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Om The Beach */}
        <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-5">
              <p className="eyebrow mb-4">Om The Beach</p>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-bone">
                Köket är en del av upplevelsen
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="space-y-5 text-[17px] leading-relaxed text-bone/60">
                <p>
                  En av Sveriges största beachvolleyanläggningar och en mötesplats för träning, tävling och
                  event i över 20 år. Varje dag passerar hundratals människor våra lokaler — många flera
                  gånger i veckan, nästan som hemma. Däremellan arrangerar vi företagsevent, turneringar och
                  större arrangemang året runt.
                </p>
                <p>
                  För oss är köket inte en service vid sidan av. Vi vill att gästerna ska vilja stanna kvar
                  efter träningen, ta en lunch med kompisarna, beställa något gott eller samla kollegorna runt
                  en riktigt bra måltid.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Om rollen */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-5">
              <p className="eyebrow mb-4" style={{ color: "#639922" }}>Om rollen</p>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                Ingen vecka är den andra lik
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="space-y-5 text-[17px] leading-relaxed text-black/70">
                <p>
                  Vissa dagar utvecklar du vardagen för våra många stammisar och får fler av dem att äta hos
                  oss. Andra dagar levererar du matupplevelser till stora företagsevent där kvalitet, tempo och
                  samarbete avgör.
                </p>
                <p>
                  I lugnare stunder jobbar du självständigt med planering och utveckling. Under större event
                  leder och samordnar du arbetet i köket tillsammans med kollegor. Du får stor frihet att
                  påverka utbud, arbetssätt och hela riktningen för köket.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Ansvar + Erbjuder */}
        <section className="bg-cream px-5 pb-16 sm:px-8 lg:px-14 lg:pb-24">
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="mb-5 font-display text-[clamp(1.4rem,5vw,1.9rem)] leading-[1] text-black">
                Du ansvarar för
              </h3>
              <ul className="space-y-3">
                {ANSVAR.map((li) => (
                  <li key={li} className="flex gap-3 text-[15px] leading-relaxed text-black/70">
                    <span aria-hidden="true" className="mt-[2px] font-bold" style={{ color: "#639922" }}>—</span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[15px] leading-relaxed text-black/60">
                Är du inte van vid kalkyler, inköp och lönsamhet sedan tidigare hjälper vi dig gärna att växa
                in i det — tillsammans med ledningen håller vi ordning på ekonomin.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h3 className="mb-5 font-display text-[clamp(1.4rem,5vw,1.9rem)] leading-[1] text-black">
                Vi erbjuder
              </h3>
              <ul className="space-y-3">
                {ERBJUDER.map((li) => (
                  <li key={li} className="flex gap-3 text-[15px] leading-relaxed text-black/70">
                    <span aria-hidden="true" className="mt-[2px] font-bold" style={{ color: "#639922" }}>—</span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-lime px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto flex max-w-[1500px] flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <Reveal>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                Låter det som du?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">
                Vi söker framför allt rätt person. Skicka några rader om dig själv till{" "}
                <a
                  href="mailto:david@thebeach.one?subject=Ansökan%20%E2%80%94%20Köksansvarig%20The%20Beach"
                  className="font-semibold underline"
                >
                  david@thebeach.one
                </a>{" "}
                så läser vi löpande och hör av oss snabbt. Frågor? Ring David på{" "}
                <a href="tel:+46704322028" className="font-semibold underline">070-432 20 28</a>.
              </p>
            </Reveal>
            <Reveal delay={0.06} className="shrink-0">
              <a
                href="mailto:david@thebeach.one?subject=Ansökan%20%E2%80%94%20Köksansvarig%20The%20Beach"
                className="inline-flex cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                Maila david@thebeach.one <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
