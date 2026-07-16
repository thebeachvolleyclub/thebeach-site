import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";

export const metadata: Metadata = {
  title: "Möhippa i Stockholm — The Beach | Strandfest inomhus, året runt",
  description:
    "Möhippa på stranden mitt i Stockholm — beachvolley med tjejgänget, bubbel och mat i loungen, 25 grader året runt. Från 840 kr per bana i Huddinge.",
  alternates: { canonical: "/mohippa" },
};

export default function MohippaPage() {
  return (
    <CorporateLanding
      eyebrow="Möhippa"
      title={<>Möhippan hon minns<br /><span className="italic-accent">för alltid</span></>}
      intro="En strand, hela gänget och 25 grader — oavsett vad vädret tycker. Beachvolley, skratt och bubbel i loungen."
      lead="Möhippan ska överraska. En inomhusstrand mitt i Stockholm — samma sand som OS- och VM-guldmedaljörerna tränar på — gör precis det. Spela en turnering med gänget (nivå spelar ingen roll, instruktören fixar det), och landa sedan i loungen med bubbel, mat och tid att bara vara. Femton minuter från Stockholm C, lika magiskt i februari som i juni."
      included={[
        "Banor för hela gänget — boka direkt online, från 840 kr per bana (1,5 h)",
        "Instruktör som leder lekar och turnering om ni vill",
        "Bubbel, mat och dryck i loungen — eget kök och bar",
        "Möjlighet att bygga ut till helkväll med eventpaket",
        "Omklädningsrum, duschar och bollar ingår alltid",
        "25°C och strandkänsla — året runt, oavsett väder",
      ]}
      why={[{ h: "Något hon inte väntar sig", p: "Spa och brunch har alla gjort. En strand mitt i vintern är en överraskning som faktiskt överraskar." }, { h: "Funkar för alla i gänget", p: "Sport-tjejen, soffatjejen och blivande svärmor — instruktören ser till att alla är med och att det blir skratt." }, { h: "Enkelt för er som planerar", p: "Boka banor online på minuter, eller skicka en förfrågan så sätter vi ihop hela dagen — aktivitet, mat och bubbel." }]}
      faqs={[
        { q: "Vad kostar en möhippa hos er?", a: "Enklaste varianten: boka banor direkt online från 840 kr per bana (1,5 h, upp till 8 personer per bana), pris inkl. moms. Vill ni ha mat, bubbel och instruktör sätter vi ihop ett paket — som privatperson får du alltid totalpris inklusive moms i offerten." },
        { q: "Hur många kan vi vara?", a: "Från ett litet gäng på en bana till stora sällskap. Är ni fler än 20 rekommenderar vi en förfrågan så planerar vi upplägget tillsammans." },
        { q: "Ingen av oss har spelat beachvolley — funkar det?", a: "Ja, det är snarare regel än undantag. Instruktören anpassar nivån och gör turnering av det — poängen är skratten, inte tekniken." },
        { q: "Kan vi ha bubbel och mat på plats?", a: "Ja — eget kök och bar. Från cava och tilltugg till middag i loungen med utsikt över banorna." },
        { q: "Hur bokar vi?", a: "Banor bokas direkt via MATCHi (max 7 dagar i förväg). För större sällskap, mat eller garanterad tid längre fram: skicka en förfrågan eller mejla boka@thebeach.one." },
      ]}
    />
  );
}
