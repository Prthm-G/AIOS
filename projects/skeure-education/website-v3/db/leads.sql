-- D1 schema for the contact-form lead store used by functions/api/contact.ts.
-- Not applied automatically — this is documentation for the setup step
-- recorded in the remediation report. To actually stand this up:
--
--   npx wrangler d1 create skeure-leads
--   # add the returned database_id to wrangler.jsonc under d1_databases, binding "DB"
--   npx wrangler d1 execute skeure-leads --file=functions/schema/leads.sql --remote
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
