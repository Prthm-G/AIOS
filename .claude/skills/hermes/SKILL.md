---
name: hermes
description: Hand a small, mechanical vault errand to the always-on Hermes `aios` caretaker instead of doing it inline. Use for cheap detection, counting, log-scanning, and format validation across the AIOS vault. Do NOT use for anything needing judgment, interpretation, or a write into wiki/ or project code.
---

# Hermes — the AIOS caretaker bridge

There is a second agent on this box: a Hermes profile called `aios` that runs
always-on as a systemd service and looks after this vault. It is cheap, it is
awake between your sessions, and it is deliberately not allowed to interpret
anything.

**You are the brain. It is the caretaker.** Hand it work; do not hand it decisions.

## When to use it

Good errands — mechanical, verifiable, no judgment:

- counting or inventorying (`how many job folders lack a resume.pdf?`)
- scanning logs for a pattern
- checking a format matches its documented shape
- re-running one of its own checks on demand
- confirming a claim about the filesystem before you act on it

Do **not** hand it:

- anything that decides what a claim means or how to resolve a contradiction
- authoring or editing any page under `wiki/`
- project code, migrations, deploys, or anything under `automation_stack/`
- anything touching `projects/skeure-finance/` or `projects/manus/secrets/`
  (both are physically masked out of its sandbox — it cannot see them)

If you are about to write the errand prompt and it contains the word "decide",
"assess", "judge", or "should", do it yourself instead.

## Lane A — synchronous, get an answer now

```bash
hermes -p aios -z "PROMPT" --usage-file /tmp/aios-usage.json
```

Prints only the final answer to stdout. No banner, no spinner, no session id.
Approvals are auto-bypassed. Runs on the Codex subscription, so
`estimated_cost_usd` comes back `0.0` / `"included"`.

Give it absolute paths. Its sandbox mounts this vault at its real path
(`/home/user/workspaces/AIOS`), so paths mean the same thing on both sides.

## Lane B — asynchronous, let it work while you do something else

```bash
# file it
hermes kanban --board aios create "TITLE" \
  --body "self-contained instructions; the worker starts cold" \
  --assignee aios --workspace dir:/home/user/workspaces/AIOS

# check on it
hermes kanban --board aios list
hermes kanban --board aios show <task-id>
```

The dispatcher inside the gateway claims it within ~60s, spawns the `aios`
profile in the vault, and records the result as a comment. The board is durable
SQLite at `/home/user/.hermes/kanban/boards/aios/kanban.db` and survives
restarts, so a task filed now is still there next session.

The worker starts with **no** knowledge of this conversation. Everything it
needs goes in `--body`.

## Lane C — its messaging surface (MCP)

`.mcp.json` in this vault registers `hermes` as an MCP server, exposing
`messages_send`, `messages_read`, `conversations_list`, `events_poll`, and six
more. Use it to reach Pratham on Telegram mid-task.

**Currently inert**: the `aios` profile has no messaging platform enabled yet
(it needs its own BotFather token — zao's is dead and two gateways cannot share
one bot). The tools load; there are no channels behind them until that lands.

## Reading what it found on its own

It runs six scheduled checks. The ones that matter to you:

- `context/health.md` — rewritten daily at 08:00 with overdue dates, cold
  connections, and uncommitted work. Read it at session start.
- Anything it could not do itself lands as a kanban task assigned to `claude`:
  ```bash
  hermes kanban --board aios list --assignee claude
  ```
  No `claude` profile exists, so those never auto-run. They wait for you.
  Drain that queue when you start work in this vault.
