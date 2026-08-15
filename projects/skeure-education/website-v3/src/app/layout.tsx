/*
 * DIRECTION CONTRACT · seed: pinned-greige-midlife (brief-pinned; beats the roll)
 *
 * THESIS: Skeure is the calm, plain-spoken guide to a real online degree. The page
 *   refuses the busy edu-marketing template (stock graduates, gradient hero,
 *   stat-counter grid) for one quiet greige field where giant lowercase type and a
 *   single amber mark carry all the weight.
 * OWN-WORLD: Warm greige monochrome (#e6dacd ground), warm near-black ink, one amber
 *   accent; giant lowercase Space Grotesk display over Inter body; hairline rules,
 *   no shadows (one whisper-soft on the floating hero render), generous negative
 *   space; scroll-reveal grey→ink; desaturated retro-computer render floating.
 * STORY: Within seconds the visitor knows what Skeure is, sees it's trustworthy
 *   (real universities, plain language, no hype), and that the next step is a free
 *   WhatsApp chat.
 * FIRST VIEWPORT: Giant lowercase headline filling the field; the desaturated
 *   retro-computer render floating; a single amber accent; WhatsApp primary +
 *   secondary CTA; nav is a bare rail.
 * FORM: pinned direction — user-chosen greige monochrome anchored to
 *   midlife.engineering. No concept roll (brief-pinned beats the roll).
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
 *   review, the verdict, and DESIGN.md.
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
  "Free, no-pressure counselling into UGC-recognised online UG and PG degrees from partner universities like LPU and Amity. Every step, made clear — message us on WhatsApp.";

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
