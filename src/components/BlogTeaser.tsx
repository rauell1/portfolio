import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const FALLBACK: Post[] = [
  {
    id: "ev-grid-east-africa",
    title: "Why East Africa's Grid Isn't Ready for EVs — And What We Can Do About It",
    excerpt:
      "With EV adoption accelerating in Nairobi, the strain on an aging national grid raises urgent questions. This piece explores hybrid solar-grid architectures that could bridge the gap.",
    date: "Mar 2026",
    readTime: "6 min",
    category: "E-Mobility",
  },
  {
    id: "second-life-batteries",
    title: "Second-Life EV Batteries: Opportunity or Liability for Africa's Energy Transition?",
    excerpt:
      "Repurposed EV batteries are reaching African markets before robust regulatory frameworks exist. A look at the economics, safety standards, and who is getting it right.",
    date: "Feb 2026",
    readTime: "5 min",
    category: "Energy Storage",
  },
];

export const BlogTeaser = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [posts, setPosts] = useState<Post[]>(FALLBACK);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("blog_posts")
      .select("id, title, excerpt, published_at, category, read_time")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(2)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setPosts(
            data.map((p) => ({
              id: p.id,
              title: p.title,
              excerpt: p.excerpt || "",
              date: p.published_at
                ? new Date(p.published_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                : "",
              readTime: p.read_time ? `${p.read_time} min` : "5 min",
              category: p.category || "Insights",
            }))
          );
        }
      });
  }, []);

  return (
    <section id="blog" className="py-16 sm:py-20 px-6 relative" ref={ref}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-primary font-medium mb-2 block text-sm">Thoughts &amp; Insights</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              From the <span className="gradient-text">Blog</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
          >
            All articles <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Article cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <Link
                to="/blog"
                className="group glass-card rounded-2xl p-6 flex flex-col h-full card-hover"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-base font-display font-bold mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime} read
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-center sm:hidden"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <BookOpen className="w-4 h-4" /> View all articles
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
