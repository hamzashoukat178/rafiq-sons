"use client";

import { marqueeItems } from "@/content/site";

export default function Marquee() {
  const row = [...marqueeItems, ...marqueeItems];
  return (
    <div className="relative overflow-hidden border-y border-line-dark bg-coal py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-2xl italic text-ivory/75">{item}</span>
            <span className="h-1.5 w-1.5 rotate-45 border border-gold/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
