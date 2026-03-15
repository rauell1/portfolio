import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Share2, Leaf, Zap, Wind, Link2, Check } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getStaticPostBySlug, STATIC_BLOG_SLUGS } from "@/data/blogPosts";

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

function ArticleImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`rounded-xl border border-border bg-muted/20 flex items-center justify-center ${className || ""}`} style={{ minHeight: 240 }}>
        <span className="text-sm text-muted-foreground">Image unavailable</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [coverImageFailed, setCoverImageFailed] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }
    // For static pillar posts, always use static content so images and formatting are always correct
    const staticPost = getStaticPostBySlug(slug);
    if (STATIC_BLOG_SLUGS.has(slug) && staticPost) {
      setPost(staticPost);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (data) {
      setPost(data);
    } else if (staticPost) {
      setPost(staticPost);
    } else {
      if (error) console.error("Error fetching post:", error);
      navigate("/blog");
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
      copyPostLink();
    }
  };

  const copyPostLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
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

  // Parse markdown-like content: headings, lists, images, paragraphs. Supports ![alt](url) with any url (https or /path).
  const renderContent = (content: string) => {
    if (!content || typeof content !== "string") return null;
    const normalized = content.replace(/\\n/g, "\n").trim();
    const imageRegex = /^!\[([^\]]*)\]\(([^)]+)\)$/;
    const blocks = normalized.split(/\n\n+/);
    const out: React.ReactNode[] = [];
    let key = 0;
    for (const block of blocks) {
      const trimmed = block.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("## ")) {
        out.push(
          <h2 key={key++} className="text-2xl font-display font-bold mt-10 mb-4 text-primary">
            {trimmed.replace("## ", "")}
          </h2>
        );
        continue;
      }
      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").filter((item) => item.startsWith("- "));
        out.push(
          <ul key={key++} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
            {items.map((item, i) => (
              <li key={i}>{item.replace("- ", "")}</li>
            ))}
          </ul>
        );
        continue;
      }
      // Block may be a single image, multiple image lines, or paragraph(s). Process line by line.
      const lines = trimmed.split("\n");
      let paraLines: string[] = [];
      const flushPara = () => {
        if (paraLines.length) {
          out.push(
            <p key={key++} className="text-muted-foreground leading-relaxed mb-4">
              {paraLines.join("\n")}
            </p>
          );
          paraLines = [];
        }
      };
      for (const line of lines) {
        const lineTrim = line.trim();
        const imgMatch = lineTrim.match(imageRegex);
        if (imgMatch) {
          flushPara();
          out.push(
            <figure key={key++} className="my-8">
              <ArticleImage
                src={imgMatch[2]}
                alt={imgMatch[1] || ""}
                className="w-full rounded-xl border border-border object-cover max-h-[420px]"
              />
              {imgMatch[1] && (
                <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                  {imgMatch[1]}
                </figcaption>
              )}
            </figure>
          );
        } else if (lineTrim) {
          paraLines.push(lineTrim);
        }
      }
      flushPara();
    }
    return out;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6">
        <article className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Cover image first (hero) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-2xl overflow-hidden border border-border mb-8 shadow-xl"
          >
            {post.cover_image && !coverImageFailed ? (
              <img
                src={post.cover_image}
                alt=""
                className="w-full aspect-[21/9] sm:aspect-[2/1] object-cover"
                loading="eager"
                decoding="async"
                onError={() => setCoverImageFailed(true)}
              />
            ) : (
              <div className="w-full aspect-[21/9] sm:aspect-[2/1] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Icon className="w-20 h-20 text-primary/40" />
              </div>
            )}
          </motion.div>

          {/* Title and meta */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-sm font-medium flex items-center gap-2 border border-primary/20">
                <Icon className="w-4 h-4" />
                {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
              {post.published_at && (
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose dark:prose-invert max-w-none"
          >
            {renderContent(post.content)}
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-2 flex-wrap mt-8 pt-8 border-t border-border"
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-sm text-muted-foreground flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Share & Copy link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              onClick={sharePost}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share this article
            </button>
            <button
              onClick={copyPostLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Link copied!
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Copy link
                </>
              )}
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
