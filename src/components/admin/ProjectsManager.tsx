import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, FolderOpen, ExternalLink, Tag,
  Zap, Sun, Battery, Leaf, BarChart3, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { portfolioProjects } from "@/data/portfolioProjects";
import type { LucideProps } from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Zap,
  Sun,
  Battery,
  Leaf,
  BarChart3,
  Globe,
};

const ProjectsManager = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = portfolioProjects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const founderCount = portfolioProjects.filter(p => p.isFounder).length;
  const eMobilityCount = portfolioProjects.filter(
    p => p.category === "E-Mobility" || p.category === "Infrastructure"
  ).length;
  const agriTechCount = portfolioProjects.filter(p => p.category === "AgriTech").length;

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
        <Button variant="outline" asChild>
          <a href="/#work" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Portfolio
          </a>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-primary">{portfolioProjects.length}</p>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-amber-500">{founderCount}</p>
          <p className="text-sm text-muted-foreground">Founder Projects</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-cyan-500">{eMobilityCount}</p>
          <p className="text-sm text-muted-foreground">E-Mobility</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-3xl font-bold text-green-500">{agriTechCount}</p>
          <p className="text-sm text-muted-foreground">AgriTech</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold">All Portfolio Projects</h2>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredProjects.map((project, index) => {
              const Icon = iconMap[project.iconName] ?? Zap;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Gradient icon */}
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium truncate">{project.title}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                          {project.category}
                        </span>
                        {project.isFounder && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-500">
                            Founder
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {project.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsManager;
