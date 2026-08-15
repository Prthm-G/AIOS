import { getUniversities } from "@/lib/content";
import { sortByPriority } from "@/data/universityOrder";
import { UniversityCard } from "./UniversityCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function FeaturedUniversities() {
  const featured = sortByPriority(getUniversities().filter((u) => u.data.featured));

  return (
    <section className="wrap py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          title="partner universities"
          intro="A few of the recognised universities we counsel students into. Every page lays out programmes, fees, and the real details — plainly."
        />
        <Button href="/universities/" variant="link" size="md">
          See all universities
        </Button>
      </div>
      <div data-reveal-group className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((u) => (
          <UniversityCard key={u.id} university={u} />
        ))}
      </div>
    </section>
  );
}
