import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Search, Leaf, Zap, Wind, Link2, Check, Sun, Globe } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterForm } from "@/components/NewsletterForm";
import { STATIC_BLOG_POSTS, STATIC_BLOG_SLUGS } from "@/data/blogPosts";

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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [failedCoverIds, setFailedCoverIds] = useState<Set<string>>(new Set());

  const copyPostLink = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      const dbPosts = data || [];
      // For the three pillar slugs, always use static post so cover_image and content are always set (no icon placeholders).
      const dbExceptStatic = dbPosts.filter((p) => !STATIC_BLOG_SLUGS.has(p.slug));
      const merged = [...dbExceptStatic, ...STATIC_BLOG_POSTS].sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });
      setPosts(merged);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts(STATIC_BLOG_POSTS);
    }
    setLoading(false);
  };

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

      <main className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero + back */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                Insights on <span className="gradient-text">Clean Energy</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Thought leadership on renewable energy engineering, electric mobility infrastructure, energy systems modeling, and climate solutions in Africa.
              </p>
            </div>
            {/* Three pillars */}
            <div className="grid sm:grid-cols-3 gap-6">
              {BLOG_PILLARS.map((pillar, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 text-center sm:text-left"
                >
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                    <pillar.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground">{pillar.subtitle}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card rounded-2xl p-6 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/5 hover:bg-white/10"
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
                          : "bg-white/5 hover:bg-white/10"
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

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-48 bg-white/10 rounded-xl mb-4" />
                  <div className="h-6 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-muted-foreground">No articles found.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredPosts.map((post, index) => {
                const Icon = categoryIcons[post.category] || Leaf;
                const colorClass = categoryColors[post.category] || "bg-primary/20 text-primary";
                const hasCover = !!post.cover_image;

                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block rounded-2xl overflow-hidden border border-white/10 bg-card hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="relative h-52 overflow-hidden bg-muted/30">
                        {hasCover && !failedCoverIds.has(post.id) ? (
                          <img
                            src={post.cover_image!}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => setFailedCoverIds((prev) => new Set(prev).add(post.id))}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Icon className="w-20 h-20 text-primary/40 group-hover:text-primary/60 transition-colors" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${colorClass}`}>
                            {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                          {post.published_at && (
                            <span className="text-xs text-white/90 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-5">
                        <h2 className="text-lg font-display font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2 mt-4 flex-wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs text-primary font-medium group-hover:underline">Read article</span>
                          <button
                            onClick={(e) => copyPostLink(e, post.slug)}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            title="Copy link"
                          >
                            {copiedSlug === post.slug ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link2 className="w-3.5 h-3.5" />}
                            {copiedSlug === post.slug ? "Copied" : "Copy link"}
                          </button>
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
            className="rounded-2xl border border-white/10 bg-card p-8 md:p-10 text-center"
          >
            <h2 className="text-2xl font-display font-bold mb-3">
              Stay Updated on <span className="gradient-text">Clean Energy</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
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
