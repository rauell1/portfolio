import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STATIC_BLOG_POSTS, type StaticBlogPost } from "@/data/blogPosts";

export type BlogPost = StaticBlogPost;

interface UseBlogPostsResult {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

export function useBlogPosts(): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      if (!supabase) {
        setPosts(STATIC_BLOG_POSTS);
        setLoading(false);
        return;
      }

      try {
        const { data, error: sbError } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, content, cover_image, category, tags, published_at, created_at")
          .eq("published", true)
          .order("published_at", { ascending: false });

        if (cancelled) return;
        if (sbError) throw sbError;

        if (data && data.length > 0) {
          setPosts(data as BlogPost[]);
        } else {
          setPosts(STATIC_BLOG_POSTS);
        }
      } catch (err) {
        if (cancelled) return;
        console.warn("[useBlogPosts] fallback to static:", err);
        setPosts(STATIC_BLOG_POSTS);
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { posts, loading, error };
}
