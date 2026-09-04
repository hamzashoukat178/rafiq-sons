"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs as defaultFaqs } from "@/content/site";
import { Eyebrow, FadeUp } from "./Reveal";
import { easeLuxe, cn } from "@/lib/utils";

export default function Faq({ items }: { items?: typeof defaultFaqs }) {
  const faqs = items?.length ? items : defaultFaqs;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-ivory py-24 text-ink lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <div>
          <Eyebrow dark>Questions, answered</Eyebrow>
          <h2 className="display-tight mt-7 font-display text-4xl sm:text-5xl">
            Everything brands <span className="italic text-gold-deep">ask us first.</span>
          </h2>
          <FadeUp delay={0.2} className="mt-6 max-w-sm text-ink/55">
            Something more specific? Message us on WhatsApp and a real person replies, usually within the hour.
          </FadeUp>
        </div>

        <div>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={f.q} delay={0.05 * i} className="hairline-t-light last:border-b last:border-ink/12">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-xl sm:text-2xl">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: easeLuxe }}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg transition-colors",
                      isOpen ? "border-gold-deep bg-gold-deep text-ivory" : "border-ink/20 text-ink/60"
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
                      transition={{ duration: 0.5, ease: easeLuxe }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-7 leading-relaxed text-ink/60">{f.a}</p>
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
