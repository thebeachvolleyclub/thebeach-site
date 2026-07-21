import type { MetadataRoute } from "next";
import { mergedAllEvents } from "@/lib/profixio";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;


const base = "https://thebeach.one";
const staticPaths = [
  "", "/boka", "/events", "/lokalen", "/trana", "/kalender", "/foreningen", "/faq",
  "/skola", "/barnkalas", "/julbord", "/om-oss", "/om-beachvolley",
  "/avanmalan", "/andringsanmalan",
  "/hallbarhet", "/beachtravels", "/presentkort",
  "/jobb",
  "/konferens", "/kickoff", "/teambuilding", "/foretagsevent",
  "/firmafest", "/svensexa", "/mohippa",
  "/en", "/en/events", "/en/book", "/en/school", "/en/about", "/en/faq",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : ["/lokalen", "/events"].includes(p) ? 0.9 : 0.7,
  }));
  const events = (await mergedAllEvents())
    .filter((e) => e.ev.slug)
    .map((e) => ({
      url: `${base}/kalender/${e.ev.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  return [...pages, ...events];
}
