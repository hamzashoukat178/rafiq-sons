"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[130] h-[2px] w-full origin-left bg-gradient-to-r from-gold-deep via-gold to-[#e8cf9a]"
      style={{ scaleX }}
    />
  );
}
