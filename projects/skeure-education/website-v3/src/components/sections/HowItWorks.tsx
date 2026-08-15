import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    n: "01",
    t: "tell us what you're after",
    d: "Message us on WhatsApp with what you'd like to study. No forms, no commitment.",
  },
  {
    n: "02",
    t: "we map your options",
    d: "A real counsellor compares programmes across our partner universities and confirms the real costs — in writing.",
  },
  {
    n: "03",
    t: "enrol with confidence",
    d: "Once you're sure it's right, we help you complete admission and get started online.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-line bg-surface/50">
      <div className="wrap py-20 sm:py-28">
        <SectionHeading title="how it works" intro="Three steps, with a real person beside you at each one." />
        <ol data-reveal-group className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <li key={s.n}>
              <span className="font-display text-5xl font-medium tabular-nums text-accent" aria-hidden="true">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-xl font-medium lowercase tracking-[-0.02em] text-ink">
                {s.t}
              </h3>
              <p className="mt-2 max-w-xs leading-relaxed text-ink-soft">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
