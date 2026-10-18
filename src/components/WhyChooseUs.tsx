"use client";

import React from "react";
import { trustPillars } from "@/content/site";

interface WhyChooseUsProps {
  pillars?: typeof trustPillars;
}

export default function WhyChooseUs({ pillars = trustPillars }: WhyChooseUsProps) {
  return (
    <section id="why-us" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <span>🛡️ The Factory Advantage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose Rafiq Sons Labels
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            We are a direct manufacturing atelier specializing in precision garment branding accessories. From single boutique startups to high-volume exporters, we ensure uncompromising quality.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-3 ${
                idx === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-2xl">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
