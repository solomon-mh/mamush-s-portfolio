import { fileURLToPath } from "node:url";
import sharp from "sharp";

/*
 * Node module hook for the seed script: lets `import x from "./photo.jpg"`
 * work outside Next.js by returning the file's path and dimensions, the
 * same shape Next.js gives static image imports.
 */
export async function load(url, context, nextLoad) {
  if (/\.(jpe?g|png|webp|avif|gif)$/i.test(new URL(url).pathname)) {
    const file = fileURLToPath(url);
    const { width, height } = await sharp(file).metadata();
    return { format: "module", shortCircuit: true, source: `export default ${JSON.stringify({ src: file, width, height })};` };
  }
  return nextLoad(url, context);
}
