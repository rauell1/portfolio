export const SITE_URL = "https://royotieno.rauell.systems";
export const SITE_NAME = "Roy Okola Otieno";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

export interface PageSEO {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  ogImage?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

export const PAGE_SEO = {
  home: {
    title: "Roy Okola Otieno | Clean Energy Engineer & E-Mobility Specialist, Nairobi",
    description:
      "Clean energy and e-mobility engineer with 3+ years of experience in solar PV system design, EV charging infrastructure, and technical feasibility studies across East Africa. Founder of SafariCharge.",
    canonical: SITE_URL,
    keywords:
      "Roy Okola Otieno, clean energy engineer Kenya, EV charging infrastructure Africa, solar PV engineer Nairobi, SafariCharge, e-mobility East Africa, renewable energy consultant Kenya, electric vehicle charging Kenya",
    type: "profile" as const,
  },
  projects: {
    title: "Projects | Roy Okola Otieno — Solar PV & EV Charging Portfolio",
    description:
      "Explore Roy Otieno's portfolio of clean energy and e-mobility projects: solar microgrids, EV charging hubs, AI-powered engineering tools, and sustainable digital platforms across East Africa.",
    canonical: `${SITE_URL}/projects`,
    keywords:
      "clean energy projects Kenya, EV charging portfolio Africa, solar PV projects Nairobi, SafariCharge, engineering portfolio East Africa",
    type: "website" as const,
  },
  blog: {
    title: "Blog | Roy Okola Otieno — Clean Energy & E-Mobility Insights",
    description:
      "Articles on clean energy, EV charging infrastructure, solar PV system design, and sustainable development across East Africa by Roy Okola Otieno.",
    canonical: `${SITE_URL}/blog`,
    keywords:
      "clean energy blog Africa, EV charging articles Kenya, solar PV engineering insights, sustainable energy East Africa, electric mobility Africa",
    type: "website" as const,
  },
  caseStudies: {
    title: "Case Studies | Roy Okola Otieno — Clean Energy Impact Work",
    description:
      "Documented outcomes and verified impact data from real-world deployments in clean energy, e-mobility, and sustainable agriculture across East Africa.",
    canonical: `${SITE_URL}/case-studies`,
    keywords:
      "clean energy case studies Africa, EV charging deployment Kenya, solar energy impact East Africa, sustainable agriculture impact Kenya",
    type: "website" as const,
  },
  resume: {
    title: "Resume | Roy Okola Otieno — Technical Operations & Clean Energy Engineer",
    description:
      "Professional resume of Roy Okola Otieno — Technical Operations and Sales Engineer at Roam Electric Ltd, EV infrastructure specialist, and MBA candidate at University of East London.",
    canonical: `${SITE_URL}/resume`,
    keywords:
      "Roy Okola Otieno CV, technical operations engineer Kenya, clean energy engineer resume, EV infrastructure consultant Africa",
    type: "profile" as const,
  },
  admin: {
    title: "Admin | Roy Okola Otieno",
    description: "Admin dashboard",
    canonical: `${SITE_URL}/admin`,
    noIndex: true,
  },
} satisfies Record<string, PageSEO>;
