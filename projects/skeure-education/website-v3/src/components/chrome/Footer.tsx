import Link from "next/link";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { site } from "@/data/site";
import { navLinks } from "@/lib/nav";
import { Wordmark } from "./Wordmark";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

// Footer includes Contact (the desktop nav intentionally does not). The legal row
// mirrors the live Astro footer, including the /about/#trust disclosure anchor.
const footerExplore = [...navLinks, { href: "/contact/", label: "Contact" }];
const footerLegal = [
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms of Service" },
  { href: "/about/#trust", label: "How we verify & disclose" },
  { href: "/credits/", label: "Photo credits" },
];

export function Footer() {
  const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
  return (
    <footer className="mt-24 border-t border-line-strong sm:mt-32">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1.3fr]">
        <div>
          <Wordmark />
          <p className="mt-5 max-w-xs text-ink-soft">
            {site.tagline} Free, no-pressure counselling into recognised online degrees.
          </p>
          <div className="mt-6">
            <WhatsAppButton size="md" />
          </div>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {footerExplore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-soft transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Contact</h2>
          <ul className="mt-4 space-y-3 text-ink-soft">
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
              <a href={telHref} className="transition-colors hover:text-ink">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
              <span>{site.officeHours}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
              <span>Based in India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-4 py-6 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.brandName} {site.verticalName}. Based in India.
          </p>
          <ul className="flex flex-wrap gap-5">
            {footerLegal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-ink-soft">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
