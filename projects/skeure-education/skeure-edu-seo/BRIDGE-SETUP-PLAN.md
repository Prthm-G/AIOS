# Claude–Codex–OpenSEO Bridge Setup Plan

**Created:** 24 July 2026  
**Workspace:** `/home/user/workspaces/AIOS/skeure-edu-seo`  
**Primary CLI:** Claude Code  
**Peer CLI:** Codex  
**Shared SEO data:** OpenSEO MCP

## Outcome

This setup keeps Claude as the only CLI you need to interact with most of the time. Claude can call Codex non-interactively for independent analysis, adversarial review, or direct bounded implementation. Both models load the same project instructions and project-local SEO skills. OpenSEO supplies the same authenticated SEO/GSC project to both clients.

The bridge uses supported local CLI surfaces:

- Claude Code's Bash tool, project `CLAUDE.md`, project skills, and project agents.
- Codex's stable `codex exec`, `AGENTS.md`, `.codex/config.toml`, repository `.agents/skills`, sandbox modes, JSONL output, and final-message files.
- OpenSEO's hosted MCP endpoint and project-local agent skills.

It does not expose either model as an unauthenticated local server, share account tokens, bypass permissions, or create a recursive model loop.

## Architecture

```text
You
 │
 ▼
Claude Code (primary conversation and orchestration)
 │
 ├── project CLAUDE.md
 ├── project agent: codex-peer
 ├── shared OpenSEO skills ──────────────┐
 ├── OpenSEO MCP                         │
 │                                      │
 └── ./bin/codex-bridge                  │
       │                                 │
       ├── ask/review: read-only         │
       ├── implement: workspace-write    │
       ├── JSONL + final result logs     │
       └── single-writer lock            │
                 │                       │
                 ▼                       │
          codex exec (peer)              │
                 │                       │
                 ├── AGENTS.md           │
                 ├── .codex/config.toml  │
                 ├── .agents/skills ◄────┘
                 └── OpenSEO MCP
```

## Design decisions

### Claude remains primary

Claude owns:

- conversation with the user;
- decomposition and task routing;
- permission interpretation;
- final acceptance;
- reconciling model disagreements;
- durable decision reporting.

Codex never becomes an uncontrolled daemon. It runs as a child process for one bounded task.

### One canonical skill copy

Shared skills are stored under:

```text
.agents/skills/
```

Codex discovers this repository-standard location directly. Claude receives symlinks under:

```text
.claude/skills/
```

This prevents divergent Claude and Codex copies of the same skill.

### Three bridge modes

| Mode | Codex sandbox | Edits | Use |
|---|---|---:|---|
| `ask` | `read-only` | No | Research, plan, independent opinion |
| `review` | `read-only` | No | Adversarial review, claims, diffs, architecture |
| `implement` | `workspace-write` | Yes | Approved isolated implementation |

All unattended Codex runs use approval policy `never`. This means an action outside the sandbox fails instead of waiting for an approval the child process cannot receive. The correct response is to narrow the task or run it interactively, not remove the sandbox.

### Single writer

`implement` requires:

```text
--allow-write
```

It also acquires `.bridge/write.lock`. A second Codex writer fails immediately. Claude must not edit overlapping files while Codex is writing.

### Durable handoff

Each call produces:

```text
.bridge/runs/<timestamp>-<mode>/
  request.md
  metadata.json
  events.jsonl
  stderr.log
  result.md
  git-before.txt
  git-after.txt
```

These operational logs are ignored by Git. Copy only decisions or evidence worth retaining into the appropriate tracked folder.

## Files created

| File | Purpose |
|---|---|
| `CLAUDE.md` | Claude-first operating manual |
| `AGENTS.md` | Shared instructions for Codex and other agents |
| `.codex/config.toml` | Safe defaults for direct interactive Codex use |
| `.claude/settings.json` | Allows safe read-only bridge commands and blocks the dangerous bypass flag |
| `.claude/agents/codex-peer.md` | Claude subagent that invokes Codex through the bridge |
| `.agents/skills/codex-bridge/` | Shared delegation workflow and deterministic script |
| `.agents/skills/skeure-seo-orchestrator/` | Shared Skeure-specific dual-model SEO workflow |
| `.claude/skills/*` | Symlinks to the canonical shared skills |
| `bin/codex-bridge` | Stable command entry point |
| `bridge/SKILL-ROUTER.md` | Small authoritative skill catalog used in every handoff |
| `bin/bridge-doctor` | CLI, auth, MCP, and skill health check |
| `bridge/prompts/` | Reusable research, review, and implementation task templates |
| `skills-lock.json` | Reproducible OpenSEO skill source lock |

## Commands already executed

The setup process executed:

```bash
claude --version
codex --version
codex doctor
claude doctor
codex login status
codex mcp list
claude mcp list
npx --yes skills add every-app/open-seo --skill '*' --agent claude-code codex --yes
```

The installer exposed internal OpenSEO-maintainer skills in addition to public workflows. These unrelated skills were removed:

```bash
npx --yes skills remove \
  maintain-greptile-rules \
  merge-ready \
  openseo-release-notes \
  openseo-review-web-content \
  papercuts \
  --yes
```

OpenSEO MCP was added to both clients:

```bash
codex mcp add openseo --url https://app.openseo.so/mcp
claude mcp add --transport http --scope user openseo https://app.openseo.so/mcp
```

## One required manual step: OpenSEO login

Both clients currently have the OpenSEO endpoint configured. OAuth cannot be completed safely on your behalf because it requires your account login and project authorization.

From this folder, run:

```bash
codex mcp login openseo
```

Then open the printed URL, sign in, and approve access.

For Claude, start a fresh session:

```bash
claude
```

When Claude first calls OpenSEO, approve the authentication prompt. If needed, use Claude's `/mcp` interface to authenticate `openseo`.

Verify:

```bash
codex mcp list
claude mcp list
./bin/bridge-doctor
```

Expected:

- Codex: `openseo` enabled and logged in.
- Claude: `openseo` connected.
- OpenSEO `whoami` and `list_projects` succeed.

Do not run paid research merely to test authentication. `whoami` and `list_projects` are sufficient.

## Start Claude as the master CLI

```bash
cd /home/user/workspaces/AIOS/skeure-edu-seo
./bin/bridge-doctor
claude
```

Claude automatically reads `CLAUDE.md`. Ask naturally:

```text
Use /skeure-seo-orchestrator to run the next P0 SEO workstream.
Use Codex as an independent reviewer before accepting changes.
```

Or:

```text
Review the DegreeCraft migration plan. Delegate an adversarial review to Codex,
reconcile disagreements using evidence, and update only the SEO workspace.
```

## Direct bridge commands

### Status without a model call

```bash
./bin/codex-bridge status
```

### Ask Codex a read-only question

```bash
./bin/codex-bridge ask \
  --cwd /home/user/workspaces/AIOS/skeure-edu-seo \
  "Identify the three highest-risk assumptions in the SEO master plan."
```

### Ask Codex to review selected work

```bash
./bin/codex-bridge review \
  --cwd /home/user/workspaces/AIOS/skeure-edu-seo \
  "Review AGENTS.md, CLAUDE.md, and the bridge skill for unsafe or conflicting instructions."
```

### Use a prepared prompt

```bash
./bin/codex-bridge review \
  --cwd "$PWD" \
  --prompt-file bridge/prompts/diff-review.md
```

### Let Codex implement in the SEO workspace

```bash
printf '%s\n' \
  "Create the approved weekly reporting template. Do not edit the master plans." |
  ./bin/codex-bridge implement \
    --allow-write \
    --cwd "$PWD" \
    -
```

### Let Codex implement in `website-build`

```bash
printf '%s\n' \
  "Implement only the approved title and canonical fixes. Run npm run build and npx astro check." |
  ./bin/codex-bridge implement \
    --allow-write \
    --cwd /home/user/workspaces/AIOS/website-build \
    --add-dir /home/user/workspaces/AIOS/skeure-edu-seo \
    -
```

The sibling SEO directory should be added only when Codex must write an audit or evidence artifact there.

### Enable live Codex web search

The bridge defaults to no live web search. For tasks that genuinely need current sources:

```bash
printf '%s\n' "Verify the current official UGC-DEB programme list for the named HEI." |
  ./bin/codex-bridge ask --search --cwd "$PWD" -
```

For high-risk claims, instruct Codex to use primary official sources.

## Use Codex directly

You can still launch Codex manually:

```bash
cd /home/user/workspaces/AIOS/skeure-edu-seo
codex
```

Project defaults give interactive Codex:

- `workspace-write` sandbox;
- `on-request` approvals;
- cached web search;
- no command-level network access in the workspace-write sandbox.

For a read-only direct review:

```bash
codex --sandbox read-only --ask-for-approval on-request
```

For website work:

```bash
codex \
  --cd /home/user/workspaces/AIOS/website-build \
  --add-dir /home/user/workspaces/AIOS/skeure-edu-seo \
  --sandbox workspace-write \
  --ask-for-approval on-request
```

Never use `--dangerously-bypass-approvals-and-sandbox` for this workflow.

## Shared OpenSEO skills

Installed public workflow skills:

1. `seo-project-setup`
2. `seo-coach`
3. `competitive-landscape`
4. `competitor-analysis`
5. `keyword-research`
6. `keyword-clustering`
7. `link-prospecting`
8. `deslop` as an editorial support skill

Custom shared skills:

1. `codex-bridge`
2. `skeure-seo-orchestrator`

The first SEO sequence should be:

```text
seo-project-setup
→ connect/verify GSC
→ competitive-landscape
→ keyword-research
→ keyword-clustering
→ competitor-analysis
→ content briefs and implementation
→ link-prospecting only after a verified linkable asset exists
```

### Why the project uses an explicit skill router

This workstation currently has more machine-wide Codex skills than Codex can include in
its automatic model-visible skill-description budget. Direct Codex runs can therefore log
a skill-budget warning even though project files remain readable.

The bridge does not depend on that global catalog. It uses `bridge/SKILL-ROUTER.md` and
inserts the exact applicable `.agents/skills/<name>/SKILL.md` paths into each request.
Codex reads those files directly. The diagnostic warning remains in `stderr.log`; JSON
events stay parseable in `events.jsonl`.

Do not delete or bulk-disable the user's global skills as part of this project. If the
global collection is later curated, treat that as a separate machine-level maintenance
task. Project routing remains deterministic either way.

## Recommended model collaboration patterns

### Pattern A: Claude writes, Codex reviews

Use for:

- content briefs;
- implementation plans;
- website code;
- analytics design;
- migration maps.

Flow:

```text
Claude frames and writes
→ Codex read-only review
→ Claude verifies findings
→ Claude fixes
→ deterministic tests
```

### Pattern B: Codex writes, Claude reviews

Use for:

- isolated scripts;
- mechanical content migrations;
- metadata implementation;
- test creation;
- evidence-table normalization.

Flow:

```text
Claude defines acceptance
→ Codex implement mode
→ Claude inspects diff
→ Claude reruns tests
→ optional Codex final review only if the scope is high-risk
```

### Pattern C: independent research

Use for:

- regulatory facts;
- competitor interpretation;
- keyword/intent ambiguity;
- migration-risk decisions.

Flow:

```text
Claude researches independently
Codex researches independently
→ compare source evidence
→ resolve through primary sources or live data
```

Do not show one model's conclusion to the other before the independent pass when independence matters.

### Pattern D: OpenSEO shared-data decision

Use for:

- keyword prioritization;
- SERP competitors;
- ranking changes;
- backlinks;
- GSC opportunities.

Flow:

```text
OpenSEO/GSC data retrieval
→ save inputs/parameters
→ Claude analysis
→ Codex challenge
→ one approved decision in decisions/log.md
```

Both models must use the same project ID, market, language, device, location, and date range.

## Cost and context controls

- Delegate one bounded task, not an entire project.
- Use read-only review more often than implementation.
- Use OpenSEO/GSC once and save results rather than paying for duplicate calls.
- Avoid passing the 5,000-word master plan when a small excerpt or file reference is enough.
- Keep bridge sessions ephemeral by default.
- Use `--keep-session` only for a deliberate multi-turn Codex continuation.
- Prefer deterministic scripts and tests over a third model pass.

## Security and privacy

- Codex uses existing local ChatGPT authentication. The bridge does not copy auth tokens.
- Claude uses its existing local authentication. The bridge does not expose Claude as a service.
- OpenSEO OAuth remains client-managed.
- Prompts and JSONL logs can contain the task text. Never put student PII, credentials, API keys, OAuth codes, private contracts, or sensitive finance data in a bridge prompt.
- `.bridge/runs/` is ignored by Git but still exists locally. Delete individual non-sensitive temporary run directories when no longer needed; do not automate broad deletion.
- Child Codex runs cannot request interactive approvals. Blocked actions return to Claude.

## Failure recovery

### `implement mode requires --allow-write`

This is intentional. Confirm the task is authorized, then rerun with `--allow-write`.

### `another write-mode bridge run is active`

Wait for the first run to finish. Check:

```bash
ps -ef | rg 'codex|codex_bridge'
```

Do not remove the lock while an actual writer is active.

### Codex exit code 4 from the bridge

Inspect the printed run directory:

```bash
sed -n '1,220p' .bridge/runs/<run>/events.jsonl
sed -n '1,220p' .bridge/runs/<run>/metadata.json
```

Likely causes:

- sandbox prevented an action;
- project trust/config issue;
- missing MCP authentication;
- live network needed but `--search` was not selected;
- task was too broad.

Narrow the task first.

### OpenSEO not authenticated

Run:

```bash
codex mcp login openseo
```

For Claude, authenticate through `/mcp` in an interactive Claude session.

### Claude cannot see a new skill or agent

Start a fresh Claude session. Plugin and agent rosters are commonly fixed at session start.

### Codex does not see project config

Codex reads project `.codex/config.toml` only for trusted repositories. Start interactive Codex in the workspace and approve trust. The bridge also passes explicit sandbox and approval flags, so its core safety does not depend only on project config.

## Validation checklist

- [ ] `claude --version` succeeds.
- [ ] `codex --version` succeeds.
- [ ] `codex login status` succeeds.
- [ ] `codex mcp list` shows OpenSEO logged in.
- [ ] `claude mcp list` shows OpenSEO connected.
- [ ] `./bin/bridge-doctor` passes.
- [ ] Both custom skills pass `quick_validate.py`.
- [ ] Claude sees `/codex-bridge` and `/skeure-seo-orchestrator` in a fresh session.
- [ ] Codex sees the same skills from `.agents/skills`.
- [ ] A read-only bridge dry-run writes a result and does not change tracked files.
- [ ] Implement mode refuses to run without `--allow-write`.
- [ ] A controlled write-mode test changes only a temporary approved test file.
- [ ] Claude independently verifies a Codex result before acceptance.

## Implementation phases

### Phase 1: local bridge

- Create shared instructions, skills, scripts, and safe defaults.
- Install public OpenSEO skills once and symlink them to Claude.
- Add OpenSEO MCP to both clients.
- Validate read-only and write-mode boundaries.

### Phase 2: authenticated SEO data

- Complete OpenSEO OAuth for Claude and Codex.
- Connect the Skeure and DegreeCraft GSC properties.
- Run `seo-project-setup`.
- Record the exact OpenSEO project ID in a non-secret project context file.
- Pull and save the first baseline.

### Phase 3: repeatable workstreams

- Create standard task briefs for audit, research, content, migration, analytics, and local SEO.
- Define writer/reviewer assignments.
- Add deterministic validators for claims-register schema, programme-ledger status, links, and stale evidence.
- Run one full Claude-write/Codex-review sprint.

### Phase 4: supervised cadence

- Weekly Claude session pulls GSC and identifies one priority.
- Codex challenges the analysis.
- Claude implements or delegates one bounded change.
- The other model reviews.
- Deterministic checks pass.
- Results are recorded in the weekly report.

Do not automate production publishing or external outreach until the supervised process has repeatedly produced correct results.

## Definition of done

The bridge is operational when:

1. Claude is the only CLI the user needs for normal work.
2. Claude can invoke Codex read-only or write-mode through one command.
3. Both models load the same `AGENTS.md` and shared skills.
4. Both clients authenticate to the same OpenSEO project.
5. Every Codex handoff leaves a request, result, logs, and before/after status.
6. Write concurrency and permission bypass are prevented.
7. Claude verifies Codex output before acceptance.
8. Direct interactive Codex remains available when desired.
