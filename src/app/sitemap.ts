import type { MetadataRoute } from "next";
import { allEvents } from "@/lib/kalender";

const base = "https://thebeach.one";
const staticPaths = [
  "", "/boka", "/events", "/trana", "/kalender", "/foreningen", "/faq",
  "/skola", "/barnkalas", "/julbord", "/om-oss", "/om-beachvolley",
  "/avanmalan", "/andringsanmalan",
  "/konferens", "/kickoff", "/teambuilding", "/foretagsevent",
  "/en", "/en/events", "/en/book", "/en/school", "/en/about", "/en/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const events = allEvents()
    .filter((e) => e.ev.slug)
    .map((e) => ({
      url: `${base}/kalender/${e.ev.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  return [...pages, ...events];
}
