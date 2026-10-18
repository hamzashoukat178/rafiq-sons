"use client";

import React from "react";
import { useQuoteBasket } from "@/context/QuoteBasketContext";
import { brandingPackages, type BrandingPackage } from "@/content/site";

interface PackageBuilderProps {
  packages?: BrandingPackage[];
}

export default function PackageBuilder({ packages = brandingPackages }: PackageBuilderProps) {
  const { openQuoteModal, addItem } = useQuoteBasket();

  const handleSelectPackage = (pkg: BrandingPackage) => {
    // Add all items in the package to the basket
    pkg.items.forEach((item) => {
      addItem({
        name: `${item.title} (${pkg.name})`,
        quantity: item.qty,
        specs: item.desc,
      });
    });
    // Open quotation modal prefilled
    openQuoteModal(`Complete Branding Combo: ${pkg.name}`);
  };

  return (
    <section id="packages" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            <span>🎁 5-in-1 Complete Combo Packaging</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything Your Clothing Brand Needs in One Place
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Launch or restock your fashion label with a synchronized branding bundle. Perfect color matching across woven neck labels, foil hang tags, waterproof stickers, thank-you cards, and custom frosted garment bags.
          </p>
        </div>

        {/* 3 Combo Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isPro = pkg.popular;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                  isPro
                    ? "bg-slate-900 text-white shadow-xl ring-2 ring-amber-500 scale-100 lg:-translate-y-2"
                    : "bg-slate-50 text-slate-900 border border-slate-200 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Popular Badge */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                    ★ {pkg.badge}
                  </div>
                )}

                <div>
                  {/* Header */}
                  <div className="space-y-2 mb-6">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isPro ? "text-amber-400" : "text-amber-700"
                      }`}
                    >
                      {pkg.tier}
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-tight">
                      {pkg.name}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        isPro ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {pkg.description}
                    </p>
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        isPro ? "bg-slate-800 text-slate-200" : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      <span>⏱️ Production Turnaround: {pkg.turnaround}</span>
                    </div>
                  </div>

                  {/* Itemized 5-in-1 List */}
                  <div className="space-y-3 mb-6 pt-4 border-t border-slate-200/20">
                    <p
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isPro ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Included in this Combo:
                    </p>
                    <div className="space-y-2.5">
                      {pkg.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className={`p-3 rounded-xl flex items-start justify-between gap-3 ${
                            isPro ? "bg-slate-800/80 border border-slate-700/60" : "bg-white border border-slate-200/80"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold leading-tight">{item.title}</p>
                            <p
                              className={`text-[11px] leading-tight mt-0.5 ${
                                isPro ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {item.desc}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap ${
                              isPro ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            {item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Bullets */}
                  <div className="space-y-2 mb-8">
                    {pkg.highlights.map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs">
                        <span className="text-amber-500 font-bold">✓</span>
                        <span className={isPro ? "text-slate-300" : "text-slate-600"}>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPackage(pkg)}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                    isPro
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold"
                      : "bg-slate-900 hover:bg-amber-600 text-white"
                  }`}
                >
                  <span>⚡ {pkg.ctaLabel}</span>
                  <span aria-hidden="true">→</span>
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
