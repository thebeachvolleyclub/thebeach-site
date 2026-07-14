import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { screenEvents } from "@/lib/kalender";
import { mergedBySlug } from "@/lib/profixio";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;


export const metadata: Metadata = { robots: { index: false } };

export function generateStaticParams() {
  return screenEvents()
    .filter((x) => x.ev.slug)
    .map((x) => ({ slug: x.ev.slug as string }));
}

/**
 * SKÄRMVY — 1920×1080 för Smartsign-slingan i anläggningen.
 * En URL per händelse som markerats med skarm: true i lib/kalender.ts.
 */
export default async function SkarmEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hit = await mergedBySlug(slug);
  if (!hit || !hit.ev.skarm) notFound();
  const { month, ev } = hit;

  return (
    <div className="relative flex h-screen w-screen flex-col justify-between overflow-hidden bg-[#14160F] p-[4vw]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true">
        <g fill="none" stroke="#D8FF77" strokeWidth="1.3">
          <path d="M0 90 Q300 40 600 90 T1200 90" />
          <path d="M0 210 Q300 160 600 210 T1200 210" />
          <path d="M0 330 Q300 280 600 330 T1200 330" />
          <path d="M0 450 Q300 400 600 450 T1200 450" />
        </g>
      </svg>
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-display text-[2vw] uppercase text-lime">The Beach</span>
        <span className="bg-lime px-[1.2vw] py-[0.5vw] text-[1.1vw] font-bold uppercase tracking-[0.15em] text-black">
          {ev.badge}
        </span>
      </div>
      <div className="relative z-10">
        <p className="mb-[1vw] text-[1.6vw] font-bold uppercase tracking-[0.25em] text-lime">
          {ev.wd} {ev.day} {month}
        </p>
        <h1 className="font-display text-[7vw] uppercase leading-[0.9] text-white">
          {ev.title}
        </h1>
        <p className="mt-[1.5vw] max-w-[60vw] text-[1.8vw] leading-snug text-white/60">
          {ev.beskrivning ?? ev.meta}
        </p>
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[1.4vw] text-white/40">thebeach.se/kalender</span>
        <span className="text-[1.4vw] text-white/40">Novavägen 35 · Huddinge</span>
      </div>
    </div>
  );
}
