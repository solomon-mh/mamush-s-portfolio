import type { StaticImageData } from "next/image";
import type { Content } from "@/content/validate";
import type { ArtImage } from "@/content/types";

/**
 * Deterministic fixture content for tests. Every value is fictional test
 * data — never presented as information about the artist.
 */

export const img = (name: string, width: number, height: number, alt = `Fixture image ${name} described for tests`): ArtImage => ({
  src: { src: `/_next/static/media/${name}.jpg`, width, height, blurDataURL: "data:image/jpeg;base64,AAAA" } as StaticImageData,
  alt,
});

export function fixtureContent(): Content {
  return {
    site: {
      siteName: "Test Artist",
      siteDescription: "Fixture site description.",
      accentColor: "#2B3A9E",
      hero: { artwork: "blue-hour" },
      selectedWork: ["project:commission", "artwork:blue-hour", "artwork:hidden-artwork", "artwork:field-study", "artwork:character-sheet"],
      featuredProject: "film",
      enquiryTypes: ["Commission", "Collaboration"],
      contactCta: { heading: "Fixture invitation heading", text: "Fixture invitation text.", buttonLabel: "Write to the studio" },
    },
    profile: {
      name: "Test Artist",
      headline: "Fixture positioning statement.",
      shortBio: "Fixture short biography.",
      email: "studio@example.com",
      socialLinks: [{ platform: "instagram", url: "https://example.com/instagram" }],
      recognition: [],
    },
    disciplines: [
      { slug: "painting", title: "Painting", layout: "gallery", order: 10, shortDescription: "Fixture painting description.", cover: img("tall", 1600, 2000) },
      { slug: "illustration", title: "Illustration", layout: "grid", order: 20, cover: img("square", 1800, 1800) },
      {
        slug: "animation",
        title: "Animation",
        layout: "screening",
        order: 30,
        showreel: { title: "Fixture showreel", url: "https://www.youtube.com/watch?v=abcdefghijk", poster: img("film", 1920, 1080) },
      },
      { slug: "fixture-discipline", title: "Fixture Discipline", layout: "index", order: 40, previousSlugs: ["old-discipline"] },
      { slug: "hidden-discipline", title: "Hidden Discipline", layout: "gallery", order: 50, hidden: true },
    ],
    projects: [
      {
        slug: "commission",
        title: "Fixture Commission",
        summary: "Fixture project summary.",
        disciplines: ["illustration", "fixture-discipline"],
        cover: img("wide", 2400, 1600),
        year: 2024,
        client: "Fixture Client",
        brief: "Fixture brief text.",
        sections: [
          { type: "text", heading: "Process", body: "Fixture process text." },
          { type: "images", heading: "Sketches", layout: "pairs", images: [img("square", 1800, 1800), img("tall", 1600, 2000)] },
        ],
        credits: [{ role: "Art direction", name: "Fixture Collaborator" }],
        previousSlugs: ["old-commission"],
        order: 10,
      },
      {
        slug: "film",
        title: "Fixture Film",
        summary: "Fixture film summary.",
        disciplines: ["animation"],
        cover: img("film", 1920, 1080),
        hero: { video: { title: "Fixture film", url: "https://vimeo.com/123456789", poster: img("film", 1920, 1080) } },
        year: 2025,
        featured: true,
        order: 20,
      },
      { slug: "hidden-project", title: "Hidden Project", disciplines: ["illustration"], cover: img("square", 1800, 1800), hidden: true, order: 30 },
    ],
    artworks: [
      {
        slug: "blue-hour",
        title: "Fixture Blue Hour",
        discipline: "painting",
        image: img("tall", 1600, 2000, "Fixture description of a tall painting"),
        medium: "Oil on linen",
        dimensions: "120 × 90 cm",
        year: 2023,
        series: "Fixture Series",
        rights: "Fixture rights line",
        previousSlugs: ["old-blue-hour"],
        order: 10,
      },
      {
        slug: "field-study",
        title: "Fixture Field Study",
        discipline: "painting",
        image: img("wide", 2400, 1600, "Fixture description of a wide painting"),
        medium: "Acrylic on panel",
        year: 2024,
        series: "Fixture Series",
        order: 20,
      },
      {
        slug: "character-sheet",
        title: "Fixture Character Sheet",
        discipline: "illustration",
        image: img("square", 1800, 1800),
        project: "commission",
        order: 10,
      },
      { slug: "hidden-artwork", title: "Hidden Artwork", discipline: "painting", image: img("square", 1800, 1800), hidden: true, order: 30 },
      { slug: "in-hidden-discipline", title: "In Hidden Discipline", discipline: "hidden-discipline", image: img("square", 1800, 1800), order: 40 },
    ],
  };
}
