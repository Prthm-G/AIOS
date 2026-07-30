# Project skill router

This is the authoritative small skill catalog for Claude–Codex handoffs. Read only the
smallest set needed for the task. The bridge always selects `codex-bridge` and
`skeure-seo-orchestrator`; add a workflow skill when its trigger applies.

If several triggers apply to one genuinely atomic task, load every applicable workflow
skill in the table order below. If the task can be split without losing necessary context,
prefer sequential bounded handoffs and route each handoff independently.

| Skill | Use when |
|---|---|
| `codex-bridge` | Any Claude-to-Codex handoff, review, or bounded implementation |
| `skeure-seo-orchestrator` | Any Skeure Education SEO workstream or phase gate |
| `seo-project-setup` | Creating or checking OpenSEO project context and baselines |
| `seo-coach` | Choosing the next SEO action from current project state and evidence |
| `competitive-landscape` | Mapping the market, categories, and a defensible competitor set |
| `competitor-analysis` | Comparing named domains, pages, rankings, backlinks, or content gaps |
| `keyword-research` | Discovering and evaluating search demand and intent |
| `keyword-clustering` | Grouping keywords and assigning one primary URL per intent |
| `link-prospecting` | Finding and qualifying backlink or digital-PR prospects |
| `deslop` | Reviewing or rewriting copy to remove generic AI prose |

Every skill is stored at:

```text
.agents/skills/<skill-name>/SKILL.md
```

Claude uses symlinks under `.claude/skills/`; Codex reads the canonical `.agents/skills/`
copy. Do not automatically load the machine-wide skill catalog. It is intentionally large
and can exceed Codex's model-visible skill-description budget.

OpenSEO is a data source, not an authority for unverified institutional claims. Its MCP
results must be labeled as OpenSEO or third-party estimates unless the underlying source
is first-party.
