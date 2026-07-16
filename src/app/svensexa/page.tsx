import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";

export const metadata: Metadata = {
  title: "Svensexa i Stockholm — The Beach | Beachvolley, sol och fest inomhus",
  description:
    "Svensexa på stranden — mitt i Stockholm, året runt. Beachvolley med gänget, mat och dryck i loungen och 25 grader oavsett väder. Från 840 kr per bana i Huddinge.",
  alternates: { canonical: "/svensexa" },
};

export default function SvensexaPage() {
  return (
    <CorporateLanding
      eyebrow="Svensexa"
      title={<>Svensexan med<br /><span className="italic-accent">sand mellan tårna</span></>}
      intro="Samla gänget på en strand — oavsett årstid. Beachvolley, skratt, mat och dryck i loungen. Brudgummen glömmer det aldrig."
      lead="En svensexa ska vara något han inte väntar sig. En inomhusstrand i 25 grader — där OS-guldmedaljörerna tränar — brukar göra jobbet. Kör en turnering med gänget (ingen behöver ha spelat förut), avsluta i loungen med mat och dryck, eller bygg ut till en hel kväll. Enkelt att boka, 15 minuter från Stockholm C, och det funkar lika bra i november som i juni."
      included={[
        "Banor för hela gänget — boka direkt online, från 840 kr per bana (1,5 h)",
        "Instruktör som leder turneringen om ni vill ha struktur på kaoset",
        "Mat och dryck i loungen — eget kök och bar",
        "Möjlighet att bygga ut till helkväll med eventpaket",
        "Omklädningsrum, duschar och bollar ingår alltid",
        "25°C och sol i taket — året runt, oavsett väder",
      ]}
      why={[{ h: "Något han inte väntar sig", p: "Alla har gjort paddel och öl. En strand mitt i vintern — eller en regnig lördag i juli — är en annan historia." }, { h: "Alla kan vara med", p: "Beachvolley med blandad nivå funkar. Instruktören ser till att även den som aldrig rört en boll får vara hjälte." }, { h: "Enkelt för planeraren", p: "Boka banor online på minuter, eller skicka en förfrågan så sätter vi ihop hela kvällen — mat, dryck och upplägg." }]}
      faqs={[
        { q: "Vad kostar en svensexa hos er?", a: "Enklaste varianten: boka banor direkt online från 840 kr per bana (1,5 h, upp till 8 personer per bana), pris inkl. moms. Vill ni ha mat, dryck och instruktör sätter vi ihop ett paket — som privatperson får du alltid totalpris inklusive moms i offerten." },
        { q: "Hur många kan vi vara?", a: "Från ett litet gäng på en bana till stora sällskap — vi har 10 inomhusbanor och lounge. Är ni fler än 20 rekommenderar vi en förfrågan så planerar vi upplägget tillsammans." },
        { q: "Ingen av oss har spelat beachvolley — funkar det?", a: "Ja. Med instruktör blir det turnering av det oavsett nivå, och poängen är att ha kul — inte att spela snyggt." },
        { q: "Kan vi äta och dricka på plats?", a: "Ja — vi har eget kök och bar. Från enklare tilltugg till middag i loungen med utsikt över banorna." },
        { q: "Hur bokar vi?", a: "Banor bokas direkt via MATCHi (max 7 dagar i förväg). För större sällskap, mat eller garanterad tid längre fram: skicka en förfrågan eller mejla boka@thebeach.one." },
      ]}
    />
  );
}
