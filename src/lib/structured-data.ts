/**
 * JSON-LD Structured Data Schemas
 * Roy Okola Otieno — royotieno.rauell.systems
 *
 * Reference: docs/json-ld-structured-data.md
 * Google Search Gallery: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
 */

import { SITE_URL, SITE_NAME } from "@/lib/seo";

// ---------------------------------------------------------------------------
// Shared sub-objects
// ---------------------------------------------------------------------------

const person = {
  "@type": "Person",
  name: "Roy Okola Otieno",
  url: SITE_URL,
  image: `${SITE_URL}/images/og-image.jpg`,
  jobTitle: "Clean Energy Engineer & E-Mobility Specialist",
  description:
    "Clean energy and e-mobility engineer with 3+ years of experience in solar PV system design, EV charging infrastructure, and technical feasibility studies across East Africa. Founder of SafariCharge.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  sameAs: [
    SITE_URL,
    "https://www.linkedin.com/in/royotieno",
    "https://github.com/rauell1",
    "https://twitter.com/rauell_",
  ],
  knowsAbout: [
    "Solar PV System Design",
    "EV Charging Infrastructure",
    "Clean Energy Engineering",
    "E-Mobility",
    "Technical Feasibility Studies",
    "East Africa Renewable Energy",
  ],
};

// ---------------------------------------------------------------------------
// ProfilePage — homepage (https://royotieno.rauell.systems)
// Google docs: https://developers.google.com/search/docs/appearance/structured-data/profile-page
// ---------------------------------------------------------------------------

export const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  dateCreated: "2024-01-01",
  dateModified: new Date().toISOString().split("T")[0],
  url: SITE_URL,
  name: `${SITE_NAME} — Portfolio`,
  description:
    "Personal portfolio of Roy Okola Otieno, Clean Energy Engineer and E-Mobility Specialist based in Nairobi, Kenya. Founder of SafariCharge.",
  mainEntity: person,
};

// ---------------------------------------------------------------------------
// WebSite — global (apply on every page via root layout / App.tsx)
// Powers the Google sitelinks search box if a search endpoint exists.
// ---------------------------------------------------------------------------

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Portfolio of Roy Okola Otieno — Clean Energy Engineer, E-Mobility Specialist, and Founder of SafariCharge, based in Nairobi, Kenya.",
  inLanguage: "en",
  author: person,
};

// ---------------------------------------------------------------------------
// WebPage — generic inner-page schema builder
// Usage: pass to <SEO structuredData={buildWebPageSchema({ ... })} />
// ---------------------------------------------------------------------------

export interface WebPageSchemaOptions {
  name: string;
  description: string;
  url: string;
  dateModified?: string;
  breadcrumb?: { name: string; path?: string }[];
}

export function buildWebPageSchema(options: WebPageSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.name,
    description: options.description,
    url: options.url,
    dateModified: options.dateModified ?? new Date().toISOString().split("T")[0],
    author: person,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList builder
// Omit `path` on the last crumb (current page).
// Usage: buildBreadcrumbSchema([{ name: 'Home', path: '' }, { name: 'Projects', path: '/projects' }, { name: 'SafariCharge' }])
// ---------------------------------------------------------------------------

export function buildBreadcrumbSchema(
  crumbs: { name: string; path?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path !== undefined ? { item: `${SITE_URL}${crumb.path}` } : {}),
    })),
  };
}

// ---------------------------------------------------------------------------
// Article / BlogPosting builder
// Usage: buildArticleSchema({ headline, description, slug, datePublished, dateModified, image })
// ---------------------------------------------------------------------------

export interface ArticleSchemaOptions {
  headline: string;
  description: string;
  slug: string; // relative path, e.g. '/blog/solar-pv-nairobi'
  datePublished: string; // ISO 8601
  dateModified?: string;
  image?: string;
  type?: "Article" | "BlogPosting" | "NewsArticle";
}

export function buildArticleSchema(options: ArticleSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": options.type ?? "BlogPosting",
    headline: options.headline,
    description: options.description,
    url: `${SITE_URL}${options.slug}`,
    image: options.image ?? `${SITE_URL}/images/og-image.jpg`,
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
    author: [person],
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

// ---------------------------------------------------------------------------
// SoftwareApplication — SafariCharge (or any web app project page)
// Google docs: https://developers.google.com/search/docs/appearance/structured-data/software-app
// ---------------------------------------------------------------------------

export const safariChargeAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SafariCharge",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  description:
    "EV charging network platform for East Africa. Locate, book, and pay for EV charging sessions across Kenya.",
  url: SITE_URL,
  author: { "@type": "Person", name: "Roy Okola Otieno", url: SITE_URL },
  offers: { "@type": "Offer", price: "0", priceCurrency: "KES" },
};

// ---------------------------------------------------------------------------
// @graph helper — merges multiple schemas into a single LD+JSON block
// Use this in pages that need more than one schema type.
// The SEO component also accepts an array and auto-wraps in @graph.
// ---------------------------------------------------------------------------

export function buildGraph(
  schemas: Record<string, unknown>[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": schemas.map((schema) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { "@context": _ctx, ...rest } = schema as Record<string, unknown>;
      return rest;
    }),
  };
}
