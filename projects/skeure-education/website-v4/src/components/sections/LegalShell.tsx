import { PageHero } from "./PageHero";

// Shared shell for the draft legal pages (privacy, terms). Renders the signature
// header, a "Last updated" line, the legal prose, and the not-yet-binding notice.
export function LegalShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title.toLowerCase()} motif="legal">
        <p data-reveal className="mt-5 text-sm text-ink-faint">
          Last updated: {lastUpdated}
        </p>
      </PageHero>

      <section className="py-12 sm:py-16">
        <div
          className="wrap-narrow space-y-4 leading-relaxed text-ink-soft [&_a]:text-accent-ink [&_a]:underline [&_a]:decoration-line-strong [&_a]:underline-offset-4 hover:[&_a]:decoration-accent [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:lowercase [&_h2]:tracking-[-0.02em] [&_h2]:text-ink [&_li]:marker:text-ink-faint [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
        >
          {children}
        </div>

        <div className="wrap-narrow">
          <p className="mt-12 rounded-xl border border-line bg-surface-2 p-4 text-sm leading-relaxed text-ink-soft">
            This page is being finalized with legal review and is not yet in effect as a binding policy.
          </p>
        </div>
      </section>
    </>
  );
}
