---
name: skeure-seo-orchestrator
description: Run an evidence-led Skeure Education SEO workstream with Claude as the primary operator, OpenSEO as the shared live data layer, and Codex as an independent researcher, reviewer, or bounded implementer. Use for Skeure SEO sprints, audits, keyword research, content planning, migration work, analytics setup, regulatory fact checking, or website remediation that benefits from both models.
---

# Skeure SEO Orchestrator

Read `/home/user/workspaces/AIOS/skeure-edu-seo/SEO-MARKETING-MASTER-PLAN.md` and applicable `CLAUDE.md`/`AGENTS.md` files before acting.

## Route the work

1. Classify the request as research, decision, implementation, validation, or monitoring.
2. Identify the source of truth:
   - OpenSEO/GSC for live search performance and paid SEO data.
   - UGC-DEB and official university sources for programme facts.
   - `website-build` for production code and content.
   - `skeure-edu-seo` for evidence, strategy, briefs, and reports.
3. Keep Claude as the conversation owner and primary coordinator.
4. Use `$codex-bridge` for an independent pass when the task is material, ambiguous, high-risk, or includes code changes.
5. Require human approval for final legal/finance language, factual publication, external messages, ads, redirects, deployment, and destructive actions.

## Standard dual-model loop

### 1. Frame

Write a bounded task with:

- objective;
- inputs and files;
- verified facts;
- unknowns;
- allowed actions;
- acceptance tests.

### 2. Gather evidence

Use the relevant OpenSEO skill:

- `$seo-project-setup`
- `$competitive-landscape`
- `$competitor-analysis`
- `$keyword-research`
- `$keyword-clustering`
- `$link-prospecting`

If OpenSEO authentication is unavailable, record the limitation and continue only with sources that are actually available. Never invent volume, difficulty, ranking, backlink, or GSC values.

### 3. Delegate

Use Codex read-only for:

- adversarial review;
- technical or content audit;
- alternative keyword clustering;
- migration-map review;
- regulatory evidence challenge;
- analytics-plan review.

Use Codex write mode only for an approved, isolated implementation with explicit validation.

### 4. Reconcile

Claude compares the two outputs against primary evidence. Resolve disagreement by testing or sourcing, not by majority vote.

### 5. Implement and validate

Keep one model as the writer and the other as the reviewer. Re-run deterministic checks from Claude before acceptance.

### 6. Record

Save durable conclusions under `evidence/`, `audits/`, `content/`, `migration/`, `reports/`, or `decisions/`. Do not promote temporary `.bridge/runs/` logs automatically.

## SEO guardrails

- Publish only `verified` programme records.
- Verify awarding HEI, exact programme, mode, session, fee basis, and source date.
- Do not publish unsupported financing, ratings, testimonials, salaries, placements, or partner claims.
- Disclose commissions and recommendation methodology.
- Do not create programmatic page permutations until the evidence model and unique-value test pass.
- Optimize for attributable counselling, applications, and admissions rather than traffic alone.

Read `references/acceptance-gates.md` for release gates and model assignment.
