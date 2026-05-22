import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sectors } from "@/data/portfolioProjects";
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
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

type Project = {
  id: string;
  title: string;
  slug: string | null;
  sector: string | null;
  category: string | null;
  description: string | null;
  long_description: string | null;
  role: string | null;
  icon_name: string;
  link: string | null;
  repo: string | null;
  gradient: string;
  tags: string[] | null;
  is_founder: boolean;
  is_flagship: boolean;
  status: string;
  image: string | null;
  updated_at: string;
};

type ProjectForm = Omit<Project, "id" | "updated_at">;

const emptyForm = (): ProjectForm => ({
  title: "",
  slug: "",
  sector: "clean-energy",
  category: "",
  description: "",
  long_description: "",
  role: "",
  icon_name: "Zap",
  link: "",
  repo: "",
  gradient: "from-blue-500 to-cyan-600",
  tags: [],
  is_founder: false,
  is_flagship: false,
  status: "in-progress",
  image: "",
});

function statusBadge(status: string) {
  switch (status) {
    case "live":
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">live</Badge>;
    case "in-progress":
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">in-progress</Badge>;
    case "completed":
      return <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30">completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProjects() {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setProjects(data as Project[]);
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

  function openEdit(p: Project) {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug ?? "",
      sector: p.sector ?? "clean-energy",
      category: p.category ?? "",
      description: p.description ?? "",
      long_description: p.long_description ?? "",
      role: p.role ?? "",
      icon_name: p.icon_name,
      link: p.link ?? "",
      repo: p.repo ?? "",
      gradient: p.gradient,
      tags: p.tags ?? [],
      is_founder: p.is_founder,
      is_flagship: p.is_flagship,
      status: p.status,
      image: p.image ?? "",
    });
    setSheetOpen(true);
  }

  async function handleSave() {
    if (!supabase) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || null,
        category: form.category || null,
        description: form.description || null,
        long_description: form.long_description || null,
        role: form.role || null,
        link: form.link || null,
        repo: form.repo || null,
        image: form.image || null,
        tags: form.tags,
      };

      if (editing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Project updated" });
      } else {
        const { error } = await supabase.from("projects").insert([{ ...payload, project_type: "portfolio" }]);
        if (error) throw error;
        toast({ title: "Project created" });
      }
      setSheetOpen(false);
      await loadProjects();
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
      const { error } = await supabase.from("projects").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      toast({ title: "Deleted", description: `"${deleteTarget.title}" removed.` });
      setDeleteTarget(null);
      await loadProjects();
    } catch (err: unknown) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  }

  function setField<K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const sectorOptions = sectors.filter((s) => s.value !== "all");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{projects.length} projects</p>
        <Button size="sm" onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Sector</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Flagship</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell>
                </TableRow>
              ))
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{p.sector}</TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {p.is_flagship && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">flagship</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      )}
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

      {/* Edit / Create Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Project" : "New Project"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Title</label>
              <Input value={form.title} onChange={(e) => setField("title", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Slug</label>
              <Input value={form.slug ?? ""} onChange={(e) => setField("slug", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Sector</label>
              <Select value={form.sector ?? ""} onValueChange={(v) => setField("sector", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sectorOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Category</label>
              <Input value={form.category ?? ""} onChange={(e) => setField("category", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Description</label>
              <Textarea rows={3} value={form.description ?? ""} onChange={(e) => setField("description", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Long Description</label>
              <Textarea rows={5} value={form.long_description ?? ""} onChange={(e) => setField("long_description", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Role</label>
              <Input value={form.role ?? ""} onChange={(e) => setField("role", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Icon Name</label>
              <Input value={form.icon_name} onChange={(e) => setField("icon_name", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Live URL</label>
              <Input value={form.link ?? ""} onChange={(e) => setField("link", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Repo URL</label>
              <Input value={form.repo ?? ""} onChange={(e) => setField("repo", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Gradient classes</label>
              <Input value={form.gradient} onChange={(e) => setField("gradient", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Tags (comma-separated)</label>
              <Input
                value={(form.tags ?? []).join(", ")}
                onChange={(e) => setField("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Image URL</label>
              <Input value={form.image ?? ""} onChange={(e) => setField("image", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Status</label>
              <Select value={form.status} onValueChange={(v) => setField("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Is Founder Project</label>
              <Switch checked={form.is_founder} onCheckedChange={(v) => setField("is_founder", v)} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Is Flagship</label>
              <Switch checked={form.is_flagship} onCheckedChange={(v) => setField("is_flagship", v)} />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground text-justify">
            Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
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
