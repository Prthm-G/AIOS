import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Fully static/SSG site (no ISR, no `revalidate`), so no incremental-cache
// backend (KV/R2/D1) is wired here — defaults are sufficient.
export default defineCloudflareConfig();
