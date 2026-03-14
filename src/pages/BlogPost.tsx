import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Share2, Leaf, Zap, Wind } from "lucide-react";
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

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) {
      console.error("Error fetching post:", error);
      navigate("/blog");
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const Icon = categoryIcons[post.category] || Leaf;

  // Parse markdown-like content (basic)
  const renderContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-display font-bold mt-8 mb-4 text-primary">
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n").filter((item) => item.startsWith("- "));
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
            {items.map((item, i) => (
              <li key={i}>{item.replace("- ", "")}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-12 px-6">
        <article className="max-w-3xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
              {post.published_at && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            )}
          </motion.header>

          {/* Cover Image or Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl h-64 flex items-center justify-center mb-8"
          >
            <Icon className="w-24 h-24 text-primary/50" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-invert max-w-none"
          >
            {renderContent(post.content)}
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-2 flex-wrap mt-8 pt-8 border-t border-white/10"
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/5 text-sm text-muted-foreground flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <button
              onClick={sharePost}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share this article
            </button>
          </motion.div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card rounded-2xl p-8 text-center mt-16"
          >
            <h2 className="text-2xl font-display font-bold mb-4">
              Enjoyed this article?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Subscribe to get more insights on renewable energy and sustainability.
            </p>
            <NewsletterForm />
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
