import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Plus, Image, Calendar, MapPin, 
  Edit, Trash2, Loader2, Upload, Zap, Map, Users, Target, Cpu, Layout
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
  slug?: string | null;
}

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const ROAM_POINT_PROJECT: Project = {
  id: "roam-point",
  slug: "roam-point",
  title: "Roam Point EV Charging Infrastructure",
  description: "Roam Point is a distributed EV charging infrastructure solution designed to accelerate electric motorcycle adoption across African cities by providing accessible and high-speed charging hubs.",
  location: "Nairobi, Kenya",
  project_type: "ev",
  images: ["/images/roam-electric.webp", "/images/roam-charger-1.jpeg", "/images/roam-charger-2.jpeg", "/images/roam-charger-3.jpeg", "/images/roam-charger-4.jpeg"],
  completed_at: null,
  created_at: "",
};

const ROAM_POINT_CASE_STUDY = {
  hero: {
    title: "Roam Point Fast Charging Infrastructure Rollout",
    subtitle: "Deploying distributed EV charging infrastructure to support electric motorcycle mobility across Nairobi.",
    quickFacts: [
      { label: "Location", value: "Nairobi, Kenya", icon: Map },
      { label: "Project Type", value: "Electric Mobility Infrastructure", icon: Zap },
      { label: "Role", value: "Product Owner - Charging Infrastructure Deployment", icon: Users },
      { label: "Technology", value: "6.6 kW DC Fast Chargers", icon: Cpu },
      { label: "Deployment Model", value: "Distributed urban charging network", icon: Layout },
      { label: "Impact Areas", value: "Clean mobility • Infrastructure • Renewable integration", icon: Target },
    ],
  },
  sections: [
    {
      heading: "Project Overview",
      content: "The Roam Point project focuses on deploying distributed fast charging infrastructure to support the growing adoption of electric motorcycles in Nairobi. Electric mobility offers a cost-effective and sustainable alternative to traditional internal combustion motorcycles, but the success of this transition depends on the availability of reliable charging infrastructure.\n\nRoam Point chargers are designed to provide accessible and fast charging solutions across urban environments, enabling riders to recharge their vehicles quickly while minimizing operational downtime.\n\nThe project aims to build a scalable network of charging stations located in strategic locations such as transport hubs, commercial centers, and public parking areas.",
    },
    {
      heading: "The Problem",
      content: "Electric motorcycle adoption in Kenya is accelerating due to the lower operating costs compared to petrol-powered motorcycles. However, charging infrastructure remains limited and unevenly distributed across urban environments.\n\nKey challenges included:\n\n• Limited availability of public EV charging stations\n• Range anxiety among riders\n• Long charging times in centralized facilities\n• Lack of infrastructure near high-traffic mobility hubs\n\nWithout accessible charging infrastructure, the expansion of electric mobility would remain constrained. The Roam Point initiative was designed to address these challenges by deploying a distributed charging network across Nairobi.",
    },
    {
      heading: "My Role",
      content: "Product Owner - Roam Point Charging Infrastructure\n\nResponsibilities included:\n\n• Leading infrastructure deployment strategy\n• Identifying and evaluating potential charging locations\n• Coordinating partnerships with site owners and businesses\n• Conducting site feasibility assessments\n• Supporting rollout of charging infrastructure\n• Working with cross-functional teams on operational planning\n\nThe role required combining technical understanding of energy systems with infrastructure planning and stakeholder engagement.",
    },
    {
      heading: "Charging Infrastructure Design",
      content: "The Roam Point charger is a compact DC fast charging unit designed specifically for electric motorcycles operating in urban African environments.\n\nKey technical features include:\n\n• Power output: 6.6 kW DC fast charging capability\n• Efficiency: 94% peak efficiency\n• Connectivity: 4G LTE and WiFi for real-time monitoring and system management\n• Charging interface: Dual Type 6 connectors for electric motorcycle charging\n• Protection systems: Surge protection, over-voltage protection, temperature protection\n• Remote management: Over-the-air software updates enable remote maintenance and system optimization\n\nThese features allow the chargers to operate reliably in both urban and semi-urban environments.",
    },
    {
      heading: "Charging Models and Installation Types",
      content: "Roam Point supports several installation configurations that enable flexible deployment across different environments.\n\n• Wall mount installation: Used in secure environments such as garages, workshops, and commercial buildings.\n\n• Mobile charging units: Portable charging stations that can be deployed in dynamic environments such as small workshops and kiosks.\n\n• Pole mounted chargers: Suitable for curbside parking spaces and open-air locations.\n\n• Canopy charging stations: Designed for larger charging hubs located in commercial centers or transport hubs.\n\nThese configurations allow infrastructure deployment in locations with varying spatial and operational requirements.",
    },
    {
      heading: "Site Selection and Deployment Strategy",
      content: "Charging locations are selected based on several criteria:\n\nMobility demand: Locations with high motorcycle traffic such as boda boda stages, transport hubs, and commercial centers.\n\nEnergy availability: Sites must have access to reliable electricity supply and adequate electrical capacity for charger installation.\n\nAccessibility: Charging stations are positioned in areas that allow easy access for riders.\n\nSafety: Locations must provide safe environments for both riders and equipment.\n\nTypical deployment locations include transport hubs, shopping centers, fuel stations, fleet depots, and public parking spaces. The compact charger footprint allows installation even in space-constrained environments.",
    },
    {
      heading: "Digital Platform Integration",
      content: "Roam Point chargers are integrated with a digital platform that enables riders to locate charging stations and manage charging sessions.\n\nPlatform features include:\n\n• Real-time charger map: Riders can view available charging stations on the Roam mobile application.\n\n• Mobile payments: Charging sessions can be paid for using integrated mobile payment systems.\n\n• Remote monitoring: Operators can monitor charger performance remotely.\n\nThis digital integration improves both operational efficiency and rider convenience.",
    },
    {
      heading: "Partnership Model",
      content: "A key component of the project is the partnership model that enables businesses and landowners to host charging infrastructure.\n\nPartner responsibilities include providing space for charger installation, maintaining accessibility, and supporting operational visibility.\n\nBenefits to partners include revenue sharing from electricity sales, monthly rental income, and increased customer traffic.\n\nThis partnership approach allows the charging network to scale rapidly while creating economic incentives for host locations.",
    },
    {
      heading: "Impact",
      content: "The Roam Point charging network contributes to the growth of sustainable mobility by:\n\n• Enabling reliable charging for electric motorcycle riders\n• Reducing dependence on fossil fuel-powered motorcycles\n• Lowering transportation-related emissions\n• Supporting the expansion of electric mobility infrastructure\n\nBy deploying distributed charging infrastructure, the project helps accelerate the transition toward cleaner urban transportation systems.",
    },
    {
      heading: "Future Expansion",
      content: "Future development of the Roam Point network may include:\n\n• Expansion to additional cities\n• Integration with renewable energy systems\n• Development of larger charging hubs\n• Improved digital monitoring and analytics",
    },
  ],
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
      setProjects((data as Project[]) || []);
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
      const payload = {
        title: editingProject.title,
        description: editingProject.description,
        location: editingProject.location,
        project_type: editingProject.project_type || "solar",
        images: editingProject.images || [],
        completed_at: editingProject.completed_at,
      };

      if (editingProject.id) {
        // Update existing project (by UUID id when available; otherwise fall back to slug)
        let query = supabase.from("projects").update(payload);
        if (isUuid(editingProject.id)) {
          query = query.eq("id", editingProject.id);
        } else {
          const slug = editingProject.slug || editingProject.id;
          query = query.eq("slug", slug);
        }

        const { error } = await query;

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
            ...payload,
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
      let query = supabase.from("projects").delete();
      if (isUuid(deleteProjectId)) {
        query = query.eq("id", deleteProjectId);
      } else {
        query = query.eq("slug", deleteProjectId);
      }

      const { error } = await query;

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

  // If the Roam Point project is already in the DB (identified by slug), use that version.
  // Otherwise fall back to the hardcoded constant so the card always shows.
  const hasRoamPointInDB = projects.some((p) => p.slug === "roam-point");
  const displayProjects = hasRoamPointInDB
    ? projects
    : [ROAM_POINT_PROJECT, ...projects];
  const isRoamPoint = (p: Project) => p.slug === "roam-point" || p.id === "roam-point";

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
              {displayProjects.map((project, index) => (
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
                    {/* Image area – centered and consistent across cards */}
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
                      
                      {/* Project type badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/80 text-white font-medium">
                          {getProjectTypeLabel(project.project_type)}
                        </span>
                      </div>
                      
                      {isAdmin && (
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!(!hasRoamPointInDB && isRoamPoint(project)) && (
                            <>
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
                                  setDeleteProjectId(project.slug || project.id);
                                }}
                                className="p-2 rounded-lg bg-destructive/80 hover:bg-destructive text-white transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
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

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className={selectedProject && isRoamPoint(selectedProject) ? "max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0" : "max-w-2xl max-h-[90vh] overflow-y-auto"}>
          {selectedProject && isRoamPoint(selectedProject) ? (
            /* Roam Point full case study */
            <div className="divide-y divide-border bg-background">
              {/* Hero image */}
              {selectedProject.images?.[0] && (
                <div className="h-48 sm:h-52 w-full overflow-hidden rounded-t-lg">
                  <img
                    src={selectedProject.images[0]}
                    alt="Roam Point charger in the field"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              )}
              {/* Title and quick facts on solid background for readability */}
              <div className="px-6 pb-6 pt-6 sm:px-8 sm:pt-8 bg-background">
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 text-foreground">
                  {ROAM_POINT_CASE_STUDY.hero.title}
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg mb-6 max-w-3xl">
                  {ROAM_POINT_CASE_STUDY.hero.subtitle}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ROAM_POINT_CASE_STUDY.hero.quickFacts.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border"
                    >
                      <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium leading-snug text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Case study sections */}
              <div className="content-body px-6 py-8 sm:px-8 space-y-12 bg-background">
                {ROAM_POINT_CASE_STUDY.sections.map((section, index) => (
                  <section key={index} className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-display font-semibold text-primary border-b border-primary/20 pb-2">
                      {section.heading}
                    </h3>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base text-foreground/90">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>

              {/* Photo gallery */}
              {selectedProject.images && selectedProject.images.length > 1 && (
                <div className="px-6 py-8 sm:px-8 border-t border-border">
                  <h3 className="text-lg font-display font-semibold text-primary mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedProject.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Roam Point charging infrastructure ${index + 1}`}
                        className="w-full h-36 object-cover rounded-lg border border-border"
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : selectedProject ? (
            /* Standard project modal */
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
              
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                  {selectedProject.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${selectedProject.title} - ${index + 1}`}
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
              
              <div className="content-body space-y-4">
                <div>
                  <h4 className="font-display font-semibold text-lg mb-2 text-primary">About This Project</h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
            </>
          ) : null}
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