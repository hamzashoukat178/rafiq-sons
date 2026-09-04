"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import { manifesto as defaultManifesto } from "@/content/site";

export default function Manifesto({
  manifesto = defaultManifesto,
}: {
  manifesto?: typeof defaultManifesto;
}) {
  const imgWrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -12, scale: 1.18 },
        {
          yPercent: 12,
          scale: 1.02,
          ease: "none",
          scrollTrigger: { trigger: imgWrap.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
    }, imgWrap);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-ivory text-ink">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:py-36">
        <div className="flex flex-col justify-center">
          <Eyebrow dark>{manifesto.eyebrow}</Eyebrow>
          <h2 className="display-tight mt-7 font-display text-4xl leading-[1.04] sm:text-5xl lg:text-[3.6rem]">
            <RevealWords text={manifesto.big[0]} />{" "}
            <span className="italic text-gold-deep">
              <RevealWords text={manifesto.big[1]} delay={0.3} />
            </span>
          </h2>
          <FadeUp delay={0.25} className="mt-8 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg">
            {manifesto.body}
          </FadeUp>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {manifesto.points.map((p, i) => (
              <FadeUp key={p} delay={0.1 * i} className="hairline-t-light pt-4">
                <span className="font-display text-sm italic text-gold-deep">0{i + 1}</span>
                <p className="mt-1 text-sm font-semibold text-ink/80">{p}</p>
              </FadeUp>
            ))}
          </div>
        </div>

        <div ref={imgWrap} className="relative overflow-hidden rounded-2xl shadow-[0_40px_90px_-30px_rgba(12,11,9,0.5)]">
          <div ref={img} className="relative h-[26rem] will-change-transform sm:h-[32rem] lg:h-full lg:min-h-[34rem]">
            <Image
              src={manifesto.image}
              alt="Custom labels craftsmanship"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 glass-dark rounded-xl px-5 py-4">
            <p className="font-display text-sm italic text-gold">Custom crafted for apparel brands</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-ivory/60">Made to client artwork</p>
          </div>
        </div>
      </div>
    </section>
  );
}
