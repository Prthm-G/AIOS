# Connections

Registry of every system your AIOS can reach. Filled by `/onboard` from Q4-Q7 answers; expanded over time as you wire new tools. `/audit` checks this file for domain coverage and freshness.

| # | Domain | Tool | Mechanism | Auth | Last checked |
|---|---|---|---|---|---|
| 1 | Revenue / Financials | No system — commissions land across multiple per-university bank accounts, untracked | not yet connected | — | — |
| 2 | Customer interactions | WhatsApp (via Auretris bot handler) + Phone | not yet connected | — | — |
| 3 | Calendar | Not specified — confirm: Gmail or Outlook calendar? | not yet connected | — | — |
| 4 | Communication | Email (docs exchange with universities only) + WhatsApp/Phone (day-to-day) | not yet connected | — | — |
| 5 | Project / task tracking | None formal yet — Kuanli (WA CRM) intended to fill this once live | not yet connected | — | — |
| 6 | Meeting intelligence | No recording tool yet | not yet connected | — | — |
| 7 | Knowledge / files | Brochures: `/home/user/automation_stack/brochures`; university FAQ data: PostgreSQL DB; other internal files: local office server | not yet connected | — | — |

**Mechanism options:** `mcp` (MCP server), `script` (Python/Bash hitting an API, in `scripts/`), `export` (CSV/JSON dump pipeline), `key+ref` (`.env` key + `references/{tool}-api.md` guide), `not yet connected`.

When you wire a new tool, also save `references/{tool}-api.md` capturing endpoints, auth flow, and common queries — researched-once-saved-forever.
