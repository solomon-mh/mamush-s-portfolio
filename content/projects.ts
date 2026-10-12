/**
 * Projects: case studies with a story (brief, approach, process, final work).
 * Every field except slug, title, disciplines, cover and order is optional.
 *
 * SAMPLE CONTENT: the films and prints below are real, freely licensed works
 * by other artists, used only to preview the design. Credits name the actual
 * creators. Replace them with the artist's own projects.
 */
import type { ProjectContent } from "@/content/types";
import grandillama from "./images/animation/gran-dillama-cover.jpg";
import llamigosCover from "./images/animation/llamigos-cover.jpg";
import mineCart from "./images/animation/llamigos-mine-cart.jpg";
import llamigosNight from "./images/animation/llamigos-night.jpg";
import sintel1 from "./images/animation/sintel-1.jpg";
import sintel2 from "./images/animation/sintel-2.jpg";
import sintel3 from "./images/animation/sintel-3.jpg";
import sintel4 from "./images/animation/sintel-4.jpg";
import hamamatsu from "./images/illustration/hamamatsu.jpg";
import mishima from "./images/illustration/mishima-morning-mist.jpg";

export const projects: ProjectContent[] = [
  {
    slug: "llamigos",
    title: "Llamigos",
    summary:
      "A short comedy about a llama, a penguin and a very important bunch of berries — told almost entirely through timing, gesture and snow.",
    disciplines: ["animation"],
    cover: { src: llamigosCover, alt: "Title card for Caminandes: Llamigos — a wide-eyed llama and a small penguin clutching red berries ride a mine cart", focus: { x: 0.35, y: 0.5 } },
    hero: {
      video: {
        title: "Caminandes 3: Llamigos",
        url: "https://www.youtube.com/watch?v=SkVqJ1SGeL0",
        poster: { src: llamigosNight, alt: "", decorative: true },
      },
    },
    year: 2016,
    brief: "Make a dialogue-free short that reads instantly for audiences of any age, built around a single running gag.",
    approach: `Every beat was planned in thumbnails before any modelling began. Silhouettes had to read at a glance, so the llama's long neck and the penguin's round body became the shapes the staging was built around.

Colour shifts from warm daylight to cool night to mark the turn in the friendship.`,
    sections: [
      {
        type: "images",
        heading: "Frames",
        layout: "pairs",
        images: [
          { src: mineCart, alt: "A llama and a penguin carrying red berries ride a mine cart through a wooden tunnel" },
          { src: llamigosNight, alt: "A llama lies in the snow beside a small penguin and a pile of red berries, with a colony of penguins behind" },
        ],
      },
      {
        type: "text",
        heading: "Final film",
        body: "The finished short was released online for free, with the production files shared openly.",
      },
    ],
    deliverables: ["Animated short", "Character designs", "Storyboards"],
    credits: [
      { role: "Film", name: "Caminandes 3: Llamigos — Blender Foundation", url: "https://studio.blender.org/films/caminandes-3/" },
      { role: "Licence", name: "CC BY 4.0 — sample content", url: "https://creativecommons.org/licenses/by/4.0/" },
    ],
    featured: true,
    order: 10,
  },
  {
    slug: "sintel",
    title: "Sintel",
    summary:
      "A fantasy short about a young woman searching for the baby dragon she once rescued — an exercise in atmosphere, scale and loss.",
    disciplines: ["animation"],
    cover: { src: sintel1, alt: "A young woman with dark hair raises a blade towards an old bald man in a grey, misty landscape" },
    hero: {
      video: {
        title: "Sintel",
        url: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
        poster: { src: sintel1, alt: "", decorative: true },
      },
    },
    year: 2010,
    brief: "Create an emotionally driven fantasy short with a lone heroine, a creature companion and a twist that reframes the whole journey.",
    approach: "Wide, desaturated landscapes contrast with warm close-ups between Sintel and the dragon, so the audience feels both the size of the world and the intimacy of the bond.",
    sections: [
      {
        type: "images",
        heading: "Stills",
        layout: "sheet",
        images: [
          { src: sintel3, alt: "A small baby dragon with outstretched wings hovers beside a hand against a warm amber sky" },
          { src: sintel2, alt: "Close-up of a scaly, tusked creature with its mouth open in a dark cave" },
          { src: sintel4, alt: "A pale man in a dark coat grips a wooden staff and reaches forward through grey mist" },
          { src: sintel1, alt: "A young woman with dark hair raises a blade towards an old bald man in a grey, misty landscape" },
        ],
      },
    ],
    deliverables: ["Animated short"],
    credits: [
      { role: "Film", name: "Sintel — Blender Foundation", url: "https://durian.blender.org/" },
      { role: "Licence", name: "CC BY 3.0 — sample content", url: "https://creativecommons.org/licenses/by/3.0/" },
    ],
    order: 20,
  },
  {
    slug: "tokaido-road",
    title: "The Tōkaidō Road",
    summary:
      "A print series following travellers along the road between Edo and Kyoto — weather, ferries and towns observed station by station.",
    disciplines: ["illustration", "studio-projects"],
    cover: { src: mishima, alt: "Travellers on foot and horseback pass through a village half-hidden in grey morning mist, with tall trees fading behind" },
    year: 1834,
    client: "Sample series",
    brief: "Capture the feeling of a long journey through a sequence of single images, each with its own weather and time of day.",
    approach: `Each station became one composition with a strong horizon and a clear foreground action — porters, ferries, a procession.

A limited palette of indigo, green and warm paper tone keeps the series coherent across very different scenes.`,
    sections: [
      {
        type: "images",
        heading: "From the series",
        layout: "stack",
        images: [
          {
            src: hamamatsu,
            alt: "Porters and travellers walk along a road lined with thatched houses, a castle on the hill behind and birds in the sky",
          },
        ],
      },
    ],
    deliverables: ["Print series", "Book illustrations"],
    credits: [
      { role: "Prints", name: "Utagawa Hiroshige, Fifty-three Stations of the Tōkaidō — Art Institute of Chicago", url: "https://www.artic.edu/" },
      { role: "Licence", name: "Public domain (CC0) — sample content" },
    ],
    order: 30,
  },
  {
    slug: "gran-dillama",
    title: "Gran Dillama",
    summary: "A short about a llama determined to reach the grass on the other side of an electric fence.",
    disciplines: ["animation", "studio-projects"],
    cover: { src: grandillama, alt: "An orange llama pokes its head through a wire fence beside the title Caminandes, with snowy mountains behind", focus: { x: 0.5, y: 0.4 } },
    hero: {
      video: {
        title: "Caminandes 2: Gran Dillama",
        url: "https://www.youtube.com/watch?v=Z4C82eyhwgU",
        poster: { src: grandillama, alt: "", decorative: true },
      },
    },
    year: 2013,
    credits: [
      { role: "Film", name: "Caminandes 2: Gran Dillama — Blender Foundation", url: "https://studio.blender.org/films/caminandes-2/" },
      { role: "Licence", name: "CC BY 3.0 — sample content", url: "https://creativecommons.org/licenses/by/3.0/" },
    ],
    order: 40,
  },
];
