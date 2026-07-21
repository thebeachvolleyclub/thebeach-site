import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { allEvents } from "@/lib/kalender";
import { mergedBySlug } from "@/lib/profixio";
import RichText from "@/components/RichText";
import JsonLd from "@/components/JsonLd";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;


export function generateStaticParams() {
  return allEvents()
    .filter((x) => x.ev.slug)
    .map((x) => ({ slug: x.ev.slug as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hit = await mergedBySlug(slug);
  if (!hit) return {};
  return {
    title: `${hit.ev.title} — ${hit.month} | The Beach`,
    description: hit.ev.beskrivning ?? hit.ev.meta,
  };
}

const MONTHS_SV: Record<string, string> = {
  januari: "01", februari: "02", mars: "03", april: "04", maj: "05", juni: "06",
  juli: "07", augusti: "08", september: "09", oktober: "10", november: "11", december: "12",
};
function eventStartDate(month: string, day: string): string | undefined {
  const [name, year] = month.split(" ");
  const mm = MONTHS_SV[name?.toLowerCase()];
  if (!mm || !year) return undefined;
  return `${year}-${mm}-${day.padStart(2, "0")}`;
}

const BADGE: Record<string, string> = {
  tournament: "bg-orange text-white",
  training: "bg-lime text-black",
  event: "bg-mint text-black",
  free: "bg-pink text-white",
  closed: "bg-black/10 text-black/40",
};

const TONE: Record<string, string> = {
  teal: "bg-teal text-white",
};

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hit = await mergedBySlug(slug);
  if (!hit) notFound();
  const { month, ev } = hit;
  const startDate = eventStartDate(month, ev.day);
  const isApp = slug.startsWith("app-");
  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    ...(startDate ? { startDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: ev.beskrivning ?? ev.meta,
    image: "https://thebeach.one/opengraph-image.png",
    location: {
      "@type": "Place",
      name: "The Beach",
      address: { "@type": "PostalAddress", streetAddress: "Novavägen 35", postalCode: "141 44", addressLocality: "Huddinge", addressCountry: "SE" },
    },
    organizer: { "@type": "Organization", name: "The Beach", url: "https://thebeach.one" },
  };

  return (
    <>
      <JsonLd data={eventLd} />
      <Navbar />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-black px-5 pb-14 pt-36 sm:px-10 lg:px-14 lg:pb-20">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-lime/10 blur-[120px]" />
          <div className="relative z-10 mx-auto w-full max-w-[1500px]">
            <Reveal>
              <p className="eyebrow mb-4">
                {ev.day} {month.toLowerCase()} · {ev.wd}
              </p>
              <h1 className="font-display text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.9] text-bone">
                {ev.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${ev.badgeTone ? TONE[ev.badgeTone] : BADGE[ev.type]}`}>
                  {ev.badge}
                </span>
                <span className="text-sm text-bone/50">{ev.meta}</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-cream px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="text-[17px] leading-relaxed text-black/70">
                <RichText text={ev.beskrivning ?? ev.meta} />
              </p>
              {ev.schema && (
                <div className="mt-8 border-l-2 border-lime pl-5">
                  {ev.schema.map((s, i) => (
                    <div key={i} className="flex gap-4 py-1.5 text-[15px] leading-relaxed">
                      <span className="w-28 shrink-0 font-semibold tabular-nums text-black">{s.tid}</span>
                      <span className="text-black/70">{s.vad}</span>
                    </div>
                  ))}
                </div>
              )}
              {ev.stycken?.map((stycke, i) => (
                <p key={i} className="mt-5 text-[17px] leading-relaxed text-black/70">
                  <RichText text={stycke} />
                </p>
              ))}
              {(ev.cta || ev.tvCta) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {ev.cta && (
                    <a
                      href={ev.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex cursor-pointer items-center gap-2 bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
                    >
                      {ev.cta.label} <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                  {ev.tvCta && (
                    <a
                      href={ev.tvCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex cursor-pointer items-center gap-2 border border-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-lime"
                    >
                      {ev.tvCta.label} <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                </div>
              )}
            </Reveal>
            {(isApp || ev.appCta) && (
              <Reveal delay={0.04}>
                <div className="mt-10 overflow-hidden rounded-2xl bg-mint">
                  <div className="grid items-center gap-6 p-7 sm:grid-cols-[1.1fr_1fr] sm:gap-8 sm:p-9">
                    <div>
                      <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">The Beach-appen</span>
                      <h2 className="mb-3 font-display text-[clamp(1.6rem,5vw,2.2rem)] uppercase leading-[0.95] text-black">Har du inte appen än?</h2>
                      <p className="mb-6 max-w-sm text-[15px] leading-[1.6] text-black/60">Det här passet — och alla speldejter, matchmaking och turneringar — lever i The Beach-appen. Ladda ner, hitta spel och missa inget.</p>
                      <div className="flex flex-wrap gap-3">
                        <a href="https://apps.apple.com/us/app/the-beach/id6759973444" target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center gap-2 bg-black px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-opacity hover:opacity-90">
                          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.94-.19 1.84-.86 3.19-.76 1.54.12 2.7.73 3.44 1.85-3.17 1.9-2.42 6.07.49 7.24-.6 1.5-1.36 2.98-2.2 3.84zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                          App Store
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.thebeachvolleyclub.thebeach" target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center gap-2 border border-black px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-white">
                          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4"><path d="M3.6 1.8 13.7 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1zm11.5 8.8L5.9 1.4l11.6 6.7-2.4 2.5zm3.2-2 2.9 1.7c.9.5.9 1.8 0 2.3l-2.9 1.7-2.7-2.9 2.7-2.8zM5.9 22.6l9.2-9.2 2.4 2.5-11.6 6.7z"/></svg>
                          Google Play
                        </a>
                      </div>
                    </div>
                    <img src="/media/app-trio.webp" alt="The Beach-appen — nyheter, resultat och evenemang" width={820} height={660} loading="lazy" className="mx-auto h-auto w-full max-w-[360px]" />
                  </div>
                </div>
              </Reveal>
            )}
            <Reveal delay={0.06} className="mt-10 flex flex-col items-start gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-black/40">
                Frågor? Mejla{" "}
                <a href="mailto:boka@thebeach.one" className="font-semibold text-black underline underline-offset-4">
                  boka@thebeach.one
                </a>
              </p>
              <Link
                href="/kalender#kommande"
                className="shrink-0 cursor-pointer bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                ← Hela kalendern
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
