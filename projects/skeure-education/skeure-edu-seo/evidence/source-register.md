# Source register

Authoritative and internal sources used or required for evidence in `programme-ledger.csv` and `claims-register.csv`. Created 2026-07-24 during the website-build remediation pass. Keep this updated as sources are actually checked — do not mark a claim `verified` in the ledger without a corresponding entry here.

## Primary regulatory/official authorities (required, not yet confirmed live in this session)

| Source | URL | Purpose | Checked this session? |
|---|---|---|---|
| UGC-DEB HEI/programme entitlement list | https://deb.ugc.ac.in/Home/HEI_Prog_List | Ground truth for which HEI may offer which exact programme, mode (Online/ODL), and academic session | Delegated to background research agents (see below) |
| RBI (for any future financing-lender claim) | https://www.rbi.org.in | Verify any named NBFC/bank lender is RBI-regulated before financing claims are restored | Not checked — financing promotion is being neutralized/removed instead, per working rule 8 |

## Official university sources referenced by the current content

| University | Official portal used in content | Notes |
|---|---|---|
| Lovely Professional University | https://www.lpuonline.com | Fee/placement figures currently sourced to an internal "July 2026 Fee Structure" document, not this URL directly — needs direct citation |
| Amity University Online | https://www.amityonline.com | Fee figures sourced to internal "July 26 Fee Structure" spreadsheet — needs direct citation |
| Online Manipal (conflated) | https://onlinemanipal.com | Actually fronts multiple distinct awarding HEIs — see CLM-006; needs per-entity resolution |
| Chandigarh University Online | https://www.onlinecu.in | Not yet cross-checked |
| Chitkara University Online | https://www.onlinechitkarau.com | Not yet cross-checked |
| Desh Bhagat University | https://www.dbuonline.in | Master-plan-flagged mismatch, priority correction |
| GLA University Online | https://www.glaonline.com | Not yet cross-checked |
| Guru Kashi University | https://www.gkuonline.in | Not yet cross-checked |
| Jagat Guru Nanak Dev Punjab State Open University | https://www.psou.ac.in | Master-plan-flagged mismatch, priority correction |
| Mangalayatan University Online | https://www.muonline.ac.in | Not yet cross-checked |
| Maharishi Markandeshwar (MMU) University Online | https://onlineprograms.mmumullana.org | Master-plan-flagged mismatch, priority correction; possible entity confusion with a second MMU institution |
| Punjabi University Online & Distance | https://www.cdoepunjabiuniversity.in | Not yet cross-checked; likely ODL not "Online" mode |

## Internal (non-authoritative) sources currently backing site content

- `website-build/database/lpu_university_knowledge_202607180436.csv` — chatbot Q&A knowledge-base export, paraphrased, not a primary fee/programme source.
- `website-build/database/amity_university_knowledge_202607180438.csv` — same category, Amity.
- `website-build/database/unprocessed/DBU-Online-Brochure-2025-26.pdf` — Desh Bhagat University's own official 2025-26 online-programme brochure, supplied by Pratham 2026-07-25. Checked in full (27 pages). Note: `DBU-Prospectus.pdf` in the same folder is byte-identical (same MD5) — it is not a separate, more detailed document. Lists 13 real programmes (10 PG, 3 UG) with durations and eligibility, claims "UGC Entitled" and NAAC A+ accreditation, includes a real campus photo (used for the site's university tile), and a generic UGC public notice on ODL/online-conventional degree equivalence (not a DBU-specific UGC-DEB entitlement listing). No fee figures. This is university marketing material, not an independent regulator confirmation — programme-ledger.csv rows sourced from it are `stale`, matching LPU/Amity's tier, not `verified`.
- `/home/user/automation_stack/brochures/{LPU,LPU - Distance,Amity}` — PDF brochures, referenced but not re-parsed in this session.
- LPU "July 2026 Fee Structure" / `Prospectus_Partb.pdf` and Amity "July 26 Fee Structure.xlsx" — named in `PLANNING.md` Round 2 as the authoritative fee sources actually used for LPU/Amity content; **not opened or re-verified in this session** — treat all LPU/Amity fee figures as `stale`, not `verified`, until someone re-opens and cites the exact file/sheet/cell per figure.

## Research completed this session (2026-07-24)

Two background research agents checked all 12 universities against UGC-DEB primary documents and each official site. Findings merged into `programme-ledger.csv` and `website-build/src/content/universities/*.md` (each file's `evidenceStatus` frontmatter field). Neither agent could get reliable results from UGC-DEB's live search UI (unindexed/JS-rendered); both fell back to UGC-DEB's own published PDF notices plus each university's official site. **No record reached `status = verified`** — the PDFs found are dated 2021/2022 (Online-entitled) and Oct 2025 (ODL), which is real evidence but not a live, current-session query, so everything that improved is marked `stale` (real citation, not yet re-confirmed live) rather than `verified`.

Corrections actually applied to the site as a result:

| University | What changed | Source |
|---|---|---|
| Online Manipal | Unpublished (noindex); disclosed as 3 conflated entities (MAHE 1953/Karnataka, MUJ 2011/Rajasthan, SMU 1995/Sikkim) | Wikipedia entity pages + onlinemanipal.com indexing (agent could not fetch onlinemanipal.com About page directly, 403) |
| Desh Bhagat University | Unpublished (noindex); establishedYear corrected 1996→2012 (group founding vs. university-status Act); zero DEB rows found for any programme | Desh Bhagat University Act 2012 (Wikipedia); dbuonline.in/deb-id page |
| PSOU | Mode corrected "Online & Distance"→"Distance (ODL)" for all courses; removed MBA/MCA/BBA/BCA (zero rows found in any mode); kept M.Com/MA/B.Com/BA | UGC-DEB ODL Category-I list, 3 Oct 2025 |
| MMU Mullana | Removed MBA/M.Com/MA/BCA/BA (unconfirmed); kept MCA, BBA, B.Com renamed to "B.Com (Hons)" to match the confirmed entitlement exactly | UGC-DEB Online-entitled list 2021/2022 addendum |
| Chitkara University | Trimmed from 8 to 2 programmes (MBA, BBA) — official portal itself only advertises these two | onlinechitkarau.com direct check |
| GLA University | Trimmed from 8 to 5 programmes (MBA, MCA, BBA, BCA, B.Com) — official portal confirms exactly these | glaonline.com direct check |
| Punjabi University | Mode corrected to "Distance (ODL)"; "MCA" renamed to "M.Sc (Information Technology)" to match the DEB entry exactly; slug/URL kept stable | UGC-DEB ODL list, entry 59, 3 Oct 2025 |
| Chandigarh University | Flagged generic MA/BA as actually-named specializations; MCA and plain B.Com flagged unconfirmed (kept, with in-page notes) | UGC-DEB Online-entitled list 2021 + 18 May 2022 addendum |
| Guru Kashi University | Added NAAC A++ (CGPA 3.57) accreditation, self-reported by the university; DEB online/ODL status still unconfirmed | gku.ac.in accreditations page |
| Mangalayatan University | Corrected NAAC grade to A+ (CGPA 3.34); DEB status still unconfirmed | news.mangalayatan.in |
| LPU | Kept published; BCA and M.Com confirmed online-entitled, MBA/BBA/BA/M.Sc Economics NOT found in the scan (LPU's own flagship "Online MBA" is unconfirmed — treat as a scan-gap risk requiring manual re-check, not a confirmed absence) | UGC-DEB Online-entitled list 2021/2022 |
| Amity University | Kept published; removed unverified "QS-ranked Online MBA Top-10 Asia-Pacific 2024" and "QS-ranked #37" claims (QS.com blocked, could not confirm); softened ACBSP claim to note online-B.Com scope is unconfirmed; M.Sc Data Science not found in scan (kept, flagged via blanket evidenceStatus) | UGC-DEB Online-entitled list; Amity's own ACBSP PDF; QS.com (blocked, 403) |

## Research completed 2026-07-25

| University | What changed | Source |
|---|---|---|
| Desh Bhagat University | Republished (noindex removed); 13 real programmes restored from the university's own brochure, `stale` (not `verified`) | `DBU-Online-Brochure-2025-26.pdf`, supplied by Pratham — see entry above |
| Lovely Professional University | Online MBA row moved to `verified` | Personal confirmation by Pratham Goel against the UGC-DEB portal / university site, 2026-07-25 |

## Non-negotiable rule

Per the SEO master plan: **only `verified` records may be published as factual programme inventory.** As of the 2026-07-24 session, zero records in `programme-ledger.csv` carried `status = verified`. As of 2026-07-25, exactly one does — LPU's Online MBA, per a named human reviewer's direct confirmation (`verified_by` in the ledger is exactly this field's intended use). Every other record remains `stale`/`unverified`/`disputed`. A follow-up pass with direct, live UGC-DEB access (not blocked/JS-rendered) is still needed before more records can be marked `verified`.
