"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuoteBasket } from "@/context/QuoteBasketContext";

export default function ProductQuickViewModal() {
  const {
    quickViewProduct,
    closeQuickView,
    addItem,
    openQuoteModal,
  } = useQuoteBasket();

  const [activeIdx, setActiveIdx] = useState(0);

  // Reset index when product changes
  useEffect(() => {
    setActiveIdx(0);
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const gallery = quickViewProduct.gallery && quickViewProduct.gallery.length > 0
    ? quickViewProduct.gallery
    : [quickViewProduct.image];

  const currentImage = gallery[activeIdx] || quickViewProduct.image;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % gallery.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleAddAndQuote = () => {
    addItem({
      name: quickViewProduct.name,
      categorySlug: quickViewProduct.categorySlug,
      quantity: "500 pcs",
      specs: quickViewProduct.material || quickViewProduct.tag,
      image: currentImage,
      moq: quickViewProduct.moq,
    });
    closeQuickView();
    openQuoteModal(quickViewProduct.name);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Multi-Image Carousel Column */}
          <div className="md:col-span-6 bg-slate-100 flex flex-col justify-between p-4 relative">
            
            {/* Main Carousel Photo */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200/80">
              <Image
                src={currentImage}
                alt={`${quickViewProduct.name} - Photo ${activeIdx + 1}`}
                fill
                className="object-cover transition-all duration-300"
                priority
              />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md z-10">
                {quickViewProduct.tag}
              </div>

              {/* Carousel Navigation Arrows (if multiple photos) */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md flex items-center justify-center text-sm font-bold z-10 transition-transform active:scale-90 cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md flex items-center justify-center text-sm font-bold z-10 transition-transform active:scale-90 cursor-pointer"
                  >
                    ›
                  </button>

                  {/* Photo Counter Pill */}
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                    {activeIdx + 1} / {gallery.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip (if multiple photos) */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeIdx === idx
                        ? "border-amber-500 ring-2 ring-amber-400/30 scale-105"
                        : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="60px"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-2 text-center">
              <Link
                href={`/product/${quickViewProduct.slug}`}
                onClick={closeQuickView}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-900 hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Product Page & Configurator</span>
                <span>→</span>
              </Link>
            </div>

          </div>

          {/* Details Column */}
          <div className="md:col-span-6 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                {quickViewProduct.name}
              </h3>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Tech Specs */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                {quickViewProduct.material && (
                  <div>
                    <span className="font-bold text-slate-700">Material: </span>
                    <span className="text-slate-600">{quickViewProduct.material}</span>
                  </div>
                )}
                {quickViewProduct.detail && (
                  <div>
                    <span className="font-bold text-slate-700">Technical Detail: </span>
                    <span className="text-slate-600">{quickViewProduct.detail}</span>
                  </div>
                )}
                {quickViewProduct.recommendedFor && (
                  <div>
                    <span className="font-bold text-slate-700">Best For: </span>
                    <span className="text-slate-600">{quickViewProduct.recommendedFor}</span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                {quickViewProduct.turnaround && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                    ⏱️ {quickViewProduct.turnaround}
                  </span>
                )}
                {quickViewProduct.moq && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60">
                    📦 {quickViewProduct.moq}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ⚡ 24h Free Mockup
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleAddAndQuote}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                ⚡ Request Custom Quote
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      name: quickViewProduct.name,
                      categorySlug: quickViewProduct.categorySlug,
                      quantity: "500 pcs",
                      specs: quickViewProduct.material || quickViewProduct.tag,
                      image: currentImage,
                      moq: quickViewProduct.moq,
                    });
                    closeQuickView();
                  }}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Add to Basket
                </button>
                <a
                  href={`https://wa.me/923202025795?text=Hello%20Rafiq%20Sons%2C%20I%20want%20to%20inquire%20about%20${encodeURIComponent(quickViewProduct.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 font-semibold text-xs transition-all text-center flex items-center justify-center gap-1"
                >
                  <span>💬 WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
