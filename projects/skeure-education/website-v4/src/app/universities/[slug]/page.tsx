import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUniversities, getUniversity } from "@/lib/content";
import { breadcrumbListJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Prose } from "@/components/ui/Prose";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Accordion } from "@/components/ui/Accordion";
import { UniversityHero } from "@/components/university/UniversityHero";
import { CourseCard } from "@/components/university/CourseCard";
import {
  EvidenceStatus,
  HistoryTimeline,
  AchievementsGrid,
  PlatformHighlights,
  PlacementHighlights,
  JumpNav,
} from "@/components/university/UniversitySections";

// SEO title overrides (H1/body still use the full name).
const TITLE_OVERRIDES: Record<string, string> = {
  "jagat-guru-nanak-dev-psou": "Jagat Guru Nanak Dev PSOU",
  "mmu-university-online": "MMU Mullana Online",
};

export function generateStaticParams() {
  return getUniversities({ includeNoindex: true }).map((u) => ({ slug: u.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const uni = getUniversity(slug);
  if (!uni) return {};
  const { data } = uni;
  const title = TITLE_OVERRIDES[slug] ?? data.name;
  const description = `Programs, fees, and accreditation for ${data.name}, counselling and financing through Skeure Education.`;
  return {
    title,
    description,
    alternates: { canonical: `/universities/${slug}/` },
    ...(data.noindex ? { robots: { index: false } } : {}),
    openGraph: { title: `${title} · Skeure Education`, description, url: `/universities/${slug}/` },
  };
}

export default async function UniversityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const uni = getUniversity(slug);
  if (!uni) notFound();
  const { data, body } = uni;

  const hasHistory = data.history.length > 0;
  const hasAchievements = data.achievements.length > 0;
  const hasPlatform = !!data.learningPlatform;
  const hasCourses = data.courses.length > 0;
  const hasPlacements = !!data.placements;
  const hasFaq = !!data.faq && data.faq.length > 0;

  const jump: { id: string; label: string }[] = [
    hasHistory && { id: "history", label: "History" },
    hasAchievements && { id: "achievements", label: "Achievements" },
    hasPlatform && { id: "platform", label: "Platform" },
    hasCourses && { id: "courses", label: "Courses" },
    hasPlacements && { id: "placements", label: "Placements" },
    hasFaq && { id: "faq", label: "FAQ" },
  ].filter(Boolean) as { id: string; label: string }[];

  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Universities", url: "/universities/" },
    { name: data.name, url: `/universities/${slug}/` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {hasFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPageJsonLd(data.faq!.map((f) => ({ question: f.question, answer: f.answer })))),
          }}
        />
      )}

      <UniversityHero university={uni} />

      <div className="wrap max-w-3xl space-y-8 py-10">
        <EvidenceStatus status={data.evidenceStatus} lastVerifiedAt={data.lastVerifiedAt} />
        {body.trim() && <Prose>{body}</Prose>}
        {jump.length > 3 && <JumpNav items={jump} />}
      </div>

      {hasHistory && (
        <section id="history" className="wrap py-12 sm:py-16">
          <SectionHeading title="history & milestones" />
          <div className="mt-8 max-w-2xl">
            <HistoryTimeline history={data.history} />
          </div>
        </section>
      )}

      {hasAchievements && (
        <section id="achievements" className="wrap py-12 sm:py-16">
          <SectionHeading title="achievements & recognition" />
          <div className="mt-8">
            <AchievementsGrid achievements={data.achievements} />
          </div>
        </section>
      )}

      {hasPlatform && (
        <section id="platform" className="wrap py-12 sm:py-16">
          <SectionHeading title="learning platform" />
          <div className="mt-8">
            <PlatformHighlights platform={data.learningPlatform!} />
          </div>
        </section>
      )}

      {hasCourses && (
        <section id="courses" className="wrap py-12 sm:py-16">
          <SectionHeading title="courses offered" intro={`Every programme ${data.name} offers, with fees shown the same way each time.`} />
          <div className="mt-8 space-y-5">
            {data.courses.map((c) => (
              <CourseCard key={c.name} course={c} universityName={data.name} />
            ))}
          </div>
        </section>
      )}

      {hasPlacements && (
        <section id="placements" className="wrap py-12 sm:py-16">
          <SectionHeading title="placements & careers" />
          <div className="mt-8">
            <PlacementHighlights placements={data.placements!} />
          </div>
        </section>
      )}

      {hasFaq && (
        <section id="faq" className="wrap py-12 sm:py-16">
          <SectionHeading title={`frequently asked questions about ${data.name}`} />
          <div className="mt-8">
            <Accordion items={data.faq!.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </section>
      )}

      <CtaBanner
        heading={`ready to start at ${data.name}?`}
        body="We'll walk you through eligibility, fees, and financing, no pressure, just clarity."
      />
    </>
  );
}
