import type { Metadata } from "next";
import EventsPage from "@/components/pages/EventsPage";
import { altLang } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";

export const metadata: Metadata = {
  alternates: altLang("/events", "/en/events", "en"),
  title: eventsDict.en.meta.title,
  description: eventsDict.en.meta.description,
  openGraph: { title: eventsDict.en.meta.ogTitle, description: eventsDict.en.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <EventsPage locale="en" />;
}
