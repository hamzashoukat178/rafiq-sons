"use client";

import React, { useState } from "react";
import { faqs, type Faq } from "@/content/site";

interface FaqSectionProps {
  items?: Faq[];
}

export default function FaqSection({ items = faqs }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <span>💡 Quick Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to know about placing custom label and packaging orders with Rafiq Sons Labels.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {items.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-amber-700 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <span
                    className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-mono transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 bg-amber-100 text-amber-900" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-950">Have a custom inquiry or special material request?</h4>
            <p className="text-xs text-amber-800">Our production specialists reply in under 5 minutes on WhatsApp.</p>
          </div>
          <a
            href="https://wa.me/923202025795?text=Hello%20Rafiq%20Sons%2C%20I%20have%20a%20question%20regarding%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            💬 Chat on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
