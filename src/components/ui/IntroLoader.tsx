import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface IntroLoaderProps {
  onFinished: () => void;
}

export const IntroLoader = ({ onFinished }: IntroLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    // Elegant dynamic progression simulating grid sync load times
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShouldExit(true);
            setTimeout(onFinished, 700); // Allow fade/slide exit animation to play
          }, 400);
          return 100;
        }
        
        // Simulates realistic progressive data loading speed steps
        const step = Math.floor(Math.random() * 8) + 2; 
        return Math.min(prev + step, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          key="loader-container"
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%", 
            opacity: 0,
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-foreground"
        >
          {/* Subtle background grids */}
          <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

          <div className="text-center space-y-6 relative z-10 px-6">
            {/* Header / Loading identity */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-primary/70 uppercase font-mono-custom"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              ROY OTIENO // SYSTEMS ENGINEER
            </motion.div>

            {/* Core Narrative Text with Playfair Display italic contrast */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-3xl md:text-5xl font-display font-bold leading-tight"
            >
              Powering <span className="font-editorial italic font-normal text-primary">Clean Energy</span> & E-Mobility
            </motion.h1>

            {/* Simulated Loading Grid Status */}
            <div className="pt-8 space-y-3">
              <motion.div 
                className="w-48 md:w-64 h-1 bg-white/5 rounded-full overflow-hidden mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </motion.div>

              <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground tracking-widest font-mono-custom uppercase">
                <span className="text-primary font-bold text-lg leading-none">{progress}%</span>
                <span>SYNCHRONIZING ENERGY GRID...</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
