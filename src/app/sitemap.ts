import type { MetadataRoute } from "next";
import { mergedAllEvents } from "@/lib/profixio";
import { allArticles } from "@/lib/nyheter";
import { allCourseSlugs } from "@/lib/coursePageData";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;


const base = "https://thebeach.one";
const staticPaths = [
  "", "/boka", "/events", "/lokalen", "/trana", "/kalender", "/nyheter", "/foreningen", "/faq",
  "/skola", "/barnkalas", "/julbord", "/om-oss", "/om-beachvolley",
  "/avanmalan",
  "/hallbarhet", "/beachtravels", "/presentkort",
  "/jobb",
  "/events/planera", "/events/privat",
  "/konferens", "/kickoff", "/teambuilding", "/foretagsevent",
  "/firmafest", "/svensexa", "/mohippa",
  "/en", "/en/events", "/en/events/plan", "/en/membership", "/en/book", "/en/training", "/en/calendar", "/en/school", "/en/about", "/en/faq",
  "/en/venue", "/en/christmas-party", "/en/kids-party", "/en/sustainability",
  "/en/conference", "/en/kickoff", "/en/team-building", "/en/corporate-events", "/en/company-party",
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
  // Kurssidorna kommer från kurs-API:t och byts varje säsong — de får aldrig
  // ligga i staticPaths, då blir de kvar när kursen är slut.
  const courseSlugs = await allCourseSlugs();
  const courses = courseSlugs.flatMap((slug) =>
    [`/kurser/${slug}`, `/en/courses/${slug}`].map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  );
  const news = (await allArticles()).map((a) => ({
    url: `${base}/nyheter/${a.slug}`,
    lastModified: new Date(a.datum),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...courses, ...events, ...news];
}
