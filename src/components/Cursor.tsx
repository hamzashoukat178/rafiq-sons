"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const dot = { x: useMotionValue(-100), y: useMotionValue(-100) };
  const ring = {
    x: useSpring(dot.x, { stiffness: 350, damping: 28, mass: 0.5 }),
    y: useSpring(dot.y, { stiffness: 350, damping: 28, mass: 0.5 }),
  };
  const [mode, setMode] = useState<"default" | "link" | "view">("default");
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Only enable custom cursor on fine pointer devices (desktop mouse/trackpad)
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      dot.x.set(e.clientX);
      dot.y.set(e.clientY);
      if (!visible) setVisible(true);

      const t = e.target as HTMLElement;
      if (!t) return;
      const view = t.closest("[data-cursor='view']");
      const link = t.closest("a, button, [role='button'], input, textarea, select, label, .cursor-pointer");
      setMode(view ? "view" : link ? "link" : "default");
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [dot.x, dot.y, visible]);

  if (!enabled) return null;

  return (
    <>
      {/* Center Precision Gold Dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_10px_rgba(198,161,91,0.8)]"
        style={{
          x: dot.x,
          y: dot.y,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.2 } }}
      />

      {/* Outer Spring Luxury Ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99998] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 backdrop-blur-[0.5px]"
        style={{
          x: ring.x,
          y: ring.y,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: mode === "view" ? 84 : mode === "link" ? 46 : 32,
          height: mode === "view" ? 84 : mode === "link" ? 46 : 32,
          backgroundColor: mode === "view" ? "rgba(198,161,91,0.92)" : mode === "link" ? "rgba(198,161,91,0.15)" : "rgba(198,161,91,0.05)",
          borderColor: mode === "link" ? "rgba(198,161,91,0.9)" : "rgba(198,161,91,0.6)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        <span
          ref={label}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition-opacity duration-200"
          style={{ opacity: mode === "view" ? 1 : 0 }}
        >
          View
        </span>
      </motion.div>
    </>
  );
}
