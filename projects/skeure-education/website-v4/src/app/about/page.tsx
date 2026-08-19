import type { Metadata } from "next";
import { site } from "@/data/site";
import { breadcrumbListJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Skeure Education is an admissions counselling service based in India, helping students choose and finance online UG/PG degrees.",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "About Us · Skeure Education",
    description:
      "Skeure Education is an admissions counselling service based in India, helping students choose and finance online UG/PG degrees.",
    url: "/about/",
  },
};

const PILLARS = [
  { label: "Mission", body: "Make choosing an online degree simple, honest, and pressure-free." },
  { label: "Vision", body: "Every student in Punjab has a clear, affordable path to a recognised degree." },
  { label: "Promise", body: "Free counselling, always. We're paid by our university partners, not by you." },
];

export default function AboutPage() {
  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "About", url: "/about/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <PageHero
        eyebrow="About us"
        title="about skeure education"
        motif="about"
        intro={
          <>
            <p>
              We&apos;re an admissions counselling team based in {site.address.country}, helping students and families
              choose and enrol in online UG and PG degree programs from our partner universities. Recognition varies by
              exact programme, mode, and academic session, not by university alone, see each university&apos;s page for
              what&apos;s currently confirmed.
            </p>
            <p className="mt-4">
              We don&apos;t just point you at a university website and wish you luck. We talk it through on WhatsApp, help
              you compare real fees and eligibility across programs, and help arrange financing so the cost isn&apos;t
              what holds you back.
            </p>
          </>
        }
      />

      <section className="wrap py-12 sm:py-16">
        <div data-reveal-group className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.label} className="rounded-2xl border border-line bg-surface p-7 shadow-soft">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent-ink">{p.label}</p>
              <p className="mt-3 text-lg leading-relaxed text-ink">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="trust" className="wrap scroll-mt-28 py-12 sm:py-16">
        <SectionHeading title="how we verify and disclose" />
        <div className="mt-8 max-w-3xl space-y-8">
          <div>
            <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-ink">How we&apos;re paid.</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">
              We earn a commission from our partner universities, and sometimes from financing partners, when a student
              we&apos;ve counselled enrols. We don&apos;t charge students for counselling. Because we&apos;re paid by
              partners, we don&apos;t describe our guidance as &quot;independent&quot; or &quot;unbiased&quot; — we aim to
              be accurate and clear about how we rank and present options instead.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-ink">
              How we verify programme details.
            </h3>
            <p className="mt-2 leading-relaxed text-ink-soft">
              Fees, eligibility, and recognition claims are checked against each university&apos;s own official programme
              pages and, where possible, the UGC&apos;s Distance Education Bureau (DEB) entitlement records. Every
              university page states its current verification status; where we haven&apos;t yet confirmed a detail
              against an official source, we say so rather than presenting it as settled fact.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-ink">Reviewer.</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">
              Published content is reviewed by Pratham Goel, founder of Skeure Education.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-ink">Corrections.</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">
              Spot something wrong?{" "}
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="click_whatsapp"
                className="text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
              >
                Message us on WhatsApp
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${site.email}`}
                data-analytics-event="click_email"
                className="text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
              >
                {site.email}
              </a>{" "}
              and we&apos;ll check and correct it.
            </p>
          </div>
        </div>
      </section>

      <CtaBanner heading="want to talk it through first?" body="No forms to fill. Just message us on WhatsApp." />
    </>
  );
}
