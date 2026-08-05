import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { allArticles, formatDatum } from "@/lib/nyheter";
import { og } from "@/lib/seo";

const TITLE = "Nyheter | The Beach";
const DESC =
  "Resultat, mästerskap och livet i sanden. Nyheter från The Beach i Huddinge — Sveriges guldrikaste beachvolleyklubb och träningsbas för landslaget.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/nyheter" },
  openGraph: og("/nyheter", "Nyheter från The Beach", DESC),
};

export default function Page() {
  const articles = allArticles();
  const [lead, ...rest] = articles;

  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Nyheter från The Beach",
    description: DESC,
    url: "https://thebeach.one/nyheter",
    hasPart: articles.map((a) => ({
      "@type": "NewsArticle",
      headline: a.title,
      datePublished: a.datum,
      url: `https://thebeach.one/nyheter/${a.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={listLd} />
      <Navbar />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-black px-5 pb-14 pt-36 sm:px-10 lg:px-14 lg:pb-20">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-lime/10 blur-[120px]" />
          <div className="relative z-10 mx-auto w-full max-w-[1500px]">
            <Reveal>
              <p className="eyebrow mb-4">The Beach</p>
              <h1 className="font-display text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.9] text-bone">
                Nyheter
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-bone/55">
                Resultat, mästerskap och livet i sanden.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-cream px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto w-full max-w-[1100px]">
            {!lead && (
              <p className="text-[17px] text-black/50">Inga nyheter publicerade än.</p>
            )}

            {lead && (
              <Reveal>
                <Link href={`/nyheter/${lead.slug}`} className="group block">
                  <article className="grid gap-7 sm:grid-cols-[1.15fr_1fr] sm:items-center">
                    {lead.hero && (
                      <img
                        src={lead.hero.src}
                        alt={lead.hero.alt}
                        className="h-auto w-full rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="eyebrow mb-3 text-black/40">
                        {lead.kicker} · {formatDatum(lead.datum)}
                      </p>
                      <h2 className="font-display text-[clamp(1.8rem,5vw,2.8rem)] uppercase leading-[0.95] text-black transition-colors group-hover:text-black/60">
                        {lead.title}
                      </h2>
                      <p className="mt-4 text-[16px] leading-relaxed text-black/60">
                        {lead.ingress}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-black">
                        Läs artikeln <span aria-hidden="true">&rarr;</span>
                      </span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="mt-16 grid gap-x-8 gap-y-12 border-t border-black/10 pt-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a, i) => (
                  <Reveal key={a.slug} delay={0.04 * i}>
                    <Link href={`/nyheter/${a.slug}`} className="group block">
                      {a.hero && (
                        <img
                          src={a.hero.src}
                          alt={a.hero.alt}
                          className="mb-5 aspect-[3/2] h-auto w-full rounded-lg object-cover"
                        />
                      )}
                      <p className="eyebrow mb-2 text-black/40">{formatDatum(a.datum)}</p>
                      <h3 className="font-display text-[1.35rem] uppercase leading-[1.05] text-black transition-colors group-hover:text-black/60">
                        {a.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-black/55">
                        {a.ingress.length > 140 ? `${a.ingress.slice(0, 140).trim()}…` : a.ingress}
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
