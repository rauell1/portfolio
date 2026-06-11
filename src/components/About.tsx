import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { MapPin, GraduationCap, Zap, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  MapPin,
  GraduationCap,
  Zap,
  Leaf,
};

interface Highlight { icon: string; title: string; value: string }
interface AboutContent {
  tagline: string;
  heading: string;
  heading_highlight: string;
  paragraphs: string[];
  highlights: Highlight[];
}

const DEFAULT: AboutContent = {
  tagline: "About Me",
  heading: "Powering Africa's",
  heading_highlight: "Clean Future",
  paragraphs: [
    "I'm a renewable-energy and e-mobility specialist with hands-on experience in distributed energy infrastructure, EV-charging technology, and battery-swap system deployment across East Africa.",
    "My expertise spans technical operations, system-uptime management, feasibility analysis, and cross-functional coordination with contractors, utilities, and regulatory agencies. I'm passionate about delivering practical solutions that enhance infrastructure reliability and accelerate the transition to sustainable energy.",
  ],
  highlights: [
    { icon: "MapPin",        title: "Based in",   value: "Nairobi, Kenya" },
    { icon: "GraduationCap", title: "Education",  value: "MBA Candidate & BSc. Engineering" },
    { icon: "Zap",           title: "Focus",      value: "Clean Energy & E-Mobility" },
    { icon: "Leaf",          title: "Mission",    value: "Sustainable Africa" },
  ],
};

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [content, setContent] = useState<AboutContent>(DEFAULT);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("page_sections")
      .select("content")
      .eq("page", "home")
      .eq("section", "about")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setContent(data.content as AboutContent);
      });
  }, []);

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 px-6 relative" ref={ref}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-glow opacity-30 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Biography / Editorial Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="md:col-span-2 glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between border-white/[0.08] relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            {/* Soft background grid overlay */}
            <div 
              className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity duration-500"
              style={{
                backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
                backgroundSize: "20px 20px"
              }}
            />
            
            <div>
              <span className="text-primary font-mono-custom text-xs uppercase tracking-widest mb-4 block">
                // {content.tagline}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight mb-8 leading-tight">
                {content.heading}{" "}
                <span className="font-editorial italic font-semibold text-primary">
                  {content.heading_highlight}
                </span>
              </h2>
              <div className="space-y-6 text-muted-foreground/90 text-sm sm:text-base leading-relaxed max-w-2xl text-justify hyphens-auto">
                {content.paragraphs.map((p, i) => (
                  <p key={i} className="font-sans">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-3 text-xs font-mono-custom text-muted-foreground/50 border-t border-white/[0.05] pt-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ACTIVE PROJECT: SAFARICHARGE DEPLOYMENT
            </div>
          </motion.div>

          {/* Card 2: The Energy Sphere (Image & Orbiter Profile) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="md:col-span-1 glass-card rounded-3xl p-8 flex flex-col items-center justify-center border-white/[0.08] relative overflow-hidden group hover:border-primary/20 transition-all duration-500 min-h-[300px]"
          >
            <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
            
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
              {/* Dynamic spinning orbit paths */}
              <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-spin" style={{ animationDuration: '40s' }} />
              <div className="absolute inset-2 rounded-full border border-dotted border-primary/10 animate-spin" style={{ animationDuration: '60s', animationDirection: 'reverse' }} />
              
              {/* Outer pulsing ring */}
              <div className="absolute inset-4 rounded-full border border-primary/30 animate-pulse-glow" />
              
              {/* Profile Image container (keeps clean legacy circular frame) */}
              <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-primary/40 shadow-2xl bg-black">
                <img 
                  src="/images/og-image.png"
                  alt="Roy Okola Otieno - Clean Energy & E-Mobility"
                  className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-700"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <h3 className="font-display font-medium text-lg">Roy Okola Otieno</h3>
              <p className="font-mono-custom text-[10px] text-primary tracking-widest uppercase mt-1">FOUNDER &amp; LEAD ENGINEER</p>
            </div>
          </motion.div>

          {/* Cards 3-6: Highlight Grid Items */}
          {content.highlights.map((item, index) => {
            const Icon = iconMap[item.icon] || Zap;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="glass-card rounded-2xl p-6 border-white/[0.08] relative overflow-hidden group hover:border-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[140px]"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="font-mono-custom text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
                    {item.title}
                  </p>
                  <p className="font-display font-medium text-base sm:text-lg tracking-tight group-hover:text-primary transition-colors">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
