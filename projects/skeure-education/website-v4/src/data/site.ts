// Single source of truth for contact/brand facts referenced across the site.
// Ported verbatim from the Astro project — facts unchanged.

export const site = {
  brandName: "Skeure",
  verticalName: "Education",
  // Kept in sync with `metadataBase` / site origin in the root layout.
  verticalHost: "education.skeure.com",
  // Decision 2026-08-18: this is THE tagline, everywhere. "Every Step, Made
  // Clear." retired — it survives only inside body copy where it reads as a
  // sentence, never as the brand line.
  tagline: "Same Degree, Now Online.",

  whatsappNumber: "+91-95922-00021",
  get whatsappLink() {
    return `https://wa.me/${this.whatsappNumber.replace(/[^\d]/g, "")}`;
  },

  phone: "+91-95922-00021",
  email: "enquiry@education.skeure.com",

  // Location is country-level only, by decision. No street address, city, or
  // region anywhere public-facing.
  address: {
    country: "India",
    countryCode: "IN",
  },

  officeHours: "Mon–Sat, 9:00 AM – 7:00 PM",

  social: {
    instagram: "https://www.instagram.com/degreecraftinc/", // TODO: new handle once rebranded
  },
} as const;
