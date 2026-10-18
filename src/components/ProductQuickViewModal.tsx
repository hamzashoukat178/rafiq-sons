"use client";

import React from "react";
import Image from "next/image";
import { useQuoteBasket } from "@/context/QuoteBasketContext";

export default function ProductQuickViewModal() {
  const {
    quickViewProduct,
    closeQuickView,
    addItem,
    openQuoteModal,
  } = useQuoteBasket();

  if (!quickViewProduct) return null;

  const handleAddAndQuote = () => {
    addItem({
      name: quickViewProduct.name,
      categorySlug: quickViewProduct.categorySlug,
      quantity: "500 pcs",
      specs: quickViewProduct.material || quickViewProduct.tag,
      image: quickViewProduct.image,
      moq: quickViewProduct.moq,
    });
    closeQuickView();
    openQuoteModal(quickViewProduct.name);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200 transition-colors"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto h-64 md:h-full bg-slate-100">
            <Image
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
              {quickViewProduct.tag}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xl font-extrabold text-slate-900">
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
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleAddAndQuote}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                ⚡ Request Custom Quote
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    addItem({
                      name: quickViewProduct.name,
                      categorySlug: quickViewProduct.categorySlug,
                      quantity: "500 pcs",
                      specs: quickViewProduct.material || quickViewProduct.tag,
                      image: quickViewProduct.image,
                      moq: quickViewProduct.moq,
                    });
                    closeQuickView();
                  }}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
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
