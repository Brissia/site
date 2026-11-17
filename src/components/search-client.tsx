"use client";

import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { Link } from "@/components/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getDictionary, localize } from "@/i18n";
import type { SearchDocument } from "@/types/content";
import { useLang } from "./link";

/** Pairs of words that mean the same on this site, so Spanish and English queries reach the same pieces. */
const PAIRS: [string, string][] = [
  ["ciudades", "cities"],
  ["ciudad", "city"],
  ["estrategia", "strategy"],
  ["liderazgo", "leadership"],
  ["cultura", "culture"],
  ["moda", "fashion"],
  ["datos", "data"],
  ["trabajo", "work"],
  ["viajes", "travel"],
  ["negocios", "business"],
  ["crecimiento", "growth"],
  ["pensamiento", "thinking"],
  ["tecnologia", "technology"],
  ["educacion", "education"],
  ["finanzas", "finance"],
  ["automatizacion", "automation"],
  ["inteligencia artificial", "ai"],
  ["ia", "ai"],
  ["nomada", "nomad"],
  ["metricas", "metrics"],
  ["emprendimiento", "startups"],
];

const plain = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function expandQuery(query: string): string[] {
  const q = plain(query);
  const terms = new Set([query]);
  for (const [es, en] of PAIRS) {
    if (q === es) terms.add(en);
    else if (q === en) terms.add(es);
  }
  return [...terms];
}

export function SearchClient({ index }: { index: SearchDocument[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const lang = useLang();
  const t = getDictionary(lang).search;
  const [query, setQuery] = useState(params.get("q") ?? "");

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 3 },
          { name: "tags", weight: 2 },
          { name: "description", weight: 1 },
          { name: "text", weight: 0.5 },
          { name: "section", weight: 1 },
        ],
        threshold: 0.32,
        ignoreLocation: true,
        // "metricas" finds "métricas".
        ignoreDiacritics: true,
      }),
    [index],
  );

  const q = query.trim();
  // A question asked in one language also finds what was written in the other.
  const results = useMemo(() => {
    if (!q) return index;
    const seen = new Set<string>();
    return expandQuery(q)
      .flatMap((term) => fuse.search(term))
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
      .map((r) => r.item)
      .filter((item) => (seen.has(item.url) ? false : (seen.add(item.url), true)));
  }, [q, fuse, index]);

  const update = (value: string) => {
    setQuery(value);
    const next = value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/search";
    router.replace(localize(next, lang), { scroll: false });
  };

  return (
    <div>
      <div role="search" className="flex items-center gap-4 border-b border-foreground pb-3">
        <Search aria-hidden strokeWidth={1.25} className="size-6 shrink-0 text-muted" />
        <label htmlFor="q" className="sr-only">
          {t.label}
        </label>
        <input
          id="q"
          type="search"
          value={query}
          onChange={(e) => update(e.target.value)}
          placeholder={t.placeholder}
          autoComplete="off"
          className="w-full bg-transparent font-display text-3xl tracking-tight placeholder:text-muted/60 focus:outline-none md:text-5xl"
        />
      </div>

      <p aria-live="polite" className="meta mt-5">
        {q ? t.results(results.length) : t.entries(index.length)}
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
          {t.empty}
        </p>
      )}
    </div>
  );
}
