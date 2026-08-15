import type { Metadata } from "next";
import { getUniversities } from "@/lib/content";
import { sortByPriority } from "@/data/universityOrder";
import { PageHero } from "@/components/sections/PageHero";
import { UniversityCard } from "@/components/sections/UniversityCard";
import { breadcrumbListJsonLd, itemListJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Partner Universities for Online Degrees",
  description: "Explore our partner universities offering online and distance UG and PG degree programs.",
  alternates: { canonical: "/universities/" },
  openGraph: {
    title: "Partner Universities for Online Degrees · Skeure Education",
    description: "Explore our partner universities offering online and distance UG and PG degree programs.",
    url: "/universities/",
  },
};

export default function UniversitiesPage() {
  const universities = sortByPriority(getUniversities());
  const count = universities.length;

  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Universities", url: "/universities/" },
  ]);
  const itemList = itemListJsonLd(
    universities.map((u) => ({ name: u.data.name, url: `/universities/${u.id}/` })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <PageHero
        eyebrow="Partner universities"
        title="explore universities"
        motif="universities"
        intro={`Showing ${count} university partner${count === 1 ? "" : "s"}.`}
      >
        <p data-reveal className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-faint">
          Programme details on each page come from university reference documents and are refreshed as we re-confirm
          them against official sources. Ask us on WhatsApp to confirm your exact programme and fees before applying.
        </p>
      </PageHero>

      <section className="wrap py-14 sm:py-16">
        {count === 0 ? (
          <p className="max-w-xl text-ink-soft">
            University profiles are being added, chat with us on WhatsApp for the full list in the meantime.
          </p>
        ) : (
          <>
            {/* Cards are <h3> because on the homepage they sit under a visible <h2>
                section heading. Here they follow the page <h1> directly, which skips a
                level. This names the grid for screen readers and restores the order;
                it is visually redundant with the page title, hence sr-only. */}
            <h2 className="sr-only">Partner universities</h2>
            <div data-reveal-group className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {universities.map((u) => (
                <UniversityCard key={u.id} university={u} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
