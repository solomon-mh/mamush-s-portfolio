"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type SubmitEvent } from "react";
import { cx } from "@/lib/utils";
import {
  contactSchema,
  toFieldErrors,
  type ContactFieldErrors,
  type ContactResponse,
} from "./schema";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

const FIELD_ORDER = ["name", "email", "organisation", "enquiryType", "message", "timeline", "budget", "consent"] as const;

export function ContactForm({
  enquiryTypes,
  budgetRanges,
  fallbackEmail,
}: {
  enquiryTypes: readonly string[];
  budgetRanges: readonly string[];
  fallbackEmail?: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef<number>(0);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const id = useId();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status.state === "success") successRef.current?.focus();
  }, [status]);

  /** Field problems: focus the first invalid field. Other failures: focus the alert. */
  function focusAfterError(fieldErrors?: ContactFieldErrors) {
    const first = fieldErrors && FIELD_ORDER.find((name) => fieldErrors[name]);
    const field = first ? formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`) : null;
    // Wait for the error state to render before moving focus.
    requestAnimationFrame(() => (field ?? statusRef.current)?.focus());
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.state === "submitting") return;

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      organisation: String(data.get("organisation") ?? ""),
      enquiryType: String(data.get("enquiryType") ?? ""),
      message: String(data.get("message") ?? ""),
      timeline: String(data.get("timeline") ?? ""),
      budget: String(data.get("budget") ?? ""),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
      startedAt: startedAt.current || undefined,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      setStatus({ state: "error", message: "Some details need attention before the message can be sent." });
      focusAfterError(fieldErrors);
      return;
    }

    setErrors({});
    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as ContactResponse | null;
      if (response.ok && result?.ok) {
        setStatus({ state: "success" });
        formRef.current?.reset();
        return;
      }
      const fieldErrors = result && !result.ok ? result.fieldErrors : undefined;
      if (fieldErrors) setErrors(fieldErrors);
      setStatus({
        state: "error",
        message: result && !result.ok ? result.message : "Your message couldn't be sent. Please try again in a moment.",
      });
      focusAfterError(fieldErrors);
    } catch {
      setStatus({
        state: "error",
        message: "Your message couldn't be sent because the connection failed. Check your connection and try again.",
      });
      focusAfterError();
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="border-t border-ink pt-8">
        <h2 ref={successRef} tabIndex={-1} className="font-display text-title focus:outline-none">
          Thank you — your message has been sent.
        </h2>
        <p className="mt-4 max-w-prose text-graphite">
          A copy went straight to the studio inbox. You&apos;ll receive a reply at the email address you provided.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle" })}
          className="link-quiet mt-6 inline-flex min-h-11 items-center"
        >
          Send another message
        </button>
      </div>
    );
  }

  const describedBy = (name: keyof ContactFieldErrors, hint?: boolean) =>
    cx(hint && `${id}-${name}-hint`, errors[name] && `${id}-${name}-error`) || undefined;

  const inputClass = (name: keyof ContactFieldErrors) =>
    cx(
      "mt-2 block min-h-12 w-full rounded-none border-0 border-b bg-transparent px-0 py-2 text-body text-ink placeholder:text-graphite/70",
      "focus:border-accent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:border-b-2",
      errors[name] ? "border-b-2 border-[#a3221b]" : "border-ink/40",
    );

  const busy = status.state === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={`${id}-required-note`} className="flex flex-col gap-8">
      <p id={`${id}-required-note`} className="text-label text-graphite">
        Fields marked optional can be left empty.
      </p>

      <div
        ref={statusRef}
        tabIndex={-1}
        role={status.state === "error" ? "alert" : "status"}
        aria-live="polite"
        className={cx(
          "focus:outline-none",
          status.state === "error" && "border-l-2 border-[#a3221b] bg-[#a3221b]/5 px-4 py-3",
        )}
      >
        {status.state === "error" && (
          <p>
            {status.message}
            {fallbackEmail && (
              <>
                {" "}
                You can also write directly to{" "}
                <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-4">
                  {fallbackEmail}
                </a>
                .
              </>
            )}
          </p>
        )}
        {busy && <p className="sr-only">Sending your message…</p>}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id={id} name="name" label="Your name" error={errors.name}>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={inputClass("name")}
          />
        </Field>
        <Field id={id} name="email" label="Email" error={errors.email}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={200}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={inputClass("email")}
          />
        </Field>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id={id} name="organisation" label="Organisation (optional)" error={errors.organisation}>
          <input
            id={`${id}-organisation`}
            name="organisation"
            type="text"
            autoComplete="organization"
            maxLength={150}
            aria-invalid={Boolean(errors.organisation)}
            aria-describedby={describedBy("organisation")}
            className={inputClass("organisation")}
          />
        </Field>
        <Field id={id} name="enquiryType" label="What is this about?" error={errors.enquiryType}>
          <select
            id={`${id}-enquiryType`}
            name="enquiryType"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.enquiryType)}
            aria-describedby={describedBy("enquiryType")}
            className={inputClass("enquiryType")}
          >
            <option value="" disabled>
              Choose one
            </option>
            {enquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id={id}
        name="message"
        label="Tell me about the project"
        hint="What you have in mind, where it will be used, and anything already decided."
        error={errors.message}
      >
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={7}
          maxLength={5000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message", true)}
          className={cx(inputClass("message"), "resize-y")}
        />
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id={id} name="timeline" label="Timeline (optional)" hint="e.g. Delivery by June" error={errors.timeline}>
          <input
            id={`${id}-timeline`}
            name="timeline"
            type="text"
            maxLength={120}
            aria-invalid={Boolean(errors.timeline)}
            aria-describedby={describedBy("timeline", true)}
            className={inputClass("timeline")}
          />
        </Field>
        <Field id={id} name="budget" label="Budget (optional)" error={errors.budget}>
          {budgetRanges.length > 0 ? (
            <select
              id={`${id}-budget`}
              name="budget"
              defaultValue=""
              aria-invalid={Boolean(errors.budget)}
              aria-describedby={describedBy("budget")}
              className={inputClass("budget")}
            >
              <option value="">Prefer not to say</option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`${id}-budget`}
              name="budget"
              type="text"
              maxLength={120}
              aria-invalid={Boolean(errors.budget)}
              aria-describedby={describedBy("budget")}
              className={inputClass("budget")}
            />
          )}
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={`${id}-consent`}
            name="consent"
            type="checkbox"
            required
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
            className="mt-1 size-5 shrink-0 accent-[var(--accent)]"
          />
          <label htmlFor={`${id}-consent`} className="max-w-prose">
            I understand my details are used only to reply to this enquiry, as described in the{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              privacy notice
            </Link>
            .
          </label>
        </div>
        {errors.consent && (
          <p id={`${id}-consent-error`} className="mt-2 text-label text-[#a3221b]">
            {errors.consent}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={busy}
          aria-disabled={busy}
          className="inline-flex min-h-12 items-center rounded-full bg-ink px-8 text-paper transition-colors hover:bg-accent disabled:cursor-progress disabled:opacity-70"
        >
          {busy ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`${id}-${name}`} className="block">
        {label}
      </label>
      {hint && (
        <p id={`${id}-${name}-hint`} className="mt-1 text-label text-graphite">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-${name}-error`} className="mt-2 text-label text-[#a3221b]">
          {error}
        </p>
      )}
    </div>
  );
}
