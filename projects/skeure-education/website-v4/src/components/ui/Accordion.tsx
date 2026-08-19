import { Plus } from "lucide-react";

// Native <details> accordion — accessible and zero-JS. The plus rotates to a
// close mark on open.
export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="border-t border-line">
      {items.map((it, i) => (
        <details key={i} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-lg font-medium tracking-[-0.02em] text-ink [&::-webkit-details-marker]:hidden">
            <span>{it.question}</span>
            <Plus
              className="size-5 shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </summary>
          <div className="max-w-2xl pb-6 pr-6 leading-relaxed text-ink-soft">{it.answer}</div>
        </details>
      ))}
    </div>
  );
}
