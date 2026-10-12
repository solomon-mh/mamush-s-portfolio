import "server-only";
import type { EmailConfig } from "@/lib/env.server";
import { clientKey, type RateLimiter } from "./rate-limit";
import { contactSchema, MIN_FILL_TIME_MS, toFieldErrors, type ContactData, type ContactResponse } from "./schema";
import { EmailDeliveryError } from "./send-email";

/** Enquiries are small; anything larger is rejected before parsing. */
export const MAX_BODY_BYTES = 16 * 1024;

export interface ContactDeps {
  limiter: RateLimiter;
  getEmailConfig: () => EmailConfig | null;
  send: (config: EmailConfig, data: ContactData) => Promise<void>;
  /** Enquiry types the form currently offers. */
  getEnquiryTypes: () => Promise<readonly string[]>;
  /** Recently delivered submissions, to swallow accidental double-submits. */
  recent: Map<string, number>;
  now?: () => number;
  log?: Pick<Console, "info" | "warn" | "error">;
}

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

function json(body: ContactResponse, status: number): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function fingerprint(data: ContactData): string {
  return `${data.email.toLowerCase()}|${data.enquiryType}|${data.message.slice(0, 500)}`;
}

export async function handleContactRequest(request: Request, deps: ContactDeps): Promise<Response> {
  const now = deps.now?.() ?? Date.now();
  const log = deps.log ?? console;

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json({ ok: false, code: "bad_request", message: "Unsupported request format." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, code: "too_large", message: "Your message is too long. Please shorten it." }, 413);
  }

  if (!deps.limiter.check(clientKey(request.headers), now)) {
    return json(
      {
        ok: false,
        code: "rate_limited",
        message: "Too many messages were sent from your connection. Please wait a few minutes and try again.",
      },
      429,
    );
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, code: "bad_request", message: "The request could not be read." }, 400);
  }
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return json({ ok: false, code: "too_large", message: "Your message is too long. Please shorten it." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, code: "bad_request", message: "The request could not be read." }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        code: "invalid",
        message: "Please check the highlighted fields.",
        fieldErrors: toFieldErrors(parsed.error),
      },
      400,
    );
  }
  const data = parsed.data;

  const enquiryTypes = await deps.getEnquiryTypes();
  if (!enquiryTypes.includes(data.enquiryType)) {
    return json(
      {
        ok: false,
        code: "invalid",
        message: "Please check the highlighted fields.",
        fieldErrors: { enquiryType: "Please choose one of the listed options." },
      },
      400,
    );
  }

  // Spam traps: a filled honeypot or an instant submission is almost always a bot.
  // Respond as if accepted so bots learn nothing, but never send anything.
  const filledTooFast = data.startedAt !== undefined && now - data.startedAt < MIN_FILL_TIME_MS;
  if (data.website || filledTooFast) {
    log.warn("[contact] Submission discarded by spam checks.");
    return json({ ok: true }, 200);
  }

  for (const [key, at] of deps.recent) if (now - at > DUPLICATE_WINDOW_MS) deps.recent.delete(key);
  const key = fingerprint(data);
  if (deps.recent.has(key)) {
    // Already delivered moments ago — the visitor likely double-submitted.
    return json({ ok: true }, 200);
  }

  const config = deps.getEmailConfig();
  if (!config) {
    if (process.env.NODE_ENV !== "production") {
      log.info("[contact] Email delivery is not configured. Enquiry received in development:", {
        name: data.name,
        email: data.email,
        enquiryType: data.enquiryType,
      });
    } else {
      log.error("[contact] Email delivery is not configured (RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL).");
    }
    return json(
      {
        ok: false,
        code: "not_configured",
        message: "The contact form isn't accepting messages right now. Please use the email address below instead.",
      },
      503,
    );
  }

  try {
    await deps.send(config, data);
  } catch (error) {
    const detail = error instanceof EmailDeliveryError ? error.message : "Unknown error";
    log.error(`[contact] Delivery failed: ${detail}`);
    return json(
      {
        ok: false,
        code: "delivery_failed",
        message: "Your message couldn't be sent. Please try again in a moment, or use the email address below.",
      },
      502,
    );
  }

  deps.recent.set(key, now);
  return json({ ok: true }, 200);
}
