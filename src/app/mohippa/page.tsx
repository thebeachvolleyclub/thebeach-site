import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";

export const metadata: Metadata = {
  title: "Möhippa i Stockholm — The Beach | Strandfest, mat och bubbel inomhus",
  description:
    "Möhippan på stranden mitt i Stockholm — beachvolleyturnering, bubbel och mat i loungen, 25 grader året runt. Färdiga koncept från 745 kr/person i Huddinge. Skicka förfrågan.",
  alternates: { canonical: "/mohippa" },
};

export default function MohippaPage() {
  return (
    <CorporateLanding
      eyebrow="Möhippa"
      paket="privat"
      planeraHref="/events/privat"
      title={<>Möhippan hon minns<br /><span className="italic-accent">för alltid</span></>}
      intro="En strand, hela gänget och 25 grader — oavsett vad vädret tycker. Beachvolley, bubbel och mat i loungen, allt fixat åt er."
      lead="Möhippan ska överraska. En inomhusstrand mitt i Stockholm — samma sand som OS-guldmedaljörerna tränar på — gör precis det. Vi fixar hela dagen: en turnering med gänget (nivå spelar ingen roll, instruktören löser det), bubbel och mat i loungen och tid att bara vara. Välj ett färdigt koncept — Las Palmas, Algarve eller Miami — så sköter vi resten. Femton minuter från Stockholm C, lika magiskt i februari som i juni."
      included={[
        "Beachvolleyturnering med instruktör — alla nivåer, alla med",
        "Bubbel, mat och dryck i loungen — tapas, buffé eller BBQ, eget kök och bar",
        "Färdiga koncept: Las Palmas 745, Algarve 945, Miami 1195 kr per person",
        "Pris till dagens Queen of The Beach",
        "Bygg ut till helkväll med mer mat, dryck och tid i sanden",
        "Omklädningsrum, duschar och all utrustning ingår — 25°C året runt",
      ]}
      why={[{ h: "Något hon inte väntar sig", p: "Spa och brunch har alla gjort. En strand mitt i vintern är en överraskning som faktiskt överraskar." }, { h: "Funkar för alla i gänget", p: "Sport-tjejen, soffatjejen och blivande svärmor — instruktören ser till att alla är med och att det blir skratt." }, { h: "Ni kommer, vi fixar resten", p: "Aktivitet, bubbel och mat i ett färdigt koncept. En förfrågan så sätter vi ihop hela dagen — ni behöver inte planera en enda detalj." }]}
      faqs={[
        { q: "Vad kostar en möhippa hos er?", a: "Vi kör färdiga koncept med aktivitet, mat och dryck: Las Palmas 745 kr/person, Algarve 945 kr/person (mest bokat) och Miami 1195 kr/person för helkväll. Priser inkl. moms för privatpersoner. Skicka en förfrågan så får ni ett upplägg och totalpris för just er grupp." },
        { q: "Vad ingår i ett koncept?", a: "Beachvolleyturnering med instruktör plus bubbel och mat i loungen — nivån på maten och drycken skiljer paketen åt. Vi skräddarsyr efter grupp, allergier och hur länge ni vill stanna." },
        { q: "Hur många kan vi vara?", a: "Från ett litet gäng upp till stora sällskap — vi har 10 inomhusbanor och en lounge, och tar event för 10 till 900 personer." },
        { q: "Ingen av oss har spelat beachvolley — funkar det?", a: "Ja, det är snarare regel än undantag. Instruktören anpassar nivån och gör turnering av det — poängen är skratten, inte tekniken." },
        { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar med förslag och pris. Eller mejla boka@thebeach.one." },
      ]}
    />
  );
}
