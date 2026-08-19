---
name: skeure-seo-orchestrator
description: Run an evidence-led Skeure Education SEO workstream with Claude as the primary operator and OpenSEO as the live data layer. Use for Skeure SEO sprints, audits, keyword research, content planning, migration work, analytics setup, regulatory fact checking, or website remediation.
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
4. Run an explicit adversarial pass over the draft when the task is material, ambiguous, high-risk, or includes code changes.
5. Require human approval for final legal/finance language, factual publication, external messages, ads, redirects, deployment, and destructive actions.

## Standard loop

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

### 3. Challenge

Run a separate read-only adversarial pass over the draft for:

- technical or content audit;
- alternative keyword clustering;
- migration-map review;
- regulatory evidence challenge;
- analytics-plan review.

State what would have to be true for the draft to be wrong, then check it.

### 4. Reconcile

Compare the challenge findings against primary evidence. Resolve disagreement by testing or sourcing, not by picking the more confident answer.

### 5. Implement and validate

Re-run deterministic checks before acceptance. Never accept the draft on the strength of the review alone.

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
