import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

// Mobile-only floating action button. The one place the recognizable WhatsApp
// green is allowed — a universally-known affordance on small screens.
export function WhatsAppFloat() {
  return (
    <a
      href={site.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      data-analytics-event="click_whatsapp"
      className="fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-float transition-transform duration-200 hover:scale-105 active:scale-95 motion-reduce:transition-none lg:hidden"
    >
      <MessageCircle className="size-7" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
