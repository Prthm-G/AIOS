# Skeure Education SEO — Claude operating manual

Claude is the primary interactive CLI and final coordinator for this workspace. Use Codex as a bounded peer through the shared `codex-bridge` skill. Use OpenSEO as the shared live SEO data layer after authentication.

## Read first

1. `SEO-MARKETING-MASTER-PLAN.md`
2. `BRIDGE-SETUP-PLAN.md`
3. `AGENTS.md`
4. The relevant evidence, audit, content, migration, or report files
5. `/home/user/workspaces/AIOS/website-build/AGENTS.md` before changing the website

## Start each session

Run:

```bash
./bin/bridge-doctor
```

If OpenSEO says authentication is needed, do not pretend its data is available. Continue with local/official sources or ask the user to complete authentication.

## Shared skills

Project skills live once under `.agents/skills/` and are symlinked into `.claude/skills/` so Claude and Codex use the same instructions.
Use `bridge/SKILL-ROUTER.md` to choose the smallest relevant set. The bridge names the
selected paths explicitly so project skill use remains reliable even when Codex omits the
very large machine-wide skill catalog.

Core skills:

- `/skeure-seo-orchestrator` for end-to-end SEO workstreams
- `/codex-bridge` for delegating to Codex
- `/seo-project-setup`
- `/competitive-landscape`
- `/competitor-analysis`
- `/keyword-research`
- `/keyword-clustering`
- `/link-prospecting`
- `/deslop`

Do not load every installed global skill. Use the smallest relevant set.

## Claude–Codex workflow

1. Claude reads context, defines the objective, scope, risks, and acceptance tests.
2. Claude chooses one Codex mode:
   - `ask` for analysis or a second opinion;
   - `review` for adversarial validation;
   - `implement` for an isolated approved change.
3. Claude invokes `./bin/codex-bridge`.
4. Claude reads the result and independently inspects material evidence or diffs.
5. Claude reruns critical deterministic checks.
6. Claude accepts, amends, or rejects Codex's contribution.
7. Claude records durable decisions in the appropriate project file.

Never use agreement between models as proof. Resolve disagreements using primary sources, code inspection, or tests.

## Delegation examples

Read-only peer review:

```bash
./bin/codex-bridge review \
  --cwd /home/user/workspaces/AIOS/skeure-edu-seo \
  "Review the migration map for incorrect many-to-one redirects."
```

Website implementation:

```bash
./bin/codex-bridge implement \
  --allow-write \
  --cwd /home/user/workspaces/AIOS/website-build \
  --add-dir /home/user/workspaces/AIOS/skeure-edu-seo \
  --prompt-file /home/user/workspaces/AIOS/skeure-edu-seo/bridge/prompts/implementation.md
```

For automatic invocations, make `./bin/codex-bridge` the first shell token so the
read-only command matches `.claude/settings.json`. For a long or dynamic prompt, write a
non-secret file under `.bridge/` and use `--prompt-file`; never interpolate untrusted text
into a shell command.

## Single-writer rule

Do not let Claude and Codex edit the same files simultaneously. During a Codex write run, Claude may inspect unrelated files but must wait before editing overlapping paths. The bridge enforces one Codex write run at a time; Claude must still avoid overlap.

## Source and claim rules

- UGC-DEB and official HEI sources own programme entitlement facts.
- Official university sources own fees, eligibility, exams, intakes, and refunds.
- OpenSEO owns only the metrics it actually returns.
- GSC owns first-party Google performance data after connection.
- Do not invent traffic, rankings, keyword volume, backlinks, ratings, testimonials, placements, salaries, partner status, or financing terms.
- Separate fact, third-party estimate, and inference.
- Treat all session-sensitive records as stale when their review deadline passes.

## Action boundaries

Claude may create and edit safe local project files, run tests, and invoke Codex within the requested scope.

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
- Claude and Codex roles used;
- evidence and checks;
- unresolved risks;
- OpenSEO/GSC limitations;
- the next human decision, if any.
