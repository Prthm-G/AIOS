import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBlogPosts } from "@/lib/content";
import { breadcrumbListJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { formatDate } from "@/lib/format";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Online Degree Guides & Blog",
  description: "Guidance on choosing, financing, and succeeding in an online degree program.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Online Degree Guides & Blog · Skeure Education",
    description: "Guidance on choosing, financing, and succeeding in an online degree program.",
    url: "/blog/",
  },
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog/" },
  ]);
  const itemList = itemListJsonLd(posts.map((p) => ({ name: p.data.title, url: `/blog/${p.id}/` })));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <PageHero eyebrow="Guides" title="blog" motif="blog" />

      <section className="wrap py-12 sm:py-16">
        {posts.length === 0 ? (
          <p className="max-w-xl text-ink-soft">
            No posts yet, check back soon, or ask us your question directly on WhatsApp.
          </p>
        ) : (
          <div data-reveal-group className="grid gap-6 md:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.id}/`}
                className="group flex flex-col rounded-2xl border border-line bg-surface p-7 shadow-soft transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong motion-reduce:transform-none"
              >
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent-ink">{p.data.category}</p>
                <h2 className="mt-3 flex items-start justify-between gap-3 font-display text-2xl font-medium tracking-[-0.02em] text-ink">
                  <span>{p.data.title}</span>
                  <ArrowUpRight
                    className="mt-1 size-5 shrink-0 text-ink-faint transition-colors group-hover:text-ink"
                    aria-hidden="true"
                  />
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{p.data.description}</p>
                <p className="mt-5 text-sm text-ink-faint">{formatDate(p.data.pubDate)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
