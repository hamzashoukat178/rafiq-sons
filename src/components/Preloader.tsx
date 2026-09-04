"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { easeLuxe } from "@/lib/utils";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(tick);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: easeLuxe }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            className="flex flex-col items-center"
          >
            <Image
              src="/brand/logo-wide-light.png"
              alt="Rafiq Sons"
              width={300}
              height={99}
              priority
              className="h-16 w-auto sm:h-20"
            />
            <div className="eyebrow mt-6 text-smoke">Woven with intent</div>
          </motion.div>
          <div className="absolute bottom-10 left-1/2 w-[min(420px,72vw)] -translate-x-1/2">
            <div className="mb-3 flex items-end justify-between">
              <span className="eyebrow text-[10px] text-smoke">Threading the loom</span>
              <span className="font-display text-2xl text-gold tabular-nums">{count}</span>
            </div>
            <div className="h-px w-full bg-ivory/10">
              <motion.div
                className="h-px bg-gold"
                style={{ width: `${count}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
