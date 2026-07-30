# Skeure SEO acceptance gates

## Research

- Cite current primary sources beside material claims.
- Separate OpenSEO estimates, GSC first-party data, observed facts, and inference.
- Record date, market, language, device, and location where metrics depend on them.

## Content

- Evidence ledger record is `verified`.
- Search intent and target URL are present in the keyword map.
- Author/reviewer, commercial disclosure, sources, and last-verified date are defined.
- A second model audits accuracy, duplication, helpfulness, and unsupported claims.

## Code

- Applicable `AGENTS.md` instructions were followed.
- Build/type checks pass.
- Crawl, metadata, canonical, robots, sitemap, schema, responsive, keyboard, and lead-flow checks pass as relevant.
- A model other than the writer reviews the diff.

## Migration

- Every valuable old URL has an approved closest destination.
- Destination content exists and is verified before redirect activation.
- Redirects, canonicals, internal links, sitemaps, analytics, and rollback are tested.
- Human approval is obtained before production activation or Change of Address.

## Model assignment

| Work | Primary | Peer |
|---|---|---|
| User conversation and orchestration | Claude | Codex review |
| OpenSEO workflow | Claude | Codex challenge |
| Repository implementation | Either | The other model |
| Regulatory facts | Official sources + human owner | Both models independently |
| Final legal/finance approval | Qualified human | Models assist only |
