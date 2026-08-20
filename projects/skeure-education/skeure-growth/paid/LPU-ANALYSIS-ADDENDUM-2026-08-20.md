# LPU analysis addendum · placement, creative, region, trend · 2026-08-20

From `Ad-Level-Named.csv`, `Placement-breakdown.csv`, `Region-breakdown.csv`, and
`Campaign-by-month.csv`. Extends `LPU-ACCOUNT-ANALYSIS-2026-08-20.md` and corrects two things in it.

---

## 1. WhatsApp Status is the cheapest placement on the account by 15x

| Platform | Spend | Share | Conversations | ₹/convo |
|---|---|---|---|---|
| **whatsapp (Status)** | **₹4,768** | **1.2%** | **809** | **₹5.89** |
| instagram | ₹322,029 | 79.6% | 3,211 | ₹100.29 |
| facebook | ₹77,704 | 19.2% | 696 | ₹111.64 |

₹4,768, roughly one percent of the budget, produced **17% of every conversation on the account**.

By placement:

| Placement | Spend | Conversations | ₹/convo | CTR |
|---|---|---|---|---|
| **Status (WhatsApp)** | ₹4,768 | 809 | **₹5.89** | 0.642% |
| Instagram Reels | ₹153,667 | 1,700 | ₹90.39 | 0.303% |
| Facebook Reels | ₹23,119 | 220 | ₹105.09 | 0.197% |
| Feed | ₹174,068 | 1,557 | ₹111.80 | 0.444% |
| Instagram Stories | ₹39,123 | 343 | ₹114.06 | 0.426% |
| Facebook Stories | ₹5,023 | 42 | ₹119.59 | 0.630% |

**Feed is the largest single spend on the account (₹174,068, 43%) at a below-average ₹111.80.** It
earns the clicks (0.444% CTR, second best) and then converts them worst of the major placements.
Facebook Stories shows the same shape more sharply: best CTR on the account at 0.630%, worst cost at
₹119.59. Clicks that do not become conversations.

Instagram Reels is the best of the large placements at ₹90.39.

**Correction to the first analysis.** It dismissed an "Unknown" demographic row (716 conversations at
₹4.36) as a breakdown artifact. It was not an artifact. It is **WhatsApp Status placement**, where
age and gender are not resolvable, and the numbers line up with the 809 conversations at ₹5.89 seen
here. That was a real and very cheap audience, wrongly discarded. Corrected.

**Caveat before scaling it.** ₹4,768 is a small base, and WhatsApp Status inventory is limited, so
this will not absorb ₹50,000 at ₹5.89. Treat it as the first place to add budget and find the
ceiling, not as a solved channel.

## 2. Two creatives carry the account

Ads with at least ₹4,000 spend, 26 of 175:

| Ad | Campaign | Spend | Convos | ₹/convo | CTR |
|---|---|---|---|---|---|
| **New Engagement ad** | Punjabi University | ₹5,158 | 179 | **₹28.81** | 0.324% |
| **A10** | FB Ads - 01/07/2026 | ₹18,440 | 446 | **₹41.35** | **1.028%** |
| **Ad 4** | FB Ads - 01/07/2026 | ₹44,001 | 1,043 | **₹42.19** | 0.499% |
| AD2 | FB Ads - New Session - 27/04 | ₹28,881 | 468 | ₹61.71 | 0.387% |
| ... | | | | | |
| P1 | LPU Punjab - 13/05 | ₹6,084 | 13 | **₹468.02** | 0.210% |

`Ad 4` and `A10` together took ₹62,441 and produced 1,489 conversations at about ₹42. That is **32%
of all conversations on the account for 15% of the spend.**

They win by different mechanisms, which is worth noticing:

- **A10** has a 1.028% CTR, more than double anything else on the account. It wins attention.
- **Ad 4** has a middling 0.499% CTR but converts clicks far better. It wins intent.

Both live in `FB Ads - 01/07/2026`. These two are the creative to extract before anything is
rebuilt. The export carries metrics only, so the actual copy and images still have to come from Ads
Manager or `/{ad-id}/adcreatives`.

Worst performer is `P1` in `LPU Punjab - 13/05` at ₹468.02, which is 16x the best ad. That campaign
was already flagged as the single largest loss on the account.

## 3. Efficiency has improved 3 to 4x, and the first analysis undersold it

| Month | Spend | Convos | ₹/convo |
|---|---|---|---|
| 2025-09 | ₹33,898 | 196 | ₹172.95 |
| 2025-11 | ₹11,276 | 60 | **₹187.94** worst |
| 2026-02 | ₹24,320 | 188 | ₹129.36 |
| 2026-05 | ₹43,371 | 592 | ₹73.26 |
| 2026-06 | ₹39,810 | 334 | ₹119.19 |
| **2026-07** | ₹45,231 | 1,040 | **₹43.49** best |
| 2026-08 | ₹54,988 | 756 | ₹72.74 |

**Correction of emphasis.** The first analysis framed the 13x spread as budget spread evenly across
campaigns of differing quality, which read as uniform carelessness. The monthly view shows something
better: **a learning curve.** Late 2025 ran at ₹150 to ₹190. Mid 2026 runs at ₹43 to ₹73. Whoever has
been running this account has got roughly 3 to 4x better at it.

The reallocation opportunity is still real, but it is "scale what July proved" rather than "stop
wasting money."

August 2026 is the largest spend month on record (₹54,988) at a healthy ₹72.74, so the account was
scaling into its best-performing period when it hit the spend cap.

## 4. Region tells us where money went, not what it produced

Meta returned **no conversation data broken out by region**, only spend. So regions cannot be ranked
by efficiency.

| Region | Spend | Share |
|---|---|---|
| Punjab region | ₹337,368 | 83.4% |
| Himachal Pradesh | ₹28,790 | 7.1% |
| Chandigarh | ₹18,200 | 4.5% |
| Jammu and Kashmir | ₹12,579 | 3.1% |
| Haryana | ₹7,420 | 1.8% |

83.4% concentrated on Punjab, which matches Skeure's base. The earlier read that Punjab-named
campaigns outperformed stays **inference from campaign naming**, not proven by delivery data.

## 5. The reply metric is unusable on this account

`Messaging conversations replied` totals **10 replies against 4,716 conversations started**, and only
4 of 548 placement rows carry any value at all.

This is a **tracking gap, not an operational finding.** Do not read it as "nobody answers the
conversations." Meta simply is not populating the field here.

**Consequence for the custom metrics:** `Reply Rate` and `Cost per Replied Chat` will both be dead on
this account. This was the risk flagged in `NEXT-EXPORTS.md`. Rank on `Cost per messaging
conversation started` and `Chat Rate` instead. The other three custom metrics are unaffected.

It also strengthens the Phase 1 argument: the only way to know whether a conversation went anywhere
is to own the data in Kuanli, because Meta will not tell you.

---

## Revised actions

1. **Add budget to WhatsApp Status first** and find its ceiling. Cheapest conversation on the account
   by 15x, on 1.2% of spend.
2. **Extract `Ad 4` and `A10` creative** from `FB Ads - 01/07/2026` before rebuilding anything.
3. **Cut or rework Feed.** Largest spend on the account, converts worst of the majors. Shift toward
   Instagram Reels.
4. **Rebuild on the July 2026 configuration**, not on a three-year average. July ran at ₹43.49.
5. Drop `Reply Rate` and `Cost per Replied Chat` from reporting on this account.
