import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Search,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { buildWebPageSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { useBlogPosts, type BlogPost } from "@/hooks/use-blog-posts";
import { readingTime } from "@/lib/renderMarkdown";

/* ── helpers ──────────────────────────────────────────────────────────── */

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function allCategories(posts: BlogPost[]): string[] {
  const cats = new Set(posts.map((p) => p.category));
  return ["All", ...Array.from(cats).sort()];
}

/* ── Featured Post card (hero) ──────────────────────────────────────── */
const FeaturedCard = ({ post }: { post: BlogPost }) => {
  const navigate = useNavigate();
  const mins = readingTime(post.content);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-border/60 hover:border-primary/30 transition-all duration-300"
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      {/* Cover */}
      {post.cover_image && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Category + date */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-widest">
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

        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-muted-foreground leading-relaxed mb-4 text-justify hyphens-auto line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          Read article
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
};

/* ── Standard Post Card ─────────────────────────────────────────────── */
const PostCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const navigate = useNavigate();
  const mins = readingTime(post.content);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-primary/30 cursor-pointer transition-all duration-300"
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      {/* Cover thumbnail */}
      {post.cover_image ? (
        <div className="h-44 overflow-hidden flex-shrink-0 relative">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
      ) : (
        <div className="h-44 flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-primary/30" />
        </div>
      )}

      {/* Body */}
      <div className="flex-1 flex flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {mins} min
          </span>
        </div>

        <h3 className="text-base font-display font-bold mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3 text-justify hyphens-auto">
          {post.excerpt ?? post.content.slice(0, 120) + "…"}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary/70 border border-primary/10"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {post.published_at ? formatDate(post.published_at) : ""}
          </span>
          <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            Read <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Skeleton ─────────────────────────────────────────────────────────── */
const CardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-card border border-border/60 animate-pulse">
    <div className="h-44 bg-muted/50" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-muted/60 rounded" />
      <div className="h-5 w-3/4 bg-muted/60 rounded" />
      <div className="h-3 w-full bg-muted/40 rounded" />
      <div className="h-3 w-5/6 bg-muted/40 rounded" />
    </div>
  </div>
);

/* ── Page ───────────────────────────────────────────────────────────── */
export default function BlogPage() {
  const { posts, loading } = useBlogPosts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const p = PAGE_SEO.blog;
  const webPageSchema = buildWebPageSchema({
    name: p.title,
    description: p.description,
    url: p.canonical,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '' },
    { name: 'Blog' },
  ]);

  const categories = useMemo(() => allCategories(posts), [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (activeCategory !== "All") result = result.filter((p) => p.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeCategory, query]);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO page="blog" structuredData={[webPageSchema, breadcrumbSchema]} />
      <Navbar />

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-10"
          >
            <span className="text-primary font-medium text-sm mb-2 block tracking-wide uppercase">
              Insights
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Blog &amp; <span className="gradient-text">Articles</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed text-justify hyphens-auto">
              Deep dives into clean energy, e-mobility, and sustainable development across Africa.
            </p>
          </motion.div>

          {/* Controls: search + category filter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-3">
                <div className="rounded-3xl bg-card border border-border/60 animate-pulse h-64" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p>No articles match your search.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <div key={activeCategory + query} className="space-y-8">
                {/* Featured */}
                {featured && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <FeaturedCard post={featured} />
                    </div>
                  </div>
                )}

                {/* Grid */}
                {rest.length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
