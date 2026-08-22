# OpenSEO self-host · runbook

Self-hosted on Cloudflare, MCP wired into this project, Google Search Console connected.
Goal: finally settle whether GSC returns data for `education.skeure.com`.

Repo: `/home/user/openseo` (`github.com/every-app/open-seo`, MIT, v0.1.6).

**Status as of 2026-08-22: deployed and live. Remaining work is GSC ownership recovery.**

- [x] Prereqs verified — Node v24.19.0 (needs >=22.6), pnpm 10.30.1, openssl 3.5.6
- [x] `pnpm install` complete
- [x] `.env.selfhost` created from template, `chmod 600`, gitignored via `.gitignore:17`
- [x] `BETTER_AUTH_SECRET` generated locally (`openssl rand -base64 32`) and written
      straight into the file. Never printed, never in a prompt or a log.
- [x] **DataForSEO key set** (free tier)
- [x] **`pnpm alchemy login`** — profile `default`, OAuth, `access:write` present
- [x] **Deployed.** `https://open-seo-selfhost.241-pratham.workers.dev/api/health` returns
      302 to the Cloudflare Access login, which is the expected response for a live,
      Access-protected worker.
- [ ] **Recover GSC ownership of `education.skeure.com`** — the owning Google account was
      lost. See the section below. This is the only real blocker.
- [ ] Google OAuth client, redeploy, connect GSC, wire MCP

---

# Lost the Google account that owned `education.skeure.com`

**This is recoverable, and no data is lost.** The reason is that the old account's proof of
ownership is a DNS record in a zone Pratham controls.

Probed live 2026-08-22:

```
education.skeure.com  TXT  "google-site-verification=ceERVsKOjnSXB7n2gKPz8gzZraSZhK9faK8ZEDob8Fs"
```

That is the lost account's verification token, sitting in the Cloudflare `skeure.com` zone
(`abbc60817ae19f8a200529748625929f`), which is reachable from the same Cloudflare dashboard
already used to take down `finance.skeure.com`. There is no `google-site-verification` TXT at
the `skeure.com` apex and no verification `<meta>` tag on the homepage, so DNS on the
subdomain is the only ownership root in play.

Because DNS is the root of trust for Search Console verification, whoever controls the zone
controls the property. Losing the Google account does not lose the site.

## The two facts that make this safe

Both confirmed against Google's current documentation on 2026-08-22, not from memory:

1. **Historical data survives.** *"Data is collected for a property as soon as anyone adds it
   in Search Console, even before verification occurs."* A newly verified owner sees the
   property's full accumulated history (Search Console retains ~16 months), not just data
   from the verification date forward.
2. **Ownership is not exclusive.** *"Multiple people can verify ownership of the same website
   property, using the same or different verification methods."* A new account can verify
   without any cooperation from the old one.

## Order of operations — this part matters

> **Verify the new account BEFORE deleting the old TXT record.** Google is explicit: *"If all
> verified owners lose access to a property, all users will lose access to the Search Console
> property."* Deleting the old token first, while it is the only one, can orphan the property.

> **In Cloudflare, ADD a second TXT record. Do not EDIT the existing one.** Google's own guide
> warns against overwriting an existing verification token. Multiple TXT records on the same
> hostname coexist fine, and Google looks for its expected value among them. The Cloudflare
> DNS UI makes "Edit" the easy misclick.

### 1. Add the property on the new Google account

Search Console → **Add property** → **Domain** → `education.skeure.com`.

Use the **Domain** type, matching how the old one was verified (the token is on the subdomain,
not the apex). Google hands you a new TXT value.

### 2. Add the new TXT record in Cloudflare

Cloudflare → `skeure.com` → DNS → **Add record**:

| Field | Value |
|---|---|
| Type | `TXT` |
| Name | `education` |
| Content | `google-site-verification=<new-value-from-step-1>` |
| TTL | Auto |

Leave the existing `ceERVsKO…` record in place for now. Confirm both are live:

```bash
dig +short TXT education.skeure.com @1.1.1.1
```

Two `google-site-verification=` lines should come back.

### 3. Verify, and read the answer

Back in Search Console, click **Verify**. The property should appear with its full history.

**This is the moment the original question gets answered** — whether GSC returns data for
`education.skeure.com` is visible right there in Performance, before OpenSEO is involved at
all. Note what it says.

### 4. Evict the old owner

Only after step 3 succeeds. Two steps, and skipping either leaves the old account able to
walk back in — Google: *"If you do not delete these tokens, the removed owner will be able to
re-verify ownership if they choose to."*

1. Search Console → **Settings → Users and permissions** → remove the old account as owner.
2. Cloudflare → DNS → **delete** the old `google-site-verification=ceERVsKOjnSXB7n2gKPz8gzZraSZhK9faK8ZEDob8Fs`
   TXT record.

**Do this promptly if the account was compromised rather than merely forgotten.** A verified
owner can submit sitemaps and, more damagingly, file URL removal requests that deindex pages.
If it was simply forgotten and nobody else can reach it, the urgency is lower but the cleanup
is the same.

Worth one attempt before writing the account off:
<https://accounts.google.com/signin/recovery>. If it works, everything above is unnecessary.
If it does not, nothing above depends on it.

---

# The old (hosted) OpenSEO account

Separate problem from the Google account, and possibly not a problem at all.

**Try logging in at <https://app.openseo.so> first.** OpenSEO's auth (`src/lib/auth.ts`)
enables **both email+password and Google social login**. If the account was created with
email+password, the lost Google account is irrelevant and access is intact. Only a
Google-SSO signup using the lost account is genuinely locked out.

Two things to do if the login works:

1. **Check whether its GSC connection still returns data.** OpenSEO stores an OAuth refresh
   token, and refresh tokens keep working without interactive login until they are revoked or
   the account is deleted. The old workspace may still be pulling `education.skeure.com` data
   right now, which would answer the question in about two minutes with no setup at all.
   Try this before anything else.
2. **Export what is worth keeping.** There is no whole-account export, but per-feature export
   exists: saved keywords (`useSavedKeywordsExport`), backlinks, audit results, and
   Export-to-Sheets on data tables. Pull those down, then rebuild the project in the
   self-hosted instance.

If the login fails, nothing is lost that matters. Projects and saved keyword lists are
configuration, and GSC performance data lives with Google, not with OpenSEO — it re-appears
in the self-hosted instance the moment the new Google account is connected.

---

## The cost finding that matters

**Answering the GSC question costs nothing beyond a free DataForSEO signup.**

DataForSEO gives new accounts **$1 of free credit**; the **minimum top-up is $50**. But
GSC data comes from Pratham's own Google account, so per `docs/SELF_HOSTING_GOOGLE_SEARCH_CONSOLE.md`:

> Search Console data comes from your own Google account, so OpenSEO never meters credits for it.

`DATAFORSEO_API_KEY` is still a **required** field — `scripts/selfhost-deploy-preflight.mjs`
hard-fails on an empty value before the build starts. So a free account is needed to get
past preflight, but **no top-up is needed to read GSC**. Only keyword/SERP/backlink
features (~$0.05/keyword) draw down credit.

Recommendation: create the free account, deploy, answer the GSC question, and decide on the
$50 top-up afterwards on evidence.

---

## What Pratham has to do

### 1. DataForSEO account (5 min, free)

1. <https://app.dataforseo.com/api-access> — create an account.
2. Click **"Send by email"** to get credentials.
3. Copy the **longer "Base64"** value (this is `email:password` base64-encoded, not the
   plain password).

**Put it in the file without it ever entering a transcript.** In a terminal, not in a
Claude prompt:

```bash
cd /home/user/openseo
read -rs -p "DataForSEO Base64: " K && \
  sed -i "s|^DATAFORSEO_API_KEY=.*|DATAFORSEO_API_KEY=$K|" .env.selfhost && \
  unset K && echo " written"
```

`read -rs` echoes nothing and the value never reaches shell history as an argument.

### 2. Cloudflare login (2 min, interactive)

R2 must be active on the account first — activating it requires a payment method on file
even inside the free tier. Open `R2` once in the Cloudflare dashboard if it has never been
used.

```bash
cd /home/user/openseo
pnpm alchemy login          # answer YES to "Customize OAuth scopes?" and enable access:write
pnpm alchemy cloudflare bootstrap
```

`access:write` is not optional — the deploy provisions the Cloudflare Access login gate,
and preflight rejects a login without that scope.

There is **no** Cloudflare auth on this machine right now (`wrangler whoami` → not
authenticated). The `CLOUDFLARE_API_TOKEN` used by finance-v2 is not a substitute: it holds
Workers Edit + D1 Edit + Access **read**, and this deploy needs Access write, R2 write, and
KV write.

### 3. Set who may sign in

```bash
cd /home/user/openseo
sed -i 's|^ACCESS_ALLOWED_EMAILS=.*|ACCESS_ALLOWED_EMAILS=<your-email>|' .env.selfhost
```

### 4. Deploy

```bash
cd /home/user/openseo && pnpm deploy:selfhost --yes
```

Provisions D1 + KV + R2 + the Access application, applies migrations, deploys the Worker.

---

## The hostname is predictable — do Google in parallel

`alchemy.access.ts:22` — `workerName(stage)` = `open-seo-<stage>`, and the self-host stage is
literally `selfhost`. Combined with the account's workers.dev subdomain `241-pratham`
(from the finance-v2 deployment), the hostname is known **before** the deploy runs:

```
https://open-seo-selfhost.241-pratham.workers.dev
```

So the Google OAuth client can be created at the same time as steps 1–2 rather than after
the deploy. **If a different Cloudflare account is used, the subdomain changes and the
redirect URI below is wrong** — deploy first in that case and read the hostname off the
output.

### 5. Google OAuth client (~10 min)

1. <https://console.cloud.google.com/> → create or pick a project.
2. Enable the **Google Search Console API**:
   <https://console.cloud.google.com/apis/library/searchconsole.googleapis.com>
3. **Google Auth Platform → Audience** (`console.cloud.google.com/auth/audience`; the older
   console calls this **APIs & Services → OAuth consent screen**). User type **External**.
   Fill in app name, support email, developer contact.

   Build this OAuth client **in the new account's Google Cloud project**, not the lost one.
   The client and the Search Console grant should live with the same identity, otherwise the
   next lost password repeats this whole exercise.

   Then do BOTH of the following. Doing only the first is what causes the weekly breakage
   described below.

   **3a. Add the new Google account under Test users.** Without this, sign-in fails with
   `Error 403: access_denied` and "can only be accessed by developer-approved testers".

   **3b. Set publishing status to "In production". Do NOT submit for verification.**

   > **The trap: Testing mode expires the connection every 7 days.** Google:
   > *"A Google Cloud Platform project with an OAuth consent screen configured for an external
   > user type and a publishing status of 'Testing' is issued a refresh token expiring in 7
   > days, unless the only OAuth scopes requested are a subset of name, email address, and user
   > profile."*
   >
   > OpenSEO requests `https://www.googleapis.com/auth/webmasters.readonly`
   > (`src/shared/gsc.ts:10`), which is a **sensitive** scope and nowhere near that exemption.
   > So in Testing mode the GSC connection silently dies weekly and has to be re-authorized by
   > hand, forever.

   Publishing to **In production** while staying **unverified** removes the 7-day expiry. The
   costs are an unverified-app warning screen (click **Advanced → Go to … (unsafe)** once) and
   a hard cap of 100 total users. For a single-operator self-hosted install, 1 of 100 is not a
   constraint. Verification is only worth pursuing if this is ever exposed to other people.

   **"Internal" user type is not available.** It requires Google Workspace, and neither
   `prathamgoel.com` nor `skeure.com` runs Workspace — both use Cloudflare Email Routing
   (`route1.mx.cloudflare.net`). Checked 2026-08-22.
4. **Credentials → Create credentials → OAuth client ID** → **Web application**.
5. Authorized redirect URI, exactly — no trailing slash:

   ```
   https://open-seo-selfhost.241-pratham.workers.dev/api/gsc/oauth/callback
   ```

6. Copy the Client ID and Client secret.

**No reusable client exists.** Searched every `.env` under `automation_stack`, `AIOS`,
`.hermes`, and `job-search` for `GOOGLE_CLIENT_ID` — zero hits. This is a fresh create.

Then write them in (terminal, not a prompt — the secret is a credential):

```bash
cd /home/user/openseo
read -rs -p "GOOGLE_CLIENT_SECRET: " S && \
  sed -i "s|^# GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=<paste-client-id-here>|" .env.selfhost && \
  sed -i "s|^# GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$S|" .env.selfhost && \
  unset S && echo " written"
```

The Client ID is not secret and can be pasted inline; the secret goes through `read -rs`.

`BETTER_AUTH_SECRET` is **already set** — it encrypts the stored OAuth tokens at rest. Do
not regenerate it after a GSC connection exists or the stored grant becomes undecryptable.

### 6. Redeploy so the Worker picks up the Google vars

```bash
cd /home/user/openseo && pnpm deploy:selfhost --yes
```

### 7. Connect GSC and get the answer

Open the Worker URL → sign in through Access → **Integrations** → **Connect with Google** →
authorize → pick the `education.skeure.com` property.

If no property is listed, the authorized Google account has no verified property and the
site must be verified in Search Console first. That by itself answers half the question.

---

## MCP wiring

Managed OAuth is **off by default** and MCP clients cannot connect without it.

1. Cloudflare Zero Trust → `Access controls` → `Applications`.
2. Find `open-seo selfhost` → **Edit**.
3. `Additional settings` → `OAuth` → turn on **Managed OAuth**.
4. Under `Managed OAuth settings`, allow **`localhost` / loopback** redirect URIs — Claude
   Code registers `http://localhost:PORT/callback`. Without this the client logs in but
   exposes zero tools.
5. Save.

Then, project-scoped on purpose so it does not load into every unrelated session (same
reasoning as `meta-ads` in `SETUP-META-CONNECTORS.md`):

```bash
cd /home/user/workspaces/AIOS/projects/skeure-education/skeure-growth
claude mcp add --transport http openseo https://open-seo-selfhost.241-pratham.workers.dev/mcp
claude mcp list      # openseo → ✔ Connected
```

**MCP tools register at session start.** A session already running when the server is added
will not see the tools. Start a fresh session — same trap documented for `meta-ads`.

---

## Notes

- `pnpm install` reported ignored build scripts for `workerd`, `esbuild`, `sharp` and
  others. If the deploy fails on a missing native binary, run `pnpm approve-builds` and
  allow `workerd` + `esbuild`, then reinstall.
- `corepack enable` fails on this machine (no write permission on `/usr/bin/pnpm`). Harmless
  — the repo's pinned pnpm 10.30.1 resolved and installed fine.
- Telemetry is on by default. To opt out, set `OPENSEO_TELEMETRY_DISABLED=1` in
  `.env.selfhost` before deploying. It sends aggregate counts only — no URLs, keywords,
  prompts, or emails — but this workspace's default is to keep student-adjacent tooling
  quiet.
- Teardown, if it turns out not to be worth it:
  `pnpm alchemy destroy --env-file .env.selfhost --stage selfhost`

## Why self-host rather than the $10 hosted plan

Recorded 2026-08-22: hosted adds a ~28% markup on DataForSEO calls on top of the $10/mo.
Self-hosting on Cloudflare's free tier pays only DataForSEO at cost. The GSC integration —
the piece that actually settles the `education.skeure.com` question — is identical on both.
