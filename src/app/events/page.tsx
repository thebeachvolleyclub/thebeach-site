import type { Metadata } from "next";
import EventsPage from "@/components/pages/EventsPage";
import { altLang } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/events", "/en/events", "sv"),
  title: eventsDict.sv.meta.title,
  description: eventsDict.sv.meta.description,
  openGraph: og("/events", eventsDict.sv.meta.ogTitle, eventsDict.sv.meta.ogDescription),
};

export default function Page() {
  return <EventsPage locale="sv" />;
}
