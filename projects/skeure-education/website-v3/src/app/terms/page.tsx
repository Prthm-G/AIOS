import type { Metadata } from "next";
import { site } from "@/data/site";
import { LegalShell } from "@/components/sections/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Skeure Education website and counselling services.",
  alternates: { canonical: "/terms/" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" lastUpdated="Draft, pending legal review — 25 July 2026">
      <p>
        These terms govern your use of {site.verticalHost} and {site.brandName} {site.verticalName}&apos;s counselling
        services. By using this site or contacting us, you agree to them. This is a draft pending qualified legal review
        and is not yet in effect as binding terms — see the notice at the bottom of this page.
      </p>

      <h2>Who we are</h2>
      <p>
        {site.brandName} {site.verticalName} is an admissions counselling and financing-support intermediary based in{" "}
        {site.address.country}. We are <strong>not</strong> a degree-granting institution. Every degree shown on this
        site is awarded by the partner university itself, under that university&apos;s own admission, fee, and programme
        terms — not by Skeure.
      </p>

      <h2>How we&apos;re paid</h2>
      <p>
        We may receive a commission from partner universities and, where applicable, financing partners, when a student
        we&apos;ve counselled enrols or takes a loan through them. This does not change the price you pay the university
        or lender. We disclose this because it means we&apos;re a paid intermediary, not an independent or unbiased
        ranking service — see <a href="/about/#trust">how we verify and disclose</a>.
      </p>

      <h2>Accuracy of information</h2>
      <p>
        We work to keep programme, fee, and recognition details accurate and sourced, and every university page states
        how confident we currently are in its details. Universities change fees, intake dates, and programme offerings
        without notice. Always confirm the exact programme, fee, and current UGC entitlement with us or directly with the
        university before applying or paying anything.
      </p>

      <h2>Financing</h2>
      <p>
        Any education financing is arranged through a regulated third-party lender, never by Skeure directly. The lender
        sets its own eligibility, interest rate, fees, and approval process, and discloses all of this to you in writing
        before you agree to anything. Skeure is not a lender and does not guarantee loan approval or terms.
      </p>

      <h2>Your responsibilities</h2>
      <p>
        Please give us accurate contact and eligibility information so we can help you properly, and don&apos;t use the
        contact form or WhatsApp channel to send spam, abusive content, or unrelated solicitations.
      </p>

      <h2>No guarantee of admission</h2>
      <p>
        Counselling and application support don&apos;t guarantee admission, financing approval, or any particular
        outcome. Each university makes its own admission decisions under its own criteria.
      </p>

      <h2>Third-party sites</h2>
      <p>
        Links to university websites, WhatsApp, or lending partners take you to services we don&apos;t control. Their own
        terms and privacy practices apply once you&apos;re there.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        We provide counselling and information on an &quot;as available&quot; basis and work to keep it accurate, but we
        aren&apos;t liable for decisions a university or lender makes independently, or for losses arising from
        information that changed after we last confirmed it. Nothing here limits liability that can&apos;t lawfully be
        limited.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        If these terms change materially once finalised, we&apos;ll update the &quot;last updated&quot; date above and,
        where the change is significant, note it clearly on this page.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are intended to be governed by the laws of India, with courts in Punjab having jurisdiction, subject
        to final legal review.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms can be sent to {site.email}.</p>
    </LegalShell>
  );
}
