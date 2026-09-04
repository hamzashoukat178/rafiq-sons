"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { atelierProcess as process } from "@/content/site";
import { Eyebrow, FadeUp } from "./Reveal";

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 65%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const imgY = useTransform(useScroll({ target: ref, offset: ["start end", "end start"] }).scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} id="atelier" className="relative scroll-mt-20 overflow-hidden bg-coal py-24 lg:py-36">
      <motion.div style={{ y: imgY }} className="absolute inset-[-12%] opacity-25">
        <Image
          src={process.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-coal via-coal/80 to-coal" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Eyebrow>{process.eyebrow}</Eyebrow>
          <h2 className="display-tight mt-7 font-display text-4xl text-ivory sm:text-6xl">{process.title}</h2>
        </div>

        <div className="relative mt-16 lg:mt-24">
          <div className="absolute bottom-0 left-[7px] top-2 w-px bg-ivory/10 sm:left-[9px]" />
          <motion.div style={{ scaleY: line }} className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gold sm:left-[9px]" />

          <div className="flex flex-col gap-14 lg:gap-20">
            {process.steps.map((s, i) => (
              <FadeUp key={s.n} delay={0.05 * i} className="relative grid gap-4 pl-12 sm:pl-16 lg:grid-cols-[220px_1fr] lg:gap-16">
                <span className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-gold/60 bg-coal sm:h-[19px] sm:w-[19px]">
                  <span className="h-[5px] w-[5px] rounded-full bg-gold" />
                </span>
                <span className="font-display text-5xl italic text-ivory/25 sm:text-6xl">{s.n}</span>
                <div className="max-w-xl pb-2">
                  <h3 className="font-display text-2xl text-ivory sm:text-3xl">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-ivory/55">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
