"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { easeLuxe } from "@/lib/utils";
import { hero as defaultHero, stats as defaultStats } from "@/content/site";
import { RevealWords } from "./Reveal";
import Magnetic from "./Magnetic";

const D = 1.9; // base delay after preloader

export default function Hero({ hero = defaultHero, stats = defaultStats }: { hero?: typeof defaultHero; stats?: typeof defaultStats }) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const orbX = useTransform(sx, (v) => v * 60);
  const orbY = useTransform(sy, (v) => v * -40);
  const orb2X = useTransform(sx, (v) => v * -80);
  const orb2Y = useTransform(sy, (v) => v * 50);
  const glowX = useTransform(sx, (v) => v * 24);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const vidY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const goQuote = () => document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
  const goCollections = () => document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} id="top" onMouseMove={onMove} className="relative flex min-h-svh flex-col overflow-hidden">
      {/* ambient video */}
      <motion.div style={{ y: vidY }} className="absolute inset-[-10%] will-change-transform">
        <video
          className="h-full w-full object-cover opacity-45"
          src={hero.video}
          poster={hero.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/35 to-ink" />
      <div className="vignette absolute inset-0" />

      {/* floating light */}
      <motion.div aria-hidden style={{ x: orbX, y: orbY }} className="absolute -left-40 top-1/4">
        <div className="h-[34rem] w-[34rem] rounded-full bg-gold/14 blur-[130px] animate-float-slow" />
      </motion.div>
      <motion.div aria-hidden style={{ x: orb2X, y: orb2Y }} className="absolute -right-32 bottom-1/4">
        <div className="h-[28rem] w-[28rem] rounded-full bg-[#5e4a22]/40 blur-[120px]" />
      </motion.div>

      {/* gold thread line following mouse */}
      <motion.div
        aria-hidden
        style={{ x: glowX }}
        className="absolute left-1/2 top-[16%] h-px w-[42rem] max-w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pt-28 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D, duration: 0.9, ease: easeLuxe }}
          className="eyebrow mb-8 max-w-xl text-gold/90"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="display-tight font-display text-[13.5vw] leading-[0.95] text-ivory sm:text-[11vw] lg:text-[7.6rem]">
          <span className="block">
            <RevealWords text={hero.line1} delay={0.55} />
          </span>
          <span className="block italic">
            <RevealWords text={hero.line2} delay={0.75} wordClass="text-gold-grad pr-3" />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: D + 0.55, duration: 1, ease: easeLuxe }}
          className="mt-8 max-w-xl text-base leading-relaxed text-ivory/65 sm:text-lg"
        >
          {hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D + 0.8, duration: 1, ease: easeLuxe }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic strength={0.3}>
            <button
              onClick={goQuote}
              className="btn-sheen group relative rounded-full bg-gold px-8 py-4 text-sm font-semibold text-ink shadow-[0_18px_50px_-12px_rgba(198,161,91,0.55)] transition-transform hover:scale-[1.02]"
            >
              {hero.ctaPrimary}
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </Magnetic>
          <Magnetic strength={0.3}>
            <button
              onClick={goCollections}
              className="rounded-full border border-ivory/20 px-8 py-4 text-sm font-medium text-ivory/85 backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-ivory"
            >
              {hero.ctaSecondary}
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D + 1.1, duration: 1 }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8"
      >
        <div className="hairline-t flex flex-wrap items-center justify-between gap-4 pt-5">
          <div className="flex items-center gap-3 text-xs text-smoke">
            <span className="relative flex h-8 w-5 items-start justify-center rounded-full border border-ivory/25 p-1.5">
              <motion.span
                animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1 rounded-full bg-gold"
              />
            </span>
            Scroll to enter the atelier
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="font-display text-lg text-gold">{s.display}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-smoke">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
