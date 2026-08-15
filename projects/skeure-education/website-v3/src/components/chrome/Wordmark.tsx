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
        skeure<span className="text-accent">.</span>
      </span>
      {showVertical && (
        <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-faint">
          education
        </span>
      )}
    </Link>
  );
}
