import type { Metadata } from "next";
import EventsPage from "@/components/pages/EventsPage";
import { altLang } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/events", "/en/events", "en"),
  title: eventsDict.en.meta.title,
  description: eventsDict.en.meta.description,
  openGraph: og("/en/events", eventsDict.en.meta.ogTitle, eventsDict.en.meta.ogDescription),
};

export default function Page() {
  return <EventsPage locale="en" />;
}
