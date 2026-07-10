import type { Metadata } from "next";
import { screenEvents } from "@/lib/kalender";
import SkarmRotator from "@/components/SkarmRotator";

export const metadata: Metadata = {
  title: "Skärmslinga — The Beach",
  robots: { index: false },
};

/**
 * /skarm — auto-roterande slinga för Smartsign. Peka skärmen hit,
 * så visas alla händelser med skarm: true, 12 sekunder per bild.
 */
export default function SkarmPage() {
  const items = screenEvents().map(({ month, ev }) => ({
    month,
    day: ev.day,
    wd: ev.wd,
    title: ev.title,
    badge: ev.badge,
    text: ev.beskrivning ?? ev.meta,
  }));
  return <SkarmRotator items={items} />;
}
