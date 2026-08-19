import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Pill buttons. Strict monochrome: solid-ink primary, hairline-ghost secondary,
// underlined text link. Amber is reserved for accents, never button fills; the
// only green in the system is the mobile WhatsApp FAB.
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-bg hover:bg-[#332e27]",
        // Fill is --color-accent-ink (#b8410e), not --color-accent (#ff611a): white on
        // the vivid orange is only 3:1, below the 4.5:1 AA floor, and this is the
        // primary CTA on every page. On accent-ink it is 5.5:1. The vivid orange is
        // still the accent everywhere it belongs — wordmark dot, headline, hover rules,
        // and the glow below — just never behind white text.
        accent: "bg-accent-ink text-white shadow-[0_6px_20px_-6px_rgba(255,97,26,0.6)] hover:bg-accent-deep",
        secondary: "border border-line-strong text-ink hover:border-ink/45 hover:bg-surface",
        ghost: "text-ink hover:bg-surface",
        link: "gap-1 rounded-none px-0 text-ink underline decoration-line-strong decoration-1 underline-offset-4 hover:decoration-accent",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  href?: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  dataAttrs?: Record<string, string>;
}

export function Button({ href, external, variant, size, className, children, ariaLabel, dataAttrs }: ButtonProps) {
  const cls = cn(buttonVariants({ variant, size }), className);
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={ariaLabel} {...dataAttrs}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel} {...dataAttrs}>
        {children}
      </Link>
    );
  }
  return (
    <span className={cls} {...dataAttrs}>
      {children}
    </span>
  );
}
