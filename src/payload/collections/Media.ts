import path from "node:path";
import type { CollectionConfig } from "payload";
import sharp from "sharp";
import { filesOrSignedIn, signedIn } from "../access";
import { pasteURLEndpoint } from "../endpoints/pasteURL";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

/** A tiny blurred version shown while the full image loads. */
async function blurPreview(data: Buffer): Promise<string | null> {
  try {
    const out = await sharp(data).rotate().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
    return `data:image/webp;base64,${out.toString("base64")}`;
  } catch {
    return null;
  }
}

type MediaSiblings = { mimeType?: string | null; decorative?: boolean | null };

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Media file", plural: "Media" },
  admin: {
    group: "Library",
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "updatedAt"],
    description:
      "Images, short clips, captions and PDFs. Upload large originals — the site makes fast versions automatically. To use a link instead, choose “Paste URL”, paste it, and click “Add file” before saving.",
  },
  // Runs before Payload's own paste-url endpoint, which would skip SSRF checks for allow-listed links.
  endpoints: [pasteURLEndpoint],
  access: { read: filesOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  upload: {
    // Local fallback when Vercel Blob isn't configured (development).
    staticDir: path.resolve(process.cwd(), "media"),
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm", "text/vtt", "application/pdf"],
    focalPoint: true,
    crop: false,
    // "Paste URL" first fetches in the browser, which most image sites block
    // (CORS). An allow-list makes the admin fall back to the server, and this
    // one names every https link (Payload skips empty fields, so an empty
    // hostname matches any site). The server fetch itself is pasteURLEndpoint
    // (see `endpoints` above), which refuses internal addresses.
    pasteURL: { allowList: [{ protocol: "https", hostname: "" }] },
  },
  fields: [
    {
      name: "alt",
      type: "textarea",
      label: "Description (alt text)",
      admin: {
        description:
          "Describe what is visible — subject, composition, colour, mood — in a sentence or two. Read aloud to people who can't see the image. Don't start with “Image of”.",
      },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: MediaSiblings }) => {
        const isImage = !siblingData?.mimeType || siblingData.mimeType.startsWith("image/");
        if (!isImage || siblingData?.decorative) return true;
        return (value?.trim().length ?? 0) >= 8 || "Describe the image in at least a short sentence, or tick “Decorative”.";
      },
    },
    {
      name: "decorative",
      type: "checkbox",
      label: "Decorative",
      admin: { description: "Tick only for textures or backgrounds that add nothing for someone who can't see them." },
    },
    { name: "caption", type: "text", label: "Caption", admin: { description: "Optional, shown under the image where the layout has room." } },
    { name: "blurDataURL", type: "text", admin: { hidden: true } },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const file = req.file;
        if (file?.data && file.mimetype?.startsWith("image/")) {
          data.blurDataURL = await blurPreview(file.data);
        }
        return data;
      },
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
};
