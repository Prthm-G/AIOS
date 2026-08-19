import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { site } from "@/data/site";

// Parametrized CTA band for interior pages (financing/about/faq/university). Shares
// the homepage CtaBand's frosted grid-paper surface but takes its own heading/body.
// The homepage CtaBand stays a separate, hardcoded component.
export function CtaBanner({ heading, body, label = "Chat on WhatsApp" }: { heading: string; body?: string; label?: string }) {
  return (
    <section className="wrap py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface px-6 py-14 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-paper opacity-50 [mask-image:radial-gradient(85%_130%_at_50%_0%,black,transparent)]"
        />
        <h2
          data-reveal
          className="relative mx-auto max-w-2xl font-display font-medium lowercase tracking-[-0.03em] text-ink"
          style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.9rem)", lineHeight: 1 }}
        >
          {heading}
        </h2>
        {body && (
          <p data-reveal className="relative mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            {body}
          </p>
        )}
        <div data-reveal className="relative mt-8 flex justify-center">
          <WhatsAppButton label={label} size="lg" />
        </div>
        <p data-reveal className="relative mt-5 text-sm text-ink-faint">
          {site.officeHours} · Based in India
        </p>
      </div>
    </section>
  );
}
