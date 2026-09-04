"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials as defaultTestimonials } from "@/content/site";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import { easeLuxe } from "@/lib/utils";

function StarRating() {
  return (
    <div className="flex items-center gap-1 text-gold">
      {[...Array(5)].map((_, idx) => (
        <svg key={idx} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ items }: { items?: typeof defaultTestimonials }) {
  const testimonials = items?.length ? items : defaultTestimonials;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[i % testimonials.length];

  const next = useCallback(() => setI((v) => (v + 1) % testimonials.length), [testimonials.length]);
  const prev = () => setI((v) => (v - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6500);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <section
      className="relative overflow-hidden border-t border-ivory/10 bg-coal py-24 text-ivory lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/6 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Eyebrow>Client experiences</Eyebrow>
          <h2 className="display-tight mt-6 font-display text-4xl sm:text-6xl">
            <RevealWords text="Loved by the brands" />{" "}
            <span className="italic text-gold-grad">
              <RevealWords text="we weave for." delay={0.25} />
            </span>
          </h2>
        </div>

        {/* Testimonial Display Card */}
        <div className="glass-dark relative mt-12 min-h-[22rem] rounded-3xl border border-ivory/10 p-8 sm:min-h-[19rem] sm:p-12">
          <div className="flex items-center justify-between">
            <StarRating />
            <span className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Verified Brand Order
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: easeLuxe }}
              className="mt-6"
            >
              <blockquote className="font-display text-2xl leading-relaxed text-ivory sm:text-3xl">
                “{t.quote}”
              </blockquote>
              
              <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ivory/10 pt-6">
                <span className="font-display text-lg font-semibold text-gold">{t.city}</span>
                <span className="h-1 w-1 rounded-full bg-ivory/30" />
                <span className="text-sm text-ivory/70">{t.role}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Navigation Dots and Controls */}
        <FadeUp className="mt-10 flex items-center justify-between">
          <div className="flex gap-2.5">
            {testimonials.map((_, d) => (
              <button
                key={d}
                onClick={() => setI(d)}
                aria-label={`Go to review ${d + 1}`}
                className="group relative h-2 w-12 overflow-hidden rounded-full bg-ivory/15"
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gold transition-all duration-500"
                  style={{ width: d === i ? "100%" : d < i ? "100%" : "0%", opacity: d === i ? 1 : 0.35 }}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 bg-ink text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              ←
            </button>
            <button
              onClick={next}
              aria-label="Next review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 bg-ink text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              →
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
