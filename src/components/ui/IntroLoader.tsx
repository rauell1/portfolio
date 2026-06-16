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
          {/* Active Energy Loop Video to demonstrate active synchronization */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-[0.16] scale-105"
              src="https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-green-and-blue-light-particles-43187-large.mp4"
            />
            {/* Overlay to ensure maximum legibility for synchronizer data */}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
          </div>

          {/* Glowing high-tech laser scan line */}
          <motion.div
            initial={{ y: "-10%" }}
            animate={{ y: "110%" }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-40 blur-[0.5px] pointer-events-none z-10"
          />

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
            <div className="space-y-2 sm:max-w-xs">
              <div className="h-[5px] w-32 bg-primary/10 rounded-full overflow-hidden border border-primary/20 relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)"
                  }}
                />
              </div>
              <p className="font-mono-custom text-[10px] text-muted-foreground/60 tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                SYNCHRONIZING ENERGY GRID...
              </p>
            </div>

            {/* Percentage Count (grows brighter and glows when hitting 100%) */}
            <div 
              className="font-display font-light text-6xl sm:text-8xl md:text-9xl leading-none tracking-tighter select-none tabular-nums transition-all duration-500" 
              style={{ 
                WebkitTextStroke: "1px rgba(16, 185, 129, 0.25)",
                color: `rgba(16, 185, 129, ${0.03 + (progress / 100) * 0.12})`,
                textShadow: progress === 100 ? "0 0 35px rgba(16, 185, 129, 0.35)" : "none"
              }}
            >
              {progress.toString().padStart(3, "0")}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
