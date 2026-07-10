import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for the Docker runtime image (see Dockerfile):
  // `next build` emits .next/standalone/server.js with only the needed files.
  output: "standalone",
  // The staging workshop serves `next dev` through the Apache proxy on
  // staging.thebeach.one — allow that origin for dev assets/HMR.
  allowedDevOrigins: ["staging.thebeach.one"],
};

export default nextConfig;
