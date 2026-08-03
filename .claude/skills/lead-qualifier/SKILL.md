---
name: lead-qualifier
description: Use when given a WhatsApp lead conversation (pasted thread, screenshot transcript, or summary) and the goal is to decide how good the lead is and what to send next. Triggers on "qualify this lead", "is this student worth following up", "draft a reply to this WhatsApp thread", or pasting a raw conversation and asking what to do with it.
---

## What this skill does

Reads one inbound lead conversation and turns it into three things: a fit verdict, a drafted reply in Pratham's voice, and a next-action line. It does not send anything — Auretris/WhatsApp sending stays manual or on its own automation track; this skill only prepares what a human (or, later, Kuanli) acts on.

Adapted from the `lead-research-assistant` skill in [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills), which is built for B2B outbound (finding companies to sell to). Retooled here for the opposite direction — inbound students already messaging in, being qualified against university program fit instead of an ideal-customer-profile.

## When to use

- A WhatsApp lead thread gets pasted in and the ask is "what do I say back" or "is this one worth chasing."
- Triaging a batch of leads to decide who gets a follow-up today vs. who's cold.
- Once Kuanli is live: this skill's qualify+draft output is what gets pushed into it as a task, instead of living only in chat.

## Inputs this skill reads

- `context/about-business.md` — the programs/universities on offer, what a good-fit student looks like
- `references/voice.md` — real reply samples; the drafted reply must match this register
- `references/prompt-engineering-guide.md` — the prompt-chaining breakdown (classify → ground → draft → next-step) this skill follows
- `connections.md` — whether the FAQ database is wired yet (changes Step 2 below)

## Execution

### Step 1 — Classify intent
Read the thread. Tag it as one (or more) of: pricing/fees, eligibility, program comparison, application status, general/other. This determines which facts matter in Step 2.

### Step 2 — Ground the facts
- If the PostgreSQL FAQ database is connected (check `connections.md` #7): pull the matching program row(s) rather than recalling numbers from memory.
- If not yet connected: pull from `context/about-business.md` and flag explicitly in the output when a number or policy detail isn't available locally and needs Pratham to confirm before sending — never invent a fee or eligibility rule.

### Step 3 — Qualify
Score fit on what's actually visible in the thread, not assumptions:
- Program interest stated clearly? (vs. vague browsing)
- Budget signal (asked about fees, reacted to a number, mentioned a constraint)
- Timeline urgency (application deadline pressure, "starting when" questions)
- Location/logistics fit (Punjab-area student, online-program comfort)

Verdict is one of: **Hot** (ready to push toward application), **Warm** (interested, needs one more nudge — specify which), **Cold** (browsing, low signal, low-touch follow-up only).

### Step 4 — Draft the reply
Write the next WhatsApp message in `references/voice.md`'s register: short sentences, bullets for anything pricing/program-shaped, one clear next step at the end, no jargon. Few-shot off the voice samples — don't paraphrase the tone abstractly.

### Step 5 — Next action
One line: what happens next and who does it. Examples: "Send this reply, then follow up in 2 days if no response" / "Needs Pratham to confirm the hostel-fee number before sending" / "Cold — no action needed, revisit in 2 weeks." Once Kuanli is live, this line is the task description to push into it.

## Output format

```
**Verdict:** Hot / Warm / Cold — one-line why

**Reply draft:**
[the actual WhatsApp message, ready to send or edit]

**Next action:** [who does what, when]
```

## Boundaries

- Never fabricates a fee, deadline, or eligibility rule not present in `context/`, the FAQ DB, or the thread itself — surface the gap instead.
- Never sends a message or calls the WhatsApp/Auretris API — output is always a draft for a human to review, consistent with Auretris still being stabilized (see `decisions/log.md`, 2026-07-31 entries).
- Don't fake Pratham's voice on anything that leaves WhatsApp (LinkedIn, university-facing email) — that restriction from `CLAUDE.md` applies here too.
