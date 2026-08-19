import { Download } from "lucide-react";
import type { Specialization } from "@/content/schema";
import { FeeTable } from "./FeeTable";

// Every specialization rendered open (the fully-expanded decision). Name, optional
// description, optional fee breakdown, optional brochure download.
export function SpecializationList({ specializations }: { specializations: Specialization[] }) {
  return (
    <div className="mt-5 border-t border-line pt-5">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-faint">
        {specializations.length} specialization{specializations.length === 1 ? "" : "s"}
      </p>
      <ul className="mt-4 space-y-4">
        {specializations.map((spec) => (
          <li key={spec.name} className="rounded-xl border border-line bg-surface p-4">
            <p className="font-display text-base font-medium tracking-[-0.01em] text-ink">{spec.name}</p>
            {spec.description && <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{spec.description}</p>}
            {spec.fee && (
              <div className="mt-3">
                <FeeTable fee={spec.fee} />
              </div>
            )}
            {spec.brochureUrl && (
              <a
                href={spec.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="download_brochure"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
              >
                <Download className="size-4" aria-hidden="true" />
                Download brochure
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
