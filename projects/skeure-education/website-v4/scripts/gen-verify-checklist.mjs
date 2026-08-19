// Generates CONTENT-VERIFY.md — a per-university checklist of every factual claim
// the site currently publishes, for human sign-off before the education.skeure.com
// cutover.
//
// This is a one-shot authoring aid, not part of the build. Run it when the content
// changes enough that the checklist needs reissuing:
//
//   node scripts/gen-content.mjs && node scripts/gen-verify-checklist.mjs
//
// The point is that every claim below is currently PUBLISHED. `evidenceStatus` is
// self-reported metadata, not a check anyone performed — as of writing, 7 of 10
// profiles say `stale` and 3 say `unverified`, and none carry a verification date.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { universities } = JSON.parse(readFileSync(join(root, "src/content/_generated.json"), "utf8"));

/** Renders one claim as a checkbox row. `value` is shown verbatim so it can be compared at a glance. */
const row = (label, value) => `| ${label} | ${value} | [ ] | [ ] |  |`;

const lines = [];

lines.push(`# Content verification — university profiles

**Generated:** ${new Date().toISOString().slice(0, 10)} · **Profiles:** ${universities.length}

Every claim in this document is **currently published** on the site. Before
education.skeure.com cuts over to website-v3, each one needs a human decision.

## How to use this

For each row, tick **OK** or **Wrong**. If Wrong, put the correct value in the last
column. Leave a row blank if you genuinely don't know — blank means "still unverified"
and the profile keeps its current \`evidenceStatus\` flag rather than being upgraded.

You do not need to do all ten at once. Any profile where **every** row is ticked gets
\`evidenceStatus: verified\` and today's \`lastVerifiedAt\`. Partial profiles stay flagged.

Highest-risk rows are marked **⚠️** — these are the claims most likely to be
stale, most likely to be challenged, and most damaging if wrong: fee figures,
placement salaries, hiring-partner counts, and accreditations.

Accreditation entries already carrying "university-reported, not independently
verified" are honest as written. Ticking OK on those confirms the university still
*claims* it, not that you have independently verified it.

---
`);

// Summary table placeholder — filled after the per-profile sections are built, so
// the counts come from the rows that were actually emitted rather than a second
// traversal that could drift out of sync.
const SUMMARY_MARKER = "<!--SUMMARY-->";
lines.push(SUMMARY_MARKER, "");

const perProfile = [];

for (const [i, uni] of universities.entries()) {
  const startLine = lines.length;
  const d = uni.data;
  lines.push(`## ${i + 1}. ${d.name}`);
  lines.push("");
  lines.push(`\`${uni.id}\` · evidenceStatus: **${d.evidenceStatus}** · ${d.featured ? "featured on homepage" : "not featured"}`);
  lines.push(`Live page: https://education.skeure.com/universities/${uni.id}/`);
  lines.push(`Official site on file: ${d.officialSite}`);
  lines.push("");
  lines.push("| Claim | Currently published | OK | Wrong | Correct value |");
  lines.push("|---|---|:--:|:--:|---|");

  lines.push(row("Display name", d.name));
  lines.push(row("City", d.city ?? "—"));
  lines.push(row("State", d.state ?? "—"));
  lines.push(row("Established", d.establishedYear ?? "—"));
  lines.push(row("Official site", d.officialSite ?? "—"));

  for (const a of d.accreditations ?? []) lines.push(row("⚠️ Accreditation", a));

  for (const h of d.history ?? []) lines.push(row("History", `${h.year} — ${h.event}`));

  for (const a of d.achievements ?? []) lines.push(row("⚠️ Achievement", a));

  if (d.learningPlatform) {
    const p = d.learningPlatform;
    lines.push(row("Platform name", p.name ?? "—"));
    if (p.aiTutor) lines.push(row("Platform AI tutor", p.aiTutor));
    if (p.community) lines.push(row("Platform community", p.community));
    for (const f of p.features ?? []) lines.push(row("Platform feature", f));
  }

  if (d.placements) {
    const p = d.placements;
    if (p.headline) lines.push(row("⚠️ Placement headline", p.headline));
    if (p.hiringPartnersCount) lines.push(row("⚠️ Hiring partners count", p.hiringPartnersCount));
    if (p.recruiters?.length) lines.push(row("⚠️ Named recruiters", p.recruiters.join(", ")));
    for (const r of p.roles ?? []) lines.push(row("⚠️ Role + salary", `${r.role} — ${r.salary}`));
  }

  for (const c of d.courses ?? []) {
    const fee = c.fee ?? c.totalFee ?? c.feePerSemester ?? null;
    lines.push(row("Course", `${c.name}${c.duration ? ` (${c.duration})` : ""}`));
    if (fee) lines.push(row("⚠️ Course fee", `${c.name} — ${fee}`));
    for (const s of c.specializations ?? []) lines.push(row("Specialization", `${c.name} — ${s}`));
  }

  for (const f of d.faq ?? []) lines.push(row("FAQ answer", `**${f.question}** → ${f.answer}`));

  const emitted = lines.slice(startLine).filter((l) => l.startsWith("| ") && l.endsWith(" |  |"));
  perProfile.push({
    name: d.name,
    id: uni.id,
    status: d.evidenceStatus,
    total: emitted.length,
    risky: emitted.filter((l) => l.includes("⚠️")).length,
  });

  lines.push("");
  lines.push(`**Anything published here that should be removed entirely?**`);
  lines.push("");
  lines.push("---");
  lines.push("");
}

const totalClaims = perProfile.reduce((n, p) => n + p.total, 0);
const totalRisky = perProfile.reduce((n, p) => n + p.risky, 0);

const summary = [
  "## Triage",
  "",
  `**${totalClaims} claims across ${perProfile.length} profiles, of which ${totalRisky} are high-risk (⚠️).**`,
  "",
  "If you only do one pass, do the ⚠️ rows. They are the fee figures, salary numbers,",
  "hiring-partner counts and accreditations — the claims a prospective student's family",
  "will actually check, and the ones that cost you if they're wrong.",
  "",
  "| # | University | Status now | ⚠️ risky | All claims |",
  "|---|---|---|--:|--:|",
  ...perProfile.map((p, i) => `| ${i + 1} | [${p.name}](#${i + 1}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}) | ${p.status} | ${p.risky} | ${p.total} |`),
  `| | **Total** | | **${totalRisky}** | **${totalClaims}** |`,
];

writeFileSync(
  join(root, "CONTENT-VERIFY.md"),
  lines.join("\n").replace(SUMMARY_MARKER, summary.join("\n")),
);

console.log(`CONTENT-VERIFY.md → ${perProfile.length} profiles, ${totalClaims} claims (${totalRisky} high-risk)`);
for (const p of perProfile) console.log(`  ${String(p.risky).padStart(3)} risky / ${String(p.total).padStart(3)} total  ${p.status.padEnd(11)} ${p.name}`);
