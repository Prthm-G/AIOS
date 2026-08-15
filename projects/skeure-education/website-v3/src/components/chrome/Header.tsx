"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { site } from "@/data/site";
import { Wordmark } from "./Wordmark";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { cn } from "@/lib/utils";

// The mobile drawer surfaces Contact; the desktop rail intentionally leans on the
// WhatsApp CTA instead (matches the live site).
const mobileLinks = [...navLinks, { href: "/contact/", label: "Contact" }];

// Bare studio rail: wordmark, plain text nav, a single WhatsApp CTA. Transparent
// over the hero, resolving to a hairline greige bar once scrolled.
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open ? "border-line bg-bg/85 backdrop-blur-md" : "border-transparent",
      )}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Wordmark />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-[0.95rem] font-medium transition-colors hover:text-accent",
                  active ? "text-accent" : "text-ink-soft",
                )}
              >
                {l.label}
                {active && <span className="absolute -bottom-1.5 left-0 h-px w-full bg-accent" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <WhatsAppButton label="Book free counselling" size="sm" variant="accent" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-surface lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 bg-bg transition-[opacity,transform] duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none translate-y-1 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="wrap flex h-full flex-col gap-1 overflow-y-auto pt-6">
          {mobileLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b border-line py-4 font-display text-2xl lowercase tracking-[-0.03em] text-ink"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-8">
            <WhatsAppButton label="Book free counselling" size="lg" className="w-full" />
          </div>
          <p className="pt-6 text-sm text-ink-soft">{site.officeHours} · Based in India</p>
        </nav>
      </div>
    </header>
  );
}
