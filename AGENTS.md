# Agent Instructions

## Package Manager
- No root package manager. Follow nested project instructions for subproject commands.

## Operating Context
- Read `CLAUDE.md` for the operator, business, priorities, and voice.
- Read `wiki/schema.md` before any wiki ingest, query, or lint operation.
- Treat `raw/` as immutable source material and `wiki/` as agent-maintained output.

## Wiki Operations
- **Ingest:** read one source fully, create/update its source note, integrate claims into relevant pages, then update `wiki/index.md` and append to `wiki/log.md`.
- **Query:** read `wiki/index.md` first, inspect relevant pages and source notes, cite evidence, and file durable new synthesis under `wiki/analyses/`.
- **Lint:** check contradictions, stale claims, missing citations, broken links, orphan pages, thin concepts, duplicate pages, and index drift.
- Never invent a source, locator, quotation, date, or certainty level.
- Preserve disagreement. Mark conflicting claims and explain which evidence is newer or stronger.
- Prefer updating an existing page over creating a near-duplicate.

## Boundaries
- Never edit, rename, or delete files under `raw/`.
- Do not treat generated pages in `wiki/` as primary evidence.
- Keep business decisions in `decisions/log.md`; keep wiki activity in `wiki/log.md`.
- Archive superseded synthesis in place with status metadata; do not erase history.

## Markdown
- Use Obsidian `[[wikilinks]]` for vault pages.
- Use YAML frontmatter and templates from `wiki/_templates/`.
- Use lowercase kebab-case filenames except source notes, which use `SRC-YYYYMMDD-slug.md`.
- Every evidence-bearing claim must cite a source note and, where possible, a section, page, timestamp, or row.

## Validation
- Review `git diff --check` and changed wiki links after edits.
- Confirm every new page appears in `wiki/index.md`.
- Confirm every completed operation is appended to `wiki/log.md`.

## Commit Attribution
AI commits MUST include:
```
Co-Authored-By: Codex <noreply@openai.com>
```
