import type { Metadata } from "next";
import { mergedScreenEvents } from "@/lib/profixio";
import SkarmRotator from "@/components/SkarmRotator";

// Skärmslingan får inte fortsätta visa inställda app-aktiviteter i sex timmar.
// Profixio har separat 6 h TTL.
export const revalidate = 60;


export const metadata: Metadata = {
  title: "Skärmslinga — The Beach",
  robots: { index: false },
};

/**
 * /skarm — auto-roterande slinga för Smartsign. Peka skärmen hit,
 * så visas alla händelser med skarm: true, 12 sekunder per bild.
 */
export default async function SkarmPage() {
  const items = (await mergedScreenEvents()).map(({ month, ev }) => ({
    month,
    day: ev.day,
    wd: ev.wd,
    title: ev.title,
    badge: ev.badge,
    text: ev.beskrivning ?? ev.meta,
  }));
  return <SkarmRotator items={items} />;
}
