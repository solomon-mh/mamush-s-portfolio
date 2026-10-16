/**
 * Disciplines, in the order they appear. Rename, reorder, hide or add them
 * here — the site adapts. `layout` chooses the page design:
 *   gallery   — large works hung like an exhibition (suits painting)
 *   grid      — denser columns grouped by series (suits illustration)
 *   screening — showreel and films on a dark ground (suits animation)
 *   index     — editorial list of projects (suits anything else)
 */
import type { DisciplineContent } from "@/content/types";
import bunny from "./images/animation/big-buck-bunny.jpg";
import great from "./images/illustration/great-wave.jpg";
import llamigosNight from "./images/animation/llamigos-night.jpg";
import mishima from "./images/illustration/mishima-morning-mist.jpg";
import waterLily from "./images/painting/water-lily-pond.jpg";

export const disciplines: DisciplineContent[] = [
  {
    slug: "painting",
    title: "Painting",
    layout: "gallery",
    order: 10,
    shortDescription: "Oil paintings of water, weather and interior light, made over long sittings and many layers.",
    introduction: "Paintings that start from direct observation — a pond at midday, a cliff path in wind, a quiet interior — and slowly become studies of colour and light.",
    cover: { src: waterLily, alt: "A Japanese footbridge arching over a pond covered in water lilies, framed by dense green foliage" },
  },
  {
    slug: "illustration",
    title: "Illustration",
    layout: "grid",
    order: 20,
    shortDescription: "Editorial and narrative illustration with a printmaker's eye for line, pattern and flat colour.",
    introduction: "Editorial covers, book illustration and personal print series. The work leans on strong silhouettes, limited palettes and the rhythm of repeated forms.",
    cover: { src: great, alt: "A towering blue wave with claw-like foam curling over three boats, with Mount Fuji small in the distance" },
  },
  {
    slug: "animation",
    title: "Animation",
    layout: "screening",
    order: 30,
    shortDescription: "Short films and animated sequences, from storyboard to final frame.",
    introduction: "Character-led short films and commissioned sequences. Each project begins as a sketchbook full of storyboards and colour keys.",
    cover: { src: llamigosNight, alt: "A llama lies in the snow beside a small penguin and a pile of red berries, with a colony of penguins behind", focus: { x: 0.32, y: 0.55 } },
    // Sample showreel: Big Buck Bunny (2008), Blender Foundation, CC BY 3.0.
    showreel: {
      title: "Showreel",
      url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      poster: { src: bunny, alt: "", decorative: true },
    },
  },
  {
    // The fourth discipline isn't decided yet: rename it here when it is.
    slug: "studio-projects",
    title: "Studio Projects",
    layout: "index",
    order: 40,
    shortDescription: "Longer collaborations and personal projects that cross disciplines.",
    cover: { src: mishima, alt: "Travellers on foot and horseback pass through a village half-hidden in grey morning mist, with tall trees fading behind", focus: { x: 0.38, y: 0.55 } },
  },
];
