import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { campusImages } from "@/data/campus-images";
import { universityLogos } from "@/data/logos";
import { Badge } from "@/components/ui/Badge";
import type { UniversityEntry } from "@/lib/content";

// Longest string that still reads as a *label* in a pill rather than a sentence.
const MAX_CHIP = 34;

/**
 * Accreditation entries in the content collection are evidence notes, not labels —
 * several are full sentences (Chandigarh's is 158 characters). Rendered raw into
 * pills they wrapped to four lines, blew the card past its row-mates and broke the
 * grid. This compresses one into something pill-sized WITHOUT changing what it
 * claims; the untouched original stays in the `title` attribute and is rendered in
 * full on the university's own page.
 *
 * Every branch below is deliberately conservative: it either keeps the string,
 * names the same status in fewer words, or marks it self-reported. Nothing here
 * upgrades a hedged claim into a confident one — "not yet confirmed" becomes
 * "UGC status unconfirmed", never "UGC recognised".
 */
export function toChip(raw: string): string {
  let s = raw.trim();

  // UGC status is classified FIRST, ahead of the length short-circuit below:
  // "UGC-recognised (DEB)" is already chip-sized but still has to collapse to the
  // same label as the long entitlement sentences, so the whole listing speaks with
  // one voice about regulatory status.
  //
  // Order matters. An entitlement the university asserts about itself while
  // independent confirmation is still pending is NOT verified, and is caught before
  // the confirmed branch can claim it.
  if (/ugc/i.test(s)) {
    if (/^UGC\s+entitled/i.test(s) && /pending|not yet confirmed/i.test(s)) return "UGC entitled · self-reported";
    if (/not yet confirmed|still pending/i.test(s)) return "UGC status unconfirmed";
    if (/UGC[-\s]?DEB[^.]*entitled|UGC[-\s]?recogni[sz]ed/i.test(s)) return "UGC verified";
    if (/^UGC\s+entitled/i.test(s)) return "UGC entitled · self-reported";
  }

  if (s.length <= MAX_CHIP) return s;

  // "NAAC A++ (CGPA 3.57, per their own accreditation page)" -> "NAAC A++"
  const naac = s.match(/^NAAC\s+(A\+{0,2}|B\+{0,2}|C)\b/i);
  if (naac) return `NAAC ${naac[1].toUpperCase()}`;

  const selfReported = /university-reported|self-reported|own materials/i.test(s);
  const mark = (t: string) => (selfReported ? `${t} · self-reported` : t);

  s = s.replace(/\s*—.*$/, "").trim(); // drop the trailing "— university-reported…" clause
  if (mark(s).length <= MAX_CHIP) return mark(s);

  s = s.replace(/\s*\([^)]*\)/g, "").trim(); // still long: drop parentheticals
  const out = mark(s);
  return out.length <= MAX_CHIP ? out : `${out.slice(0, MAX_CHIP - 1).trimEnd()}…`;
}

export function UniversityCard({ university }: { university: UniversityEntry }) {
  const { id, data } = university;
  const campus = campusImages[id];
  const logo = universityLogos[id];

  // Compress first, then dedupe — two different sentences can legitimately reduce to
  // the same label (e.g. two UGC-DEB entitlement notes), and a card showing the same
  // pill twice looks broken.
  const chips: { label: string; full: string }[] = [];
  for (const a of data.accreditations) {
    const label = toChip(a);
    if (!chips.some((c) => c.label === label)) chips.push({ label, full: a });
    if (chips.length === 3) break;
  }

  return (
    // h-full + the grid's default stretch keeps every card in a row the same height
    // regardless of how long the name wraps or how many chips survive.
    <Link
      href={`/universities/${id}/`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong motion-reduce:transform-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        {campus ? (
          <Image
            src={campus.src}
            alt={campus.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover [filter:grayscale(0.4)_contrast(1.08)_brightness(0.93)] transition duration-500 group-hover:[filter:none]"
          />
        ) : logo?.src ? (
          // No freely-licensed campus photograph exists for this university, so the
          // logo is the honest stand-in. Presented on a deliberate plate rather than
          // floating on flat grey — the marks vary wildly (tall crests vs wide
          // banners with baked-in text), and left unframed they read as broken images.
          <div className="flex h-full items-center justify-center bg-[radial-gradient(120%_100%_at_50%_0%,var(--color-surface),var(--color-surface-2))] p-6">
            {/* The plate takes its height from the logo box, not from the tile. These
                marks range from tall square crests to 5:1 banners; a full-height plate
                left the wide ones marooned in a tall empty box. */}
            <div className="w-full max-w-[15rem] rounded-lg bg-white/75 px-6 py-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-line/60">
              <div className="relative h-20 w-full">
                <Image
                  src={logo.src}
                  alt={`${data.name} logo`}
                  fill
                  sizes="240px"
                  className="object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-medium leading-snug tracking-[-0.02em] text-balance text-ink sm:text-xl">
            {data.name}
          </h3>
          <ArrowUpRight
            className="mt-0.5 size-5 shrink-0 text-ink-faint transition-colors group-hover:text-ink"
            aria-hidden="true"
          />
        </div>
        <p className="mt-1.5 text-sm text-ink-soft">
          {data.city}, {data.state} · est. {data.establishedYear}
        </p>
        {chips.length > 0 && (
          // mt-auto pins the chips to the card's bottom edge, so they line up across a
          // row even when one university's name wraps onto an extra line.
          <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {chips.map((c) => (
              <Badge key={c.label} className="max-w-full" title={c.full}>
                <span className="truncate">{c.label}</span>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
