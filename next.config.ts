import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Sanity's image CDN. Without this next/image rejects every CMS image with
    // "hostname is not configured" — which would only surface the first time
    // real content was published, not while the site runs on placeholders.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default config;
