import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for the Docker runtime image (see Dockerfile):
  // `next build` emits .next/standalone/server.js with only the needed files.
  output: "standalone",
};

export default nextConfig;
