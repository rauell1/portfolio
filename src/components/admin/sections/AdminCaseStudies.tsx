import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  location: string | null;
  date: string | null;
  role: string | null;
  partner: string | null;
  image: string | null;
  is_flagship: boolean;
  published: boolean;
  gradient: string;
  icon_name: string;
  sort_order: number | null;
  sections: Json;
  metrics: Json;
  updated_at: string;
};

type CaseStudyForm = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  date: string;
  role: string;
  partner: string;
  image: string;
  is_flagship: boolean;
  published: boolean;
  gradient: string;
  icon_name: string;
  sort_order: string;
  sections_json: string;
  metrics_json: string;
};

const emptyForm = (): CaseStudyForm => ({
  slug: "",
  title: "",
  subtitle: "",
  category: "",
  location: "",
  date: "",
  role: "",
  partner: "",
  image: "",
  is_flagship: false,
  published: false,
  gradient: "from-blue-500 to-cyan-600",
  icon_name: "BookOpen",
  sort_order: "",
  sections_json: "[]",
  metrics_json: "{}",
});

export default function AdminCaseStudies() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [form, setForm] = useState<CaseStudyForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadItems() {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setItems(data as CaseStudy[]);
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

  function openEdit(c: CaseStudy) {
    setEditing(c);
    setForm({
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle ?? "",
      category: c.category,
      location: c.location ?? "",
      date: c.date ?? "",
      role: c.role ?? "",
      partner: c.partner ?? "",
      image: c.image ?? "",
      is_flagship: c.is_flagship,
      published: c.published,
      gradient: c.gradient,
      icon_name: c.icon_name,
      sort_order: c.sort_order != null ? String(c.sort_order) : "",
      sections_json: JSON.stringify(c.sections, null, 2),
      metrics_json: JSON.stringify(c.metrics, null, 2),
    });
    setSheetOpen(true);
  }

  function setField<K extends keyof CaseStudyForm>(key: K, value: CaseStudyForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!supabase) return;
    setSaving(true);
    try {
      let parsedSections: Json;
      let parsedMetrics: Json;
      try {
        parsedSections = JSON.parse(form.sections_json) as Json;
        parsedMetrics = JSON.parse(form.metrics_json) as Json;
      } catch {
        toast({ title: "Invalid JSON", description: "Sections or metrics JSON is malformed.", variant: "destructive" });
        setSaving(false);
        return;
      }

      const payload = {
        slug: form.slug,
        title: form.title,
        subtitle: form.subtitle || null,
        category: form.category,
        location: form.location || null,
        date: form.date || null,
        role: form.role || null,
        partner: form.partner || null,
        image: form.image || null,
        is_flagship: form.is_flagship,
        published: form.published,
        gradient: form.gradient,
        icon_name: form.icon_name,
        sort_order: form.sort_order ? parseInt(form.sort_order, 10) : null,
        sections: parsedSections,
        metrics: parsedMetrics,
      };

      if (editing) {
        const { error } = await supabase.from("case_studies").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Case study updated" });
      } else {
        const { error } = await supabase.from("case_studies").insert([payload]);
        if (error) throw error;
        toast({ title: "Case study created" });
      }
      setSheetOpen(false);
      await loadItems();
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
      const { error } = await supabase.from("case_studies").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      toast({ title: "Deleted" });
      setDeleteTarget(null);
      await loadItems();
    } catch (err: unknown) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  }

  function formatJson(key: "sections_json" | "metrics_json") {
    try {
      const parsed = JSON.parse(form[key]);
      setField(key, JSON.stringify(parsed, null, 2));
    } catch {
      toast({ title: "Invalid JSON", description: "Cannot format - JSON is malformed.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} case studies</p>
        <Button size="sm" onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Case Study
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Flagship</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="hidden sm:table-cell">Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No case studies found.</TableCell>
              </TableRow>
            ) : (
              items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium max-w-[180px] truncate">{c.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{c.category}</TableCell>
                  <TableCell>
                    {c.is_flagship && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">flagship</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {c.published ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">published</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {c.sort_order ?? "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(c)}
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
            <SheetTitle>{editing ? "Edit Case Study" : "New Case Study"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            {(["title", "slug", "subtitle", "category", "location", "date", "role", "partner", "image", "gradient", "icon_name"] as const).map((key) => (
              <div key={key} className="space-y-1">
                <label className="text-xs font-medium capitalize">{key.replace("_", " ")}</label>
                <Input value={form[key] as string} onChange={(e) => setField(key, e.target.value)} />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-xs font-medium">Sort Order</label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setField("sort_order", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Is Flagship</label>
              <Switch checked={form.is_flagship} onCheckedChange={(v) => setField("is_flagship", v)} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Published</label>
              <Switch checked={form.published} onCheckedChange={(v) => setField("published", v)} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">Sections (JSON)</label>
                <Button size="sm" variant="ghost" className="text-xs h-6 px-2" onClick={() => formatJson("sections_json")}>
                  Format JSON
                </Button>
              </div>
              <Textarea
                rows={6}
                value={form.sections_json}
                onChange={(e) => setField("sections_json", e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">Metrics (JSON)</label>
                <Button size="sm" variant="ghost" className="text-xs h-6 px-2" onClick={() => formatJson("metrics_json")}>
                  Format JSON
                </Button>
              </div>
              <Textarea
                rows={4}
                value={form.metrics_json}
                onChange={(e) => setField("metrics_json", e.target.value)}
                className="font-mono text-xs"
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
            <DialogTitle>Delete Case Study</DialogTitle>
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
