"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs as defaultFaqs, site } from "@/content/site";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import { easeLuxe, cn } from "@/lib/utils";
import Magnetic from "./Magnetic";

export default function Faq({ items }: { items?: typeof defaultFaqs }) {
  const faqs = items?.length ? items : defaultFaqs;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-ivory/10 bg-ink py-24 text-ivory lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.35fr] lg:gap-24">
        {/* Left Column: Sticky Title & Quick WhatsApp Help Card */}
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="display-tight mt-6 font-display text-4xl sm:text-5xl">
            <RevealWords text="Questions," /> <br />
            <span className="italic text-gold-grad">
              <RevealWords text="answered." delay={0.25} />
            </span>
          </h2>
          
          <FadeUp delay={0.15} className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60 sm:text-base">
            Everything you need to know about order minimums, digital proofing, turnaround times, and international courier delivery.
          </FadeUp>

          {/* Quick Help Card */}
          <FadeUp delay={0.25} className="glass-dark mt-8 rounded-2xl border border-gold/30 p-6">
            <span className="eyebrow text-[10px] text-gold">Have a specific design?</span>
            <p className="mt-2 text-sm text-ivory/80">
              Send your artwork directly on WhatsApp for an immediate assessment and quote.
            </p>
            <Magnetic strength={0.2} className="mt-4">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-sheen inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-ink"
              >
                <span>Chat on WhatsApp {site.phoneDisplay}</span>
                <span>→</span>
              </a>
            </Magnetic>
          </FadeUp>
        </div>

        {/* Right Column: Interactive Accordion */}
        <div className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeUp
                key={f.q}
                delay={0.06 * i}
                className={cn(
                  "glass-dark overflow-hidden rounded-2xl border transition-all duration-300",
                  isOpen ? "border-gold/50 bg-coal/90 shadow-[0_10px_30px_-10px_rgba(198,161,91,0.2)]" : "border-ivory/10 hover:border-ivory/25"
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={cn("font-display text-lg sm:text-xl transition-colors", isOpen ? "text-gold" : "text-ivory")}>
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: easeLuxe }}
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base font-bold transition-colors",
                      isOpen ? "border-gold bg-gold text-ink" : "border-ivory/20 text-ivory/60"
                    )}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: easeLuxe }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-ivory/10 px-6 pb-6 pt-4 text-sm leading-relaxed text-ivory/65">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
