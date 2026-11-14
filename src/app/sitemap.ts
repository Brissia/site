import type { MetadataRoute } from "next";
import { getArticles, getAtlasEntries } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const sections = ["/", "/ideas", "/atlas", "/experiments", "/library", "/journal", "/about"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const articles = getArticles().map((a) => ({
    url: absoluteUrl(a.url),
    lastModified: a.updatedDate ?? a.publishedDate,
    priority: 0.8,
  }));
  const places = getAtlasEntries().map((p) => ({ url: absoluteUrl(p.url), priority: 0.6 }));
  return [...sections, ...articles, ...places];
}
