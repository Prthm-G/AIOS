# LPU account (`act_278258370`) analysis · 2026-08-20

Source: two Ads Manager exports in `lpu-export/`, covering **2023-07-20 to 2026-08-19**.
`Campaign-level.csv` (46 campaigns), `Ad-level.csv` (1,843 rows, broken out by age and gender).
All figures below are computed from those files. Nothing is estimated.

## Why this account matters more than the DegreeCraft one

| | LPU `act_278258370` | DegreeCraft `act_961766249917785` |
|---|---|---|
| Window | 3 years | ~2 months |
| Spend | **₹404,500** | ₹24,998 |
| Impressions | 14,050,253 | 795,370 |
| Reach | 4,623,415 | 569,316 |
| Link clicks | 54,640 | 4,567 |
| **Conversion events** | **4,716 messaging conversations** | **none tracked** |
| Cost per conversation | ₹85.77 blended | unknown |

This is the only Skeure-adjacent account with a working conversion signal, and the signal is the
right one: **messaging conversations started**, which is the WhatsApp CTA the whole funnel depends
on. Sixteen times the spend of the DegreeCraft account and, unlike it, the money is attributable.

## Headline: the same ₹4 lakh could have bought 75% more conversations

Cost per conversation ranges from **₹33.88 to ₹447.26** across campaigns. A 13x spread.

- **23% of spend produced 41% of all conversations** (5 campaigns at or under ₹60, blended ₹47.52).
- **57% of spend produced 37% of conversations** (27 campaigns above ₹100, blended ₹131.13).
- Run at the best proven at-scale rate of ₹48.82, the same ₹403,455 would have produced **8,264
  conversations instead of 4,716**, a gain of 3,548.

The money was not wasted on a bad channel. It was spread evenly across campaigns with wildly
different efficiency, and the good ones were never scaled.

## What worked

### The benchmark campaign: `FB Ads - 01/07/2026`

The only campaign that is both cheap and large, and it is currently **active**.

| Metric | Value | vs account blended |
|---|---|---|
| Spend | ₹79,135 (20% of all spend) | |
| Conversations | 1,621 (34% of all) | |
| Cost per conversation | **₹48.82** | 43% cheaper |
| CTR | 0.700% | best of any major campaign |
| CPC | ₹3.18 | vs ₹7.40 |
| CPM | **₹19.12** | vs ₹28.79, the lowest of any significant campaign |

It wins on every input at once: cheapest impressions, highest click rate, cheapest clicks. This is
the campaign to reverse-engineer and rebuild.

### The pattern that predicts a winner

Across all 40 converting campaigns, cost per conversation tracks CPM and CTR almost perfectly. Cheap
reach plus a hook that earns the click is the entire game.

| | Best quartile | Worst quartile |
|---|---|---|
| CPM | ₹19 to ₹28 | ₹35 to ₹218 |
| CTR | 0.65% to 0.70% | 0.30% to 0.35% |
| Cost per conversation | ₹34 to ₹58 | ₹150 to ₹447 |

**Objective:** `OUTCOME_ENGAGEMENT` with a WhatsApp destination generated **all 4,716 conversations**
across 43 campaigns. The 2 `LINK_CLICKS` campaigns and the 1 `MESSAGES` campaign produced **zero**
conversations on ₹873 of spend. Small sample, but directionally clear, and it settles the objective
question for this funnel.

### Best performers by cost

| Campaign | Spend | Convos | ₹/convo | Note |
|---|---|---|---|---|
| Punjabi University | ₹7,419 | 219 | **₹33.88** | cheapest, never scaled |
| FB Ads - 01/07/2026 | ₹79,135 | 1,621 | **₹48.82** | cheap **and** big |
| JGND - Punjab - MAY 2025 | ₹3,876 | 67 | ₹57.85 | small, Punjab-targeted |
| FB Ads - New Session - 27/04/2026 | ₹46,888 | 660 | ₹71.04 | second-largest good one |

Two of the top four are named for specific Punjab institutions. Geographic and institutional
specificity looks like a winning angle, though the two cheapest are small enough that the result is
suggestive rather than proven.

## What did not work

### The five campaigns that consumed the most money at bad rates

| Campaign | Spend | ₹/convo | Overspend vs ₹48.82 |
|---|---|---|---|
| LPU Punjab - 13/05 | ₹66,536 | ₹116.73 | ~₹38,700 |
| Feb Ads - 31st Jan | ₹33,202 | ₹108.86 | ~₹18,300 |
| FB Ads - 14/06/2026 | ₹23,671 | ₹124.59 | ~₹14,400 |
| LPU - Sept | ₹18,477 | ₹147.82 | ~₹12,400 |
| LPU Online – 20/25 | ₹12,412 | ₹129.30 | ~₹7,700 |

`LPU Punjab - 13/05` alone is the single largest loss: ₹66,536, the second-highest spend on the
account, at 2.4x the cost of the benchmark. Its CPC was ₹16.25 against the benchmark's ₹3.18, a 5x
gap, on a CTR of 0.336% against 0.700%.

### MBA targeting was the worst segment on the account

`SET2 - MBA` spent ₹23,376 for 91 conversations: **₹256.87 each**, 4.3x worse than the best ad set.
CTR 0.248%.

This deserves attention because MBA is a programme Skeure actively sells. On this evidence, generic
MBA-audience targeting does not work. It does not prove MBA cannot be sold profitably; it proves
this approach to it failed at meaningful scale.

### Ad set performance

| Ad set | Spend | Convos | ₹/convo | CTR |
|---|---|---|---|---|
| Ad set 1 | ₹112,323 | 1,882 | **₹59.68** | 0.543% |
| Ads - Punjab | ₹42,101 | 622 | ₹67.69 | 0.378% |
| New Engagement ad set | ₹55,031 | 624 | ₹88.19 | 0.259% |
| ad set 1 (lowercase) | ₹51,732 | 490 | ₹105.57 | 0.376% |
| SET1 | ₹85,935 | 770 | ₹111.60 | 0.200% |
| SET2 - MBA | ₹23,376 | 91 | ₹256.87 | 0.248% |

`SET1` is the second-largest ad set by spend and has the **lowest CTR on the account**. ₹85,935 at
₹111.60. Whatever `Ad set 1` was doing, `SET1` was not.

Naming is inconsistent enough (`Ad set 1` vs `ad set 1` vs `SET1`) that these may be related
attempts. Worth opening in Ads Manager to see what actually differed, because the gap between the
best and second-worst is ₹52 per conversation on comparable budgets.

## Demographics

Male reaches conversations 18% cheaper than female, yet female absorbs 40% of spend.

| Segment | Spend | Share | ₹/convo | CTR |
|---|---|---|---|---|
| Male | ₹238,662 | 59% | **₹94.18** | 0.369% |
| Female | ₹161,834 | 40% | ₹111.00 | 0.340% |

By age, the money and the efficiency point in opposite directions:

| Age | Spend | Share | ₹/convo | CTR |
|---|---|---|---|---|
| 45-54 | ₹4,620 | 1.1% | **₹79.66** | 0.473% |
| 35-44 | ₹47,455 | 11.7% | **₹95.68** | 0.491% |
| 18-24 | ₹169,137 | 41.8% | ₹100.98 | 0.310% |
| 25-34 | ₹178,706 | 44.2% | ₹101.42 | 0.392% |

**86% of spend went to the two least efficient age bands.** The 35-44 and 45-54 bands convert
cheaper and click substantially more (0.47% to 0.49% CTR against 0.31% for 18-24), but together take
under 13% of budget.

Best single cell: **35-44 male at ₹87.19**, and 45-54 male at ₹78.28 on a small base.

This is consistent with online UG/PG being bought by working professionals upgrading their
qualifications, and by parents, rather than by school leavers. Skeure's positioning assumes a
younger applicant; this data suggests the older segment is both cheaper to reach and more
responsive.

**Do not trust the "Unknown" demographic row.** It shows 716 conversations on ₹3,121, or ₹4.36 each.
That is a breakdown artifact where conversations could not be attributed to a demographic cell, not
a real audience. It is excluded from every conclusion above.

## Correction to the DegreeCraft baseline

`BASELINE-2026-08-20.md` flagged as **P2** that nine of twelve DegreeCraft campaigns used engagement
or awareness objectives and that this mismatched an admissions goal. **That is too strong, and this
data corrects it.**

`OUTCOME_ENGAGEMENT` paired with a WhatsApp destination is exactly what generated all 4,716
conversations here, at ₹48 to ₹86. For a WhatsApp-CTA funnel it is the working configuration, not a
mistake. The real DegreeCraft problem is narrower and stands unchanged: no conversion tracking at
all, so nothing there could be measured either way.

The P2 finding should be read as "objective choice is unproven on that account" rather than "the
objective is wrong."

## What to carry into the Skeure account

Ranked by confidence.

1. **Rebuild `FB Ads - 01/07/2026`.** Highest-confidence asset on the account. Pull its targeting,
   placements, creative, and copy before anything else. It is still active, so it can be inspected
   live.
2. **Use `OUTCOME_ENGAGEMENT` with a WhatsApp destination.** 4,716 conversations of evidence.
3. **Shift budget toward 35-44, and toward male.** Currently 12% and 59% of spend against clearly
   better efficiency. This is the cheapest change available and needs no new creative.
4. **Reuse the Punjab-specific and institution-specific angles.** `Punjabi University`, `JGND -
   Punjab`, `Ads - Punjab` all beat the blended rate. Matches Skeure's Patiala base.
5. **Treat CPM and CTR as the early kill signal.** CPM above ~₹35 or CTR below ~0.35% predicted an
   expensive campaign every time. Kill on those inputs within days rather than waiting for cost per
   conversation to confirm it.
6. **Do not repeat generic MBA-audience targeting** without a materially different angle. ₹23,376 of
   evidence against it.

Custom audiences and creative can be shared or rebuilt. Delivery optimization history cannot: any
rebuild in the Skeure account re-enters the learning phase regardless.

## Gaps and caveats

- **The funnel still ends at "conversation started."** 4,716 conversations, and nothing in this data
  says how many became applications or admissions. Cost per conversation is a proxy, not the goal.
  Closing that gap is the measurement work, and this account cannot close it.
- **Cost per new messaging contact is ₹108.91 against ₹85.77 per conversation**, so roughly a
  quarter of conversations are repeat contacts rather than new people. Real cost per new human is
  the higher number.
- **No time trend available.** The `Starts` column is empty in the export, so whether efficiency
  improved or degraded over the three years cannot be determined. A re-export including campaign
  start dates would answer it.
- **Creative itself is not in these files.** Headlines, images, and body copy have to come from Ads
  Manager or the API. The ad-level export carries IDs and metrics only.
- **Attribution is 7-day click or 1-day view** on most campaigns, which is Meta's own attribution and
  not independently verified.
