# Skeure Growth

Organic SEO, paid Meta, and the measurement layer they share. One workspace, one funnel, one set of
numbers.

**Objective: 100 admissions by 30 September 2026.** Verified admissions, not traffic.

Created 2026-08-19. Replaces `skeure-edu-seo` (deleted) and absorbs `ad-manager` (archived at
`archives/ad-manager-2026-08-19/`). See `decisions/log.md` for why, and for what was lost.

## Read first

1. `CLAUDE.md` for the operating manual, guardrails, current state, session-start checklist
2. `SETUP-META-CONNECTORS.md` for the Meta wiring runbook and what's still unwired
3. `AGENTS.md` for the rules delegated agents follow

## Layout

| Path | What it holds |
|---|---|
| `seo/audit-reports/` | Dated technical and content audits, findings ranked P0/P1/P2 with evidence |
| `seo/keywords/` | Keyword research, clusters, keyword-to-URL map |
| `seo/content/` | Content strategy, briefs, drafts, review status |
| `paid/campaigns/` | Draft campaign specs. Always `PAUSED` |
| `paid/creative/` | Ad copy, creative briefs, generated assets |
| `paid/audiences/` | Audience definitions and exclusions |
| `measurement/` | Event spec, Pixel/CAPI design, attribution model, funnel definition |
| `reports/weekly/`, `reports/monthly/` | Operating cadence |
| `decisions/log.md` | Append-only durable decisions |

> `seo/audit-reports/` is named that way deliberately. The AIOS root `.gitignore` used to carry a
> bare `audits/` rule that silently swallowed the previous workspace's audit directory. Three
> reports were lost to it. The rule is now rooted (`/audits/`), but the name stays defensive.

## The state of things

Production measures **nothing**. `../website-v3/src/lib/analytics.ts` defines 15 typed events with
correct PII discipline and no provider is loaded anywhere on the site. There is no Meta Pixel. The
primary CTA is WhatsApp, which is currently attribution-invisible.

So the ordering is not negotiable: **measurement first**, then keyword and content work against real
first-party data, then paid. Anything else optimizes numbers nobody can see.

## Related

| Path | What |
|---|---|
| `../website-v3` | **Live.** Serves `education.skeure.com`. |
| `../website-v4` | Built, not cut over. Shares v3's route, so deploying it replaces production. |
| `../auretris` | Auretris project notes. Owns the WhatsApp conversation the funnel ends in. |
| `/home/user/automation_stack` | **Production.** Auretris WhatsApp bot + Kuanli CRM. Holds live Meta system-user tokens. |
| `archives/ad-manager-2026-08-19/` | The retired ads workspace. Read-only reference; don't run its scripts. |
