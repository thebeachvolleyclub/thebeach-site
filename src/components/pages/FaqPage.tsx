import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";
import JsonLd from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n";
import { faqDict } from "@/lib/i18n/faq";

export default function FaqPage({ locale }: { locale: Locale }) {
  const t = faqDict[locale];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
      },
    })),
  };
  return (
    <>
      <JsonLd data={faqLd} />
      <Navbar locale={locale} />
      <main className="flex-1">
        <PageHero
          minH="min-h-[46svh]"
          eyebrow={t.hero.eyebrow}
          title={<>{t.hero.titleTop}<br /><span className="italic-accent">{t.hero.titleAccent}</span></>}
          intro={t.hero.intro}
        />
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            {t.items.map((f, i) => (
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
      <Footer locale={locale} />
    </>
  );
}
