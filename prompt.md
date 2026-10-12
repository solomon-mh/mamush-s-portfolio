# Build a Premium Multidisciplinary Artist Portfolio — Next.js + Sanity CMS

## ROLE

Act as a senior frontend engineer, creative developer, digital art director, and CMS architect. Build a production-quality, visually distinctive portfolio website for a multidisciplinary artist.

Do not produce a generic portfolio template. Do not stop after creating a plan, wireframe, or homepage mockup. Inspect the existing project, establish a coherent architecture, and implement the complete working application, including its CMS integration, content management workflows, responsive design, interactions, testing, and documentation.

Work autonomously where decisions are straightforward. Ask for clarification only when a decision genuinely blocks implementation. Do not invent the artist's biography, client history, awards, exhibitions, or other personal facts.

The result should feel like a carefully art-directed digital exhibition combined with a professional portfolio for attracting art directors, creative directors, agencies, studios, and commission opportunities.

---

# 1. PROJECT VISION

Build a digital home for an artist who works across four creative disciplines:

- Painting
- Illustration
- Animation
- A fourth discipline that has not yet been identified

The fourth discipline must remain configurable. Never assume it is concept art, photography, sculpture, graphic design, or any other specific skill.

The site should communicate a unified artistic identity while giving each discipline an appropriate visual presentation.

The primary objective is to help potential clients quickly understand:

1. Who the artist is.
2. What kind of work they create.
3. The quality and range of their work.
4. How they approach creative projects.
5. How to contact them about professional opportunities.

The secondary objective is to give the artist an easy, reliable way to manage the website independently through a CMS.

The website must prioritize the artwork. Interface elements, typography, colors, animations, and navigation should enhance the work rather than compete with it.

## Project principles

- Art direction before decoration.
- Strong curation before excessive content.
- Distinct layouts for different creative disciplines.
- Editorial typography and intentional negative space.
- Immersive artwork viewing where appropriate.
- Excellent mobile experience.
- Accessible interactions and purposeful motion.
- Fast loading despite image- and video-heavy content.
- CMS-driven content rather than hardcoded artwork.
- Maintainable architecture without unnecessary abstraction.
- No fabricated artist information or fake client credentials.

---

# 2. REQUIRED TECHNOLOGY STACK

Use the following stack unless an actual compatibility issue requires a documented alternative.

### Core application

- Next.js with App Router.
- React.
- TypeScript with strict mode.
- Tailwind CSS.
- The latest stable, mutually compatible versions available when the project is implemented.

### CMS

Use Sanity as the headless CMS, prioritizing its free tier for a small artist portfolio.

Requirements:

- Sanity Studio for content administration.
- Structured content schemas.
- Image uploads and media management.
- Referenced content relationships.
- Draft and published content workflows where supported by the selected configuration and plan.
- Preview functionality for unpublished content.
- CMS-driven discipline pages, artworks, projects, biography, and site settings.
- Publish-triggered cache revalidation.
- A clear setup guide for creating and connecting a Sanity project.

Use the official, supported Sanity integration for Next.js when appropriate.

Before implementation, verify current Sanity plan limits and identify any features that require a paid plan. Keep the core portfolio compatible with the free tier and do not make paid functionality a dependency for basic publishing.

Do not claim that any external service is free without verifying its current limitations.

### Additional libraries

Use only when they provide real value:

- Motion for React (Framer Motion) for selected transitions.
- Lucide React for interface icons.
- Zod for runtime validation.
- React Hook Form if it meaningfully simplifies the contact form.
- A server-side email provider for contact submissions, selected according to free-tier availability and domain requirements.

Use Next.js Image for responsive media wherever compatible with the chosen CMS image delivery strategy.

Do not install large libraries for functionality that can be implemented simply with CSS or native browser capabilities.

### Deployment

Target Vercel for the Next.js application and Sanity-hosted content infrastructure, subject to current plan limitations.

Document any required external services, accounts, environment variables, and setup steps.

---

# 3. CREATIVE DIRECTION: EDITORIAL GALLERY + IMMERSIVE EXHIBITION

The visual direction is a deliberate hybrid.

The editorial gallery provides clarity, sophisticated typography, whitespace, curated layouts, and strong information hierarchy.

The immersive exhibition provides large-scale artwork, expressive compositions, cinematic media presentation, and subtle transitions.

The two approaches must feel like parts of the same visual identity.

## Visual character

The website should feel:

- Contemporary.
- Artistic.
- Sophisticated.
- Expressive.
- Confident.
- Professionally curated.
- Personal rather than corporate.
- Minimal in interface, rich in artwork.

Avoid the appearance of a generic SaaS dashboard, conventional business website, stock portfolio template, or overdesigned experimental playground.

## Initial design tokens

Start with the following design direction and refine it after examining the artwork.

- Background: warm ivory, approximately #F7F5F0.
- Primary text: near-black, approximately #191919.
- Secondary text: muted gray, approximately #686868.
- Borders: soft neutral, approximately #E4E0D8.
- Accent: one carefully chosen color that complements the actual artwork.
- Display typography: expressive editorial serif.
- Interface typography: highly legible contemporary sans-serif.
- Page width: approximately 1,440px maximum.
- Desktop gutters: approximately 48–80px.
- Mobile gutters: approximately 20–24px.
- Spacing: consistent scale based on multiples of 4px.
- Corner radius: predominantly square or subtly rounded.
- Shadows: rare and understated.

Use no more than two primary font families initially. Use properly licensed fonts and optimize their delivery.

Do not force every page to have the same composition.

### Composition principles

- Preserve the original aspect ratio of artwork.
- Never crop important content without an intentional art-direction decision.
- Alternate image sizes and gallery compositions to establish rhythm.
- Use asymmetry where it improves the composition.
- Give important work sufficient space.
- Use typography as a compositional element.
- Let colorful artwork supply most of the visual energy.
- Avoid unnecessary gradients, excessive glassmorphism, thick card borders, and generic rounded-card grids.
- Avoid fake 3D elements, excessive cursor effects, and decorative elements unrelated to the artist.
- Do not generate fake artwork and present it as the artist's actual work.

When real artwork has not yet been provided, use clearly replaceable demonstration content and document where the artist must supply genuine assets.

---

# 4. INFORMATION ARCHITECTURE

Build the following public pages.

## A. Homepage — /

The homepage should immediately communicate the artist's identity and creative range.

Implement the following sections:

### 1. Navigation

- Artist wordmark or name.
- Work.
- About.
- Contact.
- Optional social links where appropriate.
- Responsive mobile navigation.
- Clear active states.
- Accessible keyboard interaction.
- A subtle, persistent contact action where it fits the design.

The header should support the artistic composition without consuming excessive screen space.

### 2. Hero

Create a visually striking hero using:

- The artist's name.
- A concise creative positioning statement.
- A signature artwork, curated image, or short animation preview.
- A primary action to explore the work.
- An optional secondary action to learn about the artist.

Prefer a sophisticated split or asymmetrical composition over a generic centered heading.

Use one strong hero composition rather than automatically creating a carousel.

All hero content and media references should be editable through the CMS.

### 3. Selected work

Display approximately four to eight curated projects or artworks.

Requirements:

- Editorial gallery layout.
- Variable image sizes and aspect ratios.
- Clear titles and discipline labels.
- Links to relevant project or artwork pages.
- Explicit CMS-controlled ordering.
- Strong responsive behavior.

The homepage should show the artist's strongest work, not simply the latest uploads.

### 4. Disciplines

Provide dedicated visual entry points for:

- Painting.
- Illustration.
- Animation.
- The configurable fourth discipline.

Each entry should include a representative image, title, short description, and link.

Do not make the four sections visually identical if their media require different presentation.

### 5. Featured project

Show one significant project with:

- Hero image or video.
- Title.
- Short project summary.
- Relevant discipline.
- Optional client, year, or role.
- Link to the complete project.

### 6. Artist introduction

Include a short biography, artist portrait or studio image, and a link to the About page.

Only display biographical details supplied or approved by the artist.

### 7. Professional credibility

Support optional display of:

- Selected clients.
- Exhibitions.
- Publications.
- Awards.
- Collaborators.
- Professional credits.

Never fabricate these details. Hide the section when no approved information exists.

### 8. Contact call to action

Create a strong, visually integrated invitation to discuss commissions, collaborations, or creative projects.

### 9. Footer

Include navigation, contact information, approved social links, copyright, and appropriate legal links.

The homepage must not become a long sequence of generic cards. Curate its content and establish a deliberate visual rhythm.

---

## B. Work index — /work

Build an overview of the artist's selected work.

Include:

- Introductory editorial heading.
- Short description of the creative practice.
- Discipline filters or category navigation.
- Curated image grid.
- Project titles and discipline labels.
- Optional year and client metadata.
- Clear navigation to individual projects.
- Appropriate empty, loading, and error states.

The active filter should be represented in the URL when useful so visitors can share filtered views.

Filtering must work with real CMS data rather than hardcoded arrays of fake projects.

---

## C. Discipline pages — /work/[discipline]

Use one reusable, CMS-driven template for discipline pages, with configurable layout variants.

### Painting

Prioritize:

- Large artwork presentation.
- Original aspect ratios.
- Titles, dates, medium, and dimensions where available.
- Series or collection groupings when appropriate.
- Individual artwork viewing.
- Related work.

### Illustration

Support:

- Editorial illustration.
- Character design.
- Concept illustration.
- Commercial commissions.
- Personal projects.

These categories must be configurable, not assumed to exist.

### Animation

Support:

- Featured showreel or selected film.
- Video posters.
- Project duration and year.
- Role and credits.
- Storyboards and process imagery.
- Character design and production stills.
- Accessible video controls.

Do not load every video automatically.

### Fourth discipline

Provide a configurable category with:

- Editable title and slug.
- Description and introduction.
- Cover image.
- Layout variant.
- Featured work.
- Gallery or project listing.
- SEO metadata.
- Visibility and ordering controls.

An authorized CMS editor should be able to rename or replace this discipline without changing application code.

The application must handle missing or unpublished disciplines gracefully.

---

## D. Project detail — /projects/[slug]

Create a narrative-led project page designed for art directors and creative clients.

Include optional, CMS-managed sections:

1. Project introduction.
2. Hero artwork or video.
3. Brief or creative challenge.
4. Creative approach.
5. Process and exploration.
6. Final output.
7. Deliverables.
8. Client, role, year, and collaborators.
9. Credits.
10. Related projects.
11. Contact call to action.

Use structured, reorderable content blocks where appropriate.

Do not force every project to contain every section. A painting may need a straightforward artwork presentation, while an animation project may benefit from a longer case study.

Support both images and video where appropriate.

---

## E. Individual artwork — /artwork/[slug]

Create a dedicated artwork detail page where standalone artwork pages add value.

Include:

- Large image.
- Artwork title.
- Description or contextual notes.
- Discipline.
- Year.
- Medium and dimensions where relevant.
- Credits or rights information where appropriate.
- Previous and next artwork navigation when a meaningful sequence exists.
- Related artworks or project links.

Preserve the original aspect ratio.

If individual artwork pages would create unnecessary duplication with project pages, consolidate the content routes and establish one canonical URL strategy instead of maintaining redundant pages.

---

## F. About — /about

Include:

- Artist portrait or studio photography.
- Biography.
- Artistic statement.
- Creative approach.
- Disciplines.
- Optional professional experience and selected achievements.
- Optional résumé or portfolio PDF.
- Social links.
- Contact CTA.

The content must come from the CMS.

Do not invent the artist's background, personality, location, or career history.

---

## G. Contact — /contact

Build a professional contact experience with:

- Name.
- Email.
- Organization, optional.
- Enquiry type.
- Project description.
- Timeline, optional.
- Budget range, optional.
- Appropriate privacy acknowledgment.

The enquiry categories should be CMS-configurable or centrally configured.

Implement:

- Client-side validation.
- Server-side Zod validation.
- Accessible error messages.
- Loading, success, and failure states.
- Spam protection and rate limiting.
- Server-side email delivery.
- Clear privacy information.
- A direct email link as a fallback.

Do not expose email provider credentials in client-side code.

If the email provider is not configured, display a clear setup requirement in documentation and provide a safe development fallback. Do not pretend an enquiry was delivered when it was not.

---

# 5. SANITY CMS: IMPLEMENT A REAL CONTENT MANAGEMENT SYSTEM

The CMS is a core project requirement, not a future enhancement.

Create a working Sanity Studio with usable content schemas, validation, relationships, image management, and editorial instructions.

The artist should not need to edit TypeScript files to publish new work.

## Content types

### ArtistProfile

Fields:

- Name.
- Slug where useful.
- Headline.
- Short biography.
- Full biography.
- Artist statement.
- Portrait.
- Studio images.
- Optional public location.
- Contact email.
- Social links.
- Optional résumé PDF.
- SEO title.
- SEO description.
- Social sharing image.

Treat this as a singleton record or provide a clearly documented workflow for maintaining one active profile.

### Discipline

Fields:

- Title.
- Slug.
- Short description.
- Introduction.
- Cover image.
- Layout variant.
- Explicit sort order.
- Published/visible status.
- Featured projects.
- SEO title.
- SEO description.

The four disciplines must not be hardcoded into a fixed enum that requires code changes to add a new discipline.

Use CMS records and references.

### Project

Fields:

- Title.
- Slug.
- Summary.
- One or more discipline references.
- Cover image.
- Hero media.
- Year.
- Client, optional.
- Role, optional.
- Collaborators, optional.
- Brief.
- Creative approach.
- Structured content sections.
- Deliverables.
- Credits.
- Related projects.
- Featured status.
- Explicit sort order.
- Publication status.
- SEO metadata.
- Social sharing image.

### Artwork

Fields:

- Title.
- Slug.
- Description.
- Discipline reference.
- Main image.
- Meaningful alternative text.
- Caption.
- Medium, optional.
- Dimensions, optional.
- Year, optional.
- Optional project reference.
- Gallery sequence.
- Featured status.
- Visibility.
- Explicit sort order.

### SiteSettings

Fields:

- Site name.
- Site description.
- Navigation configuration where needed.
- Footer links.
- Contact information.
- Social links.
- Default SEO image.
- Global contact CTA.
- Optional announcement or availability message.

Add additional schemas only when they solve a real content-management problem.

## CMS editorial experience

Make the Studio understandable for a nontechnical artist.

Requirements:

- Clearly labeled fields.
- Helpful descriptions and validation messages.
- Required fields only when genuinely necessary.
- Image previews.
- Appropriate upload constraints.
- Reference selectors for disciplines and projects.
- Explicit curation and ordering controls.
- Draft and publishing workflows appropriate to the selected plan.
- Preview instructions.
- Clear separation between private drafts and public content.

Group fields logically, for example:

- Basic information.
- Artwork and media.
- Project details.
- Credits.
- Publishing.
- SEO.

Do not expose unnecessary technical fields to the artist.

## Image handling

Use Sanity's image pipeline or another supported image delivery strategy.

Implement:

- Responsive image URLs.
- Appropriate dimensions and quality.
- Aspect-ratio preservation.
- Thumbnail and hero-image variants where useful.
- Sensible loading behavior.
- Meaningful alternative-text fields.
- Proper Next.js image configuration for the selected host or loader.

Avoid shipping full-resolution images to every gallery card.

## Video handling

Support video through a suitable hosting or embedding strategy.

Use poster images, accessible controls, and metadata.

Avoid assuming that uploading arbitrary large video files directly to the CMS is always the best delivery method. Document supported video workflows and any external provider requirements.

## Preview and publishing

Implement a reliable draft-preview workflow where supported.

The preview system must:

- Be authenticated.
- Never expose drafts through public routes.
- Prevent draft content from contaminating public caches.
- Provide a way to exit preview.
- Be documented for the artist or administrator.

Use verified publish webhooks and the appropriate Next.js revalidation mechanism.

Validate webhook authenticity. Revalidate only relevant content where practical, including affected project pages, discipline pages, the homepage, and sitemap when necessary.

Document how to configure the webhook in Sanity.

## Free-tier discipline

Keep the core portfolio usable within the current free-tier limits where possible.

Do not depend on paid CMS features for basic artwork management.

If a requested feature is unavailable on the free plan, identify it, explain the limitation, and provide a reasonable alternative.

Do not add paid plugins, paid databases, or unnecessary external services without explicit justification.

---

# 6. APPLICATION ARCHITECTURE

Use Next.js App Router and TypeScript with strict mode.

Keep most pages as Server Components. Use Client Components only for genuine interactions.

Separate content retrieval, visual components, route handling, validation, and external-service integration.

Use a feature-oriented structure without excessive abstraction.

A suggested structure:

src/
  app/
    (site)/
      layout.tsx
      page.tsx
      work/
        page.tsx
        [discipline]/
          page.tsx
      projects/
        [slug]/
          page.tsx
      artwork/
        [slug]/
          page.tsx
      about/
        page.tsx
      contact/
        page.tsx
    api/
      contact/
        route.ts
    sitemap.ts
    robots.ts
    not-found.tsx
    error.tsx

  components/
    layout/
    navigation/
    media/
    gallery/
    ui/

  features/
    portfolio/
    disciplines/
    projects/
    artwork/
    animation/
    contact/

  lib/
    env.ts
    seo.ts
    validation.ts
    utils.ts

  styles/
    globals.css

sanity/
  schemaTypes/
  lib/
    client.ts
    queries.ts
    image.ts
  sanity.config.ts

tests/
  unit/
  integration/
  e2e/

Use the current official Sanity integration where appropriate. Adapt the structure if the actual installed integration recommends a different supported layout.

Do not create empty folders or generic service layers merely to make the architecture look sophisticated.

## Architectural requirements

- Strict TypeScript.
- Centralized environment validation.
- Centralized CMS client configuration.
- Reusable and typed CMS queries.
- Server-only secrets.
- Validated dynamic route parameters.
- Appropriate 404 handling.
- Clear loading and error states.
- Predictable component boundaries.
- No unnecessary global state.
- No duplicated CMS fetching logic across components.
- No hardcoded production artwork.
- No unexplained `any` types.
- No client-side fetching when server rendering is more appropriate.
- No fake API calls or placeholder submission success.

Use the current stable APIs for the installed Next.js version. Do not blindly copy outdated caching examples from older versions.

---

# 7. DESIGN SYSTEM AND REUSABLE COMPONENTS

Build a small, consistent component system.

Suggested components:

- SiteHeader.
- MobileNavigation.
- SiteFooter.
- EditorialHeading.
- ArtworkCard.
- ArtworkGrid.
- FeaturedArtwork.
- DisciplineCard.
- DisciplineNavigation.
- ProjectHero.
- ProjectMetadata.
- RichContentRenderer.
- MediaViewer.
- VideoPlayer.
- RelatedWork.
- ContactCTA.
- ContactForm.
- SocialLinks.
- EmptyState.
- LoadingState.
- ErrorState.

These are suggested responsibilities, not a requirement to create a component for every minor visual element.

Components should be reusable when they represent a real shared pattern.

Allow artwork cards and galleries to support different aspect ratios and layout variants.

Use semantic HTML and consistent design tokens.

Avoid giant components containing every page's logic and markup.

---

# 8. INTERACTIONS AND ANIMATION

Motion should make the website feel considered and alive, not distract from the art.

Implement:

- Subtle hero entrance.
- Restrained gallery reveals.
- Lightweight hover treatments.
- Smooth but unobtrusive navigation transitions.
- Accessible artwork lightbox where appropriate.
- Previous/next artwork navigation when relevant.
- Responsive discipline filtering.
- Appropriate video controls.
- Clear form feedback.
- Visible keyboard focus states.

Use CSS for simple transitions and Motion for more complex sequences.

Respect `prefers-reduced-motion`.

Do not:

- Hijack page scrolling.
- Force users through a long animation before viewing content.
- Hide essential information until a hover event.
- Add excessive cursor-following effects.
- Autoplay video with sound.
- Use motion that blocks navigation.
- Make the experience dependent on high-performance hardware.

All interactive controls must work with keyboard, touch, and pointer input as appropriate.

---

# 9. RESPONSIVE DESIGN

Design mobile deliberately instead of merely shrinking the desktop layout.

Test representative viewport widths, including:

- Small mobile: approximately 360px.
- Typical mobile: approximately 390–430px.
- Tablet: approximately 768px.
- Laptop: approximately 1,024–1,440px.
- Wide desktop: approximately 1,600px and above.

These are test widths, not hardcoded breakpoints.

Requirements:

- No horizontal overflow.
- Readable text and comfortable line lengths.
- Appropriate gallery rearrangement.
- Touch-friendly navigation.
- Correct image scaling.
- Accessible video controls.
- Well-sized contact form fields.
- No hover-only functionality.
- Proper behavior in portrait and landscape orientations.
- Reduced-motion support.

The visual identity should remain consistent across devices, but the composition can change to suit the screen.

---

# 10. PERFORMANCE

The portfolio will contain substantial image and video content. Performance must be addressed from the beginning.

## Images

- Use responsive image sizes.
- Preserve aspect ratios.
- Set dimensions or aspect ratios to prevent layout shifts.
- Prioritize only the actual hero/LCP image.
- Lazy-load below-the-fold media.
- Avoid downloading full-resolution originals for thumbnails.
- Use appropriate formats and image quality.
- Configure the approved image hosts correctly.
- Do not eagerly preload every gallery image.

## Video

- Use poster images.
- Load videos on demand where possible.
- Avoid multiple simultaneous video downloads.
- Provide accessible playback controls.
- Avoid autoplay with sound.
- Use appropriate external video hosting when it offers a better delivery strategy.

## Rendering

- Prefer Server Components.
- Keep client-side JavaScript small.
- Dynamically load heavy interactive viewers only where useful.
- Avoid unnecessary hydration.
- Avoid excessive dependencies.
- Use sensible CMS caching and revalidation.
- Prevent layout shifts from images, fonts, and dynamic content.

## Performance targets

Aim for the following Core Web Vitals at the 75th percentile when real-user data is available:

- LCP: 2.5 seconds or less.
- INP: 200 milliseconds or less.
- CLS: 0.1 or less.

Use Lighthouse during development and test on mobile conditions. Do not claim these targets are met without measuring them.

---

# 11. ACCESSIBILITY

Target WCAG 2.2 Level AA.

Requirements:

- Semantic page landmarks.
- Logical heading hierarchy.
- Keyboard-accessible navigation and galleries.
- Visible focus indicators.
- Appropriate color contrast.
- Meaningful image alt text.
- Empty alt text for decorative imagery.
- Accessible lightbox behavior.
- Correct focus handling when opening and closing dialogs.
- Escape-to-close where appropriate.
- Accessible form labels and errors.
- Screen-reader announcements for submission status.
- Reduced-motion support.
- Video captions or transcripts where applicable.
- No essential content available only through hover.
- Practical touch targets.
- Respect for browser zoom and text scaling.

Do not rely on automated accessibility scores alone. Manually test navigation, focus management, forms, and media controls.

---

# 12. SEO AND SOCIAL SHARING

Implement:

- Unique metadata for each public page.
- Canonical URLs.
- Open Graph metadata.
- Social sharing images.
- XML sitemap.
- Appropriate robots rules.
- Human-readable slugs.
- Descriptive image alt text.
- Proper missing-page status codes.
- Redirect handling for changed slugs.
- Correct indexing behavior for published versus draft content.
- Structured data where justified.

Potential structured data types include Person, WebSite, CreativeWork, and VideoObject when the actual content supports them.

Do not generate misleading structured data or guarantee rich search results.

Use CMS-managed SEO fields with sensible fallbacks.

Make it easy to update the domain and default social-sharing image through documented configuration.

---

# 13. CONTACT FORM AND SECURITY

Implement a working server-side contact flow.

Requirements:

- Validate incoming fields with Zod.
- Validate again on the server.
- Apply request-size limits.
- Implement appropriate rate limiting and spam protection.
- Use a server-side email provider.
- Keep credentials in server-only environment variables.
- Avoid exposing secrets in browser bundles or logs.
- Return meaningful success and error responses.
- Avoid duplicate submissions where practical.
- Provide an accessible status message.
- Do not report success if delivery failed.

For CMS publishing:

- Verify webhook signatures.
- Protect preview routes.
- Avoid exposing unpublished content.
- Validate incoming parameters.
- Revalidate only relevant paths where practical.

Use secure defaults and document any external service that requires setup.

Do not introduce a database for contact submissions unless a genuine requirement exists.

---

# 14. TESTING

Use an appropriate testing setup, such as:

- Vitest for unit tests.
- React Testing Library for component behavior.
- Playwright for end-to-end tests.
- axe-core for automated accessibility checks.
- Lighthouse for performance audits.

Test at least:

1. Homepage rendering with CMS content.
2. Discipline pages and dynamic route validation.
3. Project detail pages.
4. Artwork detail pages.
5. Missing or unpublished content.
6. CMS query failures.
7. Preview access.
8. Publish-triggered revalidation.
9. Contact form validation.
10. Successful email delivery when configured.
11. Email failure handling.
12. Keyboard navigation and reduced-motion behavior.
13. Mobile navigation.
14. Image sizing and layout stability.
15. Metadata and sitemap generation.

Do not write tests that only assert that components exist. Test meaningful behavior.

Provide deterministic fixtures for tests without treating fake content as real artist information.

---

# 15. ENVIRONMENT AND DOCUMENTATION

Create a complete `.env.example` with every required variable documented.

Include the necessary configuration for:

- Public site URL.
- Sanity project ID.
- Sanity dataset.
- Sanity API version.
- Read token if needed for the selected access model.
- Preview configuration.
- Revalidation webhook secret.
- Email provider API key.
- Verified sender address.
- Contact recipient address.
- Any rate-limiting or anti-spam service that is actually used.

Use correct server-only and public variable prefixes.

Do not commit real secrets.

Write a useful README covering:

1. Prerequisites.
2. Installation.
3. Development commands.
4. Environment configuration.
5. Sanity project creation.
6. CMS schema and Studio setup.
7. Creating the first artist profile.
8. Adding disciplines and artworks.
9. Creating projects and linking media.
10. Previewing drafts.
11. Configuring publishing webhooks.
12. Configuring contact email delivery.
13. Running tests and linting.
14. Building for production.
15. Deploying the site.
16. Updating content.
17. Troubleshooting common setup failures.

Add a CMS editorial guide written for a nontechnical artist. Explain how to upload images, write alt text, curate selected work, create projects, preview changes, publish content, and manage the fourth discipline.

---

# 16. IMPLEMENTATION WORKFLOW

Work in the following order.

## Phase 1: Inspect

Before changing files:

- Inspect the existing repository and package manager.
- Read package.json and the existing configuration.
- Understand the current Next.js version, if present.
- Identify existing components and styling conventions.
- Inspect existing assets.
- Identify missing configuration and potential conflicts.
- Do not overwrite working project code without understanding it.

If this is an empty project, initialize it using the required stack.

## Phase 2: Establish the foundation

- Configure Next.js and TypeScript.
- Configure Tailwind CSS using the correct setup for the installed version.
- Configure fonts and global design tokens.
- Install only required dependencies.
- Establish the Sanity project structure.
- Implement CMS schemas and queries.
- Add environment validation.

## Phase 3: Build the design system

- Implement typography.
- Build navigation and footer.
- Build reusable artwork and project components.
- Establish responsive gallery patterns.
- Create shared loading, error, and empty states.

## Phase 4: Build the public experience

Implement the homepage, work index, discipline pages, project pages, artwork pages, About page, and Contact page.

Use real CMS data and handle absent content correctly.

Do not hardcode the portfolio's actual content in page components.

## Phase 5: Complete CMS workflows

Verify that an editor can:

- Create and edit the artist profile.
- Create, rename, reorder, hide, and publish disciplines.
- Upload and manage artwork.
- Create and update projects.
- Associate work with multiple relevant disciplines where appropriate.
- Curate homepage content.
- Preview drafts.
- Publish changes.
- See published changes reflected on the website.

The fourth discipline must be manageable without code changes.

## Phase 6: Polish

- Refine layouts using actual artwork.
- Add purposeful motion.
- Optimize image and video delivery.
- Improve responsive behavior.
- Implement SEO and metadata.
- Test accessibility.
- Implement error and loading states.
- Complete contact delivery and spam protection.

## Phase 7: Validate

Run the project's available checks:

- TypeScript.
- Linting.
- Unit tests.
- Integration tests.
- Production build.
- End-to-end tests where configured.
- Accessibility checks.
- Performance audits.

Fix issues introduced by the implementation. Do not ignore build errors or hide them with unsafe configuration.

If an external service cannot be tested because credentials are unavailable, document the exact manual verification steps and keep the rest of the application working.

## Phase 8: Handover

Provide:

- A concise implementation summary.
- The final folder structure.
- Required environment variables.
- CMS setup instructions.
- Deployment instructions.
- Test results.
- Any outstanding limitations.
- The exact actions required from the artist or project owner.

---

# 17. ACCEPTANCE CRITERIA

The project is not complete until all applicable criteria are satisfied.

### Visual

- The website has a distinctive editorial and immersive visual identity.
- The artwork is the dominant visual element.
- Different disciplines can use appropriate presentation layouts.
- Desktop and mobile designs feel intentional.
- There are no obvious generic template sections or unnecessary decorative effects.

### Functional

- All public navigation works.
- All discipline pages are driven by CMS data.
- Project and artwork pages use valid CMS content.
- Missing content produces appropriate error or 404 behavior.
- The contact form validates and delivers enquiries when configured.
- Interactive galleries, menus, and media controls work.
- Drafts are not publicly exposed.

### CMS

- The artist can manage content through Sanity Studio.
- Images and metadata can be uploaded and edited.
- Projects and artworks can reference disciplines.
- The homepage's featured content can be curated.
- The fourth discipline can be renamed or replaced without code changes.
- Publishing updates are reflected through the configured revalidation workflow.
- The editor does not need to modify source code to publish work.

### Quality

- TypeScript and production build succeed.
- No critical runtime errors remain.
- Responsive behavior has been tested.
- Accessibility issues have been reviewed.
- Images are appropriately optimized.
- SEO metadata and sitemap work.
- Secrets are not exposed.
- Documentation is complete enough for another developer to maintain the project.

Do not claim an acceptance criterion has passed unless it has actually been verified.

---

# 18. EXECUTION RULES

Follow these rules throughout implementation.

1. Build the actual website, not just a design proposal.
2. Do not stop after generating the initial plan.
3. Do not replace implementation with pseudocode.
4. Do not create a static mockup while claiming the CMS works.
5. Do not hardcode the artist's four disciplines into an inflexible enum.
6. Do not invent artist details or fake professional credentials.
7. Do not add unnecessary authentication, databases, payments, or dashboard features.
8. Do not install dependencies without a clear purpose.
9. Do not ignore errors or claim tests passed without running them.
10. Do not expose API keys or secrets.
11. Do not sacrifice usability for animation.
12. Do not use placeholder content in a way that could accidentally appear as verified artist information.
13. Prefer simple, explicit, maintainable code over premature abstraction.
14. Follow the official documentation for the installed versions of Next.js and Sanity.
15. Preserve existing working code where possible.
16. When blocked by missing credentials, implement the integration and clearly document the missing configuration.
17. Make reasonable design decisions autonomously and explain consequential trade-offs briefly.
18. After each major phase, verify the application before proceeding.
19. If the task is too large for one execution window, continue in manageable phases and track completed work and remaining tasks. Do not falsely report completion.
20. Prioritize the quality of the final experience and the reliability of the CMS over the number of features.

# FINAL DELIVERABLE

Deliver a complete, maintainable, CMS-driven multidisciplinary artist portfolio built with Next.js App Router and TypeScript.

It should look like a bespoke digital exhibition, function as a professional portfolio for creative clients, and allow the artist to manage their work independently using a CMS that can start on its free tier.

Begin by inspecting the existing repository. Then present a concise implementation plan and proceed to build the application.

The ultimate standard is not how many components or animations the project contains. It is whether the artist's work is presented beautifully, visitors can navigate it effortlessly, potential clients understand the artist's capabilities, and the artist can manage the website without relying on a developer for routine content updates.