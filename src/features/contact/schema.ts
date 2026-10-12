import { z } from "zod";

/** Used when the CMS has no enquiry types configured. */
export const DEFAULT_ENQUIRY_TYPES = [
  "Commission",
  "Illustration project",
  "Animation project",
  "Collaboration",
  "Exhibition or sale",
  "Something else",
] as const;

/** Minimum time a person plausibly needs to fill in the form. Faster submissions are treated as automated. */
export const MIN_FILL_TIME_MS = 3_000;

const trimmed = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`);

/**
 * Shared by the browser (instant feedback) and the server (authoritative).
 * Error messages are written for visitors.
 */
export const contactSchema = z.object({
  name: trimmed(100).min(2, "Please enter your name."),
  email: z
    .string()
    .trim()
    .max(200, "That email address looks too long.")
    .pipe(z.email("Please enter a valid email address, e.g. name@studio.com.")),
  organisation: trimmed(150).optional().default(""),
  enquiryType: trimmed(80).min(1, "Please choose what your enquiry is about."),
  message: trimmed(5000).min(20, "Please tell me a little more about the project (at least 20 characters)."),
  timeline: trimmed(120).optional().default(""),
  budget: trimmed(120).optional().default(""),
  consent: z.literal(true, { message: "Please confirm you have read how your details are used." }),
  // Spam traps — not visible to people.
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactData, string>>;

/** Flattens Zod issues to one message per field, the first being the most relevant. */
export function toFieldErrors(error: z.ZodError): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof ContactData] = issue.message;
    }
  }
  return errors;
}

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      code: "invalid" | "rate_limited" | "too_large" | "not_configured" | "delivery_failed" | "bad_request";
      message: string;
      fieldErrors?: ContactFieldErrors;
    };
