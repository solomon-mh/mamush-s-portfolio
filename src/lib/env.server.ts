import "server-only";
import { z } from "zod";

/**
 * Server-only secrets. Importing this module from a Client Component fails
 * the build (via `server-only`), so credentials never reach the browser.
 * Values are read lazily so a missing integration only affects its feature.
 */

const emailSchema = z.object({
  apiKey: z.string().min(1),
  from: z.string().min(3),
  to: z.email(),
});

export type EmailConfig = z.infer<typeof emailSchema>;

/** Returns the email configuration, or null when the provider is not configured. */
export function getEmailConfig(): EmailConfig | null {
  const parsed = emailSchema.safeParse({
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL,
  });
  return parsed.success ? parsed.data : null;
}
