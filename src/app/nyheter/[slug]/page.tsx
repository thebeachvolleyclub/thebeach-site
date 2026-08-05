import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import ArticleBody from "@/components/nyheter/ArticleBody";
import { allArticles, articleBySlug, formatDatum } from "@/lib/nyheter";
import { og } from "@/lib/seo";

// Resultat articles are published independently of website deployments. Resolve
// every article request at runtime so a newly published slug can never inherit a
// build-time 404. The article lookup itself bypasses the remote-list cache.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await articleBySlug(slug);
  if (!a) return {};
  return {
    title: `${a.title} | The Beach`,
    description: a.ingress,
    alternates: { canonical: `/nyheter/${slug}` },
    openGraph: og(`/nyheter/${slug}`, a.title, a.ingress, {
      type: "article",
      ...(a.hero ? { image: a.hero.src, imageAlt: a.hero.alt } : {}),
    }),
  };
}

export default async function ArtikelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await articleBySlug(slug);
  if (!a) notFound();

  const others = (await allArticles()).filter((x) => x.slug !== a.slug).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.ingress,
    datePublished: a.datum,
    dateModified: a.uppdaterad ?? a.datum,
    image: a.hero
      ? (a.hero.src.startsWith("http") ? a.hero.src : `https://thebeach.one${a.hero.src}`)
      : "https://thebeach.one/opengraph-image.png",
    author: { "@type": "Organization", name: "The Beach", url: "https://thebeach.one" },
    publisher: {
      "@type": "Organization",
      name: "The Beach",
      url: "https://thebeach.one",
      logo: { "@type": "ImageObject", url: "https://thebeach.one/opengraph-image.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://thebeach.one/nyheter/${a.slug}` },
    ...(a.taggar ? { keywords: a.taggar.join(", ") } : {}),
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <Navbar />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-black px-5 pb-14 pt-36 sm:px-10 lg:px-14 lg:pb-20">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-lime/10 blur-[120px]" />
          <div className="relative z-10 mx-auto w-full max-w-[1500px]">
            <Reveal>
              <p className="eyebrow mb-4">
                {a.kicker} · <time dateTime={a.datum}>{formatDatum(a.datum)}</time>
              </p>
              <h1 className="max-w-[18ch] font-display text-[clamp(2.2rem,8vw,5rem)] leading-[0.92] text-bone">
                {a.title}
              </h1>
              {a.taggar && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {a.taggar.map((t) => (
                    <span key={t} className="bg-lime px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </section>

        <section className="bg-cream px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="text-[19px] font-semibold leading-relaxed text-black">{a.ingress}</p>

              {a.hero && (
                <figure className="my-10">
                  <img src={a.hero.src} alt={a.hero.alt} className="h-auto w-full rounded-lg" />
                  {(a.hero.caption || a.hero.credit) && (
                    <figcaption className="mt-3 text-[13px] leading-relaxed text-black/45">
                      {a.hero.caption}
                      {a.hero.credit && (
                        <span className="text-black/35">
                          {a.hero.caption ? " " : ""}Foto: {a.hero.credit}.
                        </span>
                      )}
                    </figcaption>
                  )}
                </figure>
              )}

              <ArticleBody body={a.body} />
            </Reveal>

            <Reveal delay={0.06} className="mt-14 flex flex-col items-start gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-black/40">
                Frågor? Mejla{" "}
                <a href="mailto:boka@thebeach.one" className="font-semibold text-black underline underline-offset-4">
                  boka@thebeach.one
                </a>
              </p>
              <Link
                href="/nyheter"
                className="shrink-0 cursor-pointer bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                ← Alla nyheter
              </Link>
            </Reveal>
          </div>
        </section>

        {others.length > 0 && (
          <section className="bg-bone px-5 py-14 sm:px-8 lg:px-14">
            <div className="mx-auto w-full max-w-[1100px]">
              <h2 className="mb-8 font-display text-[clamp(1.4rem,4vw,2rem)] uppercase leading-[1] text-black">
                Mer från The Beach
              </h2>
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((o) => (
                  <Link key={o.slug} href={`/nyheter/${o.slug}`} className="group block">
                    {o.hero && (
                      <img src={o.hero.src} alt={o.hero.alt} className="mb-4 aspect-[3/2] h-auto w-full rounded-lg object-cover" />
                    )}
                    <p className="eyebrow mb-2 text-black/40">{formatDatum(o.datum)}</p>
                    <h3 className="font-display text-[1.25rem] uppercase leading-[1.05] text-black transition-colors group-hover:text-black/60">
                      {o.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
