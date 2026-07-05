import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import MobileBookingBar from "@/components/MobileBookingBar";
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
  metadataBase: new URL("https://thebeach.se"),
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
        <SmoothScroll />
        <ScrollProgress />
        {children}
        <MobileBookingBar />
        <DesktopStickies />
      </body>
    </html>
  );
}
