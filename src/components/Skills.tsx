import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo, memo } from "react";
import React from "react";
import { Sun, Battery, Wind, Zap, Leaf, Droplets, Bot, FileBarChart2, Globe2, Map, Megaphone, BarChart3 } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { SkillsRadarChart } from "./SkillsRadarChart";
import { supabase } from "@/integrations/supabase/client";

const EnergyIcon = ({ icon: Icon, delay, className }: { icon: React.ComponentType<LucideProps>; delay: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    className={className}
  >
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <Icon className="w-6 h-6 text-primary" />
    </motion.div>
  </motion.div>
);

interface SkillItem { name: string; level: number }
interface SkillsContent {
  tagline: string;
  heading: string;
  heading_highlight: string;
  items: SkillItem[];
}

const DEFAULT_SKILLS: SkillItem[] = [
  { name: "Solar PV Design", level: 95 },
  { name: "EV Charging Systems", level: 90 },
  { name: "Energy Audits", level: 88 },
  { name: "Sales Strategy", level: 92 },
  { name: "Policy Advocacy", level: 85 },
  { name: "Project Management", level: 88 },
  { name: "Data Analysis", level: 82 },
  { name: "Community Engagement", level: 95 },
];

const AI_AGENT_SKILLS: SkillItem[] = [
  { name: "AI Feasibility Analysis", level: 82 },
  { name: "Automated Energy Reporting", level: 78 },
  { name: "AI Market Intelligence", level: 80 },
  { name: "Geospatial & GIS Data", level: 75 },
  { name: "AI-Powered Sales Outreach", level: 76 },
  { name: "Data-Driven Policy", level: 78 },
];

const DEFAULT: SkillsContent = {
  tagline: "My Expertise",
  heading: "Skills &",
  heading_highlight: "Expertise",
  items: DEFAULT_SKILLS,
};

const AnimatedProgressBar = memo(({ skill, index, isInView }: { skill: SkillItem; index: number; isInView: boolean }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setWidth(skill.level), index * 80);
      return () => clearTimeout(timer);
    }
  }, [isInView, skill.level, index]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center text-[11px] sm:text-xs font-mono-custom uppercase tracking-wider">
        <span className="text-muted-foreground/90 font-medium">{skill.name}</span>
        <span className="text-primary font-bold">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-black/20 dark:bg-white/5 rounded-full overflow-hidden border border-white/[0.03]">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full relative"
          style={{ width: `${width}%` }}
          transition={{ duration: 1, delay: index * 0.08, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
});
AnimatedProgressBar.displayName = "AnimatedProgressBar";

const agentSkillCards = [
  {
    icon: FileBarChart2,
    title: "AI Feasibility Studies",
    description: "Accelerating solar PV and EV charging site feasibility reports using customized LLMs and data scripts.",
  },
  {
    icon: BarChart3,
    title: "Automated Dashboards",
    description: "Developing automated Power BI dashboards and reports to present live sustainable-energy insight metrics.",
  },
  {
    icon: Globe2,
    title: "Market Intelligence",
    description: "Leveraging AI automation to track clean energy, e-mobility trends, and investment models across East Africa.",
  },
  {
    icon: Map,
    title: "Geospatial GIS Data",
    description: "Applying spatial mapping tools to isolate optimal locations for off-grid PV hubs and EV battery swap networks.",
  },
  {
    icon: Megaphone,
    title: "Personalized Outreach",
    description: "Utilizing modern automation structures to customize partnership proposal flows to solar EPC operators.",
  },
  {
    icon: Bot,
    title: "Regulatory Synthesis",
    description: "Parsing policy guidelines and utility updates to construct data models for clean-tech policy engagement.",
  },
];

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [content, setContent] = useState<SkillsContent>(DEFAULT);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("page_sections")
      .select("content")
      .eq("page", "home")
      .eq("section", "skills")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setContent(data.content as SkillsContent);
      });
  }, []);

  const skills = useMemo(() => content.items, [content.items]);

  const energyIcons = useMemo(() => [
    { icon: Sun,      position: "top-4 left-4" },
    { icon: Wind,     position: "bottom-4 left-4" },
    { icon: Droplets, position: "top-1/2 right-4 -translate-y-1/2" },
  ], []);

  return (
    <section id="skills" className="py-16 sm:py-24 lg:py-32 px-6 relative" ref={ref}>
      {/* Dynamic ambient lights */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-glow opacity-25 blur-[100px] pointer-events-none" />

      {/* Floating animated decorative clean energy icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {energyIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.position} opacity-10 hidden sm:block`}
            animate={{ y: [0, -15, 0], rotate: [0, 360] }}
            transition={{
              y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 25 + index * 3, repeat: Infinity, ease: "linear" },
            }}
          >
            <item.icon className="w-12 h-12 text-primary" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono-custom text-xs uppercase tracking-widest mb-4 block">// {content.tagline}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
            {content.heading}{" "}
            <span className="font-editorial italic font-semibold text-primary">
              {content.heading_highlight}
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid Top Level: Core competencies & Radar */}
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {/* Bento Card 1: Core Progress Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 glass-card rounded-3xl p-8 border-white/[0.08] relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            {/* Background design accents */}
            <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                <Sun className="w-48 h-48 text-primary" />
              </motion.div>
            </div>

            <h3 className="text-xl font-display font-medium mb-8 flex items-center gap-3">
              <div className="flex gap-2">
                <EnergyIcon icon={Zap} delay={0} />
                <EnergyIcon icon={Leaf} delay={0.15} />
              </div>
              Core Competencies
            </h3>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
              {skills.map((skill, index) => (
                <AnimatedProgressBar key={skill.name} skill={skill} index={index} isInView={isInView} />
              ))}
            </div>
          </motion.div>

          {/* Bento Card 2: Interactive Radar Chart */}
          <SkillsRadarChart skills={skills} isInView={isInView} />
        </div>

        {/* Bento Grid Middle: 3 Domain Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mt-6"
        >
          {/* Card 1: Engineering */}
          <motion.div
            className="glass-card rounded-2xl p-6 border-white/[0.08] overflow-hidden group cursor-pointer relative hover:border-primary/20 transition-all duration-300 min-h-[200px] flex flex-col justify-between"
            whileHover={{ y: -4 }}
          >
            <div className="absolute -bottom-6 -left-6 opacity-[0.03] group-hover:opacity-10 transition-all duration-500">
              <Battery className="w-32 h-32 text-primary animate-pulse" />
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Sun className="w-6 h-6 text-primary" />
              </div>
              <span className="font-mono-custom text-[9px] text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                01 // TECHNICAL
              </span>
            </div>
            
            <div>
              <h3 className="text-lg font-display font-medium mb-2 group-hover:text-primary transition-colors">Engineering</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                Solar PV engineering, utility-grid integration, off-grid storage architectures, EV network analysis, and biogas technology.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Business */}
          <motion.div
            className="glass-card rounded-2xl p-6 border-white/[0.08] overflow-hidden group cursor-pointer relative hover:border-primary/20 transition-all duration-300 min-h-[200px] flex flex-col justify-between"
            whileHover={{ y: -4 }}
          >
            <div className="absolute -top-6 -right-6 opacity-[0.03] group-hover:opacity-10 transition-all duration-500">
              <Wind className="w-32 h-32 text-primary animate-pulse" />
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Battery className="w-6 h-6 text-primary" />
              </div>
              <span className="font-mono-custom text-[9px] text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                02 // STRATEGY
              </span>
            </div>

            <div>
              <h3 className="text-lg font-display font-medium mb-2 group-hover:text-primary transition-colors">Business</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                Strategic clean-tech sales frameworks, project finance modeling, EPRA stakeholder coordination, and market entry strategies.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Analytics */}
          <motion.div
            className="glass-card rounded-2xl p-6 border-white/[0.08] overflow-hidden group cursor-pointer relative hover:border-primary/20 transition-all duration-300 min-h-[200px] flex flex-col justify-between"
            whileHover={{ y: -4 }}
          >
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-10 transition-all duration-500">
              <Droplets className="w-32 h-32 text-primary animate-pulse" />
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <span className="font-mono-custom text-[9px] text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                03 // ANALYTICAL
              </span>
            </div>

            <div>
              <h3 className="text-lg font-display font-medium mb-2 group-hover:text-primary transition-colors">Analytics</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                GIS geospatial site locating, Power BI resource dashboards, carbon accounting systems, and detailed engineering audits.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bento Grid Bottom: AI Agent & Automation Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20"
        >
          <div className="flex items-center gap-3 mb-10">
            <motion.div 
              className="p-2 rounded-xl bg-primary/10 border border-primary/20"
              animate={{ boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0.2)", "0 0 16px 4px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0.2)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Bot className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-display font-medium">
                AI-Augmented{" "}
                <span className="font-editorial italic font-semibold text-primary">Energy Skills</span>
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5 font-mono-custom uppercase tracking-wider">
                SYNCHRONIZING REVOLUTIONARY AUTOMATION WITH INFRASTRUCTURE DEVELOPMENT
              </p>
            </div>
          </div>

          <motion.div className="glass-card rounded-3xl p-8 border-white/[0.08] mb-6">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              {AI_AGENT_SKILLS.map((skill, index) => (
                <AnimatedProgressBar key={skill.name} skill={skill} index={index + 8} isInView={isInView} />
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentSkillCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="glass-card rounded-2xl p-6 border-white/[0.08] overflow-hidden group cursor-pointer relative hover:border-primary/20 transition-all duration-300 min-h-[160px] flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-mono-custom text-[8px] tracking-wider text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                    INTEL_GRID_0{index + 1}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-display font-medium text-foreground group-hover:text-primary transition-colors mb-1.5">{card.title}</h4>
                  <p className="text-muted-foreground text-[11px] leading-relaxed font-sans">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
