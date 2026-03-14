import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Search, Leaf, Zap, Wind } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterForm } from "@/components/NewsletterForm";

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

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Insights on <span className="gradient-text">Clean Energy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Articles and thoughts on renewable energy, electric mobility, and sustainability in East Africa.
            </p>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredPosts.map((post, index) => {
                const Icon = categoryIcons[post.category] || Leaf;
                const colorClass = categoryColors[post.category] || "bg-primary/20 text-primary";
                
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block glass-card rounded-2xl overflow-hidden card-hover group"
                    >
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-primary/50 group-hover:text-primary/80 transition-colors" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                            {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                          {post.published_at && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.published_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2 mt-4 flex-wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-muted-foreground flex items-center gap-1"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-display font-bold mb-4">
              Stay Updated on <span className="gradient-text">Clean Energy</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Subscribe to my newsletter for the latest insights on renewable energy, EV mobility, and sustainability in East Africa.
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
