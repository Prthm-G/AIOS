import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { getFaqs } from "@/lib/content";
import { breadcrumbListJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Education Financing for Online Degrees",
  description:
    "Financing support for online UG and PG degree programs. Ask us on WhatsApp for current lender options and terms.",
  alternates: { canonical: "/financing/" },
  openGraph: {
    title: "Education Financing for Online Degrees · Skeure Education",
    description:
      "Financing support for online UG and PG degree programs. Ask us on WhatsApp for current lender options and terms.",
    url: "/financing/",
  },
};

// Skeure is NOT a lender: no rates, no loan limits, no lender names. Every CTA
// resolves to WhatsApp or the /about/#trust disclosure. Copy is verbatim.
const HOW_IT_WORKS = [
  "We help you find education-financing options for your programme",
  "Lending is done by regulated third-party lenders, never by Skeure",
  "Lender identity, rate, eligibility, and full terms are confirmed in writing before you commit",
  "Ask on WhatsApp for what's currently available for your programme",
];

export default function FinancingPage() {
  const financingFaqs = getFaqs().filter((f) => f.data.category === "financing");

  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Financing", url: "/financing/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <PageHero
        eyebrow="Financing"
        title="how education financing works with us"
        motif="financing"
        intro="We help students find education-financing options for their programme. We don't publish rates, loan limits, or approval terms here, and we're still finalising which lenders we work with — so rather than list numbers we can't yet stand behind, we'll walk you through exactly what's available for your programme, in writing, on WhatsApp before you apply."
      />

      <section className="wrap py-12 sm:py-16">
        <div className="rounded-2xl border border-line bg-surface p-8 shadow-soft sm:p-10">
          <h2 className="font-display text-xl font-medium lowercase tracking-[-0.02em] text-ink">how it works</h2>
          <ul className="mt-6 space-y-4">
            {HOW_IT_WORKS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-ink">
                <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" strokeWidth={2.25} aria-hidden="true" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-sm leading-relaxed text-ink-faint">
          Skeure is not a lender and does not provide credit. Any financing is provided by a regulated third-party lender
          under its own approval criteria, interest rates, and fees, which that lender will disclose in full before you
          agree to anything. Skeure may receive a commission from partner universities and lenders —{" "}
          <Link
            href="/about/#trust"
            className="text-accent-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
          >
            see how we&apos;re paid
          </Link>
          .
        </p>
      </section>

      {financingFaqs.length > 0 && (
        <section className="wrap py-12 sm:py-16">
          <SectionHeading title="financing questions" />
          <div className="mt-8">
            <Accordion items={financingFaqs.map((f) => ({ question: f.data.question, answer: f.data.answer }))} />
          </div>
        </section>
      )}

      <CtaBanner
        heading="have a specific financing question?"
        body="Ask us on WhatsApp, we'll walk you through the numbers for your exact program."
      />
    </>
  );
}
