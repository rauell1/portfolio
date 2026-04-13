import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Tag, Calendar, FileText, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAdminEmail } from "@/lib/config";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[] | null;
  published: boolean;
  published_at: string | null;
}

const emptyPost: BlogPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "renewable-energy",
  tags: [],
  published: true,
  published_at: null,
};

const AdminPostEditor = () => {
  const { id } = useParams();
  const isEditing = !!id && id !== "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [post, setPost] = useState<BlogPost>(emptyPost);
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    if (!isEditing) return;
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        setError("Could not load post for editing.");
      } else {
        setPost({
          id: data.id,
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          cover_image: data.cover_image ?? "",
          category: data.category ?? "renewable-energy",
          tags: data.tags ?? [],
          published: data.published ?? true,
          published_at: data.published_at,
        });
      }
      setLoading(false);
    };
    fetchPost();
  }, [id, isEditing]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-display font-bold mb-2">Not authorized</h1>
          <p className="text-muted-foreground mb-4 text-sm">
            This page is restricted to the site owner. Please sign in as admin to continue.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
          >
            Go to admin login
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof BlogPost, value: BlogPost[keyof BlogPost]) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!post.title || !post.slug || !post.content) {
      setError("Title, slug, and content are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: Omit<BlogPost, "id"> & { published_at?: string } = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        cover_image: post.cover_image,
        category: post.category,
        tags: post.tags,
        published: post.published,
        published_at: post.published_at,
      };

      if (post.published && !post.published_at) {
        payload.published_at = new Date().toISOString();
      }

      let result;
      if (isEditing && post.id) {
        result = await supabase.from("blog_posts").update(payload).eq("id", post.id);
      } else {
        result = await supabase.from("blog_posts").insert(payload);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Post saved",
        description: "Your changes have been saved to the backend.",
      });

      navigate("/blog");
    } catch (err: unknown) {
      console.error("Error saving post:", err);
      setError("Failed to save post. Please try again.");
      toast({
        title: "Error",
        description: "Failed to save post.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const tagsString = (post.tags || []).join(", ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center justify-between"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <span className="text-xs text-muted-foreground">
              {isEditing ? "Edit blog post" : "Create blog post"}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl p-6 space-y-5"
          >
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="title"
                      value={post.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={post.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="ev-charging-infrastructure-building-for-tomorrow"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in the URL: <span className="font-mono">/blog/{post.slug || "your-slug"}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={post.excerpt ?? ""}
                    onChange={(e) => handleChange("excerpt", e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Short summary shown in the blog listing.
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cover">Cover image URL</Label>
                  <Input
                    id="cover"
                    value={post.cover_image ?? ""}
                    onChange={(e) => handleChange("cover_image", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={post.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      placeholder="renewable-energy | ev-mobility | sustainability"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="relative">
                      <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="tags"
                        value={tagsString}
                        onChange={(e) =>
                          handleChange(
                            "tags",
                            e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean)
                          )
                        }
                        className="pl-9"
                        placeholder="solar, microgrids, africa"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="content">Content (supports basic markdown)</Label>
                  <Textarea
                    id="content"
                    value={post.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    rows={14}
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Use markdown-style headings, lists, and images (e.g. <span className="font-mono">![alt](/images/roam-electric.webp)</span>).
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={post.published}
                      onChange={(e) => handleChange("published", e.target.checked)}
                      className="rounded border-border"
                    />
                    <span>Published</span>
                  </label>

                  <Button type="button" onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Post
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPostEditor;

