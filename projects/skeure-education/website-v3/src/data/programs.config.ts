// Program landing pages are generated from this config by
// src/app/programs/[slug]/page.tsx. Each entry targets one program family with a
// dedicated URL, and pulls its live offerings + fees from the university content
// at build time, so nothing here restates a fee that could drift.
//
// `match` is tested against each course name AFTER a leading "Online " is
// stripped, anchored so families don't cross-match (BA vs BBA vs MBA, MA vs
// MBA/MCA). Verified against the full course-name list on 2026-08-22.
//
// Only families with real offerings AND fees in the data are listed. LLB (no
// UGC-permitted online mode) and B.Ed/M.Ed (no partner offering yet) are
// deliberately excluded — add B.Ed here only once a university file carries it.

export type ProgramDef = {
  slug: string;
  /** matched against course.name with leading "Online " removed */
  match: RegExp;
  /** lowercase h1, matching the site's PageHero style */
  h1: string;
  /** <title> and OG title */
  title: string;
  description: string;
  intro: string;
  faqs: { question: string; answer: string }[];
};

const commonFaqs = (label: string): { question: string; answer: string }[] => [
  {
    question: `Is an online ${label} valid for jobs and higher studies?`,
    answer: `Yes, when it is from a UGC-recognised university in an approved online or distance mode. A UGC-DEB entitled ${label} is treated as equivalent to a regular degree, including for private jobs, government roles, and further study. We confirm the recognition status of the specific program before you enroll.`,
  },
  {
    question: `Can I do an online ${label} while working?`,
    answer: `Yes. Online and distance modes are built for working students — study material is available on your own schedule with no daily attendance. Tell us your schedule on WhatsApp and we will suggest a university that fits.`,
  },
  {
    question: `How much does an online ${label} cost?`,
    answer: `It varies by university, and the current fee for each is shown on this page. Fees can usually be paid by semester or installment. Message us on WhatsApp for the exact figure and payment options for the one you want.`,
  },
];

export const PROGRAMS: ProgramDef[] = [
  {
    slug: "online-mba",
    match: /\bmba\b/i,
    h1: "online MBA",
    title: "Online MBA in Punjab — Fees, Specializations & Universities",
    description:
      "Compare online and distance MBA programs from UGC-recognised universities, with real fees, specializations, and eligibility. Free counselling from Skeure Education, Patiala.",
    intro:
      "An online or distance MBA lets you earn a UGC-recognised postgraduate management degree without leaving your job. We counsel students across Punjab into the right MBA for their goals and budget, and the guidance is free — we are paid by the university only once you enroll.",
    faqs: [
      ...commonFaqs("MBA"),
      {
        question: "What MBA specializations can I choose?",
        answer:
          "Common specializations across our partners include Marketing, Finance, Human Resources, Information Technology, Operations, and General Management. Availability differs by university — tell us the one you want and we will point you to the universities that offer it.",
      },
    ],
  },
  {
    slug: "online-ma",
    match: /^ma\b/i,
    h1: "online MA",
    title: "Online MA in Punjab — Specializations, Fees & Universities",
    description:
      "Compare online and distance MA programs — English, History, Political Science, Punjabi, Economics and more — from UGC-recognised universities. Free counselling from Patiala.",
    intro:
      "An online or distance MA is a flexible way to earn a postgraduate arts degree in subjects like English, History, Political Science, Punjabi and Economics. We help students across Punjab pick a UGC-recognised MA that fits their subject and budget, free of charge.",
    faqs: commonFaqs("MA"),
  },
  {
    slug: "online-ba",
    match: /^ba\b/i,
    h1: "online BA",
    title: "Online BA in Punjab — Fees, Subjects & Universities",
    description:
      "Compare online and distance BA programs from UGC-recognised universities, with real fees and eligibility. Free admission counselling from Skeure Education, Patiala.",
    intro:
      "An online or distance BA is an accessible undergraduate arts degree you can complete alongside work or family. We counsel students across Punjab into UGC-recognised BA programs, including specializations like Psychology, and the guidance is free.",
    faqs: commonFaqs("BA"),
  },
  {
    slug: "online-msc",
    match: /^m\.?\s*sc/i,
    h1: "online M.Sc",
    title: "Online M.Sc in Punjab — Data Science, IT & More",
    description:
      "Compare online and distance M.Sc programs — Data Science, Information Technology, Mathematics, Economics — from UGC-recognised universities. Free counselling from Patiala.",
    intro:
      "An online or distance M.Sc lets you specialise in fields like Data Science, Information Technology, Mathematics and Economics without attending campus. We help students across Punjab find a UGC-recognised M.Sc that matches their background and goals, free of charge.",
    faqs: commonFaqs("M.Sc"),
  },
  {
    slug: "online-bba",
    match: /^bba\b/i,
    h1: "online BBA",
    title: "Online BBA in Punjab — Fees, Eligibility & Universities",
    description:
      "Compare online and distance BBA programs from UGC-recognised universities, with real fees and eligibility. Free admission counselling from Skeure Education, Patiala.",
    intro:
      "An online or distance BBA is a strong undergraduate management degree for students who want a business career or an MBA later. We counsel students across Punjab into UGC-recognised BBA programs, free of charge.",
    faqs: commonFaqs("BBA"),
  },
  {
    slug: "online-bca",
    match: /^bca\b/i,
    h1: "online BCA",
    title: "Online BCA in Punjab — Fees, Eligibility & Universities",
    description:
      "Compare online and distance BCA programs from UGC-recognised universities, with real fees and eligibility. Free admission counselling from Skeure Education, Patiala.",
    intro:
      "An online or distance BCA is an undergraduate computer applications degree for students aiming at IT and software careers. We help students across Punjab into UGC-recognised BCA programs, free of charge.",
    faqs: commonFaqs("BCA"),
  },
  {
    slug: "online-mca",
    match: /^mca\b/i,
    h1: "online MCA",
    title: "Online MCA in Punjab — Fees, Eligibility & Universities",
    description:
      "Compare online and distance MCA programs from UGC-recognised universities, with real fees and eligibility. Free admission counselling from Skeure Education, Patiala.",
    intro:
      "An online or distance MCA is a postgraduate computer applications degree for students who want to advance in IT and software. We counsel students across Punjab into UGC-recognised MCA programs, free of charge.",
    faqs: commonFaqs("MCA"),
  },
];

export function programBySlug(slug: string): ProgramDef | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}
