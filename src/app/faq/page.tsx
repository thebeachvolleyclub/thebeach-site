import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";

export const metadata: Metadata = {
  alternates: {
    canonical: "/faq",
    languages: { sv: "/faq", en: "/en/faq", "x-default": "/faq" },
  },
  title: "Vanliga frågor — The Beach",
  description:
    "Allt du undrar inför besöket: bokning, utrustning, duschar, parkering, mat och priser. Hittar du inte svaret? Mejla boka@thebeach.one.",
};

const FAQ: { q: string; a: string }[] = [
  { q: "Hur bokar jag en bana?", a: "Banor bokas via vår [boka bana-sida](/boka). Ett vanligt pass är 1,5 timme. Event, skolbesök och grupper bokas via förfrågningsformuläret eller boka@thebeach.one." },
  { q: "Jag har aldrig spelat — kan jag ändå komma?", a: "Absolut. Grundkursen är byggd för nybörjare, och på prova-på-tillfällen och event behövs inga förkunskaper alls. Ta bara med träningskläder." },
  { q: "Vad behöver jag ta med?", a: "Bara dig själv och träningskläder. Bollar, nät och allt material finns på plats. Man spelar barfota i sanden — året runt, det är alltid varmt inne." },
  { q: "Finns duschar och omklädningsrum?", a: "Ja — 14 duschar och omklädningsrum finns i anläggningen." },
  { q: "Hur tar jag mig hit?", a: "Novavägen 35, 141 44 Huddinge. Pendeltåg till Flemingsberg eller Stuvsta och kort promenad, eller bil — det finns gott om parkering direkt vid hallen." },
  { q: "Finns det mat och dryck?", a: "Ja, vi har servering i loungen. För event ingår mat i paketen (Las Palmas, Algarve, Miami) och vi skräddarsyr gärna menyer för större sällskap." },
  { q: "Vad kostar ett event?", a: "Färdiga paket från 745 kr/person (Las Palmas). Mest bokad är Algarve, 945 kr/person. Konferenstillägg +395 kr/person. Företagspriser anges exklusive moms." },
  { q: "Kan barn spela hos er?", a: "Ja — vi har barn- och ungdomsträning, barnkalas (6–11 år) och tar emot skolklasser på vardagar. Se sidorna [Barnkalas](/barnkalas) och [Skolor](/skola)." },
  { q: "Hur avbokar jag träning eller kurs?", a: "Det beror på vad du vill avboka. Kurs (grund- eller fortsättningskurs): mejla boka@thebeach.one så snart du kan — kan din plats fyllas av någon annan får du behålla värdet tillgodo till nästa kursstart, och avbokar du i god tid innan kursen börjar krediterar vi dig. Träningsgrupp: då gäller villkoren du godkände i anmälan — läs [avanmälan & villkor](/avanmalan) och gör din avanmälan via formuläret där. Banbokning: avbokas direkt i MATCHi." },
  { q: "Jag är med i en träningsgrupp och är inte nöjd med gruppen. Hur går jag vidare?", a: "Fyll i en ändringsanmälan så jobbar vi på saken så snabbt vi kan. Känner du dig fel placerad nivåmässigt — prata först med din tränare efter passet och hör vad de tycker. Undvik att mejla bokningen eller hälsa via receptionen; det blir lätt missförstånd. Du behåller din plats tills något annat bestämts och meddelats skriftligt. Läs mer och gör din [ändringsanmälan](/andringsanmalan)." },
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
                  <p className="pb-6 text-[15px] leading-relaxed text-black/60"><RichText text={f.a} /></p>
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
