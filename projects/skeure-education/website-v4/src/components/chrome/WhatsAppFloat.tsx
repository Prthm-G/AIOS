"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

// Mobile-only floating action button. The one place the recognizable WhatsApp
// green is allowed — a universally-known affordance on small screens.
//
// Hidden through the first viewport: the hero already carries a full-width
// WhatsApp button there, and on a 360px phone the FAB was landing on top of the
// hero's own copy. It slides in once the visitor has scrolled past the hero.
export function WhatsAppFloat() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={site.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      data-analytics-event="click_whatsapp"
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={`fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-float transition-[transform,opacity] duration-300 hover:scale-105 active:scale-95 motion-reduce:transition-none lg:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
      }`}
    >
      <MessageCircle className="size-7" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
