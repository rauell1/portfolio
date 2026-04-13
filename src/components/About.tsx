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
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium mb-4 block">{content.tagline}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {content.heading} <span className="gradient-text">{content.heading_highlight}</span>
            </h2>
            {content.paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-6">
                {p}
              </p>
            ))}

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-4">
              {content.highlights.map((item, index) => {
                const Icon = iconMap[item.icon] || Zap;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="glass-card rounded-xl p-4 group hover:border-primary/30 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-muted-foreground mb-1">{item.title}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right side - Professional headshot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-glow" />
              <div className="absolute inset-4 rounded-full border border-primary/15" />
              <div className="absolute inset-8 rounded-full border border-primary/10" />
              
              {/* Headshot */}
              <div className="absolute inset-12 rounded-full overflow-hidden border-2 border-primary/30 shadow-2xl">
                <img 
                  src="/images/og-image.png"
                  alt="Roy Otieno - Clean Energy Engineer"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Orbiting elements — hidden on mobile to avoid overflow and reduce GPU load */}
              <motion.div
                className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center 200px" }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
              </motion.div>

              <motion.div
                className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center 200px" }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-primary" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
