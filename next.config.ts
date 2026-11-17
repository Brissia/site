import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // The section was called Atlas until November 2026. Old links keep working.
      { source: "/atlas", destination: "/nomading", permanent: true },
      { source: "/atlas/:slug", destination: "/nomading/:slug", permanent: true },
      // English has no prefix: /en/ideas is always /ideas.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  // Pages live in src/app/[lang]. Addresses without a language are English, served from /en without changing the URL.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en" },
        {
          source: "/:path((?!es/|es$|en/|en$|_next/|images/|downloads/|feed\\.xml$|robots\\.txt$|sitemap\\.xml$|icon\\.svg$|favicon\\.ico$).+)",
          destination: "/en/:path",
        },
      ],
    };
  },
};

export default nextConfig;
