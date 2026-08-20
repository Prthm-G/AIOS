# Skeure Growth: shared agent rules

Applies to Claude and every delegated agent working in this directory.

## Purpose

Maintain an evidence-led growth system for `education.skeure.com` covering organic SEO, paid Meta,
and shared measurement. Strategy and evidence live here. Production website changes live in
`../website-v3`.

## Required context

- Read `CLAUDE.md` before anything domain-specific.
- Read `decisions/log.md` for what's already settled.
- Read the closest nested instructions before editing another project.
- Inspect `git status` before broad work; preserve existing uncommitted changes.

## Evidence rules

- Prefer current primary sources.
- Record source URL or file, retrieval date, exact claim, reviewer, and status.
- Label first-party data, third-party estimate, and inference **separately and visibly**. An
  estimate presented as first-party data is a fabrication.
- Never report a metric that was not actually queried. If a connector is unauthenticated, say so.
- Treat any dated record as stale once its review deadline passes.

## Verification discipline

- Independently inspect evidence or diffs. Don't trust a summary, including one from another agent.
- Rerun deterministic checks rather than citing a previous run.
- For material or high-risk output, run an adversarial pass: state what would have to be true for
  the conclusion to be wrong, then check it against a primary source.
- Live product facts (API availability, pricing, SaaS tiers) get verified against current sources
  before being recommended. Don't assert them from training data.

## File ownership

- `seo/audit-reports/`: dated findings and validation
- `seo/keywords/`: raw data, clusters, keyword-to-URL map
- `seo/content/`: strategy, briefs, drafts, review status
- `paid/`: campaign specs, creative, audiences
- `measurement/`: event spec, Pixel/CAPI design, attribution
- `reports/`: weekly and monthly outcomes
- `decisions/`: durable decisions and rationale, append-only

Do not run concurrent writers on overlapping files.

## Website changes

`../website-v3` is live production. Before changing it, read its `README.md`, and run at minimum:

```bash
cd ../website-v3 && npm run build && npx tsc --noEmit
```

Add crawl, schema, link, responsive, accessibility, form, and performance checks according to risk.
`website-v4` was deleted 2026-08-20, so `website-v3` is the only build. Never deploy it without
explicit approval.

## Prohibited without explicit approval

- Deployment, DNS, live redirects, GSC Change of Address
- Campaign launch, budget change, or any ad spend
- Pixel, dataset, or CAPI changes
- External messages, outreach, review requests, or purchases
- Destructive git or filesystem operations
- Secrets or student PII in prompts, logs, analytics, or repository files
- Permission-bypass or full-access sandbox modes for any delegated agent
