import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit, Trash2, Loader2, Search, MapPin,
  Calendar, BookOpen, Star, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface CaseStudySection {
  heading: string;
  content: string;
}

interface CaseStudyMetric {
  label: string;
  value: string;
  icon_name: string;
}

interface CaseStudy {
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
  pdf_download: string | null;
  is_flagship: boolean;
  published: boolean;
  sections: CaseStudySection[];
  metrics: CaseStudyMetric[];
  gradient: string;
  icon_name: string;
  sort_order: number | null;
  created_at: string;
}

type EditingCaseStudy = Partial<Omit<CaseStudy, "sections" | "metrics">> & {
  sections?: CaseStudySection[];
  metrics?: CaseStudyMetric[];
};

const gradientOptions = [
  { value: "from-blue-500 to-cyan-400", label: "Blue → Cyan" },
  { value: "from-amber-500 to-orange-600", label: "Amber → Orange" },
  { value: "from-indigo-500 to-purple-500", label: "Indigo → Purple" },
  { value: "from-orange-500 to-yellow-400", label: "Orange → Yellow" },
  { value: "from-green-500 to-teal-400", label: "Green → Teal" },
  { value: "from-rose-500 to-pink-500", label: "Rose → Pink" },
];

const iconOptions = ["Zap", "Sun", "Battery", "BarChart3", "TrendingUp", "MapPin", "Leaf", "Shield"];

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CaseStudiesManager = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingCaseStudy>({});
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    setLoading(true);
    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase connection not configured. Please check environment variables.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch case studies", variant: "destructive" });
    } else {
      const parsed = (data || []).map((cs: Tables<"case_studies">) => ({
        ...cs,
        sections: Array.isArray(cs.sections) ? (cs.sections as CaseStudySection[]) : [],
        metrics: Array.isArray(cs.metrics) ? (cs.metrics as CaseStudyMetric[]) : [],
      }));
      setCaseStudies(parsed);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditing({
      title: "",
      subtitle: "",
      category: "sustainability",
      location: "",
      date: "",
      role: "",
      partner: "",
      image: "",
      pdf_download: "",
      is_flagship: false,
      published: true,
      sections: [{ heading: "", content: "" }],
      metrics: [{ label: "", value: "", icon_name: "Zap" }],
      gradient: "from-blue-500 to-cyan-400",
      icon_name: "Zap",
    });
    setExpandedSections(false);
    setIsEditModalOpen(true);
  };

  const handleEdit = (cs: CaseStudy) => {
    setEditing({
      ...cs,
      sections: cs.sections.length > 0 ? cs.sections : [{ heading: "", content: "" }],
      metrics: cs.metrics.length > 0 ? cs.metrics : [{ label: "", value: "", icon_name: "Zap" }],
    });
    setExpandedSections(false);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editing.title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase connection not configured.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const slug = editing.slug || slugify(editing.title);
      const payload = {
        slug,
        title: editing.title,
        subtitle: editing.subtitle || null,
        category: editing.category || "sustainability",
        location: editing.location || null,
        date: editing.date || null,
        role: editing.role || null,
        partner: editing.partner || null,
        image: editing.image || null,
        pdf_download: editing.pdf_download || null,
        is_flagship: editing.is_flagship ?? false,
        published: editing.published ?? true,
        sections: (editing.sections || []).filter(s => s.heading || s.content),
        metrics: (editing.metrics || []).filter(m => m.label || m.value),
        gradient: editing.gradient || "from-blue-500 to-cyan-400",
        icon_name: editing.icon_name || "Zap",
        sort_order: editing.sort_order ?? null,
      };

      if (editing.id) {
        const { error } = await supabase.from("case_studies").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Success", description: "Case study updated successfully" });
      } else {
        const { error } = await supabase.from("case_studies").insert(payload);
        if (error) throw error;
        toast({ title: "Success", description: "Case study created successfully" });
      }

      await fetchCaseStudies();
      setIsEditModalOpen(false);
      setEditing({});
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save case study", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase connection not configured.",
        variant: "destructive"
      });
      setDeleteId(null);
      return;
    }

    try {
      const { error } = await supabase.from("case_studies").delete().eq("id", deleteId);
      if (error) throw error;
      toast({ title: "Success", description: "Case study deleted successfully" });
      await fetchCaseStudies();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete case study", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublish = async (cs: CaseStudy) => {
    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase connection not configured.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from("case_studies")
      .update({ published: !cs.published })
      .eq("id", cs.id);
    if (error) {
      toast({ title: "Error", description: "Failed to update case study", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Case study ${!cs.published ? "published" : "unpublished"}` });
      fetchCaseStudies();
    }
  };

  // Section helpers
  const addSection = () =>
    setEditing(prev => ({ ...prev, sections: [...(prev.sections || []), { heading: "", content: "" }] }));
  const removeSection = (i: number) =>
    setEditing(prev => ({ ...prev, sections: (prev.sections || []).filter((_, idx) => idx !== i) }));
  const updateSection = (i: number, field: "heading" | "content", value: string) =>
    setEditing(prev => {
      const sections = [...(prev.sections || [])];
      sections[i] = { ...sections[i], [field]: value };
      return { ...prev, sections };
    });

  // Metric helpers
  const addMetric = () =>
    setEditing(prev => ({ ...prev, metrics: [...(prev.metrics || []), { label: "", value: "", icon_name: "Zap" }] }));
  const removeMetric = (i: number) =>
    setEditing(prev => ({ ...prev, metrics: (prev.metrics || []).filter((_, idx) => idx !== i) }));
  const updateMetric = (i: number, field: keyof CaseStudyMetric, value: string) =>
    setEditing(prev => {
      const metrics = [...(prev.metrics || [])];
      metrics[i] = { ...metrics[i], [field]: value };
      return { ...prev, metrics };
    });

  const filtered = caseStudies.filter(cs =>
    cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cs.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search case studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          New Case Study
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-primary">{caseStudies.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-green-500">{caseStudies.filter(cs => cs.published).length}</p>
          <p className="text-sm text-muted-foreground">Published</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-yellow-500">{caseStudies.filter(cs => !cs.published).length}</p>
          <p className="text-sm text-muted-foreground">Drafts</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-amber-500">{caseStudies.filter(cs => cs.is_flagship).length}</p>
          <p className="text-sm text-muted-foreground">Flagship</p>
        </div>
      </div>

      {/* Case Studies List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold">All Case Studies</h2>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No case studies found</p>
            <Button className="mt-4" onClick={handleAdd}>Create your first case study</Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((cs, index) => (
              <motion.div
                key={cs.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Thumbnail */}
                    <div className={`w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br ${cs.gradient} flex-shrink-0 flex items-center justify-center`}>
                      {cs.image ? (
                        <img src={cs.image} alt={cs.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-white/80" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium truncate">{cs.title}</h3>
                        {cs.is_flagship && (
                          <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          cs.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {cs.published ? "Published" : "Draft"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                          {cs.category}
                        </span>
                      </div>
                      {cs.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{cs.subtitle}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {cs.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cs.location}
                          </span>
                        )}
                        {cs.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {cs.date}
                          </span>
                        )}
                        <span>{cs.sections.length} sections</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(cs)}>
                      {cs.published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cs)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(cs.id)}
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

      {/* Edit/Add Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {editing.id ? "Edit Case Study" : "Add New Case Study"}
            </DialogTitle>
            <DialogDescription>Fill in the details for your case study.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="cs-title">Title *</Label>
              <Input
                id="cs-title"
                value={editing.title || ""}
                onChange={(e) => setEditing(prev => ({ ...prev, title: e.target.value, slug: slugify(e.target.value) }))}
                placeholder="e.g., Solar Microgrid Integration for EV Charging"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cs-subtitle">Subtitle</Label>
              <Input
                id="cs-subtitle"
                value={editing.subtitle || ""}
                onChange={(e) => setEditing(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g., Renewable energy integration for sustainable charging operations"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cs-category">Category</Label>
                <Input
                  id="cs-category"
                  value={editing.category || ""}
                  onChange={(e) => setEditing(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., E-Mobility Infrastructure"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cs-location">Location</Label>
                <Input
                  id="cs-location"
                  value={editing.location || ""}
                  onChange={(e) => setEditing(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Nairobi, Kenya"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cs-date">Date / Period</Label>
                <Input
                  id="cs-date"
                  value={editing.date || ""}
                  onChange={(e) => setEditing(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="e.g., 2024-2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cs-partner">Partner</Label>
                <Input
                  id="cs-partner"
                  value={editing.partner || ""}
                  onChange={(e) => setEditing(prev => ({ ...prev, partner: e.target.value }))}
                  placeholder="e.g., Roam Electric"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cs-role">Your Role</Label>
              <Input
                id="cs-role"
                value={editing.role || ""}
                onChange={(e) => setEditing(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Product Owner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cs-image">Cover Image URL</Label>
              <Input
                id="cs-image"
                value={editing.image || ""}
                onChange={(e) => setEditing(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://... or /images/filename.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cs-pdf">PDF Download URL (optional)</Label>
              <Input
                id="cs-pdf"
                value={editing.pdf_download || ""}
                onChange={(e) => setEditing(prev => ({ ...prev, pdf_download: e.target.value }))}
                placeholder="/filename.pdf"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cs-gradient">Color Gradient</Label>
                <select
                  id="cs-gradient"
                  value={editing.gradient || "from-blue-500 to-cyan-400"}
                  onChange={(e) => setEditing(prev => ({ ...prev, gradient: e.target.value }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {gradientOptions.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cs-icon">Icon</Label>
                <select
                  id="cs-icon"
                  value={editing.icon_name || "Zap"}
                  onChange={(e) => setEditing(prev => ({ ...prev, icon_name: e.target.value }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_flagship ?? false}
                  onChange={(e) => setEditing(prev => ({ ...prev, is_flagship: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">Flagship case study</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.published ?? true}
                  onChange={(e) => setEditing(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">Published</span>
              </label>
            </div>

            {/* Sections */}
            <div className="space-y-3 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Sections</Label>
                <button
                  type="button"
                  onClick={() => setExpandedSections(v => !v)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {expandedSections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {expandedSections ? "Collapse" : "Expand"}
                </button>
              </div>

              {(editing.sections || []).map((section, i) => (
                <div key={i} className={`space-y-2 ${!expandedSections && i > 0 ? "hidden" : ""}`}>
                  <div className="flex items-center gap-2">
                    <Input
                      value={section.heading}
                      onChange={(e) => updateSection(i, "heading", e.target.value)}
                      placeholder={`Section ${i + 1} heading`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSection(i)}
                      className="text-destructive hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSection(i, "content", e.target.value)}
                    placeholder="Section content..."
                    rows={4}
                  />
                </div>
              ))}

              {!expandedSections && (editing.sections || []).length > 1 && (
                <p className="text-xs text-muted-foreground">
                  +{(editing.sections || []).length - 1} more section(s) — click Expand to edit all
                </p>
              )}

              <Button type="button" variant="outline" size="sm" onClick={addSection} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>

            {/* Metrics */}
            <div className="space-y-3 border border-border rounded-lg p-4">
              <Label className="text-base font-semibold">Metrics</Label>
              {(editing.metrics || []).map((metric, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                  <Input
                    value={metric.label}
                    onChange={(e) => updateMetric(i, "label", e.target.value)}
                    placeholder="Label (e.g., Solar Capacity)"
                  />
                  <Input
                    value={metric.value}
                    onChange={(e) => updateMetric(i, "value", e.target.value)}
                    placeholder="Value (e.g., 50 kW)"
                  />
                  <div className="flex gap-1">
                    <select
                      value={metric.icon_name}
                      onChange={(e) => updateMetric(i, "icon_name", e.target.value)}
                      className="flex-1 h-10 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMetric(i)}
                      className="text-destructive hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addMetric} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Metric
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  "Save Case Study"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Case Study</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this case study? This action cannot be undone.
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
    </>
  );
};

export default CaseStudiesManager;
