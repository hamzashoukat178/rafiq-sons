"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import Image from "next/image";
import { easeLuxe, cn } from "@/lib/utils";
import Magnetic from "./Magnetic";
import { site as defaultSite } from "@/content/site";

const links = [
  { label: "Collections", href: "#collections" },
  { label: "Atelier", href: "#atelier" },
  { label: "Reels", href: "#reels" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
];

export default function Nav({ site = defaultSite }: { site?: typeof defaultSite }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 40)), [scrollY]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: easeLuxe, delay: 1.7 }}
        className={cn(
          "fixed inset-x-0 top-0 z-[110] transition-all duration-500",
          scrolled ? "glass-dark border-b border-ivory/10 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]" : "bg-transparent py-5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <button onClick={() => go("#top")} className="group flex items-center gap-3 text-left" aria-label={`${site.name}, back to top`}>
            <Image
              src="/brand/logo-wide-light.png"
              alt={`${site.name} logo`}
              width={140}
              height={44}
              priority
              className="h-9 w-auto transition-transform duration-500 group-hover:scale-[1.03] sm:h-10"
            />
            <span className="hidden border-l border-ivory/15 pl-3 text-[10px] uppercase leading-relaxed tracking-[0.28em] text-smoke md:block">
              Labels, tags<br />and packaging
            </span>
          </button>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="group relative text-[13px] font-medium tracking-wide text-ivory/70 transition-colors hover:text-ivory"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden sm:block">
              <button
                onClick={() => go("#quote")}
                className="btn-sheen rounded-full bg-gold px-5 py-2.5 text-[13px] font-semibold text-ink shadow-[0_4px_20px_rgba(198,161,91,0.4)] transition-transform hover:scale-[1.03]"
              >
                Request a quote
              </button>
            </Magnetic>
            <button
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-ivory/15 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }} className="h-px w-5 bg-ivory" />
              <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -3.5 : 0 }} className="h-px w-5 bg-ivory" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[105] flex flex-col justify-between bg-ink/98 px-6 pb-10 pt-28 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {[...links, { label: "Request a quote", href: "#quote" }].map((l, i) => (
                <motion.button
                  key={l.href + l.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: easeLuxe }}
                  onClick={() => go(l.href)}
                  className="hairline-t flex items-baseline justify-between py-4 text-left"
                >
                  <span className="font-display text-3xl text-ivory">{l.label}</span>
                  <span className="font-display text-xs italic text-gold">0{i + 1}</span>
                </motion.button>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3 border-t border-ivory/15 pt-6 text-xs text-smoke"
            >
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gold">
                <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                WhatsApp {site.phoneDisplay}
              </a>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="text-ivory/70 hover:text-gold">
                Instagram
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
