import { cn } from "@/lib/utils";

// Lowercase display heading in the giant-type register. No eyebrow/kicker — the
// heading carries its own weight (craft floor).
export function SectionHeading({
  title,
  intro,
  id,
  align = "start",
  className,
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <h2
        id={id}
        data-reveal
        className="font-display lowercase font-medium tracking-[-0.03em] text-ink"
        style={{ fontSize: "clamp(1.9rem, 4vw, 2.9rem)", lineHeight: 1.0 }}
      >
        {title}
      </h2>
      {intro && (
        <p data-reveal className="mt-4 text-lg leading-relaxed text-ink-soft">
          {intro}
        </p>
      )}
    </div>
  );
}
