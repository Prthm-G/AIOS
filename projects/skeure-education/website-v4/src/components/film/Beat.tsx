import Image from "next/image";
import { filmBeats, mobileBeatSrc } from "@/data/filmBeats";
import { cn } from "@/lib/utils";

/**
 * One beat of THE LONG OPEN.
 *
 * The section's `id` is what drives the film: FilmStage reads the beat map, finds
 * these ids in the DOM, and widens the lid as each one approaches. A beat that is
 * reordered against the map desynchronises the lid from the content — deliberately.
 * The page is one continuous shot, and this is what makes it breakable.
 *
 * Desktop (lg+): the machine is drawn by the FilmStage canvas behind the content.
 * `side="left"` confines the content to the left half while the machine holds the
 * right; `side="center"` centres it, for the two beats where the machine is centred
 * and the content sits above and below it (arrive, invite).
 *
 * Mobile: no canvas and no 61-frame download. Each beat renders its own still of
 * the machine at exactly the lid angle the map assigns it — seven stills, each one
 * a few degrees more open, is the film translated for a phone. Stills are derived
 * from the same beat map by scripts/build-frames.sh, so the two cannot drift.
 */
export function Beat({
  id,
  side = "left",
  still = true,
  className,
  children,
}: {
  id: string;
  side?: "left" | "center";
  /** Render the mobile still. The two centred beats place it themselves. */
  still?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const index = filmBeats.findIndex((b) => b.id === id);
  if (index === -1 && process.env.NODE_ENV !== "production") {
    throw new Error(`Beat "${id}" is not in the beat map (src/data/filmBeats.ts).`);
  }

  return (
    <section
      id={id}
      className={cn(
        "relative z-10 flex flex-col justify-center py-16 sm:py-20 lg:min-h-[100svh] lg:py-24",
        className,
      )}
    >
      {still && (
        <div className="wrap lg:hidden">
          <Image
            src={mobileBeatSrc(index)}
            alt=""
            aria-hidden="true"
            width={760}
            height={489}
            sizes="(max-width: 640px) 88vw, 520px"
            className="mx-auto mb-8 w-full max-w-[520px]"
          />
        </div>
      )}
      {side === "left" ? (
        <div className="wrap my-auto w-full">
          <div className="lg:w-[46%]">{children}</div>
        </div>
      ) : (
        // Centre beats (arrive, invite) spread their children across the full
        // viewport height on lg — text above the machine, CTAs below it — so the
        // children must be direct flex items, not nested in a second wrapper.
        <div className="wrap flex w-full flex-1 flex-col items-center justify-center text-center lg:justify-between">
          {children}
        </div>
      )}
    </section>
  );
}

/** Mono eyebrow for the doubt sequence. Numbered because the order is real: it is
 *  the order the questions actually arrive in counselling conversations. */
export function BeatEyebrow({ n, label }: { n: number; label: string }) {
  return (
    <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-faint">
      <span className="text-accent-ink tnum">{String(n).padStart(2, "0")}</span>
      <span aria-hidden="true"> · </span>
      {label}
    </p>
  );
}
