import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Clock } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

type PageSection = {
  id: string;
  page: string;
  section: string;
  content: Json;
  sort_order: number | null;
  updated_at: string;
};

export default function AdminPageSections() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageSection | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSections() {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setSections(data as PageSection[]);
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function openEdit(s: PageSection) {
    setEditing(s);
    setJsonText(JSON.stringify(s.content, null, 2));
  }

  function formatJson() {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch {
      toast({ title: "Invalid JSON", description: "Cannot format - JSON is malformed.", variant: "destructive" });
    }
  }

  async function handleSave() {
    if (!supabase || !editing) return;
    setSaving(true);
    try {
      let parsed: Json;
      try {
        parsed = JSON.parse(jsonText) as Json;
      } catch {
        toast({ title: "Invalid JSON", description: "Fix the JSON before saving.", variant: "destructive" });
        setSaving(false);
        return;
      }
      const { error } = await supabase
        .from("page_sections")
        .update({ content: parsed })
        .eq("id", editing.id);
      if (error) throw error;
      toast({ title: "Section updated", description: `"${editing.section}" saved.` });
      setEditing(null);
      await loadSections();
    } catch (err: unknown) {
      toast({ title: "Save failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-justify">
        No page sections found. Check your database.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{sections.length} sections</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((s) => {
          const keys = typeof s.content === "object" && s.content !== null
            ? Object.keys(s.content as Record<string, unknown>).slice(0, 4)
            : [];
          return (
            <Card key={s.id} className="glass-card">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-sm capitalize">{s.section}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">page: {s.page}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => openEdit(s)}>
                  <Pencil className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {keys.length > 0 && (
                  <p className="text-xs text-muted-foreground font-mono">
                    {keys.join(", ")}{keys.length < Object.keys(s.content as Record<string, unknown>).length ? ", ..." : ""}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Updated {new Date(s.updated_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Sheet */}
      <Sheet open={!!editing} onOpenChange={(o) => { if (!o) setEditing(null); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="capitalize">Edit - {editing?.section}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Content (JSON)</label>
              <Button size="sm" variant="ghost" className="text-xs h-6 px-2" onClick={formatJson}>
                Format JSON
              </Button>
            </div>
            <Textarea
              rows={20}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="font-mono text-xs"
            />
            {editing && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last updated: {new Date(editing.updated_at).toLocaleString()}
              </p>
            )}
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
