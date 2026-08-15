-- D1 schema for the contact-form lead store used by src/app/api/contact/route.ts.
--
-- ALREADY APPLIED. The `skeure-leads` database (a0ae43dd-59b1-4f6e-8ee6-3b6ef8bfad68)
-- was stood up for the Astro site and has been taking live leads since; this file
-- is the record of its shape, not a migration to run. website-v3 binds the SAME
-- database (see wrangler.jsonc) so the Pages -> Workers cutover does not split
-- leads across two tables.
--
-- Only run this against a NEW database. Re-running it here is harmless
-- (IF NOT EXISTS) but pointless.
--
--   npx wrangler d1 execute skeure-leads --file=db/leads.sql --remote
--
-- Contains only what the user typed into the form — no analytics IDs, no
-- third-party tokens. Treat this table as containing PII (name/email/phone):
-- restrict dashboard/API access accordingly.

CREATE TABLE IF NOT EXISTS leads (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	created_at TEXT NOT NULL,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	phone TEXT,
	interest TEXT,
	message TEXT,
	source TEXT,
	landing_page TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
