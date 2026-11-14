# Decisions

The three source documents disagree in a few places. This is what was chosen, why, and how to reverse it.

## Conflicts resolved

| Topic | Design System | Information Architecture | Build brief | Built | To change it |
|-------|---------------|--------------------------|-------------|-------|--------------|
| Navigation | Ideas, Maps, Journeys, Experiments, Speaking, About, Search, Theme, Language | Ideas, Atlas, Experiments, Library, About, Search | Atlas throughout | Ideas, Atlas, Experiments, Library, Journal, About, plus Search and Theme | `navigation` in `src/data/site.ts`. Labels can change without touching URLs |
| Hero CTA | None | n/a | None | None. The mockup's "Explore my work" button was left out | `Hero` in `src/app/page.tsx` |
| Hero line | "Critical thinking first, then everything else" | n/a | "Manifesto" | The Design System line. The mockup's "I study how technology, cities and human behavior shape business growth" is used as the site description | `site.manifesto` |
| Home order | Chapters 01 to 07 | Adds Featured Projects and Speaking | Hero, Latest Essay, Domains, Atlas, Journal, Newsletter | The brief's order, numbered as chapters | `src/app/page.tsx` |
| CMS | Sanity | n/a | MDX in Git first, Sanity later | MDX in Git | See ARCHITECTURE.md, growth path |
| Display typeface | Canela or Editorial New | n/a | Free infrastructure | Newsreader (open source). Canela is a commercial license | `src/fonts/README.md` |
| Dark background | #050505, "not black, matte paper" | n/a | "OLED black" | #050505 with #101010 cards | `globals.css` |

## Built beyond Phase 1

Experiments, Library and Search belong to Phase 2 but are linked from the navigation, so each has a working first version instead of a dead link. They are index pages; individual item pages come later.

## Not built yet

- **Language switch.** The interface is in English and each piece is published in its own language with the correct `lang` attribute. A full ES/EN interface is a Phase 2 decision because it doubles what has to be maintained.
- **Speaking.** `src/content/talks/` and its template exist; the page does not.
- **Featured Projects** on the homepage.
- **shadcn/ui.** Nothing in this version needed a component from it. The tokens are compatible, so `npx shadcn@latest init` can be run the day a dialog, command palette or form library is needed.
- **Supabase.** Not needed while content is static. Reserved for preferences and the AI layer.
- **Semantic search.** Search today is fuzzy text matching over titles, tags and descriptions (Fuse.js). It finds "growth" and "La Paz"; it does not understand meaning.
- **OpenGraph images.** Pages use the cover image when there is one. A generated card per essay is a small addition.

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

Atlas, Journal, Library and Experiments still hold sample entries, each marked as a sample. The About page is a draft based on the public profile. The calendar link is empty in `src/data/site.ts` and hidden until filled.
