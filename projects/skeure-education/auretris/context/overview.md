# Auretris — overview

Two separate applications share the "Auretris" name. Both live outside AIOS at `/home/user/automation_stack`, as sibling folders.

## 1. Auretris the WhatsApp bot + CRM ("Kuanli")

**What it is:** Auretris (WhatsApp bot) + Kuanli (its CRM face) are the same application — a self-hosted, white-labeled deployment of [`wacrm`](https://github.com/ArnasDon/wacrm) (MIT-licensed, forked to `github.com/Prthm-G/wacrm`). "Kuanli" is not separate software — it's the same `wacrm` codebase, white-labeled purely via env vars (`WACRM_SITE_URL=kuanli.prathamgoel.com`, SMTP sender name, etc).

**Where the code/containers live:** `automation_stack/wacrm`. Key pieces:
- `wacrm/` — the Next.js/TypeScript/Supabase app itself. Live WhatsApp/Meta integration code: `src/app/api/whatsapp/{webhook,send,broadcast,templates,media,react,config}/route.ts`, `src/lib/whatsapp/meta-api.ts`.
- `docker-compose.yml` — services: `postgres`, `n8n`, `kong`, `gotrue`, `rest`, `realtime`, `storage`, `wacrm`, `auretris-site`. Single Docker network.
- n8n hosts the actual AI bot logic as a workflow ("Auretris - Main": LangChain + Groq LLM + WhatsApp node) plus two tool sub-workflows (FAQ Search, Send Brochure). Workflows live in Postgres, not as files.

**Client onboarding is currently unimplemented.** As of 2026-07-31, wacrm's onboarding UI and API routes (`src/app/onboard/`, `api/whatsapp/{registration,embedded-signup}/`) were removed — they were built against Meta's Embedded Signup **v2**, which Meta is deprecating Oct 15, 2026, and had gotten tangled up with the marketing-site mistake below. A new implementation on the [Embedded Signup v4](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/version-4) flow is pending — not yet scoped or built. Until then, there is no way to connect a new client's WhatsApp number through the app; the one already-connected client (since 2026-07-28) is unaffected, since none of the live messaging/webhook code was touched.

**Credit line / billing (checked live 2026-07-31):** Pratham's system user token has `business_management` scope but is not yet attached to any discoverable Meta business portfolio, and `AURETRIS_META_CREDIT_LINE_ID` is unset — **no shared line of credit exists today.** Under Meta's default Tech Provider model, that means any newly onboarded client's WABA needs its own payment method attached before it can send messages. Becoming a Solution Partner (accepting Credit Allocation API terms, getting a credit line ID, sharing it per client) would remove that per-client card requirement — a business decision to make before or during the v4 onboarding rebuild, not a code change.

**"WhatsApp coexistence"**: this feature was **intentionally removed** from the app (`wacrm/supabase/migrations/033_remove_whatsapp_coexistence.sql`), not half-broken. Don't reintroduce it without a specific reason — it was a deliberate decision, not an accident.

**Multi-tenancy**: `wacrm` already supports multiple client accounts in one deployment (`whatsapp_config` is `account_id`-scoped with RLS). The current onboarding pattern instead clones the entire Docker stack per client (e.g. `automation_stack-skinstitutes`) — this is unvalidated as necessary and is the most likely lever for making client onboarding less painful, independent of any bigger rebuild.

## 2. Auretris the marketing site (`auretris.prathamgoel.com`)

**What it is:** A standalone, static-leaning Next.js app introducing "Auretris" as a product — landing page plus four design-concept variants (`/concepts/signal`, `/orbit`, `/editorial`, `/command`). No backend, no Supabase, no auth — pure marketing content. The "Sign in" and "Client sign in" links point cross-domain at `https://kuanli.prathamgoel.com/login` for existing clients.

**Where the code lives:** `automation_stack/auretris-site` — its own sibling folder next to `wacrm`, own `package.json`/`Dockerfile`/docker-compose service, port `127.0.0.1:3002` (3001 was already taken by the `skinstitutes` client stack's own wacrm clone). Design source material (12 concept mockups + rationale) is in `auretris-site/artifacts/auretris-concepts/`.

**Public routing:** no reverse proxy exists in this repo. Same as `kuanli.prathamgoel.com` and `n8n.prathamgoel.com`, `auretris.prathamgoel.com` needs to be pointed at this container's port on the Hostinger side — that's outside this codebase.

**Known gap:** the "Connect WhatsApp" CTA currently scrolls to the in-page "how it works" section rather than starting a real signup flow, since the actual onboarding implementation (above) doesn't exist yet. Revisit this button once the v4 rebuild lands.

## Status

**As of 2026-07-31:** wacrm is live (`docker compose ps`), one client connected since 2026-07-28, onboarding routes removed pending v4 rebuild. `auretris-site` is newly scaffolded, not yet deployed publicly (needs Hostinger DNS). See [`decisions/log.md`](../decisions/log.md) for the day's fixes, in chronological order.
