import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit, Trash2, Loader2, Search, MapPin,
  Calendar, FolderOpen, Upload, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
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

const projectTypes = [
  { value: "solar", label: "Solar Installation" },
  { value: "ev", label: "EV Charging" },
  { value: "microgrid", label: "Microgrid" },
  { value: "biogas", label: "Biogas" },
  { value: "storage", label: "Energy Storage" },
  { value: "other", label: "Other" },
];

const DatabaseProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Project>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
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
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch projects", variant: "destructive" });
    } else {
      setProjects((data as Project[]) || []);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditing({
      title: "",
      description: "",
      location: "",
      project_type: "solar",
      images: [],
      completed_at: null,
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setIsEditModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase connection not configured.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const newImages: string[] = [...(editing.images || [])];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("project-images")
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      setEditing(prev => ({ ...prev, images: newImages }));
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setEditing(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    if (!editing.title || !editing.description) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      });
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
      const payload = {
        title: editing.title,
        description: editing.description,
        location: editing.location || null,
        project_type: editing.project_type || "solar",
        images: editing.images || [],
        completed_at: editing.completed_at || null,
      };

      if (editing.id) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editing.id);

        if (error) throw error;
        toast({ title: "Success", description: "Project updated successfully" });
      } else {
        const { error } = await supabase
          .from("projects")
          .insert(payload);

        if (error) throw error;
        toast({ title: "Success", description: "Project created successfully" });
      }

      await fetchProjects();
      setIsEditModalOpen(false);
      setEditing({});
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
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
      const { error } = await supabase.from("projects").delete().eq("id", deleteId);
      if (error) throw error;
      toast({ title: "Success", description: "Project deleted successfully" });
      await fetchProjects();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const getProjectTypeLabel = (type: string) => {
    return projectTypes.find(t => t.value === type)?.label || type;
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.project_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
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
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-primary">{projects.length}</p>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-cyan-500">
            {projects.filter(p => p.project_type === "ev").length}
          </p>
          <p className="text-sm text-muted-foreground">EV Charging</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-amber-500">
            {projects.filter(p => p.project_type === "solar").length}
          </p>
          <p className="text-sm text-muted-foreground">Solar</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-green-500">
            {projects.filter(p => p.project_type === "microgrid").length}
          </p>
          <p className="text-sm text-muted-foreground">Microgrids</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold">All Database Projects</h2>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No projects found</p>
            <Button className="mt-4" onClick={handleAdd}>Create your first project</Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0 flex items-center justify-center">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-primary/40" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium truncate">{project.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                        {getProjectTypeLabel(project.project_type)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {project.location}
                        </span>
                      )}
                      {project.completed_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.completed_at).toLocaleDateString()}
                        </span>
                      )}
                      <span>{project.images?.length || 0} images</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(project.id)}
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {editing.id ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>Fill in the details for your project.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={editing.title || ""}
                onChange={(e) => setEditing(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Solar Installation at Roam Hub"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={editing.description || ""}
                onChange={(e) => setEditing(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what you did on this project..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editing.location || ""}
                  onChange={(e) => setEditing(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Nairobi, Kenya"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type</Label>
                <Select
                  value={editing.project_type || "solar"}
                  onValueChange={(value) => setEditing(prev => ({ ...prev, project_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
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
                value={editing.completed_at?.split("T")[0] || ""}
                onChange={(e) => setEditing(prev => ({ ...prev, completed_at: e.target.value || null }))}
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
                className="hidden"
              />

              {/* Image previews */}
              {editing.images && editing.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {editing.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                        loading="lazy"
                        decoding="async"
                      />
                      <button
                        onClick={() => removeImage(index)}
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
              <Button onClick={handleSave} disabled={isSaving}>
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
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

export default DatabaseProjectsManager;
