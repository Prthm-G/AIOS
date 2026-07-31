# Decisions Log — auretris

Append-only. See root [`decisions/log.md`](../../../../decisions/log.md) format.

## 2026-07-31 — "WhatsApp coexistence" was the wrong frame; real blocker was a Meta-side token restriction

**Decision:** Stopped chasing "coexistence" (it was deliberately removed from the codebase, migration `033_remove_whatsapp_coexistence.sql`) and instead diagnosed new-client onboarding failing outright. Root cause: `AURETRIS_META_SYSTEM_USER_TOKEN` was returning Meta error `"API access blocked"` (code 200) on every Graph API call — confirmed not a network issue by testing with a garbage token and an unauthenticated call from the same host, both of which got normal, different errors. Owner regenerated the token from Meta Business Manager mid-session; the new token verified valid (`debug_token`: correct `app_id`, all required scopes, `application: "Auretris"`).

**Why:** Code-level tracing (webhook handler, registration route, embedded-signup route) showed no coexistence code remains and no coexistence-shaped bug — the actual failure was upstream of the app, at Meta's API layer.

**Alternatives considered:** Chasing a credit-line-ID gap (`AURETRIS_META_CREDIT_LINE_ID` is also unset, required only for Solution-Partner "migration" mode) — real but secondary; the direct Cloud API registration path (`/api/whatsapp/registration`, `'cloud'` mode) doesn't need it and is unblocked now that the token works.

**Owner:** Pratham.

**Still open:** `AURETRIS_META_CREDIT_LINE_ID` needed from Meta Business Manager (Business Settings → Lines of Credit) to unblock migration-mode onboarding specifically.

## 2026-07-31 — Deduped conflicting `.env` values instead of rotating them

**Decision:** `WACRM_ENCRYPTION_KEY` and `N8N_WACRM_WEBHOOK_SECRET` were each defined twice in `/home/user/automation_stack/.env` with different values (last-value-wins in Docker Compose). Removed the stale duplicate lines and kept the currently-active values as canonical, rather than rotating to fresh ones. Also fixed a leading-space bug in `WHATSAPP_WEBHOOK_VERIFY_TOKEN` that could have broken Meta's webhook verification handshake.

**Why:** Rotating `WACRM_ENCRYPTION_KEY` orphans every WhatsApp token encrypted under the old key. One client was already connected (since 2026-07-28) — checked its DB row first; rotating instead of deduping would have broken that live connection for no benefit. `N8N_WACRM_WEBHOOK_SECRET`'s active value is weak (short, guessable — see `.env`, value not repeated here) but wasn't rotated either, because the n8n workflow that validates it hasn't been checked/updated in tandem — flagged as a follow-up, not done blind. **Redacted 2026-07-31 before this file went public — rotate this secret, don't just keep documenting that it's weak.**

**Alternatives considered:** Generate fresh values for both — rejected for today given the live-connection risk and the unverified n8n-side coupling.

**Owner:** Pratham.

## 2026-07-31 — Secret hygiene: scrubbed committed secrets, deferred kong.yml templating

**Decision:** Replaced the real `META_APP_SECRET` and an unused, unwired `CLOUDFLARE_API_TOKEN` in `wacrm/.env.local.example` (a git-tracked file meant to be a placeholder template) with actual placeholders/removal. Untracked `supabase/volumes/kong/kong.yml` from git (`git rm --cached` + `.gitignore`) since it hardcodes live Supabase JWT keys — file stays on disk, Kong is unaffected, it just won't be committed going forward.

**Why:** These secrets had leaked into files that shouldn't carry them. Risk was contained (repo has no remote, only 3 commits) but not zero — fixed before it could get worse.

**Alternatives considered:** Templating `kong.yml` with real env-var substitution — Kong's declarative-config format doesn't support this natively without an extra `envsubst` entrypoint step; judged as a bigger change than warranted today, deferred to Phase C cleanup.

**Owner:** Pratham.

## 2026-07-31 — Keep wacrm + n8n as the base; don't rebuild yet

**Decision:** Evaluated (at the owner's request) whether to replace n8n, rebuild the CRM instead of `wacrm`, and/or buy Claude Max / Cursor. Recommendation: keep both n8n and `wacrm` — n8n is doing real, working orchestration (the LangChain+Groq WhatsApp agent and its tool workflows), and `wacrm` is a real, maintained, MIT-licensed CRM already deeply customized (16+ Auretris-specific files, RLS multi-tenancy, WABA registration, token encryption) that a rebuild would have to re-implement from scratch. Also flagged: `wacrm`'s existing multi-tenant `account_id` model may make the current "clone the whole stack per client" onboarding pattern unnecessary — worth validating before any bigger architecture change.

**Why:** Today's actual blockers (Meta token restriction, env-var duplication, leaked secrets) all traced to configuration/hygiene, not to n8n or wacrm's architecture. No evidence found that either tool is the constraint.

**Alternatives considered:** Full rebuild with Claude/Codex automation; custom CRM; Claude Max/Cursor membership purchase — all deferred, not ruled out, pending a concrete capability gap that current tooling can't cover.

**Owner:** Pratham.

## 2026-07-31 — Corrected the wacrm/marketing-site mix-up; removed v2 onboarding pending a v4 rebuild

**Decision:** A same-day-earlier session, asked to build a marketing website at `auretris.prathamgoel.com` in a new folder under `automation_stack`, instead built it directly inside `automation_stack/wacrm` — hijacking wacrm's production root route (`src/app/page.tsx`) and adding marketing-only components, a `/concepts/*` route, and 12 concept mockups untracked inside the live CRM app. Fixed by:
- Restoring `wacrm/src/app/page.tsx` to its original `redirect('/dashboard')`.
- Removing the host-based marketing/CRM split from `wacrm/src/middleware.ts` (`CRM_ROOT_REDIRECT_HOSTS`) and the matching env var from `docker-compose.yml`.
- Reverting the Facebook-JS-SDK-specific CSP additions in `wacrm/next.config.ts` — no longer needed once the client-side Embedded Signup component is gone.
- Moving all marketing/design files (landing page, `/concepts/*`, `components/marketing/*`, `lib/auretris/concepts.ts`, `public/auretris-mark.svg`, `artifacts/auretris-concepts/`) into a new, standalone `automation_stack/auretris-site/` app — own `package.json`, `Dockerfile`, docker-compose service on port 3002 (3001 was already bound by the `skinstitutes` client stack's own wacrm clone). Fixed the moved page's two now-dead links: the "Connect WhatsApp" CTA pointed at `/onboard` (removed, see below) and now scrolls to the in-page "how it works" section instead; "Sign in" links now point cross-domain at `https://kuanli.prathamgoel.com/login`.
- Separately, also removed wacrm's WhatsApp-onboarding feature entirely — `src/app/onboard/`, `api/whatsapp/{registration,embedded-signup}/route.ts`, `lib/whatsapp/embedded-signup.ts`, `components/whatsapp/embedded-signup.tsx`, and the three onboarding-only helper functions in `lib/whatsapp/meta-api.ts` (`createBusinessPhoneNumber`, `requestPhoneVerificationCode`, `verifyBusinessPhoneNumber`) — kept the unrelated Graph API version bump in that same file. This flow was built against Meta's Embedded Signup **v2** (deprecated Oct 15, 2026); a v4-based rebuild is future work, not done here.
- Checked live (Meta Developer Tools MCP + a direct Graph API call with the system user token): no shared Meta credit line exists today, so any new client currently needs their own card on their WABA (Tech Provider default) until/unless Pratham becomes a Solution Partner.
- Left completely untouched: the live webhook/messaging code, the separate in-progress "inbox" feature (`components/whatsapp/` beyond embedded-signup, `lib/inbox/`, `api/conversations/`), all `supabase/migrations/026–032` and the one-off `fix-*.js`/`patch-*.js` scripts in wacrm's root — none of that overlaps with the marketing-site mistake or the onboarding removal.

**Why:** The user explicitly asked for the wrong-location website to be corrected and for wacrm's v2-era onboarding to be scrapped rather than kept, given the v4 migration deadline. Restoring/removing was scoped file-by-file (via `git diff`, not blanket `git checkout`) specifically because `wacrm` turned out to have far more uncommitted work in flight (the inbox feature, several DB migrations) than the original request touched — a blanket revert would have destroyed unrelated in-progress work.

**Alternatives considered:** Deleting this whole `auretris/` docs folder instead of rewriting it — rejected by the user; the wacrm/CRM documentation itself was accurate, only the website claims were wrong.

**Owner:** Pratham.

**Still open:** the Embedded Signup v4 rebuild (onboarding is fully unimplemented until then); Hostinger-side DNS for `auretris.prathamgoel.com` → the new site's port; `AURETRIS_META_CREDIT_LINE_ID` / Solution Partner decision from the prior entry, still unresolved.
