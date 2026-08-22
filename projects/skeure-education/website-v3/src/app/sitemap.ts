import type { MetadataRoute } from "next";
import { getUniversities, getBlogPosts } from "@/lib/content";
import { PROGRAMS } from "@/data/programs.config";
import { site } from "@/data/site";

// Next resolves relative URLs here against `metadataBase`, but the sitemap spec
// requires absolute <loc> values, so build them explicitly off the same host the
// canonical tags use.
const ORIGIN = `https://${site.verticalHost}`;

// Every URL carries a trailing slash to match `next.config.ts` trailingSlash:true
// and the canonical policy inherited from the Astro site. A mismatch here would
// hand Search Console a sitemap of redirecting URLs.
const url = (path: string) => `${ORIGIN}${path}`;

/**
 * Mirrors the indexable surface of the live site exactly (20 URLs as of the
 * cutover). Deliberately EXCLUDED, because both carry `robots: { index: false }`:
 * `/privacy-policy/` and `/terms/`. Listing a noindex URL in a sitemap is a
 * direct contradiction and Search Console flags it.
 *
 * `getUniversities()` already filters out `noindex` profiles, so the university
 * entries stay in sync with the listing pages automatically — no second list to
 * forget to update.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/about/",
    "/blog/",
    "/contact/",
    "/credits/",
    "/faq/",
    "/financing/",
    "/programs/",
    "/universities/",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: url(path),
      changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "/" ? 1 : 0.7,
    })),
    ...PROGRAMS.map((p) => ({
      url: url(`/programs/${p.slug}/`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getUniversities().map((uni) => ({
      url: url(`/universities/${uni.id}/`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getBlogPosts().map((post) => ({
      url: url(`/blog/${post.id}/`),
      lastModified: post.data.pubDate,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
