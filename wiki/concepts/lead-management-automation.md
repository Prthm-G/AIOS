---
type: concept
aliases: ["WhatsApp lead automation"]
created: 2026-07-24
updated: 2026-07-24
status: draft
tags:
  - concept
  - automation
  - operations
source_count: 1
---

# Lead management automation

## Definition

The effort to move customer lead handling — WhatsApp conversations and the task tracking that follows from them — off manual work and onto two named systems: [[wiki/entities/auretris|Auretris]] (conversation layer) and [[wiki/entities/kuanli|Kuanli]] (CRM/task-tracking layer). Scope is bounded to what the [[wiki/sources/SRC-20260724-connections-registry|connections registry]] documents: domains "Customer interactions" and "Project / task tracking," both currently unconnected.

## Current synthesis

Both halves of this concept are in the same state: a named tool exists (or is intended) but is not yet connected, and no domain has a recorded "last checked" date. The registry treats these as two separate rows, but they're functionally one automation effort — Auretris captures and responds to the WhatsApp conversation, Kuanli is meant to track what happens next. [[wiki/sources/SRC-20260724-connections-registry|SRC-20260724-connections-registry]], rows 2 and 5

## Evidence

- Customer interactions currently run through WhatsApp (Auretris) plus phone, with no connection mechanism in place. [[wiki/sources/SRC-20260724-connections-registry|SRC-20260724-connections-registry]], row 2
- Task tracking has no formal system at all today; Kuanli is named as the intended fix, not a working one. [[wiki/sources/SRC-20260724-connections-registry|SRC-20260724-connections-registry]], row 5

## Competing views

- None yet — only one source ingested.

## Related

- [[wiki/entities/auretris|Auretris]] — the conversation-handling half of this automation.
- [[wiki/entities/kuanli|Kuanli]] — the task-tracking half of this automation.

## Open questions

- What does "fully live" mean operationally for Auretris/Kuanli — full autonomous handling, or human-in-the-loop assist?
- Once connected, what domain (revenue, calendar, etc.) should the AIOS wire next — is lead automation meant to unblock those, or are they independent?

## Sources

- [[wiki/sources/SRC-20260724-connections-registry|SRC-20260724-connections-registry]]
