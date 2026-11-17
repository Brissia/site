import type { MetadataRoute } from "next";
import { languages, localize } from "@/i18n";
import { getArticles, getAtlasEntries, getExperiments, getLibraryItems, getTags, getTalks } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

type Entry = { path: string; priority: number; lastModified?: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    ...["/", "/nomading", "/ideas", "/experiments", "/library", "/journal", ...(getTalks().length > 0 ? ["/speaking"] : []), "/about", "/graph", "/tags"].map((path) => ({
      path,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...getArticles().map((a) => ({ path: a.url, priority: 0.8, lastModified: a.updatedDate ?? a.publishedDate })),
    ...getAtlasEntries().map((p) => ({ path: p.url, priority: 0.6 })),
    ...getExperiments().map((e) => ({ path: e.url, priority: 0.6 })),
    ...getLibraryItems().map((l) => ({ path: l.url, priority: 0.5 })),
    ...getTags().map((t) => ({ path: `/tags/${t.slug}`, priority: 0.4 })),
  ];
  // Every page exists in both interface languages; each one points at the other.
  return entries.flatMap(({ path, priority, lastModified }) =>
    languages.map((lang) => ({
      url: absoluteUrl(localize(path, lang)),
      priority,
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages: Object.fromEntries(languages.map((l) => [l, absoluteUrl(localize(path, l))])) },
    })),
  );
}
