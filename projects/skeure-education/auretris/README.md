# auretris

Knowledge base for two separate things that share the "Auretris" name, both outside AIOS at `/home/user/automation_stack`. **This folder holds docs only — no app code.**

1. **Auretris the WhatsApp bot + CRM ("Kuanli")** — runs Skeure Education's lead handling. Lives in `automation_stack/wacrm`.
2. **Auretris the marketing site** (`auretris.prathamgoel.com`) — a separate, standalone Next.js app introducing "Auretris" as a product. Lives in `automation_stack/auretris-site`, its own sibling folder, not inside `wacrm`.

These were briefly conflated: an earlier session built the marketing site's pages, components, and design assets directly inside `wacrm`, hijacking its production root route. That was corrected on 2026-07-31 — see [`decisions/log.md`](decisions/log.md) for the fix, and [`context/overview.md`](context/overview.md) for the current, accurate architecture of both.

| Path | Purpose |
|---|---|
| [`context/overview.md`](context/overview.md) | What each app actually is, tech stack, where the code/containers live, current run status |
| [`decisions/log.md`](decisions/log.md) | Append-only decision record for this workspace |

Root AIOS [`connections.md`](../../../connections.md) also carries a summary entry for the WhatsApp/CRM side of this system.
