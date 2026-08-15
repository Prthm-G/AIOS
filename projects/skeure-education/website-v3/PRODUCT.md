# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 (App Router, React 19, TypeScript) + Tailwind v4, mostly React Server
Components with client components only where interaction/motion requires them
(`motion/react`, Lenis). Deployed to Cloudflare Workers via the OpenNext adapter
(`@opennextjs/cloudflare`). Content is markdown validated at build by ported Zod
schemas; the contact endpoint is a Route Handler backed by Cloudflare D1. This is
`website-v3`, a ground-up visual rebuild that supersedes the prior Astro site
(`website-build`) as the canonical build; product facts are ported unchanged.

## Users

Prospective students and their families in and around Punjab, India, evaluating an
online UG/PG degree. They arrive uncertain about whether "online" degrees are real
and recognised, what they cost, and how to pay — often first contact is on mobile,
over WhatsApp. State of mind: cautious, comparison-shopping, wary of being upsold.

## Product Purpose

Skeure Education is an admissions-counselling service that guides students into
UGC-recognised online degrees from partner universities (LPU, Amity, and others).
The site's job is to earn enough trust for the visitor to start a free WhatsApp
counselling conversation. Success = a qualified WhatsApp lead.

## Positioning

"The classic degree you know, now delivered online." Skeure counsels across
*multiple* partner universities rather than pushing one, and confirms exact
financing terms in writing before the student applies. Free counselling,
no-pressure, plain-language.

## Operating Context

Primary channel is WhatsApp (`+91-95922-00021`, wired site-wide as
`site.whatsappLink`). Country-level location only by explicit decision — no street
address, city, or region is ever published (office move pending; a stale indexed
address is a known risk). Say "based in India" and nothing narrower.

## Capabilities and Constraints

- 11 partner universities as markdown content collections; the count is rendered
  live from content, never hardcoded. 5 site FAQs (4 general, 1 financing), 1 blog
  post, testimonials collection currently empty (must render conditionally).
- Contact form / lead handling runs through a Route Handler against Cloudflare D1
  — this carries lead PII and its logic is out of scope for design work (ported
  verbatim, only re-housed across runtimes).
- Hard SEO constraints, all must be preserved: canonical trailing-slash URLs,
  sitemap `noindex` sync (`/privacy-policy/`, `/terms/`,
  `/universities/online-manipal-university/`), JSON-LD, and the one 301
  (chitkara → /universities/).
- 14 routes reproduced from the current site. Turnstile protects the contact form.

## Brand Commitments

- Name **Skeure Education**; tagline **"Every Step, Made Clear."**
- Voice: warm, plain, structured; short sentences, no jargon, no hype, no pressure.
- Primary CTA everywhere is WhatsApp; one clear next step per surface.
- **Do-not list (`brand.json`):** no heavy drop shadows, no skeuomorphic bevels,
  no generic stock-photo people, no cluttered compositions, no neon cyberpunk, no
  AI-slop gradients.
- **Pinned v3 visual direction (binding, this rebuild):** a warm-greige monochrome
  system anchored to the midlife.engineering reference — single amber accent,
  giant lowercase grotesque display, hairline structure, calm scroll motion.
  Applied globally to every page (no per-page skins). Token/type/motion details
  live in DESIGN.md, written from the built world at finish.

## Evidence on Hand

Real: 11 partner universities, testimonials collection (currently empty), real
WhatsApp/phone/email, real retro-computer hero render + video (`public/hero.*`),
5 CC-licensed campus photos requiring attribution (rendered on /credits/). No
invented prices, lender names, customer counts, or placement stats — financing
terms are deliberately not published (confirmed per-student in writing).

## Product Principles

1. Trust before conversion — the visitor's first doubt is "is this real?"; answer
   it before asking for anything.
2. One clear next step everywhere: talk to us on WhatsApp.
3. Never publish a claim we can't stand behind (no fabricated stats, no stale
   address, no unconfirmed financing terms).
4. Plain over clever — the audience is degree-shopping, not design-shopping.

## Accessibility & Inclusion

WCAG AA is the working floor (amber tokens pre-tuned for contrast on the greige
ground). `prefers-reduced-motion` is honored site-wide and must stay so. Lighthouse
a11y baseline is 96 (aim 100); do not regress.
