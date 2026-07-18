import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for the Docker runtime image (see Dockerfile):
  // `next build` emits .next/standalone/server.js with only the needed files.
  output: "standalone",
  // The staging workshop serves `next dev` through the Apache proxy on
  // staging.thebeach.one — allow that origin for dev assets/HMR.
  allowedDevOrigins: ["staging.thebeach.one", "beachapps-dev.tailde130d.ts.net"],
  // Gamla WordPress-adresser (thebeach.se) 301:as path-bevarande hit av
  // Loopia — mappa dem till rätt nya sidor så länkkraften inte dör i 404.
  async redirects() {
    return [
      { source: "/hem", destination: "/", permanent: true },
      { source: "/spela_beachvolley", destination: "/trana", permanent: true },
      { source: "/spela_beachvolley/:path*", destination: "/trana", permanent: true },
      { source: "/category/traning", destination: "/trana", permanent: true },
      { source: "/category/tavling", destination: "/kalender", permanent: true },
      { source: "/category/:path*", destination: "/", permanent: true },
      { source: "/hitta", destination: "/om-oss", permanent: true },
      { source: "/event", destination: "/events", permanent: true },
      { source: "/event/:path*", destination: "/events", permanent: true },
      // Sök-alias: julfest → julbordssidan (samma erbjudande).
      { source: "/julfest", destination: "/julbord", permanent: true },
    ];
  },
};

export default nextConfig;
