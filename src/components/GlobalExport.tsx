"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import Magnetic from "./Magnetic";
import { site, defaultGlobalExport, type GlobalExportContent } from "@/content/site";
import { cn } from "@/lib/utils";

export default function GlobalExport({ content = defaultGlobalExport }: { content?: GlobalExportContent }) {
  const [activeRegion, setActiveRegion] = useState(0);

  const regions = content.regions?.length ? content.regions : defaultGlobalExport.regions;
  const technicalSpecs = content.technicalSpecs?.length ? content.technicalSpecs : defaultGlobalExport.technicalSpecs;

  const validIndex = activeRegion < regions.length ? activeRegion : 0;
  const region = regions[validIndex] || regions[0];

  return (
    <section id="worldwide-export" className="relative scroll-mt-20 border-t border-ivory/10 bg-coal py-24 sm:py-32">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <Eyebrow>{content.eyebrow || "Worldwide Supply & Manufacturing"}</Eyebrow>
          <h2 className="display-tight mt-6 max-w-3xl font-display text-4xl text-ivory sm:text-6xl">
            <RevealWords text={content.titleLine1 || "Crafted in Pakistan."} />{" "}
            <span className="italic text-gold-grad">
              <RevealWords text={content.titleLine2 || "Worn in 20+ countries."} delay={0.25} />
            </span>
          </h2>
          <FadeUp delay={0.15} className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/65 sm:text-base">
            {content.sub || "From emerging designer studios in London and New York to established fashion houses in Dubai and Riyadh, Rafiq Sons Labels delivers bespoke garment trims with door-to-door express air couriers."}
          </FadeUp>
        </div>

        {/* Interactive Region Explorer */}
        <div className="mt-14">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {regions.map((r, idx) => (
              <button
                key={r.id || idx}
                onClick={() => setActiveRegion(idx)}
                className={cn(
                  "relative rounded-full border px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 sm:text-sm",
                  validIndex === idx
                    ? "border-gold bg-gold text-ink shadow-[0_8px_25px_-6px_rgba(198,161,91,0.4)]"
                    : "border-ivory/15 bg-ink/40 text-ivory/70 hover:border-ivory/40 hover:text-ivory"
                )}
              >
                <span className="mr-2">{r.flag}</span>
                {r.name}
              </button>
            ))}
          </div>

          {/* Active Region Card */}
          {region && (
            <AnimatePresence mode="wait">
              <motion.div
                key={region.id || validIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="glass-dark mt-8 rounded-3xl border border-ivory/15 p-6 sm:p-10 shadow-2xl"
              >
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{region.flag}</span>
                      <span className="eyebrow text-gold">{region.name} Logistics & Export</span>
                    </div>
                    <h3 className="font-display mt-3 text-2xl text-ivory sm:text-3xl">
                      Dedicated Air Dispatch to {region.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/70">{region.note}</p>

                    <div className="mt-6 space-y-3 rounded-2xl border border-ivory/10 bg-ink/60 p-4 text-xs">
                      <div className="flex items-start justify-between gap-4 border-b border-ivory/10 pb-2.5">
                        <span className="text-smoke">Key Delivery Hubs:</span>
                        <span className="text-right font-medium text-ivory">{region.hubs}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-smoke">Express Timeline:</span>
                        <span className="font-semibold text-gold">{region.timeline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-ivory/10 bg-ink/40 p-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-smoke">
                      Most Requested Crafts in this Region:
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {region.popular?.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-ivory/85">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold">
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-ivory/10">
                      <Magnetic strength={0.2}>
                        <a
                          href={`${site.whatsapp}?text=${encodeURIComponent(`Hi Rafiq Sons Labels, I am inquiring about shipping custom labels to ${region.name}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-sheen inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-bold text-ink shadow-md"
                        >
                          Inquire for {region.name} Shipping →
                        </a>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* B2B Manufacturing Specs & Weave Architecture Grid (Rich SEO Pillar) */}
        <div className="mt-20 sm:mt-28">
          <div className="text-center">
            <span className="eyebrow text-gold">Technical Specifications</span>
            <h3 className="font-display mt-3 text-3xl text-ivory sm:text-4xl">
              Precision Engineering for Garment Trims
            </h3>
            <p className="mt-2 text-xs text-smoke sm:text-sm">
              Standardized industry dimensions, custom folds, and high-density yarn configurations.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {technicalSpecs.map((group, gIdx) => (
              <FadeUp
                key={group.category || gIdx}
                delay={0.1 * gIdx}
                className="glass-dark flex flex-col justify-between rounded-2xl border border-ivory/10 p-6 sm:p-7"
              >
                <div>
                  <h4 className="font-display text-lg text-gold border-b border-ivory/10 pb-3">
                    {group.category}
                  </h4>
                  <div className="mt-5 space-y-4">
                    {group.items?.map((item) => (
                      <div key={item.name} className="text-xs">
                        <p className="font-semibold text-ivory">{item.name}</p>
                        <p className="mt-1 leading-relaxed text-ivory/60">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Bottom CTA Strip */}
        <FadeUp delay={0.2} className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-gold/30 bg-gold/5 p-6 sm:p-8">
          <div>
            <h4 className="font-display text-xl text-ivory sm:text-2xl">
              {content.ctaHeading || "Need custom samples delivered to your brand?"}
            </h4>
            <p className="mt-1 text-xs text-ivory/70 sm:text-sm">
              {content.ctaSub || "We provide free 24h digital mockups and worldwide physical sample packs upon request."}
            </p>
          </div>
          <Magnetic strength={0.25}>
            <button
              onClick={() => document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-sheen shrink-0 rounded-full bg-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-ink shadow-lg"
            >
              {content.ctaButton || "Get Free Digital Mockup"}
            </button>
          </Magnetic>
        </FadeUp>
      </div>
    </section>
  );
}
