import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Globe, Users, GraduationCap, Award, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Globe, Users, GraduationCap, Award,
};

const colorMap: string[] = [
  "from-yellow-500/20 to-orange-500/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-purple-500/20 to-pink-500/20",
  "from-rose-500/20 to-red-500/20",
];
const borderMap: string[] = [
  "border-yellow-500/30",
  "border-blue-500/30",
  "border-green-500/30",
  "border-purple-500/30",
  "border-rose-500/30",
];

interface LeaderItem { title: string; subtitle: string; year: string; icon: string }
interface LeadershipContent {
  tagline: string;
  heading: string;
  heading_highlight: string;
  description: string;
  items: LeaderItem[];
}

const DEFAULT: LeadershipContent = {
  tagline: "Making an Impact",
  heading: "Leadership &",
  heading_highlight: "Engagement",
  description: "Committed to driving positive change through community engagement, policy advocacy, and knowledge sharing.",
  items: [
    { title: "Africa Fellowship for Young Energy Leaders", subtitle: "High-level multidisciplinary programme advancing clean-energy innovation and the African energy-transition agenda; includes policy engagement and cross-country peer exchange.", year: "2025–2026", icon: "Award" },
    { title: "Kenya Youth Parliament for Water", subtitle: "International advocacy on climate-resilient urban water systems and sustainable governance.", year: "2024–Present", icon: "Globe" },
    { title: "Community Trainer", subtitle: "Workshops on solar irrigation, renewable energy, and circular-economy practices for rural farmers.", year: "Ongoing", icon: "Users" },
  ],
};

export const Leadership = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [content, setContent] = useState<LeadershipContent>(DEFAULT);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("page_sections")
      .select("content")
      .eq("page", "home")
      .eq("section", "leadership")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setContent(data.content as LeadershipContent);
      });
  }, []);

  return (
    <section id="leadership" className="py-16 sm:py-24 lg:py-32 px-6 relative" ref={ref}>
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-10 opacity-10"
        >
          <Sparkles className="w-32 h-32 text-primary" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-10 opacity-10"
        >
          <Heart className="w-24 h-24 text-primary" />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
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
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {content.items.map((item, index) => {
            const Icon = iconMap[item.icon] || Award;
            const color = colorMap[index % colorMap.length];
            const borderColor = borderMap[index % borderMap.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-card rounded-2xl p-6 border-l-4 ${borderColor} relative overflow-hidden group`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex gap-4">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${color} border ${borderColor}`}>
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-medium text-base sm:text-lg group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <span className="font-mono-custom text-[10px] tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {item.year}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">{item.subtitle}</p>
                  </div>
                </div>
                
                {/* Animated corner accent */}
                <motion.div
                  className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-primary/10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-3 gap-3 mt-12"
        >
          {[
            { value: "50+", label: "Workshops Delivered" },
            { value: "1000+", label: "Lives Impacted" },
            { value: "5+", label: "Countries Reached" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="bg-card rounded-xl p-4 sm:p-6 text-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-xl sm:text-3xl md:text-4xl font-display font-bold gradient-text"
              >
                {stat.value}
              </motion.span>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
