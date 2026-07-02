import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Integritetspolicy — The Beach",
  description: "Hur Beachhallen Tropical AB behandlar personuppgifter.",
  robots: { index: false },
};

export default function IntegritetsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream px-5 pb-24 pt-36 sm:px-8 lg:px-14">
        <Reveal className="mx-auto max-w-3xl">
          <h1 className="mb-8 font-display text-[clamp(2.25rem,8vw,3.5rem)] leading-[0.9] text-black">
            Integritetspolicy
          </h1>
          <div className="space-y-6 text-[15px] leading-relaxed text-black/65">
            <p>
              Personuppgiftsansvarig: Beachhallen Tropical AB (org.nr
              556699-2839), Novavägen 35, 141 44 Huddinge.
            </p>
            <p>
              Vi behandlar personuppgifter du lämnar när du skickar en
              förfrågan, bokar aktivitet eller kontaktar oss — normalt namn,
              kontaktuppgifter och det du skriver till oss. Uppgifterna används
              för att hantera din bokning eller förfrågan, och sparas inte
              längre än nödvändigt för det ändamålet eller vad bokförings- och
              annan lagstiftning kräver.
            </p>
            <p>
              Bokning av bana och kurser sker via MATCHi, som är
              personuppgiftsansvarig för behandlingen i sin tjänst. Vi säljer
              aldrig dina uppgifter vidare.
            </p>
            <p>
              Du har rätt att begära registerutdrag, rättelse eller radering av
              dina uppgifter. Kontakta oss på{" "}
              <a href="mailto:boka@thebeach.se" className="underline underline-offset-4">boka@thebeach.se</a>{" "}
              så hjälper vi dig. Klagomål på vår behandling kan lämnas till
              Integritetsskyddsmyndigheten (IMY).
            </p>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
