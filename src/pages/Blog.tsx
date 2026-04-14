import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Search, Leaf, Zap, Wind, Link2, Check, Sun, Globe, Edit, RefreshCw } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterForm } from "@/components/NewsletterForm";
import { STATIC_BLOG_POSTS, STATIC_BLOG_SLUGS } from "@/data/blogPosts";
import { useAuth } from "@/hooks/useAuth";
import { isAdminEmail } from "@/lib/config";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  share_token?: string | null;
  share_enabled?: boolean;
  share_expires_at?: string | null;
}

const categoryIcons: Record<string, React.ElementType> = {
  "renewable-energy": Leaf,
  "ev-mobility": Zap,
  "sustainability": Wind,
};

const categoryColors: Record<string, string> = {
  "renewable-energy": "bg-green-500/20 text-green-400",
  "ev-mobility": "bg-blue-500/20 text-blue-400",
  "sustainability": "bg-emerald-500/20 text-emerald-400",
};

const BLOG_PILLARS = [
  { title: "Renewable Energy Systems", subtitle: "Solar, microgrids, energy infrastructure", icon: Sun },
  { title: "Electric Mobility Infrastructure", subtitle: "Charging networks, EV adoption, infrastructure design", icon: Zap },
  { title: "Sustainable Systems in Africa", subtitle: "Circular economy, climate innovation, infrastructure challenges", icon: Globe },
];

const Blog = () => {
  const { user } = useAuth();
  const isAdmin = isAdminEmail(user?.email);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [failedCoverIds, setFailedCoverIds] = useState<Set<string>>(new Set());

  const getDefaultShareExpiryIso = () => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    return expires.toISOString();
  };

  const isShareActive = (post: BlogPost) => {
    if (!post.share_enabled || !post.share_token) return false;
    if (!post.share_expires_at) return true;
    return new Date(post.share_expires_at).getTime() > Date.now();
  };

  const copyPostLink = async (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault();
    e.stopPropagation();
    const isStatic = STATIC_BLOG_SLUGS.has(post.slug);
    if (isStatic) {
      const url = `${window.location.origin}/blog/${post.slug}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedSlug(post.slug);
        setTimeout(() => setCopiedSlug(null), 2000);
      });
      return;
    }
    let shareToken = post.share_token ?? null;
    const shareIsActive = isShareActive(post);
    let shareExpiresAt = post.share_expires_at ?? null;
    if (!shareToken || !shareIsActive) {
      shareToken = crypto.randomUUID();
      shareExpiresAt = getDefaultShareExpiryIso();
      const { error } = await supabase
        .from("blog_posts")
        .update({ share_token: shareToken, share_enabled: true, share_expires_at: shareExpiresAt })
        .eq("id", post.id);
      if (error) { console.error("Unable to generate share token:", error); return; }
      setPosts((prev) =>
        prev.map((item) =>
          item.id === post.id ? { ...item, share_token: shareToken, share_enabled: true, share_expires_at: shareExpiresAt } : item
        )
      );
    }
    const url = `${window.location.origin}/blog/${post.slug}?s=${encodeURIComponent(shareToken!)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(post.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const regenerateShareLink = async (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault();
    e.stopPropagation();
    const shareToken = crypto.randomUUID();
    const shareExpiresAt = getDefaultShareExpiryIso();
    const { error } = await supabase
      .from("blog_posts")
      .update({ share_token: shareToken, share_enabled: true, share_expires_at: shareExpiresAt })
      .eq("id", post.id);
    if (error) { console.error("Unable to regenerate share token:", error); return; }
    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id ? { ...item, share_token: shareToken, share_enabled: true, share_expires_at: shareExpiresAt } : item
      )
    );
    const url = `${window.location.origin}/blog/${post.slug}?s=${encodeURIComponent(shareToken)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(post.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, category, tags, published_at, created_at, share_token, share_enabled, share_expires_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(100);
      const dbPosts = data || [];
      const dbExceptStatic = dbPosts.filter((p) => !STATIC_BLOG_SLUGS.has(p.slug));
      const merged = [...dbExceptStatic, ...STATIC_BLOG_POSTS].sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });
      setPosts(merged as typeof posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts(STATIC_BLOG_POSTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold">
              Insights on <span className="gradient-text">Clean Energy</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Thought leadership on renewable energy engineering, electric mobility infrastructure, energy systems modeling, and climate solutions in Africa.
            </p>
          </motion.div>

          {/* Three pillars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="grid sm:grid-cols-3 gap-5"
          >
            {BLOG_PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent p-6 text-center sm:text-left"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <pillar.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.subtitle}</p>
              </div>
            ))}
          </motion.div>

          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? "bg-primary text-primary-foreground"
                      : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat] || Leaf;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Admin bar */}
          {isAdmin && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-primary/30 bg-primary/10 px-5 py-3 text-sm text-primary">
              <span>Blog manager is enabled: create new posts or edit existing ones.</span>
              <Link
                to="/admin/posts/new"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
              >
                <Edit className="w-4 h-4" />
                New Post
              </Link>
            </div>
          )}

          {/* Posts grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-black/10 dark:bg-white/10" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-black/10 dark:bg-white/10 rounded w-4/5" />
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-xl text-muted-foreground">No articles found.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => {
                const Icon = categoryIcons[post.category] || Leaf;
                const colorClass = categoryColors[post.category] || "bg-primary/20 text-primary";
                const hasCover = !!post.cover_image && !failedCoverIds.has(post.id);
                const isStaticPost = STATIC_BLOG_SLUGS.has(post.slug);

                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/30 transition-all duration-300 group h-full flex flex-col"
                    >
                      {/* Cover image – consistent aspect ratio, never squished */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20 shrink-0">
                        {hasCover ? (
                          <img
                            src={post.cover_image!}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            onError={() => setFailedCoverIds((prev) => new Set(prev).add(post.id))}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Icon className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${colorClass} backdrop-blur-sm`}>
                            {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                          {post.published_at && (
                            <span className="text-xs text-white/90 flex items-center gap-1 shrink-0">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-5 flex-1 flex flex-col gap-3">
                        <h2 className="text-base font-display font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs text-muted-foreground bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer row */}
                        <div className="pt-3 border-t border-border flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs text-primary font-medium group-hover:underline">Read article</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {isAdmin && !isStaticPost && (
                              <Link
                                to={`/admin/posts/${post.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 transition-colors"
                                title="Edit post"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </Link>
                            )}
                            {!isStaticPost && (
                              <>
                                <button
                                  onClick={(e) => copyPostLink(e, post)}
                                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  title="Copy link"
                                >
                                  {copiedSlug === post.slug ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link2 className="w-3.5 h-3.5" />}
                                  {copiedSlug === post.slug ? "Copied" : "Copy"}
                                </button>
                                <button
                                  onClick={(e) => regenerateShareLink(e, post)}
                                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  title="Regenerate link"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  Refresh
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center space-y-4"
          >
            <h2 className="text-2xl font-display font-bold">
              Stay Updated on <span className="gradient-text">Clean Energy</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Subscribe for insights on renewable energy, electric mobility, and sustainability in East Africa.
            </p>
            <NewsletterForm />
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
