import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { site } from "@/data/site";

export function CtaBand() {
  return (
    <section className="wrap">
      <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface px-6 py-16 text-center sm:px-12 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-paper opacity-50 [mask-image:radial-gradient(85%_130%_at_50%_0%,black,transparent)]"
        />
        <h2
          data-reveal
          className="relative mx-auto max-w-3xl font-display font-medium lowercase tracking-[-0.03em] text-ink"
          style={{ fontSize: "clamp(2rem, 5.5vw, 3.75rem)", lineHeight: 0.98 }}
        >
          not sure where to start<span className="text-accent">?</span> that&apos;s exactly what we&apos;re for.
        </h2>
        <p data-reveal className="relative mx-auto mt-6 max-w-xl text-lg text-ink-soft">
          One message, and a real counsellor walks you through your options — free, and with no
          pressure to enrol.
        </p>
        <div data-reveal className="relative mt-9 flex justify-center">
          <WhatsAppButton label="Book free counselling" size="lg" />
        </div>
        <p data-reveal className="relative mt-5 text-sm text-ink-faint">
          {site.officeHours} · Based in India
        </p>
      </div>
    </section>
  );
}
