import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Plus, Image, Calendar, MapPin,
  Edit, Trash2, Loader2, Upload, ExternalLink, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  project_type: string;
  images: string[] | null;
  completed_at: string | null;
  created_at: string;
  slug?: string | null;
}

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

// ─── Fallback static project cards (shown only when not yet in DB) ────────────
const ROAM_POINT_PROJECT: Project = {
  id: "roam-point",
  slug: "roam-point",
  title: "Roam Point EV Charging Infrastructure",
  description:
    "Distributed fast-charging infrastructure designed to accelerate electric motorcycle adoption across African cities by providing accessible, high-speed charging hubs.",
  location: "Nairobi, Kenya",
  project_type: "ev",
  images: [
    "/images/roam-electric.webp",
    "/images/roam-charger-1.jpeg",
    "/images/roam-charger-2.jpeg",
    "/images/roam-charger-3.jpeg",
    "/images/roam-charger-4.jpeg",
  ],
  completed_at: null,
  created_at: "",
};

const SAFARICHARGE_PROJECT: Project = {
  id: "safaricharge-platform",
  slug: "safaricharge-platform",
  title: "SafariCharge Platform Development",
  description:
    "End-to-end platform work on SafariCharge — clean mobility product architecture, web experience, and operational tooling for EV charging deployment workflows.",
  location: "Nairobi, Kenya",
  project_type: "ev",
  images: ["/images/og-image.png"],
  completed_at: null,
  created_at: "",
};

// ─── Deep-link map: slug → { caseStudy, blogDraft, repo } ────────────────────
// Add any project slug here to wire up "View Case Study →" buttons.
const PROJECT_DEEP_LINKS: Record<
  string,
  { caseStudy?: string; blogDraft?: string; repo?: string }
> = {
  "roam-point": {
    caseStudy: "/case-studies?study=roam-point-deployment",
  },
  "safaricharge-platform": {
    caseStudy: "/case-studies?study=safaricharge-platform",
    blogDraft: "/admin/posts/new?template=safaricharge",
    repo: "https://github.com/rauell1/safaricharge",
  },
};

const projectTypes = [
  { value: "solar", label: "Solar Installation" },
  { value: "ev", label: "EV Charging" },
  { value: "microgrid", label: "Microgrid" },
  { value: "biogas", label: "Biogas" },
  { value: "storage", label: "Energy Storage" },
  { value: "other", label: "Other" },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = isAdminEmail(user?.email);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects((data as Project[]) || []);
    } catch (error: unknown) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = () => {
    setEditingProject({
      title: "",
      description: "",
      location: "",
      project_type: "solar",
      images: [],
      completed_at: null,
    });
    setIsEditModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [...(editingProject.images || [])];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("project-images").getPublicUrl(fileName);

        newImages.push(publicUrl);
      }

      setEditingProject((prev) => ({ ...prev, images: newImages }));
      toast({ title: "Success", description: "Images uploaded successfully" });
    } catch (error: unknown) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images. Make sure you're logged in as admin.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setEditingProject((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSaveProject = async () => {
    if (!editingProject.title || !editingProject.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: editingProject.title,
        description: editingProject.description,
        location: editingProject.location,
        project_type: editingProject.project_type || "solar",
        images: editingProject.images || [],
        completed_at: editingProject.completed_at,
      };

      if (editingProject.id) {
        let query = supabase.from("projects").update(payload);
        if (isUuid(editingProject.id)) {
          query = query.eq("id", editingProject.id);
        } else {
          query = query.eq("slug", editingProject.slug || editingProject.id);
        }
        const { error } = await query;
        if (error) throw error;
        toast({ title: "Success", description: "Project updated successfully" });
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        toast({ title: "Success", description: "Project created successfully" });
      }

      await fetchProjects();
      setIsEditModalOpen(false);
      setEditingProject({});
    } catch (error: unknown) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save project. Make sure you're logged in as admin.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    try {
      let query = supabase.from("projects").delete();
      if (isUuid(deleteProjectId)) {
        query = query.eq("id", deleteProjectId);
      } else {
        query = query.eq("slug", deleteProjectId);
      }
      const { error } = await query;
      if (error) throw error;
      toast({ title: "Success", description: "Project deleted successfully" });
      await fetchProjects();
    } catch (error: unknown) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Make sure you're logged in as admin.",
        variant: "destructive",
      });
    } finally {
      setDeleteProjectId(null);
    }
  };

  const getProjectTypeLabel = (type: string) =>
    projectTypes.find((t) => t.value === type)?.label || type;

  const isStaticFallback = (p: Project) =>
    p.id === "roam-point" || p.id === "safaricharge-platform";

  const getProjectLinks = (p: Project) =>
    PROJECT_DEEP_LINKS[p.slug || p.id || ""];

  const hasRoamPointInDB = projects.some((p) => p.slug === "roam-point");
  const hasSafariChargeInDB = projects.some((p) => p.slug === "safaricharge-platform");
  const displayProjects = [
    ...(hasRoamPointInDB ? [] : [ROAM_POINT_PROJECT]),
    ...(hasSafariChargeInDB ? [] : [SAFARICHARGE_PROJECT]),
    ...projects,
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12"
          >
            <div>
              <span className="text-primary font-medium mb-2 block">My Work</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                Project <span className="gradient-text">Portfolio</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A showcase of renewable energy installations and sustainable projects I've worked on.
              </p>
            </div>

            {isAdmin && (
              <Button onClick={handleAddProject} className="self-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </motion.div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project, index) => {
                const links = getProjectLinks(project);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="glass-card rounded-2xl overflow-hidden card-hover h-full flex flex-col">
                      {/* Image */}
                      <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center aspect-[4/3] w-full">
                        {project.images && project.images.length > 0 ? (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="text-center">
                            <Image className="w-12 h-12 text-primary/40 mx-auto mb-2" />
                            <span className="text-xs text-muted-foreground">No images yet</span>
                          </div>
                        )}

                        {/* Type badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/80 text-white font-medium">
                            {getProjectTypeLabel(project.project_type)}
                          </span>
                        </div>

                        {/* Admin controls — only for DB-persisted projects */}
                        {isAdmin && !isStaticFallback(project) && (
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditProject(project)}
                              aria-label="Edit project"
                              title="Edit project"
                              className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteProjectId(project.slug || project.id)}
                              aria-label="Delete project"
                              title="Delete project"
                              className="p-2 rounded-lg bg-destructive/80 hover:bg-destructive text-white transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-display font-bold mb-2">{project.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                          {project.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          {project.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {project.location}
                            </span>
                          )}
                          {project.completed_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(project.completed_at).getFullYear()}
                            </span>
                          )}
                        </div>

                        {/* CTA row */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {links?.caseStudy ? (
                            <Link
                              to={links.caseStudy}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                            >
                              View Case Study
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          ) : (
                            <button
                              onClick={() => setSelectedProject(project)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                            >
                              View Details
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {links?.repo && (
                            <a
                              href={links.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                            >
                              Repo
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {displayProjects.length === 0 && !loading && (
            <div className="text-center py-20">
              <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first project to showcase your work.
              </p>
              {isAdmin && (
                <Button onClick={handleAddProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Project
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Lightweight detail modal (only for projects WITHOUT a case study link) ── */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-4 text-sm">
                  {selectedProject.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedProject.location}
                    </span>
                  )}
                  {selectedProject.completed_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedProject.completed_at).toLocaleDateString()}
                    </span>
                  )}
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary font-medium">
                    {getProjectTypeLabel(selectedProject.project_type)}
                  </span>
                </DialogDescription>
              </DialogHeader>

              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                  {selectedProject.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${selectedProject.title} — image ${i + 1}`}
                      className="w-full h-64 object-cover object-center rounded-xl"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center my-4">
                  <div className="text-center">
                    <Image className="w-16 h-16 text-primary/40 mx-auto mb-2" />
                    <span className="text-muted-foreground">No project images yet</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="font-display font-semibold text-lg mb-2 text-primary">
                    About This Project
                  </h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Add / Edit modal ────────────────────────────────────────────────────── */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {editingProject.id ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>Fill in the details for your project.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={editingProject.title || ""}
                onChange={(e) => setEditingProject((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g., Solar Installation at Roam Hub"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={editingProject.description || ""}
                onChange={(e) => setEditingProject((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe what you did on this project..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editingProject.location || ""}
                  onChange={(e) => setEditingProject((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g., Nairobi, Kenya"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type</Label>
                <Select
                  value={editingProject.project_type || "solar"}
                  onValueChange={(value) =>
                    setEditingProject((p) => ({ ...p, project_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="completed_at">Completion Date</Label>
              <Input
                id="completed_at"
                type="date"
                value={editingProject.completed_at?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditingProject((p) => ({ ...p, completed_at: e.target.value || null }))
                }
              />
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <Label>Project Images</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                aria-label="Upload project images"
                className="hidden"
              />

              {editingProject.images && editingProject.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {editingProject.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt={`Project image ${i + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                        loading="lazy"
                        decoding="async"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        aria-label="Remove image"
                        title="Remove image"
                        className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Project"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ─────────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The project will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Projects;
