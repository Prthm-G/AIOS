import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { campusImages } from "@/data/campus-images";
import { universityLogos } from "@/data/logos";
import { Badge } from "@/components/ui/Badge";
import type { UniversityEntry } from "@/lib/content";

export function UniversityCard({ university }: { university: UniversityEntry }) {
  const { id, data } = university;
  const campus = campusImages[id];
  const logo = universityLogos[id];

  return (
    <Link
      href={`/universities/${id}/`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong motion-reduce:transform-none"
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
          <div className="flex h-full items-center justify-center p-8">
            <div className="relative h-16 w-full opacity-80">
              <Image src={logo.src} alt={data.name} fill sizes="220px" className="object-contain" />
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-ink">{data.name}</h3>
          <ArrowUpRight className="size-5 shrink-0 text-ink-faint transition-colors group-hover:text-ink" aria-hidden="true" />
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {data.city}, {data.state} · est. {data.establishedYear}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {data.accreditations.slice(0, 3).map((a) => (
            <Badge key={a}>{a}</Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
