"use client";

import Link from "next/link";
import { useState } from "react";
import AtlasMap, { type MapPlace } from "./atlas-map";

export interface ExplorerPlace extends MapPlace {
  themes: string[];
  coordinatesLabel: string;
}

export function AtlasExplorer({ places, themes }: { places: ExplorerPlace[]; themes: string[] }) {
  const [theme, setTheme] = useState<string | null>(null);
  const visible = theme ? places.filter((p) => p.themes.includes(theme)) : places;

  return (
    <div>
      <div role="group" aria-label="Filter places by theme" className="-mx-6 mb-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0">
        {[null, ...themes].map((t) => (
          <button
            key={t ?? "all"}
            type="button"
            aria-pressed={theme === t}
            onClick={() => setTheme(t)}
            className="meta shrink-0 border border-border px-3 py-2 transition-colors duration-200 ease-out hover:border-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
          >
            {t ?? "All"}
          </button>
        ))}
      </div>

      <AtlasMap places={visible} className="h-[55vh] min-h-80 md:h-[68vh]" />

      <ul className="mt-12 grid gap-x-6 md:grid-cols-2">
        {visible.map((p) => (
          <li key={p.slug} className="border-t border-border">
            <Link href={p.url} className="group block py-6">
              <p className="meta">{p.coordinatesLabel}</p>
              <h2 className="mt-2 font-display text-4xl leading-none tracking-tight">
                {p.city}
                <span className="text-muted">, {p.country}</span>
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted transition-colors duration-200 ease-out group-hover:text-foreground">
                {p.notes}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {visible.length} places shown
      </p>
    </div>
  );
}
