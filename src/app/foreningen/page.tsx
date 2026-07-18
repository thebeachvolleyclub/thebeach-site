import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Föreningen — The Beach Volley Club | Bli medlem & våga börja tävla",
  description:
    "Bli medlem i The Beach Volley Club för 350 kr/år (junior 190 kr): billigare banhyra, medlemsevent, gratis licensregistrering — och stötta ungdomsverksamheten. Så tar du steget till din första turnering.",
};

const FORMANER = [
  "Billigare banhyra — perfekt om du vill spela mer",
  "Rabatterade priser på aktiviteter och träning (idag junior & ungdom)",
  "Medlemsexklusiva event, aktiviteter och erbjudanden",
  "Gratis registrering av tävlingslicens — och plats i vårt tävlingsgäng",
  "Du stöttar prisvärd ungdomsträning och bättre villkor för alla spelare",
];

const SBT = [
  { n: "SBT 1★", d: "Instegsnivån — nybörjare och rutinerade sida vid sida. Perfekt första turnering. Arrangeras regelbundet här på The Beach." },
  { n: "SBT 2–3★", d: "För dig med lite tävlingsvana som vill utmanas. På 3★-nivån dyker inte sällan landslagsspelare upp." },
  { n: "SBT 4–5★", d: "Sveriges absoluta toppspelare." },
  { n: "Mixed & U19", d: "Avslappnad stämning respektive åldersbaserat — båda arrangeras på The Beach." },
];

export default function ForeningenPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="The Beach Volley Club"
          title={<>Klubben för dig som<br /><span className="italic-accent">vill mer</span></>}
          intro="Föreningen är hjärtat i The Beach — ungdomarna, tävlingsspelarna och alla däremellan. Som medlem får du förmåner och är samtidigt med och bygger svensk beachvolleys framtid, på samma sand som OS-guldmedaljörerna."
          cta={
            <a
              href="https://www.matchi.se/facilities/thebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Bli medlem — 350 kr/år <span aria-hidden="true">→</span>
            </a>
          }
        />

        {/* Varför medlem */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">Medlemskap</p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black">
                Därför ska du<br />bli medlem
              </h2>
              <p className="mb-6 max-w-md text-[15px] leading-relaxed text-black/55">
                350 kr per kalenderår — 190 kr för juniorer. Alla är välkomna:
                nybörjare, motionär eller på väg mot toppen. Medlemskapet
                tecknas via MATCHi och gäller direkt.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.matchi.se/facilities/thebeach"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
                >
                  Bli medlem via MATCHi →
                </a>
              </div>
              <p className="mt-6 max-w-md text-[12px] leading-relaxed text-black/35">
                Klubbens Swish (endast när det anges): 123 351 1474 ·
                Bankgiro: 5124-1545. Turneringsavgifter betalas via{" "}
                <a href="https://www.profixio.com/fx/terminliste.php?org=SVBF.SE.SVB" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black/60">Profixio</a>.
                Klubben hette tidigare 08 Beachvolley Club — namnbytet till The
                Beach Volley Club är registrerat hos Svenska
                Volleybollförbundet och Riksidrottsförbundet.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ul className="divide-y divide-black/10 border border-black/10 bg-white">
                {FORMANER.map((f) => (
                  <li key={f} className="flex items-start gap-3 p-5 text-[15px] leading-snug text-black/70">
                    <span className="shrink-0 pt-0.5 text-lime [text-shadow:0_0_1px_rgba(0,0,0,0.35)]" aria-hidden="true">↗</span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Våga börja tävla */}
        <section id="tavla" className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">Våga börja tävla</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Din första turnering<br />är närmare än du tror
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
            <Reveal className="border border-white/10 bg-white/[0.03] p-7 lg:p-10">
              <span className="mb-4 block font-display text-3xl text-lime/40">01</span>
              <h3 className="mb-3 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">
                Skaffa licens & klubb
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-bone/55">
                För att tävla i Sverige behöver du en tävlingslicens, som
                utfärdas via en registrerad klubb. Som medlem i The Beach
                Volley Club ingår licensen — men den registreras inte
                automatiskt. Mejla{" "}
                <a href="mailto:rasmus.boden@thebeach.one" className="text-bone underline underline-offset-4">rasmus.boden@thebeach.one</a>{" "}
                så fixar vi den.
              </p>
              <p className="text-[12px] leading-relaxed text-bone/35">
                Licensregistreringen sker manuellt och kan ta några dagar —
                ansök i god tid, inte dagen före anmälningsdeadline.
              </p>
            </Reveal>
            <Reveal delay={0.06} className="border border-white/10 bg-white/[0.03] p-7 lg:p-10">
              <span className="mb-4 block font-display text-3xl text-lime/40">02</span>
              <h3 className="mb-3 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">
                Hitta rätt turnering
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-bone/55">
                Det finns tävlingar för alla nivåer — och det svåraste är att
                ta första steget. Anmäl dig, utmana dig själv och ha kul. Vi
                ses i sanden!
              </p>
              <Link href="/kalender" className="text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright">
                Se kommande turneringar hos oss →
              </Link>
            </Reveal>
          </div>

          {/* SBT-nivåer */}
          <div className="mt-0.5 grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
            {SBT.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05} className="border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <h4 className="mb-2 font-display text-xl uppercase text-lime">{s.n}</h4>
                <p className="text-[13px] leading-relaxed text-bone/55">{s.d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-10 border-t border-white/10 pt-8">
            <p className="max-w-2xl text-sm leading-relaxed text-bone/45">
              The Beach är en stolt och aktiv del av svensk volleyboll — både
              damlandslagets förbundskapten Mattias Magnusson och herrarnas
              Rasmus Jonsson utgår från vår anläggning. Bor du någon
              annanstans? Vi hjälper dig gärna hitta en klubb nära dig.
            </p>
          </Reveal>
        </section>

        {/* Ungdom + historia */}
        <section className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">Ungdom</p>
              <h2 className="mb-4 font-display text-[clamp(2rem,8vw,3rem)] leading-[0.9] text-black">
                Från första nudden<br />till U19
              </h2>
              <p className="mb-5 max-w-md text-[15px] leading-relaxed text-black/60">
                Barn- och ungdomsträningen leds av utbildade coacher under
                Måns Björn. Anmälan och info via Svenskalag.
              </p>
              <a
                href="https://www.svenskalag.se/thebeach"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                Ungdomsträning <span aria-hidden="true">→</span>
              </a>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">Klubbhistoria</p>
              <p className="max-w-md text-[15px] leading-relaxed text-black/60">
                Grundad 2006 som Beachhallen BVC i Södertälje. 2016 gick vi
                ihop med spelarna från Bromma BVC och blev 08 Beachvolley Club
                — och ja, det var vi som var med och byggde banorna med riktig
                sand på Gärdet. Idag heter vi The Beach Volley Club, med hela
                verksamheten samlad under ett tak i Huddinge.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
