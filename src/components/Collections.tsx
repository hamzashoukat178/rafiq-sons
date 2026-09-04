"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { easeLuxe, cn } from "@/lib/utils";
import { products as defaultProducts, type Product } from "@/content/site";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import Magnetic from "./Magnetic";

const filters = [
  { id: "all", label: "Everything" },
  { id: "labels", label: "Labels" },
  { id: "tags", label: "Tags and cards" },
  { id: "finishing", label: "Finishing and packaging" },
] as const;

type FilterId = (typeof filters)[number]["id"];

const labelSlugs = ["woven-labels", "satin-labels", "heat-press", "satin", "woven", "printed-labels"];
const tagSlugs = ["hang-tags", "thank-you-cards", "business-cards", "cards"];
const finishSlugs = ["stickers", "packaging", "patches"];

function TiltImage({ product, priority }: { product: Product; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 180, damping: 20 });

  return (
    <div style={{ perspective: 1100 }} className="[grid-area:1/1]">
      <motion.div
        ref={ref}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative aspect-[4/3.4] overflow-hidden rounded-2xl border border-ivory/10 bg-coal transition-colors duration-500 hover:border-gold/50"
      >
        <motion.div style={{ translateZ: 0 }} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name + " crafted by Rafiq Sons Labels"}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
          <span className="glass-dark rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            {product.tag}
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 bg-ink/40 text-ivory opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
            ↗
          </span>
        </div>
        <span className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(245,241,232,0.12)]" />
      </motion.div>
    </div>
  );
}

function ProductRow({ product, index }: { product: Product; index: number }) {
  const even = index % 2 === 0;
  const quoteThis = () => {
    window.dispatchEvent(new CustomEvent("quote:product", { detail: product.name }));
    document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: easeLuxe }}
      className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      <div className={cn(!even && "lg:order-2", "grid")}>
        <TiltImage product={product} priority={index === 0} />
      </div>
      <div className={cn(!even && "lg:order-1")}>
        <FadeUp className="flex items-baseline gap-4">
          <span className="font-display text-sm italic text-gold">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-gold/40" />
        </FadeUp>
        <h3 className="display-tight mt-4 font-display text-4xl text-ivory sm:text-5xl">
          <RevealWords text={product.name} />
        </h3>
        <FadeUp delay={0.1} className="mt-5 max-w-md text-base leading-relaxed text-ivory/60">
          {product.description}
        </FadeUp>
        <FadeUp delay={0.16} className="mt-5 max-w-md border-l border-gold/30 pl-4 text-sm leading-relaxed text-ivory/45">
          {product.detail}
        </FadeUp>
        <FadeUp delay={0.22} className="mt-8 flex flex-wrap items-center gap-6">
          <Magnetic strength={0.25}>
            <button
              onClick={quoteThis}
              className="btn-sheen rounded-full border border-gold/60 px-6 py-3 text-[13px] font-semibold text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Quote this product
            </button>
          </Magnetic>
          {product.from && (
            <span className="text-xs text-smoke">
              Guide price from <span className="font-display text-base text-ivory/80">${product.from}</span> / piece
            </span>
          )}
        </FadeUp>
      </div>
    </motion.article>
  );
}

export default function Collections({ items }: { items?: Product[] }) {
  const products = items?.length ? items : defaultProducts;
  const [active, setActive] = useState<FilterId>("all");
  const visible = useMemo(() => {
    if (active === "all") return products;
    if (active === "labels") return products.filter((p) => labelSlugs.includes(p.slug));
    if (active === "tags") return products.filter((p) => tagSlugs.includes(p.slug));
    return products.filter((p) => !labelSlugs.includes(p.slug) && !tagSlugs.includes(p.slug) || finishSlugs.includes(p.slug));
  }, [active, products]);

  return (
    <section id="collections" className="grain relative scroll-mt-20 bg-ink py-24 lg:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>The collections</Eyebrow>
            <h2 className="display-tight mt-7 font-display text-4xl text-ivory sm:text-6xl">
              <RevealWords text="Eight crafts," />{" "}
              <span className="italic text-gold-grad">
                <RevealWords text="one standard." delay={0.25} />
              </span>
            </h2>
          </div>
          <FadeUp className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={cn(
                  "relative rounded-full border px-5 py-2.5 text-[12px] font-semibold tracking-wide transition-colors duration-300",
                  active === f.id ? "border-gold text-ink" : "border-ivory/15 text-ivory/60 hover:border-ivory/40 hover:text-ivory"
                )}
              >
                {active === f.id && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </FadeUp>
        </div>

        <motion.div layout className="mt-16 flex flex-col gap-20 lg:mt-24 lg:gap-32">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProductRow key={p.slug} product={p} index={products.findIndex((x) => x.slug === p.slug)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
