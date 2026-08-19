// Fee display helpers. Currency is always "Rs. {grouped}" in the Indian grouping
// convention (verbatim match to the Astro FeeTable). Kept tiny and dependency-free.

export function formatRs(n: number): string {
  return `Rs. ${n.toLocaleString("en-IN")}`;
}

// Formats an ISO/Date to the site's en-IN long date, e.g. "1 Jul 2026".
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
