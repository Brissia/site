"use client";

import { useState } from "react";
import AtlasMap, { type MapPlace } from "./atlas-map";
import { PlaceCard, type PlaceCardData } from "./place-card";

export interface ExplorerPlace extends MapPlace, PlaceCardData {
  themes: string[];
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

      <ul className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.slug}>
            <PlaceCard place={p} />
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {visible.length} places shown
      </p>
    </div>
  );
}
