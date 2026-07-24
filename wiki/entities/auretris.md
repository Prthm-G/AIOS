---
type: entity
aliases: ["Auretris bot handler"]
created: 2026-07-24
updated: 2026-07-24
status: draft
tags:
  - entity
  - product
  - automation
source_count: 1
---

# Auretris

## Summary

WhatsApp bot handler used for customer-facing lead interactions. As of the [[wiki/sources/SRC-20260724-connections-registry|connections registry]], it is the primary tool for domain "Customer interactions" (alongside phone), but is not yet wired into the AIOS as a live connection.

## Key facts

- Handles WhatsApp-based customer interactions. [[wiki/sources/SRC-20260724-connections-registry|SRC-20260724-connections-registry]], row 2
- Not yet connected to the AIOS as of 2026-07-24 (mechanism: "not yet connected", no auth configured). [[wiki/sources/SRC-20260724-connections-registry|SRC-20260724-connections-registry]], row 2
- Target: fully live by end of July 2026, per `context/priorities.md` (not yet ingested as a wiki source — cited here as unverified context, not wiki evidence).

## Timeline

- No dated events yet — only the current, unverified status is known.

## Relationships

- [[wiki/entities/kuanli|Kuanli]] — paired system; Auretris handles the WhatsApp conversation layer while Kuanli is meant to handle CRM/task tracking on top of it.
- [[wiki/concepts/lead-management-automation|Lead management automation]] — Auretris is the primary lever for this concept's "customer interactions" half.

## Tensions and contradictions

- None recorded yet.

## Open questions

- What is the current build/deployment status of Auretris — is it live, in testing, or not yet built?
- Where does Auretris run (self-hosted, third-party platform) and what's the auth/API mechanism once connected?

## Sources

- [[wiki/sources/SRC-20260724-connections-registry|SRC-20260724-connections-registry]]
