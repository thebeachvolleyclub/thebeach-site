import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";

export const metadata: Metadata = {
  title: "Svensexa i Stockholm — The Beach | Beachvolley, mat och fest inomhus",
  description:
    "Svensexan på stranden — beachvolleyturnering, mat och dryck och 25 grader mitt i Stockholm, året runt. Färdiga koncept från 745 kr/person i Huddinge. Skicka förfrågan.",
  alternates: { canonical: "/svensexa" },
};

export default function SvensexaPage() {
  return (
    <CorporateLanding
      eyebrow="Svensexa"
      paket="privat"
      planeraHref="/events/privat"
      title={<>Svensexan med<br /><span className="italic-accent">sand mellan tårna</span></>}
      intro="Samla gänget på en strand — oavsett årstid. Beachvolleyturnering, mat och dryck och en kväll brudgummen aldrig glömmer."
      lead="En svensexa ska vara något han inte väntar sig. En inomhusstrand i 25 grader — där OS-guldmedaljörerna tränar — brukar göra jobbet. Vi fixar hela dagen åt er: turnering med instruktör (ingen behöver ha spelat förut), mat och dryck i loungen och tid att bara hänga. Välj ett färdigt koncept — Las Palmas, Algarve eller Miami — så sköter vi resten. 15 minuter från Stockholm C, lika bra i november som i juni."
      included={[
        "Beachvolleyturnering med instruktör — alla nivåer, alla med från första bollen",
        "Mat och dryck i loungen — tapas, buffé eller BBQ, eget kök och full bar",
        "Färdiga koncept: Las Palmas 745, Algarve 945, Miami 1195 kr per person",
        "Pris till dagens King of The Beach",
        "Bygg ut till helkväll med mer mat, dryck och tid i sanden",
        "Omklädningsrum, duschar och all utrustning ingår — 25°C året runt",
      ]}
      why={[{ h: "Något han inte väntar sig", p: "Alla har gjort paddel och öl. En strand mitt i vintern — eller en regnig lördag i juli — är en annan historia." }, { h: "Alla kan vara med", p: "Beachvolley med blandad nivå funkar. Instruktören ser till att även den som aldrig rört en boll får vara hjälte." }, { h: "Ni kommer, vi fixar resten", p: "Aktivitet, mat och dryck i ett färdigt koncept. En förfrågan så sätter vi ihop hela upplägget — ni behöver inte planera en enda detalj." }]}
      faqs={[
        { q: "Vad kostar en svensexa hos er?", a: "Vi kör färdiga koncept med aktivitet, mat och dryck: Las Palmas 745 kr/person, Algarve 945 kr/person (mest bokat) och Miami 1195 kr/person för helkväll. Priser inkl. moms för privatpersoner. Skicka en förfrågan så får ni ett upplägg och totalpris för just er grupp." },
        { q: "Vad ingår i ett koncept?", a: "Beachvolleyturnering med instruktör plus mat och dryck i loungen — nivån på maten skiljer paketen åt. Vi skräddarsyr efter grupp, allergier och hur länge ni vill stanna." },
        { q: "Hur många kan vi vara?", a: "Från ett litet gäng upp till stora sällskap — vi har 10 inomhusbanor och en lounge, och tar event för 10 till 900 personer." },
        { q: "Ingen av oss har spelat beachvolley — funkar det?", a: "Ja. Med instruktör blir det turnering av det oavsett nivå, och poängen är att ha kul — inte att spela snyggt." },
        { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar med förslag och pris. Eller mejla boka@thebeach.one." },
      ]}
    />
  );
}
