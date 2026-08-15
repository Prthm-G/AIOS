import { getFaqs } from "@/lib/content";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function FaqPreview() {
  const faqs = getFaqs()
    .filter((f) => f.data.category === "general")
    .slice(0, 4);

  return (
    <section className="wrap py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading title="questions, answered plainly" intro="The things families ask us most." />
          <Button href="/faq/" variant="link" size="md" className="mt-6 inline-flex">
            Read all FAQs
          </Button>
        </div>
        <Accordion items={faqs.map((f) => ({ question: f.data.question, answer: f.data.answer }))} />
      </div>
    </section>
  );
}
