import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getUniversities } from "@/lib/content";
import type { Course } from "@/content/schema";
import { universityLogos } from "@/data/logos";
import { breadcrumbListJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { FeeTable } from "@/components/university/FeeTable";

export const metadata: Metadata = {
  title: "Compare Online Degree Programs & Fees",
  description: "Compare online UG and PG degree programs and fees across all our partner universities in one place.",
  alternates: { canonical: "/programs/" },
  openGraph: {
    title: "Compare Online Degree Programs & Fees · Skeure Education",
    description: "Compare online UG and PG degree programs and fees across all our partner universities in one place.",
    url: "/programs/",
  },
};

type Offering = { uniId: string; uniName: string; course: Course };

// Group every non-noindex university's courses by program name (leading "Online "
// stripped), sorted A–Z, so the same degree can be compared across universities.
function buildProgramGroups(): { program: string; offerings: Offering[] }[] {
  const groups = new Map<string, Offering[]>();
  for (const u of getUniversities()) {
    for (const course of u.data.courses) {
      const program = course.name.replace(/^Online\s+/i, "");
      if (!groups.has(program)) groups.set(program, []);
      groups.get(program)!.push({ uniId: u.id, uniName: u.data.name, course });
    }
  }
  return [...groups.entries()]
    .map(([program, offerings]) => ({ program, offerings }))
    .sort((a, b) => a.program.localeCompare(b.program));
}

export default function ProgramsPage() {
  const programGroups = buildProgramGroups();

  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Programs", url: "/programs/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <PageHero
        eyebrow="Programs"
        title="compare programs"
        motif="programs"
        intro="The same degree can cost very differently depending on the university. Every fee below is shown the same way, semester-wise, annual, or lumpsum, so you can compare on equal footing before choosing."
      >
        <p data-reveal className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-faint">
          Fees and programme lists here come from university reference documents and are refreshed as we re-confirm them
          against official sources. Confirm your exact programme, its current UGC-DEB entitlement, and its fees with us
          on WhatsApp before applying.
        </p>
      </PageHero>

      <section className="wrap py-12 sm:py-16">
        <div className="space-y-14">
          {programGroups.map(({ program, offerings }) => (
            <div key={program}>
              <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-ink">{program}</h2>
              <div data-reveal-group className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {offerings.map(({ uniId, uniName, course }, i) => {
                  const logo = universityLogos[uniId];
                  return (
                    <div key={`${uniId}-${i}`} className="flex flex-col rounded-xl border border-line bg-surface p-5 shadow-soft">
                      <div className="flex h-9 items-center">
                        {logo?.src ? (
                          <div className="relative h-8 w-28">
                            <Image src={logo.src} alt={uniName} fill sizes="112px" className="object-contain object-left" />
                          </div>
                        ) : (
                          <span className="font-display text-sm font-medium text-ink">{uniName}</span>
                        )}
                      </div>
                      <Link
                        href={`/universities/${uniId}/`}
                        className="mt-3 text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent hover:text-accent-ink"
                      >
                        {uniName}
                      </Link>
                      <p className="mt-1 text-sm text-ink-soft">{course.duration}</p>
                      <div className="mt-3">
                        <FeeTable fee={course.fees} compact />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
