// Primary navigation, shared by Header, MobileNav, and Footer. Trailing slashes
// match the site's canonical policy (next.config trailingSlash: true).
export const navLinks = [
  { href: "/universities/", label: "Universities" },
  { href: "/programs/", label: "Programs" },
  { href: "/financing/", label: "Financing" },
  { href: "/about/", label: "About" },
  { href: "/blog/", label: "Blog" },
  { href: "/faq/", label: "FAQ" },
] as const;

export const legalLinks = [
  { href: "/privacy-policy/", label: "Privacy" },
  { href: "/terms/", label: "Terms" },
  { href: "/credits/", label: "Credits" },
] as const;
