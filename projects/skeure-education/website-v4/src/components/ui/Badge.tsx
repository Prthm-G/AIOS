import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  /** Full, uncompressed text. Cards shorten long accreditation notes into labels; this
   *  keeps the original reachable on hover instead of losing it. */
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center rounded-full border border-line-strong px-2.5 py-0.5 text-xs font-medium text-ink-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}
