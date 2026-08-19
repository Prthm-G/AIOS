# Meta connector setup · runbook

Three connectors, two Meta identities, one dashboard flow that only Pratham can do. Work top to
bottom. Every command here is copy-pasteable.

**Status: not started.** Update the checkboxes as you go; this file is the record of what is
actually wired.

- [ ] 1. Dedicated Skeure ads app created
- [ ] 2. `meta-ads` MCP connected
- [ ] 3. `meta-devtools` MCP connected
- [ ] 4. Ads CLI installed and authenticated
- [ ] 5. Live ad account confirmed and recorded

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
5. Under **Facebook Login for Business** → Settings, add the redirect URI the ads MCP requires. The
   MCP's OAuth flow will tell you the exact value if it isn't pre-filled; add it verbatim.
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

The July-2026 record says `act_1056790306735632` ("skeure-education", INR, Asia/Kolkata) with a
legacy `961766249917785` ("DegreeCraft") alongside it. Treat both as unverified. That record is
over a month old, and the DegreeCraft account's status was observed flipping twice in a single day.

```bash
meta ads adaccount list
```

Record the confirmed ID in `.env` as `AD_ACCOUNT_ID`, and note the decision in `decisions/log.md`
with the date it was verified. That becomes the workspace's single recorded fact about the account, and
everything downstream reads it from there rather than re-deriving it.

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
