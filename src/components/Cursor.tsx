"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const dot = { x: useMotionValue(-100), y: useMotionValue(-100) };
  const ring = {
    x: useSpring(dot.x, { stiffness: 260, damping: 28, mass: 0.6 }),
    y: useSpring(dot.y, { stiffness: 260, damping: 28, mass: 0.6 }),
  };
  const [mode, setMode] = useState<"default" | "link" | "view">("default");
  const [enabled, setEnabled] = useState(false);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("no-cursor");

    const move = (e: MouseEvent) => {
      dot.x.set(e.clientX);
      dot.y.set(e.clientY);
      const t = e.target as HTMLElement;
      const view = t.closest("[data-cursor='view']");
      const link = t.closest("a, button, [role='button'], input, textarea, select, label");
      setMode(view ? "view" : link ? "link" : "default");
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("no-cursor");
    };
  }, [dot.x, dot.y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[220] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
        style={{ x: dot.x, y: dot.y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[219] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60"
        style={{ x: ring.x, y: ring.y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: mode === "view" ? 84 : mode === "link" ? 44 : 30,
          height: mode === "view" ? 84 : mode === "link" ? 44 : 30,
          backgroundColor: mode === "view" ? "rgba(198,161,91,0.92)" : "rgba(198,161,91,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <span
          ref={label}
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition-opacity duration-200"
          style={{ opacity: mode === "view" ? 1 : 0 }}
        >
          View
        </span>
      </motion.div>
    </>
  );
}
