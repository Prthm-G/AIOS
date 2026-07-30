# Skeure Education SEO — shared agent rules

These instructions apply to Claude, Codex, and delegated agents working in this directory.

## Purpose

Maintain an evidence-led SEO and marketing operating system for `education.skeure.com`. Store strategy and evidence here. Store production website changes in `/home/user/workspaces/AIOS/website-build`.

## Required context

- Read `SEO-MARKETING-MASTER-PLAN.md` for strategy and launch gates.
- Read `BRIDGE-SETUP-PLAN.md` for the Claude–Codex architecture.
- Read the closest nested instructions before editing another repository.
- Preserve existing user changes and inspect Git status before broad work.

## Model roles

- Claude is the default conversation owner and orchestrator.
- Codex is a peer researcher, reviewer, or bounded implementer.
- The writer cannot be the only reviewer for material code, claims, migration, or measurement changes.
- Do not recursively invoke the other model.
- Do not run concurrent writers on overlapping files.

## Skill locations

- Shared project skills: `.agents/skills/`
- Claude links: `.claude/skills/`
- OpenSEO data: MCP server named `openseo`
- Bridge entry point: `./bin/codex-bridge`
- Deterministic skill selection: `bridge/SKILL-ROUTER.md`

Use a relevant skill when named or directly applicable. Do not substitute a similarly named global skill when the project skill is more specific.
The global Codex skill catalog is intentionally not the routing source: it is too large
for reliable automatic inclusion. Bridge prompts explicitly name the project skill files.

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
- `.bridge/runs/`: temporary model handoffs; ignored by Git.

## Validation

For this workspace:

```bash
./bin/bridge-doctor
python3 /home/user/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/codex-bridge
python3 /home/user/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/skeure-seo-orchestrator
```

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
- Permission bypass or `danger-full-access` for the Codex bridge
