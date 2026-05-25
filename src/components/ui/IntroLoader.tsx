import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Scroll Lock on Mount
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`; // prevent layout shift

    // Progress counter animation
    const duration = 2400; // 2.4s total load
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          setIsExiting(true);
        }, 300);
      } else {
        setProgress(Math.floor(currentProgress));
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleExitComplete = () => {
    // Restore Scroll
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    onComplete();
  };

  const nameLetters = "ROY OTIENO".split("");

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%", 
            transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black text-white p-8 sm:p-12"
        >
          {/* Futuristic grid overlay background */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
              backgroundSize: "40px 40px"
            }}
          />

          {/* Top Info Header */}
          <div className="flex justify-between items-start font-mono-custom text-[10px] sm:text-xs text-muted-foreground/60 tracking-widest relative z-10">
            <div>SYSTEM: SAFARICHARGE_OPTIMIZER</div>
            <div>STATUS: ONLINE_SYNC</div>
          </div>

          {/* Centered Name Animation */}
          <div className="flex flex-col items-center justify-center flex-1 relative z-10">
            <div className="flex overflow-hidden mb-2">
              {nameLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className={`font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight ${
                    char === " " ? "mr-4 sm:mr-6" : ""
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.8, duration: 1.0 }}
              className="font-mono-custom text-[9px] sm:text-[11px] tracking-[0.3em] uppercase text-center mt-2"
            >
              Clean Mobility &amp; Energy Systems Specialist
            </motion.p>
          </div>

          {/* Progress Indicator Footer */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
            {/* Action Label */}
            <div className="space-y-1.5 sm:max-w-xs">
              <div className="h-1 w-24 bg-primary/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="font-mono-custom text-[10px] text-muted-foreground/60 tracking-wider">
                SYNCHRONIZING ENERGY GRID...
              </p>
            </div>

            {/* Percentage Count */}
            <div className="font-display font-light text-6xl sm:text-8xl md:text-9xl leading-none tracking-tighter select-none tabular-nums text-primary/10 stroke-primary/30" style={{ WebkitTextStroke: "1px rgba(16, 185, 129, 0.2)" }}>
              {progress.toString().padStart(3, "0")}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
