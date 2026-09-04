"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gallery as defaultGallery } from "@/content/site";
import { Eyebrow, FadeUp } from "./Reveal";
import { easeLuxe, cn } from "@/lib/utils";

type Item = { src: string; tag: string; tall?: boolean };

export default function Gallery({ items: itemsProp }: { items?: Item[] }) {
  const gallery = itemsProp?.length ? itemsProp : defaultGallery;
  const tags = useMemo(() => ["All", ...Array.from(new Set(gallery.map((g) => g.tag)))], [gallery]); // eslint-disable-line react-hooks/exhaustive-deps
  const [tag, setTag] = useState("All");
  const items = useMemo(() => gallery.filter((g) => tag === "All" || g.tag === tag), [tag]);
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

  return (
    <section id="gallery" className="scroll-mt-20 bg-ivory py-24 text-ink lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow dark>The showroom</Eyebrow>
            <h2 className="display-tight mt-7 max-w-2xl font-display text-4xl sm:text-6xl">
              Work we are <span className="italic text-gold-deep">quietly proud of.</span>
            </h2>
          </div>
          <FadeUp className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors",
                  tag === t ? "border-ink bg-ink text-ivory" : "border-ink/15 text-ink/55 hover:border-ink/40 hover:text-ink"
                )}
              >
                {t}
              </button>
            ))}
          </FadeUp>
        </div>

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
                className="group relative block w-full overflow-hidden rounded-xl text-left"
                data-cursor="view"
              >
                <Image
                  src={g.src}
                  alt={`${g.tag} by Rafiq Sons Labels`}
                  width={700}
                  height={g.tall ? 1050 : 700}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 translate-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.tag}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {open !== null && items[open] && (
          <motion.div
            className="fixed inset-0 z-[150] flex flex-col bg-ink/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="flex items-center justify-between px-5 py-4 text-ivory/70 sm:px-8">
              <span className="text-xs uppercase tracking-[0.24em]">{items[open].tag}</span>
              <span className="font-display text-sm italic text-gold">
                {open + 1} / {items.length}
              </span>
              <button onClick={close} aria-label="Close viewer" className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 text-ivory hover:border-gold hover:text-gold">
                ✕
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-6" onClick={(e) => e.stopPropagation()}>
              <motion.div
                key={items[open].src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: easeLuxe }}
                className="relative h-full max-h-[76vh] w-full max-w-4xl"
              >
                <Image
                  src={items[open].src}
                  alt={items[open].tag}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
              <button
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold sm:left-8"
              >
                ←
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold sm:right-8"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
