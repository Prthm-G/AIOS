import type { Metadata } from "next";
import { getFaqs } from "@/lib/content";
import { breadcrumbListJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Online Degree FAQs",
  description: "Answers to common questions about our online degree programs and financing.",
  alternates: { canonical: "/faq/" },
  openGraph: {
    title: "Online Degree FAQs · Skeure Education",
    description: "Answers to common questions about our online degree programs and financing.",
    url: "/faq/",
  },
};

export default function FaqPage() {
  const faqs = getFaqs();
  const general = faqs.filter((f) => f.data.category === "general");
  const financing = faqs.filter((f) => f.data.category === "financing");

  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq/" },
  ]);
  // FAQPage: financing first, then general — fees are the most-asked question, so
  // they lead both the visible page and the structured data Google reads.
  const faqLd = faqPageJsonLd(
    [...financing, ...general].map((f) => ({ question: f.data.question, answer: f.data.answer })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <PageHero eyebrow="Help" title="frequently asked questions" motif="faq" />

      {financing.length > 0 && (
        <section className="wrap py-12 sm:py-14">
          <SectionHeading title="financing" />
          <div className="mt-6">
            <Accordion items={financing.map((f) => ({ question: f.data.question, answer: f.data.answer }))} />
          </div>
        </section>
      )}

      {general.length > 0 && (
        <section className="wrap py-12 sm:py-14">
          <SectionHeading title="general" />
          <div className="mt-6">
            <Accordion items={general.map((f) => ({ question: f.data.question, answer: f.data.answer }))} />
          </div>
        </section>
      )}

      <CtaBanner heading="still have a question?" body="Ask us directly on WhatsApp, we usually reply fast." />
    </>
  );
}
