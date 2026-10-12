# Content guide

Everything on the site comes from the files in [`content/`](../content). To publish new work: add the image, add an entry to the right file, check it locally, then commit and push. The site redeploys automatically.

| File | What it holds |
| --- | --- |
| `content/site.ts` | Your name, biography, statement, contact email, social links, homepage picks, contact form options |
| `content/disciplines.ts` | Painting, Illustration, Animation and the fourth discipline: names, order, page layout |
| `content/artworks.ts` | Single works, each with its own page |
| `content/projects.ts` | Projects told as a story: brief, approach, process images, video, credits |
| `content/images/` | The image files |

When you run `npm run dev` or `npm run build`, every file is checked. If something is wrong — a typo in a slug, a missing alt text, a link to a work that doesn't exist — you get a clear list of what to fix instead of a broken page.

---

## Images

- **Format:** JPG (photos, paintings), PNG (flat illustration with sharp edges) or WebP.
- **Size:** ideally 2000–3000px on the long edge. The site makes smaller, fast versions automatically; don't upload tiny files.
- **Names:** lowercase with dashes, e.g. `content/images/painting/blue-hour.jpg`.
- **Proportions:** always kept. Nothing is cropped, except 16:9 film stills on the animation layout — use `focus` to choose what stays in frame (see below).

Add an image to a content file by importing it at the top:

```ts
import blueHour from "./images/painting/blue-hour.jpg";
```

### Writing alt text

Alt text describes the image for people who can't see it, and it is required.

- Say what is visible: subject, composition, colour, mood. One or two sentences.
- Don't start with "Image of" or repeat the title.
- Good: `"A woman in a red coat crosses a rain-soaked street at dusk, her reflection breaking in the puddles"`.
- Purely decorative images (texture, background) can use `alt: "", decorative: true`.

---

## Add an artwork

In `content/artworks.ts`, import the image and add an entry to the list:

```ts
import blueHour from "./images/painting/blue-hour.jpg";

  {
    slug: "blue-hour",                 // the web address: /artwork/blue-hour
    title: "Blue Hour",
    discipline: "painting",            // a slug from disciplines.ts
    image: { src: blueHour, alt: "A quiet harbour at dusk, boats in silhouette against a deep blue sky" },
    year: 2025,
    medium: "Oil on linen",
    dimensions: "120 × 90 cm",
    series: "Harbour",                 // optional: groups works on the discipline page
    description: `Optional notes about the work.

A blank line starts a new paragraph.`,
    project: "harbour-commission",     // optional: links it to a project
    rights: "Private collection",      // optional credits/rights line
    featured: true,                    // optional: shown first
    order: 10,                         // lower numbers appear first
  },
```

Only `slug`, `title`, `discipline`, `image` and `order` are required.

**Slugs** use lowercase letters, numbers and single dashes (`blue-hour`, `portrait-2`). Each must be unique.

## Add a project

Projects suit work with a story — a commission, a film, a series. In `content/projects.ts`:

```ts
  {
    slug: "harbour-commission",
    title: "Harbour",
    summary: "Two or three sentences introducing the project.",
    disciplines: ["illustration"],                 // one or more; the first is the main label
    cover: { src: harbourCover, alt: "…" },
    year: 2025,
    client: "Studio Name",                         // optional
    role: "Illustrator",                           // optional
    brief: "What was asked for.",                  // optional
    approach: "How you approached it.",            // optional
    sections: [                                    // optional, shown in this order
      { type: "text", heading: "Process", body: "…" },
      { type: "images", heading: "Sketches", layout: "pairs", images: [{ src: sketch1, alt: "…" }, { src: sketch2, alt: "…" }] },
      { type: "video", heading: "Final film", video: { title: "Harbour", url: "https://vimeo.com/123456789", poster: { src: still, alt: "", decorative: true } } },
    ],
    deliverables: ["Cover illustration", "Social cut-downs"],
    credits: [{ role: "Art direction", name: "Name", url: "https://…" }],
    order: 10,
  },
```

Image `layout` options: `stack` (one per row, full width), `pairs` (two side by side), `sheet` (small grid for process work).

For films, use a **YouTube or Vimeo link** (`url`). For a very short clip you can instead put an MP4 in `public/video/` and use `file: "/video/clip.mp4"` (add `captions: "/video/clip.vtt"` if it has speech).

## Disciplines

`content/disciplines.ts` lists the disciplines in menu order. Each has a page at `/work/<slug>` and a `layout`:

| Layout | Looks like | Suits |
| --- | --- | --- |
| `gallery` | Large works hung one by one, like an exhibition | Painting |
| `grid` | Denser columns grouped by series | Illustration |
| `screening` | Showreel and films on a dark background | Animation |
| `index` | A typographic list of projects | Anything else |

**The fourth discipline** is currently called "Studio Projects". To rename it, change its `title` and `slug`, and update any artworks and projects that use the old slug. To keep old links working, add the old slug to `previousSlugs: ["studio-projects"]`.

To **hide** anything (a discipline, project or artwork) without deleting it, add `hidden: true`.

## The homepage

In `content/site.ts`:

- `hero.artwork` — the artwork shown beside your name (an artwork slug).
- `hero.loop` — optional short silent animation (`"/video/hero.mp4"` in `public/`) shown instead of the image. Visitors can pause it, and it never plays for people who prefer reduced motion.
- `selectedWork` — your strongest 4–8 pieces, in order: `"artwork:blue-hour"` or `"project:harbour-commission"`.
- `featuredProject` — one project shown large on a dark background.

## About and contact

Also in `content/site.ts`, under `profile`: name, headline, biographies, statement, approach, location (optional — only if you want it public), email, social links, portrait, studio images, experience and recognition.

**Recognition** (clients, exhibitions, publications, awards, collaborators) is shown only when filled in. Only list things you're happy to make public.

Contact form choices are `enquiryTypes` and `budgetRanges` in `site`.

To offer a CV, put the PDF in `public/` (e.g. `public/cv.pdf`) and set `resume: "/cv.pdf"`.

## Renaming a page

If you change a slug after publishing, add the old one to `previousSlugs` so existing links and search results still work:

```ts
  slug: "blue-hour",
  previousSlugs: ["blue-hour-study"],
```

## Check and publish

```bash
npm run dev        # preview at http://localhost:3000 — fix anything the checker reports
git add content
git commit -m "Add Blue Hour"
git push           # the site redeploys
```

## Replacing the sample content

The sample works are public-domain paintings and prints (Art Institute of Chicago) and Blender Foundation film stills, credited in each entry's `rights` or `credits`. To replace them:

1. Delete the sample files in `content/images/`.
2. Replace the entries in `artworks.ts` and `projects.ts` with your own.
3. Update `site.ts`: name, biography, contact email, social links, hero artwork, selected work, featured project. Remove the `footerLinks` "Image credits" entry if you no longer need it.
4. Run `npm run dev` and fix anything the checker reports.
