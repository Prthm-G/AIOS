import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import type { UniversityEntry } from "@/lib/content";
import { universityLogos } from "@/data/logos";
import { site } from "@/data/site";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function UniversityHero({ university }: { university: UniversityEntry }) {
  const { id, data } = university;
  const logo = universityLogos[id];
  const askHref = `${site.whatsappLink}?text=${encodeURIComponent(`Hi, I'd like to know more about ${data.name}.`)}`;

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="aura aura-drift-a bg-aura-peach absolute left-[-8%] top-[-16%] size-[32rem]" />
        <div className="aura aura-drift-b bg-aura-lilac absolute right-[-6%] top-[-8%] size-[24rem]" />
      </div>

      <div className="wrap">
        <Link
          href="/universities/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All universities
        </Link>

        {data.noindex && (
          <p
            data-reveal
            className="mt-6 rounded-xl border border-line bg-surface-2 p-4 text-sm leading-relaxed text-ink-soft"
          >
            This profile is temporarily unpublished while we verify the correct awarding institution and programme
            details. It isn&apos;t part of our confirmed partner list yet — ask us on WhatsApp for current guidance.
          </p>
        )}

        <div className="mt-6" />
        {data.accreditations.length > 0 && (
          <div data-reveal className="flex flex-wrap gap-1.5">
            {data.accreditations.slice(0, 4).map((a) => (
              <Badge key={a}>{a}</Badge>
            ))}
          </div>
        )}

        {logo?.src && (
          <div data-reveal className="mt-6 flex h-16 w-48 items-center justify-start">
            <div className="relative h-full w-full">
              <Image src={logo.src} alt={data.name} fill sizes="192px" className="object-contain object-left" />
            </div>
          </div>
        )}

        <h1
          data-reveal
          className="mt-6 font-display font-medium lowercase tracking-[-0.03em] text-ink"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)", lineHeight: 1 }}
        >
          {data.name}
        </h1>
        <p data-reveal className="mt-3 text-ink-soft">
          {data.city}, {data.state} · Est. {data.establishedYear}
        </p>

        <div data-reveal className="mt-7 flex flex-wrap gap-3">
          <Button
            href={askHref}
            external
            variant="accent"
            dataAttrs={{ "data-analytics-event": "click_whatsapp" }}
          >
            Ask about {data.name}
          </Button>
          <Button
            href={data.officialSite}
            external
            variant="secondary"
            dataAttrs={{ "data-analytics-event": "exit_to_university" }}
          >
            Official website
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
