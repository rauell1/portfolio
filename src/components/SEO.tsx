import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { DEFAULT_OG_IMAGE, SITE_NAME, PAGE_SEO, type PageSEO } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

type SEOProps = Partial<PageSEO> & {
  page?: "home" | "projects" | "blog" | "case-studies" | "resume";
};

const DB_PAGE_TO_SEO_KEY = {
  "home": "home",
  "projects": "projects",
  "blog": "blog",
  "case-studies": "caseStudies",
  "resume": "resume",
} as const;

export const SEO = ({
  title,
  description,
  canonical,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
  page,
}: SEOProps) => {
  // If a page is specified, fetch its static default as starting state
  const seoKey = page ? DB_PAGE_TO_SEO_KEY[page] : null;
  const fallback = seoKey ? PAGE_SEO[seoKey] : null;
  const [dbSeo, setDbSeo] = useState<Partial<PageSEO> | null>(fallback);

  useEffect(() => {
    if (!page || !seoKey || !fallback) return;

    let active = true;

    // Reset to fallback when page changes
    setDbSeo(fallback);

    // Fetch from Supabase
    async function fetchDbSeo() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("page_sections")
          .select("content")
          .eq("page", page)
          .eq("section", "seo")
          .maybeSingle();

        if (error) throw error;

        if (data && data.content && typeof data.content === "object" && active) {
          const content = data.content as Record<string, unknown>;
          setDbSeo({
            title: (content.title as string) || fallback.title,
            description: (content.description as string) || fallback.description,
            keywords: (content.keywords as string) || fallback.keywords,
          });
        }
      } catch (err) {
        console.error("Failed to load SEO from database, falling back to static:", err);
      }
    }

    fetchDbSeo();

    return () => {
      active = false;
    };
  }, [page, seoKey, fallback]);

  // Compute final tags by merging props (highest priority), then database values, then static fallbacks
  const activeTitle = title ?? dbSeo?.title ?? fallback?.title;
  const activeDescription = description ?? dbSeo?.description ?? fallback?.description;
  const activeKeywords = keywords ?? dbSeo?.keywords ?? fallback?.keywords;
  const activeCanonical = canonical ?? fallback?.canonical;
  const activeOgImage = ogImage ?? fallback?.ogImage ?? DEFAULT_OG_IMAGE;
  const activeType = type ?? fallback?.type ?? "website";
  const activeNoIndex = noIndex ?? fallback?.noIndex ?? false;

  return (
    <Helmet>
      {activeTitle && <title>{activeTitle}</title>}
      {activeDescription && <meta name="description" content={activeDescription} />}
      {activeKeywords && <meta name="keywords" content={activeKeywords} />}
      {activeCanonical && <link rel="canonical" href={activeCanonical} />}
      <meta name="robots" content={activeNoIndex ? "noindex, nofollow" : "index, follow"} />

      {/* OpenGraph */}
      {activeTitle && <meta property="og:title" content={activeTitle} />}
      {activeDescription && <meta property="og:description" content={activeDescription} />}
      {activeCanonical && <meta property="og:url" content={activeCanonical} />}
      <meta property="og:type" content={activeType} />
      {activeOgImage && <meta property="og:image" content={activeOgImage} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_KE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {activeTitle && <meta name="twitter:title" content={activeTitle} />}
      {activeDescription && <meta name="twitter:description" content={activeDescription} />}
      {activeOgImage && <meta name="twitter:image" content={activeOgImage} />}
      <meta name="twitter:site" content="@rauell_" />
      <meta name="twitter:creator" content="@rauell_" />
    </Helmet>
  );
};

