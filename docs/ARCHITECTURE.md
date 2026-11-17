# Architecture

## Principle

The smallest version that can become a sophisticated platform. Each layer has one file that knows how it works, so replacing a layer means rewriting one file.

## Structure

```
src/
├── app/            Routes. One folder per room of the house.
│   ├── layout.tsx              Passes through; the document is built per language below
│   ├── [lang]/                 Every page, once per interface language (en, es)
│   │   ├── layout.tsx              <html lang>, header, footer
│   │   ├── page.tsx                Home: Hero, Nomading, Ideas, Domains, Projects, Journal
│   │   ├── nomading/ [slug]/       Map and places (content folder: atlas)
│   │   ├── ideas/ [slug]/          Long-form
│   │   ├── experiments/ [slug]/  library/ [slug]/
│   │   ├── tags/ [tag]/            Topic pages across every collection
│   │   ├── graph/                  Map of ideas (static SVG)
│   │   ├── journal/ speaking/ about/ search/
│   │   └── [...rest]/ not-found.tsx   404 in the reader's language
│   └── sitemap.ts robots.ts feed.xml/ icon.svg
├── components/     UI. Server components by default.
│   ├── editorial.tsx           Chapter, PageIntro, ArticleCard, Cover, ArrowLink, JsonLd
│   ├── connected.tsx           Connected, TagList, ContentList
│   ├── link.tsx                The site's Link: adds /es for Spanish readers (client)
│   ├── place-card.tsx          A stop: photograph, sentence, date
│   ├── header.tsx footer.tsx   Global chrome, language switch
│   ├── theme.tsx               Theme script and toggle
│   ├── motion.tsx              MotionProvider, Reveal, ScrollProgress
│   ├── atlas-map.tsx           Leaflet map (client, loads on scroll)
│   ├── atlas-explorer.tsx      Filters, map and cards
│   ├── search-client.tsx       Fuse.js search, accent and language aware
│   └── mdx.tsx analytics.tsx
├── content/        The knowledge. MDX, one file per piece.
├── data/site.ts    Identity, menu order, domains, links
├── i18n/
│   ├── index.ts                Languages and URL helpers (localize)
│   └── dictionaries.ts         Every interface word, in English and Spanish
├── fonts/          Self-hosted typefaces
├── lib/
│   ├── content.ts              The content layer (only file that reads the disk): collections, connections, tags, recommendations, search index
│   ├── graph.ts                Nodes, threads and layout of the map of ideas
│   ├── seo.ts                  Metadata, hreflang and structured data builders
│   └── fonts.ts
├── styles/globals.css          Design tokens and the few global rules
├── types/content.ts            Content model
└── utils/format.ts
```

## Languages

English has no prefix (`/ideas`); Spanish lives under `/es` (`/es/ideas`). `next.config.ts` rewrites addresses without a language to `/en/...` without changing what the reader sees, and redirects `/en/...` to the bare address. Both versions are static.

Components write addresses as if there were one language (`/ideas`). `Link` in `src/components/link.tsx` adds the prefix. Server components receive `lang` from the route and read strings with `getDictionary(lang)`; client components use `useLang()`. Content is never translated: each piece keeps its own `lang` attribute.

Adding a third language is a new entry in `languages` and a new dictionary; the pages do not change.

## Design tokens

`src/styles/globals.css` defines the Design System palette as CSS variables (`--background`, `--foreground`, `--muted`, `--border`, `--card`, `--hover`) for light and dark, and exposes them to Tailwind as `bg-background`, `text-muted`, `border-border` and so on. Components never use a hex value, so a palette change is a change in one block.

Theme: follows the system by default. A visitor's choice is stored in `localStorage` and applied before first paint by an inline script, so there is no flash. High contrast is handled with `prefers-contrast`.

Typography: `font-display` (serif, hierarchy), `font-sans` (body), `font-mono` through the `.meta` class, reserved for dates, places, reading time and coordinates.

Layout: `.shell` gives the page margins; sections use a 12-column grid from the `lg` breakpoint. Below that every section has its own single-column composition. Styles are written mobile first: base classes are the phone, prefixes add the larger screens.

Motion: one entrance (`Reveal`: fade plus 10px, 350ms, ease-out), a reading progress line on essays, and hover micro-interactions. `prefers-reduced-motion` disables all of it.

## Content layer

`src/lib/content.ts` reads `src/content/<collection>/*.mdx`, validates required fields and returns typed objects. A missing field fails the build with the file name and the field, so a broken entry never reaches production.

Rules enforced in code:

- Journal entries above 300 words fail the build.
- Entries with `draft: true` show in development and are excluded in production.
- Files starting with `_` are templates and are ignored.

### Relationships

Everything connects through slugs, which is what makes this a knowledge system rather than a set of pages:

| From | Field | To |
|------|-------|----|
| Article | `location` | Atlas entry |
| Article | `relatedContent` (`collection/slug`) | Anything |
| Atlas entry | `relatedArticles` | Articles |
| Journal entry | `location` | Atlas entry |
| Library item | `relatedIdeas` | Articles |

A place page gathers every article and note that points at it, without anyone maintaining a list. `getSearchIndex()` flattens all collections into one array of documents; it feeds the search page today and is the natural input for embeddings later.

## SEO

Metadata API with canonical URLs, OpenGraph and Twitter cards on every route (`pageMetadata`). Structured data: `Person` site-wide, `Article` on essays, `Place` on Nomading entries, `CreativeWork` on experiments, `Review` on library entries. `sitemap.xml`, `robots.txt` and `feed.xml` are generated from content.

## Performance

- All routes prerendered as static HTML.
- Fonts self-hosted through `next/font/local` (preloaded, no layout shift, no third-party request).
- Images through `next/image` with AVIF and WebP, lazy by default.
- Leaflet (the heaviest dependency) loads only when a map approaches the viewport.
- Motion ships only the `domAnimation` feature set.
- Client components: header, theme toggle, map, atlas filters, search, reveal. Everything else is server-rendered.

## Growth path

| Phase | Adds | Where it plugs in |
|-------|------|-------------------|
| 2 | Speaking (`content/talks`), featured projects, item pages for Library and Experiments, language switch | New routes; `content.ts` gets a `getTalks()` |
| 2 | Supabase (free tier) for reading preferences or saved items | New `lib/supabase.ts`; content stays in Git |
| 2 | Sanity, if publishing volume demands an editor UI | Rewrite `lib/content.ts` only; types and pages stay |
| 3 | Semantic search, "Ask Brissia", recommendations, knowledge graph | `getSearchIndex()` to embeddings (Supabase pgvector); the relationship fields are already the graph edges |
