"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { easeLuxe, cn } from "@/lib/utils";
import { products as defaultProducts, type Product, site } from "@/content/site";
import { Eyebrow, FadeUp, RevealWords } from "./Reveal";
import Magnetic from "./Magnetic";

const filters = [
  { id: "all", label: "Everything" },
  { id: "labels", label: "Woven & Satin Labels" },
  { id: "tags", label: "Tags & Cards" },
  { id: "finishing", label: "Packaging & Patches" },
] as const;

type FilterId = (typeof filters)[number]["id"];

const labelSlugs = ["woven-labels", "satin-labels", "heat-press", "satin", "woven", "printed-labels"];
const tagSlugs = ["hang-tags", "thank-you-cards", "business-cards", "cards"];
const finishSlugs = ["stickers", "packaging", "patches"];

// Extended product specs data for rich product showcase
const productSpecs: Record<string, { material: string; colors: string; folds: string; moq: string; leadTime: string }> = {
  "woven-labels": {
    material: "100% High-Density Damask Polyester / Taffeta / Satin base",
    colors: "Up to 8 rich yarn thread colors",
    folds: "Center fold, end fold, miter fold, Manhattan fold, straight cut",
    moq: "Starts from 100 pcs (bulk savings at 500+)",
    leadTime: "7 – 10 working days",
  },
  "satin-labels": {
    material: "Ultra-soft woven edge satin or cut-edge satin",
    colors: "Edge-to-edge rotary & silk screen print",
    folds: "Loop fold, end fold, laser heat sealed",
    moq: "Starts from 100 pcs",
    leadTime: "5 – 8 working days",
  },
  "hang-tags": {
    material: "400gsm to 800gsm duplex boards, matte & soft-touch velvet",
    colors: "Full CMYK + Gold / Silver / Holographic foil stamping & debossing",
    folds: "Custom die-cut shapes, eyelets with waxed/cotton cord",
    moq: "Starts from 100 pcs",
    leadTime: "6 – 9 working days",
  },
  "heat-press": {
    material: "High-definition tagless silicone heat transfer",
    colors: "Multi-color HD & 3D puff silicone effects",
    folds: "Supplied on pre-cut release film for easy heat press",
    moq: "Starts from 100 pcs",
    leadTime: "6 – 8 working days",
  },
  "stickers": {
    material: "Waterproof vinyl, kiss-cut stickers, and merrowed woven patches",
    colors: "UV laminated matte / gloss finish & metallic threads",
    folds: "Iron-on backing, velcro, or self-adhesive peel & stick",
    moq: "Starts from 100 pcs",
    leadTime: "5 – 8 working days",
  },
  "thank-you-cards": {
    material: "350gsm – 600gsm textured art card & cotton paper",
    colors: "Metallic foil stamping, letterpress, soft-touch lamination",
    folds: "Single card or bi-fold greeting card style",
    moq: "Starts from 100 pcs",
    leadTime: "5 – 7 working days",
  },
  "business-cards": {
    material: "600gsm to 900gsm duplex card with painted edge gilding",
    colors: "Gold foil, deboss, spot UV gloss on matte base",
    folds: "Standard, square, or custom die-cut dimensions",
    moq: "Starts from 100 pcs",
    leadTime: "5 – 7 working days",
  },
  "packaging": {
    material: "Frosted matte zipper bags, polymailers, custom branded tissue & tape",
    colors: "1 to 4 color custom logo print with zip lock closure",
    folds: "Various sizes (A5, A4, A3, shoe box sizes, custom)",
    moq: "Starts from 100 pcs",
    leadTime: "8 – 12 working days",
  },
};

function TiltImage({ product, priority, onSelect }: { product: Product; priority?: boolean; onSelect: () => void }) {
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
        onClick={onSelect}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative aspect-[4/3.4] cursor-pointer overflow-hidden rounded-2xl border border-ivory/10 bg-coal transition-all duration-500 hover:border-gold/60 hover:shadow-[0_20px_50px_-15px_rgba(198,161,91,0.25)]"
      >
        <motion.div style={{ translateZ: 0 }} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name + " crafted by Rafiq Sons Labels"}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-75 transition-opacity duration-500 group-hover:opacity-40" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
          <span className="glass-dark rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            {product.tag}
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 bg-ink/60 text-xs text-ivory opacity-0 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:opacity-100">
            Specs ↗
          </span>
        </div>
        <span className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(245,241,232,0.12)]" />
      </motion.div>
    </div>
  );
}

function ProductRow({
  product,
  index,
  onOpenModal,
}: {
  product: Product;
  index: number;
  onOpenModal: (p: Product) => void;
}) {
  const even = index % 2 === 0;
  const specs = productSpecs[product.slug] || productSpecs["woven-labels"];

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
        <TiltImage product={product} priority={index === 0} onSelect={() => onOpenModal(product)} />
      </div>
      <div className={cn(!even && "lg:order-1")}>
        <FadeUp className="flex items-baseline gap-4">
          <span className="font-display text-sm italic text-gold">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-gold/40" />
          <span className="eyebrow text-[10px] text-smoke">{product.tag} Craft</span>
        </FadeUp>
        <h3 className="display-tight mt-3 font-display text-4xl text-ivory sm:text-5xl">
          <RevealWords text={product.name} />
        </h3>
        <FadeUp delay={0.1} className="mt-4 max-w-md text-base leading-relaxed text-ivory/65">
          {product.description}
        </FadeUp>
        <FadeUp delay={0.16} className="mt-4 max-w-md border-l border-gold/30 pl-4 text-sm leading-relaxed text-ivory/50">
          {product.detail}
        </FadeUp>

        {/* Quick Specs Pill Box */}
        <FadeUp delay={0.2} className="glass-dark mt-6 max-w-lg rounded-xl border border-ivory/10 p-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-smoke">Turnaround:</span>
              <p className="font-medium text-ivory">{specs.leadTime}</p>
            </div>
            <div>
              <span className="text-smoke">Minimum Order:</span>
              <p className="font-medium text-ivory">{specs.moq}</p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.25} className="mt-8 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.25}>
            <button
              onClick={quoteThis}
              className="btn-sheen rounded-full bg-gold px-6 py-3.5 text-[13px] font-semibold text-ink shadow-[0_10px_30px_-10px_rgba(198,161,91,0.5)] transition-transform hover:scale-[1.02]"
            >
              Quote this item
            </button>
          </Magnetic>

          <button
            onClick={() => onOpenModal(product)}
            className="rounded-full border border-ivory/20 px-5 py-3.5 text-[13px] font-medium text-ivory/80 transition-colors hover:border-gold hover:text-gold"
          >
            View full specs →
          </button>
        </FadeUp>
      </div>
    </motion.article>
  );
}

export default function Collections({ items }: { items?: Product[] }) {
  const products = items?.length ? items : defaultProducts;
  const [active, setActive] = useState<FilterId>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const visible = useMemo(() => {
    if (active === "all") return products;
    if (active === "labels") return products.filter((p) => labelSlugs.includes(p.slug));
    if (active === "tags") return products.filter((p) => tagSlugs.includes(p.slug));
    return products.filter((p) => !labelSlugs.includes(p.slug) && !tagSlugs.includes(p.slug) || finishSlugs.includes(p.slug));
  }, [active, products]);

  const specsForModal = selectedProduct ? (productSpecs[selectedProduct.slug] || productSpecs["woven-labels"]) : null;

  const quoteSelected = () => {
    if (selectedProduct) {
      window.dispatchEvent(new CustomEvent("quote:product", { detail: selectedProduct.name }));
      setSelectedProduct(null);
      document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="collections" className="grain relative scroll-mt-20 bg-ink py-24 lg:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>The collections</Eyebrow>
            <h2 className="display-tight mt-6 font-display text-4xl text-ivory sm:text-6xl">
              <RevealWords text="Eight crafts," />{" "}
              <span className="italic text-gold-grad">
                <RevealWords text="one standard." delay={0.25} />
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60 sm:text-base">
              Explore our full suite of custom garment branding items, engineered to artwork specifications and delivered worldwide.
            </p>
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
              <ProductRow
                key={p.slug}
                product={p}
                index={products.findIndex((x) => x.slug === p.slug)}
                onOpenModal={(prod) => setSelectedProduct(prod)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Interactive Product Details Lightbox / Modal */}
      <AnimatePresence>
        {selectedProduct && specsForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-xl sm:p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ ease: easeLuxe, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-dark relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-ivory/15 bg-coal p-6 sm:p-10"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Close details"
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 bg-ink/60 text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                ✕
              </button>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-ivory/10">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-wider text-gold backdrop-blur-md">
                    {selectedProduct.tag}
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <span className="eyebrow text-[10px] text-gold">Craft Specification</span>
                    <h3 className="font-display mt-2 text-3xl text-ivory">{selectedProduct.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/65">{selectedProduct.description}</p>

                    <div className="mt-6 space-y-3 text-xs">
                      <div className="border-b border-ivory/10 pb-2">
                        <span className="text-smoke">Materials / Base:</span>
                        <p className="font-medium text-ivory">{specsForModal.material}</p>
                      </div>
                      <div className="border-b border-ivory/10 pb-2">
                        <span className="text-smoke">Color Capacity:</span>
                        <p className="font-medium text-ivory">{specsForModal.colors}</p>
                      </div>
                      <div className="border-b border-ivory/10 pb-2">
                        <span className="text-smoke">Folding & Finishes:</span>
                        <p className="font-medium text-ivory">{specsForModal.folds}</p>
                      </div>
                      <div className="border-b border-ivory/10 pb-2">
                        <span className="text-smoke">Estimated Lead Time:</span>
                        <p className="font-medium text-gold">{specsForModal.leadTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      onClick={quoteSelected}
                      className="btn-sheen flex-1 rounded-full bg-gold py-3 text-center text-xs font-semibold text-ink"
                    >
                      Request Quote for this Item
                    </button>
                    <a
                      href={`${site.whatsapp}?text=${encodeURIComponent(`Hi Rafiq Sons Labels, I want to inquire about custom ${selectedProduct.name}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-ivory/20 px-5 py-3 text-center text-xs font-semibold text-ivory transition-colors hover:border-gold hover:text-gold"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
