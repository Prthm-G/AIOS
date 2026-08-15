import { HeroScroll } from "@/components/hero/HeroScroll";

// Pinned scroll hero — the closed→open laptop, scroll-typed heading, and revealed
// copy all live in the HeroScroll client island. The real heading for search engines
// and assistive tech is rendered here (the island's visible heading is decorative and
// aria-hidden, so this is the single indexable <h1>).
export function Hero() {
  return (
    <>
      <h1 className="sr-only">same degree. now online.</h1>
      <HeroScroll />
    </>
  );
}
