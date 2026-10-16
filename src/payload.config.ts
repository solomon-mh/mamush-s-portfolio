import path from "node:path";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Artworks } from "./payload/collections/Artworks";
import { Disciplines } from "./payload/collections/Disciplines";
import { Media } from "./payload/collections/Media";
import { Projects } from "./payload/collections/Projects";
import { Users } from "./payload/collections/Users";
import { Profile } from "./payload/globals/Profile";
import { SiteSettings } from "./payload/globals/SiteSettings";

/*
 * Payload CMS: the admin at /admin where the artist manages their work.
 * Content is stored in Postgres (DATABASE_URL) and uploads in Vercel Blob
 * (BLOB_READ_WRITE_TOKEN). Without a Blob token — e.g. in local
 * development — uploads are saved to the /media folder instead.
 */
const root = process.cwd();
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(root, "src") },
    meta: { titleSuffix: " — Portfolio admin" },
    components: {
      beforeDashboard: ["/payload/components/BeforeDashboard#BeforeDashboard"],
    },
  },
  collections: [Artworks, Projects, Disciplines, Media, Users],
  globals: [SiteSettings, Profile],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || "" },
    // The schema only changes through migrations (src/migrations), in every
    // environment. `npm run build` applies them before building; locally, run
    // `npm run migrate`. After changing a collection: `npm run payload migrate:create`.
    push: false,
  }),
  sharp,
  graphQL: { disable: true },
  upload: { limits: { fileSize: 100_000_000 } },
  typescript: { outputFile: path.resolve(root, "src/payload-types.ts") },
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      token: blobToken,
      // Same database columns with or without Blob, so one set of migrations fits every environment.
      alwaysInsertFields: true,
      addRandomSuffix: true,
      // Browsers upload straight to Blob, so large artwork files aren't limited by Vercel's request size.
      clientUploads: true,
      // Files are served straight from Blob's CDN rather than through the app.
      collections: { media: { disablePayloadAccessControl: true } },
    }),
  ],
});
