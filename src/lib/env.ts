import { z } from "zod";

/**
 * Site configuration, read on the server: canonical URLs, the sitemap and
 * sharing links are all built from `siteUrl`.
 */
const publicSchema = z.object({
  siteUrl: z
    .url({ message: "NEXT_PUBLIC_SITE_URL must be an absolute URL, e.g. https://example.com" })
    .transform((url) => url.replace(/\/+$/, "")),
});

export type PublicEnv = z.infer<typeof publicSchema>;

type EnvSource = Partial<Record<"NEXT_PUBLIC_SITE_URL" | "VERCEL_ENV" | "VERCEL_PROJECT_PRODUCTION_URL" | "VERCEL_URL", string>>;

/**
 * The site's public address. NEXT_PUBLIC_SITE_URL wins when set. Otherwise,
 * on Vercel, production uses the project's production domain (a custom
 * domain once one is added, else the .vercel.app one) and previews use their
 * own deployment URL. Locally it is http://localhost:3000. Without this,
 * production pages told search engines their address was localhost.
 */
export function resolveSiteUrl(env: EnvSource): string {
  const configured = env.NEXT_PUBLIC_SITE_URL;
  // A localhost value copied from .env.example must never reach a live deployment.
  const isLocal = configured ? /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(configured) : false;
  if (configured && !(isLocal && env.VERCEL_ENV)) return configured;
  if (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function readPublicEnv(): PublicEnv {
  const parsed = publicSchema.safeParse({
    siteUrl: resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
      VERCEL_URL: process.env.VERCEL_URL,
    }),
  });
  if (!parsed.success) {
    throw new Error(`Invalid configuration:\n${parsed.error.issues.map((i) => `- ${i.message}`).join("\n")}`);
  }
  return parsed.data;
}

export const publicEnv = readPublicEnv();
