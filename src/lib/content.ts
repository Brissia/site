import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  AnyContent,
  Article,
  AtlasEntry,
  Collection,
  Experiment,
  JournalEntry,
  LibraryItem,
  SearchDocument,
} from "@/types/content";
import { countWords, formatDate } from "@/utils/format";

/**
 * Git-based content layer.
 *
 * Every file in src/content/<collection>/*.mdx is one piece of knowledge.
 * This module is the only place that knows content lives on disk, so moving
 * to Sanity or Supabase later means rewriting this file and nothing else.
 */

const ROOT = path.join(process.cwd(), "src", "content");
const JOURNAL_MAX_WORDS = 300;
const isProd = process.env.NODE_ENV === "production";

type Frontmatter = Record<string, unknown>;

function readCollection(collection: Collection): { slug: string; data: Frontmatter; body: string }[] {
  const dir = path.join(ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return { slug: file.replace(/\.mdx?$/, ""), data, body: content.trim() };
    });
}

function fail(collection: string, slug: string, message: string): never {
  throw new Error(`[content] ${collection}/${slug}.mdx: ${message}`);
}

function required<T>(collection: string, slug: string, data: Frontmatter, key: string): T {
  const value = data[key];
  if (value === undefined || value === null || value === "") {
    fail(collection, slug, `missing required field "${key}"`);
  }
  return value as T;
}

const list = <T = string>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
const optional = <T>(value: unknown): T | undefined => (value === undefined || value === null || value === "" ? undefined : (value as T));
/** YAML parses unquoted dates into Date objects. Normalize to YYYY-MM-DD. */
const date = (value: unknown): string => (value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10));
const visible = <T extends { draft: boolean }>(items: T[]): T[] => (isProd ? items.filter((i) => !i.draft) : items);
const byDateDesc = (a: string, b: string) => (a < b ? 1 : a > b ? -1 : 0);

export function getArticles(): Article[] {
  const items = readCollection("ideas").map(({ slug, data, body }): Article => {
    const r = <T,>(k: string) => required<T>("ideas", slug, data, k);
    return {
      slug,
      collection: "ideas",
      url: `/ideas/${slug}`,
      body,
      draft: data.draft === true,
      title: r("title"),
      description: r("description"),
      coverImage: optional(data.coverImage),
      category: r("category"),
      readingTime: optional<number>(data.readingTime) ?? Math.max(1, Math.round(countWords(body) / 220)),
      publishedDate: date(r("publishedDate")),
      updatedDate: data.updatedDate ? date(data.updatedDate) : undefined,
      language: optional(data.language) ?? "en",
      tags: list(data.tags),
      references: list(data.references),
      relatedContent: list(data.relatedContent),
      location: optional(data.location),
      originalUrl: optional(data.originalUrl),
    };
  });
  return visible(items).sort((a, b) => byDateDesc(a.publishedDate, b.publishedDate));
}

export function getAtlasEntries(): AtlasEntry[] {
  const items = readCollection("atlas").map(({ slug, data, body }): AtlasEntry => {
    const r = <T,>(k: string) => required<T>("atlas", slug, data, k);
    const coordinates = r<number[]>("coordinates");
    if (!Array.isArray(coordinates) || coordinates.length !== 2 || coordinates.some((c) => typeof c !== "number")) {
      fail("atlas", slug, `"coordinates" must be [latitude, longitude]`);
    }
    return {
      slug,
      collection: "atlas",
      url: `/atlas/${slug}`,
      body,
      draft: data.draft === true,
      country: r("country"),
      city: r("city"),
      coordinates: [coordinates[0], coordinates[1]],
      visitedDate: data.visitedDate ? date(data.visitedDate) : undefined,
      photos: list(data.photos),
      notes: r("notes"),
      businessInsights: list(data.businessInsights),
      themes: list(data.themes),
      relatedArticles: list(data.relatedArticles),
      relatedProjects: list(data.relatedProjects),
    };
  });
  return visible(items).sort((a, b) => a.city.localeCompare(b.city));
}

export function getExperiments(): Experiment[] {
  const items = readCollection("experiments").map(({ slug, data, body }): Experiment => {
    const r = <T,>(k: string) => required<T>("experiments", slug, data, k);
    return {
      slug,
      collection: "experiments",
      url: `/experiments#${slug}`,
      body,
      draft: data.draft === true,
      title: r("title"),
      description: r("description"),
      status: r("status"),
      category: r("category"),
      tools: list(data.tools),
      links: list(data.links),
      screenshots: list(data.screenshots),
      technicalNotes: optional(data.technicalNotes),
    };
  });
  return visible(items);
}

export function getLibraryItems(): LibraryItem[] {
  const items = readCollection("library").map(({ slug, data, body }): LibraryItem => {
    const r = <T,>(k: string) => required<T>("library", slug, data, k);
    return {
      slug,
      collection: "library",
      url: `/library#${slug}`,
      body,
      draft: data.draft === true,
      title: r("title"),
      type: r("type"),
      author: r("author"),
      year: optional(data.year),
      cover: optional(data.cover),
      personalReview: r("personalReview"),
      tags: list(data.tags),
      relatedIdeas: list(data.relatedIdeas),
      link: optional(data.link),
    };
  });
  return visible(items).sort((a, b) => a.title.localeCompare(b.title));
}

export function getJournalEntries(): JournalEntry[] {
  const items = readCollection("journal").map(({ slug, data, body }): JournalEntry => {
    const r = <T,>(k: string) => required<T>("journal", slug, data, k);
    const wordCount = countWords(body);
    if (wordCount > JOURNAL_MAX_WORDS) {
      fail("journal", slug, `${wordCount} words. Journal entries stay under ${JOURNAL_MAX_WORDS}; longer thinking belongs in Ideas.`);
    }
    return {
      slug,
      collection: "journal",
      url: `/journal#${slug}`,
      body,
      draft: data.draft === true,
      title: r("title"),
      date: date(r("date")),
      location: optional(data.location),
      images: list(data.images),
      tags: list(data.tags),
      language: optional(data.language) ?? "en",
      wordCount,
    };
  });
  return visible(items).sort((a, b) => byDateDesc(a.date, b.date));
}

/* ---------------------------------------------------------------- lookups */

export const getArticle = (slug: string) => getArticles().find((a) => a.slug === slug);
export const getAtlasEntry = (slug: string) => getAtlasEntries().find((a) => a.slug === slug);

/* ---------------------------------------------------------- relationships */

/** Human label for a location field that may be an Atlas slug or free text. */
export function resolveLocation(location?: string): { label: string; url?: string } | undefined {
  if (!location) return undefined;
  const place = getAtlasEntry(location);
  return place ? { label: `${place.city}, ${place.country}`, url: place.url } : { label: location };
}

/** Resolves "collection/slug" references into real content, silently skipping broken ones. */
export function resolveRefs(refs: string[]): AnyContent[] {
  const all: AnyContent[] = [
    ...getArticles(),
    ...getAtlasEntries(),
    ...getExperiments(),
    ...getLibraryItems(),
    ...getJournalEntries(),
  ];
  return refs
    .map((ref) => all.find((c) => `${c.collection}/${c.slug}` === ref))
    .filter((c): c is AnyContent => Boolean(c));
}

/** Everything that points at a place: the core of "knowledge on a map". */
export function getContentForPlace(slug: string) {
  const place = getAtlasEntry(slug);
  const explicit = new Set(place?.relatedArticles ?? []);
  return {
    articles: getArticles().filter((a) => a.location === slug || explicit.has(a.slug)),
    journal: getJournalEntries().filter((j) => j.location === slug),
  };
}

export function contentTitle(item: AnyContent): string {
  return item.collection === "atlas" ? `${item.city}, ${item.country}` : item.title;
}

/* ------------------------------------------------------------------ search */

const SECTION: Record<Collection, string> = {
  ideas: "Ideas",
  atlas: "Atlas",
  experiments: "Experiments",
  library: "Library",
  journal: "Journal",
  talks: "Speaking",
};

/** Flat index for local search today and for embeddings later. */
export function getSearchIndex(): SearchDocument[] {
  return [
    ...getArticles().map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      section: SECTION.ideas,
      tags: [...a.tags, a.category],
      meta: formatDate(a.publishedDate),
    })),
    ...getAtlasEntries().map((p) => ({
      title: `${p.city}, ${p.country}`,
      description: p.notes,
      url: p.url,
      section: SECTION.atlas,
      tags: [...p.themes, "cities"],
    })),
    ...getExperiments().map((e) => ({
      title: e.title,
      description: e.description,
      url: e.url,
      section: SECTION.experiments,
      tags: [e.category, ...e.tools],
      meta: e.status,
    })),
    ...getLibraryItems().map((l) => ({
      title: l.title,
      description: l.personalReview,
      url: l.url,
      section: SECTION.library,
      tags: [...l.tags, l.type],
      meta: l.author,
    })),
    ...getJournalEntries().map((j) => ({
      title: j.title,
      description: j.body.slice(0, 180),
      url: j.url,
      section: SECTION.journal,
      tags: j.tags,
      meta: formatDate(j.date),
    })),
  ];
}

/* ------------------------------------------------------------------- pages */

/** Standalone pages written in MDX, e.g. src/content/about.mdx. */
export function getPage(name: string): { data: Frontmatter; body: string } {
  const { data, content } = matter(fs.readFileSync(path.join(ROOT, `${name}.mdx`), "utf8"));
  return { data, body: content.trim() };
}
