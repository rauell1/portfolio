import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, Edit, Trash2, Eye, LogOut, FileText, 
  Calendar, Tag, Loader2, Search, LayoutDashboard, FolderOpen, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProjectsManager from "@/components/admin/ProjectsManager";
import CaseStudiesManager from "@/components/admin/CaseStudiesManager";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  tags: string[] | null;
}

type TabType = "posts" | "projects" | "case-studies";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, category, published, published_at, created_at, tags")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch posts", variant: "destructive" });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deletePostId) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", deletePostId);
    if (error) {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Post deleted successfully" });
      fetchPosts();
    }
    setDeletePostId(null);
  };

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ 
        published: !post.published,
        published_at: !post.published ? new Date().toISOString() : null
      })
      .eq("id", post.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update post", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Post ${!post.published ? "published" : "unpublished"} successfully` });
      fetchPosts();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/projects">
                <Button variant="ghost" size="sm">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  View Projects
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 bg-muted/50 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "posts"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "projects"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Projects
          </button>
          <button
            onClick={() => setActiveTab("case-studies")}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "case-studies"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Case Studies
          </button>
        </div>

        {activeTab === "projects" ? (
          <ProjectsManager />
        ) : activeTab === "case-studies" ? (
          <CaseStudiesManager />
        ) : (
          <>
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Link to="/admin/posts/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-xl p-4">
                <p className="text-3xl font-bold text-primary">{posts.length}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-3xl font-bold text-green-500">
                  {posts.filter(p => p.published).length}
                </p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-3xl font-bold text-yellow-500">
                  {posts.filter(p => !p.published).length}
                </p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-3xl font-bold text-foreground">
                  {new Set(posts.map(p => p.category)).size}
                </p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>

            {/* Posts List */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-display font-semibold">All Posts</h2>
              </div>
              
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No posts found</p>
                  <Link to="/admin/posts/new">
                    <Button className="mt-4">Create your first post</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{post.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              post.published 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </div>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {post.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => togglePublish(post)}>
                            {post.published ? "Unpublish" : "Publish"}
                          </Button>
                          <Link to={`/admin/posts/${post.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletePostId(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Delete Post Confirmation */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
