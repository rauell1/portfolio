import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag, Share2, BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { SITE_URL } from "@/lib/seo";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { renderMarkdown, readingTime } from "@/lib/renderMarkdown";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const Skeleton = () => (
  <div className="max-w-3xl mx-auto animate-pulse space-y-4 mt-10">
    <div className="h-8 w-2/3 bg-muted/60 rounded" />
    <div className="h-4 w-1/3 bg-muted/40 rounded" />
    <div className="h-64 bg-muted/40 rounded-2xl" />
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className={`h-4 bg-muted/30 rounded ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
    ))}
  </div>
);

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { posts, loading } = useBlogPosts();

  const post = useMemo(() => posts.find((p) => p.slug === slug), [posts, slug]);
  const relatedPosts = useMemo(
    () => posts.filter((p) => p.id !== post?.id && p.category === post?.category).slice(0, 3),
    [posts, post]
  );

  const bodyHtml = useMemo(() => (post ? renderMarkdown(post.content) : ""), [post]);
  const mins = post ? readingTime(post.content) : 0;

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: post?.title ?? "", url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  const articleSchema = post
    ? buildArticleSchema({
        headline: post.title,
        description: post.excerpt ?? post.content.slice(0, 155) ?? '',
        slug: `/blog/${post.slug}`,
        datePublished: post.published_at ?? post.created_at,
        dateModified: post.updated_at ?? post.published_at ?? post.created_at,
        image: post.cover_image ?? undefined,
        type: 'BlogPosting',
      })
    : null;

  const breadcrumbSchema = post
    ? buildBreadcrumbSchema([
        { name: 'Home', path: '' },
        { name: 'Blog', path: '/blog' },
        { name: post.title },
      ])
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {post ? (
        <SEO
          title={`${post.title} | Roy Okola Otieno`}
          description={post.excerpt ?? post.content.slice(0, 155)}
          canonical={`${SITE_URL}/blog/${post.slug}`}
          ogImage={post.cover_image ?? undefined}
          type="article"
          structuredData={
            articleSchema && breadcrumbSchema
              ? [articleSchema, breadcrumbSchema]
              : undefined
          }
        />
      ) : (
        <SEO title="Blog Post | Roy Okola Otieno" description="Read articles on clean energy and e-mobility." />
      )}
      <Navbar />

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {loading ? (
            <Skeleton />
          ) : !post ? (
            <div className="text-center py-32">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <h2 className="text-2xl font-display font-bold mb-2">Article not found</h2>
              <p className="text-muted-foreground mb-6">This post may have been moved or removed.</p>
              <button
                onClick={() => navigate("/blog")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse all articles
              </button>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-widest">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                  {post.published_at && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.published_at)}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {mins} min read
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-2 border-primary/40 pl-4 italic text-justify hyphens-auto">
                    {post.excerpt}
                  </p>
                )}

                {/* Cover */}
                {post.cover_image && (
                  <div className="relative mb-10 rounded-2xl overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-64 md:h-80 object-cover"
                      loading="eager"
                    />
                  </div>
                )}

                {/* Tags + Share row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-10 pb-6 border-b border-border/60">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/15 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </button>
                </div>

                {/* Body */}
                <div
                  className="prose-custom"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </motion.article>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-16 pt-12 border-t border-border/60"
                >
                  <h2 className="text-xl font-display font-bold mb-6">More in {post.category}</h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {relatedPosts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/blog/${p.slug}`}
                        className="group rounded-xl bg-card border border-border/60 hover:border-primary/30 p-4 transition-all duration-200"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          {p.category}
                        </span>
                        <h3 className="text-sm font-display font-semibold mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {p.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">{readingTime(p.content)} min read</span>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
