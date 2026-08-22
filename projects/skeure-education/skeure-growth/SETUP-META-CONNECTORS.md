# Meta connector setup · runbook

Three connectors, two Meta identities, one dashboard flow that only Pratham can do. Work top to
bottom. Every command here is copy-pasteable.

**Status: COMPLETE as of 2026-08-20.** All five steps done and verified live.

- [x] 1. Dedicated Skeure ads app created
- [x] 2. `meta-ads` MCP connected
- [x] 3. `meta-devtools` MCP connected
- [x] 4. Ads CLI installed (v1.1.0) and authenticated
- [x] 5. Live ad account confirmed: `act_961766249917785`, business portfolio `1593889128670416`

> **Note on MCP tool availability.** `claude mcp list` shows both servers connected, but MCP tools
> register at session start. A session that was already running when the servers were added will not
> see `meta-ads` / `meta-devtools` tools. Start a fresh session to use them. The Ads CLI works
> immediately either way, which is how the 2026-08-20 baseline was pulled.

---

## The identity trap · read before step 1

The ad account and the Auretris developer app sit under **different Meta IDs**. Both connectors use
browser OAuth, and the consent screen silently picks up whichever Meta session the browser already
holds. Authorize with the wrong one and you get a connected server that simply cannot see your
assets. No error, just empty lists.

| Connector | Sign in as |
|---|---|
| `meta-ads` | the identity that **owns the ad account** |
| `meta-devtools` | the **Auretris developer** identity |

Easiest way to keep them apart: do one in a normal window and the other in a private window, or log
out between steps.

---

## 1. Create the dedicated ads app (Pratham, in the dashboard)

This is the only step that can't be scripted.

1. Go to <https://developers.facebook.com/apps/> → **Create app**.
2. Name it something unmistakable: `Skeure Ads Connector`.
3. Business portfolio: the one that **owns the ad account** (not the Auretris portfolio).
4. Add the use case: **"Create & manage ads with ads MCP server"**.
5. **No redirect URI needed.** The published guide asks for one, but the ads MCP OAuth flow
   completed without any redirect URL configured in Facebook Login settings. Confirmed 2026-08-20.
   Skip this step; only revisit it if OAuth starts failing with a redirect mismatch.
6. Request these permissions:

   ```
   ads_mcp_management
   ads_read
   ads_management
   catalog_management
   business_management
   pages_show_list
   instagram_basic
   ```

7. Copy the **App ID**. Step 2 needs it.

**Why a new app rather than reusing Auretris:** the Auretris app holds live WhatsApp Cloud API
credentials for production. Adding `ads_management` and `catalog_management` to it would widen the
blast radius of a token that already talks to real customer conversations, and would tie ads
revocation to WhatsApp revocation. A separate app costs one dashboard flow and keeps the two
failure domains apart.

## 2. Connect the ads MCP

```bash
cd /home/user/workspaces/AIOS/projects/skeure-education/skeure-growth
claude mcp add --transport http --client-id <APP_ID_FROM_STEP_1> meta-ads https://mcp.facebook.com/ads
```

Project-scoped on purpose. It should not load into every unrelated session.

A browser window opens for Facebook Login for Business. **Sign in as the ad-account identity.**
On the consent screen, grant only the scopes listed above.

Verify:

```bash
claude mcp list          # meta-ads → ✔ Connected
```

## 3. Connect the devtools MCP

No client-id; this server handles its own OAuth. Confirmed working on this machine before
(it was configured globally until the 2026-08-15 config reset):

```bash
claude mcp add --transport http meta-devtools https://mcp.facebook.com/devtools
```

**Sign in as the Auretris developer identity.**

Tools it exposes: `devtools_app`, `devtools_app_list`, `devtools_app_review`, `devtools_compliance`,
`devtools_discovery`.

Verify:

```bash
claude mcp list          # meta-devtools → ✔ Connected
```

## 4. Ads CLI

The scriptable path for cron jobs, repeat reports, anything that can't sit through a browser OAuth.

```bash
uv tool install meta-ads     # Python 3.13.5 and uv are already present
meta --version
```

Auth is a **system-user token**, not OAuth. In Business Settings:

1. Create an admin system user under the business that owns the ad account.
2. Assign it the assets it needs: ad account, Page, catalog, dataset/Pixel.
3. Add it as an admin on the `Skeure Ads Connector` app from step 1.
4. Generate a token with: `business_management`, `ads_management`, `pages_show_list`,
   `pages_read_engagement`, `pages_manage_ads`, `catalog_management`, `read_insights`.

Then, locally only:

```bash
cp .env.example .env      # .env is gitignored
# fill in ACCESS_TOKEN and AD_ACCOUNT_ID by hand. Never paste a token into a prompt or a commit
meta auth status
```

## 5. Confirm the live ad account

**Done 2026-08-20.** `meta ads adaccount list` returned two accounts, both ACTIVE, both INR /
Asia/Kolkata:

```
act_961766249917785   DegreeCraft       ← the operating account
act_1056790306735632  skeure-education  ← empty, zero campaigns
```

The July record had these backwards. `act_961766249917785` carries all 12 campaigns and every rupee
of the ₹24,998 lifetime spend; the account named "skeure-education" has never run anything. Its name
is stale branding, not a reason to switch. Recorded in `.env` as `AD_ACCOUNT_ID`. See
`paid/BASELINE-2026-08-20.md`.

---

## When all five are done

Run the Phase 3 baseline audit. Until then, any Meta figure in this workspace is a guess, and should
be labelled as one.

## If something fails

- **Server connects but returns empty lists** → wrong identity on the consent screen. Remove the
  server (`claude mcp remove meta-ads`), log out of Meta in the browser, re-add.
- **OAuth redirect mismatch** → the redirect URI in Facebook Login for Business settings doesn't
  match what the MCP sent. Copy it exactly, including trailing slash.
- **Scope denied** → the app is missing the use case from step 1.4, or the permission wasn't
  requested in 1.6.
- **Meta's own docs 500** → they were doing this on 2026-08-19. The endpoint URLs in this file were
  verified live by direct probe (both returned HTTP 401 to an unauthenticated call, i.e. they exist
  and want auth), and the devtools config was recovered from this machine's own pre-reset backup.

---

# Adding the LPU ad account (different Facebook identity)

A third ad account runs LPU-only campaigns with useful historical performance. It sits under a
**different Facebook identity and a different business portfolio** from everything above.

## What is true right now

Verified 2026-08-20 against the Graph API:

- The working token is a `SYSTEM_USER` token, non-expiring, app `1594261842053152`, scopes
  `ads_management`, `ads_read`, `business_management`, `catalog_management`, `pages_show_list`,
  `instagram_basic`.
- It belongs to business `1593889128670416`, which **owns** exactly two ad accounts:
  `act_961766249917785` and `act_1056790306735632`.
- `client_ad_accounts` on that business is **empty**. Nothing from an outside business has ever been
  shared in.

So the LPU account is invisible to the current credentials. It needs either an access grant or its
own credentials.

## Decide first: what do you actually want from it?

| Goal | Access needed |
|---|---|
| Read its performance, learn what worked, copy structure and creative | **View-level only.** Cheapest and safest. |
| Run or edit campaigns in it | Manage-level |
| Reuse its audiences or pixel signal inside the Skeure account | Asset-level sharing, which is separate from account access |

Most of the value in "proven data" is the first row. Prefer View-level unless there is a reason not
to.

## Path A · Partner-share it into the existing business (recommended)

Keeps one token, one `.env`, one CLI config. Nothing else in this workspace changes.

**On the business that OWNS the LPU account:**

1. Business Settings → **Partners** → Add → *give a partner access to your assets*.
2. Enter partner business ID `1593889128670416`.
3. Select the LPU ad account.
4. Grant **View performance** (or Manage campaigns only if you intend to run ads from here).

**Then on business `1593889128670416`:**

5. Business Settings → **Users → System users** → select the existing system user.
6. **Add assets** → Ad accounts → the newly shared LPU account → same permission level.

**Verify, no new credentials needed:**

```bash
cd /home/user/workspaces/AIOS/projects/skeure-education/skeure-growth
AD_ACCOUNT_ID=<LPU_ACCOUNT_ID> meta ads adaccount get <LPU_ACCOUNT_ID>
AD_ACCOUNT_ID=<LPU_ACCOUNT_ID> meta ads campaign list --limit 25 --fields name,status,objective
AD_ACCOUNT_ID=<LPU_ACCOUNT_ID> meta ads insights get --date-preset last_90d
```

It should also start appearing in `client_ad_accounts`:

```bash
set -a; . ./.env; set +a
curl -s -G "https://graph.facebook.com/v21.0/1593889128670416/client_ad_accounts" \
  --data-urlencode "fields=id,name,account_status" \
  --data-urlencode "access_token=$ACCESS_TOKEN" | python3 -m json.tool
```

**Known caveat.** Meta documents an "Account Sharing Limitation": unless you are a verified agency,
a business portfolio can generally only manage accounts owned by the same company that owns the
portfolio. Whether that blocks this specific share depends on how both portfolios are registered.
The Help Center pages are JavaScript-rendered and could not be read programmatically on 2026-08-20,
so this was not confirmed in detail. If the share is refused, use Path B.

## Path B · Separate credentials for that identity

Use when partner sharing is blocked, or when the two identities should stay completely separate.

1. In the business that owns the LPU account: **Users → System users → Add**, admin or employee.
2. Assign it the LPU ad account with the permission level chosen above.
3. That business needs an app to mint the token against. Either add app `1594261842053152` to it, or
   create a second app there. A system user token is generated per business-and-app pair, so the app
   must be present in that business.
4. Generate the token with `ads_read` (add `ads_management` only if writing).
5. Store it in a **second** env file, never mixed into the main one:

```bash
cp .env.example .env.lpu        # add .env.lpu to .gitignore first
# fill in ACCESS_TOKEN and AD_ACCOUNT_ID for the LPU account only
```

Run the CLI against it per-command, leaving the default account untouched:

```bash
env $(grep -v '^#' .env.lpu | xargs) meta ads insights get --date-preset last_90d
```

## Path C · A second MCP connection as the other identity

Fastest route to conversational analysis, and it does not touch the token setup at all.

```bash
claude mcp add --transport http --client-id 1594261842053152 meta-ads-lpu https://mcp.facebook.com/ads
```

Authorize in a browser **logged in as the LPU Facebook identity**, not the Skeure one.

**Caveat, unverified.** If `Skeure Ads Connector` is in Development mode, only people holding a role
on the app (admin, developer, or tester) can authorize it. The app's mode could not be read this
session because MCP tools register at session start and the servers were added mid-session. If OAuth
fails, either add that identity as a tester on the app, or switch the app to Live, or create a
separate app under the LPU business and pass its ID as `--client-id`.

## What transfers between accounts, and what does not

This is the part that decides how much the "proven data" is really worth.

| Asset | Moves across accounts? |
|---|---|
| Campaign structure, targeting, budgets, schedules | Yes, by reading and rebuilding. Trivial once you have View access. |
| Ad creative and copy | Yes, same way. |
| Custom audiences and lookalikes | Yes, but by a **separate** audience-sharing action in Business Settings, not by account access. Verify at the time. |
| Pixel / dataset and its event history | Yes, shareable as its own asset. |
| **Delivery optimization and learning history** | **No.** A new campaign in a different ad account re-enters the learning phase regardless of what the source account learned. |
| Account-level spend and delivery track record | No. Not portable. |

So treat the LPU account as a **research and creative source**, not as something whose performance
can be transplanted. What you take from it is the knowledge of which programmes, audiences, hooks,
and objectives produced results, plus the reusable creative and audience definitions.

## RESOLVED 2026-08-20: it is a personal ad account, `act_278258370`

It is not under any business portfolio. That is exactly why "add to assets" fails: a personal ad
account is not a business asset, so there is nothing for Business Settings to assign.

Probed live with the current system-user token:

```
GET /v21.0/act_278258370
  (#200) Ad account owner has NOT grant ads_management or ads_read permission
```

The account is real and reachable; what is missing is a **permission grant from the account owner**,
not an asset assignment. Paths A and B above assumed a business-owned account and do not apply.

### Option A: grant a role on the ad account (recommended, reversible, ~2 minutes)

Give the Facebook identity that already authorized the `meta-ads` MCP a role on the personal
account. No claiming, no business involvement, undo any time by removing the role.

1. Log in as the Facebook identity that **owns** `act_278258370`.
2. Open the ad account's role settings:
   `https://business.facebook.com/ads/manager/account_settings/account_roles/?act=278258370`
   (or Ads Manager → Settings → Ad account roles)
3. **Add people** → enter the Facebook identity used to authorize `meta-ads`.
4. Role: **Analyst** for view-only performance access. Advertiser or Admin only if ads will be
   created or edited from here. Analyst is enough to mine the historical data.
5. Accept the invitation from the receiving identity if prompted.

**Verify in a fresh session** (MCP tools register at session start): ask the `meta-ads` server to
list ad accounts. `act_278258370` should now be among them.

**The CLI will not see it.** `ACCESS_TOKEN` is a system-user token scoped to business
`1593889128670416`, and system users cannot hold roles on a personal ad account. MCP yes, CLI no.
Use Option B if scripted access is needed.

### Option B: long-lived user token, for CLI and scripted access

Only needed if the LPU data must be pulled by script rather than conversationally.

1. Complete Option A first, so the identity has a role.
2. Graph API Explorer → app `Skeure Ads Connector` → log in as that identity → request `ads_read`
   → generate token.
3. Exchange it for a long-lived token:

```bash
curl -s -G "https://graph.facebook.com/v21.0/oauth/access_token" \
  -d grant_type=fb_exchange_token \
  -d client_id=1594261842053152 \
  --data-urlencode "client_secret=$META_APP_SECRET" \
  --data-urlencode "fb_exchange_token=$SHORT_LIVED_TOKEN"
```

4. Store in `.env.lpu` (add it to `.gitignore` first) with `AD_ACCOUNT_ID=278258370`.

**This token expires in about 60 days**, unlike the non-expiring system-user token. Anything built
on it needs a refresh reminder.

### Option C: claim the account into the business

Puts it fully under business `1593889128670416`, so the existing system user and the CLI both work
with no second credential. Business Settings → Accounts → Ad accounts → Add → **Claim an ad
account** → enter `278258370`.

**Treat this as one-way.** Meta's help pages are JavaScript-rendered and the current rule could not
be read programmatically on 2026-08-20, but claiming an ad account into a business portfolio is
generally not reversible: the paths Meta documents are deactivation or ownership transfer, not
removal. Billing also moves to the business. Do not take this route just to read historical data;
Option A gets that for free and can be undone.

## What is needed to proceed

- Confirm which option to take. Option A unless scripted access is required.
- For Option A, the Facebook identity used to authorize `meta-ads`, so the right account gets the
  role grant.

---

# CAPI delivery · the token that actually matters (added 2026-08-21)

**Two system users exist under the Auretris app, and they are not interchangeable.** This is the
thing that cost a day, so it is recorded here rather than only in the decision log.

| Where | System user | Has `whatsapp_business_manage_events`? | Can send CAPI? |
|---|---|---|---|
| `whatsapp_config.access_token` (encrypted, per WABA) — what Kuanli sends | `122107379259418421` | **No** | No → `(#270)` |
| `AURETRIS_META_SYSTEM_USER_TOKEN` in `automation_stack/.env` | `122109802857366873` ("Admin") | **Yes** | Yes → `events_received: 1` |

Meta returns `(#270) ...development access level...` when this scope is missing. That message points
at the Marketing API access tier and at ad-account admin rights, and **both are red herrings** for
`action_source: business_messaging`. Do not go down the App Review path on the strength of it. The
Auretris app is already in `live_mode` with **advanced** access on `whatsapp_business_messaging` and
`whatsapp_business_management`, holds no `ads_management`, and needs none.

To check a token before blaming anything else:

```bash
# APP_ID is public; the app secret stays in the env file
curl -s -G "https://graph.facebook.com/v21.0/debug_token" \
  --data-urlencode "input_token=$TOKEN_TO_CHECK" \
  --data-urlencode "access_token=${APP_ID}|${META_APP_SECRET}" \
| python3 -c "import json,sys; print(json.load(sys.stdin)['data'].get('scopes'))"
```

`whatsapp_business_manage_events` must be in that list.

**Valid `event_name` values for `action_source: business_messaging`** (Meta's own FAQ, checked
2026-08-21) — `Lead` is **not** among them; it is a website event name:

`Purchase`, `LeadSubmitted`, `InitiateCheckout`, `AddToCart`, `ViewContent`, `OrderCreated`,
`OrderShipped`, `OrderDelivered`, `OrderCanceled`, `OrderReturned`, `CartAbandoned`, `QualifiedLead`,
`RatingProvided`, `ReviewProvided`.

Rehearse with `test_event_code` — it does **not** bypass the scope check, so a green test there is a
real signal, and nothing enters the dataset.

## RESOLVED 2026-08-21: who owns WABA `106777392057661`

Phase 5 step 2 asked this. Answer, probed live:

```
name:               Lpu Online Education
owner_business:     1593889128670416  (Lpupatiala)   ← same portfolio as act_961766249917785
ownership_type:     CLIENT_OWNED
account_review:     APPROVED
dataset:            1049749924574681
```

So the WABA carrying the live ad traffic is **already inside the business portfolio**. Only the ad
account `act_278258370` sits outside it. That narrows Phase 5 to one asset.

## `act_278258370` is not involved in CAPI at all

A `business_messaging` event carries no ad account — only `ctwa_clid` and
`whatsapp_business_account_id`. A real queued event was delivered end to end on 2026-08-21 with that
account untouched and unclaimed. Nothing in the CAPI path requires resolving it, and the DEFERRED
decision on claiming it is unaffected.

## RESOLVED 2026-08-21: `act_278258370` is ALREADY reachable. Options A/B/C are moot.

The whole "grant a role / mint a token / claim it" question above was answered by simply asking the
connector. `ads_get_ad_accounts` on the existing `meta-ads` MCP returns **four** accounts, not two:

| Ad account | Name | Owning business | Status |
|---|---|---|---|
| `278258370` | **Bimal Goel** | *(none, personal)* | ACTIVE, payment method on file |
| `961766249917785` | DegreeCraft | `1593889128670416` Lpupatiala | ACTIVE |
| `1056790306735632` | skeure-education | `1593889128670416` Lpupatiala | ACTIVE, Ads MCP not yet rolled out |
| `1901997537184184` | **Pratham Goel** | *(none, personal)* | ACTIVE, no payment method |

Proven with a real read, not just the listing: campaigns on `act_278258370` return fine, including the
live one, `FB Ads - 01/07/2026`, ACTIVE, ₹51,022.11 spent, 2,112,050 impressions, OUTCOME_ENGAGEMENT.

**So the identity that authorized `meta-ads` already holds a role on the personal account.** No role
grant, no second MCP connection, no `.env.lpu`, no claiming. Ignore Options A, B and C above for
anything conversational or read/analysis shaped.

### The app-roles confusion, and why the Facebook ID was never needed

`Skeure Ads Connector` was created **under a business portfolio** (step 1.3 of this runbook). Meta's
App Roles doc is explicit about what that changes:

> "If your app is connected to a business portfolio, you must use the Business Manager to manage
> roles for your app."

So the App Dashboard's Roles panel is not where people get added for this app, which is why searching
there for a profile goes nowhere. In Business Settings people are added **by email address**, never by
Facebook ID or username. That is why the ID could not be found: nothing in the working path ever asks
for it.

If a raw profile ID is ever genuinely needed: read it off the profile URL. `facebook.com/<username>`
gives the username; `facebook.com/profile.php?id=<NUMBER>` gives the numeric ID directly. A profile
with no username can create one in Accounts Center. **Do not** use Graph API `/me?fields=id` for this:
that returns an *app-scoped* ID which differs per app and will not resolve anywhere else.

### What still does not work, and why

The `meta` Ads CLI is expected NOT to see `act_278258370`. `ACCESS_TOKEN` is a system-user token, and
a system user cannot hold a role on a personal ad account, which is structural rather than a
configuration miss. Consistent with the `(#200) Ad account owner has NOT grant ads_management or
ads_read` still returned by direct Graph probes on that account today. **Not re-confirmed on 2026-08-21**:
`meta ads adaccount list` returned `API error (4): Application request limit reached`, an app-level
rate limit, so the CLI check was inconclusive this run rather than negative. Retry when the limit
clears. Scripted access to that account still needs a ~60-day user token per Option B.
