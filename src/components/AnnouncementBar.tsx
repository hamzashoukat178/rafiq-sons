"use client";

import React from "react";

interface AnnouncementBarProps {
  text?: string;
  cta?: string;
  link?: string;
}

export default function AnnouncementBar({
  text = "✦ Direct Factory Manufacturer • Express Courier Shipping to KSA, UAE, Qatar, Kuwait & Worldwide • 24h Free Digital Artwork Proofing",
  cta = "Order on WhatsApp",
  link = "https://wa.me/923202025795?text=Hello%20Rafiq%20Sons%2C%20I%20would%20like%20to%20get%20a%20quotation%20for%20my%20brand.",
}: AnnouncementBarProps) {
  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 font-medium tracking-wide">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <p className="line-clamp-1">{text}</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-300">
          <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400">
            <span>📦 MOQ: 100 pcs</span>
            <span>•</span>
            <span>⚡ 24h Digital Proof</span>
            <span>•</span>
            <span>✈️ Tracked Shipping</span>
          </span>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors underline underline-offset-2"
          >
            <span>💬 {cta}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
