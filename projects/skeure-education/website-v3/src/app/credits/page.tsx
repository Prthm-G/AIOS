import type { Metadata } from "next";
import { campusImages } from "@/data/campus-images";
import { universityLogos } from "@/data/logos";
import { getUniversity } from "@/lib/content";
import { breadcrumbListJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Sources, authors, and licences for the campus photography and university marks used on this site.",
  alternates: { canonical: "/credits/" },
  openGraph: {
    title: "Photo credits · Skeure Education",
    description: "Sources, authors, and licences for the campus photography and university marks used on this site.",
    url: "/credits/",
  },
};

export default function CreditsPage() {
  const cc = Object.entries(campusImages).filter(([, img]) => img.license);
  const published = Object.entries(campusImages).filter(([, img]) => img.isOfficial && !img.license);
  const logoCount = Object.values(universityLogos).filter((l) => l.src).length;

  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Photo credits", url: "/credits/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <PageHero
        eyebrow="Credits"
        title="photo credits"
        motif="about"
        intro="Campus photography on this site comes from Wikimedia Commons under Creative Commons licences, or from a university's own published material. Each photo is listed below with its author, licence, and source. Photos are resized to fit our layout but are otherwise unmodified."
      />

      <div className="wrap max-w-3xl space-y-14 py-12 sm:py-16">
        {cc.length > 0 && (
          <section>
            <SectionHeading title="creative commons photography" />
            <ul className="mt-6 space-y-4">
              {cc.map(([slug, img]) => (
                <li key={slug} className="rounded-xl border border-line bg-surface p-5 shadow-soft">
                  <p className="text-ink">
                    Photo by {img.author}, licensed under{" "}
                    {img.licenseUrl ? (
                      <a
                        href={img.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
                      >
                        {img.license}
                      </a>
                    ) : (
                      img.license
                    )}
                    .
                  </p>
                  {img.sourceUrl && (
                    <a
                      href={img.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-accent"
                    >
                      View the original on Wikimedia Commons →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {published.length > 0 && (
          <section>
            <SectionHeading title="university-published photography" />
            <ul className="mt-6 space-y-4">
              {published.map(([slug, img]) => (
                <li key={slug} className="rounded-xl border border-line bg-surface p-5 shadow-soft text-ink-soft">
                  <span className="font-medium text-ink">{getUniversity(slug)?.data.name ?? img.alt}</span> — {img.provenance}.
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <SectionHeading title="university logos" />
          <p className="mt-6 leading-relaxed text-ink-soft">
            We show {logoCount} university marks, each taken from that university&apos;s own official website or an
            official mirror of it. They are the trademarks of their respective universities and are used only to identify
            the partner universities we counsel students into. Their use here does not imply any endorsement of Skeure
            Education by those universities.
          </p>
        </section>

        <p className="text-sm leading-relaxed text-ink-faint">
          If you are the rights holder for anything on this page and want it credited differently or removed, contact us
          and we will act on it.
        </p>
      </div>
    </>
  );
}
