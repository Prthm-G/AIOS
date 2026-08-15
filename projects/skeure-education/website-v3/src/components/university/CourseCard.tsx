import { ArrowRight } from "lucide-react";
import type { Course } from "@/content/schema";
import { site } from "@/data/site";
import { FeeTable } from "./FeeTable";
import { SpecializationList } from "./SpecializationList";

// A single course, fully expanded: category/level eyebrow, name, meta line, full
// fee breakdown, notes, all specializations, and a prefilled WhatsApp deep-link.
export function CourseCard({ course, universityName }: { course: Course; universityName: string }) {
  const askHref = `${site.whatsappLink}?text=${encodeURIComponent(
    `Hi, I'd like to know more about the ${course.name} at ${universityName}.`,
  )}`;

  return (
    <article className="rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-7">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent-ink">
        {course.category} · {course.level}
      </p>
      <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.02em] text-ink">{course.name}</h3>
      <p className="mt-2 text-sm text-ink-soft">
        {course.duration} · {course.mode} · Eligibility: {course.eligibility}
      </p>
      {course.comboOf && course.comboOf.length > 0 && (
        <p className="mt-1 text-sm text-ink-faint">Combines: {course.comboOf.join(" + ")}</p>
      )}

      <div className="mt-5">
        <FeeTable fee={course.fees} />
      </div>

      {course.notes && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{course.notes}</p>}

      {course.specializations && course.specializations.length > 0 && (
        <SpecializationList specializations={course.specializations} />
      )}

      <a
        href={askHref}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-event="click_whatsapp"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent hover:text-accent-ink"
      >
        Ask about this program on WhatsApp
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </article>
  );
}
