import { z } from "zod";

/**
 * Public (browser-safe) configuration. NEXT_PUBLIC_* variables are inlined at
 * build time, so each must be referenced explicitly. Server-only secrets live
 * in `env.server.ts`.
 */
const publicSchema = z.object({
  siteUrl: z
    .url({ message: "NEXT_PUBLIC_SITE_URL must be an absolute URL, e.g. https://example.com" })
    .transform((url) => url.replace(/\/+$/, "")),
});

export type PublicEnv = z.infer<typeof publicSchema>;

function readPublicEnv(): PublicEnv {
  const parsed = publicSchema.safeParse({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  });
  if (!parsed.success) {
    throw new Error(`Invalid configuration:\n${parsed.error.issues.map((i) => `- ${i.message}`).join("\n")}`);
  }
  return parsed.data;
}

export const publicEnv = readPublicEnv();
