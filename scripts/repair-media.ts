/*
 * Re-uploads starter images whose files are missing from Vercel Blob (a seed
 * run before a1a1a10 skipped every upload after the first). Each media record
 * is matched to its source image in /content by alt text and dimensions, then
 * its file is replaced, so every page that uses it keeps working. Reads
 * production settings from .env.production.local (`vercel env pull`).
 *   npx tsx --import ./scripts/register-image-hooks.mjs scripts/repair-media.ts           # report only
 *   npx tsx --import ./scripts/register-image-hooks.mjs scripts/repair-media.ts --apply   # upload
 * On networks without IPv6, prefix with NODE_OPTIONS=--dns-result-order=ipv4first.
 * Pages show the new files after the next deploy.
 */
import nextEnv from "@next/env";
import { getPayload } from "payload";
import { artworks } from "../content/artworks";
import { disciplines } from "../content/disciplines";
import { projects } from "../content/projects";
import { profile, site } from "../content/site";

const apply = process.argv.includes("--apply");

// Production mode: .env.production.local wins over .env.local.
nextEnv.loadEnvConfig(process.cwd(), false);
const host = (process.env.DATABASE_URL ?? "").split("@")[1]?.split("/")[0];
if (!host || host.startsWith("localhost")) throw new Error("DATABASE_URL in .env.production.local is missing or local.");
if (!process.env.BLOB_READ_WRITE_TOKEN?.startsWith("vercel_blob_rw_")) throw new Error("BLOB_READ_WRITE_TOKEN is missing.");
console.log(`${apply ? "Repairing" : "Checking (report only)"} media on ${host}`);

// Every starter image, keyed by what Payload stored about it. Video posters
// have no alt text, so several files can share a key: ties are broken by
// filename, ignoring the numeric suffixes Payload adds ("sintel-10.jpg").
type Found = { file: string; alt: string };
const sources = new Map<string, Found[]>();
const key = (alt: string, width: number, height: number) => `${alt.trim()}|${width}x${height}`;
const stem = (name: string) => (name.split("/").pop() ?? name).replace(/\.[a-z0-9]+$/i, "").replace(/-\d+$/, "");
(function walk(value: unknown) {
  if (!value || typeof value !== "object") return;
  const v = value as { src?: { src?: unknown; width?: number; height?: number }; alt?: unknown };
  if (typeof v.src?.src === "string" && typeof v.alt === "string" && v.src.width && v.src.height) {
    const k = key(v.alt, v.src.width, v.src.height);
    const list = sources.get(k) ?? [];
    if (!list.some((f) => f.file === v.src!.src)) list.push({ file: v.src.src as string, alt: v.alt });
    sources.set(k, list);
  }
  for (const child of Object.values(value)) walk(child);
})({ artworks, disciplines, projects, profile, site });

const { default: config } = await import("../src/payload.config");
const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: "media", limit: 500, depth: 0, sort: "id" });
console.log(`Connected. Checking ${docs.length} files…`);

let missing = 0;
let repaired = 0;
for (const m of docs) {
  const ok = m.url ? (await fetch(m.url, { method: "HEAD" })).ok : false;
  if (ok) continue;
  missing++;
  const candidates = sources.get(key(m.alt ?? "", m.width ?? 0, m.height ?? 0)) ?? [];
  const source = candidates.length === 1 ? candidates[0] : candidates.find((c) => stem(c.file) === stem(m.filename ?? ""));
  if (!source) {
    console.log(`  #${m.id} ${m.filename}: file missing, and no single matching starter image. Re-upload it in the admin.`);
    continue;
  }
  if (!apply) {
    console.log(`  #${m.id} ${m.filename}: file missing, would upload ${source.file.split("/content/")[1] ?? source.file}`);
    continue;
  }
  console.log(`  #${m.id} ${m.filename}: uploading…`);
  try {
    await payload.update({
      collection: "media",
      id: m.id,
      data: {},
      filePath: source.file,
      context: { disableRevalidate: true },
      depth: 0,
    });
    // Re-read: the storage plugin saves the uploaded file's name after update returns.
    const updated = await payload.findByID({ collection: "media", id: m.id, depth: 0 });
    const live = updated.url ? (await fetch(updated.url, { method: "HEAD" })).ok : false;
    console.log(`  #${m.id} -> ${updated.filename}: ${live ? "uploaded" : "STILL MISSING"}`);
    if (live) repaired++;
  } catch (err) {
    console.log(`  #${m.id} FAILED: ${err instanceof Error ? err.message : String(err)}`);
  }
}

console.log(apply ? `Done: ${repaired} of ${missing} missing files uploaded.` : `${missing} of ${docs.length} files are missing. Run again with --apply to upload them.`);
process.exit(0);
