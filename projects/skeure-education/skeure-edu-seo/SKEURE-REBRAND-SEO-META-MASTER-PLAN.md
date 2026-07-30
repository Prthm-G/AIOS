# Skeure Education rebrand, Auretris, SEO, and Meta master plan

**Created:** 28 July 2026  
**Programme window:** 28 July–30 September 2026  
**Execution prompt:** `GPT-5.6-SKEURE-EXECUTION-PROMPT.md`  
**Primary objective:** Establish one coherent Skeure Education brand and an
attributable acquisition path from search/Meta to counselling, application,
and admission without breaking the live WhatsApp/CRM system.

## Executive decisions

1. **Rebrand the existing DegreeCraft Facebook Page and Instagram account by
   default; do not create new accounts by default.** This is the same education
   counselling business and the existing assets may preserve followers, history,
   and trust. The recommendation is conditional on a read-only audit confirming
   full control, healthy account quality, relevant followers, and safe ownership.
2. **Keep Auretris and Kuanli as internal system names.** Replace DegreeCraft
   only on customer-facing runtime surfaces with `Skeure Education`.
3. **Disable LPU Distance/ODL, not all of LPU.** Implement a reversible gate in
   `Auretris - Main-test`, covering the agent, FAQ route, and brochure route.
   LPU Online must continue to work when the requested programme is eligible.
4. **Do not run LPU Distance ads while the chatbot option is disabled.** An LPU
   campaign can promote an evidence-approved LPU Online programme only.
5. **Do not launch Meta ads until the lead path is attributable and the exact
   programme claims are verified.** DBU, Amity, and LPU are separate evidence
   gates, not one blanket approval.
6. **Start SEO with authentication and measurement, not page volume.** OpenSEO
   is installed but not authenticated; GSC connection is unproven. The existing
   SEO workspace already has the right evidence-first structure.
7. **Treat current documentation as useful but partially stale.** Live-site
   observations, current Git HEAD, the programme ledger, Meta dashboards, and
   current n8n workflow state must be reconciled before implementation.

## Evidence snapshot

| Area | Observed 28 July 2026 | Consequence |
|---|---|---|
| Website | Live site and target university routes return 200; sitemap includes DBU; Skeure branding is visible | Website is usable, but claims and conversion readiness still need a campaign-specific gate |
| DegreeCraft on website | Active source has a legacy Instagram URL in `src/data/site.ts`; it is omitted from UI/schema. Other production-source hits are comments | Replace only after the social account is successfully rebranded; do not globally replace migration history |
| Website status records | README, keyword map, content strategy, audit, and decision log disagree about deploy/DBU/current state | Reconcile with dated corrections before relying on status labels |
| SEO data | OpenSEO skills installed; both OpenSEO clients need OAuth; GSC connection is not proven | First SEO action is authentication + baseline, not speculative keyword work |
| Auretris | Architecture identifies active/test workflows and hardcoded university branches; live prompt/node state was not inspected in this planning pass | First implementation action must be a read-only n8n audit |
| LPU | User asked to disable LPU Distance; local brochure/data surfaces contain LPU and LPU Distance concepts | Scope the gate by mode and test LPU Online separately |
| Amity | Page contains extensive programme and placement content, with evidence caveats | Verify exact advertised programme/session and use conservative copy |
| DBU | Current site publishes DBU based on an official 2025-26 brochure; independent UGC-DEB confirmation remains pending in the ledger | No DBU ad launch until the advertised programme record is independently verified |
| Meta | No authenticated dashboard audit was performed because this deliverable is the planning phase | Asset-health and rebrand decisions remain conditional |

## Target architecture

```text
Meta / Organic Search
        |
        v
Verified university or paid landing page
        |
        +--> Website lead form --------+
        |                              |
        +--> Click to WhatsApp         |
                                       v
                              Kuanli source attribution
                                       |
                                       v
                          Auretris eligibility + reply gate
                                       |
                                       v
             Lead -> Qualified -> Application Started -> Enrolled
                                       |
                                       v
                       GA4/GSC/Meta reporting without PII
```

One source taxonomy must survive the entire route: channel, campaign, ad set,
ad/creative, landing page, university, programme, and mode.

## Workstreams and owners

| Workstream | Source of truth | Main outputs |
|---|---|---|
| Auretris/Kuanli | approved n8n interface, wacrm code, architecture document | runtime brand manifest, LPU Distance gate, regression evidence |
| Website | `/home/user/workspaces/AIOS/website-build` + live crawl | verified destinations, social identity, attribution-ready lead paths |
| SEO | `/home/user/workspaces/AIOS/skeure-edu-seo`, OpenSEO, GSC | baseline, keyword/URL map, content priorities, migration controls |
| Meta social | Facebook/Instagram/Business dashboards | redacted inventory, retain/rebrand decision, approved transition |
| Meta developer/WhatsApp | Meta Developers, WhatsApp Manager, wacrm/n8n boundary | webhook/config health report; no secret values |
| Paid acquisition | Ads Manager, Events Manager, Kuanli outcomes | paused drafts, bounded launch, qualified-lead/admission reporting |

## Phase plan

### Phase 0 — current-state audit and reconciliation

**Duration:** 1–2 focused sessions  
**Risk:** read-only

Actions:

1. Snapshot Git status and current commits in all three workspaces.
2. Inspect the live Auretris and test workflows through an approved interface.
3. Inventory customer-facing `DegreeCraft` and LPU Distance decision points.
4. Use the authenticated browser only for read-only Meta asset discovery. The
   user completes login and 2FA; credentials are never requested or recorded.
5. Audit Business Portfolio, Facebook Page, Instagram, ad account, datasets,
   domains, Events Manager, developer app, WABA, phone quality, webhook status,
   permissions, and restrictions.
6. Crawl the live website and compare it with Git HEAD.
7. Run the SEO bridge doctor and record OpenSEO/GSC status.
8. Add current-state corrections to stale records without erasing historic facts.

Exit gate:

- one redacted inventory;
- one authoritative list of active DegreeCraft surfaces;
- exact LPU Distance paths identified;
- website/live/document drift explained;
- Meta and OpenSEO authentication blockers known.

### Phase 1 — brand and social decision packet

**Duration:** 1 session  
**Risk:** planning only

Create a rebrand manifest for:

- Auretris persona, greetings, fallbacks, FAQ/brochure text;
- WhatsApp Business display name and description;
- Facebook Page name, username, About, cover, CTA, NAP, and connected assets;
- Instagram name, username, bio, profile image, link, and connected Page;
- website social URL and `sameAs`;
- templates and ad identity;
- documentation where DegreeCraft is active identity versus legacy evidence.

Social account decision rule:

| Audit result | Decision |
|---|---|
| Full control, healthy Page/account, relevant followers, same business | Rebrand existing assets |
| Duplicate Pages representing the same business | Pick one canonical Page; consider merge only after backup and separate irreversible-action approval |
| Wrong ownership or inaccessible asset | Attempt recovery/release first; create new only if recovery fails |
| Material restrictions or predominantly irrelevant/fake audience | Create clean Skeure assets and retain/close the legacy asset only through an approved transition |

Meta states that a Facebook Page name and username are changed separately, and
Instagram username changes can be reviewed and may notify followers. A Page
merge is conditional and irreversible; the source Page's posts, photos, reviews,
ratings, and username can be deleted. Therefore, rename is the preferred path and
merge is not part of the default plan.

External references:

- https://www.facebook.com/help/271607792873806
- https://www.facebook.com/help/583107688369069
- https://www.facebook.com/help/249601088403018
- https://www.facebook.com/help/519912414718764

Exit gate: user approves each intended social mutation and its rollback/transition
copy. No mutation is bundled with the audit.

### Phase 2 — Auretris rebrand and LPU Distance test gate

**Duration:** 1–2 sessions  
**Risk:** R3 for the inactive test workflow; R4 for production promotion

Implementation design:

1. Add one explicit availability rule for university + mode. Do not scatter the
   LPU Distance block across unrelated prompt paragraphs.
2. Block LPU Distance at the main agent, FAQ tool, and brochure tool.
3. Keep all data and files in place so rollback is a flag/config change.
4. Ask a clarifying question when a lead says only `LPU`; distinguish Online
   from Distance before routing.
5. For an LPU Distance request, explain that Skeure is temporarily not handling
   that option, offer a human counselor and evidence-approved alternatives, and
   never claim LPU itself has stopped the programme.
6. Replace customer-facing DegreeCraft identity with Skeure Education.
7. Preserve workflow IDs, database/schema contracts, pipeline stages, manual
   takeover, and the exact structured output.

Regression matrix:

- LPU Distance, LPU ODL, spelling variants, and mode ambiguity;
- LPU Online MBA and other eligible online requests;
- Amity and DBU unaffected;
- FAQ and brochure tool allow/deny paths;
- text and transcribed voice;
- new and existing conversations;
- bot and manual mode;
- structured output and pipeline-stage behavior;
- zero customer-facing DegreeCraft strings.

Production gate: show the test evidence and exact workflow diff, then wait for
`APPROVE R4 EXECUTION: <task-id>` before editing `Auretris - Main`.

Rollback: restore the workflow snapshot or flip the availability rule; do not
restore the DegreeCraft customer identity unless the rebrand itself is rolled
back by an explicit business decision.

### Phase 3 — complete the Skeure entity and start SEO

**Duration:** 2–5 sessions, then weekly cadence

Actions in order:

1. Reconcile SEO records with the current live site and Git HEAD.
2. After Meta rename approval/success, update `site.ts`, visible social links,
   and `sameAs`; remove obsolete source comments.
3. Authenticate OpenSEO for the chosen client(s) and prove access with read-only
   identity/project calls.
4. Connect/verify GSC for `skeure.com` and `degreecraft.com`.
5. Pull the first-party baseline before paid or content expansion.
6. Run competitive landscape, focused keyword research, clustering, and
   keyword-to-URL decisions.
7. Prioritize high-intent pages supported by verified programme evidence:
   programme hubs, validity/trust guides, comparison pages, and the Punjab page.
8. Keep DegreeCraft redirects in planning until destinations, GSC, tests,
   rollback, and explicit migration approvals pass.
9. Add AI-citation readiness only to verified pages: direct answers, primary
   sources, dates, human reviewers, disclosures, and accurate schema.

SEO success measures:

- clean indexed URLs;
- non-brand GSC clicks/impressions for approved queries;
- attributable organic leads;
- qualified-lead, application, and admission rates;
- evidence freshness;
- no unsupported public claims;
- no cannibalizing page proliferation.

### Phase 4 — paid landing pages and measurement

**Duration:** 2–4 sessions

Before implementation, obtain:

- budget and test duration;
- target cost per qualified lead/admission;
- commission/economic value and seat/intake constraints per programme;
- exact DBU, Amity, and LPU Online programmes;
- geography, language, lead-owner, and response SLA.

Destination approach:

- Reuse a verified university/programme page when it meets paid-conversion
  needs, or build a noindex paid landing page to avoid SEO cannibalization.
- Every destination needs matching ad/page claims, commercial disclosure,
  consent, mobile QA, fast WhatsApp/form actions, and a current reviewer/date.
- Keep university brand assets within permitted usage and avoid implying that
  Skeure is the degree-awarding institution.

Measurement implementation:

- define canonical campaign/UTM naming;
- persist UTMs and click ID with consent;
- send source, university, programme, mode, and landing page into Kuanli;
- keep PII out of analytics and logs;
- validate Pixel/dataset and CAPI only after Meta audit;
- deduplicate browser/server events;
- map Kuanli stages to qualified lead, application started, and enrolled;
- use test events and synthetic leads before production;
- document timezone, currency, attribution window, and conversion definition.

Exit gate: one synthetic lead can be traced from ad/URL through the destination,
Kuanli, Auretris, and the selected measurement platforms without exposing PII.

### Phase 5 — Meta campaign drafts

**Duration:** 1–2 sessions

Create paused drafts first. Do not rely on remembered Ads Manager labels; use the
options currently shown in the account.

Default controlled test if conversion definition and economics are comparable:

```text
Campaign: Skeure | Punjab | Qualified Leads | Test 01
  Ad set: DBU | approved programme
  Ad set: Amity | approved programme
  Ad set: LPU Online | approved programme
```

- Equal ad-set test budgets during the comparison window.
- 2–3 distinct creatives per university: clarity/trust, working-professional
  convenience, and counselling/help. Every claim must have an evidence ID.
- Adults eligible for the approved programme in the approved Punjab/nearby
  geography and language set.
- Click-to-WhatsApp only after Auretris passes regression.
- Website lead optimization only after end-to-end attribution passes.
- No LPU Distance, generic `LPU` ambiguity, financing-rate claim, unverified
  ranking, salary promise, guaranteed admission/job, or false urgency.
- Remarketing waits for consent and sufficient traffic.

Use separate campaigns if universities have different economics, objectives,
conversion locations, geographies, or intake dates.

Each launch packet must state:

- exact names and destinations;
- objective/conversion event;
- audience/exclusions and placements;
- creative/copy/evidence IDs;
- UTMs;
- start/end date;
- daily and total cap;
- target qualified-lead CPA;
- review/lag window;
- pause and rollback rules;
- maximum financial exposure.

Exit gate: user approves the exact named drafts and financial exposure. The
campaigns remain paused until then.

### Phase 6 — bounded launch and optimization

**Duration:** initial 7–14 day controlled test, then evidence-led iteration

Monitor:

- delivery, spend, rejections, account quality, event diagnostics;
- WhatsApp/form delivery and counselor SLA;
- platform lead, Kuanli-qualified lead, application, and admission counts;
- CPA at each level;
- creative/audience frequency and fatigue;
- drop-off between click, lead, qualified, application, and admission.

Rules:

- Check attribution lag and tracking before declaring zero-conversion spend
  waste.
- Do not claim causality or incrementality from aggregate Ads Manager results.
- Do not scale on CTR alone.
- Compare university economics only with aligned conversion definitions,
  date range, timezone, currency, and attribution.
- Any material budget increase requires a fresh approval.

## Programme-specific ad readiness

| University | Current planning status | Launch requirement |
|---|---|---|
| LPU Distance/ODL | Explicitly disabled in the chatbot programme | Not eligible for ads until the user reverses the business decision and the bot/evidence gates pass |
| LPU Online | Partially evidenced; Online MBA has the strongest recorded approval | Start with one exact verified Online programme; clarify mode in every ad and destination |
| Amity Online | Extensive content with stale/unverified fields and high-risk placement claims | Re-verify exact programme/session/fees; use conservative ad copy without unverified ranking/salary claims |
| DBU Online | Official 2025-26 brochure exists, independent UGC-DEB confirmation pending | Independently verify exact programme/mode/session before any ad launch |

## Approval map

| Action | Gate |
|---|---|
| Read local files, live public site, and authenticated dashboards without changing state | Allowed read-only |
| Edit inactive Auretris test workflow | R3 plan/change packet; use approved interface |
| Edit active Auretris workflow or related production behavior | Exact R4 approval phrase from automation contract |
| Database/schema/data, auth, Docker/infrastructure, deployment | R4, and R5 when destructive/difficult to recover |
| Website local code/content | Scoped implementation approval; frontend skill and tests |
| Website deployment, redirects, DNS, GSC Change of Address | Separate explicit approval |
| Facebook/Instagram/Meta developer/WhatsApp mutation | Itemized explicit approval immediately before action |
| Merge/delete Page or irreversible asset action | Separate destructive-action approval |
| Create/enable campaign or spend money | Exact campaign/budget/date approval |
| Increase budget materially | New approval |

## Definition of done

The programme is complete when:

- no customer-facing Auretris response uses DegreeCraft;
- LPU Distance is blocked reversibly across recommendation, FAQ, and brochure
  paths while LPU Online remains correctly scoped;
- the production workflow passed test-workflow regression and approved promotion;
- Facebook and Instagram use the approved Skeure Education identity, or a
  documented audit justifies clean new assets;
- the Meta developer/WhatsApp connection is healthy and documented without
  secrets;
- website social identity and schema reference verified Skeure accounts;
- SEO records match live state; OpenSEO/GSC baselines are real, not inferred;
- paid destinations and claims pass programme evidence, legal, consent,
  attribution, mobile, and CRM gates;
- DBU, Amity, and eligible LPU Online campaigns are approved bounded tests with
  known financial exposure;
- results are reported from click through qualified lead, application, and
  admission, with platform attribution clearly labelled;
- rollback exists for every live change.

## Immediate next action

Run Phase 0 only: a read-only n8n + Meta + live-site + SEO-state audit. The first
blocking human interaction should be Facebook/Meta login or 2FA in the browser,
not a request for credentials. No rebrand mutation, workflow edit, deployment,
campaign creation, or spend belongs in that audit.

