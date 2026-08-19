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
