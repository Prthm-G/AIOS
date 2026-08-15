import { z } from "zod";

// Ported verbatim (shapes unchanged) from the Astro project's src/content.config.ts.
// These validate the frontmatter of the copied markdown at build time; the loader
// in src/lib/content.ts calls .parse() so bad content fails the build, not runtime.

const feePlanSchema = z.object({
  name: z.string(),
  retailPrice: z.number().optional(),
  oneTimeFee: z.number().optional(),
  oneTimeDiscountPercent: z.number().optional(),
  semesterWise: z.number().optional(),
  annual: z.number().optional(),
});

const feeSchema = z.object({
  semesterWise: z.number().optional(),
  annual: z.number().optional(),
  lumpsum: z.number().optional(),
  applicationFee: z.number().optional(),
  examFee: z.number().optional(),
  plans: z.array(feePlanSchema).optional(),
});

const specializationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  fee: feeSchema.optional(),
  brochureUrl: z.string().optional(),
});

const courseSchema = z.object({
  name: z.string(),
  category: z.enum(["Management", "Computer Applications", "Commerce", "Arts & Humanities", "Science"]),
  level: z.enum(["UG", "PG", "UG+PG"]),
  duration: z.string(),
  mode: z.string().default("Online"),
  eligibility: z.string(),
  fees: feeSchema,
  notes: z.string().optional(),
  comboOf: z.array(z.string()).optional(),
  specializations: z.array(specializationSchema).optional(),
  brochureUrl: z.string().optional(),
});

export const universitySchema = z.object({
  name: z.string(),
  city: z.string(),
  state: z.string(),
  establishedYear: z.number(),
  officialSite: z.string().url(),
  accreditations: z.array(z.string()),
  history: z.array(z.object({ year: z.number(), event: z.string() })),
  achievements: z.array(z.string()),
  courses: z.array(courseSchema),
  featured: z.boolean().default(false),
  evidenceStatus: z.enum(["unverified", "stale", "verified", "disputed"]).default("unverified"),
  lastVerifiedAt: z.string().optional(),
  noindex: z.boolean().default(false),
  learningPlatform: z
    .object({
      name: z.string(),
      aiTutor: z.string().optional(),
      community: z.string().optional(),
      features: z.array(z.string()).optional(),
    })
    .optional(),
  placements: z
    .object({
      headline: z.string().optional(),
      hiringPartnersCount: z.number().optional(),
      recruiters: z.array(z.string()).optional(),
      roles: z.array(z.object({ role: z.string(), salary: z.string() })).optional(),
    })
    .optional(),
  faq: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
        category: z.string().optional(),
        program: z.string().optional(),
      }),
    )
    .optional(),
});

export const testimonialSchema = z.object({
  name: z.string(),
  role: z.string(),
  universitySlug: z.string().optional(),
});

export const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.enum(["general", "financing"]).default("general"),
  order: z.number().default(0),
});

export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  category: z.string(),
});

export type Course = z.infer<typeof courseSchema>;
export type Fee = z.infer<typeof feeSchema>;
export type Specialization = z.infer<typeof specializationSchema>;
export type University = z.infer<typeof universitySchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type BlogPost = z.infer<typeof blogSchema>;
