import type { Metadata } from "next";
import { site } from "@/data/site";
import { getDictionary, languages, localize, type Lang } from "@/i18n";
import type { Article, AtlasEntry, LibraryItem } from "@/types/content";

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  lang?: Lang;
}): Metadata {
  const images = input.image ? [{ url: input.image }] : undefined;
  const lang = input.lang ?? "en";
  const url = localize(input.path, lang);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url, languages: languageAlternates(input.path) },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      locale: lang === "es" ? "es_419" : "en_US",
      siteName: site.name,
      type: input.type ?? "website",
      publishedTime: input.publishedTime,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
      images: input.image ? [input.image] : undefined,
    },
  };
}

/** The same page in every interface language, for search engines. */
export const languageAlternates = (path: string) => ({
  ...Object.fromEntries(languages.map((l) => [l, localize(path, l)])),
  "x-default": path,
});

const sameAs = () => [site.social.linkedin, site.social.instagram].filter(Boolean);

export const personSchema = (lang: Lang = "en") => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.roles.join(", "),
  description: getDictionary(lang).description,
  homeLocation: { "@type": "Place", name: site.base },
  ...(sameAs().length ? { sameAs: sameAs() } : {}),
});

export const articleSchema = (a: Article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.description,
  inLanguage: a.language,
  datePublished: a.publishedDate,
  dateModified: a.updatedDate ?? a.publishedDate,
  keywords: a.tags.join(", "),
  mainEntityOfPage: absoluteUrl(a.url),
  ...(a.coverImage ? { image: absoluteUrl(a.coverImage) } : {}),
  author: { "@type": "Person", name: site.name, url: site.url },
});

export const placeSchema = (p: AtlasEntry) => ({
  "@context": "https://schema.org",
  "@type": "Place",
  name: `${p.city}, ${p.country}`,
  description: p.notes,
  url: absoluteUrl(p.url),
  ...(p.photos[0] ? { image: absoluteUrl(p.photos[0]) } : {}),
  geo: { "@type": "GeoCoordinates", latitude: p.coordinates[0], longitude: p.coordinates[1] },
});

export const creativeWorkSchema = (input: { name: string; description: string; path: string }) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: input.name,
  description: input.description,
  url: absoluteUrl(input.path),
  author: { "@type": "Person", name: site.name, url: site.url },
});

/** A library entry is a short review of someone else's work. */
export const libraryItemSchema = (item: LibraryItem) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  url: absoluteUrl(item.url),
  reviewBody: item.personalReview,
  author: { "@type": "Person", name: site.name, url: site.url },
  itemReviewed: {
    "@type": item.type === "Book" ? "Book" : "CreativeWork",
    name: item.title,
    author: { "@type": "Person", name: item.author },
    ...(item.year ? { datePublished: String(item.year) } : {}),
    ...(item.link ? { url: item.link } : {}),
  },
});
