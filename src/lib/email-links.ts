/**
 * Contact works through the visitor's own email: these links open their email
 * app (mailto:) or Gmail's compose window with the subject and a short
 * template filled in. Nothing is sent or stored by the website itself.
 */

export interface EmailDraft {
  subject?: string;
  body?: string;
}

const clean = (text: string) => text.replace(/[\r\n]+/g, " ").trim();

/** Opens the visitor's default email app. */
export function mailtoHref(to: string, { subject, body }: EmailDraft = {}): string {
  const params = [
    subject && `subject=${encodeURIComponent(clean(subject))}`,
    body && `body=${encodeURIComponent(body)}`,
  ].filter(Boolean);
  return `mailto:${to}${params.length ? `?${params.join("&")}` : ""}`;
}

/** Opens Gmail's compose window in the browser. */
export function gmailHref(to: string, { subject, body }: EmailDraft = {}): string {
  const params = new URLSearchParams({ view: "cm", fs: "1", to });
  if (subject) params.set("su", clean(subject));
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/** A short, friendly starting point for an enquiry email. */
export function enquiryDraft(artistName: string, topic?: string): EmailDraft {
  return {
    subject: topic ? `${topic} enquiry` : "Project enquiry",
    body: [
      `Hello ${artistName},`,
      "",
      topic ? `I'd like to talk about a ${topic.toLowerCase()} project.` : "I'd like to talk about a project.",
      "",
      "What I have in mind:",
      "Where it will be used:",
      "Timeline:",
      "Budget (optional):",
      "",
      "Thanks,",
    ].join("\n"),
  };
}
