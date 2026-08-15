import { SectionHeading } from "@/components/ui/SectionHeading";

// Editorial definition list, hairline-separated — deliberately not a grid of
// identical cards.
const points = [
  {
    k: "recognised, degree-first",
    v: "Every programme is a UGC-recognised online degree — the same qualification employers know, delivered online.",
  },
  {
    k: "we compare, we don't push",
    v: "We counsel across all our partner universities, never just one. The right fit is the one that fits you.",
  },
  {
    k: "costs in writing, first",
    v: "We confirm the exact fees and any financing terms in writing before you apply. No surprises later.",
  },
  {
    k: "free, and no pressure",
    v: "Counselling costs nothing, and there is never any pressure to enrol. Ask us anything.",
  },
];

export function TrustCallouts() {
  return (
    <section className="wrap py-20 sm:py-28">
      <SectionHeading title="why families trust us" className="mb-10" />
      <dl data-reveal-group className="grid sm:grid-cols-2 sm:gap-x-12">
        {points.map((p) => (
          <div key={p.k} className="grid gap-2 border-t border-line py-7 sm:py-8">
            <dt className="font-display text-xl font-medium lowercase tracking-[-0.02em] text-ink">
              {p.k}
            </dt>
            <dd className="max-w-md leading-relaxed text-ink-soft">{p.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
