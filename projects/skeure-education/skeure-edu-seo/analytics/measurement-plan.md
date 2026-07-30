# Measurement plan

Created 2026-07-24 during the website-build remediation pass. Companion to `event-dictionary.csv` in this
folder. Describes what's actually wired in `website-build` today versus what still needs a decision or setup
step — do not assume anything here is live in production until GSC/GA4 connection is independently confirmed
(see the master plan's rule: "Never claim OpenSEO or Search Console is connected until [MCP] calls succeed").

## Current state (as of this remediation)

- **No analytics provider is connected.** `PUBLIC_GA4_MEASUREMENT_ID` is read from the environment in
  `website-build/src/layouts/BaseLayout.astro` but is unset, so no tracking script loads and the consent
  banner never renders. This was a deliberate choice — this session did not have a real GA4 property to
  point at, and the working rules explicitly prohibit inventing/pasting placeholder IDs.
- **The event layer exists and is provider-agnostic.** `website-build/src/lib/analytics.ts` exports a typed
  `track(event, params)` function. It mirrors every event to `window.dataLayer` regardless of whether GA4 is
  configured, so a future GTM container (or a second provider) can pick events up with zero code changes.
- **Click/pageview wiring uses HTML data attributes**, not per-component script blocks — see
  `data-analytics-event` / `data-analytics-pageview` / `data-analytics-param-*` in the components listed in
  `event-dictionary.csv`. A single delegated listener in `BaseLayout.astro` reads them.
- **PII discipline:** the dictionary's params are restricted to `page_type`, `programme`, `university`,
  `cta_location`, `campaign`, `source`, `landing_page`, `field` (form-error field name only, never the value).
  Nothing from the contact form's name/email/phone/message fields is ever passed to `track()`.

## To actually turn analytics on

1. Create (or confirm) a GA4 property for `education.skeure.com`.
2. Set `PUBLIC_GA4_MEASUREMENT_ID` in the Cloudflare Pages project's environment variables (Pages dashboard →
   Settings → Environment variables — not committed to the repo).
3. Redeploy. The consent banner will start appearing for first-time visitors; GA4 only loads after a visitor
   clicks "Accept."
4. Connect GSC (see the master plan's OpenSEO MCP setup) — separate from GA4, no code change needed in
   `website-build`.

## Consent

A minimal, functional consent banner ships in `BaseLayout.astro`, gated entirely on `PUBLIC_GA4_MEASUREMENT_ID`
being set (if unset, there is nothing to consent to, so the banner doesn't render at all). Choice is stored in
`localStorage` under `skeure-consent` (`granted` / `denied`). This satisfies "don't load analytics before
consent," but is intentionally minimal — it does not yet handle jurisdiction-specific requirements (e.g. a
full cookie policy page, granular category consent, or re-prompting on policy changes). Treat it as a
functional placeholder, not a completed compliance review.

## Funnel coverage gap

Three of the master plan's required events (`book_counselling`, `application_started`, `admission_confirmed`)
can't fire from the static frontend at all — they represent things that happen after a WhatsApp conversation
or in Kuanli, not on the website. These need to be emitted from wherever that workflow actually lives
(Kuanli webhook → a small Pages Function → `track()`-equivalent server-side call, or a GA4 Measurement
Protocol call) once Kuanli is live. Not attempted this session — flagged as a dependency on the Kuanli
integration referenced in `/home/user/workspaces/AIOS/CLAUDE.md`.

`use_filter` / `start_comparison` / `complete_comparison` / `view_programme` / `download_brochure` are
similarly unimplemented because the UI surfaces they'd attach to (a working comparison/filter tool, per-brochure
download links) don't exist yet on the site — see `event-dictionary.csv` notes column per event.
