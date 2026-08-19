/*
 * DIRECTION CONTRACT · v4: THE LONG OPEN (2026-08-18)
 *
 * THESIS: The homepage is one continuous shot. A laptop starts shut at the top and
 *   opens across the entire page, one family doubt at a time, until it stands fully
 *   open behind the invitation to talk. It never closes. The lid angle encodes page
 *   position, so the film and the content cannot be reordered independently.
 * SPINE: Five questions in the order families actually ask them (recognition,
 *   universities, process, cost, everything else). Choreography lives in ONE file:
 *   src/data/filmBeats.ts. The scrub engine is src/components/film/FilmStage.tsx.
 * WORLD: v3's design system carried over unchanged — #f2f1ed warm field, near-black
 *   ink, single #ff611a accent, Manrope/Inter/Fragment Mono. The frames are colour-
 *   graded onto the page field by scripts/build-frames.sh.
 * MOBILE: Its own film — seven stills at the exact beat angles, ~100KB total,
 *   instead of v3's 1.26MB scrub that phones downloaded and never played.
 * TAGLINE: "same degree. now online." — everywhere, by decision on 2026-08-18.
 * INTERIOR PAGES: inherited from v3 verbatim so SEO does not regress.
 */
import type { Metadata } from "next";
import { Manrope, Inter, Fragment_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { WhatsAppFloat } from "@/components/chrome/WhatsAppFloat";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

// Display — Manrope: neutral geometric grotesque, the free analog of midlife's
// PP Neue Montreal / the Apple register. Variable weight.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Eyebrows / captions — Fragment Mono (midlife's actual mono), retro-technical voice.
const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const SITE_URL = `https://${site.verticalHost}`;
const BRAND = `${site.brandName} ${site.verticalName}`;
const DEFAULT_DESCRIPTION =
  "Free, no-pressure counselling into UGC-recognised online UG and PG degrees from partner universities like LPU and Amity. Same degree, now online — message us on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} — ${site.tagline}`,
    template: `%s · ${BRAND}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: BRAND,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: BRAND,
    title: `${BRAND} — ${site.tagline}`,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    images: [{ url: "/og-home.jpg", width: 1200, height: 630, alt: BRAND }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} — ${site.tagline}`,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-home.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.ico",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${fragmentMono.variable}`}>
      <head>
        {/* Adds `.js` before paint so scroll-reveal only hides content when JS is
            live (no-JS visitors get fully-visible content, zero layout shift). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-5 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollReveal />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
