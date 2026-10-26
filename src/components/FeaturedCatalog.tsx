"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuoteBasket } from "@/context/QuoteBasketContext";
import { products, categories, type Product } from "@/content/site";

interface FeaturedCatalogProps {
  items?: Product[];
}

export default function FeaturedCatalog({ items = products }: FeaturedCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addItem, openQuickView } = useQuoteBasket();

  // Filter products by category and search text
  const filteredProducts = useMemo(() => {
    return items.filter((prod) => {
      const matchCat = selectedCategory === "all" || prod.categorySlug === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.material && prod.material.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <section id="catalog" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <span>🏷️ Direct Factory Products</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Products & Custom Trims Catalog
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Select products to add to your custom quotation basket, view technical specifications, or request instant sample mockups.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search labels, tags, bags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Products ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((p) => p.categorySlug === cat.slug).length;
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
            <p className="text-slate-500 text-sm">No products found matching &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.slug}
                className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Product Image Header */}
                  <Link href={`/product/${prod.slug}`} className="block relative aspect-4/3 overflow-hidden bg-slate-100">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60 z-10">
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
                      title="View Full Technical Specs"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </Link>

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
                    </div>
                  </div>
                </div>

                {/* Product Footer Actions */}
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
                  <a
                    href={`https://wa.me/923202025795?text=Hello%20Rafiq%20Sons%2C%20I%20am%20interested%20in%20custom%20quotation%20for%20${encodeURIComponent(prod.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
