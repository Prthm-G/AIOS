# Skeure Education SEO and Marketing Master Plan

**Created:** 24 July 2026  
**Primary site:** https://education.skeure.com/  
**Legacy site:** https://degreecraft.com/  
**Website source:** `/home/user/workspaces/AIOS/website-build`  
**SEO workspace:** `/home/user/workspaces/AIOS/skeure-edu-seo`  
**Business objective:** Build a trustworthy, measurable acquisition system that supports Skeure's target of 100 admissions by 30 September 2026 and compounds after that date.

## Executive decision

Do not begin by publishing dozens of pages or buying links. The website first needs a launch gate covering factual accuracy, regulatory and financial claims, legal pages, brand migration, measurement, and lead capture.

The recommended operating model is:

1. Use `website-build` for code, content implementation, testing, and deployment.
2. Use `skeure-edu-seo` for strategy, evidence, keyword data, briefs, reports, outreach, and operating history.
3. Use the hosted OpenSEO plan for live keyword, SERP, backlink, rank-tracking, site-audit, AI-visibility, and Search Console data.
4. Connect the OpenSEO MCP project to Claude.
5. Use Claude for repository implementation, and run an explicit adversarial pass over material work before accepting it. A draft is never accepted on its own confidence.
6. Require human approval for factual education claims, legal text, finance text, redirects, production deployment, outreach, and paid advertising.

SEO alone is unlikely to produce the full September admissions target from a nearly invisible new brand in roughly two months. The first 68 days should combine SEO foundations with local search, partner proof, high-intent paid search after remediation, WhatsApp follow-up, referral activation, webinars, and remarketing.

## Scope

### In scope

- Technical SEO, crawlability, indexation, migration, structured data, performance, accessibility, and UX.
- Programme-level UGC-DEB and official-university fact verification.
- Keyword research, content architecture, content production, internal linking, local SEO, digital PR, and ethical link acquisition.
- Google Search Console, Bing Webmaster Tools, analytics, consent, lead attribution, and conversion reporting.
- Brand entity, Google Business Profile, reviews, social proof, local authority, partnerships, and multi-channel content distribution.
- Claude, installed skills/agents, and OpenSEO MCP orchestration.

### Out of scope without separate expert approval

- Final legal advice or regulatory conclusions.
- Invented testimonials, ratings, placements, salary outcomes, partner status, or accreditation claims.
- Automatic outreach, bulk link buying, review incentives that violate platform rules, or mass programmatic pages.
- Production deployment, old-domain redirects, Google Change of Address, ad spend, or messages sent to prospects without explicit approval.

## Current audit: issues to tackle

### P0: stop harm before growing traffic

1. **Public draft content:** 18 of 23 sitemap URLs contain draft, placeholder, or pending-review language. This includes all university profiles, the only article, About, legal pages, and testimonials.
2. **Programme accuracy:** 11 of 12 university files reuse a generic eight-programme skeleton. Verified mismatches were found for PSOU, Desh Bhagat, and MMU. Recognition must be verified by exact awarding HEI, programme, mode, and academic session using the [UGC-DEB programme list](https://deb.ugc.ac.in/Home/HEI_Prog_List).
3. **Manipal entity conflation:** “Online Manipal University” combines multiple degree-awarding institutions that need separate records, entitlements, fees, and pages.
4. **Unsupported finance promotion:** “0% p.a.,” same-day approval, no collateral, loan range, fee, and no-prepayment claims appear while the lender and terms are marked pending confirmation. Remove the promotion until a regulated lender, APR/KFS, eligibility, fees, approval conditions, grievance route, and legal review exist.
5. **Draft legal pages:** Privacy and Terms publicly state they are unfinished. The site collects or solicits names, phone, email, programme interest, WhatsApp contact, and financing enquiries.
6. **Unsupported trust signals:** University ratings, testimonials, placement claims, salary numbers, learner counts, and recruiter references lack sufficient provenance, date, methodology, or review count.
7. **Broken lead plumbing:** The contact form opens `mailto:` rather than reliably storing a lead, producing a CRM record, or measuring conversion.
8. **Unfinished migration:** DegreeCraft remains live, crawlable, and discoverable with overlapping content. Skeure and DegreeCraft split authority, entity signals, links, and user trust.

### P1: establish a rankable and measurable foundation

1. Replace `Home · Skeure Education` with a descriptive search title and rewrite the H1 around verified value.
2. Create programme-level landing pages. The single huge Programs page is not a usable comparison or rankable information architecture.
3. Add named authors, reviewers, credentials, official sources, “last verified” dates, editorial methodology, corrections policy, and commercial disclosure.
4. Correct Skeure's entity type. It is a counselling/intermediary service, not a degree-awarding educational institution.
5. Establish consistent legal name, public NAP, Skeure social profiles, partner proof, and parent-domain relationship.
6. Install Google Search Console, Bing Webmaster Tools, GA4 or another privacy-compliant analytics system, consent handling, CRM/server-side form capture, and CTA events.
7. Add accurate `Organization`/service schema, `BreadcrumbList`, `Article`, `ItemList`, and defensible course/provider relationships. Do not add review schema for unsupported ratings.
8. Correct low-contrast text, mobile-dialog behavior, focus management, touch targets, and disclosure accessibility.
9. Optimize oversized logos and the OG image. Apply long-lived immutable caching to fingerprinted assets.
10. Remove unnecessary internal trailing-slash redirects by making internal links match canonical URLs.

### P2: build demand and authority after the launch gate

1. Build verified degree hubs, comparison pages, trust guides, local pages, and original data assets.
2. Acquire links through partner listings, expert contributions, local institutions, useful data, scholarships/events, and press outreach. Do not buy bulk links.
3. Build review collection only from real students with consent and platform-compliant requests.
4. Repurpose each verified cornerstone page into short video, webinar, WhatsApp FAQ, email, and social content.
5. Run high-intent paid search and remarketing only after landing pages, disclosures, analytics, and CRM attribution are reliable.
6. Expand into Punjabi and Hindi only with human-reviewed localization and correct `hreflang`.

## Non-negotiable publication standard

Every education or finance page must have:

- A clear owner and human reviewer.
- Last reviewed and next review dates.
- Official primary sources.
- Exact awarding institution, programme name, mode, and applicable academic session.
- A normalized total-fee figure with compulsory fees and discount assumptions separated.
- Intake, eligibility, exam mode, refund path, and official application link where applicable.
- A commercial disclosure describing partner/commission relationships and ranking methodology.
- A correction path.
- No claim that cannot be traced to a source in the evidence ledger.

Create the evidence ledger with these fields:

```text
record_id
awarding_hei
platform_or_brand
exact_programme
mode
academic_session
ugc_deb_source_url
official_programme_url
fee_source_url_or_file
fee_basis
compulsory_fees
discount_assumptions
intake
eligibility
exam_mode
refund_source
last_verified_at
verified_by
status
notes
```

Allowed statuses: `unverified`, `verified`, `stale`, `disputed`, `retired`.

Only `verified` records may be published as factual programme inventory.

## Recommended positioning

Initial position:

> Punjab-based, partner-funded online-degree counselling with programme-level UGC verification, comparable total costs, and human support in English, Hindi, and Punjabi.

Positioning rules:

- Do not use “independent” or “unbiased” if Skeure earns partner commission.
- Disclose how Skeure is paid and how universities are ordered or recommended.
- Say “UGC-entitled/recognised for [programme], [mode], [session]” instead of blanket “UGC-approved university.”
- Explain who Skeure is for and who should apply directly to the university instead.
- Make the service promise concrete: verification, cost normalization, application support, local language support, and responsive human help.

## Workspace architecture

The setup prompt later in this document should create:

```text
skeure-edu-seo/
  README.md
  SEO-MARKETING-MASTER-PLAN.md
  AGENTS.md
  CLAUDE.md
  .claude/
    skills/
  evidence/
    programme-ledger.csv
    source-register.md
    claims-register.csv
  audits/
    baseline/
    technical/
    content/
    accessibility/
    regulatory/
  gsc/
  analytics/
    measurement-plan.md
    event-dictionary.csv
    dashboards/
  keywords/
    seeds/
    raw/
    clusters/
    keyword-to-url-map.csv
  competitors/
  content/
    strategy.md
    briefs/
    drafts/
    review-queue/
    published/
  migration/
    degreecraft-url-inventory.csv
    redirect-map.csv
    validation/
  local-seo/
  outreach/
    prospects/
    approved/
    results/
  campaigns/
    paid-search/
    webinars/
    referrals/
    email-whatsapp/
  reports/
    weekly/
    monthly/
  decisions/
    log.md
```

The SEO workspace stores evidence and plans. Production copy belongs in `website-build/src/` only after approval.

## Tooling plan

### OpenSEO hosted plan

Use the hosted plan first rather than self-hosting.

- Current price: $10/month.
- Includes $10 of usage each month.
- Includes keyword research, backlinks, rank tracking, and site audits.
- Search Console access does not consume credits.
- Additional top-up credits do not expire, but the monthly included credits reset.
- Credit-consuming work stops when credits are exhausted, preventing unexpected overages.

Sources: [OpenSEO pricing](https://openseo.so/pricing) and [OpenSEO repository](https://github.com/every-app/open-seo).

Suggested first-month budget:

| Work | Suggested allowance |
|---|---:|
| 60–100 focused keyword searches | $3.00–$5.00 |
| 10–20 competitor/backlink checks | $0.80–$1.60 |
| Weekly tracking for 50 high-intent keywords | about $0.54 |
| Audits of the current 23-page site | minimal |
| One or two AI-brand visibility checks | only if budget remains |
| Reserve for SERP validation and unexpected checks | remaining balance |

AI-brand checks are comparatively expensive. Run them monthly, not daily.

### OpenSEO MCP setup

After subscribing and creating the Skeure project:

```bash
claude mcp add --transport http --scope user openseo https://app.openseo.so/mcp
```

Approve the browser login. Verify with read-only `whoami` and `list_projects`. Never claim OpenSEO or Search Console is connected until these calls succeed.

Connect Google Search Console for:

- A domain property for `skeure.com`, including `education.skeure.com`.
- The existing `degreecraft.com` property.

Retain both during migration. The old property reveals URLs, queries, and links worth preserving.

### OpenSEO skills to install

Run from `skeure-edu-seo`:

```bash
npx skills add every-app/open-seo --skill '*' --agent claude-code
```

The current repository exposes these public workflows:

1. `seo-project-setup`
2. `seo-coach`
3. `keyword-research`
4. `keyword-clustering`
5. `competitive-landscape`
6. `competitor-analysis`
7. `link-prospecting`

The GitHub README previously referenced `onboarding-checklist`; the current checked repository uses `seo-project-setup`. Use the current name.

Recommended sequence:

```text
seo-project-setup
→ competitive-landscape
→ keyword-research
→ keyword-clustering
→ competitor-analysis
→ link-prospecting
```

Do not start `link-prospecting` until a verified, useful linkable asset exists.

## Claude capability inventory and assignments

### Workspace-root Claude skills

| Skill | Use |
|---|---|
| `/audit` | Monthly structural audit of the AI operating system, not an SEO audit |
| `/level-up` | Weekly automation review; use for one SEO/marketing automation at a time |
| `/onboard` | Already completed; rerun only when business context materially changes |

### User-level Claude agents

| Agent | Assignment |
|---|---|
| `codebase-explorer` | Map relevant implementation files before broad changes |
| `researcher` | Verify current official UGC, university, Google, RBI, and platform documentation |
| `code-reviewer` | Review completed diffs; keep this local read-only version instead of the looser plugin duplicate |
| `security-auditor` | Review the new lead endpoint, validation, consent, secrets, CRM integration, and sensitive logging |

### Installed Claude plugins and marketplace agents

| Agent or skill | Assignment | Constraint |
|---|---|---|
| `frontend-design` | Required by `website-build/AGENTS.md` before any frontend implementation | Always invoke before UI code |
| `accessibility-tester` | WCAG audit and regression checks | Installed VoltAgent agent |
| `ai-writing-auditor` | Remove AI patterns after factual and editorial review | Must not invent facts while rewriting |
| `competitive-analyst` | Competitor positioning and content gap research | Prefer official/current sources |
| `search-specialist` | Precise source discovery for regulatory and programme facts | Retrieval, not final judgment |
| `market-researcher` | Audience and local-market research | Avoid unsupported market-size estimates |
| `ui-ux-tester` | Full interaction-flow and mobile UX testing | Needs Chrome MCP/computer-use availability |
| `performance-engineer` | Performance regression review | Use after functional correctness |
| `visual-asset-generator` | OG images, social assets, and favicons | Needs prompt-to-asset MCP; otherwise output prompts |
| `chrome-devtools-mcp` | Browser diagnostics and screenshots | Confirm availability in the new session |

Installed agents load at session start. Start a fresh Claude Code session after installing or changing plugins.

### Useful `website-build/awesome-codex-skills`

Use only the relevant subset:

- `content-research-writer`
- `webapp-testing`
- `brand-guidelines`
- `competitive-ads-extractor`
- `lead-research-assistant`
- `create-plan`
- `issue-triage`
- `changelog-generator`

Most of the 48 local skills are unrelated to this project and should not be loaded into every task.

## Capability plan (historical Codex catalog)

> **Superseded 2026-08-16.** The ChatGPT plan ended and the Codex install was
> removed from this machine, so the skill catalog in the table below is no
> longer available. The workstream decomposition and the constraints under it
> are still the operating guidance; source equivalent coverage from Claude
> skills or do the work directly.

### Workstreams and the skills they used

| Workstream | Installed skills |
|---|---|
| Baseline and technical | `seo-audit`, `seo-technical`, `indexing-issue-auditor`, `seo-sitemap`, `frontend-seo` |
| Keyword and architecture | `seo-aeo-keyword-research`, `seo-aeo-content-cluster`, `seo-structure-architect`, `seo-cannibalization-detector` |
| Content review | `seo-aeo-content-quality-auditor`, `seo-content-auditor`, `avoid-ai-writing`, `copy-editing` |
| Internal links and schema | `seo-aeo-internal-linking`, `schema-markup`, `seo-schema` |
| Measurement | `analytics-tracking`, `google-analytics-automation` |
| UX, accessibility, and speed | `ux-audit`, `accessibility-compliance-accessibility-audit`, `web-performance-optimization` |
| Research and positioning | `marketing-plan`, `competitive-landscape`, `customer-research`, `product-marketing` |
| Trust and authority | `seo-authority-builder`, `social-proof-architect`, `apify-brand-reputation-monitoring` |
| Local growth | `ai-seo`, `seo-geo`, plus a custom education-local checklist |

Important constraints:

- `competitor-analysis` requires Browserbase and a `BROWSERBASE_API_KEY`; prefer OpenSEO's competitor skill unless Browserbase is configured.
- `local-legal-seo-audit` is specifically for law firms. Do not use it as the main local SEO method for Skeure.
- `programmatic-seo` and `seo-programmatic` are explicitly postponed until the programme evidence schema is stable and every generated page has unique value.
- `seo-dataforseo` is redundant when the OpenSEO subscription/MCP supplies the same data. Avoid paying twice.
- `social-proof-architect` may optimize placement only after the proof itself is genuine and sourced.

### Independent reviewer roles

Spawn bounded, independent reviewers rather than one “do everything” agent:

1. **Technical SEO auditor:** crawl/indexation, rendering, canonicals, schema, performance.
2. **Regulatory fact checker:** UGC-DEB, official university sources, finance-claim evidence.
3. **Migration specialist:** DegreeCraft inventory, equivalence mapping, redirects, launch validation.
4. **Content and AEO strategist:** intent, clusters, briefs, answer completeness, citation quality.
5. **Analytics engineer:** event dictionary, attribution, CRM flow, dashboard QA.
6. **UX/accessibility auditor:** mobile journeys, forms, WhatsApp flow, WCAG.
7. **Adversarial reviewer:** challenge unsupported claims, duplicated templates, and recommendations before release.

Never let the same agent both make and approve a high-risk factual claim.

## Measurement architecture

### North-star metric

**Verified organic-assisted admissions**, not traffic.

### Funnel

```text
Search impression
→ qualified landing-page visit
→ programme/university engagement
→ WhatsApp, call, or form lead
→ counselling booked
→ application started
→ admission confirmed
```

### Required events

- `view_programme`
- `view_university`
- `use_filter`
- `start_comparison`
- `complete_comparison`
- `click_whatsapp`
- `click_call`
- `click_email`
- `submit_lead`
- `lead_submit_error`
- `download_brochure`
- `exit_to_university`
- `book_counselling`
- `application_started`
- `admission_confirmed`

Every event should include safe, non-sensitive dimensions where appropriate:

`page_type`, `programme`, `university`, `cta_location`, `language`, `campaign`, `source`, and `landing_page`.

Do not send student names, phone numbers, email addresses, message bodies, or other PII to GA4.

### Weekly scorecard

- Clean indexed URLs versus submitted URLs.
- GSC non-brand impressions, clicks, CTR, and average position.
- Number of priority keywords in positions 1–3, 4–10, 11–20.
- Qualified organic leads and lead-to-counselling rate.
- Counselling-to-application and application-to-admission rate.
- WhatsApp/call/form attribution completeness.
- Pages with stale evidence.
- Content briefs approved, pages published, and updates completed.
- Referring domains earned, not purchased.
- GBP calls, direction requests, website clicks, and review velocity.

## Information architecture

First-wave pages:

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

Each university page should identify the exact awarding institution. Only create a university × programme page if it has unique, verified decision value. Do not generate every permutation.

Second-wave clusters:

- MBA specialisations: finance, HR, analytics, digital marketing, healthcare, supply chain.
- MCA/BCA: data science, AI/ML, cybersecurity, full stack.
- Fee intent: total cost, compulsory fees, scholarships, refunds, EMI/KFS.
- Decision intent: live versus recorded, examination mode, January versus July intake, working-professional fit.
- Trust intent: recognition, DEB ID, government jobs, higher education, employer acceptance, online versus ODL.
- Audience intent: after Class 12, working professionals, career returners, Punjab students.

## Brand and marketing system

### Local SEO

- Create or correct one genuine Google Business Profile for the actual staffed location.
- Use consistent public name, address, phone, hours, categories, services, and website.
- Add real office/team photos and service descriptions.
- Publish useful GBP posts tied to verified intakes and guides.
- Ask real counselled/admitted students for honest reviews without scripts, incentives, or review gating.
- Answer every review and Google Q&A accurately.
- Build legitimate Punjab citations and partner references.

### Conversion

- Replace `mailto:` with a secure server-side or Cloudflare function endpoint.
- Send leads to Kuanli/CRM with consent, source, campaign, landing page, programme, and university interest.
- Keep WhatsApp as a primary CTA but measure it and preserve source attribution.
- Set clear response-time ownership and SLA.
- Add deterministic success/error states and anti-spam controls.
- Use call tracking only if privacy, local-number trust, and operational handling are acceptable.

### Content distribution

For each cornerstone page:

1. Publish the complete sourced page.
2. Create one short explainer video.
3. Create 3–5 social posts.
4. Create one WhatsApp FAQ sequence.
5. Create one email/nurture item.
6. Use the page in a live webinar or counselling session.
7. Capture real questions and feed them back into the page.

### Authority and PR

Build assets that deserve references:

- Quarterly UGC programme-entitlement tracker.
- Normalized online-degree fee report with methodology.
- Intake and deadline calendar.
- Refund-policy comparison.
- Exam-mode and support comparison.
- Punjab student question survey.
- Transparent “how Skeure ranks programmes” methodology.

Outreach targets:

- Verified university partner/authorised-counsellor pages.
- Local colleges, training centres, libraries, chambers, and community organisations.
- Education journalists and regional media.
- Career counsellors and credible educators.
- Relevant resource pages and data journalists.

### Paid acquisition for the September target

Do not wait for SEO alone, but do not advertise unsafe claims.

After P0 remediation and analytics:

- Run exact/phrase high-intent Google Search campaigns for verified programme and local counselling intent.
- Exclude jobs, free courses, question papers, PDFs, results, login, and unrelated campus intent.
- Use separate campaigns by programme and location.
- Send traffic to verified programme pages, not the homepage.
- Track counselling and admission outcomes, not only form submissions.
- Add remarketing only after consent and sufficient traffic.
- Pause any ad group whose landing page evidence becomes stale.

## DegreeCraft migration plan

1. Export all DegreeCraft URLs, GSC queries/pages, backlinks, and analytics landing pages.
2. Classify each URL: preserve, rebuild, merge, redirect, retire, or remain separate.
3. Rebuild useful old content on Skeure before redirecting it.
4. Map every preserved old URL to its closest new equivalent.
5. Avoid blanket homepage redirects.
6. Validate the new page, canonical, internal links, and sitemap.
7. Launch server-side 301/308 redirects only after Skeure passes the launch gate.
8. Verify both domains in GSC and submit Skeure's sitemap.
9. Use Google's Change of Address after redirects are live and tested.
10. Keep redirects for at least one year and preferably longer.
11. Monitor old URL hits, 404s, canonical selection, index coverage, rankings, and backlinks weekly during migration.

Reference: [Google site-move documentation](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## 90-day roadmap

### Days 0–7: contain risk

- Noindex or remove every draft/unverified URL from production and the sitemap.
- Remove draft testimonials and unsupported ratings.
- Remove or neutralize financing promotion.
- Build the evidence, claims, and source registers.
- Correct PSOU, Desh Bhagat, MMU, and Manipal first.
- Replace the contact form architecture.
- Establish legal-review and factual-review owners.
- Connect GSC for old and new properties.

**Exit gate:** no public draft notes; no unsupported finance claim; no unverified programme presented as current.

### Days 8–14: measurement and trust

- Implement analytics, consent, event dictionary, CRM attribution, and form/WhatsApp QA.
- Publish reviewed privacy, terms, commercial disclosure, editorial policy, corrections policy, and reviewer profiles.
- Correct entity schema, social profiles, NAP, titles, and metadata.
- Fix critical accessibility and mobile navigation issues.
- Build a DegreeCraft URL inventory and redirect map without activating it.

**Exit gate:** leads are captured and attributable; business identity and disclosure are coherent.

### Days 15–30: migration and first rankable pages

- Complete keyword landscape and clustering with OpenSEO.
- Publish the first six verified degree hubs and two trust guides.
- Upgrade the university directory into a useful decision interface.
- Rebuild important DegreeCraft content.
- Test and activate one-to-one redirects, then submit the migration.
- Establish weekly rank tracking for 50 priority keywords.

**Exit gate:** the clean Skeure site is the canonical home of the brand and its most valuable old content.

### Days 31–60: high-intent acquisition

- Publish three verified comparison pages and the Punjab landing page.
- Add normalized fee tables, intake, exam, refund, and last-checked fields.
- Launch GBP content and ethical review collection.
- Launch the first webinar and referral/partner outreach.
- Begin tightly controlled paid search.
- Create one linkable original-data asset.

### Days 61–90: compound what works

- Use GSC and lead data to choose the next 8–12 pages.
- Refresh any session-sensitive evidence.
- Expand winning hubs into specialisations and audience guides.
- Run digital PR around the data asset.
- Publish human-reviewed Punjabi/Hindi versions of proven pages.
- Consolidate cannibalizing or low-value pages.
- Review SEO-to-admission economics and reset the next-quarter roadmap.

## Definition of done

The foundation is ready for scaled SEO only when:

- Zero public draft or placeholder notices remain.
- Every published programme has verified session-level evidence.
- Finance content has named, reviewed, complete disclosures or is absent.
- Real legal pages and commercial disclosures are live.
- Ratings and testimonials are genuine, sourced, and consented.
- The lead form works without a local email client and creates an attributable CRM record.
- Both GSC properties and analytics are operational.
- DegreeCraft migration is mapped, tested, and monitored.
- Priority templates pass mobile, accessibility, link, schema, and build checks.
- The content roadmap is driven by OpenSEO/GSC evidence and business conversion data.

---

# Master Prompt 1: repair `website-build`

Run this in a fresh Claude Code session from:

```bash
cd /home/user/workspaces/AIOS/website-build
```

Copy the complete prompt below.

```text
You are the implementation lead for Skeure Education. Your job is to repair the existing Astro website so it passes an SEO, factual-trust, accessibility, measurement, and migration-readiness launch gate.

Read these before acting:
- ./AGENTS.md and the CLAUDE.md symlink
- ./README.md
- ./PLANNING.md
- /home/user/workspaces/AIOS/skeure-edu-seo/SEO-MARKETING-MASTER-PLAN.md

Repository: /home/user/workspaces/AIOS/website-build
Production: https://education.skeure.com/
Legacy site: https://degreecraft.com/
Date: use the current session date.

Mandatory working rules:
1. Check git status first. Preserve all existing user changes. Do not reset, discard, commit, push, deploy, alter DNS, activate redirects, submit GSC changes, send messages, or buy anything.
2. Invoke the frontend-design skill before writing any frontend code, as AGENTS.md requires.
3. Use read-only discovery agents in parallel where available:
   - codebase-explorer for source/data-flow mapping
   - researcher and search-specialist for current official UGC-DEB, official university, Google, and RBI evidence
   - accessibility-tester for WCAG findings
   - ui-ux-tester for representative desktop/mobile flows if browser tooling works
   - competitive-analyst only for decision-interface patterns, not factual programme claims
4. Use the local read-only code-reviewer after implementation. Use security-auditor for the form/CRM/consent boundary. Do not invoke the looser plugin duplicates for those two names.
5. Treat education, recognition, placement, salary, testimonial, review, partner, and financing claims as high-risk. Never infer or invent missing facts.
6. A university's general recognition is not proof that every programme/mode/session is entitled. Verify the exact programme, mode, awarding HEI, and academic session using UGC-DEB plus the official university source.
7. Do not write final legal advice. If reviewed legal copy is unavailable, keep the affected surface unpublished/noindex and record the blocker.
8. Do not use unsupported ratings, invented testimonials, aggregate-rating schema, or claims of unbiased advice while commissions exist.

Work in ordered phases.

Phase A: reproduce and inventory
- Build a URL and content inventory covering all sitemap pages.
- Locate all draft/placeholder/pending-review text, ratings, testimonials, financial claims, placements/salaries, entity data, schema, titles, canonicals, forms, analytics, robots, and sitemap generation.
- Build or update a machine-readable claims/evidence report under /home/user/workspaces/AIOS/skeure-edu-seo/evidence/.
- Verify current programme records against official sources. Mark each record verified, unverified, stale, disputed, or retired.
- Produce a P0/P1 implementation checklist before editing.

Phase B: contain P0 risk
- Remove unpublished/draft URLs from the sitemap and add noindex or unpublish them.
- Remove all public editorial notes.
- Remove unsupported ratings and draft testimonials.
- Remove or neutralize financing promotion until named lender, APR/KFS, eligibility, fees, approval conditions, grievance route, and legal approval exist.
- Split the Online Manipal platform into correct awarding institutions or keep it unpublished until verified.
- Correct PSOU, Desh Bhagat, MMU, then verify every remaining university.
- Ensure blanket validity/recognition statements are qualified by programme, mode, session, and applicable authority.
- Keep legal placeholders unpublished/noindex until reviewed text is supplied.

Phase C: fix trust, entity, and conversion
- Correct Skeure's schema to an accurate counselling/service entity, with verified legal/public details and sameAs profiles.
- Add visible commercial disclosure, editorial methodology, corrections path, reviewer identity, sources, and last-verified dates where approved facts exist.
- Replace the mailto form with a secure, reliable endpoint appropriate to the existing Cloudflare/Astro deployment. Use server-side validation, honeypot or rate limiting, deterministic success/error states, consent, and safe logging. Do not send PII to analytics.
- Add a documented event layer for WhatsApp, calls, email, form success/error, brochure downloads, university exits, programme views, and comparisons. Do not insert real analytics IDs or secrets unless already available; use typed/configurable placeholders and document required environment variables.

Phase D: fix technical SEO and UX
- Replace UI-label titles such as “Home” with descriptive, intent-aligned metadata.
- Make internal URLs match canonical trailing-slash behavior and remove needless redirect hops.
- Add accurate BreadcrumbList, Article, ItemList, and appropriate provider/course relationships only where visible content supports them.
- Fix low-contrast text, mobile menu Escape/focus/trap/restore/scroll behavior, undersized critical touch targets, and form error accessibility.
- Optimize oversized logos/OG media and document immutable caching requirements for fingerprinted assets.
- Preserve the successful static rendering, one-H1 structure, reduced-motion behavior, and responsive hero.

Phase E: create migration readiness, but do not activate it
- Inventory degreecraft.com URLs and create /home/user/workspaces/AIOS/skeure-edu-seo/migration/redirect-map.csv.
- Map useful old URLs one-to-one to the closest verified new page.
- Mark missing destination content as rebuild-first.
- Do not redirect all pages to the homepage.
- Write a deployment/migration checklist with rollback and post-launch monitoring. Stop before any live redirect, Change of Address, DNS, or deployment action.

Validation is mandatory:
- npm run build
- npx astro check
- crawl the built output for status, titles, descriptions, canonical, robots, one H1, internal links, sitemap membership, schema parseability, and public draft terms
- test representative pages at 390x844 and 1440x900
- test keyboard-only navigation, mobile menu, form success/error, reduced motion, and no-JS rendering
- run accessibility and performance checks proportionate to the changes
- run code-reviewer and security-auditor on the final diff
- fix verified findings, then rerun affected checks

Deliverables:
- Implement safe local fixes.
- Create /home/user/workspaces/AIOS/skeure-edu-seo/audits/website-remediation-report.md with evidence, changes, unresolved blockers, validation results, and exact production actions still requiring approval.
- Create or update the evidence ledger and redirect map.
- End with: files changed, tests passed/failed, residual risks, and the single next approval needed.

Do not stop at an audit if a safe local fix is possible. Do stop before claims that need missing evidence, final legal language, external messages, deployment, DNS, redirects, paid actions, or destructive operations.
```

---

# Master Prompt 2: set up and operate `skeure-edu-seo`

Run this in a fresh Claude session from:

```bash
cd /home/user/workspaces/AIOS/skeure-edu-seo
```

Copy the complete prompt below.

```text
You are the SEO and growth operations lead for Skeure Education. Build a durable, evidence-led SEO and marketing operating system in this folder.

Read first:
- ./SEO-MARKETING-MASTER-PLAN.md
- /home/user/workspaces/AIOS/CLAUDE.md
- /home/user/workspaces/AIOS/website-build/AGENTS.md
- /home/user/workspaces/AIOS/website-build/README.md
- /home/user/workspaces/AIOS/website-build/PLANNING.md

Sites:
- primary: https://education.skeure.com/
- legacy: https://degreecraft.com/
- root brand domain: https://skeure.com/

Business context:
- Punjab-based online-degree counselling
- English, Hindi, and Punjabi audience
- target: 100 admissions by 30 September 2026
- SEO must optimize for verified admissions, not vanity traffic

First verify capabilities:
1. Check whether the OpenSEO skills are installed locally. The required public skills are seo-project-setup, seo-coach, keyword-research, keyword-clustering, competitive-landscape, competitor-analysis, and link-prospecting.
2. If missing, install them for the active agent using the official every-app/open-seo skill installer. Do not overwrite custom project files.
3. Check OpenSEO MCP using only whoami and list_projects. Use the returned opaque project ID exactly. If authentication is required, pause only for the login and continue after it succeeds.
4. Confirm whether Google Search Console is connected for skeure.com/education.skeure.com and degreecraft.com. Never claim it is connected unless the MCP call proves it.
5. Inventory available installed Claude skills and agents named in this master plan. Use only direct fits.

Create the workspace structure defined in SEO-MARKETING-MASTER-PLAN.md. Preserve the master plan. Add:
- README.md with purpose, current phase, owners, commands, and navigation
- AGENTS.md and CLAUDE.md with shared operating rules
- decisions/log.md
- evidence/programme-ledger.csv
- evidence/claims-register.csv
- evidence/source-register.md
- analytics/measurement-plan.md
- analytics/event-dictionary.csv
- migration/degreecraft-url-inventory.csv
- migration/redirect-map.csv
- keywords/keyword-to-url-map.csv
- content/strategy.md
- reports/weekly/weekly-template.md
- reports/monthly/monthly-template.md

Use bounded agents in parallel:
- technical SEO auditor
- regulatory fact checker
- migration specialist
- content/AEO strategist
- analytics engineer
- UX/accessibility auditor
- adversarial reviewer

Claude-specific preferred agents when available:
- researcher or search-specialist for official-source retrieval
- competitive-analyst for the market
- accessibility-tester
- ui-ux-tester
- code-reviewer for changes to workspace scripts/templates

Coverage the retired Codex catalog used to provide, still required from whatever
tooling is available: technical/indexation audit, AEO keyword research and content
clustering, content-quality audit, internal linking, schema markup, analytics
tracking, UX and accessibility audit, and marketing planning.

OpenSEO workflow:
1. Run seo-project-setup and record the project context.
2. Pull first-party GSC baselines for old and new properties when connected.
3. Run competitive-landscape for Indian online-degree comparison/counselling and a Punjab/local view.
4. Research seed families for MBA, MCA, BBA, BCA, B.Com, BA, UGC entitlement, validity, fees, comparisons, admissions, exams, refunds, and Punjab counselling.
5. Use keyword metrics and live SERPs to prioritize. Do not report unqueried volume, KD, traffic, or backlinks as facts.
6. Cluster by search intent and actual SERP overlap, then map one primary intent to one URL.
7. Deep-audit only the true search competitors found in the data.
8. Save the final approved keyword sets with clear tags.
9. Postpone link prospecting until at least one verified linkable asset exists.

Strategy outputs:
- A baseline report separating verified facts, OpenSEO estimates, first-party GSC data, and inference.
- A P0/P1/P2 backlog with owner, evidence, dependency, acceptance test, status, and due date.
- A keyword-to-URL map that prevents cannibalization.
- A 12-week content calendar based on business value, ranking feasibility, and evidence readiness.
- Briefs for the first six degree hubs, two trust guides, one Punjab page, and three comparisons.
- A DegreeCraft migration inventory and redirect recommendation.
- A local SEO plan for one genuine location.
- A brand/entity plan covering Skeure, DegreeCraft, root domain, social profiles, partner proof, and NAP.
- A marketing plan covering GBP, webinars, referrals, partner activity, email/WhatsApp nurture, ethical reviews, original-data PR, paid search, and remarketing.
- A dashboard specification joining search source to counselling, application, and admission.

Hard guardrails:
- No programme is publishable without exact HEI/programme/mode/session evidence.
- No finance claim without named provider, APR/KFS, terms, and legal review.
- No invented ratings, testimonials, placements, salary outcomes, partner status, or citations.
- No “independent” or “unbiased” claim while commissions exist.
- No programmatic university x programme x city pages until the dataset and unique-value test pass.
- No bulk backlinks, paid links, automated review solicitation, or automatic outreach.
- No external messages, ad spend, production edits, redirects, GSC Change of Address, or deployment without explicit approval.
- Do not put API keys, auth tokens, PII, or student data in this repository.
- Distinguish source evidence from inference in every report.

Budget controls for the $10 OpenSEO plan:
- Prefer GSC first because it consumes no credits.
- Keep broad keyword exploration to a planned seed list.
- Track approximately 50 priority keywords weekly.
- Limit competitor/backlink checks to decision-relevant domains and pages.
- Run expensive AI-brand checks monthly at most.
- Record estimated and actual monthly credit use in reports/monthly/.

Operating cadence:
- Monday: GSC/indexation/lead pipeline review and weekly priorities.
- Wednesday: content/evidence review and one publication decision.
- Friday: technical regressions, rankings, conversions, and one AIOS /level-up automation review.
- Monthly: full KPI report, claims freshness audit, backlink review, content pruning, and roadmap reset.
- Quarterly: UGC/session/fee re-verification and original-data report.

Before finishing:
- Validate all created CSV headers and Markdown links.
- Ensure README links to every operational artifact.
- Confirm no secrets or PII were written.
- Have the adversarial reviewer challenge unsupported assumptions and duplication.
- Correct verified issues.

Finish with:
1. Workspace files created.
2. OpenSEO/MCP/GSC status.
3. Baseline facts and data limitations.
4. Top ten actions in exact execution order.
5. The single next human decision or authentication step.

Do not merely propose the workspace. Create the safe local files and populate them with the best evidence currently available.
```

## Final operating principle

The most defensible growth advantage for Skeure is not publishing more pages than competitors. It is maintaining the clearest programme/session evidence, normalizing true student cost, disclosing commercial relationships, answering local students quickly, and measuring the complete path from search to admission.

Traffic should scale only after trust scales.
