import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const CustomCursor = () => {
  const [hoverState, setHoverState] = useState<"default" | "hover" | "drag">("default");
  const [isMobile, setIsMobile] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for lag-trailing physics
  // The dot is highly responsive
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 35 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 35 });

  // The outer ring lags behind elegantly
  const ringX = useSpring(mouseX, { stiffness: 220, damping: 26 });
  const ringY = useSpring(mouseY, { stiffness: 220, damping: 26 });

  useEffect(() => {
    // Check if the user is on a touch device
    const checkTouch = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(isCoarse);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const clickable = target.closest("a, button, [role='button'], .cursor-pointer");
      const draggable = target.closest("[data-cursor='drag'], .draggable-slider");

      if (draggable) {
        setHoverState("drag");
      } else if (clickable) {
        setHoverState("hover");
      } else {
        setHoverState("default");
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsHidden(true);
    };

    const handleMouseEnterWindow = () => {
      setIsHidden(false);
    };

    const handleMouseDown = () => {
      // Scale down dot on click
      const dot = document.getElementById("custom-cursor-dot");
      const ring = document.getElementById("custom-cursor-ring");
      if (dot) dot.style.transform = "translate(-50%, -50%) scale(0.6)";
      if (ring) ring.style.transform = "translate(-50%, -50%) scale(0.85)";
    };

    const handleMouseUp = () => {
      const dot = document.getElementById("custom-cursor-dot");
      const ring = document.getElementById("custom-cursor-ring");
      if (dot) dot.style.transform = "translate(-50%, -50%) scale(1)";
      if (ring) ring.style.transform = "translate(-50%, -50%) scale(1)";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
    };
  }, [mouseX, mouseY]);

  if (isMobile || isHidden) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Lag-trailing outer ring */}
      <motion.div
        id="custom-cursor-ring"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          width: hoverState === "drag" ? 72 : hoverState === "hover" ? 56 : 32,
          height: hoverState === "drag" ? 72 : hoverState === "hover" ? 56 : 32,
          backgroundColor:
            hoverState === "drag"
              ? "rgba(16, 185, 129, 0.9)" // solid/semi-solid green for drag
              : hoverState === "hover"
              ? "rgba(16, 185, 129, 0.15)" // soft primary glow
              : "rgba(16, 185, 129, 0)", // transparent default
          borderColor:
            hoverState === "drag"
              ? "rgb(16, 185, 129)"
              : hoverState === "hover"
              ? "rgba(16, 185, 129, 0.8)"
              : "rgba(16, 185, 129, 0.5)",
          borderWidth: hoverState === "drag" ? 0 : 1.5,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.8 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid pointer-events-none flex items-center justify-center transition-transform duration-100"
      >
        <AnimatePresence>
          {hoverState === "drag" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[9px] font-mono-custom font-extrabold uppercase tracking-widest text-black"
            >
              DRAG
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Instant inner dot */}
      <motion.div
        id="custom-cursor-dot"
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          scale: hoverState === "drag" ? 0 : hoverState === "hover" ? 0.3 : 1,
          opacity: hoverState === "drag" ? 0 : 1,
        }}
        className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full pointer-events-none transition-transform duration-100"
      />
    </div>
  );
};
