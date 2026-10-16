/*
 * Sets the Profile global from the starter content in content/site.ts, for a
 * seed that stopped before the Profile. The portrait reuses the image the
 * seed already uploaded. Reads production settings from .env.production.local
 * (`vercel env pull`).
 *   npx tsx --import ./scripts/register-image-hooks.mjs scripts/seed-profile.ts
 * On networks without IPv6, prefix with NODE_OPTIONS=--dns-result-order=ipv4first.
 * Pages show the new Profile after the next deploy.
 */
import nextEnv from "@next/env";
import { getPayload } from "payload";
import { profile } from "../content/site";

// Production mode: .env.production.local wins over .env.local.
nextEnv.loadEnvConfig(process.cwd(), false);
const host = (process.env.DATABASE_URL ?? "").split("@")[1]?.split("/")[0];
if (!host || host.startsWith("localhost")) throw new Error("DATABASE_URL in .env.production.local is missing or local.");
console.log(`Writing the Profile to ${host}`);

const { default: config } = await import("../src/payload.config");
const payload = await getPayload({ config });

// The repair script may have renamed the upload, e.g. "artist-portrait-1-<random>.webp".
const portrait = await payload.find({ collection: "media", where: { filename: { like: "artist-portrait" } }, sort: "-updatedAt", limit: 1, depth: 0 });
if (!portrait.docs[0]) throw new Error("The portrait upload is missing. Was the seed run first?");

await payload.updateGlobal({
  slug: "profile",
  context: { disableRevalidate: true },
  data: {
    name: profile.name,
    headline: profile.headline,
    shortBio: profile.shortBio,
    fullBio: profile.fullBio,
    statement: profile.statement,
    approach: profile.approach,
    location: profile.location,
    email: profile.email,
    socialLinks: profile.socialLinks?.map((l) => ({ ...l, platform: l.platform as "instagram" })),
    portrait: portrait.docs[0].id,
    experience: profile.experience,
    recognition: profile.recognition,
  },
});

const saved = await payload.findGlobal({ slug: "profile", depth: 0 });
console.log(`Done: name "${saved.name}", email ${saved.email ? "set" : "missing"}, portrait #${saved.portrait}.`);
process.exit(0);
