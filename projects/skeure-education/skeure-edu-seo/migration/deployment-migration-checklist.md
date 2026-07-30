# Deployment & migration checklist

Created 2026-07-24. Nothing in this checklist has been executed — no redirect, DNS change, Google Change of
Address, or production deployment happened this session, per working rule 1. This is the runbook for when a
human (Pratham) decides to proceed.

## Before any of this starts

- [ ] All P0 items in `../audits/p0-p1-checklist.md` are closed, especially the two `hold-pending-verification`
      rows in `redirect-map.csv` (Online Manipal entity split, Desh Bhagat entitlement).
- [ ] Legal review has supplied final Privacy Policy / Terms text (currently draft + noindexed).
- [ ] `npm run build` and `npx astro check` both pass clean (confirmed this session — see remediation report).
- [ ] Code review and security review findings from this session are resolved or explicitly accepted.

## Stage 1 — deploy the new site, keep it out of search, keep old site live

1. Deploy `website-build` to Cloudflare Pages (`npm run deploy`, i.e. `astro build && wrangler pages deploy dist`).
2. Point a **staging** hostname (not `education.skeure.com` yet) at the new Pages deployment, or use the
   Pages preview URL, so the team can do a final human walkthrough before it's public at the real domain.
3. Verify on staging: all 24 pages load, forms submit, WhatsApp/call/email links work, mobile menu behaves,
   no console errors.
4. Only once staging looks right: point `education.skeure.com` DNS at the Cloudflare Pages project. This is
   the first real production action in this whole flow — get explicit sign-off before doing it.

## Stage 2 — Search Console setup (no redirects yet)

5. Verify a Search Console property for `education.skeure.com` (or the `skeure.com` domain property).
6. Confirm the existing `degreecraft.com` GSC property is still verified and accessible — do not let it lapse,
   its historical query/link data is valuable evidence for Stage 3.
7. Submit `https://education.skeure.com/sitemap-index.xml` in GSC. Confirm it's fetched without errors and
   confirm the noindexed pages (privacy-policy, terms, the 2 held university pages) do **not** appear in it
   (already excluded via `astro.config.mjs`'s sitemap filter — spot-check the live sitemap XML after deploy).
8. Pull degreecraft.com's top landing pages, queries, and backlinks from GSC. Cross-check against
   `degreecraft-url-inventory.csv` (built from sitemap.xml + nav crawl only, not GSC) — add any URL GSC
   reveals that wasn't in the crawl-based inventory, especially anything with real click volume.

## Stage 3 — activate redirects (one domain move, not a spot fix)

9. Re-open `redirect-map.csv`. Every row must be `status: ready` before its redirect goes live — do not
   activate the two `hold-pending-verification` rows (Online Manipal, Desh Bhagat) until their destination
   pages are corrected and republished (noindex removed).
10. For the 4 old blog URLs marked `rebuild-first`: decide, per GSC evidence pulled in step 8, whether each
    is worth a redirect to `/blog/` (low-value fallback) or should 404/retire (if it has no real traffic).
    Don't blanket-redirect content you haven't rebuilt.
11. Implement the confirmed redirects. Cloudflare Pages supports a `public/_redirects` file
    (`/old-path /new-path 301`) or Bulk Redirects at the zone level — pick whichever the team already uses
    for `skeure.com`'s other subdomains, for consistency. Do not implement 301s to the homepage for
    everything; that's explicitly disallowed by the master plan.
12. Deploy the redirects. Spot-check every row in `redirect-map.csv` manually (curl -I or browser) — confirm
    301, confirm the destination isn't itself a redirect (no chains), confirm no destination is a
    `hold-pending-verification` row that slipped through.
13. Only after redirects are live and verified: submit Google's **Change of Address** tool in GSC, from the
    `degreecraft.com` property, pointing at `education.skeure.com`. This is a one-way, high-consequence
    action — confirm with Pratham immediately before this specific step, separately from the general
    deployment go-ahead.

## Rollback plan

- **DNS rollback:** if `education.skeure.com` needs to come down, repoint DNS back to wherever it was before
  Stage 1 step 4. Cloudflare Pages deployments are immutable per-build, so the previous production deployment
  can also be re-promoted from the Pages dashboard without a new build.
- **Redirect rollback:** redirects live in `public/_redirects` (or Bulk Redirects, whichever was chosen in
  step 11) — reverting the file/ruleset and redeploying removes them immediately. Keep degreecraft.com itself
  live and unmodified through the whole migration so a redirect rollback doesn't strand any traffic.
- **Do not** delete or unpublish degreecraft.com content as part of this migration. Per the master plan:
  "Keep redirects for at least one year and preferably longer" — the old domain should stay resolvable
  (even if just redirecting) for the long haul, not decommissioned at cutover.

## Post-launch monitoring (weekly, per the master plan's 90-day roadmap)

- [ ] GSC coverage report for `education.skeure.com`: clean-indexed vs submitted URL count.
- [ ] GSC for `degreecraft.com`: watch for a drop in indexed pages / crawl errors consistent with the redirect
      being picked up (expected), vs. an unexpected spike in 404s (not expected — investigate immediately).
- [ ] 404 rate on `education.skeure.com` (Cloudflare Pages analytics or GA4 once connected) — a sustained
      increase suggests a missed redirect-map row.
      - [ ] Canonical/robots spot-check on a sample of pages — confirm noindexed pages stay noindexed and
      indexed pages stay indexed after any subsequent deploy (a regression here is easy to introduce
      accidentally by editing `content.config.ts`'s `noindex` defaults or a page's `noindex` prop).
- [ ] Rankings for the ~50 priority keywords being tracked (once keyword tracking is set up per the master
      plan) — watch for a temporary dip during migration (normal) vs. a sustained loss (investigate).
- [ ] Backlinks: spot-check that major referring domains to degreecraft.com's redirected pages are still
      passing authority through (not landing on a broken URL).
