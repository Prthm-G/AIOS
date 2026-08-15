// POST /api/contact — Next.js Route Handler (OpenNext/Workers, Node runtime).
//
// Re-housed from the Astro/Pages Function `functions/api/contact.ts`. The wrapper
// changed (Pages Function -> Route Handler, ctx.env -> getCloudflareContext().env)
// but the lead-PII behavior is preserved line-for-line: honeypot, min-fill-time,
// field validation, ALLOWED_INTERESTS, Turnstile siteverify (fail-closed), and the
// identical INSERT into the `leads` D1 table.
//
// SAFETY / PRIVACY:
// - Never log name, email, phone, or message content.
// - Never forward PII to analytics.

import { getCloudflareContext } from "@opennextjs/cloudflare";

// Route handler — never statically prerendered; getCloudflareContext() resolves
// per request.
export const dynamic = "force-dynamic";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Canonical server-side Turnstile verification. The client widget proves nothing
 * on its own — a direct POST can omit it — so this is the control that actually
 * gates writes to D1. Fails closed: any network failure, malformed response, or
 * missing secret returns false.
 */
async function verifyTurnstile(token: string, secret: string, remoteIp: string | null): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const result = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!result.success) {
      // Error codes are non-sensitive and describe the token/secret, never the visitor.
      console.warn("contact form: turnstile verification failed", JSON.stringify(result["error-codes"] ?? []));
    }
    return result.success === true;
  } catch (err) {
    console.error("contact form: turnstile verification error", err instanceof Error ? err.message : "unknown error");
    return false;
  }
}

const ALLOWED_INTERESTS = new Set([
  "Universities",
  "Online Courses",
  "Distance Courses",
  "Education Loans",
  "Internship Program",
  "Career Counselling",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_TIME_MS = 1500;

type FieldError = { ok: false; error: string; field?: string };
// `persisted` tells the client whether this submission was actually written to
// D1. When env.DB isn't bound we still return ok:true (honeypot/timing paths rely
// on that) but persisted:false, so the UI never overstates what happened.
type Success = { ok: true; persisted: boolean };

function jsonResponse(body: FieldError | Success, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  interest?: unknown;
  message?: unknown;
  consent?: unknown;
  company?: unknown; // honeypot — must stay empty
  formRenderedAt?: unknown; // ms epoch, set client-side on page load
  turnstileToken?: unknown; // cf-turnstile-response, verified server-side
  landingPage?: unknown;
  source?: unknown;
}

export async function POST(request: Request): Promise<Response> {
  const { env } = getCloudflareContext();

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return jsonResponse({ ok: false, error: "Request body must be JSON." }, 400);
  }

  // Honeypot: bots that fill every field trip this silently. Legitimate users
  // never see or fill it (see the visually-hidden markup on the contact page).
  if (typeof payload.company === "string" && payload.company.trim().length > 0) {
    console.warn("contact form: honeypot triggered, dropping submission silently");
    return jsonResponse({ ok: true, persisted: true }, 200);
  }

  // Minimum fill-time: rejects instant/scripted submissions without penalizing
  // real users (a human can't read+fill the form in <1.5s).
  const renderedAt = Number(payload.formRenderedAt);
  if (!Number.isFinite(renderedAt) || Date.now() - renderedAt < MIN_FILL_TIME_MS) {
    console.warn("contact form: submitted too fast, dropping submission silently");
    return jsonResponse({ ok: true, persisted: true }, 200);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  if (!name || name.length > 200) {
    return jsonResponse({ ok: false, error: "Enter your full name.", field: "name" }, 400);
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return jsonResponse({ ok: false, error: "Enter a valid email address.", field: "email" }, 400);
  }

  const phoneRaw = typeof payload.phone === "string" ? payload.phone.trim() : "";
  if (phoneRaw && !/^[+\d][\d\s-]{6,19}$/.test(phoneRaw)) {
    return jsonResponse({ ok: false, error: "Enter a valid phone number, or leave it blank.", field: "phone" }, 400);
  }

  const interestRaw = typeof payload.interest === "string" ? payload.interest : "";
  const interest = ALLOWED_INTERESTS.has(interestRaw) ? interestRaw : "";

  const message = typeof payload.message === "string" ? payload.message.trim().slice(0, 5000) : "";

  if (payload.consent !== true) {
    return jsonResponse(
      { ok: false, error: "Please confirm you're okay with us contacting you about this enquiry.", field: "consent" },
      400,
    );
  }

  const landingPage = typeof payload.landingPage === "string" ? payload.landingPage.slice(0, 300) : "";
  const source = typeof payload.source === "string" ? payload.source.slice(0, 100) : "website_contact_form";

  // Turnstile gate. Runs after field validation (so a visitor fixing a typo
  // doesn't burn their single-use token) but before any write. Fails closed.
  const turnstileToken = typeof payload.turnstileToken === "string" ? payload.turnstileToken : "";
  if (!turnstileToken) {
    return jsonResponse(
      { ok: false, error: "Please complete the security check and try again.", field: "turnstile" },
      400,
    );
  }
  if (!env.TURNSTILE_SECRET) {
    console.error("contact form: TURNSTILE_SECRET is not configured, refusing to accept submissions");
    return jsonResponse({ ok: false, error: "Something went wrong on our end. Please try WhatsApp instead." }, 500);
  }
  const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, request.headers.get("cf-connecting-ip"));
  if (!turnstileOk) {
    return jsonResponse({ ok: false, error: "Security check failed. Please try again.", field: "turnstile" }, 403);
  }

  let persisted = false;
  if (env.DB) {
    try {
      await env.DB.prepare(
        `INSERT INTO leads (name, email, phone, interest, message, source, landing_page, created_at)
				 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
      )
        .bind(name, email, phoneRaw, interest, message, source, landingPage, new Date().toISOString())
        .run();
      persisted = true;
    } catch (err) {
      console.error("contact form: D1 insert failed", err instanceof Error ? err.message : "unknown error");
      return jsonResponse({ ok: false, error: "Something went wrong on our end. Please try WhatsApp instead." }, 500);
    }
  } else {
    // Preview/misconfigured environments (DB unbound): being honest
    // (persisted:false -> "also message us on WhatsApp") beats claiming a save
    // that never happened.
    console.warn("contact form: submission validated but env.DB is not bound, lead was NOT persisted");
  }

  console.log("contact form: lead accepted", JSON.stringify({ interest: interest || "unspecified", source, persisted }));

  return jsonResponse({ ok: true, persisted }, 200);
}

export async function GET(): Promise<Response> {
  return jsonResponse({ ok: false, error: "Method not allowed." }, 405);
}
