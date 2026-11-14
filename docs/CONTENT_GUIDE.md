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
| `tags` | Lowercase. They power search and the Domains on the homepage |
| `location` | Slug of an Atlas entry. The essay then appears on that place's page |
| `relatedContent` | `collection/slug`, for example `atlas/la-paz` or `library/obviously-awesome` |
| `references` | List of `title` and optional `url` |

### Atlas: `src/content/atlas/`

One file per city. Required: `city`, `country`, `coordinates`, `notes`.

`coordinates` is `[latitude, longitude]`; right-click any point in OpenStreetMap or Google Maps to copy them. `notes` is the single sentence shown on the map and on cards, so write it as the one thing that city taught you. `themes` feed the map filters: Business, Travel, Cities, Culture, Growth.

### Journal: `src/content/journal/`

Short notes. Required: `title`, `date`. **Maximum 300 words: the build stops if a note is longer.** `location` can be an Atlas slug (it becomes a link) or free text.

### Library: `src/content/library/`

Required: `title`, `type`, `author`, `personalReview`. The annotation is mandatory by design: a resource without your reading of it is only a link.

### Experiments: `src/content/experiments/`

Required: `title`, `description`, `status` (idea, in progress, live, archived), `category`.

### About: `src/content/about.mdx`

One file. Plain Markdown with `##` headings.

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
