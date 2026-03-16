import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Sun, Zap, Leaf, TrendingUp, Users, BarChart3,
  Thermometer, Battery, ChevronRight, MapPin, Calendar, Crown
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface CaseStudyPreview {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  date: string;
  gradient: string;
  icon: typeof Sun;
  isFlagship?: boolean;
  metrics: { label: string; value: string; icon: typeof TrendingUp }[];
}

// Icon map for resolving icon names from the database
const ICON_MAP: Record<string, typeof Sun> = {
  Sun, Battery, Zap, Leaf, TrendingUp, Users, MapPin, Calendar,
  BarChart3, Thermometer,
};

const resolveIcon = (name: string): typeof Sun => ICON_MAP[name] ?? Zap;

// Fallback data in case database is empty
const fallbackPreviews: CaseStudyPreview[] = [
  {
    id: "solar-microgrid-ev",
    title: "Solar Microgrid for EV Charging",
    subtitle: "Renewable energy integration for sustainable charging operations",
    category: "E-Mobility Infrastructure",
    location: "Nairobi, Kenya",
    date: "2024-2026",
    gradient: "from-blue-500 to-cyan-400",
    icon: Zap,
    isFlagship: true,
    metrics: [
      { label: "Solar Capacity", value: "50 kW", icon: Sun },
      { label: "CO₂ Saved/Year", value: "45 tons", icon: Leaf },
    ],
  },
  {
    id: "roam-point-deployment",
    title: "Roam Point Charging Deployment",
    subtitle: "Product ownership of distributed fast charging infrastructure",
    category: "EV Infrastructure",
    location: "Nairobi, Kenya",
    date: "2025-Present",
    gradient: "from-amber-500 to-orange-600",
    icon: Zap,
    metrics: [
      { label: "Charging Output", value: "6.6 kW", icon: Zap },
      { label: "Peak Efficiency", value: "94%", icon: TrendingUp },
    ],
  },
  {
    id: "solar-cold-storage",
    title: "Solar-Powered Cold Storage",
    subtitle: "Reducing post-harvest losses for smallholder farmers",
    category: "AgriTech Solutions",
    location: "Machakos County, Kenya",
    date: "2023",
    gradient: "from-orange-500 to-yellow-400",
    icon: Sun,
    metrics: [
      { label: "Shelf Life Extended", value: "+7 days", icon: Thermometer },
      { label: "Farmers Benefited", value: "50+", icon: Users },
    ],
  },
];

export const CaseStudies = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [previews, setPreviews] = useState<CaseStudyPreview[]>(fallbackPreviews);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .limit(3);

      if (!error && data && data.length > 0) {
        const mapped: CaseStudyPreview[] = data.map((cs: any) => ({
          id: cs.slug || cs.id,
          title: cs.title,
          subtitle: cs.subtitle || "",
          category: cs.category,
          location: cs.location || "",
          date: cs.date || "",
          isFlagship: cs.is_flagship,
          gradient: cs.gradient || "from-blue-500 to-cyan-400",
          icon: resolveIcon(cs.icon_name || "Zap"),
          metrics: Array.isArray(cs.metrics)
            ? (cs.metrics as { label: string; value: string; icon_name: string }[])
                .slice(0, 2)
                .map(m => ({
                  label: m.label,
                  value: m.value,
                  icon: resolveIcon(m.icon_name || "TrendingUp"),
                }))
            : [],
        }));
        setPreviews(mapped);
      }
      // On error or empty, keep fallback
    };

    fetchCaseStudies();
  }, []);

  return (
    <section id="case-studies" className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">Impact Stories</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Case <span className="gradient-text">Studies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep dives into renewable energy projects making measurable impact across Africa.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {previews.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <Link
                to="/case-studies"
                className={`glass-card rounded-2xl overflow-hidden cursor-pointer card-hover h-full flex flex-col ${study.isFlagship ? "border border-amber-500/20" : ""}`}
              >
                <div className={`h-36 bg-gradient-to-br ${study.gradient} relative p-6 flex flex-col justify-end`}>
                  <div className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                    <study.icon className="w-5 h-5 text-white" />
                  </div>
                  {study.isFlagship && (
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-1 rounded-full">
                      <Crown className="w-3 h-3" />
                      Flagship
                    </span>
                  )}
                  <span className="text-white/80 text-xs font-medium">{study.category}</span>
                  <h3 className="text-xl font-display font-bold text-white">{study.title}</h3>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{study.subtitle}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {study.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {study.date}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    {study.metrics.map((metric) => (
                      <div key={metric.label} className="bg-black/5 dark:bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-primary">{metric.value}</p>
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  <span className="mt-4 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    Read Case Study <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View All Case Studies
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
