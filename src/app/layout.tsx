import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import MobileBookingBar from "@/components/MobileBookingBar";
import JsonLd from "@/components/JsonLd";
import DesktopStickies from "@/components/DesktopStickies";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";

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
    siteName: "The Beach",
    title: "The Beach — Sommar året runt",
    description:
      "Beachvolley & strandevent året runt i Huddinge, Stockholm. Boka bana, träna eller fira ditt event på sanden.",
    type: "website",
  },
};


/** WebSite-schema — styr sajtnamnet i Googles sökresultat ("The Beach",
 *  inte bolagsnamnet Beachhallen Tropical). */
const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://thebeach.one/#website",
  name: "The Beach",
  alternateName: ["The Beach Huddinge", "The Beach Stockholm"],
  url: "https://thebeach.one",
  publisher: { "@id": "https://thebeach.one/#business" },
  inLanguage: "sv-SE",
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
        {/* Consent Mode v2 — default denied INNAN GTM laddar. CookieConsent-bannern uppdaterar. */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('cookie_consent')==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});dataLayer.push({event:'consent_granted'});}}catch(e){}`}
        </Script>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-K3J7NWXJ');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-base text-bone">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K3J7NWXJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <JsonLd data={WEBSITE_LD} />
        <JsonLd data={SITE_LD} />
        <SmoothScroll />
        <ScrollProgress />
        {children}
        <MobileBookingBar />
        <DesktopStickies />
        <CookieConsent />
      </body>
    </html>
  );
}
