"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { stats } from "@/content/site";
import { FadeUp } from "./Reveal";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t0 = performance.now();
    let controls: { stop: () => void } | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let inZone = false;

    const start = () => {
      // hold the first count until the preloader has cleared
      const wait = Math.max(0, 2600 - (performance.now() - t0));
      timer = setTimeout(() => {
        controls = animate(0, to, {
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (v) => setVal(Math.round(v)),
        });
      }, wait);
    };
    const stop = (reset: boolean) => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (controls) {
        controls.stop();
        controls = null;
      }
      if (reset) setVal(0);
    };

    // hysteresis: start once 40% visible, reset only after it slips away under 10%
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!inZone && e.intersectionRatio >= 0.4) {
          inZone = true;
          start();
        } else if (inZone && e.intersectionRatio < 0.1) {
          inZone = false;
          stop(true);
        }
      },
      { threshold: [0, 0.1, 0.4] }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      stop(false);
    };
  }, [to]);

  const formatted = to >= 1000 ? `${(val / 1000).toFixed(val >= to ? 0 : 1)}K` : val.toLocaleString();
  return (
    <span ref={ref} className="font-display text-5xl text-ivory tabular-nums sm:text-6xl">
      {formatted}
      <span className="text-gold">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 px-5 sm:px-8 lg:grid-cols-4">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={0.08 * i} className="flex flex-col items-start gap-3 border-l border-ivory/12 pl-6">
            <Counter to={s.value} suffix={s.suffix} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-smoke">{s.label}</span>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
