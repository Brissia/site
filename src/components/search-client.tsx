"use client";

import Fuse from "fuse.js";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { SearchDocument } from "@/types/content";

export function SearchClient({ index }: { index: SearchDocument[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 3 },
          { name: "tags", weight: 2 },
          { name: "description", weight: 1 },
          { name: "section", weight: 1 },
        ],
        threshold: 0.32,
        ignoreLocation: true,
      }),
    [index],
  );

  const q = query.trim();
  const results = q ? fuse.search(q).map((r) => r.item) : index;

  const update = (value: string) => {
    setQuery(value);
    const next = value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/search";
    router.replace(next, { scroll: false });
  };

  return (
    <div>
      <div role="search" className="flex items-center gap-4 border-b border-foreground pb-3">
        <Search aria-hidden strokeWidth={1.25} className="size-6 shrink-0 text-muted" />
        <label htmlFor="q" className="sr-only">
          Search the site
        </label>
        <input
          id="q"
          type="search"
          value={query}
          onChange={(e) => update(e.target.value)}
          placeholder="A topic, a city, a question"
          autoComplete="off"
          className="w-full bg-transparent font-display text-3xl tracking-tight placeholder:text-muted/60 focus:outline-none md:text-5xl"
        />
      </div>

      <p aria-live="polite" className="meta mt-5">
        {q ? `${results.length} ${results.length === 1 ? "result" : "results"}` : `${index.length} entries`}
      </p>

      <ul className="mt-6">
        {results.map((r) => (
          <li key={r.url} className="border-t border-border">
            <Link href={r.url} className="group grid gap-1 py-5 md:grid-cols-12 md:gap-6">
              <p className="meta md:col-span-2 md:pt-2">{r.section}</p>
              <div className="md:col-span-10">
                <h2 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
                  <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{r.title}</span>
                </h2>
                <p className="mt-1 line-clamp-2 max-w-2xl text-[15px] leading-relaxed text-muted">{r.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {q && results.length === 0 && (
        <p className="mt-10 max-w-md font-display text-2xl italic leading-snug text-muted">
          Nothing on that yet. It may be a good question to write about.
        </p>
      )}
    </div>
  );
}
