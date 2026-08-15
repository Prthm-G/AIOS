import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";
import { site } from "@/data/site";
import { breadcrumbListJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Skeure Education on WhatsApp, phone, or email, or send us a message directly.",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: "Contact Us · Skeure Education",
    description: "Get in touch with Skeure Education on WhatsApp, phone, or email, or send us a message directly.",
    url: "/contact/",
  },
};

export default function ContactPage() {
  const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <PageHero eyebrow="Contact" title="let's find your right degree" motif="contact" />

      <section className="wrap py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Contact information — country-level only, no street address. */}
          <div>
            <h2 className="font-display text-xl font-medium lowercase tracking-[-0.02em] text-ink">
              contact information
            </h2>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3.5">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-ink-faint" aria-hidden="true" />
                <div>
                  <p className="text-sm text-ink-faint">Chat on WhatsApp (fastest)</p>
                  <a
                    href={site.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-event="click_whatsapp"
                    className="text-ink transition-colors hover:text-accent-ink"
                  >
                    {site.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <Phone className="mt-0.5 size-5 shrink-0 text-ink-faint" aria-hidden="true" />
                <div>
                  <p className="text-sm text-ink-faint">Call us</p>
                  <a href={telHref} data-analytics-event="click_call" className="text-ink transition-colors hover:text-accent-ink">
                    {site.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <Mail className="mt-0.5 size-5 shrink-0 text-ink-faint" aria-hidden="true" />
                <div>
                  <p className="text-sm text-ink-faint">Email us</p>
                  <a
                    href={`mailto:${site.email}`}
                    data-analytics-event="click_email"
                    className="text-ink transition-colors hover:text-accent-ink"
                  >
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <Clock className="mt-0.5 size-5 shrink-0 text-ink-faint" aria-hidden="true" />
                <div>
                  <p className="text-sm text-ink-faint">Office hours</p>
                  <p className="text-ink">{site.officeHours}</p>
                </div>
              </li>
            </ul>
            <p className="mt-6 text-sm text-ink-faint">Based in India.</p>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
