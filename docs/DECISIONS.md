# Decisions

The three source documents disagree in a few places. This is what was chosen, why, and how to reverse it.

## Conflicts resolved

| Topic | Design System | Information Architecture | Build brief | Built | To change it |
|-------|---------------|--------------------------|-------------|-------|--------------|
| Navigation | Ideas, Maps, Journeys, Experiments, Speaking, About, Search, Theme, Language | Ideas, Atlas, Experiments, Library, About, Search | Atlas throughout | Nomading, Ideas, Experiments, Library, Journal, About, plus Search, Language and Theme | Order in `navigation` in `src/data/site.ts`; labels in `src/i18n/dictionaries.ts` |
| Hero CTA | None | n/a | None | None. The mockup's "Explore my work" button was left out | `Hero` in `src/app/[lang]/page.tsx` |
| Hero line | "Critical thinking first, then everything else" | n/a | "Manifesto" | The Design System line. The mockup's "I study how technology, cities and human behavior shape business growth" is used as the site description | `site.manifesto` |
| Home order | Chapters 01 to 07 | Adds Featured Projects and Speaking | Hero, Latest Essay, Domains, Atlas, Journal, Newsletter | Hero, Nomading, Ideas, Domains, Projects (when any is featured), Journal, Newsletter | `src/app/[lang]/page.tsx` |
| CMS | Sanity | n/a | MDX in Git first, Sanity later | MDX in Git | See ARCHITECTURE.md, growth path |
| Display typeface | Canela or Editorial New | n/a | Free infrastructure | Newsreader (open source). Canela is a commercial license | `src/fonts/README.md` |
| Dark background | #050505, "not black, matte paper" | n/a | "OLED black" | #050505 with #101010 cards | `globals.css` |

## Phase 2, part one: pages and relationships

- **Experiments and Library entries have their own pages** at `/experiments/<slug>` and `/library/<slug>`. The index pages now link to them. The old `#anchor` links on the index pages still scroll to the right entry.
- **Connections are bidirectional.** `getConnections` in `src/lib/content.ts` reads what a piece points to and what points back at it. A connection is written once, on either side. The older fields (`location`, `relatedIdeas`, `relatedArticles`, `relatedProjects`) feed the same graph, so no existing file had to change.
- **Topic pages** at `/tags` and `/tags/<tag>` gather every collection. Tags on essays, places, journal notes and entries link there instead of to search. Atlas `themes` and the experiment `category` count as tags.
- **Homepage Domains** Growth, AI, Cities and Culture now open their topic page. Fashion still opens search because nothing carries that tag yet; a topic page with no content would be a 404.
- **Journal notes do not get their own page.** They are short enough to read on the index, and the Information Architecture gives Journal a single URL. They take part in connections and topics through their anchor.
- **No sample connections were added.** The Library and Experiments entries are still samples, and linking them to the real essays would print invented relationships on real pages. Today the essays connect to each other; the rest lights up as real entries arrive.
- **Tags were left as written.** Spanish and English versions of the same idea (`estrategia` and `strategy`, `liderazgo` and `leadership`) are separate topics. Merging them is an editorial decision.

## Nomading and the hero

- **Atlas is now Nomading**, the first chapter of the site and of the menu. Its subject is life as a digital nomad rather than what each city taught about business. Each stop is a photograph (always black and white), a sentence and a date.
- **The address is `/nomading`.** `/atlas` and `/atlas/<place>` redirect permanently, so links already shared keep working. The content folder is still `src/content/atlas` and references are still written `atlas/la-paz`.
- **Business observations** remain available on a place page but only appear when an entry has them.
- **The hero** reads Digital Nomad, Business Scientist, Growth & Expansion Strategist, then the manifesto. "Building better businesses across Latin America" was removed from the hero; it is still in `site.statement` if wanted elsewhere.
- **Sample places** (La Paz, Tokyo, Asunción, Montevideo still carry sample text) are kept off the homepage until rewritten.

## Phase 2, part two: two languages, Speaking, Projects

- **English without a prefix, Spanish under `/es`.** Existing addresses did not change. `/en/...` redirects to the address without prefix. Pages live in `src/app/[lang]`; `next.config.ts` serves addresses without a language from `/en`.
- **Only the interface is translated.** Each piece keeps the language it was written in and its `lang` attribute. Search engines get `hreflang` links between the two versions and both are in the sitemap.
- **The manifesto and the three roles stay in English in both languages.** They are treated as a signature, not as interface text. To translate them, move them into `src/i18n/dictionaries.ts`.
- **Spanish section names**: Nomading, Ideas, Experimentos, Biblioteca, Diario, Sobre mí. Addresses stay in English (`/es/library`). All of it is one edit away in the dictionary.
- **No automatic language detection.** A visitor gets the language of the link they opened and can switch with EN/ES in the header. Redirecting by browser language would need code running on every visit and breaks shared links.
- **About** is written by Brissia in both languages (`about.mdx` and `about.es.mdx`). The English version is her own text, not a translation made by the site.
- **Speaking** exists at `/speaking` and reads `src/content/talks/`. It is not in the menu and is linked from About only when there is at least one talk.
- **Projects on the homepage** shows experiments marked `featured: true`. None is marked, so the chapter is hidden.

## Phase 3: the free part of the AI layer

Built without any paid service, model or account. Everything is worked out when the site is built.

- **Read next.** Each essay recommends up to three others. Sharing a rare topic counts more than sharing a common one; pieces already listed under "Connected to" are not repeated. `getRecommendations` in `src/lib/content.ts`.
- **Map of ideas** at `/graph`: every piece, every topic used more than once and the threads between them, drawn as plain SVG with no script. `src/lib/graph.ts`.
- **Search** now reads the body of essays, places and notes (not only titles and tags), ignores accents, and bridges languages for common terms: "ciudades" also finds what is tagged "cities". The word pairs are a short list at the top of `src/components/search-client.tsx`.

## Not built yet

- **Ask Brissia.** An assistant that answers from the site needs a paid model API, which breaks the free-tier rule. Decided: not for now. The search index (`getSearchIndex`) and the graph are the base it would use.
- **Semantic search with embeddings.** Same reason. Search is still text matching, now over more text and across both languages.
- **Experiment and Library sample entries** have no body text yet, so their pages show the description or annotation only.
- **shadcn/ui.** Nothing in this version needed a component from it. The tokens are compatible, so `npx shadcn@latest init` can be run the day a dialog, command palette or form library is needed.
- **Supabase.** Not needed while content is static.
- **OpenGraph images.** Pages use the cover or the first photograph when there is one. A generated card per essay is a small addition.

## Not verified

- **Lighthouse score.** The build passes and the pages were reviewed in a browser at phone and desktop sizes, in both themes, but Lighthouse was not run. The target is 95+; measure on the deployed URL.
- **Map tiles.** The build environment had no access to OpenStreetMap, so the map was checked for layout, markers and popups but not with real tiles. Check the monochrome treatment in both themes after deploying. OpenStreetMap's public tile server is meant for light traffic; if the site grows, switch the tile URL in `src/components/atlas-map.tsx` to a provider with a free tier such as Stadia Maps or MapTiler.
- **Screen reader pass.** Semantic HTML, labels, focus states, skip link and reduced motion are in place. A manual VoiceOver pass has not been done.

## Content imported from LinkedIn

Seventeen articles were converted from LinkedIn exports into `src/content/ideas/`. The conversion script is not part of the site; what it did:

- **Text is verbatim.** Voice, anglicisms, humor, emoji, sign-offs and the absence of opening question marks were left exactly as written. Only clear typos and missing accents were corrected (about 45 changes, for example "comeercial", "Levamos", "Enconrando", "mas" to "más", "fué" to "fue"). Grammar and phrasing were not touched.
- **Titles.** Emoji were removed from three titles and "BOLIVIA, EL SIGUIENTE DESTINO PARA NÓMADAS DIGITALES?" was set in sentence case, because titles render very large in serif. The originals are one edit away in each file's `title`.
- **Hashtag-only closing lines** became `tags`. Hashtags inside sentences stayed in the text.
- **Images were not imported.** The image links in the exports point to LinkedIn's servers and have expired. Twelve inline images and every cover are missing. By decision, essays run without images: a piece without a cover shows a rule and its typography. Generated line covers were tried and discarded. Some paragraphs refer to an image that is no longer there (see the list below).
- **Tracking parameters** were stripped from links. Each article links back to its LinkedIn original through `originalUrl`.
- **One unpublished draft** ("Así Cree mi Agente de Recursos Comerciales + Business Researcher") is marked `draft: true`: visible locally, hidden in production. Its prompt block was empty in the export.

Articles whose text refers to a missing image: Nirvana (3 photos), Bolivia y nómadas digitales (3), Crisis económicas (agenda), Growth en una corporación (frameworks), Social Selling (SSI screenshot), PMF de un país (2 charts), Una semana con Claude (1).

Articles with time-bound calls to action left as written: Social Selling (LinkedIn Live "hoy a las 18:00"), Fuga de talento (event on "martes 24" and discount code), Crisis económicas (She Knows Season 2 schedule), Founder-Led Growth (dates in Santa Cruz).

## Placeholders to replace

Journal, Library and Experiments still hold sample entries, each marked as a sample, and so do four places in Nomading (La Paz, Tokyo, Asunción, Montevideo). No place has a photograph or a date yet. The calendar link is empty in `src/data/site.ts` and hidden until filled.
