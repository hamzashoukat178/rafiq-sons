"use client";

import React from "react";
import { useQuoteBasket } from "@/context/QuoteBasketContext";
import { orderSteps } from "@/content/site";

interface HowToOrderProps {
  steps?: typeof orderSteps;
}

export default function HowToOrder({ steps = orderSteps }: HowToOrderProps) {
  const { openQuoteModal } = useQuoteBasket();

  return (
    <section id="how-to-order" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span>⚡ Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            How to Order Your Custom Labels & Packaging
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From concept artwork to your doorstep in 4 transparent, fast-tracked steps. Free digital mockups and revisions until you are 100% satisfied.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-amber-600 font-mono tracking-tighter">
                    {st.step}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
                    #{idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold">Have your logo ready? Let&apos;s start your order today!</h4>
            <p className="text-xs text-slate-400">Free 24h digital proofs • Low MOQ starting from 100 pcs</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openQuoteModal()}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              ⚡ Request Quotation
            </button>
            <a
              href="https://wa.me/923202025795?text=Hello%20Rafiq%20Sons%2C%20I%20have%20my%20logo%20ready%20and%20want%20to%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <span>💬 WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
