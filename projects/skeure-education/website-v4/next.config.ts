import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every internal URL carries a trailing slash — matches the current live site's
  // canonical policy (Astro `trailingSlash: 'always'`) so no redirect hops and no
  // duplicate-URL SEO regressions.
  trailingSlash: true,
  images: {
    // Fixed, known asset set (logos, campus photos, hero). Skip Next's Node/sharp
    // optimizer entirely — we pass explicit width/height everywhere to hold CLS 0.
    unoptimized: true,
  },
};

export default nextConfig;

// Makes getCloudflareContext() (D1, secrets, ASSETS) resolve during `next dev`.
// No-op in production builds. See open-next.config.ts + wrangler.jsonc.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
void initOpenNextCloudflareForDev();
