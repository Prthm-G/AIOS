---
type: schema
created: 2026-07-24
updated: 2026-07-24
status: current
tags:
  - wiki/schema
source_count: 0
---

# LLM Wiki Schema

## Ownership

- The human curates sources, directs emphasis, checks important interpretations, and asks questions.
- The agent owns all files under `wiki/`: organization, summaries, synthesis, links, metadata, and maintenance.
- Files under `raw/` are immutable. Corrections arrive as new sources.
- Existing AIOS files outside `raw/` and `wiki/` are context, not wiki evidence unless copied into `raw/`.

## Directory map

| Path | Purpose |
|---|---|
| `raw/` | Immutable primary sources |
| `raw/assets/` | Locally downloaded images and attachments |
| `wiki/sources/` | One evidence note per ingested source |
| `wiki/entities/` | People, organizations, products, places, and projects |
| `wiki/concepts/` | Topics, methods, themes, and recurring ideas |
| `wiki/analyses/` | Comparisons, answers, timelines, and durable synthesis |
| `wiki/overview.md` | Current high-level map of the knowledge base |
| `wiki/index.md` | Complete content catalog and navigation entry point |
| `wiki/log.md` | Append-only activity history |
| `wiki/_templates/` | Required page shapes |

Create subdirectories only after a recurring need appears. Prefer a shallow structure and links over elaborate taxonomy.

## Page contract

Every generated page must:

1. Use the closest template in `wiki/_templates/`.
2. Have YAML frontmatter with `type`, `created`, `updated`, `status`, `tags`, and `source_count`.
3. State what is known, what is inferred, what conflicts, and what remains open.
4. Cite evidence-bearing claims to a note in `wiki/sources/`.
5. Link related pages bidirectionally when the relationship is meaningful.
6. Be listed once in `wiki/index.md`.

Allowed `status` values are `draft`, `current`, `contested`, and `superseded`. Dates use `YYYY-MM-DD`. Filenames use lowercase kebab-case. Source-note filenames use `SRC-YYYYMMDD-slug.md`; add `-02`, `-03`, and so on for collisions.

## Evidence and citations

- Assign a stable `source_id` when ingesting: `SRC-YYYYMMDD-slug`.
- A source note must link to the exact file under `raw/`, summarize it faithfully, and record useful locators such as page, heading, timestamp, figure, or row.
- Cite source notes inline with an Obsidian link followed by a locator, such as a page number, heading, timestamp, figure, or row. Follow `wiki/_templates/entity.md`.
- Use direct quotations sparingly and reproduce them exactly.
- Label interpretation as inference. Do not silently convert correlation, opinion, or marketing claims into fact.
- Generated wiki pages may guide discovery but are not primary evidence.

## Ingest workflow

1. Inventory the new file and check whether it was already ingested.
2. Read the complete source, including relevant tables and locally available images.
3. Create one source note from `wiki/_templates/source.md`.
4. Identify claims, entities, concepts, dates, relationships, contradictions, and open questions.
5. Update existing entity and concept pages before creating new ones.
6. Update affected analyses and `wiki/overview.md` when the overall synthesis changes.
7. Reconcile contradictions explicitly; never overwrite the older claim without a trace.
8. Update `wiki/index.md`.
9. Append one `ingest` entry to `wiki/log.md` listing every page created or changed.
10. Validate metadata, citations, links, and diff.

An ingest is incomplete until steps 8–10 are done.

## Query workflow

1. Read `wiki/index.md`, then search the wiki for the question's terms and aliases.
2. Read the relevant pages and their cited source notes.
3. Answer with citations and distinguish fact, inference, uncertainty, and missing evidence.
4. For a durable synthesis, create or update a page in `wiki/analyses/`, link it from related pages, update the index, and append a `query` log entry.
5. For a disposable factual answer, do not create a page; append to the log only when the query materially changes the wiki.

## Lint workflow

Check:

- claims without source-note citations;
- contradictory claims without a `contested` marker or explanation;
- pages whose source set changed after their `updated` date;
- broken wikilinks and raw-file links;
- pages missing from the index;
- orphan pages with no meaningful inbound link;
- duplicate or near-duplicate entity and concept pages;
- important repeated concepts that lack a page;
- stale summaries superseded by newer evidence;
- source notes without a raw file or log entry;
- useful evidence gaps and candidate sources.

Fix deterministic issues directly. Record judgment calls and research gaps under the relevant page's `Open questions`. Append a `lint` entry to `wiki/log.md` with findings and changes.

## Index and log

- `wiki/index.md` is a content catalog, grouped by page type. Each entry has one link and one useful sentence.
- `wiki/log.md` is append-only and reverse chronological: newest entry directly below its instructions.
- Log headings use `## [YYYY-MM-DD HH:mm TZ] operation | Title`.
- Allowed operations are `setup`, `ingest`, `query`, `lint`, and `maintenance`.
- Never rewrite old log entries except to repair a broken link or factual typo; note the repair in a new entry.
