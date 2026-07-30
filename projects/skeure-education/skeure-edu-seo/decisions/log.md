# Decisions log

Append-only. Newest entries at the bottom. Record what was decided, why, and by whom — not routine task status.

---

## 2026-07-24 — Backfill: remediation pass approved and executed

**Decision:** Pratham approved a full launch-gate remediation pass on `website-build` (SEO-MARKETING-MASTER-PLAN.md Master Prompt 1): fix P0/P1 factual-trust, accessibility, measurement, and migration-readiness issues. Hard constraints: no deploy, no DNS/redirect/GSC action, no invented facts, no unilateral cloud-resource creation.

**Why:** The live site had public draft/placeholder content, unsupported ratings and testimonials, an unsupported financing promotion, and a broken `mailto:` contact form — all P0 harms per the master plan.

**Outcome:** 60 files changed (uncommitted). Full record in `audits/website-remediation-report.md` and `audits/p0-p1-checklist.md`. Zero programme records reached `verified` status (see `evidence/source-register.md` — UGC-DEB live search was unscrapable both research passes; PDF-notice evidence only, marked `stale`). Two university pages (Online Manipal, Desh Bhagat) unpublished pending real fixes.

---

## 2026-07-24 — Backfill: D1 + Turnstile approved, blocked on Cloudflare auth

**Decision:** Pratham approved provisioning a real Cloudflare D1 database for the contact-form lead store, and — per the security-auditor's finding that honeypot/timing anti-spam alone becomes bypassable once a real DB exists — also approved adding Cloudflare Turnstile, choosing the "recommended" (full protection) option over rate-limit-only or no protection.

**Why:** The rebuilt contact form (`functions/api/contact.ts`) validates and honestly reports `persisted:false`, but stores no lead anywhere durable. D1 makes it real; Turnstile is a prerequisite to enabling D1 safely.

**Outcome:** Blocked. `npx wrangler whoami` showed not authenticated; no Cloudflare credentials existed anywhere in the environment. Plan approved and filed at `/home/user/.claude/plans/yes-start-with-d1-resilient-cosmos.md`, execution paused pending an auth decision.

---

## 2026-07-24 — Backfill: Cloudflare Pages deployment (separate track, before this workspace existed)

**Decision:** A separate session (predating this SEO workspace) deployed `website-build` to Cloudflare Pages (project `skeure-education`) and added `education.skeure.com` as a custom domain, verified live via two independent DNS/TLS/HTTP passes.

**Why:** Hero rebuild + SEO groundwork (sitemap, robots, canonical) reached a publishable state; user requested launch.

**Outcome:** Live. **Note (see 2026-07-25 entry below):** the live deployment predates the 2026-07-24 remediation pass above — it does not contain those fixes.

---

## 2026-07-25 — Production-drift finding: live site does not contain the remediation fixes

**Finding:** Direct verification against `https://education.skeure.com/` shows it is still serving the **pre-remediation build**. The homepage currently renders a testimonial containing the literal visible text `(Draft testimonial, pending review.)` and per-university star ratings (4.2–4.7, no source/methodology) — exactly the P0 harms the 2026-07-24 remediation pass was meant to remove. Online Manipal University also still appears in the normal (non-noindexed) partner grid. Root cause: the remediation pass (60 files) was never committed or deployed, and no deploy has happened since (Cloudflare auth has been blocked the whole time — same blocker as the D1/Turnstile item above).

**Why this matters:** This is a live guardrail violation visible to real prospective students right now, not a historical audit note. It elevates the Cloudflare-auth decision from "blocks new features" to "blocks removing an active harm."

**Decision:** Pratham chose to authenticate via a scoped Custom API Token (session-only, exported as `CLOUDFLARE_API_TOKEN`, never committed) rather than interactive `wrangler login` or holding off. Proceeding with D1 → Turnstile → local re-verification → **separate explicit approval** before the actual `wrangler pages deploy` (deploy is not bundled into the auth decision).

**Also decided:** OpenSEO MCP authentication (needed for GSC baselines, keyword research, competitive-landscape) is **deferred to a future session**. This session's scope is the website production-drift fix plus finishing this workspace's scaffolding.

**Correction applied:** `evidence/claims-register.csv` still showed `status = open` for CLM-001 (ratings), CLM-002 (testimonials), CLM-003 (financing), CLM-005 (entity schema), CLM-006 (Manipal conflation), and others that `audits/website-remediation-report.md` says were fixed in the codebase. This was a real bookkeeping gap — the register wasn't updated after the remediation pass. Corrected in this session to `fixed-pending-deploy` where the code fix is real but not yet live, so the register doesn't silently overstate risk that's actually already contained in the working tree.

---

## 2026-07-25 — Workspace scaffolding completed

**Decision/action:** Finished the `skeure-edu-seo` workspace structure defined in `SEO-MARKETING-MASTER-PLAN.md` — added `README.md`, this log, `keywords/keyword-to-url-map.csv`, `content/strategy.md`, `reports/weekly/weekly-template.md`, `reports/monthly/monthly-template.md`. Everything else in the target structure (evidence/, analytics/, migration/, audits/, bridge/, bin/) already existed from the 2026-07-24 session.

**Why:** The workspace was ~70% built already; finishing it now unblocks using it as the single source of truth going forward, and was explicitly requested this session.

---

## 2026-07-25 — Codex adversarial review found real defects; P0 fixes applied

**Action:** Ran `./bin/codex-bridge review` (read-only) against the claims register, redirect map, migration inventory, and remediation report. Run artifacts: `.bridge/runs/20260725T044410Z-review/`. Every finding was independently re-verified against the actual `website-build/src` files before being accepted — per `CLAUDE.md`, model agreement is not proof.

**Findings accepted and fixed (all verified true):**

1. **Blanket UGC recognition claim (P0).** `src/content/faqs/ugc-recognition.md` published "every university we partner with offers UGC-recognised online degree programs, valid for jobs and higher studies" — as FAQPage structured data, and contradicting a ledger with 0 verified and 2 disputed records. The same blanket framing appeared in `Hero.astro` and `UniversityLogoBanner.astro`. All three rewritten to state entitlement is per programme/mode/session.
2. **`/programs/` published unverified data with no disclosure (P0).** The page filtered only on `!noindex`, then rendered fee tables for every remaining university with no `evidenceStatus` check — while the university detail pages carried disclosures. Fixed by carrying `evidenceStatus` per row and labelling each card, plus a page-level disclosure. 67 cards now labelled (44 stale + 23 unverified), matching the ledger exactly.
3. **CLM-003 was misclassified by me earlier today.** I marked it `fixed-pending-deploy`; numeric claims were gone but unnamed-lender assertions remained. Corrected to `partially-fixed-pending-deploy`, then actually fixed: copy now states Skeure is not a lender, that lending partners aren't finalised, and links the commission disclosure.
4. **CLM-013 likewise.** QS claims had been removed but WASC/QAA/WES/ACBSP remained unqualified, plus "legally equivalent" and "valid abroad" FAQ answers. All qualified as university-reported and unverified.
5. **The remediation report overstated itself.** Claimed all P0 closed (three survived), claimed no page silently presents unconfirmed data (false for `/programs/`), and claimed "20 of 22 redirects ready" when the CSV held 16. Correction notice added at the top of the report plus a full addendum.

**Redirect map re-assessed.** Moved 12 rows from `ready` to `hold-pending-verification` — every university destination plus `/courses` → `/programs/` — on the reasoning that redirecting DegreeCraft's accumulated authority into destinations with zero `verified` records would launder stale claims onto the new domain. Blanked the `new_url` on 4 `rebuild-required` blog rows so a bulk export cannot activate a 4-to-1 soft-404. Final state: 4 ready (homepage, about, contact, blog index — none depend on programme evidence), 14 hold, 4 rebuild-required, 2 not-applicable.

**Why this matters:** the previous session's report was the only record of what was safe to ship. It was wrong in ways that would have shipped P0 violations to production under the belief the launch gate had been passed. The bridge review is what caught it.

---

## 2026-07-25 — Two pre-existing CSV parse errors repaired

**Finding:** Validation caught two rows with unquoted commas inside a notes field, which silently split them into an extra column: `analytics/event-dictionary.csv` line 3 (`view_programme`) and `migration/redirect-map.csv` line 16 (Chitkara). Both predate this session. Any tool reading these files with a strict CSV parser would have mis-keyed those rows.

**Action:** Repaired both by re-joining the trailing fragments into the notes field with proper quoting. All 6 workspace CSVs now validate with consistent column counts.

---

## 2026-07-25 — D1 and Turnstile provisioned; local commit made

**Action:** With the scoped Cloudflare token, created D1 `skeure-leads` (APAC), applied the `leads` schema remote and local, bound it as `DB`. Created a managed Turnstile widget and wired canonical server-side siteverify into `functions/api/contact.ts` — running after field validation (so a corrected typo doesn't burn the single-use token), before any write, and failing closed if the secret is absent.

Verified end-to-end against real D1 and real Turnstile via `wrangler pages dev`: 6 negative paths behave correctly (garbage token → 403 proves siteverify genuinely reaches Cloudflare), 0 rows written by any rejected attempt, happy path writes a correct row using Cloudflare's documented always-passes test secret, production D1 untouched by local testing, and no PII in server logs.

Committed 69 files to the `website-build` repo as `f56ba82`. **Not deployed** — deployment is a separate decision.

**Also:** added `awesome-codex-skills/` to `website-build/.gitignore`. It's a vendored third-party clone with its own `.git`; committing it would have created a broken gitlink rather than real content.

---

## 2026-07-25 — Deployed to production (explicit approval given)

**Decision:** Pratham approved deploying the fixed build. Deployed `dist` to Cloudflare Pages project `skeure-education`. No DNS, redirect, or GSC action taken.

**Verified live on education.skeure.com after deploy:**

| Check | Result |
|---|---|
| HTTP status | 200 |
| "(Draft testimonial, pending review.)" on homepage | gone (0) |
| Star ratings (★) on university cards | gone (0) |
| "UGC-recognised universities" / "UGC-recognised university partners" | gone (0) |
| Blanket "every university we partner with" FAQ claim | gone (0) |
| Online Manipal in public partner grid | gone (0) |
| Entity schema type | `ProfessionalService` |
| `/programs/` evidence labels | 67 present (44 stale + 23 unverified), matching the ledger |
| `/financing/` "Skeure is not a lender" disclosure | present |
| noindex on privacy-policy, terms, Online Manipal, Desh Bhagat | all still `noindex, nofollow` |
| Turnstile widget on `/contact/` | present |
| Live API: missing token | 400, `field: turnstile` |
| Live API: garbage token | 403 — siteverify enforcing in production |
| Live API: GET | 405 |
| Production D1 rows after all rejected test attempts | 0 — gate held |

**Outcome:** The Days 0–7 "contain risk" exit gate (no public draft notes, no unsupported finance claim, no unverified programme presented as current) is now met on the live site. It was not met before this deploy.

---

## 2026-07-25 — Website polish batch: hero copy, uniform tiles, Desh Bhagat republish, legal drafts

Pratham gave a 9-item punch list of visible website changes. Three intersected directly with the P0 fixes from earlier the same session, so two rounds of clarifying questions were asked before implementing (see the AskUserQuestion exchanges in this session's transcript — decisions below).

**Hero copy, logo banner fix, uniform tiles, reordering (low-risk, no guardrail conflict):**
- Hero headline changed to "Same trusted university. / Now it runs online."
- Root cause of Amity's misaligned logo found and fixed: only Amity and LPU had `showName: true` in `src/data/logos.ts`, which shrank their logo image (max-h-7 vs everyone else's max-h-11) to make room for a redundant name label. That differential branch is removed; every tile now renders one uniformly bounded image (max-height AND max-width, so ultra-wide logos like Guru Kashi's 7:1 aspect ratio no longer risk overflowing the tile either).
- New `src/data/universityOrder.ts` puts Amity and LPU first in the homepage banner, homepage featured grid, and `/universities/` listing; everything else stays alphabetical.
- `UniversityCard.astro` restructured: fixed 4:3 image slot at the top (real campus photo if one exists, logo-centered placeholder otherwise), flex layout so card height is consistent regardless of accreditation-badge count.

**Evidence-status wording on tiles and `/programs/` (resolved via AskUserQuestion):** Pratham wanted the "confirmed/unconfirmed"-style per-card labels gone because they look bad next to every price — but removing them without anything else would reopen the exact P0 gap an independent Codex review had just found and fixed on `/programs/` minutes earlier. Resolved: kept one low-key, page-level disclosure paragraph (already existed on `/programs/`; added an equivalent one to `/universities/`), removed the per-card amber tags entirely. `UniversityLayout.astro`'s per-university detail-page disclosure is untouched — that's a different context and wasn't what he was objecting to.

**LPU Online MBA and Desh Bhagat verification (resolved via AskUserQuestion, two rounds):** Pratham asserted both were checked/DEB-verified. Desh Bhagat's course list was empty (two automated research passes had found zero UGC-DEB entitlement rows), so a status flip alone would have republished a page with nothing in it. Asked what was actually verified:
- **LPU's Online MBA**: Pratham said he checked the DEB portal/university site personally. Recorded as `verified_by: Pratham Goel (personal check against UGC-DEB portal / university site)`, `last_verified_at: 2026-07-25`, `status: verified` in `evidence/programme-ledger.csv` (row `lovely-professional-university-01`) — a named human reviewer's direct confirmation is exactly what the ledger's `verified_by` field exists for. Added a sentence to `lovely-professional-university.md`'s body noting this specific carve-out from the page's general "unverified" disclosure.
- **Desh Bhagat**: Pratham pointed to two files — `database/unprocessed/DBU-Online-Brochure-2025-26.pdf` and `DBU-Prospectus.pdf`. **Both are byte-identical (same MD5 checksum)** — there's exactly one real source document, not two. It's DBU's own official 2025-26 online-programme brochure: 27 pages, lists 13 real programmes (10 PG, 3 UG) with durations and eligibility, claims "UGC Entitled" and NAAC A+, includes a generic UGC public notice on ODL/online-conventional degree equivalence (not a DBU-specific UGC-DEB listing), and a real campus photo (extracted and now used as the site's Desh Bhagat tile image). No fee figures anywhere in it.
  - **This is university marketing material, not an independent UGC-DEB portal confirmation.** Restored all 13 programmes into `desh-bhagat-university.md`, removed `noindex`, but set `evidenceStatus: "stale"` — the same tier as LPU and Amity — **not `verified`**. Stated plainly here rather than silently upgraded: "DEB verified" isn't literally what this document proves, even though it's real, legitimate, citable content. Removed Desh Bhagat from the `NOINDEXED_PATHS` sitemap filter in `astro.config.mjs` (Online Manipal stays noindexed, unrelated to this batch). Updated `evidence/programme-ledger.csv` (13 new rows replacing the old zero-entitlement placeholder), `evidence/claims-register.csv` (CLM-008 → `republished-2026-07-25`), and `evidence/source-register.md`.

**Campus images (resolved via AskUserQuestion, partially completed):** Pratham chose to source real photos from each university's official site, with the copyright/accuracy risk flagged and accepted. Desh Bhagat's photo came directly from its own brochure (see above). For the other 10 published universities, a background research agent was dispatched but **hit a Claude session usage limit and failed before completing**; direct follow-up attempts (WebFetch against Amity's and LPU's own sites) confirmed these are JS-rendered single-page marketing sites that don't expose fetchable photo URLs to a non-browser fetch — exactly the risk flagged when this sourcing approach was chosen. **Only 1 of 11 published universities has a real campus photo as of this session.** The card layout degrades cleanly either way (logo-centered placeholder in the same aspect-ratio box), so nothing looks broken, but the "uniform tiles with campus images" request is only partially fulfilled. Revisit next session once the usage limit resets, or consider a manual/curated image-sourcing pass instead of automated fetching for these JS-heavy sites.

**CLM-004 (delegated to Claude):** Pratham said to decide and to advertise both LPU's and Amity's existing placement/salary figures as well as possible. Decision: keep both exactly as published, don't strengthen (no new citations exist to support stronger claims — inventing one would violate the "no invented placement/salary claims" guardrail) and don't remove (he wants them marketed, and the existing "not independently audited, ask on WhatsApp for latest" disclosure already makes them safe to keep). `claims-register.csv` CLM-004 → `kept-as-disclosed-2026-07-25`. No page changes needed; `PlacementHighlights.astro` already presents this cleanly.

**Legal pages:** Wrote substantive draft privacy policy and terms of service (`src/pages/privacy-policy.astro`, `terms.astro`), grounded in what the site actually does — D1 lead storage, Turnstile, WhatsApp, analytics currently inert, India/IT Act framing, access/deletion rights via email. This fits inside the master plan's own explicit allowance ("if reviewed legal copy is unavailable, keep the affected surface unpublished/noindex and record the blocker") — both pages stay noindexed via the existing `LegalLayout.astro` mechanism and are clearly marked draft pending real legal review. This is not a substitute for actual legal review.

**Not deployed** — matches this session's established action boundary. Stops for a separate explicit deploy decision after local build/verify.

---

## 2026-07-25 (later) — Amity logo legibility, and campus photos via Wikimedia Commons

**Amity's invisible university name (committed as `543ae4d` in `website-build`):** Pratham reported Amity's name was "in white and not being seen on the webpage." Root cause was in the image asset, not CSS: `public/logos/amity.webp` bakes an "AMITY UNIVERSITY ONLINE" wordmark in solid white pixels, sized for Amity's own dark site header. Every tile on this site sits on white or cream, so the wordmark was invisible and only the small crest showed. Verified by compositing the file onto a dark background.

- Fix: cropped the crest half out of that same official file into `public/logos/amity-crest.webp` (resized/cropped, otherwise unaltered; 4.4KB, smaller than the original). The uncropped original stays at `/logos/amity.webp` as the provenance record, and `logos.ts` documents the crop.
- The earlier entry above records the `showName` branch as "removed", but it was only removed from the *rendering* — the field, its docstring, and `showName: true` on Amity and LPU all survived in `src/data/logos.ts` as data no component read. Wired it back up in `UniversityLogoBanner.astro` only, which is the one surface where a logo appears with no accompanying name text (cards, detail pages, and `/programs/` all print the name already).
- **Correction made during implementation:** the plan was to turn LPU's `showName` off on the grounds that its wordmark is black and therefore legible. Checking it in-browser at render size showed that's wrong — LPU's mark is a circular seal whose ring text is unreadable at 44px, which is the other case the docstring covers. Kept `showName: true` for LPU. Its name wraps to two lines, so marquee tiles went `h-20` → `h-24` uniformly.

**Campus photos — 1 of 11 → 6 of 11.** Picking up the item left deferred above. Established what is actually obtainable: the local brochure store (`/home/user/automation_stack/brochures`, 157 PDFs) covers only Amity and LPU, and extracting from Amity's brochures produced generic stock portraits, not campus photography — those brochures sell an online degree and don't picture the campus. Wikimedia Commons turned out to be the workable source.

- Pratham chose "brochures + Commons now" from four options, accepting the visible photo-credit requirement.
- Added real campus photos for **Amity, LPU, Chandigarh, Chitkara, and Punjabi University**, joining Desh Bhagat's existing brochure photo. **GLA, Guru Kashi, PSOU, Mangalayatan, and MMU have no Commons coverage and no local source** — they stay on the logo fallback, which renders cleanly at the same card height.
- **Licensing approach:** Commons files are served resized but never cropped. `UniversityCard.astro` frames them with `aspect-[4/3]` + `object-cover`, so the browser crops and we distribute an unmodified copy. That keeps CC BY-SA to its attribution obligation instead of making our asset a derivative work subject to ShareAlike.
- Every photo's licence, author, and source URL is recorded in `src/data/campus-images.ts` (interface extended with `license`, `licenseUrl`, `author`, `sourceUrl`) and rendered by a new `/credits/` page that maps over that same file — a photo cannot be added without being credited. Linked from the footer's Legal & social column. Deliberately uses `BaseLayout`, not `LegalLayout`, because the latter hardcodes `noindex` plus a "not yet in effect, pending legal review" banner; an attribution notice has to actually be in effect.
- **Two judgement calls worth recording.** LPU's best Commons photo (`File:Admission-block-copy.jpg`, CC BY-SA 4.0) is claimed as the uploader's own work but is polished enough to raise a copyvio question; it has stood on Commons since 2016, so we rely on that licence in good faith, credit it in full, and note the basis in its `provenance` field. The alternative was an authentic but unflattering roadside snapshot. For Amity, the better-composed candidate carried a partially legible "ASIA'S ONLY UNIVERSITY WITH … UK … ATION" banner in-frame; rejected it in favour of a cleaner shot rather than republish an unverified marketing claim as image content.

**Verified:** `astro check` 0 errors, `tsc` clean, 25 pages built (24 + `/credits/`), checked at 1440px and 390px with no horizontal overflow. **Not deployed** — local commit only, consistent with the standing boundary above.
