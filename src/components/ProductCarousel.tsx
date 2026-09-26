"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { easeLuxe, cn } from "@/lib/utils";
import { Eyebrow, RevealWords } from "./Reveal";

export type ProductCarouselItem = {
  id: string;
  image: string;
  title: string;
  tag: string;
  material?: string;
};

export const defaultCarouselItems: ProductCarouselItem[] = [
  {
    id: "c-1",
    image: "/photos/rs-092-02.jpg",
    title: "Gold Damask Woven Labels",
    tag: "High-Density Weave",
    material: "100% Polyester Yarns • Laser Sealed Cut",
  },
  {
    id: "c-2",
    image: "/photos/rs-057-00.jpg",
    title: "Embossed Foil Hang Tags",
    tag: "Luxury Board",
    material: "600gsm Duplex Card • Gold Foil Stamping",
  },
  {
    id: "c-3",
    image: "/photos/rs-070-03.jpg",
    title: "Silky Soft Satin Labels",
    tag: "Skin-Gentle",
    material: "Woven Edge Satin • High Definition Print",
  },
  {
    id: "c-4",
    image: "/photos/rs-004-cover.jpg",
    title: "Tagless Heat Press Transfers",
    tag: "3D Silicone",
    material: "Stretchable HD Silicone • Wash Tested",
  },
  {
    id: "c-5",
    image: "/photos/rs-095-01.jpg",
    title: "Merrowed Woven Patches",
    tag: "Iron-On / Sewn",
    material: "Merrowed Border • Metallic Gold Thread",
  },
  {
    id: "c-6",
    image: "/photos/rs-032-00.jpg",
    title: "Frosted Zipper Packaging Bags",
    tag: "Custom Unboxing",
    material: "Frosted Matte Film • Screen Printed Logo",
  },
  {
    id: "c-7",
    image: "/photos/rs-089-00.jpg",
    title: "Gold Foil Thank You Cards",
    tag: "Customer Care",
    material: "400gsm Art Card • Soft Touch Velvet",
  },
  {
    id: "c-8",
    image: "/photos/rs-024-01.jpg",
    title: "Painted Edge Business Cards",
    tag: "Brand Identity",
    material: "700gsm Ultra-Thick • Gold Gilded Edges",
  },
];

export default function ProductCarousel({
  items = defaultCarouselItems,
}: {
  items?: ProductCarouselItem[];
}) {
  const carouselList = items?.length ? items : defaultCarouselItems;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<ProductCarouselItem | null>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 15);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 15);

    // Calculate active slide index
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).clientWidth + 24 : 320;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIdx(Math.min(carouselList.length - 1, Math.max(0, idx)));
  }, [carouselList.length]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).clientWidth + 24 : 340;
    const amount = dir === "left" ? -cardWidth : cardWidth;
    el.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  const handleInquire = (item: ProductCarouselItem) => {
    const msg = `Hi Rafiq Sons Labels, I am interested in ordering: ${item.title} (${item.tag}).`;
    window.open(`https://wa.me/923202025795?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="relative mt-20 border-t border-ivory/10 pt-20 lg:mt-28 lg:pt-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-gold/5 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header row with arrows */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Craft Showcase & Closeups</Eyebrow>
            <h3 className="display-tight mt-3 font-display text-3xl text-ivory sm:text-5xl">
              <RevealWords text="Macro Details &" />{" "}
              <span className="italic text-gold-grad">
                <RevealWords text="Finishing Texture" delay={0.2} />
              </span>
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/60">
              Browse piece-by-piece high definition craft closeups, woven textures, and custom garment trims off our looms.
            </p>
          </div>

          {/* Slider Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canLeft}
              aria-label="Previous carousel item"
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 bg-coal/80 text-ivory shadow-lg backdrop-blur-md transition-all active:scale-95 hover:border-gold hover:text-gold",
                !canLeft && "opacity-30 cursor-not-allowed hover:border-ivory/20 hover:text-ivory"
              )}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canRight}
              aria-label="Next carousel item"
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 bg-coal/80 text-ivory shadow-lg backdrop-blur-md transition-all active:scale-95 hover:border-gold hover:text-gold",
                !canRight && "opacity-30 cursor-not-allowed hover:border-ivory/20 hover:text-ivory"
              )}
            >
              →
            </button>
          </div>
        </div>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="mt-10 flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory" }}
        >
          {carouselList.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              style={{ scrollSnapAlign: "start" }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative flex-none w-[280px] sm:w-[340px] overflow-hidden rounded-3xl border border-ivory/12 bg-coal/90 p-3 shadow-xl backdrop-blur-xl transition-all hover:border-gold/50"
            >
              {/* Image Container */}
              <div
                onClick={() => setSelectedPhoto(item)}
                className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl bg-ink/80"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 280px, 340px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-30" />
                
                {/* Floating Tag */}
                <div className="absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur-md border border-gold/20">
                  {item.tag}
                </div>

                <div className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/80 text-ivory opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 group-hover:scale-105 border border-ivory/20">
                  🔍
                </div>
              </div>

              {/* Card Meta & Action */}
              <div className="p-3 pt-4">
                <h4 className="font-display text-lg font-bold text-ivory group-hover:text-gold transition-colors">
                  {item.title}
                </h4>
                {item.material && (
                  <p className="mt-1 text-xs text-ivory/55 line-clamp-1">{item.material}</p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-ivory/10 pt-3">
                  <button
                    type="button"
                    onClick={() => handleInquire(item)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
                  >
                    <span>WhatsApp Inquiry</span>
                    <span>↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(item)}
                    className="text-xs text-smoke hover:text-ivory"
                  >
                    Zoom View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar / Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {carouselList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).clientWidth + 24 : 340;
                el.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activeIdx === idx ? "w-8 bg-gold" : "w-2 bg-ivory/20 hover:bg-ivory/40"
              )}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Carousel Photo */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-2xl sm:p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ ease: easeLuxe, duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-dark relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-gold/40 bg-coal p-5 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 bg-ink/90 text-ivory transition-colors hover:border-gold hover:text-gold cursor-pointer"
              >
                ✕
              </button>

              <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] items-center">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ivory/15 bg-ink">
                  <Image
                    src={selectedPhoto.image}
                    alt={selectedPhoto.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-col justify-between space-y-4">
                  <div>
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold border border-gold/30">
                      {selectedPhoto.tag}
                    </span>
                    <h3 className="font-display mt-3 text-2xl sm:text-3xl font-bold text-ivory">
                      {selectedPhoto.title}
                    </h3>
                    {selectedPhoto.material && (
                      <p className="mt-3 text-sm leading-relaxed text-ivory/80 border-l-2 border-gold/60 pl-3">
                        {selectedPhoto.material}
                      </p>
                    )}
                    <p className="mt-4 text-xs leading-relaxed text-ivory/65">
                      Custom woven, printed, or embossed to your exact logo specs and dimensions. Sample orders available worldwide.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleInquire(selectedPhoto)}
                      className="btn-sheen flex-1 rounded-full bg-[#25D366] py-3.5 text-center text-xs font-bold uppercase tracking-wider text-ink shadow-lg cursor-pointer"
                    >
                      Inquire on WhatsApp ↗
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(null);
                        document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="rounded-full bg-gold px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-ink cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
