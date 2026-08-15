import { Hero } from "@/components/sections/Hero";
import { PartnerStrip } from "@/components/sections/PartnerStrip";
import { TrustCallouts } from "@/components/sections/TrustCallouts";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturedUniversities } from "@/components/sections/FeaturedUniversities";
import { FinancingTeaser } from "@/components/sections/FinancingTeaser";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { organizationJsonLd } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <Hero />
      <PartnerStrip />
      <TrustCallouts />
      <HowItWorks />
      <FeaturedUniversities />
      <FinancingTeaser />
      <FaqPreview />
      <div className="pb-24 pt-4 sm:pb-32">
        <CtaBand />
      </div>
    </>
  );
}
