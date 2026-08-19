import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { Button, type ButtonProps } from "./Button";

// The one CTA that matters. Monochrome ink pill + WhatsApp glyph (not green) so it
// keeps the greige discipline; recognition comes from the icon + label.
export function WhatsAppButton({
  label = "Message us on WhatsApp",
  size,
  variant = "primary",
  className,
}: { label?: string } & Pick<ButtonProps, "size" | "variant" | "className">) {
  return (
    <Button
      href={site.whatsappLink}
      external
      variant={variant}
      size={size}
      className={className}
      ariaLabel={label}
      dataAttrs={{ "data-analytics-event": "click_whatsapp" }}
    >
      <MessageCircle className="size-[1.15em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
      {label}
    </Button>
  );
}
