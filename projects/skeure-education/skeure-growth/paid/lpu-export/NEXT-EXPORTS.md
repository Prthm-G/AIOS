# Next exports needed · LPU account `act_278258370`

What the first two exports could not answer, and exactly what to pull to fix it.

Set **date range = Maximum / Lifetime** on every export. Save into this folder using the filenames
below, spelled exactly.

---

## 1. `Ad-level-named.csv` — highest priority

**This is the one that matters.** The current `Ad-level.csv` has `Ad set name` and `Ad ID` but no
`Campaign name` and no `Ad name`, so 210 ads cannot be traced to their campaigns or told apart. It
is the blocker on identifying which creative actually won.

- **Level:** Ad
- **Breakdown:** none
- **Columns:**

```
Campaign name
Ad set name
Ad name
Ad ID
Objective
Delivery status
Amount spent (INR)
Impressions
Reach
Frequency
Link clicks
CTR (all)
Unique CTR (all)
CPC (cost per link click)
CPM (cost per 1,000 impressions)
Results
Result type
Cost per result
Messaging conversations started
Messaging conversations replied
Cost per messaging conversation started
New messaging contacts
Chat Rate                       <- custom
Reply Rate                      <- custom
Cost per Replied Chat           <- custom
Chats per 1k Impressions        <- custom
New Contact Rate                <- custom
Reporting starts
Reporting ends
```

**Add the five custom metrics to the `Skeure Growth Standard` preset before exporting.** Columns →
Customise columns → they now appear in the list alongside native metrics → tick all five → re-save
the preset. Every export below then carries them automatically; they are computed per row, so they
work at ad, campaign, and breakdown level alike.

**Watch one thing on this export:** `Reply Rate` and `Cost per Replied Chat` depend on `Messaging
conversations replied`, which may not populate at ad level on every row even when it populates at
campaign level. If those two columns come back blank or zero across the board, say so and rank on
`Chat Rate` plus `Cost per messaging conversation started` instead.

In Ads Manager: Ads tab → Columns → Customise columns → tick the above → Export → CSV.
`Campaign name` and `Ad name` are under **Identifiers** in the column picker, which is why they were
missed last time. Make sure both are ticked before exporting.

## 2. `Placement-breakdown.csv` — second priority

Answers where the cheap conversations came from. Likely the single biggest lever after creative:
Audience Network and Reels tend to absorb impressions at low quality, and if that is what separated
the ₹48 campaign from the ₹116 one, it is a one-click fix on rebuild.

- **Level:** Campaign
- **Breakdown:** Delivery → **Placement** (add **Platform** too if it lets you pick both)
- **Columns:** same list as above, minus `Ad name` / `Ad ID`

## 3. `Campaign-by-month.csv` — third priority

Gives the three-year efficiency trend. `Starts` and `Ends` came back empty in all 47 rows, so do
**not** rely on those columns. Use a time breakdown instead, which produces one row per period.

- **Level:** Campaign
- **Breakdown:** Time → **By Month**
- **Columns:** same as export 1, minus `Ad name` / `Ad ID`

## 4. `Region-breakdown.csv` — optional

Tests the Punjab angle directly. Three of the four best campaigns were Punjab or
institution-specific, but that is currently inference from campaign names, not from delivery data.

- **Level:** Campaign
- **Breakdown:** Delivery → **Region** (or City, if region is too coarse)
- **Columns:** same as export 3

---

## What still will not be in any of these

**Creative copy and images.** Ads Manager exports carry metrics and identifiers, never the headline,
body text, or image. Once `Ad-level-named.csv` identifies the winning ad names, the creative itself
has to come from one of:

- opening those specific ads in Ads Manager and copying the text, or
- the Marketing API (`/{ad-id}/adcreatives`), which needs working API access to this account. The
  role grant does not reach the system-user token, so this would need the `meta-ads` MCP in a fresh
  session, or a user token.

Identify the winners first from export 1. Then pull creative for only those, rather than all 210.
