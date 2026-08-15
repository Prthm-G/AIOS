import { site } from "@/data/site";

// `url` values are site-relative paths (e.g. "/universities/") — resolved
// against the real production origin here so structured data always emits
// absolute URLs regardless of dev/preview host. Ported verbatim from Astro.
export function breadcrumbListJsonLd(items: { name: string; url: string }[]) {
  const siteOrigin = `https://${site.verticalHost}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.url, siteOrigin).href,
    })),
  };
}

export function itemListJsonLd(items: { name: string; url: string }[]) {
  const siteOrigin = `https://${site.verticalHost}`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: new URL(item.url, siteOrigin).href,
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  authorName: string;
}) {
  const siteOrigin = `https://${site.verticalHost}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: new URL(article.url, siteOrigin).href,
    datePublished: article.datePublished,
    author: { "@type": "Person", name: article.authorName },
    publisher: {
      "@type": "Organization",
      name: `${site.brandName} ${site.verticalName}`,
      logo: { "@type": "ImageObject", url: `${siteOrigin}/favicon.svg` },
    },
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// Skeure is a counselling/admissions intermediary paid commission by partner
// universities and lenders; it does not award degrees itself, so this must never
// use an EducationalOrganization (or any degree-granting) type. `sameAs`
// intentionally omits site.social.instagram (still the legacy DegreeCraft handle).
export function organizationJsonLd() {
  const siteOrigin = `https://${site.verticalHost}`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${site.brandName} ${site.verticalName}`,
    description:
      "Admissions counselling and financing support for online UG and PG degree programs, paid by commission from partner universities and lenders.",
    url: siteOrigin,
    logo: `${siteOrigin}/favicon.svg`,
    address: {
      "@type": "PostalAddress",
      addressCountry: site.address.countryCode,
    },
    areaServed: {
      "@type": "Country",
      name: site.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      email: site.email,
      contactType: "customer service",
    },
  };
}
