import type { Metadata } from "next";
import EventsPage from "@/components/pages/EventsPage";
import { altLang } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";

export const metadata: Metadata = {
  alternates: altLang("/events", "/en/events", "sv"),
  title: eventsDict.sv.meta.title,
  description: eventsDict.sv.meta.description,
  openGraph: { title: eventsDict.sv.meta.ogTitle, description: eventsDict.sv.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <EventsPage locale="sv" />;
}
