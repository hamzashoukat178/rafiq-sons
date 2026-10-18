"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuoteBasket } from "@/context/QuoteBasketContext";

interface HeroSectionProps {
  hero?: {
    eyebrow?: string;
    line1?: string;
    line2?: string;
    sub?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    trustBadges?: { icon: string; label: string }[];
  };
}

export default function HeroSection({ hero }: HeroSectionProps) {
  const { openQuoteModal } = useQuoteBasket();

  const eyebrow = hero?.eyebrow || "Direct Factory Manufacturer of Custom Garment Trims";
  const line1 = hero?.line1 || "Custom Labels, Logos &";
  const line2 = hero?.line2 || "Packaging for Your Brand";
  const sub =
    hero?.sub ||
    "Give your clothing brand a premium identity with custom-made woven labels, 3D rubber logos, debossed leather patches, metal badges, luxury hang tags, waterproof stickers, and frosted garment bags. Direct factory wholesale pricing with low MOQ starting at 100 pcs.";

  const trustBadges = hero?.trustBadges || [
    { icon: "🏭", label: "Direct Factory Manufacturing" },
    { icon: "📦", label: "Low MOQ Starts at 100 pcs" },
    { icon: "⚡", label: "24h Free Digital Proof" },
    { icon: "✈️", label: "Express Doorstep Delivery (GCC & Global)" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
      
      {/* Decorative ambient background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-amber-100/50 via-slate-100/60 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{eyebrow}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              <span>{line1} </span>
              <span className="text-amber-700 block sm:inline">{line2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {sub}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/#catalog"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-amber-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Explore Products</span>
                <span aria-hidden="true">↓</span>
              </Link>
              <button
                onClick={() => openQuoteModal()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡ Get Instant Quote</span>
              </button>
              <a
                href="https://wa.me/923202025795?text=Hello%20Rafiq%20Sons%2C%20I%20want%20to%20discuss%20custom%20labels%20and%20packaging%20for%20my%20brand."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>💬 WhatsApp Quick Chat</span>
              </a>
            </div>

            {/* Trust Badges Strip */}
            <div className="pt-6 border-t border-slate-200/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {trustBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs text-center sm:text-left"
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Visual Product Showcase Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Featured Showcase Card */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl aspect-4/3 sm:aspect-square">
                <Image
                  src="/photos/rs-092-02.jpg"
                  alt="High-Density Damask Woven Labels by Rafiq Sons Labels"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Floating Micro Badge 1 */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">50D High-Density Weave</span>
                </div>

                {/* Floating Micro Badge 2 */}
                <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2">
                  <span className="text-amber-400 font-bold text-xs">⭐ 4.9/5 Rating</span>
                  <span className="text-slate-300 text-[11px]">| 200+ Brands</span>
                </div>
              </div>

              {/* Secondary Overlapping Thumbnails */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="relative h-24 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group">
                  <Image
                    src="/photos/rs-057-00.jpg"
                    alt="Luxury Foil Hang Tags"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white">Hang Tags</span>
                  </div>
                </div>

                <div className="relative h-24 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group">
                  <Image
                    src="/photos/rs-004-cover.jpg"
                    alt="3D Silicone Rubber Logos"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white">3D Rubber</span>
                  </div>
                </div>

                <div className="relative h-24 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group">
                  <Image
                    src="/photos/rs-032-00.jpg"
                    alt="Frosted Ziplock Garment Bags"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white">Frosted Bags</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
