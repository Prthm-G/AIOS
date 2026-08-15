"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { track } from "@/lib/analytics";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Cloudflare test sitekey (always passes) as the dev/preview default. Production
// sets the real domain-locked sitekey via NEXT_PUBLIC_TURNSTILE_SITEKEY.
const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY || "1x00000000000000000000AA";
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

const INTERESTS = [
  "Universities",
  "Online Courses",
  "Distance Courses",
  "Education Loans",
  "Internship Program",
  "Career Counselling",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; consent?: string }>({});
  const [token, setToken] = useState("");

  const renderedAt = useRef<number>(0);
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  // Load the Turnstile script once, then render the widget explicitly so the token
  // flows into React state (and resets are reliable after a failed submit).
  useEffect(() => {
    let cancelled = false;

    function renderWidget() {
      if (cancelled || !window.turnstile || !widgetEl.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetEl.current, {
        sitekey: SITEKEY,
        theme: "light",
        action: "contact",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = TURNSTILE_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      const poll = window.setInterval(() => {
        if (window.turnstile) {
          window.clearInterval(poll);
          renderWidget();
        }
      }, 200);
      return () => {
        cancelled = true;
        window.clearInterval(poll);
      };
    }
    return () => {
      cancelled = true;
    };
  }, []);

  function resetTurnstile() {
    setToken("");
    if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const consent = data.get("consent") === "on";

    const nextErrors: typeof errors = {};
    if (!name) nextErrors.name = "Enter your full name.";
    if (!email || !EMAIL_RE.test(email)) nextErrors.email = "Enter your email address.";
    if (!consent) nextErrors.consent = "Please confirm you're okay with us contacting you.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = form.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    if (!token) {
      setStatus("error");
      setBanner("Please wait for the security check to finish, then try again.");
      return;
    }

    setStatus("submitting");
    setBanner("");

    const payload = {
      name,
      email,
      phone: String(data.get("phone") ?? "").trim(),
      interest: String(data.get("interest") ?? ""),
      message: String(data.get("message") ?? "").trim(),
      consent,
      company: String(data.get("company") ?? ""),
      formRenderedAt: renderedAt.current,
      turnstileToken: token,
      landingPage: typeof window !== "undefined" ? window.location.pathname : "/contact/",
      source: "website_contact_form",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok: true; persisted: boolean }
        | { ok: false; error?: string; field?: string }
        | null;

      if (res.ok && body && body.ok) {
        setStatus("success");
        setBanner(
          body.persisted
            ? "Thanks — we've received your message and will reach out shortly."
            : "Thanks — we've got your message, but please also message us on WhatsApp to make sure we see it today.",
        );
        track("submit_lead", { source: "website_contact_form" });
        form.reset();
        resetTurnstile();
        return;
      }

      // Field or server error.
      const field = body && !body.ok ? body.field : undefined;
      const msg = (body && !body.ok && body.error) || "Please check this field.";
      setStatus("error");
      setBanner(body && !body.ok && body.error ? body.error : "Something went wrong. Please try WhatsApp instead.");
      if (field === "name" || field === "email" || field === "consent") {
        setErrors((prev) => ({ ...prev, [field]: msg }));
      }
      if (field === "turnstile") resetTurnstile();
      track("lead_submit_error", { field: field ?? "unknown" });
    } catch {
      setStatus("error");
      setBanner("We couldn't reach the server. Please try WhatsApp or email instead.");
      track("lead_submit_error", { field: "network" });
      resetTurnstile();
    }
  }

  const fieldBase =
    "mt-2 w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-ink placeholder:text-ink-faint focus-visible:border-accent-ink";
  const labelBase = "text-sm font-medium text-ink";

  return (
    <form id="contact-form" onSubmit={handleSubmit} noValidate className="space-y-5">
      {banner && (
        <p
          role="status"
          aria-live="polite"
          className={
            status === "success"
              ? "rounded-lg border border-line bg-surface-2 p-4 text-sm text-ink"
              : "rounded-lg border border-accent/40 bg-accent/5 p-4 text-sm text-accent-ink"
          }
        >
          {banner}
        </p>
      )}

      <div>
        <label htmlFor={`${formId}-name`} className={labelBase}>
          Full name <span className="text-accent-ink">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={fieldBase}
        />
        {errors.name && (
          <p id={`${formId}-name-error`} className="mt-1.5 text-sm text-accent-ink">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className={labelBase}>
          Email <span className="text-accent-ink">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={fieldBase}
        />
        {errors.email && (
          <p id={`${formId}-email-error`} className="mt-1.5 text-sm text-accent-ink">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-phone`} className={labelBase}>
          Phone
        </label>
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91-XXXXXXXXXX"
          aria-describedby={`${formId}-phone-help`}
          className={fieldBase}
        />
        <p id={`${formId}-phone-help`} className="mt-1.5 text-sm text-ink-faint">
          Format: +91 followed by your 10 digit number.
        </p>
      </div>

      <div>
        <label htmlFor={`${formId}-interest`} className={labelBase}>
          Area of interest
        </label>
        <select id={`${formId}-interest`} name="interest" defaultValue="" className={fieldBase}>
          <option value="" disabled>
            Choose one…
          </option>
          {INTERESTS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className={labelBase}>
          Message
        </label>
        <textarea id={`${formId}-message`} name="message" rows={4} className={fieldBase} />
      </div>

      <div className="flex items-start gap-3">
        <input
          id={`${formId}-consent`}
          name="consent"
          type="checkbox"
          required
          aria-invalid={errors.consent ? "true" : undefined}
          aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
          className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
        />
        <label htmlFor={`${formId}-consent`} className="text-sm leading-relaxed text-ink-soft">
          I agree to be contacted about this enquiry by phone, email, or WhatsApp, per our{" "}
          <Link
            href="/privacy-policy/"
            className="text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
          >
            Privacy Policy
          </Link>
          .
        </label>
      </div>
      {errors.consent && (
        <p id={`${formId}-consent-error`} className="-mt-2 text-sm text-accent-ink">
          {errors.consent}
        </p>
      )}

      {/* Honeypot — visually hidden, never filled by humans. */}
      <div aria-hidden className="sr-only">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input id={`${formId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Cloudflare Turnstile — rendered explicitly into this container. */}
      <div ref={widgetEl} />

      <button
        type="submit"
        disabled={status === "submitting"}
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full justify-center")}
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>

      <p className="text-sm text-ink-soft">
        Prefer not to wait? Email us directly at{" "}
        <a
          href={`mailto:${site.email}`}
          data-analytics-event="click_email"
          className="text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
        >
          {site.email}
        </a>{" "}
        or{" "}
        <a
          href={site.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="click_whatsapp"
          className="text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
        >
          message us on WhatsApp
        </a>{" "}
        instead.
      </p>
    </form>
  );
}
