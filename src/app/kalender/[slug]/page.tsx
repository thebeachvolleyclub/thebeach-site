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
        <section className="relative isolate overflow-hidden bg-base px-5 pb-14 pt-36 sm:px-10 lg:px-14 lg:pb-20">
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
              {ev.stycken?.map((stycke, i) => (
                <p key={i} className="mt-5 text-[17px] leading-relaxed text-black/70">
                  <RichText text={stycke} />
                </p>
              ))}
              {ev.cta && (
                <a
                  href={ev.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex cursor-pointer items-center gap-2 bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
                >
                  {ev.cta.label} <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </Reveal>
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
