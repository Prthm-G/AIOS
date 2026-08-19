import { ShieldCheck, Info } from "lucide-react";
import type { University } from "@/content/schema";
import { Badge } from "@/components/ui/Badge";

// ---- Evidence status ---------------------------------------------------------
// Verbatim lines keyed off evidenceStatus, always followed by the same confirm line.
const EVIDENCE_LINES: Record<University["evidenceStatus"], (lastVerifiedAt?: string) => string> = {
  unverified: () =>
    "Programme, mode, and fee details on this page are pending verification against UGC-DEB and official university sources.",
  stale: () =>
    "Fee and programme details here come from internal reference documents and haven't yet been re-confirmed against a current official source.",
  disputed: () =>
    "This profile is under review — some details below may not correctly reflect the awarding institution, programme, or mode.",
  verified: (lastVerifiedAt) =>
    `Verified${lastVerifiedAt ? ` ${lastVerifiedAt}` : ""} against UGC-DEB and official sources.`,
};

export function EvidenceStatus({
  status,
  lastVerifiedAt,
}: {
  status: University["evidenceStatus"];
  lastVerifiedAt?: string;
}) {
  const verified = status === "verified";
  const Icon = verified ? ShieldCheck : Info;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-2 p-4 text-sm leading-relaxed text-ink-soft">
      <Icon className={`mt-0.5 size-4 shrink-0 ${verified ? "text-accent-ink" : "text-ink-faint"}`} aria-hidden="true" />
      <p>{EVIDENCE_LINES[status](lastVerifiedAt)}</p>
    </div>
  );
}

// ---- History timeline --------------------------------------------------------
export function HistoryTimeline({ history }: { history: University["history"] }) {
  return (
    <ol data-reveal-group className="relative space-y-6 border-l border-line pl-6">
      {history.map((h, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border border-line-strong bg-accent" aria-hidden />
          <p className="tnum font-mono text-sm text-accent-ink">{h.year}</p>
          <p className="mt-1 leading-relaxed text-ink-soft">{h.event}</p>
        </li>
      ))}
    </ol>
  );
}

// ---- Achievements ------------------------------------------------------------
export function AchievementsGrid({ achievements }: { achievements: string[] }) {
  return (
    <ul data-reveal-group className="grid gap-4 sm:grid-cols-2">
      {achievements.map((a, i) => (
        <li key={i} className="rounded-xl border border-line bg-surface p-5 leading-relaxed text-ink-soft shadow-soft">
          {a}
        </li>
      ))}
    </ul>
  );
}

// ---- Learning platform -------------------------------------------------------
export function PlatformHighlights({ platform }: { platform: NonNullable<University["learningPlatform"]> }) {
  const cards: { label: string; value?: string; sub?: string }[] = [
    { label: "Learning management system", value: platform.name },
    { label: "AI tutor", value: platform.aiTutor, sub: "24/7 doubt resolution and learning guidance." },
    { label: "Community", value: platform.community },
  ].filter((c) => c.value);

  return (
    <div>
      <div data-reveal-group className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-line bg-surface p-5 shadow-soft">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint">{c.label}</p>
            <p className="mt-2 font-display text-xl font-medium tracking-[-0.02em] text-ink">{c.value}</p>
            {c.sub && <p className="mt-1 text-sm text-ink-soft">{c.sub}</p>}
          </div>
        ))}
      </div>
      {platform.features && platform.features.length > 0 && (
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {platform.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-ink-soft">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span className="leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---- Placements --------------------------------------------------------------
export function PlacementHighlights({ placements }: { placements: NonNullable<University["placements"]> }) {
  return (
    <div>
      {placements.headline && <p className="max-w-2xl text-lg text-ink">{placements.headline}</p>}

      {placements.recruiters && placements.recruiters.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {placements.recruiters.map((r) => (
            <Badge key={r}>{r}</Badge>
          ))}
        </div>
      )}

      {placements.roles && placements.roles.length > 0 && (
        <div data-reveal-group className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {placements.roles.map((role, i) => (
            <div key={i} className="rounded-xl border border-line bg-surface p-5 shadow-soft">
              <p className="text-sm text-ink-soft">{role.role}</p>
              <p className="tnum mt-1 font-display text-xl font-medium tracking-[-0.02em] text-ink">{role.salary}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm leading-relaxed text-ink-faint">
        Figures above are as reported in the university&apos;s own placement materials, not independently audited, ask on
        WhatsApp for the latest verified numbers.
      </p>
    </div>
  );
}

// ---- Jump nav ----------------------------------------------------------------
export function JumpNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="flex flex-wrap gap-2">
      {items.map((it) => (
        <a
          key={it.id}
          href={`#${it.id}`}
          className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
        >
          {it.label}
        </a>
      ))}
    </nav>
  );
}
