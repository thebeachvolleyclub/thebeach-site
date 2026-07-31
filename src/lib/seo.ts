import type { Metadata } from "next";

/**
 * OG-metadata per sida.
 *
 * Bakgrund: title/description sattes per sida, men og:*-taggarna ärvdes från
 * root-layouten — så varje länk som klistrades in i WhatsApp/LinkedIn visade
 * samma generiska "The Beach — Sommar året runt". `og()` ger varje sida egen
 * titel, text, URL och en unik, automatiskt genererad bild (/og-routen).
 *
 * Användning i en page.tsx:
 *   openGraph: og("/foreningen", dict.sv.meta.ogTitle, dict.sv.meta.ogDescription)
 *
 * Egen bild i stället för den genererade:
 *   openGraph: og("/jobb", titel, text, { image: "/media/…webp", imageWidth: 1200, imageHeight: 630 })
 */

/** Kortar en text till en rad som får plats på bilden, utan att kapa mitt i ett ord. */
export function ogSub(text: string, max = 125) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return `${cut.slice(0, stop > 40 ? stop : max).replace(/[.,;:\s]+$/, "")}…`;
}

/** URL till den dynamiskt genererade OG-bilden för en given rubrik/text. */
export function ogImageUrl(title: string, sub?: string) {
  const q = new URLSearchParams({ t: title });
  if (sub) q.set("s", ogSub(sub));
  return `/og?${q.toString()}`;
}

type OgOptions = {
  /** Egen bild i stället för den genererade (sökväg under /public). */
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  /** Egen text på bilden om description är för lång/teknisk. */
  imageSub?: string;
  locale?: "sv_SE" | "en_US";
  type?: "website" | "article";
};

export function og(
  path: string,
  title: string,
  description: string,
  opts: OgOptions = {},
): NonNullable<Metadata["openGraph"]> {
  const image = opts.image
    ? {
        url: opts.image,
        width: opts.imageWidth ?? 1200,
        height: opts.imageHeight ?? 630,
        alt: opts.imageAlt ?? title,
      }
    : {
        url: ogImageUrl(title, opts.imageSub ?? description),
        width: 1200,
        height: 630,
        alt: title,
      };

  return {
    title,
    description,
    url: path,
    siteName: "The Beach",
    type: opts.type ?? "website",
    locale: opts.locale ?? (path === "/en" || path.startsWith("/en/") ? "en_US" : "sv_SE"),
    images: [image],
  };
}
