import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The section was called Atlas until November 2026. Old links keep working.
  async redirects() {
    return [
      { source: "/atlas", destination: "/nomading", permanent: true },
      { source: "/atlas/:slug", destination: "/nomading/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
