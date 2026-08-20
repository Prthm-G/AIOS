# Decisions log: Skeure Growth

Append-only record of durable decisions and why they were made. Newest at the bottom.

**Format per entry:**

```
## YYYY-MM-DD · Short title

**Decision:** what was decided.

**Why:** the reasoning, the constraints, and what would change your mind.

**Alternatives considered:** what was rejected and why.

**Owner:** who signed off, and what remains open.
```

---

## 2026-08-19 · Workspace created; scope, ordering, and connector architecture set

**Decision:** Created this workspace to hold organic SEO, paid Meta, and shared measurement
together, replacing `skeure-edu-seo` (deleted) and absorbing `ad-manager` (archived at
`archives/ad-manager-2026-08-19/`). Wired to Meta's own connectors (the ads MCP server, the devtools
MCP, and the `meta-ads` Ads CLI) instead of the `openseo` MCP the old workspace depended on and
never authenticated. Fixed the work ordering: **measurement spine first**, keyword and content work
only once there is real first-party data, paid last.

**Why:** the split between organic and paid was the reason neither had a shared number. Two
projects, two decision logs, no common measurement, all describing one funnel. On the ordering: a live
check this session found production measures nothing. `../website-v3/src/lib/analytics.ts` is a
no-op shim: 15 typed events with correct PII discipline, and no provider loaded anywhere on the
site. There is no Meta Pixel. WhatsApp is the primary CTA and is attribution-invisible. Doing
keyword or campaign work first would optimize numbers nobody can observe.

**Alternatives considered:** Keep SEO and ads separate with ads read-only (rejected; it preserves the
split that caused the problem). Reuse the Auretris production WhatsApp app for the ads MCP OAuth
(rejected; that app holds live Cloud API credentials, and widening it to `ads_management` and
`catalog_management` ties ads revocation to WhatsApp revocation for no gain). Start with keyword
research because it feels productive (rejected on the measurement argument above).

**Owner:** Pratham. Open: the live ad account ID is his to supply: the July record
`act_1056790306735632` is treated as unverified until `meta ads adaccount list` confirms it. The two
Meta identities stay deliberately separate: `meta-ads` authenticates as the ad-account owner,
`meta-devtools` as the Auretris developer. Connector setup is tracked in
`SETUP-META-CONNECTORS.md`; nothing is wired yet.

## 2026-08-20 · Connectors live; operating ad account confirmed as `act_961766249917785`; paid delivery found halted

**Decision:** Recorded `act_961766249917785` ("DegreeCraft"), under business portfolio
`1593889128670416`, as the operating ad account. All three connectors are wired and verified: the
`meta-ads` MCP, the `meta-devtools` MCP, and the Ads CLI (v1.1.0). Deleted `website-v4` at Pratham's
instruction. Did **not** touch the live account: no budget, cap, campaign, or status was changed.

**Why the account choice reverses the July record:** the archived `ad-manager` workspace named
`act_1056790306735632` ("skeure-education") as "the account to use" and treated `961766249917785` as
legacy DegreeCraft. Live data says the opposite. `961766249917785` holds all 12 campaigns and the
entire ₹24,997.95 of lifetime spend; `1056790306735632` has never run a campaign. The account name
is stale branding left over from the rebrand, which is a cosmetic fix, not a reason to move accounts.
Pratham named this account independently and the data agrees with him.

**The finding that matters:** the campaign `DBU Online - 08/08/2026` has been switched on since
8 August with campaign, ad set, and ad all reporting `effective_status: ACTIVE` and a ₹1,000 daily
budget, and has delivered **zero** impressions and zero spend in twelve days. Cause identified
exactly: `spend_cap` (2499796) equals `amount_spent` (2499796) to the paisa, and the prepaid balance
is ₹0. Meta halts delivery in this state while leaving every object showing ACTIVE, so the Ads
Manager status column looks healthy. **Resuming delivery needs two changes, not one**: topping up the
prepaid balance will do nothing while the cap still equals the spend. Full detail and the supporting
queries are in `paid/BASELINE-2026-08-20.md`.

**The recommendation attached to it:** do not top up yet. The ₹24,998 already spent bought 795,370
impressions and 4,567 clicks against **no conversion tracking at all**. The account's only dataset
has never fired, there is no web pixel, no CAPI, and the site loads no analytics provider. None of
that spend can be traced to a lead, a counselling conversation, or an admission. Restarting spend
today buys more of the same unattributable traffic. Measurement first; the halt is an accident that
happens to be pointing the right way.

**Alternatives considered:** Switch to the `skeure-education`-named account for brand tidiness
(rejected; it is empty, so it would discard all delivery history, audience learning, and the working
WhatsApp destination setup, in exchange for a name that can be edited). Top the account up now to
restart the ACTIVE campaign (rejected on the measurement argument, and it is Pratham's money
decision either way). Rename the DegreeCraft account immediately (deferred; cosmetic, and belongs
with the wider rebrand sweep).

**Owner:** Pratham. Open and waiting on him: whether to raise or clear the spend cap and top up the
prepaid balance, and when. Also unread: why five June ads sit in `WITH_ISSUES`, and whether the
₹25,000 cap was set deliberately or applied automatically when the balance ran out.

## 2026-08-20 · LPU account analysed from exports; benchmark campaign and reallocation opportunity identified

**Decision:** Analysed the LPU personal ad account `act_278258370` from two Ads Manager exports
rather than via API. The role grant Pratham made cannot reach the system-user token (a personal ad
account cannot be assigned to a system user), and claiming the account into the business is one-way,
so exporting was the cheaper route for a one-time extraction. Full analysis in
`paid/LPU-ACCOUNT-ANALYSIS-2026-08-20.md`. Adopted `FB Ads - 01/07/2026` as the benchmark to
reverse-engineer for the Skeure account.

**Why it matters:** this is the only Skeure-adjacent account with a working conversion signal.
₹404,500 over three years producing 4,716 WhatsApp conversations at a blended ₹85.77, against the
DegreeCraft account's ₹24,998 with no conversion tracking at all. Sixteen times the spend and, unlike
DegreeCraft, attributable.

**The finding:** cost per conversation ranges ₹33.88 to ₹447.26, a 13x spread. 23% of spend produced
41% of conversations; 57% of spend produced 37%. At the best proven at-scale rate (₹48.82, from
`FB Ads - 01/07/2026`) the same money would have produced 8,264 conversations instead of 4,716.
The channel was never the problem. Budget was spread evenly across campaigns of wildly different
efficiency and the good ones were never scaled. CPM above ~₹35 or CTR below ~0.35% predicted an
expensive campaign every time, which gives a kill signal usable within days.

**Two things that change Skeure's assumptions.** First, 86% of spend went to 18-24 and 25-34, the
two least efficient age bands; 35-44 converts cheaper (₹95.68 vs ₹101) and clicks far more (0.491%
vs 0.310% CTR), on under 12% of budget. That points at working professionals and parents rather than
school leavers. Second, generic MBA-audience targeting was the worst segment on the account:
`SET2 - MBA` spent ₹23,376 at ₹256.87 per conversation, 4.3x the best ad set.

**Correction issued:** `BASELINE-2026-08-20.md` P2 originally read "campaign objectives do not match
the business goal." That was too strong. `OUTCOME_ENGAGEMENT` with a WhatsApp destination generated
all 4,716 conversations on the LPU account, so it is the working configuration for this funnel, not
an error. P2 was rewritten to the narrower and defensible claim: with no conversion tracking on the
DegreeCraft account, objective choice cannot be judged there either way.

**Alternatives considered:** Claim `act_278258370` into business `1593889128670416` so the CLI and
system-user token could query it directly (rejected; treated as one-way, moves billing, and buys
nothing beyond what the export already provides for a one-time analysis). Wait for a fresh session
to test whether the `meta-ads` MCP picks up the newly granted role (not rejected, just not blocking;
worth checking, but the export made it unnecessary for this analysis).

**Owner:** Pratham. Open: a re-export including the `Starts` column would allow a three-year
efficiency trend, which the current export cannot support. Creative itself is not in these files and
must come from Ads Manager or the API before the benchmark campaign can be rebuilt.

## 2026-08-20 · Installed 14 vetted marketing skills; `ctwa_clid` finding reordered the roadmap

**Decision:** Installed 14 MIT-licensed skills project-scoped at `.claude/skills/`, drawn from
`thatrebeccarae/claude-marketing` and `OpenClaudia/openclaudia-skills`. Rewrote the plan as
`ROADMAP.md`, moving WhatsApp attribution ahead of web measurement and ahead of any campaign rebuild.

**Why the reorder:** research found that Meta injects `ctwa_clid` and `source_id` into the webhook
`referral` object on every click-to-WhatsApp conversation, and that
`automation_stack/wacrm/src/app/api/whatsapp/webhook/route.ts` already receives and reads that
object. Line 111 types it as only `{headline, body, source_url}`, so the identifiers are dropped at
the type boundary; lines 988-999 use the survivors to render a display banner. The data needed to
connect ad spend to admissions arrives on every ad-sourced conversation and is discarded. That makes
attribution a contained change to an existing handler rather than a system to design, and it is
worth more than anything else queued because WhatsApp, not the website, is where leads actually
enter.

**Why project-scoped rather than global:** the 2026-08-15 reset recorded ECC's ~49K-token catalog
being injected into every session for zero invocations. Fourteen more skills at user scope would
repeat that mistake. At `skeure-growth/.claude/skills/` they load only for this work.

**Vetting performed:** both repos cloned to scratch and audited before anything was copied. No npm
lifecycle scripts, no executables, MIT throughout, star-to-fork ratios normal (no repeat of the
`graphify` anomaly flagged 2026-08-03). Only markdown plus two reviewed files were copied.
`gsc-portfolio-audit/scripts/audit_gsc.py` reads 191 lines and calls only `googleapis.com` and
`oauth2.googleapis.com` under `webmasters.readonly`. `meta-ads-audit/.env.example` contains no
secrets. Neither `npx openclaudia install --all` nor the repo's Python setup wizards were run, which
follows the precedent set with Emil Kowalski's skills on 2026-08-12: the payload is markdown, so
there is no reason to introduce an unvetted CLI to move it.

**Deliberately not installed:** `keyword-research` (openclaudia) depends on SemRush, Ahrefs,
DataForSEO or SerpAPI keys, none of which exist here, so it would be inert while still costing
description tokens. Every third-party Meta Ads MCP found was rejected: `pipeboard-co` is hosted and
would proxy ad data through a third party, and the rest duplicate the official connector already
wired, adding a second credential path to audit for no new capability. `cognyai` was rejected
because its paid tier routes Search Console data through their service, a poor first move while GSC
access is still unresolved.

**Note on naming:** "Paid Media Pack" refers to paid advertising as a channel category, not to a
price. The repo is free and MIT. Its `facebook-ads` and openclaudia's `facebook-ads` turned out to be
complementary rather than duplicates, one an auditor and one a builder, so both were installed as
`meta-ads-audit` and `meta-ads-builder` to resolve the name collision.

**Owner:** Pratham. Open: step 1.1 of the roadmap, logging the raw `referral` payload to confirm
`ctwa_clid` actually arrives on this WABA, is the next action and needs no approval since it is
read-only.

## 2026-08-20 · Phase 1.1 probe shipped; four exports analysed; two earlier readings corrected

**Decision:** Added the `ctwa_clid` probe to the Kuanli webhook handler (Phase 1.1) and analysed the
four new Ads Manager exports. Findings in `paid/LPU-ANALYSIS-ADDENDUM-2026-08-20.md`.

**The probe:** one `console.log` inside the existing `if (message.referral)` block in
`automation_stack/wacrm/src/app/api/whatsapp/webhook/route.ts`, dumping `Object.keys()` and the full
JSON of the referral object. It works because TypeScript types are erased at runtime: the interface
declares only `headline`/`body`/`source_url`, but whatever else Meta sends is still on the object.
Logs ad metadata only, no message body and no phone number. Typecheck passes. Left **unstaged**; an
unrelated null-safety fix to `processMessage` was already staged in that file by someone else and was
deliberately not disturbed. Marked TEMPORARY in a comment, to be removed once the fields are
confirmed and persisted properly.

**Correction 1, WhatsApp Status.** The first analysis dismissed an "Unknown" demographic row (716
conversations at ₹4.36) as a breakdown artifact. It was not. It is **WhatsApp Status placement**,
where age and gender are unresolvable: ₹4,768 of spend, 1.2% of budget, producing **809
conversations at ₹5.89**, which is 17% of every conversation on the account at 15x better cost than
anything else. Wrongly discarded, now the top recommendation. The caveat is that ₹4,768 is a small
base and Status inventory is limited, so it needs a ceiling-finding test rather than a big
reallocation.

**Correction 2, the trend.** The first analysis framed the 13x cost spread as budget spread evenly
across campaigns of differing quality, which read as uniform carelessness. The monthly view shows a
**learning curve** instead: late 2025 ran at ₹150-190 per conversation, mid-2026 runs at ₹43-73. The
account has got 3-4x better. August 2026 was its largest spend month ever (₹54,988) at a healthy
₹72.74, so it was scaling into its best period when it hit the spend cap. The framing should be
"scale what July proved", not "stop wasting money".

**Other findings:** two creatives carry the account, `Ad 4` and `A10`, both in `FB Ads - 01/07/2026`,
together 32% of all conversations on 15% of spend, and winning by different mechanisms (A10 takes a
1.028% CTR, more than double anything else; Ad 4 has a middling CTR but converts far better). Feed is
the largest spend on the account (₹174,068, 43%) and converts worst of the major placements despite
the second-best CTR. Region data returned spend but **no conversations**, so the earlier read that
Punjab-named campaigns outperformed remains inference from campaign naming, not proven.

**Measurement gap confirmed:** `Messaging conversations replied` totals 10 against 4,716 started,
across 4 of 548 rows. That is Meta not populating the field, not an operational failure, and it must
not be read as "nobody answers". Consequence: the `Reply Rate` and `Cost per Replied Chat` custom
metrics are dead on this account, exactly the risk flagged in `NEXT-EXPORTS.md` before the export ran.
It also strengthens the Phase 1 case, since the only way to learn whether a conversation went
anywhere is to own that data in Kuanli.

**Owner:** Pratham. Next: the probe needs one ad-sourced inbound WhatsApp message to fire before
`ctwa_clid` can be confirmed, which requires either live traffic or the spend cap being lifted.

## 2026-08-20 · Kuanli attribution handoff prompt written

**Decision:** Wrote `measurement/PROMPT-kuanli-ctwa-capture.md`, a pasteable implementation brief for
Phase 1 steps 1.2 and 1.3, to be run in a session started in `/home/user/automation_stack`. Storage
design is last-touch columns on `conversations` (`ctwa_clid`, `ad_source_id`, `ad_source_type`,
`ad_headline`, `ad_source_url`, `ad_referral_at`) via migration `061_ctwa_attribution.sql`.

**Why last-touch and no history table:** a contact who clicks a second ad has genuinely re-entered
from that ad, and CAPI needs the click that led to the conversion, so the latest value is the correct
one. A history table would be speculative structure for a question nobody has asked yet, which the
global guidelines rule out.

**Why CAPI is excluded from the prompt:** capture and persistence are verifiable on their own and
carry no outbound side effects. Firing conversion events to Meta does, and deserves its own review
rather than riding along in a schema change.

**Two hazards written into the prompt explicitly:** the webhook file carries an unrelated staged
null-safety fix to `processMessage` that must not be reverted or squashed, and the temporary
`ctwa-probe` console.log must be removed in the same commit that lands persistence.

**Owner:** Pratham. Phase 1.1 is blocked on traffic rather than on work, since the probe only fires
when someone clicks a click-to-WhatsApp ad and delivery is halted by the spend cap. 1.2 and 1.3 can
proceed anyway using Meta's documented field names, with the probe confirming them when spend
resumes.

## 2026-08-20 · Phase 1.2/1.3 implemented and reviewed; migration ordering is the one blocker

**Decision:** Phase 1.2 and 1.3 were implemented in `automation_stack` from the handoff prompt.
Reviewed here rather than via a spawned `dev-team` run, applying the same four lenses inline.
**Verdict: accept, with one blocking item before deploy.**

**What was built:** the `referral` interface widened to all ten CTWA fields; migration
`061_ctwa_attribution.sql` adding six nullable columns to `conversations` with two partial indexes;
`persistAdReferral()` writing them via `supabaseAdmin()`; and the `Conversation` type updated.

**Quality is high.** The migration documents its rollback, explains why the columns are nullable
(NULL means organic, a real and useful distinction), and uses partial indexes so the index stays
proportional to paid traffic rather than the whole table. `persistAdReferral` logs on failure rather
than throwing, so a broken attribution write can never drop a customer message, which is the right
priority. It is called only from `processMessage`, not from the `smb_message_echoes` path, so an echo
cannot overwrite a real referral. No PII is logged; the only identifier in the log line is a
conversation UUID. Typecheck, lint, and 590 tests across 48 files all pass. CAPI was correctly left
out of scope.

**It also corrected an error in my prompt.** I stated RLS on `conversations` was `auth.uid() =
user_id` from migration 001. Migration 017 superseded that with `is_account_member(account_id)`. The
implementer verified against the actual schema instead of trusting the brief, and documented it.

**BLOCKING: migration ordering.** Verified directly against the running database: the six columns do
not exist in `supabase.public.conversations`. Migration `061` has not been applied even locally, and
the file is still untracked. The handler writes to those columns unconditionally. If the code ships
before the migration runs, every ad-sourced conversation takes the error path, logs, and silently
loses its attribution, which is precisely the failure this work exists to eliminate. **Run the
migration first, then deploy the code.** Never the reverse.

**Non-blocking, worth fixing:** `persistAdReferral` has no test coverage. The repo convention is a
colocated `*.test.ts` and 590 tests exist, none touching this function. It is production code writing
to the database on an untested path. Also, the temporary `ctwa-probe` log at line 1025 is still
present; the prompt was contradictory about it, saying both "keep until confirmed by a real log line"
and "remove in the same commit". Keeping it is the right call for now, since it is the only thing
that would reveal a field Meta sends that the mapping misses, but it should come out once the first
real referral lands.

**Sharp edge, intentional:** last-touch overwrites all six columns together, so a second click on an
ad with no headline nulls a previously captured `ad_headline`. That follows from the documented
semantics and is correct for CAPI, but it means partial loss on re-click.

**Owner:** Pratham. Nothing was deployed and no migration was run.

## 2026-08-20 · Phase 1 capture is LIVE in production

**Decision:** With Pratham's explicit approval, applied migration `061_ctwa_attribution.sql` to the
production Supabase database and deployed the capture code, in that order. Phase 1 steps 1.2 and 1.3
are now live.

**Why it could not wait:** the personal LPU account `act_278258370` is delivering right now and its
ads point at the same WhatsApp number Kuanli serves, so ad-sourced conversations were arriving and
losing their `ctwa_clid` permanently. Meta sends that field only on the first message of a
conversation and there is no backfill, so every hour of delay was unrecoverable data. This also
corrected an earlier error in this log: Phase 1.1 was described as blocked on the DegreeCraft spend
cap. It never was. That cap is on a different account.

**Verified at each step, not assumed:** six columns and two partial indexes present on
`supabase.public.conversations`; PostgREST logged "Received a schema cache reload message" and
reloaded at 11:08:27 UTC, so the exact failure that dropped 72 minutes of messages on 2026-08-19 was
avoided by the event triggers migration 053 installed; an authenticated REST probe selecting
`ctwa_clid,ad_source_id` returns HTTP 200; the rebuilt image contains the new code while the
previously running container contained none of it, confirming the restart was actually necessary and
actually took effect; wacrm restarted clean in 144ms with no errors.

**The finding that made onboarding the LPU ad account optional:** attribution does not need API
access to that account at all. Meta's webhook carries `source_id`, which is the ad ID, so capture
works regardless of ownership. Ad IDs resolve to names locally from
`paid/lpu-export/Ad-Level-Named.csv`, which holds all **206 ad IDs** mapped to ad name and campaign
name. Onboarding is a convenience for refreshing that mapping automatically, not a prerequisite.

**Still open on that account:** it is Pratham's oldest, holds three years and ₹4 lakh of history, is
currently generating the leads, and sits under a personal Facebook profile with no business behind
it. If that profile is ever restricted or lost, the account and its history go with it and there is
no recovery path. Claiming it into business `1593889128670416` fixes that permanently but is one-way
and moves billing. Recommendation on record: claim it, but only after Phase 1 has been capturing for
long enough to trust, never while it is the sole source of measurable leads.

**Owner:** Pratham. Next: watch for the first captured referral, then remove the temporary
`ctwa-probe` log, add test coverage for `persistAdReferral`, and start Phase 1.4 (CAPI).
