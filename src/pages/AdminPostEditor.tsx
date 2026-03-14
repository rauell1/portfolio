import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Save, Eye, Loader2, Image, Tag, 
  Calendar, FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Renewable Energy",
  "E-Mobility",
  "Sustainability",
  "Climate Tech",
  "AgriTech",
  "Clean Energy Policy",
];

const AdminPostEditor = () => {
  const { id } = useParams();
  const isEditing = id && id !== "new";
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Sustainability",
    cover_image: "",
    tags: [] as string[],
    published: false,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Post not found",
        variant: "destructive",
      });
      navigate("/admin/dashboard");
    } else {
      setPost({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content,
        category: data.category,
        cover_image: data.cover_image || "",
        tags: data.tags || [],
        published: data.published,
      });
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setPost((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async (publish = false) => {
    if (!post.title.trim() || !post.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const postData = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || null,
      content: post.content,
      category: post.category,
      cover_image: post.cover_image || null,
      tags: post.tags.length > 0 ? post.tags : null,
      published: publish ? true : post.published,
      published_at: publish ? new Date().toISOString() : null,
    };

    let result;
    if (isEditing) {
      result = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", id);
    } else {
      result = await supabase
        .from("blog_posts")
        .insert(postData);
    }

    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: publish ? "Post published!" : "Post saved as draft",
      });
      navigate("/admin/dashboard");
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-display font-bold">
                  {isEditing ? "Edit Post" : "New Post"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {post.published ? "Published" : "Draft"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSave(false)}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Draft
              </Button>
              <Button 
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  value={post.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/blog/</span>
                  <Input
                    id="slug"
                    placeholder="post-slug"
                    value={post.slug}
                    onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of your post..."
                  value={post.excerpt}
                  onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                  content={post.content}
                  onChange={(content) => setPost({ ...post, content })}
                  placeholder="Write your article here..."
                />
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-primary" />
                Category
              </div>
              <Select
                value={post.category}
                onValueChange={(value) => setPost({ ...post, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cover Image */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Image className="w-4 h-4 text-primary" />
                Cover Image
              </div>
              <Input
                placeholder="Image URL..."
                value={post.cover_image}
                onChange={(e) => setPost({ ...post, cover_image: e.target.value })}
              />
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt="Cover preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Tags */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tag className="w-4 h-4 text-primary" />
                Tags
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary/20 text-primary rounded-md text-sm flex items-center gap-1 cursor-pointer hover:bg-primary/30"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
            </div>

            {/* Status Info */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4 text-primary" />
                Status
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={post.published ? "text-green-400" : "text-yellow-400"}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminPostEditor;
