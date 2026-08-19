import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogPosts, getBlogPost } from "@/lib/content";
import { breadcrumbListJsonLd, articleJsonLd } from "@/lib/jsonld";
import { formatDate } from "@/lib/format";
import { Prose } from "@/components/ui/Prose";

const AUTHOR = "Pratham Goel";

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.data.title,
    description: post.data.description,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      type: "article",
      title: `${post.data.title} · Skeure Education`,
      description: post.data.description,
      url: `/blog/${slug}/`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const { data, body } = post;

  const breadcrumb = breadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog/" },
    { name: data.title, url: `/blog/${slug}/` },
  ]);
  const article = articleJsonLd({
    title: data.title,
    description: data.description,
    url: `/blog/${slug}/`,
    datePublished: data.pubDate.toISOString(),
    authorName: AUTHOR,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />

      <article className="wrap-narrow pt-28 sm:pt-32">
        <Link
          href="/blog/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to blog
        </Link>

        <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent-ink">{data.category}</p>
        <h1
          className="mt-3 font-display font-medium lowercase tracking-[-0.03em] text-ink"
          style={{ fontSize: "clamp(2.1rem, 5vw, 3.25rem)", lineHeight: 1.02 }}
        >
          {data.title}
        </h1>
        <p className="mt-4 text-sm text-ink-faint">
          {formatDate(data.pubDate)} · {AUTHOR}
        </p>

        <div className="mt-10 border-t border-line pt-8">
          <Prose>{body}</Prose>
        </div>
      </article>

      <div className="pb-16 sm:pb-24" />
    </>
  );
}
