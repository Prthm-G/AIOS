# Skeure Education website-v3 — Interior Pages Handoff

**Status:** Homepage is DONE and signed off (pinned scroll hero + all sections, content
loader fixed, deployed to preview). Everything else below is still to build.

**Live preview (homepage):** https://skeure-education-web-preview.241-pratham.workers.dev
**Production (DO NOT TOUCH):** https://education.skeure.com (separate Cloudflare Pages service)

---

## 1. Universities (content already ported → `src/content/universities/*.md`)

11 entries. Public listing = 10 (Online Manipal is `noindex` — hidden from listings, but its
detail page stays reachable). ⭐ = `featured: true` (shown in the homepage Featured grid).

| # | Name | slug | featured |
|---|------|------|----------|
| 1 | Amity University Online | `amity-university-online` | ⭐ |
| 2 | Chandigarh University Online | `chandigarh-university-online` | ⭐ |
| 3 | Desh Bhagat University | `desh-bhagat-university` | — |
| 4 | GLA University Online | `gla-university-online` | — |
| 5 | Guru Kashi University | `guru-kashi-university` | — |
| 6 | Jagat Guru Nanak Dev Punjab State Open University (PSOU) | `jagat-guru-nanak-dev-psou` | ⭐ |
| 7 | Lovely Professional University (LPU) | `lovely-professional-university` | ⭐ |
| 8 | Mangalayatan University Online | `mangalayatan-university-online` | — |
| 9 | Maharishi Markandeshwar (MMU) University Online | `mmu-university-online` | — |
| 10 | Online Manipal (multi-entity, unresolved) | `online-manipal-university` | — · **NOINDEX** |
| 11 | Punjabi University Distance Education | `punjabi-university-online-distance` | ⭐ |

**Per-university fields (for detail pages):** `name, city, state, establishedYear, officialSite,
featured, evidenceStatus, accreditations, history, achievements, learningPlatform, placements, faq,
courses`. Access via `getUniversities()` (excludes noindex) / `getUniversity(slug)` (includes noindex)
from `@/lib/content`.

**Other content:** 5 FAQs (`getFaqs()`), 1 blog post `choosing-the-right-online-degree` (`getBlogPosts()`).

---

## 2. Pages to build (homepage `/` is done — everything here is NOT built yet)

v3 currently has only `src/app/page.tsx` (homepage) + `src/app/api/contact/route.ts` (form handler).
Match the live Astro site's structure (`../website-build/src/pages/`). Build these, all with
`trailingSlash: true`:

**Primary (in the nav):**
- `/universities/` — index: the colored logo marquee is already a component; page lists all 10 public unis as cards (reuse `UniversityCard`, `FeaturedUniversities` patterns). Astro ref: `universities/index.astro`.
- `/universities/[slug]/` — detail page per uni (dynamic, `generateStaticParams` over all 11 incl. noindex; add `robots noindex` meta for the Online Manipal one). Astro ref: `universities/[slug].astro`.
- `/programs/` — programs overview. Astro ref: `programs/index.astro`.
- `/financing/` — number-free, all CTAs → WhatsApp (Skeure is NOT a lender; no rates/lenders published). Astro ref: `financing.astro`.
- `/about/` — Astro ref: `about.astro`.
- `/blog/` — index (1 post). Astro ref: `blog/index.astro`.
- `/blog/[slug]/` — post detail (needs markdown rendering: add `react-markdown` + `remark-gfm`). Astro ref: `blog/[slug].astro`.
- `/faq/` — full FAQ (5 Q&As, accordion — reuse `Accordion`). Astro ref: `faq.astro`.
- `/contact/` — page with the contact form (the API route already exists at `api/contact/route.ts`; wire the form + Turnstile). Astro ref: `contact.astro`.

**Legal / utility:**
- `/privacy-policy/` (`privacy-policy.astro`), `/terms/` (`terms.astro`), `/credits/` (`credits.astro`)
- `not-found.tsx` (404) — Astro ref: `404.astro`

---

## 3. COPY-PASTE PROMPT (paste into a fresh session opened in `website-v3/`)

> Build out ALL the remaining pages of the Skeure Education website-v3 to the same quality and design
> system as the finished homepage. Read `HANDOFF-INTERIOR-PAGES.md` in this directory first — it lists
> every page to build, the university content, and the reusable components.
>
> **Project:** Next.js 15 (App Router, `src/`) + Tailwind v4 + OpenNext → Cloudflare Workers, at
> `/home/user/workspaces/AIOS/projects/skeure-education/website-v3`, branch `overhaul/visual-v3`. The
> homepage (`src/app/page.tsx`) is DONE and is the design reference — study its sections and match the
> register: warm off-white field (`--bg #F2F1ED`), near-black ink (`--ink #1A1A1A`), single warm accent
> (`--accent #FF611A`, brand amber `#E8A33D` for logo/gradients only), Manrope display + Inter body +
> Fragment Mono eyebrows, black pill buttons with an `accent` (orange) variant, big lowercase headings
> with `-0.03em` tracking, generous spacing, hairline borders, soft warm shadows, iridescent auras used
> sparingly, `data-reveal` scroll-reveal, and full reduced-motion support.
>
> **Reuse — do NOT rebuild:** components in `src/components/{ui,chrome,sections}` — `Button` (variants:
> primary/accent/secondary/ghost/link), `WhatsAppButton`, `Accordion`, `Badge`, `Card`, `SectionHeading`,
> `Header`, `Footer`, `WhatsAppFloat`, `Wordmark`, `UniversityCard`, `FeaturedUniversities`, `PartnerStrip`
> (colored moving marquee), `HowItWorks`, `TrustCallouts`, `FinancingTeaser`, `FaqPreview`, `CtaBand`.
> Content getters in `@/lib/content`: `getUniversities()` (excludes noindex), `getUniversity(slug)`,
> `getFaqs()`, `getBlogPosts()`, `getBlogPost(slug)`. Data in `src/data/{site,logos,campus-images,
> universityOrder}.ts`. JSON-LD helpers in `@/lib/jsonld`.
>
> **Pages to build (see the handoff for the full list + Astro references in `../website-build/src/pages/`):**
> `/universities/` (index), `/universities/[slug]/` (dynamic, `generateStaticParams` over all 11 incl.
> the noindex one with a `robots noindex` on that page only), `/programs/`, `/financing/`, `/about/`,
> `/blog/` + `/blog/[slug]/` (add `react-markdown`+`remark-gfm` for post bodies), `/faq/`, `/contact/`
> (form + Turnstile; API route already at `src/app/api/contact/route.ts`), `/privacy-policy/`, `/terms/`,
> `/credits/`, and `not-found.tsx` (404). Every route `trailingSlash: true`.
>
> **Content = the live Astro site, read-only, facts verbatim.** Pull copy/facts from
> `../website-build/src/pages/*.astro` and `../website-build/src/content/*`. GUARDRAILS: names,
> accreditations, financing wording, FAQ answers, and contact details verbatim; **country-level location
> only (never a Patiala street address)**; NO invented stats, prices, ratings, or testimonials
> (testimonials collection is empty → omit); Skeure is not a lender (no rates/lenders on /financing);
> preserve all SEO invariants (per-page `metadata` with title/description/canonical, `metadataBase`
> `https://education.skeure.com`, JSON-LD where the Astro page has it, `images.unoptimized` with explicit
> width/height so CLS stays 0).
>
> **Content loader:** the markdown is bundled to `src/content/_generated.json` by `scripts/gen-content.mjs`
> (runs via `predev`/`prebuild`/`cf-build`). If you add/edit content, run `node scripts/gen-content.mjs`.
> Do NOT read the filesystem at runtime — it returns empty in the Worker.
>
> **Dev server:** `npx next dev -p 3007`. GOTCHA: after many hot-reloads this dev server sometimes 404s
> its own chunks (`main-app.js`), so client components stop hydrating (effects never run). If that
> happens: `pkill -f "next dev -p 3007"; rm -rf .next; npx next dev -p 3007`.
>
> **Verify** each page with chrome-devtools MCP screenshots at 1440 + 390 (≥2 compare-correct rounds),
> keep `next build` green, check reduced-motion + keyboard focus + empty/loading/error states.
>
> **Deploy = PREVIEW ONLY, and only when asked.** NEVER run `npm run deploy` (it targets the PROD worker,
> no `--env`). Use: `node scripts/gen-content.mjs && npx opennextjs-cloudflare build`, then source
> `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (never echo them) from
> `/home/user/workspaces/AIOS/projects/manus/apps/gateway/.dev.vars.hyperdrive`, then
> `npx wrangler deploy --env preview` → `skeure-education-web-preview.241-pratham.workers.dev`. Production
> `education.skeure.com` stays untouched — gated on explicit go.
>
> Work page-by-page; show me each page as you finish it. Start with `/universities/` (index) and
> `/universities/[slug]/`.

---

## 4. Session handoff (state as of homepage sign-off)

- **Stack:** Next.js 15.5 App Router + React 19 + Tailwind v4 + `@opennextjs/cloudflare` → Workers.
  Dir `website-v3`, branch `overhaul/visual-v3` (not committed; working tree).
- **Homepage build lives in the plan log:** `/home/user/.claude/plans/i-want-to-complete-spicy-parrot.md`
  (PROGRESS LOG v1→v11 — read for the full history, palette hex, and every gotcha).
- **Hero (the crown jewel):** `src/components/hero/HeroScroll.tsx` — pinned 500vh scroll track, image
  sequence painted to `<canvas>` (frames `public/render/frames/desktop/f-001..061.webp`), heading
  locked to the screen glass + scroll-driven typewriter, closed→open→type→reveal→close. `HeroStage.tsx`
  is now UNUSED (can delete). `src/components/sections/Hero.tsx` is a thin server wrapper with the sr-only
  `<h1>`. Why a canvas image-sequence and not `<video>`: Workers serve assets without HTTP range, so
  video seeking is dead there.
- **Content fix (important):** `src/lib/content.ts` now imports `src/content/_generated.json` (bundled by
  `scripts/gen-content.mjs`) instead of reading `fs` — runtime `fs` returns empty in the Worker.
- **Design tokens:** `src/app/globals.css` `@theme` (palette above) + utilities (`.aura`, `.frost`,
  `.marquee`, scroll-reveal). Fonts in `src/app/layout.tsx`.
- **Deploy creds (never echo):** `/home/user/workspaces/AIOS/projects/manus/apps/gateway/.dev.vars.hyperdrive`
  (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`). Preview worker name `skeure-education-web-preview`
  (in `wrangler.jsonc` under `env.preview`); top-level `skeure-education-web` is PROD — never deploy there.
- **Known deferrals:** mobile hero uses the shared desktop frame sequence (open/typing reads well; the
  closed-start is the weak state — a portrait/padded mobile frame set is the refinement). The `/contact`
  form + Turnstile is unbuilt; the API route degrades to `{ persisted: false }` on preview (DB unbound).
- **Verify a deploy:** curl the workers.dev URL for 200 + check `/logos/*` present in HTML; screenshot
  the hero via chrome-devtools MCP.
