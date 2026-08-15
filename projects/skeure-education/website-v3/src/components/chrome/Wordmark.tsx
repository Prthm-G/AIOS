import Link from "next/link";
import { cn } from "@/lib/utils";

// Lowercase Space Grotesk wordmark with a single amber dot — echoing the one
// amber accent of the pinned reference. The dot is the whole brand's color budget
// in the header.
export function Wordmark({ className, showVertical = true }: { className?: string; showVertical?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Skeure Education — home"
      className={cn(
        "group inline-flex items-baseline gap-2 font-display lowercase tracking-[-0.04em] text-ink",
        className,
      )}
    >
      <span className="text-xl font-semibold leading-none sm:text-[1.4rem]">
        {/* The dot is decoration, not punctuation. Hiding it from the a11y tree makes
            the link's visible text read "skeure education", which the aria-label then
            contains — WCAG 2.5.3 Label in Name requires that, and the stray "." was
            the only reason it failed. */}
        skeure
        <span className="text-accent" aria-hidden="true">
          .
        </span>
      </span>{" "}
      {/* That space is load-bearing. The two words are separate flex children with no
          text node between them, so the accessible name computed from content was
          "skeureeducation" — which the aria-label cannot contain, failing WCAG 2.5.3.
          A whitespace-only text node is discarded by flex layout, so nothing moves. */}
      {showVertical && (
        <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-soft">
          education
        </span>
      )}
    </Link>
  );
}
