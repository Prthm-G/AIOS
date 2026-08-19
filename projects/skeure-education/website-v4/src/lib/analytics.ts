// Typed, provider-agnostic event layer. Safe no-op until a real analytics ID is
// configured. Never sends anything on its own; it just standardizes event shape.
// Ported verbatim from the Astro project.
//
// NEVER pass name, email, phone, message body, or any other PII as a param — only
// the safe dimensions (page_type, programme, university, cta_location, language,
// campaign, source, landing_page).

export type AnalyticsEvent =
  | "view_programme"
  | "view_university"
  | "use_filter"
  | "start_comparison"
  | "complete_comparison"
  | "click_whatsapp"
  | "click_call"
  | "click_email"
  | "submit_lead"
  | "lead_submit_error"
  | "download_brochure"
  | "exit_to_university"
  | "book_counselling"
  | "application_started"
  | "admission_confirmed";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  // Strip undefined so we never accidentally forward an unset PII-shaped field.
  const safeParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  if (typeof window.gtag === "function") {
    window.gtag("event", event, safeParams);
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...safeParams });
}
