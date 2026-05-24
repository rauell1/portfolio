import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [hoverState, setHoverState] = useState<"default" | "hover" | "drag" | "view">("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Position of the mouse pointer
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Springs for the smooth, lagging outer ring trace
  const springConfig = { damping: 30, stiffness: 280, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if the current device is mobile/touch-only to bypass custom cursor
    const checkDevice = () => {
      const mobile = 
        window.matchMedia("(pointer: coarse)").matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (isMobile) return;

    // Track mouse coordinate changes
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    // Listen for mouse movement
    window.addEventListener("mousemove", moveCursor);

    // Dynamic hover selectors for elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const closestInteractive = target.closest("a, button, input[type='range'], [role='button'], .cursor-pointer, .glass-card");
      if (closestInteractive) {
        if (closestInteractive.tagName === "INPUT" || closestInteractive.classList.contains("slider-track")) {
          setHoverState("drag");
        } else if (closestInteractive.classList.contains("glass-card") || closestInteractive.classList.contains("projects-slide")) {
          setHoverState("view");
        } else {
          setHoverState("hover");
        }
      } else {
        setHoverState("default");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    // Hide cursor when leaving window
    const handleMouseLeave = () => setIsVisible(false);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible, isMobile]);

  if (isMobile) return null;

  // Visual variants for the spring-lagging outer circle ring
  const ringVariants = {
    default: {
      width: 24,
      height: 24,
      backgroundColor: "transparent",
      borderColor: "hsl(var(--primary) / 0.5)",
      borderWidth: 1.5,
    },
    hover: {
      width: 44,
      height: 44,
      backgroundColor: "hsl(var(--primary) / 0.12)",
      borderColor: "hsl(var(--primary))",
      borderWidth: 2,
    },
    drag: {
      width: 56,
      height: 56,
      backgroundColor: "hsl(var(--primary) / 0.15)",
      borderColor: "hsl(var(--primary))",
      borderWidth: 2,
    },
    view: {
      width: 52,
      height: 52,
      backgroundColor: "hsl(var(--primary) / 0.15)",
      borderColor: "hsl(var(--primary))",
      borderWidth: 2,
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      {/* Lagging outer circular ring */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full border text-[9px] font-mono-custom font-extrabold tracking-widest text-primary"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={ringVariants}
        animate={hoverState}
        initial="default"
      >
        {hoverState === "drag" && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>DRAG</motion.span>
        )}
        {hoverState === "view" && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>VIEW</motion.span>
        )}
      </motion.div>

      {/* Snap-aligned sharp center pointer dot */}
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-primary"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          display: isVisible ? "block" : "none",
        }}
      />
    </div>
  );
};
