import "server-only";
import type { EmailConfig } from "@/lib/env.server";
import type { ContactData } from "./schema";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export class EmailDeliveryError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

/** Plain-text body: robust in every mail client and immune to HTML injection. */
export function formatEnquiry(data: ContactData): { subject: string; text: string } {
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.organisation && `Organisation: ${data.organisation}`,
    `Enquiry type: ${data.enquiryType}`,
    data.timeline && `Timeline: ${data.timeline}`,
    data.budget && `Budget: ${data.budget}`,
    "",
    data.message,
    "",
    "—",
    "Sent from the contact form on your website. Reply to this email to respond directly.",
  ].filter((line): line is string => typeof line === "string");

  // Strip line breaks from the subject to prevent header injection.
  const subject = `New enquiry: ${data.enquiryType} from ${data.name}`.replace(/[\r\n]+/g, " ").slice(0, 150);
  return { subject, text: lines.join("\n") };
}

/** Sends the enquiry through the Resend REST API. Throws EmailDeliveryError on failure. */
export async function sendEnquiryEmail(
  config: EmailConfig,
  data: ContactData,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const { subject, text } = formatEnquiry(data);
  let response: Response;
  try {
    response = await fetchImpl(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: data.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new EmailDeliveryError(error instanceof Error ? error.message : "Network error");
  }

  if (!response.ok) {
    // Log the provider's message without the request body (which holds personal data).
    let detail = "";
    try {
      const body = (await response.json()) as { message?: string; name?: string };
      detail = body.message ?? body.name ?? "";
    } catch {
      // ignore unparsable bodies
    }
    throw new EmailDeliveryError(`Email provider responded ${response.status}${detail ? `: ${detail}` : ""}`, response.status);
  }
}
