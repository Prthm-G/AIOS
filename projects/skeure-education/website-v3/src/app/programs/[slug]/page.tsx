import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUniversities } from "@/lib/content";
import type { Course } from "@/content/schema";
import { PROGRAMS, programBySlug } from "@/data/programs.config";
import { breadcrumbListJsonLd, faqPageJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FeeTable } from "@/components/university/FeeTable";

type Offering = { uniId: string; uniName: string; course: Course };

// Every offering across non-noindex partner universities whose course name (with
// a leading "Online " removed) matches this program family. Fees come straight
// from the same content the /programs/ and /universities/ pages use.
function offeringsFor(match: RegExp): Offering[] {
  const out: Offering[] = [];
  for (const u of getUniversities()) {
    for (const course of u.data.courses) {
      const name = course.name.replace(/^Online\s+/i, "");
      if (match.test(name)) out.push({ uniId: u.id, uniName: u.data.name, course });
    }
  }
  return out.sort((a, b) => a.uniName.localeCompare(b.uniName));
}

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = programBySlug(slug);
  if (!program) return {};
  const url = `/programs/${program.slug}/`;
  return {
    title: program.title,
    description: program.description,
    alternates: { canonical: url },
    openGraph: { title: `${program.title} · Skeure Education`, description: program.description, url },
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programBySlug(slug);
  if (!program) notFound();

  const offerings = offeringsFor(program.match);

  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Programs", url: "/programs/" },
    { name: program.h1, url: `/programs/${program.slug}/` },
  ]);
  const itemList = itemListJsonLd(
    offerings.map((o) => ({ name: `${o.course.name} — ${o.uniName}`, url: `/universities/${o.uniId}/` })),
  );
  const faqLd = faqPageJsonLd(program.faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {offerings.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <PageHero eyebrow="Programs" title={program.h1} motif="programs" />

      <section className="wrap py-12 sm:py-14">
        <div className="max-w-2xl">
          <p className="text-ink-soft">{program.intro}</p>
          <p className="mt-4 text-ink-soft">
            Below are the programs available through our partner universities, with real, current
            fees. Message us on WhatsApp and we&apos;ll help you pick the right one.
          </p>
        </div>
      </section>

      {offerings.length > 0 ? (
        <section className="wrap pb-12 sm:pb-14">
          <div className="grid gap-5 sm:grid-cols-2">
            {offerings.map((o) => (
              <div key={`${o.uniId}-${o.course.name}`} className="rounded-2xl border border-line bg-surface p-5">
                <p className="font-display text-lg font-medium tracking-[-0.01em] text-ink">{o.uniName}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{o.course.name}</p>
                <dl className="mt-3 space-y-1 text-sm text-ink-soft">
                  {o.course.duration && (
                    <div className="flex gap-2">
                      <dt className="text-ink-faint">Duration</dt>
                      <dd>{o.course.duration}</dd>
                    </div>
                  )}
                  {o.course.mode && (
                    <div className="flex gap-2">
                      <dt className="text-ink-faint">Mode</dt>
                      <dd>{o.course.mode}</dd>
                    </div>
                  )}
                  {o.course.eligibility && (
                    <div className="flex gap-2">
                      <dt className="text-ink-faint">Eligibility</dt>
                      <dd>{o.course.eligibility}</dd>
                    </div>
                  )}
                </dl>
                {o.course.fees && (
                  <div className="mt-3">
                    <FeeTable fee={o.course.fees} compact />
                  </div>
                )}
                <Link
                  href={`/universities/${o.uniId}/`}
                  className="mt-4 inline-block text-sm font-medium text-accent-ink underline underline-offset-4"
                >
                  View {o.uniName} details
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="wrap pb-12 sm:pb-14">
          <p className="max-w-2xl text-ink-soft">
            Availability for this program changes each session. Message us on WhatsApp and we&apos;ll
            tell you which universities are currently offering it, with their fees.
          </p>
        </section>
      )}

      <section className="wrap pb-12 sm:pb-14">
        <h2 className="font-display text-xl font-medium tracking-[-0.01em] text-ink">common questions</h2>
        <dl className="mt-5 max-w-2xl space-y-5">
          {program.faqs.map((f) => (
            <div key={f.question}>
              <dt className="font-medium text-ink">{f.question}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaBanner heading="ready to enroll?" body="Tell us your goals on WhatsApp and we'll shortlist the right programs for you." />
    </>
  );
}
