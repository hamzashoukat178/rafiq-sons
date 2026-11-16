"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuoteBasket } from "@/context/QuoteBasketContext";
import type { Product } from "@/content/site";

interface ProductCardItemProps {
  prod: Product;
}

export default function ProductCardItem({ prod }: ProductCardItemProps) {
  const { addItem, openQuickView, openQuoteModal } = useQuoteBasket();

  // Multi-image gallery list
  const gallery = prod.gallery && prod.gallery.length > 0
    ? prod.gallery
    : [prod.image];

  const [activeIdx, setActiveIdx] = useState(0);
  const currentImage = gallery[activeIdx] || prod.image;

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % gallery.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between">
      <div>
        {/* Product Image Header with Interactive Mini Carousel */}
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100 group/img">
          <Link href={`/product/${prod.slug}`} className="block relative w-full h-full">
            <Image
              src={currentImage}
              alt={`${prod.name} - Photo ${activeIdx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-all duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
            />
          </Link>
          
          {/* Tag badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60 z-10 pointer-events-none">
            <span className="text-[10px] font-bold text-slate-900">
              {prod.tag}
            </span>
          </div>

          {/* Quick Specs Trigger Overlay */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(prod);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-700 hover:bg-white hover:text-amber-700 shadow-sm transition-all z-10 cursor-pointer"
            title="View Full Technical Specs & Multi-Image Gallery"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* Multi-Photo Carousel Controls (if 2 to 5 photos) */}
          {gallery.length > 1 && (
            <>
              {/* Previous Arrow */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md flex items-center justify-center text-sm font-bold z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                ‹
              </button>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md flex items-center justify-center text-sm font-bold z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                ›
              </button>

              {/* Indicator Dots Strip */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 bg-slate-900/60 backdrop-blur-xs px-2 py-1 rounded-full">
                {gallery.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveIdx(dotIdx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeIdx === dotIdx ? "w-3 bg-amber-400" : "w-1.5 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>

              {/* Total Photos Badge */}
              <div className="absolute bottom-2.5 right-2 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-md backdrop-blur-xs z-10 pointer-events-none">
                {activeIdx + 1}/{gallery.length}
              </div>
            </>
          )}
        </div>

        {/* Product Body */}
        <div className="p-4 space-y-2.5">
          <Link href={`/product/${prod.slug}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
              {prod.name}
            </h3>
          </Link>
          
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {prod.description}
          </p>

          {/* Meta Specifications */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
            {prod.turnaround && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                ⏱️ {prod.turnaround}
              </span>
            )}
            {prod.moq && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60">
                📦 {prod.moq.split(" ")[0]} {prod.moq.split(" ")[1]}
              </span>
            )}
            {gallery.length > 1 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                📸 {gallery.length} Photos
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product Footer Actions */}
      <div className="p-4 pt-0 bg-white grid grid-cols-2 gap-2 border-t border-slate-100 mt-2">
        <button
          type="button"
          onClick={() => {
            addItem({
              name: prod.name,
              categorySlug: prod.categorySlug,
              quantity: "500 pcs",
              specs: prod.material || prod.tag,
              image: currentImage,
              moq: prod.moq,
            });
          }}
          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>+ Add to Quote</span>
        </button>
        <button
          type="button"
          onClick={() => openQuoteModal(prod.name)}
          className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>⚡ Fast Quote</span>
        </button>
      </div>

    </div>
  );
}
