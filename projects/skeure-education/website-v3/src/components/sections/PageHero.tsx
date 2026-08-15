import { cn } from "@/lib/utils";

// Signature interior-page header. Each page opens with its own drifting
// iridescent-aura motif behind a Fragment Mono eyebrow, a giant lowercase title,
// an optional intro, and optional actions. Auras are decorative, transform/opacity
// only, and stop entirely under reduced motion (see .aura-drift-* in globals.css).
// Server component — no JS needed, zero CLS.

type Motif = "universities" | "programs" | "financing" | "about" | "blog" | "faq" | "contact" | "legal" | "notfound";

type Blob = {
  color: string; // aura token utility, e.g. "bg-aura-peach"
  drift: "a" | "b";
  className: string; // size + placement
  style?: React.CSSProperties;
};

// One distinct aura arrangement per page. Restraint is the point — two blobs max,
// pulled toward the top so the field stays calm below the fold.
const MOTIFS: Record<Motif, Blob[]> = {
  universities: [
    { color: "bg-aura-peach", drift: "a", className: "left-[-8%] top-[-14%] size-[34rem]" },
    { color: "bg-aura-lilac", drift: "b", className: "right-[-6%] top-[-8%] size-[26rem]" },
  ],
  programs: [
    { color: "bg-aura-sky", drift: "a", className: "left-[-6%] top-[-12%] size-[30rem]" },
    { color: "bg-aura-mint", drift: "b", className: "right-[-8%] top-[-16%] size-[32rem]" },
  ],
  financing: [
    { color: "bg-aura-butter", drift: "a", className: "left-[-4%] top-[-16%] size-[32rem]" },
    { color: "bg-aura-peach", drift: "b", className: "right-[-10%] top-[-6%] size-[24rem]" },
  ],
  about: [
    { color: "bg-aura-peach", drift: "a", className: "left-[-8%] top-[-12%] size-[32rem]" },
    { color: "bg-aura-mint", drift: "b", className: "right-[-6%] top-[-14%] size-[28rem]" },
  ],
  blog: [
    { color: "bg-aura-lilac", drift: "a", className: "left-[-6%] top-[-14%] size-[30rem]" },
    { color: "bg-aura-sky", drift: "b", className: "right-[-8%] top-[-8%] size-[26rem]" },
  ],
  faq: [
    { color: "bg-aura-mint", drift: "a", className: "left-[-8%] top-[-12%] size-[30rem]" },
    { color: "bg-aura-butter", drift: "b", className: "right-[-6%] top-[-16%] size-[28rem]" },
  ],
  contact: [
    { color: "bg-aura-peach", drift: "a", className: "left-[-6%] top-[-12%] size-[32rem]" },
    { color: "bg-aura-sky", drift: "b", className: "right-[-8%] top-[-14%] size-[28rem]" },
  ],
  legal: [{ color: "bg-aura-lilac", drift: "a", className: "left-1/2 top-[-14%] size-[26rem] -translate-x-1/2", style: { opacity: 0.3 } }],
  notfound: [
    { color: "bg-aura-peach", drift: "a", className: "left-[-6%] top-[-10%] size-[30rem]" },
    { color: "bg-aura-lilac", drift: "b", className: "right-[-8%] top-[-14%] size-[26rem]" },
  ],
};

export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
  motif,
  align = "start",
  titleClassName,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  motif: Motif;
  align?: "start" | "center";
  titleClassName?: string;
  children?: React.ReactNode;
}) {
  const blobs = MOTIFS[motif];
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {blobs.map((b, i) => (
          <div key={i} className={cn("aura", `aura-drift-${b.drift}`, b.color, "absolute", b.className)} style={b.style} />
        ))}
      </div>
      <div className={cn("wrap pb-4", align === "center" && "text-center")}>
        <p
          data-reveal
          className={cn(
            "font-mono text-[0.7rem] uppercase tracking-[0.22em] text-accent-ink sm:text-xs",
            align === "center" && "mx-auto",
          )}
        >
          {eyebrow}
        </p>
        <h1
          data-reveal
          className={cn(
            "mt-4 font-display font-medium lowercase tracking-[-0.03em] text-ink",
            align === "center" && "mx-auto",
            titleClassName,
          )}
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.25rem)", lineHeight: 0.98 }}
        >
          {title}
        </h1>
        {intro && (
          <div
            data-reveal
            className={cn("mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft", align === "center" && "mx-auto")}
          >
            {intro}
          </div>
        )}
        {actions && (
          <div data-reveal className={cn("mt-8 flex flex-wrap gap-3", align === "center" && "justify-center")}>
            {actions}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
