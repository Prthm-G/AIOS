import Image from "next/image";
import { getUniversities } from "@/lib/content";
import { universityLogos } from "@/data/logos";

// Full-colour partner logos in a continuous moving banner (see .marquee in
// globals.css). The row is duplicated so the loop is seamless; the second copy is
// hidden from assistive tech.
export function PartnerStrip() {
  const unis = getUniversities().filter((u) => universityLogos[u.id]?.src);
  const row = [...unis, ...unis];

  return (
    <section className="border-y border-line py-11 sm:py-12">
      <p className="wrap text-center text-xs uppercase tracking-[0.2em] text-ink-faint">
        Counselling into recognised degrees from
      </p>
      <div className="marquee mt-8">
        <ul className="marquee-track">
          {row.map((u, i) => (
            <li
              key={`${u.id}-${i}`}
              aria-hidden={i >= unis.length}
              className="relative h-10 w-32 shrink-0 opacity-90 transition-opacity duration-300 hover:opacity-100 sm:h-11 sm:w-36"
            >
              <Image
                src={universityLogos[u.id]!.src!}
                alt={i < unis.length ? u.data.name : ""}
                fill
                sizes="144px"
                className="object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
