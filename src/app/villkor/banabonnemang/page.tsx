import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Villkor för banabonnemang — The Beach",
  description: "Vad som gäller när du har en fast veckotid på The Beach.",
};

const sections: Array<{ heading: string; paragraphs: string[] }> = [
  {
    heading: "Vad ett banabonnemang är",
    paragraphs: [
      "Ett banabonnemang ger dig en fast veckotid på en bestämd bana under en bestämd period, normalt en hel termin. Perioden, antalet tillfällen och priset framgår av ditt erbjudande i Mitt konto. Priset låses när du accepterar erbjudandet och gäller hela perioden.",
      "Banans prisklass påverkar bara priset, inte villkoren. Alla abonnemang har samma regler.",
    ],
  },
  {
    heading: "Medlemskap",
    paragraphs: [
      "Abonnemanget förutsätter att du är medlem i The Beach Volley Club under hela perioden. Utan giltigt medlemskap kan abonnemanget inte aktiveras.",
    ],
  },
  {
    heading: "Personligt bruk",
    paragraphs: [
      "Abonnemanget är personligt. Du som tecknar det är bokare och deltar själv på tiden. Tiden får inte användas för kurser, föreningsverksamhet, företag eller annan organiserad eller kommersiell verksamhet.",
    ],
  },
  {
    heading: "Tiden kan inte flyttas",
    paragraphs: [
      "Din veckotid är fast. Tillfällen kan inte flyttas till andra dagar, tider eller banor. Ett tillfälle som varken spelas eller släpps är förbrukat.",
    ],
  },
  {
    heading: "Släppa en tid du inte kan använda",
    paragraphs: [
      "Om du vet att du inte kan använda ett tillfälle kan du släppa tiden i Mitt konto innan den börjar. Tiden blir då bokningsbar för andra.",
      "Säljs tiden och betalas av någon annan får du 90 procent av försäljningspriset som personligt tillgodohavande — dock minst 50 procent och högst 100 procent av ditt eget pris för tillfället. Säljs tiden inte utgår inget tillgodohavande.",
      "Tillgodohavandet är personligt, gäller i 12 månader och kan användas till vanliga banbokningar på The Beach. Vi påminner dig innan det löper ut.",
    ],
  },
  {
    heading: "När The Beach behöver banan",
    paragraphs: [
      "I undantagsfall kan vi behöva ta tillbaka ett tillfälle, till exempel när banan behövs för ett event eller av annan anledning. Då får du hela värdet för det tillfället som tillgodohavande direkt, och vi meddelar dig så tidigt vi kan.",
    ],
  },
  {
    heading: "Nästa period",
    paragraphs: [
      "Som abonnent har du förtur till samma tid nästa period. Du får ett erbjudande i Mitt konto som du behöver acceptera inom angiven tid, annars går tiden vidare till andra.",
    ],
  },
  {
    heading: "Frågor",
    paragraphs: [
      "Hör av dig till boka@thebeach.one så hjälper vi dig.",
    ],
  },
];

export default function SubscriptionTermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream px-5 pb-24 pt-36 sm:px-8 lg:px-14">
        <Reveal className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal">Version HT2026-v1</p>
          <h1 className="mb-8 break-words font-display text-[clamp(1.9rem,8vw,3.5rem)] leading-[0.9] text-black">
            Villkor för banabonnemang
          </h1>
          <div className="space-y-8 text-[15px] leading-relaxed text-black/65">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-2 font-display text-2xl text-black">{section.heading}</h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
            <p className="border-t border-black/10 pt-6 text-sm">
              Personuppgifter hanteras enligt vår{" "}
              <Link href="/integritetspolicy" className="underline underline-offset-4">integritetspolicy</Link>.
            </p>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
