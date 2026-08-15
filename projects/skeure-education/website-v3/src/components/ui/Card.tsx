import { cn } from "@/lib/utils";

// Elevated white surface, hairline, whisper-soft warm shadow (Apple depth).
// Interactive cards lift + deepen the shadow on hover.
export function Card({
  className,
  children,
  interactive = false,
}: {
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-soft",
        interactive &&
          "transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card motion-reduce:transform-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
