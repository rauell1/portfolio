import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Plus, Image, Calendar, MapPin, 
  Edit, Trash2, Loader2, Upload
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
}

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
  const isAdmin = user?.email === "royokola3@gmail.com";

  // Fetch projects from database
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

      setEditingProject(prev => ({ ...prev, images: newImages }));
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images. Make sure you're logged in as admin.",
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
    setEditingProject(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, index) => index !== indexToRemove),
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
      if (editingProject.id) {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update({
            title: editingProject.title,
            description: editingProject.description,
            location: editingProject.location,
            project_type: editingProject.project_type || "solar",
            images: editingProject.images || [],
            completed_at: editingProject.completed_at,
          })
          .eq("id", editingProject.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        // Create new project
        const { error } = await supabase
          .from("projects")
          .insert({
            title: editingProject.title,
            description: editingProject.description,
            location: editingProject.location,
            project_type: editingProject.project_type || "solar",
            images: editingProject.images || [],
            completed_at: editingProject.completed_at,
          });

        if (error) throw error;
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }

      await fetchProjects();
      setIsEditModalOpen(false);
      setEditingProject({});
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project. Make sure you're logged in as admin.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteProjectId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      await fetchProjects();
    } catch (error: any) {
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

  const getProjectTypeLabel = (type: string) => {
    return projectTypes.find(t => t.value === type)?.label || type;
  };

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
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div 
                    onClick={() => setSelectedProject(project)}
                    className="glass-card rounded-2xl overflow-hidden cursor-pointer card-hover h-full flex flex-col"
                  >
                    {/* Image placeholder */}
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 relative flex items-center justify-center">
                      {project.images && project.images.length > 0 ? (
                        <img 
                          src={project.images[0]} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Image className="w-12 h-12 text-primary/40 mx-auto mb-2" />
                          <span className="text-xs text-muted-foreground">No images yet</span>
                        </div>
                      )}
                      
                      {/* Project type badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/80 text-white font-medium">
                          {getProjectTypeLabel(project.project_type)}
                        </span>
                      </div>
                      
                      {isAdmin && (
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProject(project);
                            }}
                            className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteProjectId(project.id);
                            }}
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
                            {new Date(project.completed_at).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {projects.length === 0 && !loading && (
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

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4 text-sm">
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
              
              {/* Image gallery */}
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 my-4">
                  {selectedProject.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${selectedProject.title} - ${index + 1}`}
                      className={`w-full h-48 object-cover rounded-xl ${
                        index === 0 && selectedProject.images!.length % 2 !== 0 
                          ? "col-span-2 h-64" 
                          : ""
                      }`}
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
                  <h4 className="font-display font-semibold text-lg mb-2 text-primary">About This Project</h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit/Add Project Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {editingProject.id ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for your project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={editingProject.title || ""}
                onChange={(e) => setEditingProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Solar Installation at Roam Hub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={editingProject.description || ""}
                onChange={(e) => setEditingProject(prev => ({ ...prev, description: e.target.value }))}
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
                  onChange={(e) => setEditingProject(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Nairobi, Kenya"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type</Label>
                <Select
                  value={editingProject.project_type || "solar"}
                  onValueChange={(value) => setEditingProject(prev => ({ ...prev, project_type: value }))}
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
                value={editingProject.completed_at?.split("T")[0] || ""}
                onChange={(e) => setEditingProject(prev => ({ ...prev, completed_at: e.target.value || null }))}
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
              {editingProject.images && editingProject.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {editingProject.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground">
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