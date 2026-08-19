# Skeure Growth · Claude operating manual

One workspace for organic SEO, paid Meta, and the measurement layer they share. Created 2026-08-19,
replacing `skeure-edu-seo` (deleted) and absorbing `ad-manager` (archived at
`archives/ad-manager-2026-08-19/`).

**Objective: 100 admissions by 30 September 2026.** Measured as verified admissions. Traffic,
impressions, and lead counts are diagnostics, not the goal.

## Start each session

1. Read `decisions/log.md`, the last few entries. State changes; memory of a past session doesn't.
2. Check the connectors actually answer before quoting any number from them:
   ```bash
   claude mcp list          # expect meta-ads and meta-devtools connected
   meta auth status         # Ads CLI
   ```
   If a connector needs auth, **say so** and work from local or official sources. Never present a
   remembered figure as a live one. This is the specific failure that made the previous workspace
   untrustworthy. It documented `openseo` data it had never actually been able to query.
3. If anything below reads as stale, verify it live before acting on it.

## Current state

| | |
|---|---|
| Live site | `education.skeure.com`, served by `../website-v3` (Next.js 15 → OpenNext → Cloudflare Workers) |
| Not live | `../website-v4` is built but **not cut over**. Same `wrangler.jsonc` route, so deploying it replaces production. |
| Analytics | **Nothing in production.** `../website-v3/src/lib/analytics.ts` is a no-op shim: 15 typed events, correct PII discipline, no provider ever loaded. |
| Meta Pixel | Absent from the site entirely. |
| CAPI | Not built. Leads land in Cloudflare D1 (`skeure-leads`) via `../website-v3/src/app/api/contact/route.ts`. |
| WhatsApp | Primary CTA, and currently attribution-invisible. |
| GSC | A verification file exists at `../website-v3/public/google7b2ddd72feef8f7d.html`, so a property was verified at some point. **Whether it returns data is unconfirmed.** Settle this before planning any keyword work. |
| Ad account | See `.env` / `SETUP-META-CONNECTORS.md`. The July-2026 record `act_1056790306735632` is **unverified**. Confirm live via `meta ads adaccount list`. |

## Two Meta identities · do not cross them

The ad account and the Auretris developer app live under **different Meta IDs**.

- `meta-ads` MCP → authenticate as the identity that **owns the ad account**.
- `meta-devtools` MCP → authenticate as the **Auretris developer** identity.

The consent screen picks up whichever session the browser is holding. Check before authorizing.
This is the most likely setup failure, and it fails quietly. You get a connected server that simply
cannot see the assets you expect.

The Auretris production app (`META_APP_ID` in `/home/user/automation_stack/.env`) runs live WhatsApp
Cloud API. It is **not** the app backing the ads connector, and its scopes are not to be widened.

## Tooling

| Need | Use |
|---|---|
| Ads reporting, insights, account/campaign structure, signal health | `meta-ads` MCP (`https://mcp.facebook.com/ads`) |
| Scripted or repeated pulls, cron, anything non-interactive | `meta` Ads CLI. `meta ads insights get --fields ...`; `--format json` pipes to `jq` |
| Meta app, webhooks, App Review, compliance | `meta-devtools` MCP. Tools: `devtools_app`, `devtools_app_list`, `devtools_app_review`, `devtools_compliance`, `devtools_discovery` |
| Technical SEO audit, on-page, schema, CWV | ECC `seo` skill + `ecc:seo-specialist` agent |
| Lighthouse / CWV measurement | chrome-devtools MCP (`lighthouse_audit`, `performance_start_trace`) |
| Anything touching production code, the lead DB, or PII | ECC `dev-team` four-lens review **first** |

Do not load every installed skill. Use the smallest relevant set.

## Source and claim rules

- UGC-DEB and official HEI sources own programme entitlement facts.
- Official university sources own fees, eligibility, exams, intakes, and refunds.
- The Meta connectors own only the metrics they actually return.
- GSC owns first-party Google performance data, after connection is proven rather than assumed.
- Never invent traffic, rankings, keyword volume, backlinks, ratings, testimonials, placements,
  salaries, partner status, or financing terms.
- Label fact, third-party estimate, and inference separately. An estimate presented as first-party
  data is the same failure as a fabrication.
- Record source URL or file, retrieval date, exact claim, and reviewer for anything that will be
  published.

## Publication guardrails

Carried forward from the previous workspace because they encode real legal exposure:

- Never describe Skeure's guidance as "independent" or "unbiased". Always disclose that Skeure
  earns commission from university and financing partners post-enrolment.
- Recognition claims must be precise: "UGC-entitled/recognised for [programme], [mode], [session]".
  Never a blanket claim.
- No financing claim without a named, approved lender and an APR.
- No unverified rating, testimonial, placement, or salary claim ships. Ever.
- LPU Distance is excluded from ad eligibility until separately cleared.

## Action boundaries

Claude may create and edit files here, run read-only queries against the connectors, and run tests.

**Requires Pratham's explicit, itemized approval:**

- publishing high-risk factual content, or any final legal/financing language
- production deployment, DNS, redirect activation, or GSC Change of Address
- any campaign launch, budget change, or spend, itemized by campaign, budget, and account
- Pixel, dataset, or CAPI changes
- outreach, messages, or social posts
- destructive filesystem or git operations

Campaigns are drafted **paused**. Naming: `Skeure | Punjab | Qualified Leads | Test 01`.

## Secrets

Env-var **names** only, in any file, log, prompt, or commit. Never a literal value. `.env` is
gitignored; `.env.example` carries names alone. This machine holds live Meta system-user tokens and
real NBFC data, so the discipline is not optional.

## Completion standard

Lead with the outcome. Then: files changed; skills and checks used; evidence; unresolved risks;
connector limitations that shaped the answer; and the next decision that needs a human.

For material or high-risk work, run an adversarial pass over your own output before reporting: state
what would have to be true for the conclusion to be wrong, then check that against primary sources
or a rerun. Internal consistency is not proof.
