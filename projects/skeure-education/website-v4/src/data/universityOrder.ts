// Amity and LPU lead every university listing on the site (homepage banner,
// homepage featured grid, /universities/). Everything else falls back to
// alphabetical order. Ported from the Astro project; retyped against a minimal
// structural constraint instead of astro:content's CollectionEntry.
const PRIORITY_SLUGS = ["amity-university-online", "lovely-professional-university"];

export function sortByPriority<T extends { id: string; data: { name: string } }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const pa = PRIORITY_SLUGS.indexOf(a.id);
    const pb = PRIORITY_SLUGS.indexOf(b.id);
    if (pa !== -1 || pb !== -1) {
      if (pa === -1) return 1;
      if (pb === -1) return -1;
      return pa - pb;
    }
    return a.data.name.localeCompare(b.data.name);
  });
}
