"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gallery as defaultGallery, site } from "@/content/site";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import { easeLuxe, cn } from "@/lib/utils";
import Magnetic from "./Magnetic";

type Item = { src: string; tag: string; tall?: boolean };

export default function Gallery({ items: itemsProp }: { items?: Item[] }) {
  const gallery = itemsProp?.length ? itemsProp : defaultGallery;
  const tags = useMemo(() => ["All", ...Array.from(new Set(gallery.map((g) => g.tag)))], [gallery]);
  const [tag, setTag] = useState("All");
  const items = useMemo(() => gallery.filter((g) => tag === "All" || g.tag === tag), [tag, gallery]);
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  const currentItem = open !== null ? items[open] : null;

  return (
    <section id="gallery" className="scroll-mt-20 border-t border-ivory/10 bg-ink py-24 text-ivory lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>The showroom</Eyebrow>
            <h2 className="display-tight mt-6 max-w-2xl font-display text-4xl sm:text-6xl">
              <RevealWords text="Work we are" />{" "}
              <span className="italic text-gold-grad">
                <RevealWords text="quietly proud of." delay={0.25} />
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/60 sm:text-base">
              A curated look into our production workbench. Every piece represents client artwork brought to life with precision weaving and luxury printing.
            </p>
          </div>

          <FadeUp className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[12px] font-semibold transition-all duration-300",
                  tag === t
                    ? "border-gold bg-gold text-ink"
                    : "border-ivory/15 bg-coal/60 text-ivory/70 hover:border-gold/40 hover:text-ivory"
                )}
              >
                {t}
              </button>
            ))}
          </FadeUp>
        </div>

        {/* Responsive Masonry / Columns Grid */}
        <motion.div layout className="mt-14 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          <AnimatePresence mode="popLayout">
            {items.map((g, i) => (
              <motion.button
                layout
                key={g.src}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: "-4% 0px" }}
                transition={{ duration: 0.7, ease: easeLuxe }}
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-ivory/10 bg-coal text-left transition-all duration-500 hover:border-gold/60 hover:shadow-[0_15px_40px_-10px_rgba(198,161,91,0.25)]"
              >
                <div className={cn("relative w-full overflow-hidden", g.tall ? "aspect-[3/4.2]" : "aspect-[4/3.2]")}>
                  <Image
                    src={g.src}
                    alt={`${g.tag} example by Rafiq Sons Labels`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="glass-dark rounded-full px-3 py-1 text-[10px] uppercase tracking-wider text-gold">
                      {g.tag}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs text-ink">
                      🔍
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal with Zoom & Navigation */}
      <AnimatePresence>
        {open !== null && currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-2xl sm:p-8"
            onClick={close}
          >
            {/* Close Button */}
            <button
              onClick={close}
              aria-label="Close lightbox"
              className="absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 bg-coal/80 text-xl text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              ✕
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-coal/80 text-xl text-ivory transition-colors hover:border-gold hover:text-gold sm:left-8"
            >
              ←
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-coal/80 text-xl text-ivory transition-colors hover:border-gold hover:text-gold sm:right-8"
            >
              →
            </button>

            {/* Content Container */}
            <motion.div
              key={currentItem.src}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ ease: easeLuxe, duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-dark relative flex max-h-[85vh] max-w-4xl flex-col items-center overflow-hidden rounded-3xl border border-ivory/15 bg-coal p-4 sm:p-6"
            >
              <div className="relative aspect-[4/3] max-h-[60vh] w-full max-w-2xl overflow-hidden rounded-2xl">
                <Image
                  src={currentItem.src}
                  alt={currentItem.tag}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-4 border-t border-ivory/10 pt-4">
                <div>
                  <span className="eyebrow text-[10px] text-gold">{currentItem.tag}</span>
                  <p className="mt-0.5 font-display text-lg text-ivory">Crafted by Rafiq Sons Labels</p>
                </div>

                <div className="flex items-center gap-3">
                  <Magnetic strength={0.2}>
                    <a
                      href={`${site.whatsapp}?text=${encodeURIComponent(`Hi Rafiq Sons, I am interested in ordering custom ${currentItem.tag} similar to the showroom photo.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-sheen rounded-full bg-gold px-6 py-2.5 text-xs font-semibold text-ink"
                    >
                      Inquire About This Style
                    </a>
                  </Magnetic>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
