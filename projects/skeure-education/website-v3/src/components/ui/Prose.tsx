import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

// Markdown body renderer for blog posts + university intros. Styled to the design
// system (Inter body, generous leading, display sub-heads, accent links). GFM for
// tables/strikethrough/autolinks. Links open safely.
export function Prose({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("space-y-5 text-[1.05rem] leading-[1.75] text-ink-soft", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-10 font-display text-2xl font-medium lowercase tracking-[-0.03em] text-ink">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 font-display text-xl font-medium tracking-[-0.02em] text-ink">{children}</h3>
          ),
          p: ({ children }) => <p>{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-accent-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-5 marker:text-ink-faint">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-5 marker:text-ink-faint">{children}</ol>,
          strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-line-strong pl-5 italic text-ink-soft">{children}</blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
