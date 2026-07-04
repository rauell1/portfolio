# JSON-LD Structured Data Guide

> Standard implementation reference for Google Rich Results across **React + Vite** and **Next.js** projects.
> Source: Google Search Gallery — [https://developers.google.com/search/docs/appearance/structured-data/search-gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)

---

## Table of Contents

1. [Platform Implementation Patterns](#1-platform-implementation-patterns)
2. [Schema Types Quick Reference](#2-schema-types-quick-reference)
3. [Organization](#3-organization)
4. [WebSite](#4-website)
5. [BreadcrumbList](#5-breadcrumblist)
6. [FAQPage](#6-faqpage)
7. [LocalBusiness](#7-localbusiness)
8. [Article](#8-article)
9. [Event](#9-event)
10. [VideoObject](#10-videoobject)
11. [SoftwareApplication](#11-softwareapplication)
12. [Course List](#12-course-list)
13. [ProfilePage](#13-profilepage)
14. [Product (Digital/SaaS)](#14-product-digitalsaas)
15. [Using @graph for Multiple Schemas](#15-using-graph-for-multiple-schemas)
16. [Testing and Validation](#16-testing-and-validation)

---

## 1. Platform Implementation Patterns

### React + Vite (SPA) — via React Helmet

In Vite SPAs, structured data is injected into the head at runtime using `react-helmet-async`.

**Reusable SEO component pattern:**

```tsx
// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  structuredData?: object | object[]  // Single schema or array for @graph
  noIndex?: boolean
}

const BASE_URL = 'https://www.example.com'

const SEO = ({ title, description, structuredData, ...props }: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* ... other meta tags ... */}

      {/* Structured Data — supports single object or @graph array */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData)
              ? {
                  '@context': 'https://schema.org',
                  '@graph': structuredData.map(item => {
                    const { '@context': _, ...rest } = item as Record<string, unknown>
                    return rest
                  }),
                }
              : structuredData
          )}
        </script>
      )}
    </Helmet>
  )
}
```

**Usage in a page:**

```tsx
// src/pages/HomePage.tsx
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Your Company',
  url: 'https://www.example.com',
  // ...
}

export default function HomePage() {
  return (
    <PageWrapper structuredData={organizationSchema}>
      {/* page content */}
    </PageWrapper>
  )
}
```

**Passing multiple schemas (array triggers @graph):**

```tsx
<PageWrapper structuredData={[organizationSchema, websiteSchema, breadcrumbSchema]}>
```

---

### Next.js (App Router) — Server-Rendered Script Tags

In Next.js 15 with the App Router, structured data is rendered server-side. There is no `react-helmet-async` — use native script tags with `JSON.stringify` on static schema objects instead.

```tsx
// src/components/structured-data.tsx

// Note: These schemas use JSON.stringify on hardcoded data objects we control.
// This is the standard Next.js pattern for JSON-LD — no user input is involved.

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Company",
    "url": "https://www.example.com",
    // ...
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Your Site",
    "url": "https://www.example.com",
    // ...
  };

  // Each schema is serialised via JSON.stringify into a script tag
  // This is safe because the data is static and developer-controlled
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line -- safe: static JSON.stringify of hardcoded schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line -- safe: static JSON.stringify of hardcoded schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
```

**Mount in root layout (runs on every page):**

```tsx
// src/app/layout.tsx
import { StructuredData } from '@/components/structured-data'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  )
}
```

**Page-specific schemas (e.g. FAQPage on a single route):**

```tsx
// src/app/faq/page.tsx
export const metadata = { title: 'FAQ', description: '...' }

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [/* questions */]
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line -- safe: static schema data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* page content */}
    </>
  )
}
```

### Key Differences Summary

| Concern | Vite SPA | Next.js App Router |
|---|---|---|
| Injection method | react-helmet-async Helmet | Native script with JSON.stringify |
| Rendering | Client-side (hydrated at runtime) | Server-side (in HTML source) |
| Global schemas | Via PageWrapper / SEO component | Via StructuredData component in layout.tsx |
| Page-specific schemas | Pass structuredData prop to wrapper | Inline script in page component |
| Multiple schemas | Array prop triggers @graph wrapper | Multiple script tags (one per schema) |
| Google bot sees it? | Yes — Googlebot renders JS SPAs | Yes — in raw HTML source |

> **Note**: Google can render JavaScript SPAs, so Vite apps with Helmet-injected JSON-LD do work. However, server-rendered (Next.js) structured data is more reliable as it's in the initial HTML response. Prerendering a Vite SPA at build time gives you the same reliability.

---

## 2. Schema Types Quick Reference

Which schemas are relevant to which type of project:

| Schema Type | Marketing Sites | Web Apps / SaaS | Blogs / Content | Portfolios | Podcasts | E-commerce |
|---|---|---|---|---|---|---|
| Organization | Required | Required | Required | Required | Required | Required |
| WebSite | Recommended | Recommended | Recommended | Recommended | Recommended | Recommended |
| BreadcrumbList | Recommended | Optional | Recommended | Recommended | Optional | Recommended |
| FAQPage | If FAQ exists | If FAQ exists | — | — | If FAQ exists | If FAQ exists |
| LocalBusiness | If physical | — | — | — | — | If physical |
| Article | If blog | — | Required | — | — | — |
| Event | If events | — | — | If speaking | — | — |
| VideoObject | If video | If video | If video | — | — | — |
| SoftwareApplication | — | Required | — | — | — | — |
| Course | — | If LMS | — | — | — | — |
| ProfilePage | — | — | Author pages | Homepage | — | — |
| Product | — | SaaS pricing | — | — | — | Required |

---

## 3. Organization

> **Where**: Homepage (or About page). Every project should have this.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/organization](https://developers.google.com/search/docs/appearance/structured-data/organization)

All properties are recommended (none strictly required), but include as many as relevant.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Co",
  "legalName": "Example Company Ltd",
  "url": "https://www.example.com",
  "logo": "https://www.example.com/logo.png",
  "description": "Example Co builds conversion-focused websites, custom web applications, and provides AI consulting.",
  "email": "hello@example.com",
  "telephone": "+44-xxx-xxx-xxxx",
  "foundingDate": "2023",
  "founder": {
    "@type": "Person",
    "name": "Jane Doe"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GB"
  },
  "areaServed": ["GB", "US", "AU", "CA"],
  "sameAs": [
    "https://www.linkedin.com/company/example",
    "https://www.tiktok.com/@example"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "url": "https://www.example.com/contact"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Digital Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Website Development",
          "description": "Custom, conversion-focused websites"
        }
      }
    ]
  }
}
```

**Key properties:** name (company/org name), legalName (registered name), url (homepage — helps Google uniquely identify the org), logo (min 112x112px, crawlable, on white background), description, foundingDate (ISO 8601), founder (Person), address (PostalAddress), sameAs (social/external listings), contactPoint, hasOfferCatalog (services/products).

**Guidelines:**
- Place on homepage or dedicated about page
- Use the most specific subtype if applicable (e.g., LocalBusiness, OnlineStore)
- Logo must be crawlable and indexable
- Allow several days for Google to recrawl after publishing

---

## 4. WebSite

> **Where**: Homepage (global, applied on every page via layout).
> Not a separate Google gallery item but widely recommended — powers sitelinks search box.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Example Co",
  "url": "https://www.example.com",
  "description": "Websites, Web Apps & AI Consulting",
  "inLanguage": "en-GB",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Notes:**
- `potentialAction` with `SearchAction` enables the Google sitelinks search box
- Only include `SearchAction` if the site has working search functionality
- `inLanguage` should match the html lang attribute

---

## 5. BreadcrumbList

> **Where**: All inner pages (not homepage). Shows navigation path in search results.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.example.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.example.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Websites" }
  ]
}
```

**Required properties:** itemListElement (min 2 items), position (1-based), name (display label), item (page URL — omit for the last/current item).

**Guidelines:**
- Represent user navigation path, not URL structure
- Omit `item` URL from the final breadcrumb (uses the current page URL)
- Minimum of 2 ListItems required for eligibility
- Multiple trails supported if page is reachable via different paths

**Helper function for Vite projects:**

```tsx
// src/lib/structured-data.ts
export function buildBreadcrumbs(
  crumbs: { name: string; path?: string }[],
  baseUrl: string = 'https://www.example.com'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      // Omit item URL for the last breadcrumb
      ...(crumb.path ? { item: baseUrl + crumb.path } : {}),
    })),
  }
}
```

---

## 6. FAQPage

> **Where**: Any page with an FAQ section (expandable Q&A content).
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/faqpage](https://developers.google.com/search/docs/appearance/structured-data/faqpage)

> **Important**: As of 2023, FAQ rich results are only shown for **well-known, authoritative government and health websites**. However, the structured data still helps Google understand page content and may benefit standard search results. Include it where FAQ content exists — the cost is zero and the data is still parsed.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does Example Co offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Example Co offers custom website development, web application development, AI consulting, and a self-hosted learning management system."
      }
    },
    {
      "@type": "Question",
      "name": "Which industries do you specialise in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We specialise in medical, dental, sports, and education sectors, with tailored solutions for each industry."
      }
    }
  ]
}
```

**Required properties:** mainEntity (Question[] — at least 1), Question.name (full question text), Question.acceptedAnswer (single Answer), Answer.text (full answer — supports limited HTML: a, p, b, ul, ol, li, h2-h6).

**Guidelines:**
- Questions and answers must be **visible on the page** (or in expandable/accordion content)
- One answer per question — use `QAPage` for user-submitted multi-answer Q&A
- Only mark up one instance of each FAQ across the entire site
- No obscene, explicit, violent, or hateful content

**Helper function:**

```tsx
// src/lib/structured-data.ts
export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}
```

---

## 7. LocalBusiness

> **Where**: Homepage or location-specific pages for businesses with a physical address.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/local-business](https://developers.google.com/search/docs/appearance/structured-data/local-business)

> **When to use**: Businesses with a physical premises (dental practices, medical clinics, sports clubs, legal firms). Not for purely online businesses.

```json
{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Example Dental Practice",
  "image": "https://www.example.com/photos/practice.jpg",
  "url": "https://www.example.com",
  "telephone": "+44-20-1234-5678",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 High Street",
    "addressLocality": "London",
    "addressRegion": "Greater London",
    "postalCode": "SW1A 1AA",
    "addressCountry": "GB"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 51.5074, "longitude": -0.1278 },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:30"
    }
  ],
  "priceRange": "$$"
}
```

**Required:** name, address (PostalAddress). **Recommended:** geo (min 5 decimal places), telephone (with country/area code), openingHoursSpecification, url (working link), image (multiple resolutions 1:1/4:3/16:9, min 50K px), priceRange ("$" to "$$$$" or "10-50 GBP").

**Common @type subtypes:**
- `Dentist` — dental practice websites
- `MedicalClinic` / `Physician` — medical websites
- `SportsActivityLocation` — sports club websites
- `LegalService` / `Attorney` — legal websites
- `EducationalOrganization` — education sector

---

## 8. Article

> **Where**: Blog posts, news articles, content pages.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/article](https://developers.google.com/search/docs/appearance/structured-data/article)

> **When to use**: Any project with a blog or content section.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How AI is Transforming Dental Practice Management",
  "image": [
    "https://www.example.com/photos/1x1/hero.jpg",
    "https://www.example.com/photos/4x3/hero.jpg",
    "https://www.example.com/photos/16x9/hero.jpg"
  ],
  "datePublished": "2025-06-15T08:00:00+00:00",
  "dateModified": "2025-06-20T10:30:00+00:00",
  "author": [
    { "@type": "Person", "name": "Jane Doe", "url": "https://www.example.com/authors/jane-doe" }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Example Co",
    "logo": { "@type": "ImageObject", "url": "https://www.example.com/logo.png" }
  },
  "description": "Exploring how AI tools are changing the way dental practices manage patients, scheduling, and treatment plans."
}
```

**Key properties (all recommended, none required):** headline, image (multiple aspect ratios, min 50K px), datePublished (ISO 8601 with timezone), dateModified, author (Person[] — list each author separately), author.url (author profile page), publisher (Organization), description.

**Subtypes:** `Article` (general), `NewsArticle` (news/current affairs), `BlogPosting` (blog posts).

---

## 9. Event

> **Where**: Pages showcasing events, conferences, speaking engagements.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/event](https://developers.google.com/search/docs/appearance/structured-data/event)

> **When to use**: Speaking-engagement pages, conference listings.

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "CIO Summit London 2025",
  "startDate": "2025-09-15T09:00:00+01:00",
  "endDate": "2025-09-15T17:00:00+01:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "ExCeL London",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Royal Victoria Dock",
      "addressLocality": "London",
      "postalCode": "E16 1XL",
      "addressCountry": "GB"
    }
  },
  "image": "https://www.example.com/event-photo.jpg",
  "description": "Annual CIO Summit covering digital transformation and AI adoption.",
  "performer": { "@type": "Person", "name": "Jane Doe" },
  "organizer": { "@type": "Organization", "name": "CIO Summit", "url": "https://www.example.com" }
}
```

**Required:** name, startDate (ISO 8601 **with timezone offset**), location (Place — venue name + full PostalAddress). **Recommended:** endDate, eventStatus (EventScheduled/EventCancelled/EventPostponed/EventRescheduled), eventAttendanceMode (Offline/Online/Mixed), image, description, performer, organizer, offers (ticket info).

**Guidelines:** Events must be bookable to the general public; don't mark non-events (discounts, hours) as events; always include timezone offsets in dates.

---

## 10. VideoObject

> **Where**: Pages with embedded video content.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/video](https://developers.google.com/search/docs/appearance/structured-data/video)

> **When to use**: Demo pages, video platforms, podcast episodes with video.

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Example App Platform Demo",
  "description": "See how the Example App helps organisations deliver custom training.",
  "thumbnailUrl": "https://www.example.com/video-thumb.jpg",
  "uploadDate": "2025-03-15T10:00:00+00:00",
  "duration": "PT3M42S",
  "contentUrl": "https://www.example.com/videos/demo.mp4",
  "embedUrl": "https://www.youtube.com/embed/xxxx"
}
```

**Required:** name (unique title), thumbnailUrl, uploadDate (ISO 8601 with timezone). **Recommended:** description, duration (ISO 8601 duration, e.g. PT1M54S = 1 min 54 sec), contentUrl (direct video file — preferred), embedUrl (if no contentUrl), interactionStatistic (view count with WatchAction type).

---

## 11. SoftwareApplication

> **Where**: Product/landing pages for web applications and SaaS tools.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/software-app](https://developers.google.com/search/docs/appearance/structured-data/software-app)

> **When to use**: Any product with a dedicated landing page — web apps, SaaS tools.

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Example App",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "AI-powered video analysis platform for TikTok, Instagram, and YouTube.",
  "url": "https://www.example.com",
  "image": "https://www.example.com/og-image.jpg",
  "author": { "@type": "Organization", "name": "Example Co" },
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": 4.8, "ratingCount": 150 }
}
```

**Required:** name, offers.price (set "0" for free apps), aggregateRating OR review (at least one). **Recommended:** applicationCategory (BusinessApplication, EducationalApplication, UtilitiesApplication, etc.), operatingSystem ("Web", "ANDROID", "iOS").

> **Note**: Only include `aggregateRating` if you have genuine, verifiable ratings. Don't fabricate ratings — this violates Google's guidelines.

---

## 12. Course List

> **Where**: Educational platforms listing multiple courses.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/course](https://developers.google.com/search/docs/appearance/structured-data/course)

> **When to use**: Learning platforms, LMS product pages, course catalogues.

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Course",
        "url": "https://www.example.com/courses/getting-started",
        "name": "Getting Started with Cursor",
        "description": "Learn the fundamentals of AI-assisted coding with Cursor IDE.",
        "provider": { "@type": "Organization", "name": "Example Academy", "sameAs": "https://www.example.com" }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Course",
        "url": "https://www.example.com/courses/advanced",
        "name": "Advanced Cursor Techniques",
        "description": "Master advanced prompting, multi-file editing, and project workflows.",
        "provider": { "@type": "Organization", "name": "Example Academy", "sameAs": "https://www.example.com" }
      }
    }
  ]
}
```

**Required:** name (course title), description (course summary, max 60 chars displayed), provider (Organization).

**Guidelines:** Minimum 3 courses required for rich result eligibility; each course needs a unique URL; no promotional language, pricing, or discounts in titles; must demonstrate clear educational outcomes.

---

## 13. ProfilePage

> **Where**: Personal portfolio homepages, author pages.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/profile-page](https://developers.google.com/search/docs/appearance/structured-data/profile-page)

> **When to use**: Personal portfolio homepages, author bio pages on blog platforms.

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateCreated": "2024-01-15",
  "dateModified": "2025-06-01",
  "mainEntity": {
    "@type": "Person",
    "name": "Jane Doe",
    "description": "Founder of Example Co. Web developer, AI consultant, and public speaker.",
    "image": "https://www.example.com/profile-photo.jpg",
    "sameAs": [
      "https://www.example.com",
      "https://www.linkedin.com/in/example",
      "https://www.tiktok.com/@example"
    ],
    "url": "https://www.example.com"
  }
}
```

**Required:** mainEntity (Person/Organization), mainEntity.name. **Recommended:** dateCreated, dateModified, description (bio/credentials), image (profile photo), sameAs (external profiles/links).

---

## 14. Product (Digital/SaaS)

> **Where**: Pricing pages, product landing pages for SaaS tools.
> **Google docs**: [https://developers.google.com/search/docs/appearance/structured-data/product](https://developers.google.com/search/docs/appearance/structured-data/product)

> **Note**: Google's Product schema is primarily designed for physical/e-commerce products. For SaaS and web apps, **SoftwareApplication** (Section 11) is generally more appropriate. Use Product schema when you have clear pricing tiers to display.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Example LMS - Professional Plan",
  "description": "Self-hosted learning management system with unlimited courses and custom branding.",
  "brand": { "@type": "Brand", "name": "Example Co" },
  "offers": {
    "@type": "Offer",
    "price": "99",
    "priceCurrency": "GBP",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "url": "https://www.example.com/lms"
  }
}
```

---

## 15. Using @graph for Multiple Schemas

When a page needs multiple schema types, use `@graph` to bundle them into a single JSON-LD block. This is cleaner than multiple script tags and avoids redundancy.

### Vite (automatic via SEO component)

Pass an array and the SEO component wraps them in `@graph`:

```tsx
const schemas = [organizationSchema, websiteSchema, breadcrumbSchema]

<PageWrapper structuredData={schemas}>
```

Output:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "name": "..." },
    { "@type": "WebSite", "name": "..." },
    { "@type": "BreadcrumbList", "itemListElement": ["..."] }
  ]
}
```

### Next.js (manual @graph or separate tags)

**Option A — Separate script tags** (simpler): multiple script tags each with `type="application/ld+json"`, one per schema object.

**Option B — Single @graph block** (cleaner):

```tsx
const graphSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", ...orgData },
    { "@type": "WebSite", ...siteData },
  ]
}

// Single script tag with JSON.stringify(graphSchema)
```

Both approaches are valid. Google handles them identically.

---

## 16. Testing and Validation

### Tools

| Tool | URL | Purpose |
|---|---|---|
| Rich Results Test | [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results) | Test if a page is eligible for rich results |
| Schema Markup Validator | [https://validator.schema.org/](https://validator.schema.org/) | Validate any Schema.org markup |
| Google Search Console | [https://search.google.com/search-console](https://search.google.com/search-console) | Monitor rich results performance over time |
| URL Inspection Tool | (within Search Console) | Check how Google sees a specific URL |

### Validation Checklist

1. Run Rich Results Test on each page type (homepage, service pages, FAQ pages, etc.)
2. Check for errors vs warnings — errors prevent rich results, warnings are recommendations
3. Inspect rendered HTML — for Vite SPAs, verify JSON-LD appears in the rendered DOM (View Source won't show Helmet-injected content unless prerendered; use Chrome DevTools or Rich Results Test)
4. Verify `@context` is `"https://schema.org"` (not `http`)
5. Check URLs are absolute — all `url`, `image`, `logo` properties must be full URLs, not relative paths
6. Validate dates — use ISO 8601 format with timezone offsets where applicable
7. Test in Search Console — after deployment, use URL Inspection to request indexing

### Post-Deployment

- Allow **several days** for Google to recrawl and process structured data
- Monitor the **Enhancements** section in Search Console for structured data reports
- Check for **manual actions** if structured data is flagged

---

## Quick-Start Checklist

When adding structured data to a project:

1. **Read this guide** for the relevant schema types
2. **Check if the project already has an SEO component** (search for `application/ld+json` or `structuredData`)
3. **Start with Organization + WebSite** on the homepage — every project needs these
4. **Add BreadcrumbList** to all inner pages
5. **Add page-specific schemas** (FAQPage, Article, Event, etc.) where content matches
6. **Use helper functions** (buildBreadcrumbs, buildFAQSchema) to keep schemas consistent
7. **Test with Rich Results Test** before committing
8. **Verify in Search Console** after deployment

---

*Source: Google Structured Data Documentation — https://developers.google.com/search/docs/appearance/structured-data/search-gallery*
