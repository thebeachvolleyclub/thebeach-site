import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import MobileBookingBar from "@/components/MobileBookingBar";
import JsonLd from "@/components/JsonLd";
import DesktopStickies from "@/components/DesktopStickies";

// Display: Acorn — the brand's bold athletic display face (self-hosted)
const acorn = localFont({
  src: "./fonts/acorn-8.ttf",
  variable: "--font-acorn",
  display: "swap",
});

// Body: Titillium Web — the brand's body typeface
const titillium = Titillium_Web({
  variable: "--font-titillium",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thebeach.one"),
  // Safari auto-links phone-like text (e.g. org.nr in the footer) before React
  // hydrates, causing hydration mismatches on iOS. Explicit tel: links still work.
  formatDetection: { telephone: false },
  title: "The Beach — Beachvolley & strandevent året runt",
  description:
    "Stockholms hem för beachvolley. 17 banor inomhus & utomhus i Huddinge. Spela, träna och fira — sommar året runt. Alla är välkomna.",
  openGraph: {
    title: "The Beach — Sommar året runt",
    description:
      "Beachvolley & strandevent året runt i Huddinge, Stockholm. Boka bana, träna eller fira ditt event på sanden.",
    type: "website",
  },
};


const SITE_LD = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "@id": "https://thebeach.one/#business",
  name: "The Beach",
  url: "https://thebeach.one",
  logo: "https://thebeach.one/media/logo.png",
  image: "https://thebeach.one/opengraph-image.png",
  description:
    "Stockholms hem för beachvolley och strandevent — 3 000 m² inomhus-beacharena i Huddinge. 10 inomhusbanor och 7 utomhus, sommar året runt. Event, kickoff, konferens och teambuilding för 10–900 gäster.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Novavägen 35",
    postalCode: "141 44",
    addressLocality: "Huddinge",
    addressRegion: "Stockholm",
    addressCountry: "SE",
  },
  areaServed: "Stockholm",
  priceRange: "$$",
  sport: "Beach volleyball",
  sameAs: [
    "https://www.instagram.com/thebeach_se/",
    "https://www.facebook.com/beachvolleyboll/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${acorn.variable} ${titillium.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" as="image" href="/media/hero-sunset.webp" fetchPriority="high" />
      </head>
      <body className="min-h-full flex flex-col bg-base text-bone">
        <JsonLd data={SITE_LD} />
        <SmoothScroll />
        <ScrollProgress />
        {children}
        <MobileBookingBar />
        <DesktopStickies />
      </body>
    </html>
  );
}
