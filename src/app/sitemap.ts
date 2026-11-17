import type { MetadataRoute } from "next";
import { getArticles, getAtlasEntries, getExperiments, getLibraryItems, getTags } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const sections = ["/", "/ideas", "/atlas", "/experiments", "/library", "/journal", "/about", "/tags"].map((path) => ({
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
  const experiments = getExperiments().map((e) => ({ url: absoluteUrl(e.url), priority: 0.6 }));
  const library = getLibraryItems().map((l) => ({ url: absoluteUrl(l.url), priority: 0.5 }));
  const tags = getTags().map((t) => ({ url: absoluteUrl(`/tags/${t.slug}`), priority: 0.4 }));
  return [...sections, ...articles, ...places, ...experiments, ...library, ...tags];
}
