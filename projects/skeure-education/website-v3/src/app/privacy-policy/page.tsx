import type { Metadata } from "next";
import { site } from "@/data/site";
import { LegalShell } from "@/components/sections/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Skeure Education collects, uses, and protects your information.",
  alternates: { canonical: "/privacy-policy/" },
  robots: { index: false },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalShell title="Privacy Policy" lastUpdated="Draft, pending legal review — 25 July 2026">
      <p>
        This policy describes what {site.brandName} {site.verticalName} (&quot;Skeure&quot;, &quot;we&quot;,
        &quot;us&quot;) collects when you use {site.verticalHost} or contact us, and what we do with it. It&apos;s
        written to reflect what the site actually does today. It is a draft pending qualified legal review and is not
        yet in effect as a binding policy — see the notice at the bottom of this page.
      </p>

      <h2>Information we collect</h2>
      <p>When you use our contact form, WhatsApp, phone, or email, we collect:</p>
      <ul>
        <li>Your name, email address, and phone number (phone is optional on the contact form)</li>
        <li>The programme or university you&apos;re asking about, and any message you write</li>
        <li>The page you submitted the form from and how you found us (e.g. search, WhatsApp link)</li>
      </ul>
      <p>
        The contact form is protected by Cloudflare Turnstile, a bot-detection check. Turnstile processes a security
        token to confirm you&apos;re a real visitor; it does not receive your name, email, or message content. See{" "}
        <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
          Cloudflare&apos;s privacy policy
        </a>{" "}
        for how Turnstile itself handles data.
      </p>
      <p>
        If you browse the site without contacting us, we do not currently collect personal information about you. We
        plan to add privacy-respecting analytics (page views and button clicks, not personal details) once that&apos;s
        configured; the section below explains what happens then.
      </p>

      <h2>How we use it</h2>
      <p>
        To respond to your enquiry, share relevant programme and fee information, and, if you choose to proceed, to
        support your application with the university and, where relevant, a financing partner. We do not use your contact
        details for anything else, and we do not sell your data.
      </p>

      <h2>Where it&apos;s stored</h2>
      <p>
        Contact-form submissions are stored in a Cloudflare D1 database. Cloudflare&apos;s infrastructure may process or
        store data outside India as part of its global network. We keep enquiry details for as long as reasonably needed
        to respond to you and for legitimate business record-keeping, and delete or anonymise them on request (see
        &quot;Your rights&quot; below).
      </p>

      <h2>Sharing with partners</h2>
      <p>
        We share your relevant details only with the specific university and, if you choose to explore financing, the
        specific lending partner you decide to proceed with. We don&apos;t share your details with any other university,
        lender, or third party without telling you first.
      </p>

      <h2>Analytics and cookies</h2>
      <p>
        No analytics or advertising cookies are active on this site today. If we turn on privacy-respecting analytics in
        the future, we will only measure anonymous usage patterns (which pages are visited, which buttons are clicked) —
        never your name, phone number, email, or message content — and we will show a consent notice before anything
        loads.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us to show you what we hold about you, correct it, or delete it, at any time, by emailing{" "}
        {site.email}. We&apos;ll respond within a reasonable time and confirm once it&apos;s done.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        Our counselling services are intended for prospective students who are at least 18, or for parents/ guardians
        enquiring on a minor&apos;s behalf. We don&apos;t knowingly collect information directly from children under 18
        without a parent or guardian&apos;s involvement.
      </p>

      <h2>Security</h2>
      <p>
        We rely on Cloudflare&apos;s platform-level security (encryption in transit, bot protection via Turnstile) and
        restrict access to stored enquiry data to the people who need it to respond to you.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If this policy changes materially once it&apos;s finalised, we&apos;ll update the &quot;last updated&quot; date
        above and, where the change is significant, note it clearly on this page.
      </p>

      <h2>Governing law</h2>
      <p>
        This policy is intended to operate under the laws of India, including applicable data-protection requirements
        under the Information Technology Act, 2000 and its rules, as they apply to us.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, or a request to access/correct/delete your data, can be sent to {site.email}. We&apos;re based in{" "}
        {site.address.country}.
      </p>
    </LegalShell>
  );
}
