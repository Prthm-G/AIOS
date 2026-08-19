# Skeure Education — SEO & Marketing Operating System

Evidence-led SEO and marketing workspace for Skeure Education. Strategy, evidence, and operating history live here. Production website code lives in `/home/user/workspaces/AIOS/website-build`.

**Business objective:** 100 admissions by 30 September 2026, optimizing for verified admissions, not vanity traffic.

## Owner

Pratham Goel (all durable decisions, factual/legal sign-off, and financing-claim approval route through him — see `decisions/log.md`).

## Current phase

**Risk containment is live; measurement and trust setup remain incomplete.** A
28 July 2026 live check found the remediation and later website polish on
`education.skeure.com`, including the DBU page and photo-credits route. The SEO
records still contain older, contradictory deployment notes, so current-state
reconciliation is Phase 0 of `SKEURE-REBRAND-SEO-META-MASTER-PLAN.md`.
OpenSEO remains unauthenticated and GSC access has not been proven.

## Read first

1. `SEO-MARKETING-MASTER-PLAN.md` — strategy, launch gates, roadmap, hard guardrails
2. `SKEURE-REBRAND-SEO-META-MASTER-PLAN.md` — cross-system rebrand, Auretris, social, SEO, and Meta ads sequence
3. `GPT-5.6-SKEURE-EXECUTION-PROMPT.md` — reusable GPT-5.6 execution brief and approval gates
4. `AGENTS.md` — shared operating rules for Claude and delegated agents
5. `CLAUDE.md` — Claude-specific session-start checklist and workflow
6. `/home/user/workspaces/AIOS/website-build/AGENTS.md` before changing the website

## Start each session

Confirm `openseo` authentication before relying on its data. If OpenSEO reports authentication needed, do not claim its data is available — use local/official sources or ask Pratham to authenticate.

See `CLAUDE.md` for the full workflow.

## Navigation

| Area | File | What it holds |
|---|---|---|
| Strategy | `SEO-MARKETING-MASTER-PLAN.md` | Full audit, roadmap, guardrails, positioning |
| Cross-system programme | `SKEURE-REBRAND-SEO-META-MASTER-PLAN.md` | DegreeCraft→Skeure rebrand, LPU Distance gate, social audit, SEO, attribution, and ads phases |
| GPT-5.6 execution brief | `GPT-5.6-SKEURE-EXECUTION-PROMPT.md` | Reusable phase-by-phase prompt with safety and approval gates |
| Operating rules | `AGENTS.md`, `CLAUDE.md` | Shared rules; Claude session workflow |
| Decisions | `decisions/log.md` | Append-only durable-decision record |
| Programme evidence | `evidence/programme-ledger.csv` | 81 programme records: 1 `verified`, 56 `stale`, 23 `unverified`, 1 `disputed` as of 28 July 2026 |
| Claims tracking | `evidence/claims-register.csv` | 14 high-risk claims, remediation status |
| Sources | `evidence/source-register.md` | What's been checked, what hasn't, and against what |
| Website audit | `audits/website-remediation-report.md` | 2026-07-24 remediation pass: full findings and changes |
| P0/P1 checklist | `audits/p0-p1-checklist.md` | Item-by-item status against the master plan's launch gate |
| Measurement | `analytics/measurement-plan.md`, `analytics/event-dictionary.csv` | Event layer design; what's wired vs. blocked |
| Migration | `migration/degreecraft-url-inventory.csv`, `migration/redirect-map.csv`, `migration/deployment-migration-checklist.md` | DegreeCraft → Skeure migration prep (not activated) |
| Keywords | `keywords/keyword-to-url-map.csv` | Primary-intent-to-URL map (metrics pending OpenSEO auth) |
| Content | `content/strategy.md` | Evidence-backed content plan and what's blocked |
| Reports | `reports/weekly/weekly-template.md`, `reports/monthly/monthly-template.md` | Operating cadence templates |
| Skill routing | `bridge/SKILL-ROUTER.md` | Deterministic project-skill selection |

## Known open items (see `decisions/log.md` for full detail)

- **Documentation drift:** the live site contains remediation and later polish,
  while several 24–25 July status notes still say those changes are undeployed.
  Reconcile them against live state and current Git without erasing dated history.
- **OpenSEO MCP:** not authenticated. Deferred by Pratham's choice as of 2026-07-25 — no GSC/keyword-research/competitive-landscape work has run yet.
- **Google Search Console:** not connected for any property. Never claim otherwise.
- **DegreeCraft migration:** inventoried and mapped, not activated. Current map:
  4 `ready`, 14 `hold-pending-verification`, 4 `rebuild-required`, and 2
  `not-applicable` rows.
- **Social identity:** the legacy DegreeCraft Instagram URL remains stored in
  website source but is intentionally absent from visible UI and JSON-LD until
  the Meta asset audit and rebrand are approved.
