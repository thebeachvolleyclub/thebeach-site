import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Ticker from "@/components/Ticker";
import TranaHero from "@/components/trana/TranaHero";
import CourseLadder from "@/components/trana/CourseLadder";
import PhotoMarquee from "@/components/trana/PhotoMarquee";
import PathFinder from "@/components/trana/PathFinder";
import TrainingGroups from "@/components/trana/TrainingGroups";
import YouthTraining from "@/components/trana/YouthTraining";
import PtGroup from "@/components/trana/PtGroup";
import SchoolsCompanies from "@/components/trana/SchoolsCompanies";
import Membership from "@/components/trana/Membership";
import Coaches from "@/components/trana/Coaches";
import TranaCTA from "@/components/trana/TranaCTA";
import type { Locale } from "@/lib/i18n";

export default function TranaPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        {/* 1. Hero — bg-black (dark) */}
        <TranaHero locale={locale} />
        <Ticker locale={locale} />
        {/* 1b. Fotoremsa — folk som tränar (dra för att styra) */}
        <PhotoMarquee locale={locale} />
        {/* 1c. Hitta din väg — bg-panel (dark) */}
        <PathFinder locale={locale} />
        {/* 2. Kursstegen — bg-cream (light) */}
        <CourseLadder locale={locale} />
        {/* 3. Träningsgrupper — bg-panel (dark) */}
        <TrainingGroups locale={locale} />
        {/* 4. Barn & ungdom — bg-mint (accent/light) */}
        <YouthTraining locale={locale} />
        {/* 5. PT-grupp — bg-black (dark) */}
        <PtGroup locale={locale} />
        {/* 6. Skolor & företag — bg-cream (light) */}
        <SchoolsCompanies locale={locale} />
        {/* 7. Coacher — bg-black (dark) */}
        <Coaches locale={locale} />
        {/* 8. Bli medlem — bg-cream (light) */}
        <Membership locale={locale} />
        {/* 9. CTA — bg-lime (accent/light) */}
        <TranaCTA locale={locale} />
        <Newsletter locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
