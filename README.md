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
  site.ts                name, biography, contact email, homepage curation, contact topics
  disciplines.ts         disciplines, their order and page layout
  artworks.ts            single works (/artwork/<slug>)
  projects.ts            case studies (/projects/<slug>)
  images/                image files, imported by the files above
src/
  app/(site)/            pages: home, work, work/[discipline], projects/[slug], artwork/[slug], about, contact, privacy
  content/               content types, validation and page data
  components/            gallery (justified rows, wall labels, lightbox), media (image, video), navigation, layout, ui
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
- **Accessibility.** Semantic landmarks, a skip link, visible focus, keyboard-operable menu and lightbox (native `<dialog>`, Escape to close, focus restored), and alt text required by validation.
- **SEO.** Per-page titles, descriptions, canonical URLs and Open Graph images; `sitemap.xml`; `robots.txt` (preview deployments are kept out of search engines); JSON-LD for the artist (Person), site, artworks (VisualArtwork) and films (VideoObject, only when the required data exists).

## Contact

There is no contact form and no email service. Every contact action — the contact page, each "Start a conversation" button, the availability note in the hero and "Enquire about this work" on artwork pages — opens the visitor's own email, addressed to the email in `content/site.ts`:

- **Email app** buttons use a `mailto:` link with a subject and a short draft filled in.
- **Open in Gmail** buttons open Gmail's compose window in the browser with the same draft.
- The contact page lists the topics from `enquiryTypes`; each opens an email with that subject.

Nothing is sent or stored by the website, so there is nothing to configure and no spam to filter. The address is visible on the site, as with any `mailto:` link.

The only environment variable is `NEXT_PUBLIC_SITE_URL`, the absolute site URL used for canonical links, the sitemap and sharing images.

## Testing

```bash
npm run lint && npm run typecheck && npm test
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e    # or run `npx playwright install chromium` once and omit the variable
```

- **Vitest** covers content validation and page data, gallery row building, helpers, SEO and structured data, the email contact links, components (menu, lightbox, video, images) and the real page components rendered with fixture content (`tests/fixtures/content.ts`).
- **Playwright** builds the site and checks it in desktop and mobile Chrome: axe-core WCAG 2.2 AA rules on every page in the sitemap, keyboard and focus behaviour, reduced motion, the mobile menu, the lightbox, URL filters, that every page opens at the top, click-to-load video, layout shift, image sizes, 404s, titles and canonical URLs, and that contact actions open email. The tests read pages from the sitemap, so they keep working when the content changes.

## Deployment

On [Vercel](https://vercel.com): import the repository (framework preset Next.js, Node.js 22), set `NEXT_PUBLIC_SITE_URL` to your domain, and deploy. Each push to the main branch redeploys with the latest content.

**Plan note:** Vercel's free Hobby plan is restricted to non-commercial personal use. Its fair-use guidelines count "advertising the sale of a product or service" and "receiving payment to create, update, or host the site" as commercial, so a portfolio that invites commissions, or that a developer is paid to build, needs Vercel Pro (currently $20 per developer seat per month). If unsure, ask Vercel support. Any host that runs Next.js works.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Build fails with "The portfolio content has N problem(s)" | Read the list — each line names the file, the item and the problem. See the content guide. |
| An image is blurry or the wrong shape | Use a larger source file (ideally 2000px+ on the long edge); proportions always come from the file itself. |
| A renamed page shows 404 | Add the old slug to `previousSlugs` on the item. |
| Contact buttons open the wrong address | Change `email` under `profile` in `content/site.ts`. |
| Dev server errors after pulling changes | Stop it, delete `.next/`, and run `npm run dev` again. |
