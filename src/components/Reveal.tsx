"use client";

import { motion, type Variants } from "framer-motion";
import { easeLuxe, cn } from "@/lib/utils";

const wordVar: Variants = {
  hidden: { y: "110%", rotate: 2 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: 0.9, ease: easeLuxe, delay: 0.06 * i },
  }),
};

export function RevealWords({
  text,
  className,
  wordClass,
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  wordClass?: string;
  delay?: number;
  once?: boolean;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-12% 0px" }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <motion.span
            className={cn("inline-block will-change-transform", wordClass)}
            variants={wordVar}
            custom={i + delay * 10}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function FadeUp({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration: 0.95, ease: easeLuxe, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className, dark }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <FadeUp y={14} className={cn("flex items-center gap-3", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-dot" />
      <span className={cn("eyebrow", dark ? "text-ink/60" : "text-gold")}>{children}</span>
    </FadeUp>
  );
}
