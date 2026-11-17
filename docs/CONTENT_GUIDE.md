# Content publishing guide

Publishing is adding one file and pushing it. Vercel rebuilds the site in about a minute.

## The steps

1. Copy the `_template.mdx` of the collection and name it with the slug you want in the URL, lowercase with hyphens: `src/content/ideas/territorio-y-credito.mdx` becomes `/ideas/territorio-y-credito`.
2. Fill in the fields between the `---` lines and write below them in Markdown.
3. Preview with `npm run dev`.
4. Commit and push: `git commit -m "content: publish territorio y credito"`.

You can also do all of it from the GitHub website: open the folder, "Add file", paste, commit.

To work on something without publishing it, add `draft: true`. Drafts appear locally and stay out of production.

## Collections

### Ideas: `src/content/ideas/`

Long-form. Required: `title`, `description`, `category`, `publishedDate`.

| Field | Notes |
|-------|-------|
| `category` | Essay, Article, Research, Case Study or Opinion |
| `language` | `es` or `en`. Sets the correct language for screen readers and search engines |
| `readingTime` | Optional. Calculated when omitted |
| `coverImage` | `/images/ideas/slug.jpg`. Black and white |
| `tags` | Lowercase. Each tag gets its own page at `/tags/<tag>` and feeds search and the Domains on the homepage |
| `location` | Slug of an Atlas entry. The essay then appears on that place's page |
| `relatedContent` | `collection/slug`, for example `atlas/la-paz` or `library/obviously-awesome` |
| `references` | List of `title` and optional `url` |

### Nomading: `src/content/atlas/`

The section is called Nomading on the site and lives at `/nomading`; the folder keeps its original name, `atlas`, so references such as `atlas/la-paz` stay valid. One file per place. Required: `city`, `country`, `coordinates`, `notes`.

Every stop is a card with three things: a photograph, a sentence and a date.

| Field | Notes |
|-------|-------|
| `notes` | The sentence of the place. Shown large on the card, on the map and at the top of the page |
| `photos` | `["/images/nomading/uyuni-01.jpg"]`. Always black and white. The first one leads the card and the page; the rest form a gallery. Without a photo the card shows the sentence alone |
| `visitedDate` | `2025-08-14`, `2025-08` or `2025`, as precisely as you remember it. Places with a date are listed most recent first |
| `coordinates` | `[latitude, longitude]`; right-click any point in OpenStreetMap or Google Maps to copy them |
| `themes` | Feed the filters: Business, Travel, Cities, Culture, Growth |

Text below the `---` lines appears as longer notes. If it only repeats the sentence, it is not shown twice. The three stops on the homepage are the ones with a photograph first, then the most recent.

### Journal: `src/content/journal/`

Short notes. Required: `title`, `date`. **Maximum 300 words: the build stops if a note is longer.** `location` can be an Atlas slug (it becomes a link) or free text.

### Library: `src/content/library/`

Required: `title`, `type`, `author`, `personalReview`. The annotation is mandatory by design: a resource without your reading of it is only a link.

Each entry has its own page at `/library/<slug>`. The annotation opens it; anything you write below the `---` lines appears under it as longer notes. `relatedIdeas` takes slugs of Ideas, `related` takes anything else.

### Experiments: `src/content/experiments/`

Required: `title`, `description`, `status` (idea, in progress, live, archived), `category`.

Each experiment has its own page at `/experiments/<slug>`. Write the story below the `---` lines; `screenshots`, `links`, `technicalNotes`, `tags` and `related` are optional. The `category` already counts as a tag.

## Connecting pieces

Every piece ends with a "Connected to" list. **Declare a connection once, on either side, and it shows on both.** If an essay lists a book, the book's page lists the essay without you touching the book's file.

Write a connection as `collection/slug`:

```yaml
related: ["library/obviously-awesome", "atlas/la-paz", "experiments/ask-brissia"]
```

| Collection | Field | Also understood |
|------------|-------|-----------------|
| Ideas | `relatedContent` | `location` (Atlas slug) |
| Atlas | `related` | `relatedArticles` (Idea slugs), `relatedProjects` (Experiment slugs) |
| Experiments | `related` | |
| Library | `related` | `relatedIdeas` (Idea slugs) |
| Journal | `related` | `location` (Atlas slug) |

A reference to something that does not exist, or to a draft, is skipped without breaking the build. Check the page after publishing if a connection is missing: it is usually a typo in the slug.

## Tags

Tags are shared across every collection, so `/tags/cities` gathers essays, places, books, experiments and notes together. `/tags` lists all of them with a count.

- Write them lowercase. Case and accents are ignored when matching: `Métricas` and `metricas` land on the same page.
- `estrategia` and `strategy` are two different tags with two different pages. Pick one language per concept, or use both on purpose.
- Atlas `themes` and the experiment `category` count as tags.
- Fewer, reused tags make better pages than many tags used once.

Add `featured: true` to show an experiment on the homepage under Projects (up to three). The chapter appears when at least one experiment is featured.

### Speaking: `src/content/talks/`

Required: `title`, `event`, `date`. Optional: `location`, `type` (Talk, Panel, Podcast, Interview), `language`, `video`, `slides`. The page lives at `/speaking` and is linked from About once there is at least one talk.

### About: `src/content/about.mdx` and `src/content/about.es.mdx`

One file per language. Plain Markdown with `##` headings. If the Spanish file is missing, the English one is shown in both.

## Two languages

The interface exists in English (`/ideas`) and Spanish (`/es/ideas`). **Content is not translated**: an essay written in Spanish reads in Spanish in both. What changes is everything around it: menu, labels, dates, buttons.

Every word of the interface, in both languages, lives in one file: `src/i18n/dictionaries.ts`. To rename a section or rewrite a line, change it there.

## Images

- Put them in `public/images/<collection>/` and reference them as `/images/<collection>/file.jpg`.
- Always black and white. The site also applies a grayscale filter as a safety net, but a photograph converted with intention looks better.
- Upload JPG or PNG at around 2400px on the long side. The site generates AVIF and WebP in every needed size.
- Write real alt text for images inside an essay: `![A tram crossing Avenida 18 de Julio](/images/ideas/tram.jpg)`.

## Writing in MDX

Standard Markdown: `##` headings, `>` for pull quotes (rendered large, in serif italic), lists, links, images. Start headings at `##`; the title is already the `#`.

## When the build fails

The error names the file and the problem, for example:

```
[content] journal/long-note.mdx: 412 words. Journal entries stay under 300; longer thinking belongs in Ideas.
[content] atlas/lima.mdx: missing required field "notes"
```
