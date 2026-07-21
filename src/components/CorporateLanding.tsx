import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import EventPhotoMarquee from "@/components/events/EventPhotoMarquee";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import SolarStats from "@/components/SolarStats";

export type Faq = { q: string; a: string };

export default function CorporateLanding({
  eyebrow,
  title,
  intro,
  lead,
  included,
  why,
  faqs,
  paket,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  lead: string;
  included: string[];
  why: { h: string; p: string }[];
  faqs: Faq[];
  paket?: string;
}) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const forfraganHref = paket
    ? `/events?paket=${paket}#forfragan`
    : "/events#forfragan";

  const cta = (
    <Link
      href={forfraganHref}
      className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
    >
      Skicka förfrågan <span aria-hidden="true">→</span>
    </Link>
  );

  return (
    <>
      <JsonLd data={faqLd} />
      <Navbar />
      <main className="flex-1">
        <PageHero eyebrow={eyebrow} title={title} intro={intro} minH="min-h-[52svh]" cta={cta} />
        <EventPhotoMarquee />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="text-[17px] leading-relaxed text-black/70">{lead}</p>
            </Reveal>
            <Reveal className="mt-10">
              <h2 className="mb-4 font-display text-2xl uppercase text-black">Det här ingår</h2>
              <ul className="border-t border-black/10">
                {included.map((it) => (
                  <li key={it} className="flex items-start gap-3 border-b border-black/10 py-3 text-[15px] leading-snug text-black/65">
                    <span className="shrink-0 pt-0.5 text-orange" aria-hidden="true">↗</span>
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-[1500px]">
            <Reveal className="mb-10">
              <p className="eyebrow mb-4">Därför The Beach</p>
            </Reveal>
            <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-3">
              {why.map((w) => (
                <Reveal key={w.h} className="border border-white/10 bg-white/[0.03] p-7 lg:p-9">
                  <h3 className="mb-3 font-display text-xl uppercase leading-none text-bone lg:text-2xl">{w.h}</h3>
                  <p className="text-sm leading-relaxed text-bone/55">{w.p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <SolarStats />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-6">
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">Vanliga frågor</h2>
            </Reveal>
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={Math.min(i * 0.03, 0.12)}>
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

        <section className="bg-lime px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto flex max-w-[1500px] flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <Reveal>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">Redo att boka?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">Skicka en förfrågan så återkommer vi inom 24 timmar med ett upplägg.</p>
            </Reveal>
            <Reveal delay={0.06} className="shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                <Link href={forfraganHref} className="inline-flex cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85">
                  Skicka förfrågan <span aria-hidden="true">→</span>
                </Link>
                <Link href="/lokalen" className="inline-flex cursor-pointer items-center gap-2 border border-black/25 px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:border-black">
                  Se lokalen
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
