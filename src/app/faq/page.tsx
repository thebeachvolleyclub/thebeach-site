import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Vanliga frågor — The Beach",
  description:
    "Allt du undrar inför besöket: bokning, utrustning, duschar, parkering, mat och priser. Hittar du inte svaret? Mejla boka@thebeach.one.",
};

const FAQ: { q: string; a: string }[] = [
  { q: "Hur bokar jag en bana?", a: "Banor bokas via MATCHi (matchi.se/facilities/thebeach). Ett vanligt pass är 1,5 timme. Event, skolbesök och grupper bokas via förfrågningsformuläret eller boka@thebeach.one." },
  { q: "Jag har aldrig spelat — kan jag ändå komma?", a: "Absolut. Grundkursen är byggd för nybörjare, och på prova-på-tillfällen och event behövs inga förkunskaper alls. Ta bara med träningskläder." },
  { q: "Vad behöver jag ta med?", a: "Bara dig själv och träningskläder. Bollar, nät och allt material finns på plats. Man spelar barfota i sanden — året runt, det är alltid varmt inne." },
  { q: "Finns duschar och omklädningsrum?", a: "Ja — 14 duschar och omklädningsrum finns i anläggningen." },
  { q: "Hur tar jag mig hit?", a: "Novavägen 35, 141 44 Huddinge. Pendeltåg till Flemingsberg eller Stuvsta och kort promenad, eller bil — det finns gott om parkering direkt vid hallen." },
  { q: "Finns det mat och dryck?", a: "Ja, vi har servering i loungen. För event ingår mat i paketen (Las Palmas, Algarve, Miami) och vi skräddarsyr gärna menyer för större sällskap." },
  { q: "Vad kostar ett event?", a: "Färdiga paket från 745 kr/person (Las Palmas). Mest bokad är Algarve, 945 kr/person. Konferenstillägg +395 kr/person. Företagspriser anges exklusive moms." },
  { q: "Kan barn spela hos er?", a: "Ja — vi har barn- och ungdomsträning, barnkalas (6–11 år) och tar emot skolklasser på vardagar. Se sidorna Barnkalas och Skolor." },
  { q: "Hur avbokar jag träning eller kurs?", a: "Hör av dig till boka@thebeach.one så hjälper vi dig. Banbokningar hanteras direkt i MATCHi." },
];

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          minH="min-h-[46svh]"
          eyebrow="FAQ"
          title={<>Vanliga<br /><span className="italic-accent">frågor</span></>}
          intro="Snabba svar inför besöket. Hittar du inte det du letar efter? Mejla boka@thebeach.one så svarar vi inom 24 timmar."
        />
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={Math.min(i * 0.03, 0.15)}>
                <details className="group border-b border-black/10">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-display text-lg uppercase leading-tight text-black marker:content-none lg:text-xl">
                    {f.q}
                    <span className="shrink-0 text-black/30 transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-6 text-[15px] leading-relaxed text-black/60">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
