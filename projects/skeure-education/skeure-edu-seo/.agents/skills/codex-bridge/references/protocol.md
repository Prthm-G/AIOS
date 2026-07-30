# Claude–Codex bridge protocol

## Roles

- Claude is the primary interactive agent, decomposes work, holds the user conversation, and owns final acceptance.
- Codex is a peer executor or reviewer called through `codex exec`.
- OpenSEO is the shared data layer. Its MCP project ID and returned data are authoritative only after authentication succeeds.

## Safety boundary

- Read-only modes use Codex's `read-only` sandbox and `never` approval policy.
- Write mode uses `workspace-write`, `never`, and an explicit `--allow-write` acknowledgment.
- `never` prevents an unattended child process from waiting for an approval Claude cannot answer. A blocked action must fail and return to Claude.
- The bridge never enables `danger-full-access`, approval bypass, live deployment, or background network access.
- One write-mode run may operate at a time.

## Result contract

Ask Codex to end with:

1. `Outcome`
2. `Evidence or files changed`
3. `Checks run`
4. `Findings or residual risks`
5. `Recommended next action`

Claude must verify material claims and rerun critical checks. A Codex result is a peer contribution, not an automatic approval.

## Directory rules

- Use `skeure-edu-seo` for research, evidence, briefs, audits, and reports.
- Use `website-build` for production site changes.
- Set the target repository with `--cwd`.
- Add a second writable workspace only when required with `--add-dir`.

## Failure handling

- Exit 2: invalid bridge arguments or missing dependency.
- Exit 3: write lock already held.
- Exit 4: Codex returned a nonzero status.
- Exit 5: Codex completed without a final result file.

Inspect `events.jsonl` and `metadata.json` before retrying. Narrow the task instead of automatically increasing permissions.
