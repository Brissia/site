# BrissiaBenavente.com

A living digital knowledge system. Not a portfolio, not a blog: a place to read how Brissia thinks.

Built from three source documents: the Design System, the Information Architecture and the build brief. Where they disagree, the choice made is recorded in [docs/DECISIONS.md](docs/DECISIONS.md).

## Stack

| Layer      | Choice                                   | Cost |
|------------|------------------------------------------|------|
| Framework  | Next.js 16 (App Router), TypeScript      | Free |
| Styling    | Tailwind CSS v4, design tokens as CSS variables | Free |
| Content    | MDX files in `src/content`, versioned in Git | Free |
| Motion     | Motion (lazy-loaded feature set)         | Free |
| Map        | Leaflet + OpenStreetMap, no API key      | Free |
| Search     | Fuse.js, local index                     | Free |
| Fonts      | Newsreader, Inter, IBM Plex Mono, self-hosted (OFL) | Free |
| Hosting    | Vercel Hobby                             | Free |

Every page is statically generated. There is no database and no server to maintain in this version.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

Other commands: `npm run build`, `npm run start`, `npm run typecheck`. Requires Node 20 or newer.

## First things to personalize

1. `src/data/site.ts`: social links, email, calendar link and the portrait path. Empty values stay hidden in the UI.
2. `public/images/`: the portrait and cover images. Black and white only.
3. `src/content/`: every sample file says it is a sample on its first line. Replace or delete them.
4. `src/content/about.mdx`: a draft to rewrite in your own voice.
5. `.env.local` and the Vercel project settings: site URL, newsletter endpoint, analytics.

## Documentation

- [Architecture](docs/ARCHITECTURE.md): how the pieces fit and how they are meant to grow.
- [Content guide](docs/CONTENT_GUIDE.md): how to publish an essay, a place, a note.
- [Deployment](docs/DEPLOYMENT.md): GitHub, Vercel, domain, newsletter, analytics.
- [Decisions](docs/DECISIONS.md): conflicts between the source documents and what is still pending.

## Git workflow

Branches: `main` (production), `development` (preview), `feature/*`.
Commits follow Conventional Commits: `feat: add atlas component`, `fix: improve mobile navigation`, `content: publish essay on territorial intelligence`.
