"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { stats } from "@/content/site";
import { FadeUp } from "./Reveal";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate(0, to, {
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setVal(Math.round(v)),
          });
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  const formatted = to >= 1000 ? `${(val / 1000).toFixed(val >= to ? 0 : 1)}K` : val.toLocaleString();
  return (
    <span ref={ref} className="font-display text-5xl text-ivory tabular-nums sm:text-6xl font-bold">
      {formatted}
      <span className="text-gold ml-0.5">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 lg:py-28 border-y border-ivory/10">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 px-5 sm:px-8 lg:grid-cols-4">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={0.05 * i} className="flex flex-col items-start gap-3 border-l border-gold/40 pl-6">
            <Counter to={s.value} suffix={s.suffix} />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-ivory/70">{s.label}</span>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
