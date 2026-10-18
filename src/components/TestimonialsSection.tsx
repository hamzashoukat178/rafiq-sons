"use client";

import React from "react";
import { testimonials, type Testimonial } from "@/content/site";

interface TestimonialsSectionProps {
  items?: Testimonial[];
}

export default function TestimonialsSection({ items = testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            <span>⭐ Client Satisfaction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Fashion Brands Across GCC & Worldwide
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Over 200+ emerging designers, streetwear brands, and established garment manufacturers rely on Rafiq Sons Labels for their branding accessories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-sm transition-all"
            >
              <div className="space-y-3">
                {/* 5-star rating */}
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  {"★".repeat(t.rating || 5)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/70">
                <p className="text-xs font-bold text-slate-900">{t.name}</p>
                <p className="text-[11px] text-amber-800 font-medium">{t.role}</p>
                <p className="text-[10px] text-slate-500">{t.city}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
