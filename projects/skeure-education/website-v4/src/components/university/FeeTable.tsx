import type { Fee } from "@/content/schema";
import { formatRs } from "@/lib/format";

// Renders a course/specialization Fee. Two modes:
//  - default: full breakdown (flat fields + every plan, fully expanded)
//  - compact: a single "From Rs. {lowest}" teaser (used on /programs/)
// Labels are verbatim from the Astro FeeTable. No-data → the exact fallback line.

function feeCandidates(fee: Fee): number[] {
  const out: number[] = [];
  for (const v of [fee.lumpsum, fee.annual, fee.semesterWise]) if (typeof v === "number") out.push(v);
  for (const p of fee.plans ?? []) {
    for (const v of [p.oneTimeFee, p.annual, p.semesterWise, p.retailPrice]) if (typeof v === "number") out.push(v);
  }
  return out;
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className="text-sm text-ink-soft">
        {label}
        {note && <span className="text-ink-faint"> {note}</span>}
      </dt>
      <dd className="tnum text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export function FeeTable({ fee, compact = false }: { fee: Fee; compact?: boolean }) {
  const candidates = feeCandidates(fee);

  if (candidates.length === 0) {
    return <p className="text-sm text-ink-faint">Fee details pending, ask on WhatsApp for the latest figures.</p>;
  }

  if (compact) {
    return (
      <p className="tnum text-sm font-medium text-ink">
        From <span className="text-accent-ink">{formatRs(Math.min(...candidates))}</span>
      </p>
    );
  }

  const hasFlat =
    fee.semesterWise != null ||
    fee.annual != null ||
    fee.lumpsum != null ||
    fee.applicationFee != null ||
    fee.examFee != null;

  return (
    <div className="rounded-xl border border-line bg-surface-2 p-4">
      {hasFlat && (
        <dl className="divide-y divide-line">
          {fee.semesterWise != null && <Row label="Semester-wise" value={formatRs(fee.semesterWise)} />}
          {fee.annual != null && <Row label="Annual" value={formatRs(fee.annual)} note="(more cost-effective)" />}
          {fee.lumpsum != null && <Row label="Lumpsum" value={formatRs(fee.lumpsum)} />}
          {fee.applicationFee != null && <Row label="Application fee" value={formatRs(fee.applicationFee)} />}
          {fee.examFee != null && <Row label="Exam fee" value={formatRs(fee.examFee)} />}
        </dl>
      )}

      {fee.plans && fee.plans.length > 0 && (
        <div className={hasFlat ? "mt-4 grid gap-3 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2"}>
          {fee.plans.map((plan) => (
            <div key={plan.name} className="rounded-lg border border-line bg-surface p-3.5">
              <p className="font-display text-sm font-medium tracking-[-0.01em] text-ink">{plan.name}</p>
              <dl className="mt-2 divide-y divide-line">
                {plan.retailPrice != null && <Row label="Retail price" value={formatRs(plan.retailPrice)} />}
                {plan.oneTimeFee != null && (
                  <Row
                    label="One-time fee"
                    value={formatRs(plan.oneTimeFee)}
                    note={plan.oneTimeDiscountPercent != null ? `(${plan.oneTimeDiscountPercent}% discount)` : undefined}
                  />
                )}
                {plan.semesterWise != null && <Row label="Semester-wise" value={formatRs(plan.semesterWise)} />}
                {plan.annual != null && <Row label="Annual" value={formatRs(plan.annual)} note="(more cost-effective)" />}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
