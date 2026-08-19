# Skeure Education SEO — shared agent rules

These instructions apply to Claude and delegated agents working in this directory.

## Purpose

Maintain an evidence-led SEO and marketing operating system for `education.skeure.com`. Store strategy and evidence here. Store production website changes in `/home/user/workspaces/AIOS/website-build`.

## Required context

- Read `SEO-MARKETING-MASTER-PLAN.md` for strategy and launch gates.
- Read the closest nested instructions before editing another repository.
- Preserve existing user changes and inspect Git status before broad work.

## Model roles

- Claude is the conversation owner, operator, and final coordinator.
- Material code, claims, migration, or measurement changes require an explicit
  adversarial pass over the drafted output before it is reported as done.
- Do not run concurrent writers on overlapping files.

## Skill locations

- Shared project skills: `.agents/skills/`
- Claude links: `.claude/skills/`
- OpenSEO data: MCP server named `openseo`
- Deterministic skill selection: `bridge/SKILL-ROUTER.md`

Use a relevant skill when named or directly applicable. Do not substitute a similarly named global skill when the project skill is more specific.
The machine-wide skill catalog is intentionally not the routing source: it is too large
for reliable automatic inclusion. Name the project skill files explicitly.

## Evidence rules

- Prefer current primary sources.
- Record source URL/file, retrieval or verification date, exact claim, reviewer, and status.
- Label facts, GSC data, OpenSEO estimates, third-party data, and inference separately.
- Never publish an unverified education, financial, legal, rating, testimonial, placement, salary, or partner claim.
- Never report an SEO metric that was not actually queried.

## File ownership

- `evidence/`: claim and programme source of truth.
- `audits/`: dated findings and validation.
- `keywords/`: raw data, clusters, and keyword-to-URL map.
- `content/`: strategy, briefs, drafts, and review status.
- `migration/`: old URL inventory, redirect map, and validation.
- `analytics/`: measurement plan, events, and dashboard definitions.
- `reports/`: weekly/monthly outcomes.
- `decisions/`: durable decisions and rationale.
- `.bridge/runs/`: historical model handoff logs from the retired bridge; ignored by Git.

## Validation

For this workspace:

Confirm the project skills still resolve and that `openseo` authentication is
current before relying on its data. The former `bin/bridge-doctor` and the
`quick_validate.py` script it called both lived on the retired Codex install and
are gone.

For website changes, follow `/home/user/workspaces/AIOS/website-build/AGENTS.md` and run at minimum:

```bash
npm run build
npx astro check
```

Add crawl, schema, link, responsive, accessibility, form, and performance checks according to risk.

## Prohibited without explicit approval

- Deployment, DNS, live redirects, GSC Change of Address
- External messages, outreach, review requests, ad spend, or purchases
- Destructive Git/filesystem operations
- Secrets or student PII in prompts, logs, analytics, or repository files
- Permission bypass or full-access sandbox modes for any delegated agent
