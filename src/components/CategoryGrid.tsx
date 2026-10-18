"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuoteBasket } from "@/context/QuoteBasketContext";
import { categories, type ProductCategory } from "@/content/site";

interface CategoryGridProps {
  items?: ProductCategory[];
}

export default function CategoryGrid({ items = categories }: CategoryGridProps) {
  const { openQuoteModal } = useQuoteBasket();

  return (
    <section id="categories" className="py-14 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <span>✨ Complete Branding Solutions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From high-density neck labels and 3D silicone badges to luxury foil hang tags and frosted bags—explore our 8 core product pillars engineered for global apparel brands.
          </p>
        </div>

        {/* 8 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((cat) => (
            <div
              key={cat.id}
              className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Category Image Header */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                      {cat.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-2 py-0.5 rounded-md text-[10px] font-semibold">
                    MOQ: {cat.moq.split(" ")[0]} {cat.moq.split(" ")[1]}
                  </div>
                </div>

                {/* Category Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    <Link href={`/category/${cat.slug}`}>
                      {cat.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {cat.tagline}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {cat.featuredSpecs.slice(0, 3).map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <span className="text-amber-600 font-bold">✓</span>
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 bg-white grid grid-cols-2 gap-2 border-t border-slate-100">
                <Link
                  href={`/category/${cat.slug}`}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition-colors"
                >
                  Explore Pillar
                </Link>
                <button
                  onClick={() => openQuoteModal(cat.name)}
                  className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Quick Quote
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
