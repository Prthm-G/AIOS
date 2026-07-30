# Content strategy

Companion to `keywords/keyword-to-url-map.csv`, `evidence/programme-ledger.csv`, and `audits/website-remediation-report.md`. This file separates what's already evidence-backed today from what's blocked on OpenSEO keyword validation (deferred as of 2026-07-25 — see `decisions/log.md`).

## What's already decided, independent of keyword data

These are publication decisions driven by evidence status, not search volume — they hold regardless of when OpenSEO comes online.

- **Publishable today (evidence-status disclosed on-page as `stale` or `unverified`, never silently presented as settled fact):** Amity, Chandigarh, Chitkara, GLA, Guru Kashi, Jagat Guru Nanak Dev PSOU, Lovely Professional University, Mangalayatan, MMU Mullana, Punjabi University Online & Distance — 10 of 12 university profiles.
- **Not publishable until fixed (noindexed, reachable by direct URL only):**
  - Online Manipal University — conflates 3 distinct HEIs (MAHE/Karnataka, Manipal University Jaipur/Rajasthan, Sikkim Manipal University/Sikkim). Needs a real per-entity rebuild: 3 separate pages, each with its own verified evidence.
  - Desh Bhagat University — zero UGC-DEB rows found in either research pass for any programme/mode. Needs a manual, direct DEB check before republishing or permanently retiring.
- **Zero programme records are `verified`** (per `evidence/programme-ledger.csv` and the master plan's non-negotiable rule: only `verified` records may be published as factual inventory). The `stale` records have a real primary-source citation but need a live re-confirmation pass — UGC-DEB's search UI was unscrapable in both attempts so far, PDF notices were used instead.
- **Financing content is neutralized, not expanded**, until a named regulated lender, APR/KFS, eligibility, fees, approval conditions, and legal review exist. No new financing content (rate comparisons, calculators, "how financing works" deep-dives) until that gate clears.
- **Legal pages (Privacy/Terms) stay noindexed** until reviewed legal text replaces the current draft language.

## What's blocked on OpenSEO (deferred this session)

The master plan's content workflow (seed keyword research → SERP-validated clustering → one primary intent per URL → 12-week calendar → hub/comparison/trust-guide briefs) requires live OpenSEO keyword and SERP data. None of the following can start responsibly without it — reporting invented volume/KD/traffic would violate the workspace's evidence rules:

- 12-week content calendar
- Briefs for the first six degree hubs (MBA/MCA/BBA/BCA/B.Com/BA), two trust guides, one Punjab page, three comparison pages
- Keyword clustering and cannibalization checks beyond the structural map already in `keywords/keyword-to-url-map.csv`
- Competitive-landscape / competitor-analysis informed content gaps

**Next session starting point:** authenticate OpenSEO MCP (both Claude and Codex sides — currently `AuthRequired`), run `seo-project-setup`, then `competitive-landscape`, then seed `keyword-research` per the families listed in `SEO-MARKETING-MASTER-PLAN.md` (MBA, MCA, BBA, BCA, B.Com, BA, UGC entitlement, validity, fees, comparisons, admissions, exams, refunds, Punjab counselling).

## First-wave information architecture (from the master plan, not yet built)

```text
/online-degrees/
/online-degrees/mba/
/online-degrees/mca/
/online-degrees/bba/
/online-degrees/bca/
/online-degrees/bcom/
/online-degrees/ba/
/ugc-entitled-online-universities/
/guides/is-an-online-degree-valid-in-india/
/guides/online-vs-distance-degree/
/guides/online-degree-government-jobs-upsc/
/compare/amity-vs-lpu-online-mba/
/compare/amity-vs-manipal-online-mba/
/compare/lpu-vs-chandigarh-online-mba/
/online-degrees/punjab/
```

None of these exist yet. Building them before keyword/SERP validation risks cannibalizing the existing `/universities/` and `/programs/` pages and would violate the "one primary intent per URL" rule in `keywords/keyword-to-url-map.csv`. Do not scaffold these routes until the corresponding keyword-research/clustering pass approves them.

## Editorial standard (applies to every future page)

Per the master plan's non-negotiable publication standard — every education or finance page needs: a named owner/reviewer, last-reviewed/next-review dates, official primary sources, exact awarding institution + programme + mode + academic session, a normalized total-fee figure, intake/eligibility/exam/refund detail, a commercial disclosure, a correction path, and no claim untraceable to `evidence/programme-ledger.csv` or `evidence/claims-register.csv`.
