/**
 * Site-wide settings and the artist profile.
 *
 * SAMPLE CONTENT: the texts below are
 * sample copy so the design can be reviewed. Replace them with the artist's
 * own details. Only add biographical facts and credits the artist approves.
 */
import type { ProfileContent, SiteContent } from "@/content/types";
import portrait from "./images/studio/artist-portrait.jpg";

export const site: SiteContent = {
  siteName: "Mamush",
  siteDescription: "Painting, illustration and animation by Mamush — commissions, collaborations and exhibitions.",
  accentColor: "#2B3A9E",
  announcement: "Booking commissions for spring",

  hero: {
    artwork: "water-lily-pond",
  },
  selectedWork: [
    "project:sintel",
    "artwork:the-childs-bath",
    "artwork:great-wave",
    "artwork:stacks-of-wheat",
    "project:tokaido-road",
    "artwork:cranes-on-pine",
    "project:llamigos",
    "artwork:on-a-balcony",
  ],
  featuredProject: "llamigos",

  contactCta: {
    heading: "Have a project in mind?",
    text: "Commissions, editorial illustration, animation and collaborations — tell me what you're imagining.",
    buttonLabel: "Start a conversation",
  },
  enquiryTypes: ["Commission", "Editorial illustration", "Animation", "Collaboration", "Exhibition or sale", "Something else"],
  footerLinks: [{ label: "Image credits", href: "/about#credits" }],
};

export const profile: ProfileContent = {
  name: "Mamush",
  headline: "Painter, illustrator and animator working with light, weather and the quiet drama of everyday scenes.",
  shortBio:
    "Mamush moves between the canvas, the printed page and the moving image. Each piece begins with observation — water, cloud, a figure at a window — and is shaped into paintings, editorial illustrations and short animated films.",
  fullBio: `Mamush moves between the canvas, the printed page and the moving image. Each piece begins with observation — water, cloud, a figure at a window — and is shaped into paintings, editorial illustrations and short animated films.

The studio is full of sketchbooks, colour studies and storyboards, and ideas often travel across several media at once: a painted landscape becomes the backdrop of an animated sequence; a character drawn for a magazine cover grows into a short film.

This biography is sample text for reviewing the design.`,
  statement: `I'm interested in the moment just before something changes — the wave before it breaks, the light before a storm, the pause before a character moves.

Painting lets me hold that moment still. Animation lets me release it.`,
  approach: `Projects usually start with a conversation and a set of loose sketches. From there I share colour studies and a short written direction before moving to final artwork, so there are no surprises.

I'm happy to work with art directors, agencies and studios on commissions of any scale, from a single editorial illustration to a full animated sequence.`,
  location: "Addis Ababa, Ethiopia",
  email: "mamush@gmail.com",
  socialLinks: [
    { platform: "instagram", url: "https://www.instagram.com/" },
    { platform: "vimeo", url: "https://vimeo.com/" },
  ],
  portrait: {
    src: portrait,
    alt: "Portrait of a man with dark curly hair and a beard, in a black velvet jacket and white shirt, hands clasped on a table in a dim, high-ceilinged hall",
    caption: "Portrait — sample image: photograph by Vitaliy Shevchenko, Unsplash licence.",
  },
  experience: [],
  recognition: [],
};
