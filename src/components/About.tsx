import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { MapPin, GraduationCap, Zap, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SpotlightCard } from "./ui/SpotlightCard";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {/* Biography Bento Card (Col span 7) */}
          <div className="lg:col-span-7 flex">
            <SpotlightCard className="glass-card rounded-3xl p-8 border border-white/10 dark:border-white/5 w-full flex flex-col justify-center">
              <span className="text-primary font-mono-custom tracking-[0.2em] text-xs uppercase mb-3 block">{content.tagline}</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                {content.heading} <span className="gradient-text font-editorial italic font-normal">{content.heading_highlight}</span>
              </h2>
              {content.paragraphs.map((p, i) => (
                <p key={i} className="text-base text-muted-foreground leading-relaxed mb-4 text-justify hyphens-auto">
                  {p}
                </p>
              ))}
            </SpotlightCard>
          </div>

          {/* Tall Profile Headshot Bento Card (Col span 5) */}
          <div className="lg:col-span-5 flex">
            <SpotlightCard 
              className="glass-card rounded-3xl p-6 border border-white/10 dark:border-white/5 w-full flex flex-col justify-between overflow-hidden relative min-h-[380px] group cursor-pointer"
              glowColor="rgba(20, 184, 166, 0.15)"
            >
              {/* Dark overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

              {/* Headshot image with Grayscale-to-Color hover transition */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <img 
                  src="/images/og-image.png"
                  alt="Roy Otieno - Clean Energy Engineer"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Floating Orbiting elements */}
              <div className="relative z-20 mt-auto">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg uppercase tracking-widest font-mono-custom">
                  <Leaf className="w-3.5 h-3.5 text-primary" />
                  Systems Engineer
                </span>
              </div>
            </SpotlightCard>
          </div>

          {/* 4 Modular Highlight Bento Cards (Span 3 each) */}
          {content.highlights.map((item, index) => {
            const Icon = iconMap[item.icon] || Zap;
            return (
              <div key={item.title} className="md:col-span-1 lg:col-span-3 flex">
                <SpotlightCard 
                  className="glass-card rounded-3xl p-6 border border-white/10 dark:border-white/5 w-full flex flex-col justify-between h-full group cursor-pointer"
                  glowColor="rgba(16, 185, 129, 0.1)"
                >
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono-custom mb-1.5">{item.title}</p>
                    <p className="text-base font-bold text-foreground leading-snug">{item.value}</p>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
