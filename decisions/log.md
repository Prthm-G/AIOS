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

## 2026-08-03 — Reviewed 4 external repos for AIOS integration; adopted 2, deferred 2

**Decision:** Pratham asked to evaluate `affaan-m/ECC`, `Graphify-Labs/graphify`, `dair-ai/Prompt-Engineering-Guide`, and `ComposioHQ/awesome-claude-skills` for integration. Adopted `dair-ai/Prompt-Engineering-Guide` as a distilled reference (`references/prompt-engineering-guide.md`) and one cherry-picked skill from `awesome-claude-skills`, rewritten as `/lead-qualifier` (`.claude/skills/lead-qualifier/`). Deferred `ECC` and `graphify` — evaluated but not installed. Both flagged in `CLAUDE.md` under "External tooling watchlist."

**Why:** `ECC` and `graphify` both required running install scripts / registering plugins that grant code execution (ECC: Claude Code plugin marketplace + hooks across 67 agents/281 skills, global to all projects; graphify: PyPI CLI + self-registers as an assistant skill, optional hosted SaaS). Checked GitHub's own API (not their README badges) before trusting either: `ECC` shows 237k stars on a repo created ~7 months ago (more than `torvalds/linux` accrued in 15 years) and `graphify`'s org is 5 weeks old with 101k stars on its one repo — both anomalous enough to warrant independent verification before granting either hook-execution or data access on a machine holding live Meta/WhatsApp tokens and admissions data. `Prompt-Engineering-Guide` and the one `awesome-claude-skills` skill carried no such risk (pure docs; a markdown skill file with no execution), so those went in directly rather than waiting on a decision.

**Alternatives considered:** Install all 4 as requested (rejected — supply-chain risk on the risky two outweighed the request until independently vetted). Skip all 4 silently (rejected — two had clear, low-risk value and matched stated use cases directly).

**Owner:** Pratham. Revisit `ECC`/`graphify` only if he explicitly asks again, ideally after checking star history / contributor activity independently (e.g. via a star-history tool) rather than trusting the repos' own badges.

## 2026-08-03 — Deeper dig on ECC: legitimate project, not fraud; blast-radius concern stands

**Decision:** Followed up same-day on the 237k-star anomaly flagged in the entry above. Checked signals the README badges don't show: contributor count (100+, real diversified commits, not one account padding numbers), weekly commit activity via GitHub's stats API (continuous across the year, not a burst-then-dead pattern), fork timestamps (forks landing within the hour of checking, and starting within hours of the repo's Jan 2026 creation), npm registry data for `ecc-universal`/`ecc-agentshield` (maintainer email matches the author's own personal domain, 9 versions shipped over 5.5 months, 15k-25k real downloads/month, only 3 clean runtime deps, no postinstall hook), the actual `install.sh`/`package.json` content (plain, no curl-pipe-bash, no obfuscation), and independent third-party coverage (a DataCamp tutorial, a TechTimes news piece, a critical Medium article, trendshift.io/ghtrends.dev trend tracking). All of it corroborates a real, actively maintained, independently-verified project riding genuine hype — not fabricated popularity.

**Why this changes the read, but not the recommendation:** the original concern was "might be a supply-chain lure." That's now well down-weighted — GitHub's own stargazers-list endpoint requires auth (a platform-wide policy, confirmed by testing it against `torvalds/linux` too, not something specific to ECC) so the classic bot-farm tell (many freshly-created accounts starring in a tight window) couldn't be directly checked, but everything else checked corroborates legitimacy. What remains is legitimate on different grounds: ECC installs as a *global* Claude Code plugin (67 agents, 281 skills, hooks) affecting every project on this machine, not just the AIOS, and at least one independent writeup frames it as "dividing the developer community" over whether harnesses this heavy are worth the complexity. Neither of those is a security problem — they're a fit/scope call for a business machine holding live Meta/WhatsApp tokens.

**Alternatives considered:** Take the star anomaly at face value and recommend against ECC outright (rejected — the deeper checks didn't support that conclusion; would have been an inaccurate read left standing in `CLAUDE.md`). Install it now that it's cleared (rejected — global blast radius on a business-critical machine is still Pratham's call, not a default one AIOS should make for him).

**Owner:** Pratham. If he wants ECC, the lower-risk path is `--profile minimal` on a disposable/non-business project first, not a direct full install here.

## 2026-07-31 — Corrected wacrm/marketing-site mix-up; separated the real auretris-site

**Decision:** The docs-only knowledge base created earlier the same day had documented a mistake it didn't yet know about: a session had built the `auretris.prathamgoel.com` marketing site directly inside `automation_stack/wacrm` (the production CRM) instead of a new sibling folder, and had also left wacrm's WhatsApp-onboarding routes on the deprecated Embedded Signup v2. Both fixed: wacrm restored to CRM-only, onboarding routes removed (v4 rebuild is future work), marketing/design files moved into a new standalone `automation_stack/auretris-site`. Full detail in [`projects/skeure-education/auretris/decisions/log.md`](../projects/skeure-education/auretris/decisions/log.md).

**Why:** User caught that the prior session's output didn't match what was asked, and wanted wacrm's onboarding approach reconsidered given Meta's Oct 15, 2026 v2 deprecation.

**Alternatives considered:** None — this was a direct correction of a specific, identified mistake, not an open design choice.

**Owner:** Pratham.
