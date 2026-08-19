---
name: onboard
description: Use at the start of a session in the AIOS vault to load current operating state before doing anything else. Triggers on "onboard", "catch me up", "where are we", "what's the state", "brief me", or the first substantive request of a fresh session. Reads the vault and the live project directories, then produces a one-screen operating brief. Read-only — it writes nothing.
---

## What this skill does

Loads Pratham's real, current operating state into the session and hands back one screen:
where things stand, what needs a decision, what has gone stale, and the single next action.

It is **not** an interview and **not** a scaffolder. Everything it reports is derived at
runtime from files and git. Nothing about the current quarter, deadlines, or project status
is hardcoded here — that is what keeps this skill from going stale between runs.

## Who this is for

Fixed facts, safe to assume:

- **Pratham Goel** — operator. Direct, concise, bullets, no em dashes, no status padding.
- **Skeure Education** — education consulting, Patiala, Punjab. LPU / Amity / other national
  university partners; online UG and PG admissions. Leads arrive on WhatsApp.
- **An NBFC** in India — separate business, real financial data, lives under
  `projects/skeure-finance/` (gitignored from this repo on purpose).
- **MBA at LPU** to 2027, plus a parallel automation / technical-PM job search.

Everything else — goals, deadlines, what's shipped, what's blocked — comes from the read
order below. Do not assert it from memory.

## Read order

Cheapest first. Stop early if the request is narrow (see "Scope the read" at the end).

**1. The operating layer** — who, what, this quarter

- `CLAUDE.md` — operator, business, voice, connections summary
- `context/about-me.md`, `context/about-business.md`, `context/priorities.md`

**2. `decisions/log.md` — the last 3 entries only.** This is the highest-signal file in the
vault. Entries are dated and each ends with an **Owner** line, often naming an open
follow-up, a deferred build, or a decision due on a specific date. Those follow-ups are the
main input to the "needs a decision" section of the brief. Do not read the whole log.

**3. `connections.md`** — the 7-domain registry. Note which rows still say
`not yet connected`, and each row's `last checked` date.

**4. Live project state.** For each directory below, run `git status --short` and
`git log --oneline -3`. They are separate repos with their own branches — check each, don't
assume the AIOS root branch applies.

| Path | What it is |
|---|---|
| `projects/skeure-education/website-build` | Main marketing site. Has its own `AGENTS.md` — the single source of truth for frontend design routing. `CLAUDE.md` there is a symlink to it. |
| `projects/skeure-education/website-v2` | Rebuild. Astro + vanilla CSS. |
| `projects/skeure-education/website-v3` | Newer rebuild. Does **not** inherit `website-build`'s `AGENTS.md`. |
| `projects/skeure-education/auretris` | Auretris project notes + its own `decisions/log.md`. |
| `projects/skeure-education/ad-manager` | Ad management. |
| `projects/skeure-education/skeure-edu-seo` | SEO work. |
| `projects/skeure-finance/finance-v2` | NBFC. Real financial data — never quote figures outward, never commit it here. |
| `projects/manus` | Multi-tenant WhatsApp platform. Its own git repo, gitignored from AIOS. |
| `/home/user/automation_stack` | **Production.** Auretris (WhatsApp bot, Meta Cloud API) in `wacrm/`, plus brochures, Postgres FAQ DB, n8n, `auretris-site`. Holds live Meta system-user tokens. |

**5. Conditional reads** — only when the request touches them:

- `/home/user/job-search/SESSION-HANDOFF.md`, the "Pick up here" section — job search
- `wiki/index.md` then `wiki/schema.md` — any wiki ingest, query, or lint
- `references/voice.md` — anything being drafted in his voice

## Staleness check

Flag these. Do not fix them, do not offer to fix them inline — they go in the brief.

- **Passed dates.** Compare every date in `context/priorities.md` and in the last 3 decision
  entries against today. A priority whose deadline has passed is the single most useful
  thing to surface.
- **Cold connections.** Any `connections.md` row with `last checked` more than 30 days old,
  or still `not yet connected`.
- **Uncommitted work.** Any project dir with a dirty tree or untracked directories —
  finished work sitting undeployed is a recurring pattern here.
- **Deferred builds.** A decision entry that says a build was "deferred to a fresh session"
  and no later entry picks it up.

## The brief

One screen. This shape, in this order. Skip a section if it is genuinely empty — never pad it.

```
Where things stand
- [3 lines max. Current quarter goal + the two most active projects, with their real state.]

Needs a decision from you
- [Open follow-ups from the last 3 decision entries, each with why it's waiting.]

Stale / at risk
- [Passed deadlines, cold connections, uncommitted work.]

Next
[One action. One sentence of why, tied to a stated priority.]
```

His register: short sentences, bullets, no em dashes, no preamble, no "I've analyzed your
vault and here's what I found."

## Rules

- **Read-only.** No writes, no scaffolding, no `archives/` backups, no touching
  `aios-intake.md`. If something needs writing, say so and wait to be asked.
- **Never invent state.** If a file or directory in the map is missing, say
  "`<path>` not found" in the brief. A missing project dir is information, not something to
  skip silently.
- **Cite the source** for anything non-obvious — "per the 2026-08-13 decision entry", not
  "I believe".
- **Never quote NBFC figures or any secret** from `projects/skeure-finance/`,
  `automation_stack/*.env`, or `manus/secrets/`.
- **Log decisions.** When he makes a call during the session, offer to append it to the
  relevant `decisions/log.md` — the vault root for business/config decisions, the project's
  own log for project-scoped ones.
- **Default Shift.** When a new manual task comes up, ask to what extent AI could be
  leveraged on it before assuming the old way.
- **Scope the read.** If the request is clearly narrow ("fix this CSS in website-v3"), read
  steps 1-2 and only that project, then say so: "Read the vault + website-v3 only." Full map
  is for a cold start.

## Verification

Cold-test after any edit to this skill:

1. Run `/onboard` in the vault. It should name the current admissions goal and its deadline,
   surface at least one open follow-up from the last 3 decision entries, flag every dirty or
   untracked project dir, and flag any priority whose date has passed.
2. `git status --short` in the vault is identical before and after. Any diff is a bug — this
   skill writes nothing.
3. Run it in a directory with no vault. Expected: it reports what's missing and stops. It
   must not fall back to interviewing or scaffolding.
4. Temporarily rename one mapped project dir and re-run. Expected: "not found" in the brief,
   not a silent skip.
