# Decisions Log

Append-only record of meaningful decisions and why they were made. `/level-up` Phase 2 (Method interview) writes scoped automation specs here. You can also append manually whenever you decide something worth remembering.

**Format per entry:**

```
## YYYY-MM-DD — Short title

**Decision:** what was decided.

**Why:** the reasoning, constraints, and what would change your mind.

**Alternatives considered:** what else was on the table.

**Owner:** who's accountable.
```

Keep it terse. Future-you will thank present-you for capturing the *why*, not just the *what*.

---

## 2026-07-30 — Daily auto-commit for the AIOS root repo

**Decision:** Added a local cron job (`30 23 * * *`, IST) running `.scripts/auto-commit-daily.sh`, which commits any changes in the AIOS root repo (`/home/user/workspaces/AIOS`) at end of day. Skips silently if nothing changed. Scans staged files for secret-shaped strings (api key/token/password patterns) before committing and aborts (unstages, logs, exits nonzero) if anything matches. Never pushes to any remote.

**Why:** Pratham asked for daily auto-commits. The `/schedule` skill's cloud routines were the first option tried, but they run in an isolated cloud sandbox with a fresh GitHub clone — no access to this machine's local disk or uncommitted changes — so they can't do what was actually needed. Local cron was confirmed running on this machine (there's already a `backup-all.sh` job at 3am), so that's the real mechanism. Before wiring this up, found and excluded several large/local-only paths from `.gitignore` that a blind `git add -A` would otherwise have swept in (a 4.2GB `codex-desktop-linux/` checkout, `claude-config/`, `codex-headless/`, `.obsidian/`, `.stfolder/`).

**Alternatives considered:** Cloud routine via `/schedule` (rejected — wrong data, operates on the GitHub remote's clone, not local disk). No automation, manual commits only (rejected per explicit request).

**Owner:** Pratham. Scope is the AIOS root repo only — `ad-manager/` and `website-build/` are independently git-managed and are committed manually/explicitly during working sessions, not by this job. Change the cron time by editing the crontab entry directly (`crontab -e`) if 11:30pm IST isn't the right "end of day."
