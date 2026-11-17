export type Language = "es" | "en";

export type Collection = "ideas" | "atlas" | "experiments" | "library" | "journal" | "talks" | "toolkit";

/** "collection/slug", for example "atlas/la-paz". */
export type ContentRef = `${Collection}/${string}`;

interface Base {
  slug: string;
  collection: Collection;
  url: string;
  /** Raw MDX body. */
  body: string;
  /** Drafts are visible in development and hidden in production. */
  draft: boolean;
  /** The language of the text being shown. */
  language: Language;
  /** Set when the text is a translation: the language it was written in. */
  translatedFrom?: Language;
}

export type ArticleCategory = "Essay" | "Article" | "Research" | "Case Study" | "Opinion";

export interface Article extends Base {
  collection: "ideas";
  title: string;
  description: string;
  coverImage?: string;
  category: ArticleCategory;
  readingTime: number;
  publishedDate: string;
  updatedDate?: string;
  language: Language;
  tags: string[];
  references: { title: string; url?: string }[];
  relatedContent: ContentRef[];
  /** Slug of an Atlas entry. */
  location?: string;
  /** Where the piece first appeared, when it was published elsewhere before. */
  originalUrl?: string;
}

export interface AtlasEntry extends Base {
  collection: "atlas";
  country: string;
  city: string;
  coordinates: [lat: number, lng: number];
  visitedDate?: string;
  photos: string[];
  /** One sentence shown on cards and map popups. */
  notes: string;
  businessInsights: string[];
  themes: string[];
  relatedArticles: string[];
  /** Slugs of Experiments. */
  relatedProjects: string[];
  related: ContentRef[];
}

export type ExperimentStatus = "idea" | "in progress" | "live" | "archived";

export interface Experiment extends Base {
  collection: "experiments";
  title: string;
  description: string;
  status: ExperimentStatus;
  category: string;
  tools: string[];
  links: { label: string; url: string }[];
  screenshots: string[];
  technicalNotes?: string;
  tags: string[];
  related: ContentRef[];
  /** Shown on the homepage under Projects. */
  featured: boolean;
}

export interface LibraryItem extends Base {
  collection: "library";
  title: string;
  type: "Book" | "Paper" | "Podcast" | "Article" | "Video" | "Course" | "Tool" | "Press";
  author: string;
  year?: number;
  cover?: string;
  /** The personal annotation. Required: a resource without a point of view is a link. */
  personalReview: string;
  tags: string[];
  relatedIdeas: string[];
  related: ContentRef[];
  link?: string;
}

export interface JournalEntry extends Base {
  collection: "journal";
  title: string;
  date: string;
  /** Slug of an Atlas entry, or free text. */
  location?: string;
  images: string[];
  tags: string[];
  language: Language;
  wordCount: number;
  related: ContentRef[];
}

/** A resource to use: a framework, a template, a tool. Lives at /toolkit/<slug>. */
export interface ToolkitItem extends Base {
  collection: "toolkit";
  title: string;
  description: string;
  /** Framework | Template | Tool | List */
  format: string;
  /** Who it was made for. Decides whether it is listed under Companies or People. */
  audience: "companies" | "people";
  /** File in public/downloads, e.g. "/downloads/ice-scoring.xlsx". */
  download?: string;
  /** What the file is, shown on the button, e.g. "Excel". */
  downloadLabel?: string;
  /** For resources that live elsewhere. */
  link?: string;
  linkLabel?: string;
  tags: string[];
  related: ContentRef[];
  language: Language;
}

export interface TimelineEntry {
  /** "2016-11", "2016" or "2016-11-05". */
  start: string;
  /** Omit for something that continues today. */
  end?: string;
  title: string;
  organization: string;
  place?: string;
  type: "work" | "volunteering" | "education" | "recognition";
  note?: string;
}

export interface Talk {
  slug: string;
  title: string;
  event: string;
  date: string;
  location?: string;
  type: "Talk" | "Panel" | "Podcast" | "Interview";
  video?: string;
  slides?: string;
  language: Language;
  draft: boolean;
}

export type AnyContent = Article | AtlasEntry | Experiment | LibraryItem | JournalEntry | ToolkitItem;

export interface Tag {
  /** URL form: lowercase, no accents, hyphens. */
  slug: string;
  /** As written in the content. */
  label: string;
  count: number;
}

export interface SearchDocument {
  title: string;
  description: string;
  /** Body text, searched but not shown. */
  text?: string;
  url: string;
  section: string;
  tags: string[];
  meta?: string;
}
