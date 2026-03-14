import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Skill {
  name: string;
  level: number;
}

interface SkillsRadarChartProps {
  skills: Skill[];
  isInView: boolean;
}

export const SkillsRadarChart = ({ skills, isInView }: SkillsRadarChartProps) => {
  const [animatedLevels, setAnimatedLevels] = useState(skills.map(() => 0));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedLevels(skills.map((s) => s.level));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, skills]);

  const centerX = 150;
  const centerY = 150;
  const maxRadius = 100;
  const levels = 5;
  const angleStep = (2 * Math.PI) / skills.length;

  // Generate polygon points for the skill levels
  const generatePolygonPoints = (levelMultiplier: number) => {
    return animatedLevels
      .map((level, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const radius = (level / 100) * maxRadius * levelMultiplier;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Generate background level rings
  const generateRingPoints = (level: number) => {
    const radius = (level / levels) * maxRadius;
    return skills
      .map((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="text-lg font-display font-bold mb-4 text-center text-primary">
        Skill Overview
      </h3>
      <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
        {/* Animated gradient definitions */}
        <defs>
          <radialGradient id="skillGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background rings with subtle gradient */}
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.polygon
            key={`ring-${level}`}
            points={generateRingPoints(level)}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeOpacity={0.1 + level * 0.03}
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: level * 0.1, duration: 0.5 }}
          />
        ))}

        {/* Animated axis lines */}
        {skills.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x = centerX + maxRadius * Math.cos(angle);
          const y = centerY + maxRadius * Math.sin(angle);
          return (
            <motion.line
              key={`axis-${index}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="hsl(var(--primary))"
              strokeOpacity={hoveredIndex === index ? 0.5 : 0.15}
              strokeWidth={hoveredIndex === index ? 2 : 1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
            />
          );
        })}

        {/* Main skill polygon with gradient fill */}
        <motion.polygon
          points={generatePolygonPoints(1)}
          fill="url(#skillGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        />

        {/* Interactive skill points */}
        {animatedLevels.map((level, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const radius = (level / 100) * maxRadius;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const isHovered = hoveredIndex === index;
          
          return (
            <g key={`point-group-${index}`}>
              {/* Pulse effect on hover */}
              {isHovered && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="hsl(var(--primary))"
                  opacity={0.3}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
                filter={isHovered ? "url(#glow)" : undefined}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}

        {/* Skill labels with improved positioning */}
        {skills.map((skill, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelRadius = maxRadius + 30;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          const isHovered = hoveredIndex === index;
          
          // Better text wrapping for long names
          const words = skill.name.split(" ");
          const displayLines = words.length > 1 
            ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")]
            : [skill.name];
          
          return (
            <g 
              key={`label-${index}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
            >
              {displayLines.map((line, lineIndex) => (
                <motion.text
                  key={`label-${index}-${lineIndex}`}
                  x={x}
                  y={y + (lineIndex - (displayLines.length - 1) / 2) * 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  fontSize={isHovered ? "10" : "8"}
                  fontWeight={isHovered ? "600" : "500"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.05 }}
                >
                  {line}
                </motion.text>
              ))}
              {/* Show percentage on hover */}
              {isHovered && (
                <motion.text
                  x={x}
                  y={y + displayLines.length * 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="hsl(var(--primary))"
                  fontSize="9"
                  fontWeight="700"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {animatedLevels[index]}%
                </motion.text>
              )}
            </g>
          );
        })}

        {/* Center point */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="3"
          fill="hsl(var(--primary))"
          opacity="0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        />
      </svg>
    </motion.div>
  );
};