import { Helmet } from "react-helmet-async";
import { DEFAULT_OG_IMAGE, SITE_NAME, type PageSEO } from "@/lib/seo";

type SEOProps = Partial<PageSEO>;

export const SEO = ({
  title,
  description,
  canonical,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}: SEOProps) => (
  <Helmet>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
    {canonical && <link rel="canonical" href={canonical} />}
    <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />

    {/* OpenGraph */}
    {title && <meta property="og:title" content={title} />}
    {description && <meta property="og:description" content={description} />}
    {canonical && <meta property="og:url" content={canonical} />}
    <meta property="og:type" content={type} />
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:locale" content="en_KE" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    {title && <meta name="twitter:title" content={title} />}
    {description && <meta name="twitter:description" content={description} />}
    {ogImage && <meta name="twitter:image" content={ogImage} />}
    <meta name="twitter:site" content="@rauell_" />
    <meta name="twitter:creator" content="@rauell_" />
  </Helmet>
);
