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

## 2026-07-31 — Auretris/wacrm stabilization: real blocker was a Meta token restriction, not "coexistence"

**Decision:** Audited `/home/user/automation_stack` (Auretris/wacrm/n8n/Supabase stack), fixed the actual cause of new-client WhatsApp onboarding failing (a Meta-blocked system-user token — owner regenerated it and it now verifies valid), deduped conflicting `.env` values, scrubbed leaked secrets, and created `projects/skeure-education/auretris/` as a docs-only knowledge base (no app code migrated). Full detail and rationale in [`projects/skeure-education/auretris/decisions/log.md`](../projects/skeure-education/auretris/decisions/log.md).

**Why:** "WhatsApp coexistence" was the wrong frame — that feature was deliberately removed from the codebase. The real blocker was upstream, at Meta's API layer.

**Alternatives considered:** Full rebuild (replace n8n, replace `wacrm` with a custom CRM, buy Claude Max/Cursor) — evaluated and deferred; see the linked local log for the full comparison.

**Owner:** Pratham.

## 2026-07-31 — Corrected wacrm/marketing-site mix-up; separated the real auretris-site

**Decision:** The docs-only knowledge base created earlier the same day had documented a mistake it didn't yet know about: a session had built the `auretris.prathamgoel.com` marketing site directly inside `automation_stack/wacrm` (the production CRM) instead of a new sibling folder, and had also left wacrm's WhatsApp-onboarding routes on the deprecated Embedded Signup v2. Both fixed: wacrm restored to CRM-only, onboarding routes removed (v4 rebuild is future work), marketing/design files moved into a new standalone `automation_stack/auretris-site`. Full detail in [`projects/skeure-education/auretris/decisions/log.md`](../projects/skeure-education/auretris/decisions/log.md).

**Why:** User caught that the prior session's output didn't match what was asked, and wanted wacrm's onboarding approach reconsidered given Meta's Oct 15, 2026 v2 deprecation.

**Alternatives considered:** None — this was a direct correction of a specific, identified mistake, not an open design choice.

**Owner:** Pratham.
