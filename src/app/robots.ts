import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/skarm", "/skarm/"] },
    sitemap: "https://thebeach.one/sitemap.xml",
    host: "https://thebeach.one",
  };
}
