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

## 2026-08-12 — website-v2 Phase 6 re-verified + expressive motion pass (routed off ECC to the sanctioned lane)

**Decision:** Re-ran all of Phase 6 verification on the `projects/skeure-education/website-v2/` rebuild from scratch, and added an expressive, CSS-only motion layer. Pratham's request named ECC `taste` + `motion-*`; I re-routed to the project's sanctioned lane (`animate` / `apple-design` / `impeccable`) instead. What shipped: a scroll-reveal system (IntersectionObserver + `data-reveal`, visible-by-default so reduced-motion / JS-off never get stuck content), staggered reveals on the hero (load-triggered, LCP node untouched), how-it-works steps, university/program/blog cards, financing checklist and CTA; fixed the dead spots (logo hover no-op, FAQ panel snapping open); added card hovers; and a CSS-only FeeTable row-hover tint. No fee number, label, or basis was touched; no content, routes, or the old site changed.

**Why:** `website-v2/AGENTS.md` bans ECC `motion-*` (they emit React + `motion/react`, which this Astro + vanilla-CSS stack does not have) and ECC `taste` is a music-video / short-form creative-direction skill, off-domain for an education marketing site. Following the request literally would have produced inapplicable, conflicting output. Confirmed the substitution and the "more expressive" scope with Pratham before building. Verification held every hard guarantee: build 25 pages / `astro check` 0 errors / functions tsc clean; **LCP 1365 ms and CLS 0.00** on simulated mid-range mobile; Lighthouse mobile Accessibility / Best Practices / SEO all 100; reveals fire 13/13 with zero stuck content in both themes; location, phone, sitemap, background-payload (81.6 KB), self-host, and old-site-untouched checks all pass.

**Alternatives considered:** Force ECC `taste`/`motion-*` anyway (rejected — off-stack, would fight the locked design). Skip motion and verify only (rejected — Pratham asked to make it better). Minimal-fix-only pass (rejected — Pratham chose the more-expressive scroll-reveal system, held inside the perf/legibility budget).

**Owner:** Pratham. Changes are uncommitted; deploy (D1 + Turnstile via wrangler) remains his step. Open follow-up: possible light-accent brightness nudge (currently AA-safe `#0c6fa8`).

## 2026-08-13 — website-build homepage: adopted React islands (Path B), then pivoted to a midlife-inspired minimal-grotesque redesign

**Decision:** Two-part session on `projects/skeure-education/website-build` (branch `overhaul/visual-v3`). (1) Adopted React as Astro **islands** on the homepage — `npx astro add react` (React 19 / `@astrojs/react` 6) + `motion` (`motion/react`) — and shipped a POC: `FaqAccordion` (animated-height disclosure, replaces native `<details>` on the homepage only via an opt-in `animated` prop so `/faq` + `/financing` stay pure Astro), `TiltCard` (spring pointer-tilt wrapping the SSR cards), `Reveal` (`whileInView`), plus a vanilla reduced-motion-aware Hero count-up. All `client:visible` (React ships only on the homepage; `/faq`, `/financing`, `/universities` stay React-free), reduced-motion-safe, a11y held at the pre-existing baseline 96, LCP ~unchanged (~140 ms vs 133 ms), 24 pages, deployed to `overhaul-preview`. `AGENTS.md`/`CLAUDE.md` routing updated so ECC `motion-*` applies to `.tsx` islands. (2) Pratham found the result too visually similar to the old site, so after reviewing three reference sites (`handhold.io`, `thelaunchcompany.cc`, and especially `midlife.engineering`) chose to **pivot the homepage to a bold minimal-grotesque "studio" aesthetic** inspired by midlife's hero — giant lowercase grotesque headline, monochrome warm-gray, floating retro-computer overlap, Lenis smooth-scroll + calm reveals, homepage-scoped. Plan at `~/.claude/plans/mossy-herding-duckling.md`; build deferred to a fresh session.

**Why:** Islands (Path B) were chosen over a full React/Next rewrite because they add React only where motion earns it while keeping the SEO-tuned static Astro output, the D1 contact form in `functions/`, content collections, and CF Pages hosting intact — a Next migration would blow all that up for zero visual gain (the framework doesn't change the pixels). The redesign pivot follows from the same fact: "it looks the same" is a *design* problem, not a framework one, so the fix is a design direction, not a rewrite. Pratham chose the full minimal-grotesque lean (bold studio look) over keeping the warm brand.

**Alternatives considered:** Full React/Next.js site rewrite (rejected — large cost, SEO/D1/hosting regression risk, no visual benefit). Keep-warm-brand-with-midlife-structure, or a warm/grotesque blend (rejected in favor of the full minimal-grotesque lean). Rebuilding the existing CSS scroll-reveal in React (rejected — the `.js`-gated CSS + IntersectionObserver system already does it, SEO-safe and free).

**Owner:** Pratham. Redesign to be built in a fresh session (start with `ECC_GATEGUARD=off` to avoid the per-edit GateGuard hook that slowed this session). Deploy stays `overhaul-preview` only until his explicit go for `main`. Notes: midlife's `PP Neue Montreal` is commercial — use a free grotesque (General Sans / Space Grotesk); pre-existing homepage a11y = 96 (Hero `<dl>` order + global Header logo `aria-label`) left unfixed pending his call; all session changes remain uncommitted.

## 2026-08-15 — Config reset: pruned six plugins, kept ECC on trial, swapped global CLAUDE.md to ECC's verbatim

**Decision:** Claude Code had become slow and lower-quality, so the config was audited and cut back across `~/.claude` and this vault. Measured first, then acted. Removed six plugins with zero recorded invocations — `voltagent-core-dev`, `voltagent-dev-exp`, `voltagent-qa-sec`, `voltagent-research`, `claude-ads`, `fullstack-dev-skills` — plus their three marketplaces (`voltagent-subagents`, `ai-marketing-hub-claude-ads`, `fullstack-dev-skills`). Kept `ecc@ecc`, `impeccable`, `figma`, `frontend-design`, `chrome-devtools-mcp`. Separately, Pratham chose to **trial ECC's own `CLAUDE.md` verbatim as the global one**, replacing the hand-written 6,136-byte file with ECC's 3,936-byte copy. Full config backup at `~/.claude/backups/reset-20260815-102851/` with `RESTORE.md`.

**The measurements that drove it:** ECC ships 894 skills, 306 agents, 424 commands and registers 21 hook commands, four of them matching `*` (a Node process spawned on *every* tool call). Its skill + agent descriptions alone total ~197,000 characters (~49K tokens) injected into every session's system prompt. Across 249 logged commands spanning Aug 4–15, ECC skills were invoked **zero** times. The 2026-08-13 entry above independently flagged the same cost from the other direction ("start with `ECC_GATEGUARD=off` to avoid the per-edit GateGuard hook that slowed this session"). During this very session GateGuard blocked five separate operations, each demanding a written justification before a `ls`, a file write, or an edit.

**Why ECC was kept anyway:** this reverses, for now, the 2026-08-03 deferral above. Pratham asked to actually test ECC's rules with its commands intact rather than remove it unevaluated — a fair call, since it had never been given a real trial. The honest trade was stated up front and accepted: the ~49K-token catalog and all 21 hooks stay, so this round's speed gain is partial (~42M disk, ~100 agents, ~100 skills). Trial runs one week, to ~2026-08-22.

**Known caveat with ECC's CLAUDE.md:** it is a *repo-development* doc for the ECC plugin itself — it opens "guidance … when working with code in this repository", tells Claude to run `node tests/run-all.js`, describes ECC's own `agents/`/`skills/`/`hooks/` layout, and mandates `feat(skills):` commits. Expect it to misread the working directory as the ECC repo and to push test-first workflow onto Markdown-only vault edits. Those misfires are the trial's result, not a surprise. Revert is one `cp` from the backup.

**Alternatives considered:** Full ECC removal (rejected by Pratham in favor of the trial). Grafting only ECC's portable parts — the Prompt Defense Baseline and a Must Always/Must Never block — onto the existing global CLAUDE.md (rejected; he wanted a clean A/B, not a merge). Leaving the global file untouched (rejected for the same reason).

**Side effect fixed:** the swap deleted the global "Frontend work" design-skill routing table. That table already existed in fuller form at `projects/skeure-education/website-build/AGENTS.md`, which is now the single source of truth; the global-only quality checklist (responsive, keyboard focus, reduced motion, loading/empty/error states) was moved there too. Note `website-v2` and `website-v3` are siblings and do **not** inherit it — `website-v3` is currently the most active frontend dir and now has no design routing at all. Symlink or copy `AGENTS.md` into it when work resumes there.

**Owner:** Pratham. Decide at ~2026-08-22 whether ECC's CLAUDE.md stays, and whether ECC itself stays.

## 2026-08-19 — Wiped `skeure-edu-seo`, archived `ad-manager`, rebuilt as one unified growth workspace on Meta's official connectors

**Decision:** Deleted `projects/skeure-education/skeure-edu-seo` outright and moved `projects/skeure-education/ad-manager` to `archives/ad-manager-2026-08-19/`. Rebuilt a single `projects/skeure-education/skeure-growth/` that owns organic SEO, paid Meta, and shared measurement together. Wired to Meta's own connectors — the ads MCP server (`https://mcp.facebook.com/ads`), the devtools MCP (`https://mcp.facebook.com/devtools`), and the Ads CLI (`meta-ads`) — replacing the never-authenticated `openseo` MCP.

**RECOVERY POINTER: 50 of the deleted files are retrievable from commit `fbb3469` — but not all of them.**

**Permanently lost, no copy anywhere on the machine:** `audits/website-remediation-report.md`, `audits/p0-p1-checklist.md`, and `audits/rebrand-meta-auretris-baseline-2026-07-28.md`. The AIOS root `.gitignore` carries a bare `audits/` rule (line 8), which silently matched that directory at any depth, so those three files were never committed in the first place. This was discovered after deletion, while scaffolding the replacement — the new workspace uses `seo/audit-reports/` specifically to dodge that rule, and the rule is worth narrowing to a rooted path (`/audits/`) so it stops swallowing nested audit directories. Checked for survivors in git history, Syncthing `.stversions`, and a machine-wide filename search: none. Use `git show fbb3469:projects/skeure-education/skeure-edu-seo/<path>` to pull any single file, or `git checkout fbb3469 -- projects/skeure-education/skeure-edu-seo/` to restore the whole tree. `git status` was verified clean before deletion, which covered every *tracked* file — that check is blind to gitignored ones, which is exactly how the three audit files slipped through. Lesson for the next teardown: run `git ls-files --others --ignored --exclude-standard <dir>` before `rm -rf`, not just `git status`. What went with it: `evidence/programme-ledger.csv` (82 rows of UGC-DEB and official fee sourcing), `evidence/claims-register.csv` (17 high-risk claims with P0 remediation status), `migration/redirect-map.csv` + `degreecraft-url-inventory.csv`, `keywords/keyword-to-url-map.csv`, and that workspace's own `decisions/log.md`.

**Why:** the workspace had gone stale rather than wrong. It pointed at `/home/user/workspaces/AIOS/website-build`, which no longer exists; it routed work through the Codex bridge retired on 2026-08-16; and its entire live-data layer was an `openseo` MCP that is not configured in this install and never authenticated. Its status notes contradicted production — they described the remediation fixes as undeployed while the live site had shipped them. A workspace whose paths, tooling, and status claims are all wrong is not a base to build on, and reconciling it would have cost more than rebuilding. The unification is the second half of the same argument: organic and paid were split across two projects with two decision logs and no shared measurement, while the funnel they describe is one funnel. `ad-manager` was archived rather than deleted because it carries a live never-expiring system-user token and a working dry-run-by-default `social/publish.py`.

**What the rebuild is actually blocked on, measured this session, not inherited:** production measures nothing. `website-v3/src/lib/analytics.ts` is a no-op shim — 15 typed events with correct PII discipline, and no `gtag` or provider loaded anywhere on the site. There is no Meta Pixel. WhatsApp is the primary CTA and is attribution-invisible. So the ordering is fixed: measurement spine first, keyword and content work only after there is first-party data to read.

**Alternatives considered:** Archive the evidence CSVs and wipe the rest (offered — the programme ledger and claims register are real research that cost real time). Pratham chose the full wipe after that trade was stated; git history makes it recoverable, which is what made the choice safe. Keep organic and paid separate (rejected — the split was the reason neither had a shared number). Reuse the Auretris production WhatsApp app for the ads MCP OAuth (rejected — that app holds live Cloud API credentials, and widening its scopes to `ads_management` + `catalog_management` mixes revocation and blast radius for no gain; a new dedicated app costs one dashboard flow).

**Owner:** Pratham. Open at time of writing: the live ad account ID is his to supply — the July record `act_1056790306735632` is treated as unverified until the connector enumerates what the new app can actually reach. The two Meta identities stay deliberately separate: the ads MCP authenticates as the identity owning the ad account, the devtools MCP as the Auretris developer identity.

## 2026-08-20 · Deleted `website-v4`; Meta connectors live; paid delivery found silently halted

**Decision:** Deleted `projects/skeure-education/website-v4` at Pratham's instruction. Recoverable in
full from commit `6662c7e` (182 tracked files). Checked for unrecoverable content first, applying the
lesson from the 2026-08-19 audits loss: only `.dev.vars` and `next-env.d.ts` sat outside git, the
former byte-identical to `website-v3`'s and containing only Cloudflare's public Turnstile *test*
secret, the latter auto-generated. Nothing unique was lost. `website-v3` remains live and is now the
only site build.

**Also settled:** all three Meta connectors are wired (`meta-ads` MCP, `meta-devtools` MCP, Ads CLI
v1.1.0). The operating ad account is `act_961766249917785` under business `1593889128670416`,
reversing the July record. Delivery on it is halted: the prepaid balance is ₹0 and `spend_cap`
equals `amount_spent` exactly, so an ACTIVE campaign has spent nothing since 8 August while showing
healthy in Ads Manager. ₹24,998 has been spent lifetime with no conversion tracking of any kind.
Full detail in `projects/skeure-education/skeure-growth/decisions/log.md` and
`skeure-growth/paid/BASELINE-2026-08-20.md`.

**Owner:** Pratham. The spend-cap and top-up calls are his, and the recommendation on record is to
hold until measurement exists.
