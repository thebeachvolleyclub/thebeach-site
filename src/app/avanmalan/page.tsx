import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import TrainingFormClient from "@/components/trana/TrainingFormClient";

export const metadata: Metadata = {
  title: "Avanmälan & villkor — träningsgrupper | The Beach",
  description:
    "Så fungerar betalning och avanmälan för träningsgrupper på The Beach: betalningsvillkor, avanmälningsregler, läkarintyg och varför reglerna finns.",
};

const VILLKOR: { when: string; cost: string }[] = [
  { when: "Innan grupperna publiceras (fram till det avgiftsfria datum som anges i din anmälan)", cost: "Kostnadsfritt." },
  { when: "Om vi missat ett krav du angav i anmälan", cost: "Kostnadsfritt, så länge du avanmäler dig utan dröjsmål. (Krav är inte samma sak som önskemål.)" },
  { when: "Från sista avgiftsfria datum fram till dagen grupperna publiceras", cost: "Administrativ avgift 500 kr + läkarintyg." },
  { when: "Dagen grupperna publiceras eller dagen efter", cost: "Administrativ avgift 1 000 kr + läkarintyg." },
  { when: "Efter det", cost: "Hela träningsavgiften debiteras, oavsett deltagande. Med giltigt läkarintyg före femte passet kan upp till 50 % krediteras mot framtida träning. Efter femte passet kan platsen inte längre ersättas och ingen kreditering är möjlig." },
];

export default function AvanmalanPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Träningsgrupper"
          title={<>Avanmälan<br /><span className="italic-accent">& villkor</span></>}
          intro="Så fungerar betalning och avanmälan för våra träningsgrupper — och varför reglerna ser ut som de gör."
          minH="min-h-[46svh]"
        />
        <section className="bg-cream px-5 py-16 text-black sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl space-y-12">
            <Reveal>
              <h2 className="mb-3 font-display text-2xl uppercase text-black">Betalning</h2>
              <p className="text-[15px] leading-relaxed text-black/65">
                Fakturan kommer via mejl efter att träningsgrupperna startat. Vi gör
                så för att lägga mindre tid på administration och mer på det som
                faktiskt spelar roll: att så många som möjligt hamnar i en grupp som
                passar. Att vi inte tar betalt i förskott tar dock inte bort
                betalningsskyldigheten — när du har en plats i en grupp gäller hela
                avgiften. Har du inte fått din faktura inom 30 dagar efter första
                passet, hör av dig till{" "}
                <a href="mailto:ekonomi@beachvolley.se" className="font-semibold text-black underline underline-offset-4">ekonomi@beachvolley.se</a>.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="mb-3 font-display text-2xl uppercase text-black">Så avbokar du</h2>
              <p className="text-[15px] leading-relaxed text-black/65">
                Avanmälan görs <strong>enbart via avanmälningsformuläret</strong>. Vi tar
                inte emot avanmälningar via mejl, telefon, sms eller på något annat
                sätt — det är formuläret som gäller.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="mb-5 font-display text-2xl uppercase text-black">Villkor för avanmälan</h2>
              <ul className="space-y-4">
                {VILLKOR.map((v) => (
                  <li key={v.when} className="border-l-2 border-black/15 pl-4">
                    <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-black/70">{v.when}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-black/60">{v.cost}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="mb-3 font-display text-2xl uppercase text-black">Läkarintyg</h2>
              <p className="text-[15px] leading-relaxed text-black/65">
                Ett läkarintyg ska innehålla en tydlig uppgift om att du inte kan delta
                i träning, vilken tidsperiod det gäller, och laddas upp via formuläret
                utan dröjsmål.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="mb-3 font-display text-2xl uppercase text-black">Varför reglerna finns</h2>
              <p className="text-[15px] leading-relaxed text-black/65">
                Att sätta ihop träningsgrupper är ett komplext pussel — vi väger nivå,
                tillgänglighet och önskemål för att varje grupp ska funka så bra som
                möjligt för alla. Vi får ofta frågan: “men ni har ju en väntelista,
                kan inte någon annan ta min plats?” Ibland har vi reserver, men det är
                inte säkert att någon på listan matchar din grupps nivå och tider, och
                många reserver hinner boka annat när grupperna väl är satta. Är du
                osäker på om du kan binda upp dig för hela perioden — vänta hellre med
                att anmäla dig. Det håller grupperna stabila och låter andra planera
                sin säsong. Skador och sjukdom händer så klart, och därför är policyn
                flexibel med läkarintyg. Vill du ha extra skydd, kolla vad din egen
                försäkring täcker.
              </p>
            </Reveal>

            <Reveal className="border-t border-black/10 pt-10">
              <h2 className="mb-2 font-display text-2xl uppercase text-black">Avanmälan</h2>
              <p className="mb-6 text-[15px] leading-relaxed text-black/60">
                Avanmälan görs här — inte via mejl eller telefon. Fyll i uppgifterna nedan så tar vi hand om det.
              </p>
              <TrainingFormClient
                formName="avanmalan"
                groupLabel="Vilken träningsgrupp gäller det?"
                reasonLabel="Anledning (frivilligt)"
                reasonPlaceholder="Kort om varför du avanmäler dig — hjälper oss hantera ärendet rätt."
                consentLabel="Ja, jag har läst informationen ovan."
                successText="Vi har tagit emot din avanmälan och återkommer om något behövs (t.ex. läkarintyg)."
                note="Kräver ditt ärende läkarintyg enligt villkoren ovan? Vi återkommer med hur du skickar in det."
              />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
