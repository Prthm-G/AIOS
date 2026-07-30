# AIS-OS Intake

This is the source-of-truth file for your AIOS. Fill it in by typing, voice-pasting (Wispr Flow / OS dictation), or running `/onboard` for a guided conversation. Whichever mode, this file is what `/onboard` reads to scaffold your Day-1 setup.

**Hard cap: 7 questions.** Each answerable in under 60 seconds. Don't overthink — you can edit and re-run `/onboard` any time.

---

## Q1 — Who are you, what do you sell, who do you sell it to?

Identity, offer, ICP. One paragraph each is fine.

```
Pratham Goel, owner of an education consulting institution based in Patiala, Punjab. We partner with multiple national universities across India and counsel students into online UG and PG programs offered by those universities. ICP: prospective students (and their families) in and around Patiala/Punjab looking for accredited online undergraduate and postgraduate degrees.
```

---

## Q2 — Paste 1-2 things you've written recently. Don't edit them.

An email, a LinkedIn post, a DM, a doc — anything that sounds like you when you're not trying. **Paste verbatim.** Do not type these mid-conversation with Claude — chat-shaped samples are worse than no samples (voice contamination).

```
For the LPU Distance BCA program, here are the fee options:

• Semester-wise: Rs. 13,500 per semester
• Annual: Rs. 26,000 per year (more cost-effective)
• Lumpsum: Rs. 75,000 for the full program

Please note there is a one-time application fee of Rs. 600.

The BCA program covers IT fundamentals, programming, web development, and AI across 5 semesters.

Would you like details about eligibility or the application process? Hello! I'm here to help.

It looks like we were previously discussing the MBA and MCA programs at LPU and Amity.

Is there anything specific you would like to know about them, such as eligibility, fees, or course curriculum?

I am happy to provide more details or resend any brochures you might need!
```

```
I think there might be a little confusion!

I am here to help you with information about online degree programs at LPU or Amity.

Are you looking for information on a specific course or university?

Just let me know your preference, and I will be happy to assist you.
```

---

## Q3 — What are your 2-3 biggest priorities for the next 90 days?

Quarterly priorities. Not yearly aspirations. Things that, if not done by July, would make you say "I wasted Q2."

```
1. Close 100 admissions by Sept 30, 2026.
2. Automate WhatsApp lead responses by end of July 2026 — get Auretris (WhatsApp bot handler) and Kuanli (WA CRM for lead management) fully up and running. Systems live at /home/user/automation_stack.
3. Move to a bigger location.
```

---

## Q4 — Where does revenue actually land, and where is it tracked?

Multiple answers OK. Stripe? Skool? GoHighLevel? QuickBooks? A spreadsheet?

```
No standard tracking system yet. Students pay tuition/fees directly to the universities; Pratham receives commission back into his own bank accounts. Commissions land across multiple different bank accounts, one per university partner — untracked, unstreamlined. This is a known gap to fix.
```

---

## Q5 — Where do you talk to customers, your team, and the outside world day-to-day?

Email (which one — Gmail / Outlook)? Slack? Teams? DMs (Skool / Discord / iMessage)? Phone?

```
WhatsApp and phone are the day-to-day channels — student/customer conversations run through WhatsApp (handled in part by Auretris, the WhatsApp bot handler). Email is used only for exchanging documentation with universities, not for day-to-day comms.
```

---

## Q6 — Where do meeting recordings, notes, and important docs live?

Granola? Otter? Fireflies? Google Drive? Notion? Dropbox? A folder on your desktop you keep meaning to organize?

```
No meeting recording tool yet. Brochures live at /home/user/automation_stack/brochures. University FAQ data lives in a PostgreSQL database. Other internal files sit on a local server at the office.
```

---

## Q7 — What's the one task that eats your week, and where do you currently track work?

The single biggest time-suck or recurring drudgery. Plus where tasks/projects live (ClickUp / Asana / Linear / Notion / a notebook).

```
Top pain: managing leads and lead generation eats most of the week — this includes manual WhatsApp lead responses (see Q3 priority #2). No formal system for tracking tasks or follow-ups — nothing in place.
```

---

When this file is filled, run `/onboard` (or re-run it) and the wizard will scaffold your Day-1 file set: `context/`, `references/voice.md`, populated `connections.md`, and a filled `CLAUDE.md`.
