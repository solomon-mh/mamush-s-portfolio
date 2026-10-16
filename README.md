# Mamush — artist portfolio

A portfolio for a multidisciplinary artist working across painting, illustration, animation and a configurable fourth discipline. Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.

The artist manages everything — artworks, projects, disciplines, biography, homepage picks — in **[Payload CMS](https://payloadcms.com)** at `/admin`, which runs inside the same Next.js app. Content is stored in Postgres and images in Vercel Blob. Pages are generated ahead of time and refreshed automatically when something is published.

**For the artist: [docs/content-guide.md](docs/content-guide.md)** explains how to use the admin.

> The repository ships with **starter content** in [`content/`](content) so the design can be reviewed: public-domain paintings and prints from the Art Institute of Chicago (CC0) and stills from Blender Foundation open movies (CC BY). Each work's credit line names its real creator. The artist name and biography are sample copy. `npm run seed` copies it into the CMS; replace it there before launch.

---

## Quick start

Requires Node.js 22.12 or newer.

```bash
npm install
cp .env.example .env.local    # then fill in DATABASE_URL and PAYLOAD_SECRET (see below)
npm run seed                  # creates the tables and copies the starter content into the CMS
npm run dev                   # site: http://localhost:3000 · admin: http://localhost:3000/admin
```

Open `/admin` and create the first user — that account can then invite others under **Users**.

Without `DATABASE_URL` the site still runs, showing the starter content from `content/`, and `/admin` is unavailable. Tests use this mode.

### A local database

Any Postgres works. With Docker or Podman:

```bash
podman run -d --name mamush-postgres -e POSTGRES_USER=payload -e POSTGRES_PASSWORD=payload \
  -e POSTGRES_DB=mamush -p 5433:5432 docker.io/library/postgres:17-alpine
# .env.local
DATABASE_URL=postgres://payload:payload@localhost:5433/mamush
PAYLOAD_SECRET=<output of: openssl rand -hex 32>
```

(Or create a free [Neon](https://neon.tech) database and use a development branch.) Locally, uploads are saved in `media/` unless `BLOB_READ_WRITE_TOKEN` is set.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server (site + admin) |
| `npm run build` / `npm start` | Apply pending migrations, production build / serve it |
| `npm run migrate` | Apply pending database migrations |
| `npm run seed` | Copy the starter content in `content/` into an empty CMS |
| `npm run payload -- migrate:create <name>` | Create a migration after changing a collection |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after changing a collection |
| `npm run generate:importmap` | Regenerate the admin import map after adding admin components |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route types + TypeScript |
| `npm test` | Unit and integration tests (Vitest) |
| `npm run test:e2e` | Browser tests (Playwright) — see [Testing](#testing) |

## Project structure

```
content/                 starter content, seeded into the CMS (and used when no database is set)
src/
  payload.config.ts      Payload CMS: database, storage, collections
  payload/               collections (artworks, projects, disciplines, media, users), globals (site settings, profile), fields, hooks
  migrations/            database migrations (generated)
  payload-types.ts       types generated from the collections
  app/(site)/            pages: home, work, work/[discipline], projects/[slug], artwork/[slug], about, contact, privacy; draft preview routes
  app/(payload)/         the admin (/admin) and its API (/api)
  content/               page data: reads Payload (or the starter files) and shapes it for the pages
  components/            gallery (justified rows, wall labels, lightbox), media (image, video), navigation, layout, ui
  features/              page sections per area
  lib/                   environment, SEO and structured data, routes, utilities
  styles/globals.css     design tokens
scripts/                 seed and pre-build migration scripts
tests/                   unit, integration, e2e, fixtures
docs/content-guide.md    how the artist uses the admin
```

## How it works

- **The CMS.** Payload runs in the same app: the admin at `/admin`, its REST API at `/api`. Fields are labelled and described for the artist, required alt text and YouTube/Vimeo links are validated on save, and web addresses are filled in from titles. Artworks, projects and disciplines have drafts, version history and a **Preview** button, and are ordered by drag and drop. The API only answers signed-in users (except media files, which browsers load directly).
- **Pages and publishing.** `src/content/index.ts` reads Payload through its Local API (no HTTP) and maps the documents to the same view models the pages always used. All pages are static (SSG). Publishing or unpublishing anything refreshes the whole site on demand (`src/payload/hooks/revalidate.ts`); work published after a deploy renders on its first visit; unknown URLs return a real `404`. Changing a page's web address records the old one, which then permanently redirects (`308`). `/work` reads its `?discipline=` filter on the server, so filtered views can be shared.
- **Drafts.** The admin's Preview button opens `/next/preview`, which checks the admin login and turns on Next.js Draft Mode: the site then shows unpublished changes, with a banner to exit. Visitors only ever see published content.
- **Starter content.** Without a database, the same page data comes from the typed files in `content/`, validated by `src/content/validate.ts` (slugs, alt text, links and every cross-reference). Tests use this mode with fixtures; `npm run seed` copies it into the CMS.
- **Disciplines are content.** Disciplines are added, renamed, reordered or unpublished in the admin. Only the four page layouts (`gallery`, `grid`, `screening`, `index`) are fixed in code.
- **Images.** Payload records each upload's size and focal point, and stores a tiny blurred preview, so Next.js reserves space and generates responsive AVIF/WebP versions. Space is reserved before images load (no layout shift), cards request only the width they need, and only the hero image is preloaded. Artwork is never cropped unless a layout deliberately does so (16:9 film stills), centred on an optional focal point.
- **Video.** YouTube (privacy-enhanced `youtube-nocookie.com`) and Vimeo (`dnt=1`) embeds, or short clips in `public/`. Nothing loads until play is pressed, and only one video plays at a time.
- **Design.** Bodoni Moda (display) and Schibsted Grotesk (interface), both SIL Open Font License, self-hosted from `@fontsource-variable` packages via `next/font/local`. Artwork metadata is set like a museum wall label. Motion is limited to one entrance moment, a thumbnail-to-page morph (React `<ViewTransition>`) and small hover states, all disabled under `prefers-reduced-motion`.
- **Accessibility.** Semantic landmarks, a skip link, visible focus, keyboard-operable menu and lightbox (native `<dialog>`, Escape to close, focus restored), and alt text required by validation.
- **SEO.** Per-page titles, descriptions, canonical URLs and Open Graph images; `sitemap.xml`; `robots.txt` (preview deployments are kept out of search engines); JSON-LD for the artist (Person), site, artworks (VisualArtwork) and films (VideoObject, only when the required data exists).

## Contact

There is no contact form and no email service. Every contact action — the contact page, each "Start a conversation" button, the availability note in the hero and "Enquire about this work" on artwork pages — opens the visitor's own email, addressed to the email in **Profile** in the admin:

- **Email app** buttons use a `mailto:` link with a subject and a short draft filled in.
- **Open in Gmail** buttons open Gmail's compose window in the browser with the same draft.
- The contact page lists the topics from **Site settings → Contact**; each opens an email with that subject.

Nothing is sent or stored by the website, so there is no spam to filter. The address is visible on the site, as with any `mailto:` link.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute site URL for canonical links, the sitemap and sharing images |
| `DATABASE_URL` | Postgres connection string (Neon on Vercel sets it, or `POSTGRES_URL`) |
| `PAYLOAD_SECRET` | Long random string that signs admin logins (`openssl rand -hex 32`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for uploads (set by Vercel when a Blob store is connected) |

## Testing

```bash
npm run lint && npm run typecheck && npm test
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e    # or run `npx playwright install chromium` once and omit the variable
```

- **Vitest** covers content validation and page data, gallery row building, helpers, SEO and structured data, the email contact links, components (menu, lightbox, video, images) and the real page components rendered with fixture content (`tests/fixtures/content.ts`).
- **Playwright** builds the site — from the CMS when `.env.local` has a database, otherwise from the starter content — and checks it in desktop and mobile Chrome: axe-core WCAG 2.2 AA rules on every page in the sitemap, keyboard and focus behaviour, reduced motion, the mobile menu, the lightbox, URL filters, that every page opens at the top, click-to-load video, layout shift, image sizes, 404s, titles and canonical URLs, and that contact actions open email. The tests read pages from the sitemap, so they keep working when the content changes.

## Deployment

On [Vercel](https://vercel.com):

1. Import the repository (framework preset Next.js, Node.js 22).
2. In the project's **Storage** tab, create a **Neon** Postgres database and a **Blob** store and connect both to the project. This sets `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`.
3. Under **Settings → Environment Variables**, add `PAYLOAD_SECRET` (a new random string) and `NEXT_PUBLIC_SITE_URL` (your domain).
4. Deploy. The build applies database migrations first (`scripts/migrate.mjs`), so the tables are created on the first deploy.
5. To start from the starter content, run `npm run seed` once on your machine with the production `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` in `.env.local` (`vercel env pull` fetches them). Or skip it and add the real work in the admin.
6. Open `https://your-domain/admin`, create the first user, and hand the artist their login.

After that, content changes need no deploys: publishing in the admin updates the live site. Code changes deploy on each push to the main branch.

**Changing the schema.** After editing a collection in `src/payload/`, run `npm run payload -- migrate:create <name>` and `npm run generate:types`, and commit the migration. The next deploy applies it.

**Plan note:** Vercel's free Hobby plan is restricted to non-commercial personal use. Its fair-use guidelines count "advertising the sale of a product or service" and "receiving payment to create, update, or host the site" as commercial, so a portfolio that invites commissions, or that a developer is paid to build, needs Vercel Pro (currently $20 per developer seat per month). If unsure, ask Vercel support. Any host that runs Next.js works.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `/admin` errors, or the build can't connect | Check `DATABASE_URL` and `PAYLOAD_SECRET`, and run `npm run migrate`. |
| A change in the admin doesn't appear | Make sure it was **published**, not only saved as a draft. Reload once — the first visit after publishing rebuilds the page. |
| Upload fails on Vercel | Check the Blob store is connected (`BLOB_READ_WRITE_TOKEN`). |
| An image is blurry or the wrong shape | Upload a larger file (ideally 2000px+ on the long edge); proportions always come from the file itself. |
| Contact buttons open the wrong address | Change **Email** in **Profile** in the admin. |
| Starter-content build fails with "The portfolio content has N problem(s)" | Read the list — each line names the file in `content/`, the item and the problem. |
| Dev server errors after pulling changes | Stop it, delete `.next/`, and run `npm run dev` again. |
