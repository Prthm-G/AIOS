# Handoff prompt · unblock CAPI delivery (error #270)

Start a **fresh** session in `/home/user/workspaces/AIOS` — that is where the `meta-ads` and
`meta-devtools` MCP servers are registered, and MCP tools only load at session start:

```bash
cd /home/user/workspaces/AIOS && claude
```

Status: **RUN AND RESOLVED 2026-08-21.** The diagnosis below was WRONG. #270 is not an app
access-level problem and needs no App Review. Root cause was the token stored in Kuanli's
`whatsapp_config` for WABA 106777392057661 missing the `whatsapp_business_manage_events` scope.
A second, independent blocker was found behind it: `event_name: "Lead"` is not a valid event for
`action_source: business_messaging`. See `decisions/log.md` 2026-08-21 for the proof and the fix.
Everything below is kept as the historical brief; do not act on its conclusions.

Everything below was verified live on 2026-08-21 from the automation_stack side; nothing is
assumed. Paste the block as the first message.

---

```
Unblock Meta Conversions API delivery for Skeure's WhatsApp bot. One error stands
between 39 captured ad conversions and Meta's ad optimiser, and it is a Meta app
access level, not code.

## Verified state — do not re-derive, spot-check at most

- Kuanli fires CAPI events per WABA (Phase 1.4 of
  projects/skeure-education/skeure-growth/ROADMAP.md, built 2026-08-21 in
  /home/user/automation_stack, commit 0232de3). The dataset is ALREADY MINTED:
  dataset 1049749924574681 on WABA 106777392057661, cached in Kuanli's
  whatsapp_config. Do not mint anything.
- The events POST is refused with exactly:
  "(#270) This Ads API request is not allowed for apps with development access
  level ... Make sure that the access token belongs to a user that is both admin
  of the app and admin of the ad account."
- The calling token is the WhatsApp SYSTEM-USER token of the Auretris app
  (META_APP_ID in /home/user/automation_stack/.env — read it, never print the
  secrets beside it).
- #270's dev-mode escape hatch (token user admin of app AND ad account) is
  IMPOSSIBLE here: the delivering ad account act_278258370 is a PERSONAL account
  under a different Facebook identity (probed live: #200 "owner has NOT grant
  ads_management or ads_read"). Personal ad accounts cannot hold system users.
  Therefore the fix is the APP's Ads API access level, not asset assignment.
- 39 Lead events sit failed-RETRYABLE in Kuanli; a cron redelivers every 15
  minutes the moment the block clears. Their event_time is 2026-08-20/21, and
  Meta refuses events older than 7 days: **anything not delivered by ~Aug 27 is
  lost permanently.** That deadline drives this task.

## Read first, in order

1. projects/skeure-education/skeure-growth/SETUP-META-CONNECTORS.md — the three
   Meta identities, the identity trap, and the already-probed facts about
   act_278258370 (bottom section).
2. projects/skeure-education/skeure-growth/decisions/log.md — why claiming
   act_278258370 is DEFERRED (sole source of measurable leads; one-way; moves
   billing). That decision stands.
3. projects/skeure-education/skeure-growth/ROADMAP.md Phase 5 — the target end
   state, in order.

## The task

1. With meta-devtools (signed in as the AURETRIS developer identity):
   devtools_app / devtools_app_list — read the Auretris app's mode and its
   access level for the Marketing API / ads_management. Report what Standard
   vs Advanced access it holds today.
2. Determine the minimal change that clears #270 for
   POST /{dataset_id}/events with action_source=business_messaging. Verify
   against Meta's current documentation with a live check, not memory — this
   machine's rule. Expected shape: app to Live mode + Standard Access, possibly
   Advanced Access via App Review for ads_management. If review is needed, use
   devtools_app_review to file/track it: use case is "server-side Conversions
   API events for our own click-to-WhatsApp campaigns" — first-party data,
   no third parties.
3. Everything that needs a human click in Business Manager / App Dashboard:
   give Pratham exact numbered steps, one screen per step, and wait for his
   confirmation before depending on them.
4. With meta-ads (ads identity, business 1593889128670416): confirm nothing in
   that portfolio needs to change for this — the CAPI path does not run through
   it. If Meta's rules turn out to REQUIRE an ad-account bind for
   business_messaging events, say so explicitly and present options; do not
   improvise one.
5. When Meta-side changes are made, verify end to end from the other repo:
     cd /home/user/automation_stack && node devtools/sweep-meta-conversions.mjs
   then --status. Success = tally shows "sent" and Events Manager shows Lead
   events on dataset 1049749924574681.
6. Record the outcome: update the status lines in SETUP-META-CONNECTORS.md and
   append the decision + evidence to decisions/log.md.

## Hard boundaries

- Do NOT claim act_278258370 into any business. Deferred by recorded decision.
- Do NOT touch n8n workflows, Kuanli code, or migrations — the delivery side is
  finished and green; this task is Meta-side only.
- Do NOT create new apps, tokens, or datasets. Everything needed exists.
- Never print tokens or secrets; reference env var names only.
- If App Review turns out to take days, say so plainly and give Pratham the
  expiry math for the queued events rather than waiting silently.
```
