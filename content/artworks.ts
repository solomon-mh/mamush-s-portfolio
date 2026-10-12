/**
 * Artworks: single pieces, each with its own page at /artwork/<slug>.
 * Lower `order` numbers appear first within a discipline; `series` groups works.
 *
 * SAMPLE CONTENT: these are public-domain works from the Art Institute of
 * Chicago (CC0) and stills from Blender Foundation open movies (CC BY), used
 * only to preview the design. The `rights` line credits the actual creators.
 */
import type { ArtworkContent } from "@/content/types";
import bunny from "./images/animation/big-buck-bunny.jpg";
import mineCart from "./images/animation/llamigos-mine-cart.jpg";
import cranes from "./images/illustration/cranes-on-pine.jpg";
import greatWave from "./images/illustration/great-wave.jpg";
import hamamatsu from "./images/illustration/hamamatsu.jpg";
import mishima from "./images/illustration/mishima-morning-mist.jpg";
import mitsuke from "./images/illustration/mitsuke.jpg";
import shower from "./images/illustration/shower-below-summit.jpg";
import snow from "./images/illustration/snow-at-benzaiten.jpg";
import womanBathing from "./images/illustration/woman-bathing.jpg";
import bordighera from "./images/painting/bordighera.jpg";
import cliffWalk from "./images/painting/cliff-walk.jpg";
import onABalcony from "./images/painting/on-a-balcony.jpg";
import stacks from "./images/painting/stacks-of-wheat.jpg";
import childsBath from "./images/painting/the-childs-bath.jpg";
import waterLily from "./images/painting/water-lily-pond.jpg";

const AIC = "Art Institute of Chicago, public domain (CC0) — sample image";

export const artworks: ArtworkContent[] = [
  // ------------------------------------------------------------ painting
  {
    slug: "water-lily-pond",
    title: "Water Lily Pond",
    discipline: "painting",
    series: "Light on Water",
    image: { src: waterLily, alt: "A Japanese footbridge arching over a pond covered in water lilies, framed by dense green foliage" },
    description: "Painted over several summers at the same pond, chasing how the reflections dissolve the edges of things at midday.",
    year: 1900,
    medium: "Oil on canvas",
    dimensions: "89.8 × 101 cm",
    rights: `Claude Monet. ${AIC}`,
    featured: true,
    order: 10,
  },
  {
    slug: "stacks-of-wheat",
    title: "Stacks of Wheat (End of Summer)",
    discipline: "painting",
    image: { src: stacks, alt: "Two large stacks of wheat glowing pink and gold in a field at the end of a summer day, low hills behind" },
    description: "One of a run of paintings of the same subject at different hours — the stacks stay still while the light does all the moving.",
    year: 1891,
    medium: "Oil on canvas",
    dimensions: "60 × 100.5 cm",
    rights: `Claude Monet. ${AIC}`,
    order: 20,
  },
  {
    slug: "the-childs-bath",
    title: "The Child's Bath",
    discipline: "painting",
    series: "Interiors",
    image: { src: childsBath, alt: "Seen from above, a woman in a striped dress washes the feet of a young child sitting on her lap beside a basin and jug" },
    description: "A tight, high viewpoint pulls the viewer into a private, everyday moment.",
    year: 1893,
    medium: "Oil on canvas",
    dimensions: "101.3 × 67.3 cm",
    rights: `Mary Cassatt. ${AIC}`,
    featured: true,
    order: 30,
  },
  {
    slug: "cliff-walk-at-pourville",
    title: "Cliff Walk at Pourville",
    discipline: "painting",
    series: "Light on Water",
    image: { src: cliffWalk, alt: "Two small figures stand on a windswept grassy clifftop above a choppy blue-green sea scattered with sailboats" },
    year: 1882,
    medium: "Oil on canvas",
    dimensions: "66.5 × 82.3 cm",
    rights: `Claude Monet. ${AIC}`,
    order: 40,
  },
  {
    slug: "on-a-balcony",
    title: "On a Balcony",
    discipline: "painting",
    series: "Interiors",
    image: { src: onABalcony, alt: "A woman in a white dress reads a newspaper on a balcony, surrounded by flowers and greenery" },
    year: 1879,
    medium: "Oil on canvas",
    dimensions: "85.2 × 65.5 cm",
    rights: `Mary Cassatt. ${AIC}`,
    order: 50,
  },
  {
    slug: "bordighera",
    title: "Bordighera",
    discipline: "painting",
    series: "Light on Water",
    image: { src: bordighera, alt: "Twisting pine trees frame a view of a Mediterranean town and deep blue sea in bright sunlight" },
    year: 1884,
    medium: "Oil on canvas",
    dimensions: "65 × 80.8 cm",
    rights: `Claude Monet. ${AIC}`,
    order: 60,
  },

  // --------------------------------------------------------- illustration
  {
    slug: "great-wave",
    title: "Under the Wave off Kanagawa",
    discipline: "illustration",
    series: "Thirty-Six Views",
    image: { src: greatWave, alt: "A towering blue wave with claw-like foam curling over three boats, with Mount Fuji small in the distance" },
    description: "The mountain becomes the smallest thing in the picture — scale and rhythm carry the story.",
    year: 1831,
    medium: "Colour woodblock print",
    dimensions: "25.4 × 37.6 cm",
    rights: `Katsushika Hokusai. ${AIC}`,
    featured: true,
    order: 10,
  },
  {
    slug: "shower-below-the-summit",
    title: "Shower Below the Summit",
    discipline: "illustration",
    series: "Thirty-Six Views",
    image: { src: shower, alt: "A dark red Mount Fuji rises above a band of white clouds while zigzag lightning flashes across its lower slopes" },
    year: 1831,
    medium: "Colour woodblock print",
    dimensions: "25.7 × 37.6 cm",
    rights: `Katsushika Hokusai. ${AIC}`,
    order: 20,
  },
  {
    slug: "cranes-on-pine",
    title: "Cranes on Snow-Covered Pine",
    discipline: "illustration",
    series: "Character studies",
    image: { src: cranes, alt: "Two white cranes perch on a snow-laden pine branch in a tall, narrow composition against a dark blue sky" },
    year: 1834,
    medium: "Colour woodblock print",
    dimensions: "52.4 × 23.5 cm",
    rights: `Katsushika Hokusai. ${AIC}`,
    order: 30,
  },
  {
    slug: "woman-bathing",
    title: "Woman Bathing",
    discipline: "illustration",
    series: "Character studies",
    image: { src: womanBathing, alt: "A woman in a striped skirt bends over a washstand to wash her face, a mirror and jug in front of her" },
    year: 1891,
    medium: "Colour aquatint and drypoint",
    dimensions: "36.4 × 26.9 cm",
    rights: `Mary Cassatt. ${AIC}`,
    order: 40,
  },
  {
    slug: "snow-at-benzaiten-shrine",
    title: "Snow at Benzaiten Shrine",
    discipline: "illustration",
    image: { src: snow, alt: "A small shrine on an island in a pond, its roofs and surrounding trees covered in snow, reached by a bridge" },
    year: 1844,
    medium: "Colour woodblock print",
    dimensions: "21.6 × 34 cm",
    rights: `Utagawa Hiroshige. ${AIC}`,
    order: 50,
  },
  {
    slug: "mishima-morning-mist",
    title: "Mishima: Morning Mist",
    discipline: "illustration",
    project: "tokaido-road",
    image: { src: mishima, alt: "Travellers on foot and horseback pass through a village half-hidden in grey morning mist, with tall trees fading behind" },
    year: 1833,
    medium: "Colour woodblock print",
    dimensions: "24.3 × 37.5 cm",
    rights: `Utagawa Hiroshige. ${AIC}`,
    order: 60,
  },
  {
    slug: "mitsuke",
    title: "Mitsuke: Ferries Crossing the Tenryu River",
    discipline: "illustration",
    project: "tokaido-road",
    image: { src: mitsuke, alt: "Ferry boats carry travellers across a wide shallow river between sandbanks and pine trees" },
    year: 1837,
    medium: "Colour woodblock print",
    dimensions: "16.9 × 22.8 cm",
    rights: `Utagawa Hiroshige. ${AIC}`,
    order: 70,
  },
  {
    slug: "hamamatsu",
    title: "Hamamatsu",
    discipline: "illustration",
    project: "tokaido-road",
    image: { src: hamamatsu, alt: "Porters and travellers walk along a road lined with thatched houses, a castle on the hill behind and birds in the sky" },
    year: 1837,
    medium: "Colour woodblock print",
    dimensions: "17.1 × 22.9 cm",
    rights: `Utagawa Hiroshige. ${AIC}`,
    order: 80,
  },

  // ------------------------------------------------------------ animation
  {
    slug: "meadow-friends",
    title: "Meadow Friends",
    discipline: "animation",
    image: { src: bunny, alt: "A squirrel, a flying squirrel and a chinchilla gather by a tree trunk in a sunny meadow" },
    description: "Character line-up frame from a short comedy.",
    year: 2008,
    medium: "Still from an animated short",
    rights: "Big Buck Bunny © Blender Foundation, CC BY 3.0 — sample image",
    order: 10,
  },
  {
    slug: "mine-cart",
    title: "Mine Cart",
    discipline: "animation",
    project: "llamigos",
    image: { src: mineCart, alt: "A llama and a penguin carrying red berries ride a mine cart through a wooden tunnel" },
    year: 2016,
    medium: "Still from an animated short",
    rights: "Caminandes 3: Llamigos © Blender Foundation, CC BY 4.0 — sample image",
    order: 20,
  },
];
