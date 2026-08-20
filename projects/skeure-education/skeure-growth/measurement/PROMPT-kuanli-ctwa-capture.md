# Handoff prompt · capture `ctwa_clid` in Kuanli

Paste the block below into a fresh Claude Code session started in `/home/user/automation_stack`.
This is Phase 1 steps 1.2 and 1.3 of `../ROADMAP.md`. CAPI firing (1.4) is deliberately **not** in
this task.

Status: **not yet run.** Update this line when it is.

---

```
Implement Click-to-WhatsApp ad attribution capture in Kuanli.

## Why

Meta injects a click identifier `ctwa_clid` plus `source_id` (the ad ID) into the WhatsApp webhook
`referral` object on the first inbound message of every Click-to-WhatsApp conversation. Kuanli
already receives this object and already reads it, but only uses `headline`, `body`, and
`source_url` to render a display banner. The identifiers are discarded.

Without them, ad spend cannot be connected to admissions. With them, an admission in Kuanli can be
traced to the exact campaign, ad set, and ad that paid for it. Skeure has spent over ₹4 lakh on
click-to-WhatsApp ads with zero attributable outcomes, so this is the highest-value change in the
system right now.

## Read first

- `wacrm/src/app/api/whatsapp/webhook/route.ts`
  - line ~111: the `referral` type declaration on the `WhatsAppMessage` interface
  - line ~991: the `>>> INJECT THE FACEBOOK AD CONTEXT <<<` block that consumes it
  - line ~1022: `findOrCreateContact`, called from lines ~438 and ~668
- `wacrm/supabase/migrations/001_initial_schema.sql` for the `contacts`, `conversations`, and
  `messages` tables. Note every table has RLS enabled with an `auth.uid() = user_id` policy.
- `docs/architecture/AURETRIS_KUANLI_ARCHITECTURE.md` before touching anything structural.

## IMPORTANT before you edit

`wacrm/src/app/api/whatsapp/webhook/route.ts` has an **unrelated staged change** (a null-safety fix
to `processMessage` making `contact` and `contact.profile` optional). Do not revert, restage, or
squash it. Leave it exactly as it is and add your work alongside.

The same file also has an **unstaged temporary probe** added 2026-08-20: a `console.log` labelled
`[webhook] ctwa-probe referral keys:` inside the referral block. Keep it until you have confirmed
from a real log line which fields Meta sends on this WABA. Remove it in the same commit that lands
the persistence, and say so in the commit message.

## What to build

1. **Widen the type.** Extend the `referral` declaration to include every field Meta documents for
   click-to-WhatsApp: `source_id`, `source_type`, `ctwa_clid`, `image_url`, `video_url`, alongside
   the existing `headline`, `body`, `source_url`. All optional. Do not change the banner behaviour.

2. **Migration `061_ctwa_attribution.sql`.** Follow the numbering and style of the existing
   migrations. Add to `conversations`:
   - `ctwa_clid TEXT`
   - `ad_source_id TEXT`
   - `ad_source_type TEXT`
   - `ad_headline TEXT`
   - `ad_source_url TEXT`
   - `ad_referral_at TIMESTAMPTZ`

   Index `ad_source_id` and `ctwa_clid`. Preserve the existing RLS posture: do not add a policy that
   widens access, and do not disable RLS. Use `IF NOT EXISTS` guards to match the file's conventions.

   Store last-touch: overwrite on a new referral rather than keeping history. A contact who clicks a
   second ad has genuinely re-entered from that ad, and CAPI needs the click that led to the
   conversion. Do not build a history table for this task.

3. **Persist on inbound.** In the referral block, write the fields onto the conversation row. Set
   `ad_referral_at` to now. Keep this on the same path that already handles the message so no new
   round trip is introduced where one is avoidable.

4. **Type updates.** Add the new fields to the `Conversation` interface in `wacrm/src/types/index.ts`
   so nothing reaches them through an `as any` cast.

## Hard constraints

- **Do not fire Conversions API events in this task.** Capture and persist only. CAPI is the next
  task and needs its own review.
- **Do not log message bodies, phone numbers, or contact names.** Ad metadata only.
- **Do not touch the n8n workflows.** `Auretris - Main` is production.
- **No secrets in code, logs, or commits.** Reference by env-var name only.
- Match the surrounding style. Do not refactor adjacent code, reformat, or "improve" anything you
  were not asked to change.
- Do not deploy. Do not run migrations against production. Leave the migration file for review.

## Verify before reporting

```bash
cd wacrm
npm run typecheck
npm run lint
npm run test
```

Then show me:
- the full diff of every file you changed
- the migration SQL in full
- a worked example of the exact row that would be written for a sample referral payload

## Definition of done

A click-to-WhatsApp conversation lands in Kuanli with `ctwa_clid` and `ad_source_id` stored on its
conversation row, typecheck and lint and tests all pass, the temporary probe is removed, the
pre-existing staged change is untouched, and nothing has been deployed.
```

---

## After it runs

1. Update the status line at the top of this file.
2. Record the outcome in `../decisions/log.md`.
3. Next task is Phase 1.4, CAPI with `action_source: "business_messaging"` and
   `"messaging_channel": "whatsapp"`, carrying the stored `ctwa_clid`. Both fields are mandatory or
   Meta will not recognise the conversion as CTWA-sourced.
4. Run the change past `dev-team`, and `santa-method` before anything deploys.
