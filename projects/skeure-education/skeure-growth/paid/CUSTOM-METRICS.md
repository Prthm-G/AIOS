# Ads Manager custom metrics and saved preset

Two separate things solve "selecting columns each time is a task":

1. **A saved column preset** removes the clicking. This is the actual fix.
2. **Custom metrics** add numbers Meta does not calculate natively. This is where the analytical
   value is.

Do both once and every future export is one click.

---

## 1. Save the preset (do this first)

Ads Manager → **Columns** → **Customise columns** → tick everything in
`lpu-export/NEXT-EXPORTS.md` → bottom-left **Save as preset** → name it
**`Skeure Growth Standard`**.

After that, every export is Columns → `Skeure Growth Standard` → Export. No re-selection, and every
CSV comes out with identical headers, which matters because inconsistent headers are what broke the
link between the first ad-level export and its campaigns.

## 2. Custom metrics worth creating

Ads Manager → Columns → Customise columns → **Create custom metric**.

Pick metrics from the dropdown, combine with `+ - * /`, then set the **Format**.

> **Formatting gotcha:** if you set Format to *Percentage*, Meta multiplies by 100 for you. Do not
> also multiply by 100 in the formula or you get 5,740% instead of 57.4%.

### The five that matter

| Name | Formula | Format | What it tells you |
|---|---|---|---|
| **Chat Rate** | `Messaging conversations started ÷ Link clicks` | Percentage | Separates an ad problem from a handoff problem. Low CTR with high chat rate means the creative is weak but the offer works. High CTR with low chat rate means the ad oversells and the WhatsApp entry disappoints. |
| **Reply Rate** | `Messaging conversations replied ÷ Messaging conversations started` | Percentage | Conversation quality. A conversation nobody replies to is worth nothing, and this is the only in-platform signal of junk volume. |
| **Cost per Replied Chat** | `Amount spent ÷ Messaging conversations replied` | Currency | The closest thing to a true lead cost available without the measurement spine. Use this, not cost per conversation started, when comparing campaigns. |
| **Chats per 1k Impressions** | `Messaging conversations started ÷ Impressions × 1000` | Number | Volume efficiency independent of what you paid per impression. Catches campaigns that look cheap only because bids were low. |
| **New Contact Rate** | `New messaging contacts ÷ Messaging conversations started` | Percentage | Repeat versus new humans. Account-wide this is currently around 75%, so roughly a quarter of "conversations" are people already in the pipeline. |

### Why these five

The account already reports cost per conversation natively, and that number hides two things: whether
the conversation was any good (Reply Rate), and whether it was a new person at all (New Contact
Rate). Cost per Replied Chat folds both corrections into one comparable figure.

Chat Rate is the diagnostic that tells you *which half* to fix, which is exactly what the ₹48 versus
₹116 campaign gap needs. Both had traffic. Only one converted it.

### What custom metrics cannot do

- **No conditional logic.** The CPM > ₹35 / CTR < 0.35% kill signal cannot be built as a custom
  metric. Keep it as a rule you apply by eye, or compute it from the CSV.
- **No account-level totals.** Share-of-spend percentages have to be computed after export.
- **No cross-account math.** Comparing DegreeCraft to LPU stays a post-export job.

---

## Verification note

The custom-metric editor is a long-standing Ads Manager feature, but the exact operator support and
which metrics appear as building blocks change over time, and Meta's help pages are
JavaScript-rendered so they could not be read programmatically on 2026-08-20. If a metric above is
missing from the dropdown, `Messaging conversations replied` and `New messaging contacts` are the
two most likely to differ by account or objective. Everything else is standard.

## One honest caveat

If the only purpose is analysis on this side, custom metrics are optional. Raw columns are enough,
because every derived figure above can be computed from the CSV in seconds. Their real payoff is
**your** day-to-day reading of Ads Manager: seeing Cost per Replied Chat next to Cost per Result in
the native table changes which campaign you pause, without exporting anything.
