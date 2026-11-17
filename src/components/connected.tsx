import Link from "next/link";
import { contentLanguage, contentSummary, contentTitle } from "@/lib/content";
import type { AnyContent, Collection } from "@/types/content";
import { tagSlug } from "@/utils/format";

/** What a single piece is called, as opposed to the section it lives in. */
export const KIND: Record<Collection, string> = {
  ideas: "Idea",
  atlas: "Place",
  experiments: "Experiment",
  library: "Library",
  journal: "Journal",
  talks: "Talk",
};

/** Tags are doors: each one opens the page that gathers everything sharing it. */
export function TagList({ tags, className = "" }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null;
  return (
    <ul aria-label="Topics" className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tags/${tagSlug(tag)}`}
            className="meta block border border-border px-3 py-2 transition-colors duration-200 ease-out hover:border-foreground hover:text-foreground"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The closing block of every piece: where this thought leads, and what leads to it. */
export function Connected({
  items,
  title = "Connected to",
  id = "connected",
}: {
  items: AnyContent[];
  title?: string;
  id?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="meta">
        {title}
      </h2>
      <ul className="mt-2">
        {items.map((item) => (
          <li key={item.url} lang={contentLanguage(item)} className="border-b border-border">
            <Link href={item.url} className="group flex items-baseline justify-between gap-6 py-4">
              <span className="font-display text-2xl leading-tight tracking-tight">
                <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{contentTitle(item)}</span>
              </span>
              <span className="meta shrink-0">{KIND[item.collection]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A mixed list with a line of context per entry, used where pieces from every section meet. */
export function ContentList({ items }: { items: AnyContent[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.url} lang={contentLanguage(item)} className="border-t border-border">
          <Link href={item.url} className="group grid gap-1 py-5 md:grid-cols-12 md:gap-6">
            <p className="meta md:col-span-2 md:pt-2">{KIND[item.collection]}</p>
            <div className="md:col-span-10">
              <h2 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
                <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{contentTitle(item)}</span>
              </h2>
              <p className="mt-1 line-clamp-2 max-w-2xl text-[15px] leading-relaxed text-muted">{contentSummary(item)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
