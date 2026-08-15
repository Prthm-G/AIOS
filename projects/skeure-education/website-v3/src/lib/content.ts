import { z } from "zod";
import generated from "@/content/_generated.json";
import {
  universitySchema,
  faqSchema,
  blogSchema,
  testimonialSchema,
  type University,
  type Faq,
  type BlogPost,
  type Testimonial,
} from "@/content/schema";

// Content loader — the Next.js replacement for Astro's content collections. The
// markdown is bundled into `_generated.json` at build time by `scripts/gen-content.mjs`
// (imported here, so it ships inside the JS bundle and works both at build and in the
// Cloudflare Worker, where runtime `fs` reads return nothing). Frontmatter is validated
// against the ported Zod schemas on access — bad content throws, never silently empty.

interface RawEntry {
  id: string;
  data: unknown;
  body: string;
}
const DB = generated as Record<string, RawEntry[]>;

export interface Entry<T> {
  /** slug = markdown filename without extension (matches Astro's glob-loader id). */
  id: string;
  slug: string;
  data: T;
  /** raw markdown body after frontmatter. */
  body: string;
}

function loadCollection<S extends z.ZodTypeAny>(dir: string, schema: S): Entry<z.infer<S>>[] {
  return (DB[dir] ?? []).map((e) => ({
    id: e.id,
    slug: e.id,
    data: schema.parse(e.data) as z.infer<S>,
    body: e.body,
  }));
}

export type UniversityEntry = Entry<University>;
export type FaqEntry = Entry<Faq>;
export type BlogEntry = Entry<BlogPost>;
export type TestimonialEntry = Entry<Testimonial>;

/** All partner universities. Excludes noindex entries unless includeNoindex is set. */
export function getUniversities(opts: { includeNoindex?: boolean } = {}): UniversityEntry[] {
  const all = loadCollection("universities", universitySchema);
  return opts.includeNoindex ? all : all.filter((u) => !u.data.noindex);
}

/** Single university by slug — includes noindex entries (the page stays reachable). */
export function getUniversity(slug: string): UniversityEntry | undefined {
  return loadCollection("universities", universitySchema).find((u) => u.id === slug);
}

/** Site-wide FAQs, sorted by their `order` field. */
export function getFaqs(): FaqEntry[] {
  return loadCollection("faqs", faqSchema).sort((a, b) => a.data.order - b.data.order);
}

/** Blog posts, newest first. */
export function getBlogPosts(): BlogEntry[] {
  return loadCollection("blog", blogSchema).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export function getBlogPost(slug: string): BlogEntry | undefined {
  return getBlogPosts().find((p) => p.id === slug);
}

/** Testimonials (collection currently empty — consumers must render conditionally). */
export function getTestimonials(): TestimonialEntry[] {
  return loadCollection("testimonials", testimonialSchema);
}
