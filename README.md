# Mamush — artist portfolio

A portfolio for a multidisciplinary artist working across painting, illustration, animation and a configurable fourth discipline. Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.

All content — artworks, projects, disciplines, biography and homepage curation — lives in the [`content/`](content) folder as typed files and images. There is no database or CMS: add images and edit the files, commit, and deploy. Every page is generated at build time.

**To add or change work, read [docs/content-guide.md](docs/content-guide.md).**

> The repository ships with **sample content** so the design can be reviewed: public-domain paintings and prints from the Art Institute of Chicago (CC0) and stills from Blender Foundation open movies (CC BY). Each work's credit line names its real creator. The artist name and biography are sample copy. Replace all of it before launch.

---

## Quick start

Requires Node.js 22.12 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route types + TypeScript |
| `npm test` | Unit and integration tests (Vitest) |
| `npm run test:e2e` | Browser tests (Playwright) — see [Testing](#testing) |

## Project structure

```
content/                 everything the artist edits
  site.ts                name, biography, contact details, homepage curation, contact options
  disciplines.ts         disciplines, their order and page layout
  artworks.ts            single works (/artwork/<slug>)
  projects.ts            case studies (/projects/<slug>)
  images/                image files, imported by the files above
src/
  app/(site)/            pages: home, work, work/[discipline], projects/[slug], artwork/[slug], about, contact, privacy
  app/api/contact/       contact form endpoint
  content/               content types, validation and page data
  components/            gallery (wall labels, salon hang, lightbox), media (image, video), navigation, layout, ui
  features/              page sections per area
  lib/                   environment, SEO and structured data, routes, utilities
  styles/globals.css     design tokens
tests/                   unit, integration, e2e, fixtures
docs/content-guide.md    how to add and change content
```

## How it works

- **Content and validation.** `src/content/validate.ts` checks every content file when the site builds or runs in development: slugs, alt text, YouTube/Vimeo links, and every cross-reference (a project's disciplines, an artwork's project, homepage picks). A mistake fails the build with a readable list of problems instead of shipping a broken page.
- **Pages.** All pages are static (SSG). Detail routes use `dynamicParams = false`, so unknown URLs return a real `404`. Former slugs listed in `previousSlugs` permanently redirect (`308`) to the new address. `/work` reads its `?discipline=` filter on the server, so filtered views can be shared.
- **Disciplines are content.** The fourth discipline (or any other) is added, renamed, reordered or hidden in `content/disciplines.ts`. Only the four page layouts (`gallery`, `grid`, `screening`, `index`) are fixed in code.
- **Images.** Images are imported, so Next.js knows their exact size and generates blur previews and responsive AVIF/WebP versions. Space is reserved before images load (no layout shift), cards request only the width they need, and only the hero image is preloaded. Artwork is never cropped unless a layout deliberately does so (16:9 film stills), centred on an optional focal point.
- **Video.** YouTube (privacy-enhanced `youtube-nocookie.com`) and Vimeo (`dnt=1`) embeds, or short clips in `public/`. Nothing loads until play is pressed, and only one video plays at a time.
- **Design.** Bodoni Moda (display) and Schibsted Grotesk (interface), both SIL Open Font License, self-hosted from `@fontsource-variable` packages via `next/font/local`. Artwork metadata is set like a museum wall label. Motion is limited to one entrance moment, a thumbnail-to-page morph (React `<ViewTransition>`) and small hover states, all disabled under `prefers-reduced-motion`.
- **Accessibility.** Semantic landmarks, a skip link, visible focus, keyboard-operable menu and lightbox (native `<dialog>`, Escape to close, focus restored), labelled form errors with live status messages, and alt text required by validation.
- **SEO.** Per-page titles, descriptions, canonical URLs and Open Graph images; `sitemap.xml`; `robots.txt` (preview deployments are kept out of search engines); JSON-LD for the artist (Person), site, artworks (VisualArtwork) and films (VideoObject, only when the required data exists).

## Contact form

The form posts to `/api/contact`, which validates with the same Zod schema as the browser and only accepts the enquiry types the form offered. It rejects bodies over 16 KB, rate-limits each connection to 5 messages per 10 minutes, quietly discards honeypot or instant submissions, ignores exact duplicates, and sends a plain-text email through the Resend API with `Reply-To` set to the visitor. It never reports success unless Resend accepted the email; without configuration it says so and shows the public email address instead.

Setup: verify your domain in [Resend](https://resend.com), create an API key, and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute site URL (canonical links, sitemap, sharing images) |
| `RESEND_API_KEY` | Resend API key (server only) |
| `CONTACT_FROM_EMAIL` | Sender on your verified domain, e.g. `Portfolio <studio@yourdomain.com>` |
| `CONTACT_TO_EMAIL` | Inbox that receives enquiries |

Resend's free plan currently allows 100 emails per day and 3,000 per month. Manual check after deploying: send a test enquiry, confirm it arrives, and confirm replying goes to the visitor.

Limitation: the rate limiter counts in server memory, so on serverless hosting each instance counts separately. If spam becomes a problem, add a Vercel Firewall rate-limit rule for `POST /api/contact`.

## Testing

```bash
npm run lint && npm run typecheck && npm test
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e    # or run `npx playwright install chromium` once and omit the variable
```

- **Vitest** covers content validation and page data, helpers, SEO and structured data, the contact API (validation, delivery success and failure, rate limits, spam traps, size limits), components (form, menu, lightbox, video, images) and the real page components rendered with fixture content (`tests/fixtures/content.ts`).
- **Playwright** builds the site and checks it in desktop and mobile Chrome: axe-core WCAG 2.2 AA rules on every page in the sitemap, keyboard and focus behaviour, reduced motion, the mobile menu, the lightbox, URL filters, click-to-load video, layout shift, image sizes, 404s, titles and canonical URLs, and that the contact form never fakes success. The tests read pages from the sitemap, so they keep working when the content changes.

## Deployment

On [Vercel](https://vercel.com): import the repository (framework preset Next.js, Node.js 22), add the environment variables above, and deploy. Each push to the main branch redeploys with the latest content.

**Plan note:** Vercel's free Hobby plan is restricted to non-commercial personal use. Its fair-use guidelines count "advertising the sale of a product or service" and "receiving payment to create, update, or host the site" as commercial, so a portfolio that invites commissions, or that a developer is paid to build, needs Vercel Pro (currently $20 per developer seat per month). If unsure, ask Vercel support. Any host that runs Next.js works; the only server-side code is the contact endpoint.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Build fails with "The portfolio content has N problem(s)" | Read the list — each line names the file, the item and the problem. See the content guide. |
| An image is blurry or the wrong shape | Use a larger source file (ideally 2000px+ on the long edge); proportions always come from the file itself. |
| A renamed page shows 404 | Add the old slug to `previousSlugs` on the item. |
| Contact form says it can't accept messages | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` or `CONTACT_TO_EMAIL` missing; a `502` in logs usually means the sender domain isn't verified. |
| Dev server errors after pulling changes | Stop it, delete `.next/`, and run `npm run dev` again. |
