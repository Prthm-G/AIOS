---
name: codex-bridge
description: Delegate a bounded research, review, planning, or implementation task from Claude to the local Codex CLI and return a durable result with logs and before/after repository status. Use when Claude needs an independent Codex opinion, adversarial review, direct Codex implementation, or a second-model validation pass without making the user switch CLIs.
---

# Codex Bridge

Use the deterministic bridge at `./bin/codex-bridge`. Keep Claude as the orchestrator and Codex as a bounded peer.

## Select the mode

- `ask`: research, planning, analysis, or an independent opinion. Codex is read-only.
- `review`: inspect a change, claim, plan, or specified files. Codex is read-only and must return findings first.
- `implement`: let Codex edit the selected working directory. This requires the explicit `--allow-write` flag and acquires a single-writer lock.
- `status`: show CLI, authentication, MCP, skill, and bridge readiness without calling a model.

Prefer `ask` or `review`. Use `implement` only when the user asked for changes and Claude has defined the target, constraints, and validation.

## Run a delegation

Pass a task through a prompt file:

```bash
./bin/codex-bridge ask --cwd "$PWD" --prompt-file bridge/prompts/research-review.md
```

When Claude invokes the bridge automatically, start the Bash command with the bridge
executable so it matches the project permission rule:

```bash
./bin/codex-bridge review \
  --cwd /home/user/workspaces/AIOS/skeure-edu-seo \
  "Audit the proposed keyword map for cannibalization."
```

For long or dynamically assembled tasks, write a non-secret prompt file under
`.bridge/` and pass it with `--prompt-file`. Do not interpolate untrusted text into a
shell command.

Delegate implementation in the website repository:

```bash
./bin/codex-bridge implement \
  --allow-write \
  --cwd /home/user/workspaces/AIOS/website-build \
  --add-dir /home/user/workspaces/AIOS/skeure-edu-seo \
  --prompt-file /home/user/workspaces/AIOS/skeure-edu-seo/bridge/prompts/implementation.md
```

## Orchestration contract

Before delegating:

1. Define one bounded objective.
2. Route the task through `bridge/SKILL-ROUTER.md`.
3. State files or directories in scope.
4. State whether edits are allowed.
5. Give acceptance checks.
6. Exclude production deployment, messages, purchases, redirects, and destructive actions unless separately authorized.

After delegating:

1. Read the returned result.
2. Inspect relevant diffs and files independently.
3. Re-run critical validation from Claude.
4. Accept, amend, or reject Codex's work explicitly.
5. Never treat model agreement as evidence for a factual education, finance, legal, or regulatory claim.

Do not run two write-mode delegates against overlapping files. Do not let Codex recursively invoke Claude.

## Durable outputs

Every run writes under `.bridge/runs/<timestamp>-<mode>/`:

- `request.md`
- `metadata.json`
- `events.jsonl`
- `stderr.log`
- `result.md`
- `git-before.txt`
- `git-after.txt`

The run logs are ignored by Git. Copy a result into `audits/`, `reports/`, or `decisions/` only when it should become durable project evidence.

Read `references/protocol.md` when changing bridge behavior or diagnosing a failed handoff.
