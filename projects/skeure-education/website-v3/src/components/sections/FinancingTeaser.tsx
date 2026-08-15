import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

const points = [
  "Instalment options on many programmes",
  "Education-loan guidance where it applies",
  "Exact fees and terms confirmed in writing",
  "No surprise charges, ever",
];

export function FinancingTeaser() {
  return (
    <section className="wrap py-16">
      <div className="grid gap-10 rounded-2xl border border-line bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2
            data-reveal
            className="font-display font-medium lowercase tracking-[-0.03em] text-ink"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)", lineHeight: 1 }}
          >
            financing, made clear
          </h2>
          <p data-reveal className="mt-4 max-w-md leading-relaxed text-ink-soft">
            Many programmes can be paid in instalments, and some qualify for education loans. We
            explain what applies to your choice — and confirm the exact terms in writing before you
            commit to anything.
          </p>
          <div data-reveal className="mt-6">
            <Button href="/financing/" variant="secondary">
              How financing works
            </Button>
          </div>
        </div>
        <ul data-reveal className="space-y-3.5 lg:justify-self-end">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-ink">
              <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" strokeWidth={2.25} aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
