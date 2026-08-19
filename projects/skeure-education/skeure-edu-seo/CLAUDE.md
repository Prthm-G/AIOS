# Skeure Education SEO — Claude operating manual

Claude is the primary interactive CLI and sole operator for this workspace. Use OpenSEO as the live SEO data layer after authentication.

## Read first

1. `SEO-MARKETING-MASTER-PLAN.md`
2. `AGENTS.md`
3. The relevant evidence, audit, content, migration, or report files
4. `/home/user/workspaces/AIOS/website-build/AGENTS.md` before changing the website

## Start each session

Confirm OpenSEO authentication before relying on its data. If authentication is needed, do not pretend its data is available. Continue with local/official sources or ask the user to complete authentication.

## Shared skills

Project skills live once under `.agents/skills/` and are symlinked into `.claude/skills/`.
Use `bridge/SKILL-ROUTER.md` to choose the smallest relevant set.

Core skills:

- `/skeure-seo-orchestrator` for end-to-end SEO workstreams
- `/seo-project-setup`
- `/competitive-landscape`
- `/competitor-analysis`
- `/keyword-research`
- `/keyword-clustering`
- `/link-prospecting`
- `/deslop`

Do not load every installed global skill. Use the smallest relevant set.

## Workflow

1. Read context, define the objective, scope, risks, and acceptance tests.
2. Do the work in the smallest scope that satisfies the objective.
3. Independently inspect material evidence or diffs rather than trusting a summary.
4. Rerun critical deterministic checks.
5. Record durable decisions in the appropriate project file.

For material, ambiguous, or high-risk work, run an explicit adversarial pass over your own output before reporting: state what would have to be true for the conclusion to be wrong, then check it against primary sources, code inspection, or tests. Never treat internal consistency as proof.

## Source and claim rules

- UGC-DEB and official HEI sources own programme entitlement facts.
- Official university sources own fees, eligibility, exams, intakes, and refunds.
- OpenSEO owns only the metrics it actually returns.
- GSC owns first-party Google performance data after connection.
- Do not invent traffic, rankings, keyword volume, backlinks, ratings, testimonials, placements, salaries, partner status, or financing terms.
- Separate fact, third-party estimate, and inference.
- Treat all session-sensitive records as stale when their review deadline passes.

## Action boundaries

Claude may create and edit safe local project files and run tests within the requested scope.

Require explicit human approval before:

- publishing high-risk factual content;
- final legal or financing language;
- production deployment;
- DNS, redirect activation, or Change of Address;
- sending outreach or messages;
- paid advertising or purchases;
- destructive operations.

## Completion standard

Lead with the outcome. Report:

- files changed;
- skills and checks used;
- evidence;
- unresolved risks;
- OpenSEO/GSC limitations;
- the next human decision, if any.
