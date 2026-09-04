"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import Magnetic from "./Magnetic";
import { defaultContent } from "@/lib/content";

export default function Philosophy({
  philosophy = defaultContent.philosophy,
}: {
  philosophy?: { eyebrow?: string; heading1?: string; heading2?: string; body?: string; image?: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const eyebrow = philosophy?.eyebrow || defaultContent.philosophy.eyebrow;
  const heading1 = philosophy?.heading1 || defaultContent.philosophy.heading1;
  const heading2 = philosophy?.heading2 || defaultContent.philosophy.heading2;
  const body = philosophy?.body || defaultContent.philosophy.body;
  const image = philosophy?.image || defaultContent.philosophy.image;

  const goQuote = () => document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} className="relative flex min-h-[85vh] items-center overflow-hidden border-y border-ivory/10 bg-ink py-24 sm:py-32">
      {/* Background Image with Parallax */}
      <motion.div style={{ y: imgY }} className="absolute inset-[-15%]">
        <Image
          src={image}
          alt="Luxury woven label detail"
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover opacity-35 filter brightness-50 contrast-125"
        />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/75" />
        <div className="vignette absolute inset-0" />
      </motion.div>

      {/* Ambient glowing orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[130px]" />

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <div className="flex justify-center">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>

        <h2 className="display-tight mx-auto mt-8 font-display text-4xl leading-[1.08] text-ivory sm:text-6xl lg:text-7xl">
          <RevealWords text={heading1} />{" "}
          <span className="block italic text-gold-grad">
            <RevealWords text={heading2} delay={0.3} />
          </span>
        </h2>

        <FadeUp delay={0.3} className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ivory/65 sm:text-lg">
          {body}
        </FadeUp>

        <FadeUp delay={0.45} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic strength={0.25}>
            <button
              onClick={goQuote}
              className="btn-sheen rounded-full bg-gold px-8 py-4 text-sm font-semibold text-ink shadow-[0_12px_40px_-10px_rgba(198,161,91,0.5)]"
            >
              Start your custom order
            </button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <a
              href="#collections"
              className="rounded-full border border-ivory/20 px-8 py-4 text-sm font-medium text-ivory/80 backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              View all 8 crafts
            </a>
          </Magnetic>
        </FadeUp>
      </div>
    </section>
  );
}
