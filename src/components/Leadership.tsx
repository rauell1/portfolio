import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Users, GraduationCap, Award, Heart, Sparkles } from "lucide-react";

const leadership = [
  {
    title: "Africa Fellowship for Young Energy Leaders",
    subtitle: "Cohort 5 - General Track & Solar PV Engineering",
    icon: Award,
    year: "2025",
    color: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
  },
  {
    title: "World Youth Parliament for Water",
    subtitle: "Global Member advocating for water sustainability",
    icon: Globe,
    year: "2024-2027",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    title: "Community Trainer",
    subtitle: "Solar irrigation & circular economy workshops",
    icon: Users,
    year: "Ongoing",
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
  },
  {
    title: "Student Leader - JKUAT",
    subtitle: "Engineering Outreach & Peer-Learning Coordinator",
    icon: GraduationCap,
    year: "2018-2023",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
];

export const Leadership = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="leadership" className="py-24 px-6 relative" ref={ref}>
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
          <span className="text-primary font-medium mb-4 block">Making an Impact</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Leadership & <span className="gradient-text">Engagement</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Committed to driving positive change through community engagement, policy advocacy, and knowledge sharing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {leadership.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`glass-card rounded-2xl p-6 border-l-4 ${item.borderColor} relative overflow-hidden group`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex gap-4">
                <motion.div 
                  className="flex-shrink-0"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${item.color} border ${item.borderColor}`}>
                    <item.icon className="w-6 h-6 text-foreground" />
                  </div>
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full whitespace-nowrap">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.subtitle}</p>
                </div>
              </div>
              
              {/* Animated corner accent */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-primary/10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mt-12"
        >
          {[
            { value: "50+", label: "Workshops Delivered" },
            { value: "1000+", label: "Lives Impacted" },
            { value: "5+", label: "Countries Reached" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-3xl md:text-4xl font-display font-bold gradient-text"
              >
                {stat.value}
              </motion.span>
              <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
