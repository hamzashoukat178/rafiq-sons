"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials as defaultTestimonials } from "@/content/site";
import { Eyebrow, FadeUp } from "./Reveal";
import { easeLuxe } from "@/lib/utils";

export default function Testimonials({ items }: { items?: typeof defaultTestimonials }) {
  const testimonials = items?.length ? items : defaultTestimonials;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[i % testimonials.length];

  const next = useCallback(() => setI((v) => (v + 1) % testimonials.length), [testimonials.length]);
  const prev = () => setI((v) => (v - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <section
      className="relative overflow-hidden bg-cream py-24 text-ink lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/15 blur-[100px]" />
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Eyebrow dark>Kind words</Eyebrow>

        <div className="relative mt-10 min-h-[19rem] sm:min-h-[16rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.65, ease: easeLuxe }}
            >
              <span className="font-display text-7xl leading-none text-gold-deep/40">“</span>
              <blockquote className="mt-2 font-display text-2xl leading-snug sm:text-4xl">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-semibold">{t.city}</span>
                <span className="h-1 w-1 rounded-full bg-ink/30" />
                <span className="text-sm text-ink/55">{t.role}</span>
                {t.sample && (
                  <span className="rounded-full border border-gold-deep/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                    Sample review, replace with yours
                  </span>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <FadeUp className="mt-10 flex items-center justify-between">
          <div className="flex gap-2.5">
            {testimonials.map((_, d) => (
              <button
                key={d}
                onClick={() => setI(d)}
                aria-label={`Go to review ${d + 1}`}
                className="group relative h-1.5 w-10 overflow-hidden rounded-full bg-ink/15"
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gold-deep transition-all duration-500"
                  style={{ width: d === i ? "100%" : d < i ? "100%" : "0%", opacity: d === i ? 1 : 0.35 }}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={prev} aria-label="Previous review" className="h-11 w-11 rounded-full border border-ink/20 transition-colors hover:border-gold-deep hover:text-gold-deep">←</button>
            <button onClick={next} aria-label="Next review" className="h-11 w-11 rounded-full border border-ink/20 transition-colors hover:border-gold-deep hover:text-gold-deep">→</button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
