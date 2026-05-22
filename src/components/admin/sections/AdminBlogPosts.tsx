import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STATIC_BLOG_POSTS } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, RefreshCw } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[] | null;
  published: boolean;
  published_at: string | null;
  share_enabled: boolean;
  share_expires_at: string | null;
  updated_at: string;
};

type PostForm = Omit<BlogPost, "id" | "updated_at" | "share_token">;

const CATEGORIES = [
  { value: "renewable-energy", label: "Renewable Energy" },
  { value: "ev-mobility", label: "EV Mobility" },
  { value: "sustainability", label: "Sustainability" },
  { value: "policy", label: "Policy" },
  { value: "technology", label: "Technology" },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyForm = (): PostForm => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: null,
  category: "renewable-energy",
  tags: [],
  published: false,
  published_at: null,
  share_enabled: false,
  share_expires_at: null,
});

export default function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPosts() {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setPosts(data as BlogPost[]);
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setSheetOpen(true);
  }

  function openEdit(p: BlogPost) {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? "",
      content: p.content,
      cover_image: p.cover_image,
      category: p.category,
      tags: p.tags ?? [],
      published: p.published,
      published_at: p.published_at,
      share_enabled: p.share_enabled,
      share_expires_at: p.share_expires_at,
    });
    setSheetOpen(true);
  }

  function setField<K extends keyof PostForm>(key: K, value: PostForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(t: string) {
    setForm((f) => ({ ...f, title: t, slug: editing ? f.slug : slugify(t) }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `covers/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("blog-covers").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("blog-covers").getPublicUrl(path);
      setField("cover_image", data.publicUrl);
      toast({ title: "Image uploaded" });
    } catch (err: unknown) {
      toast({ title: "Upload failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSave() {
    if (!supabase) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        excerpt: form.excerpt || null,
        tags: form.tags,
        published_at: form.published && !form.published_at ? new Date().toISOString() : form.published_at,
      };

      if (editing) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Post updated" });
      } else {
        const { error } = await supabase.from("blog_posts").insert([payload]);
        if (error) throw error;
        toast({ title: "Post created" });
      }
      setSheetOpen(false);
      await loadPosts();
    } catch (err: unknown) {
      toast({ title: "Save failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!supabase || !deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      toast({ title: "Deleted" });
      setDeleteTarget(null);
      await loadPosts();
    } catch (err: unknown) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  }

  async function syncStaticPosts() {
    if (!supabase) return;
    setSyncing(true);
    try {
      const payload = STATIC_BLOG_POSTS.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        cover_image: p.cover_image,
        category: p.category,
        tags: p.tags,
        published: false,
        published_at: p.published_at,
      }));
      const { error } = await supabase.from("blog_posts").upsert(payload, { onConflict: "slug" });
      if (error) throw error;
      toast({ title: "Synced", description: `${payload.length} static post(s) upserted.` });
      await loadPosts();
    } catch (err: unknown) {
      toast({ title: "Sync failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">{posts.length} posts</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={syncStaticPosts} disabled={syncing} className="gap-2">
            <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
            Sync Static
          </Button>
          <Button size="sm" onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell>
                </TableRow>
              ))
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No posts found.</TableCell>
              </TableRow>
            ) : (
              posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{p.category}</TableCell>
                  <TableCell>
                    {p.published ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">published</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(p)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Post" : "New Post"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Title</label>
              <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Slug</label>
              <Input value={form.slug} onChange={(e) => setField("slug", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Excerpt</label>
              <Textarea rows={2} value={form.excerpt ?? ""} onChange={(e) => setField("excerpt", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Content (Markdown)</label>
              <Textarea rows={10} value={form.content} onChange={(e) => setField("content", e.target.value)} className="font-mono text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Cover Image URL</label>
              <div className="flex gap-2">
                <Input
                  value={form.cover_image ?? ""}
                  onChange={(e) => setField("cover_image", e.target.value || null)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 shrink-0"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-3 w-3" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </div>
              {form.cover_image && (
                <img src={form.cover_image} alt="cover preview" className="mt-2 h-24 object-cover rounded" />
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Category</label>
              <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Tags (comma-separated)</label>
              <Input
                value={(form.tags ?? []).join(", ")}
                onChange={(e) =>
                  setField("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Published</label>
              <Switch checked={form.published} onCheckedChange={(v) => setField("published", v)} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Share Enabled</label>
              <Switch checked={form.share_enabled} onCheckedChange={(v) => setField("share_enabled", v)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Share Expires At</label>
              <Input
                type="datetime-local"
                value={form.share_expires_at ? form.share_expires_at.slice(0, 16) : ""}
                onChange={(e) => setField("share_expires_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground text-justify">
            Delete "{deleteTarget?.title}"? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
