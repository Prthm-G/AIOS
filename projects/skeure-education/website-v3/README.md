# Skeure Education — website-v3

The Skeure Education marketing site. Next.js 15 (App Router) → OpenNext → Cloudflare Workers,
serving [education.skeure.com](https://education.skeure.com).

Supersedes `../website-build` (Astro on Cloudflare Pages), which remains in place as the rollback
target and the original data source. `../WEBSITE-V3-KICKOFF.md` and `HANDOFF-INTERIOR-PAGES.md` are
historical — both predate the move to Next.js and describe an Astro build that was never shipped.

## Stack

| | |
|---|---|
| Framework | Next.js 15.5 App Router, React 19, `src/` layout |
| Styling | Tailwind v4 (`@theme` tokens in `src/app/globals.css`) |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` |
| Content | Markdown → build-time JSON (no runtime `fs`; see below) |
| Leads | Cloudflare D1 (`skeure-leads`), written by `src/app/api/contact/route.ts` |
| Bot defense | Cloudflare Turnstile, verified server-side, fails closed |
| Motion | `lenis` smooth scroll + a `data-reveal` IntersectionObserver system |

## Develop

```bash
npm install
npm run dev          # http://localhost:3000 (predev regenerates content JSON)
```

`next dev` occasionally 404s its own chunks after many hot reloads, which stops client components
hydrating. Recover with:

```bash
rm -rf .next && npm run dev
```

## Content

Markdown lives in `src/content/{universities,faqs,blog}`. It is **bundled at build time** into
`src/content/_generated.json` by `scripts/gen-content.mjs`, which runs automatically via `predev`,
`prebuild` and the `cf-*` scripts.

Do not read the filesystem at runtime — `fs` returns empty under workerd, which is why the
generated-JSON step exists at all. Read content through `@/lib/content`:
`getUniversities()` (excludes `noindex` profiles), `getUniversity(slug)`, `getFaqs()`,
`getBlogPosts()`, `getBlogPost(slug)`.

After editing any markdown: `npm run gen:content`.

## Hard invariants

These are load-bearing. Breaking one is an SEO or compliance regression, not a style change.

- **Trailing slashes everywhere.** `next.config.ts` sets `trailingSlash: true` to match the canonical
  policy inherited from the Astro site. Every internal link and sitemap entry carries one.
- **The sitemap must match the indexed surface.** `src/app/sitemap.ts` emits exactly 20 URLs. It
  deliberately excludes `/privacy-policy/` and `/terms/`, which are `noindex`.
- **Redirects are permanent.** `public/_redirects` holds 301s for universities removed from the
  partner list. Never drop a line from it — those URLs were indexed.
- **Location is country-level only.** No street address, city or region anywhere public-facing.
  See `src/data/site.ts`.
- **Skeure is not a lender.** No rates, lender names or loan terms on `/financing/`.
- **No invented facts.** No fabricated stats, prices, ratings or testimonials.
- **Lead PII never gets logged.** `src/app/api/contact/route.ts` logs only
  `{ interest, source, persisted }` — never name, email, phone or message.

## Deploy

Credentials are sourced from a file outside this repo and must never be echoed:

```bash
set -a; . ../../manus/apps/gateway/.dev.vars.hyperdrive; set +a
```

```bash
npm run deploy:preview   # -> skeure-education-web-preview.241-pratham.workers.dev
npm run deploy:prod      # -> skeure-education-web (production)
```

`deploy:preview` builds with Cloudflare's always-pass Turnstile **test** sitekey and deploys to an
environment with **no D1 binding**, so no preview submission can reach the production lead table.
The contact route degrades honestly to `{ persisted: false }` there rather than claiming a save.

There is deliberately no bare `npm run deploy` — it used to exist and targeted production with no
`--env`, which is a one-keystroke accident.

### Worker secrets

`TURNSTILE_SECRET` is a Worker secret, not a var, and is not in this repo:

```bash
npx wrangler secret put TURNSTILE_SECRET                 # production
npx wrangler secret put TURNSTILE_SECRET --env preview   # use the test secret here
```

Without it the contact route refuses every submission with a 500 — by design, since accepting
unverified form posts into a PII table is worse than an outage.

The Turnstile **sitekey** is public and lives as a build-time default in
`src/components/contact/ContactForm.tsx`. It cannot be a wrangler `var`: Next inlines `NEXT_PUBLIC_*`
at build time, so a runtime binding would look configured and silently do nothing.

## Verify a deploy

```bash
curl -sI https://education.skeure.com | head -1
curl -s https://education.skeure.com/sitemap.xml | grep -c '<loc>'   # expect 20
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' \
  https://education.skeure.com/universities/chitkara-university-online/   # expect 301
```

Then submit a real lead through `/contact/` and confirm it persisted:

```bash
npx wrangler d1 execute skeure-leads --remote \
  --command "SELECT id, created_at, interest, source FROM leads ORDER BY id DESC LIMIT 3"
```

Select metadata columns only. Do not select `name`, `email` or `phone` — confirm the write, not the
contents.
