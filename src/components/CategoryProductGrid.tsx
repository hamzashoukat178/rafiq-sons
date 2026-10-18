"use client";

import React from "react";
import Image from "next/image";
import { useQuoteBasket } from "@/context/QuoteBasketContext";
import type { Product } from "@/content/site";

interface CategoryProductGridProps {
  products: Product[];
}

export default function CategoryProductGrid({ products }: CategoryProductGridProps) {
  const { addItem, openQuickView, openQuoteModal } = useQuoteBasket();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((prod) => (
        <div
          key={prod.slug}
          className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between"
        >
          <div>
            {/* Image */}
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
              <Image
                src={prod.image}
                alt={prod.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-900">
                  {prod.tag}
                </span>
              </div>
              <button
                onClick={() => openQuickView(prod)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-700 hover:bg-white hover:text-amber-700 shadow-sm transition-all"
                title="View Full Technical Specs"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                {prod.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {prod.description}
              </p>

              {/* Specs */}
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
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 pt-0 bg-white grid grid-cols-2 gap-2 border-t border-slate-100 mt-2">
            <button
              onClick={() => {
                addItem({
                  name: prod.name,
                  categorySlug: prod.categorySlug,
                  quantity: "500 pcs",
                  specs: prod.material || prod.tag,
                  image: prod.image,
                  moq: prod.moq,
                });
              }}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>+ Add to Quote</span>
            </button>
            <button
              onClick={() => openQuoteModal(prod.name)}
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>⚡ Fast Quote</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
