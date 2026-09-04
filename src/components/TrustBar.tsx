"use client";

import { FadeUp } from "./Reveal";

const defaultMarquee1 = [
  "Custom Woven Labels",
  "High-Density Damask",
  "Foil Stamped Hang Tags",
  "Printed Satin Labels",
  "Tagless Heat Press",
  "Custom Woven Patches",
  "Embossed Business Cards",
  "Luxury Thank You Cards",
  "Frosted Zip Bags",
  "Worldwide Tracked Courier",
];

const defaultMarquee2 = [
  "Free Artwork Cleanup",
  "Digital Mockups in 24h",
  "Piece-by-Piece Quality Check",
  "Made in Pakistan",
  "Exported to 20+ Countries",
  "GCC & Europe Delivery",
  "No Hidden Costs",
  "Low MOQ for New Brands",
  "End-to-End Packaging",
  "WhatsApp Direct Support",
];

const defaultPillars = [
  {
    title: "High-Density Weave",
    desc: "Up to 8 rich yarn colors with crisp typography and ultra-soft edges.",
  },
  {
    title: "24h Digital Mockups",
    desc: "Free artwork setup and visual digital proof before weaving starts.",
  },
  {
    title: "Piece-by-Piece QC",
    desc: "Inspected by hand for color accuracy, fold alignment, and count.",
  },
  {
    title: "Worldwide Delivery",
    desc: "Tracked express shipping to Saudi Arabia, GCC, UK, USA & across the globe.",
  },
];

const icons = [
  <svg key="1" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>,
  <svg key="2" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="3" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>,
  <svg key="4" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
  </svg>,
];

export default function TrustBar({
  trustBar,
}: {
  trustBar?: { marquee1?: string[]; marquee2?: string[]; pillars?: { title: string; desc: string }[] };
}) {
  const row1 = trustBar?.marquee1?.length ? trustBar.marquee1 : defaultMarquee1;
  const row2 = trustBar?.marquee2?.length ? trustBar.marquee2 : defaultMarquee2;
  const pillars = trustBar?.pillars?.length ? trustBar.pillars : defaultPillars;

  return (
    <section className="relative border-y border-ivory/10 bg-coal py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,161,91,0.06)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gold/50 sm:w-12" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="eyebrow text-gold/90">Trusted by clothing brands worldwide</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="h-px w-8 bg-gold/50 sm:w-12" />
          </div>
        </div>

        {/* Marquee Row 1 */}
        <div className="relative mt-8 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex shrink-0 animate-marquee items-center gap-6 sm:gap-10">
            {row1.concat(row1).map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-ivory/70 transition-colors hover:text-gold sm:text-sm"
              >
                <span>{item}</span>
                <span className="h-1 w-1 rounded-full bg-gold/40" />
              </span>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 */}
        <div className="relative mt-4 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex shrink-0 animate-marquee-rev items-center gap-6 sm:gap-10">
            {row2.concat(row2).map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex items-center gap-4 text-xs font-medium tracking-[0.2em] text-ivory/45 transition-colors hover:text-ivory sm:text-sm"
              >
                <span>{item}</span>
                <span className="h-1 w-1 rounded-full bg-ivory/20" />
              </span>
            ))}
          </div>
        </div>

        {/* 4 Feature Value Pillars */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, idx) => (
            <FadeUp
              key={p.title}
              delay={0.08 * idx}
              className="glass-dark group relative rounded-2xl border border-ivory/10 p-6 transition-all duration-500 hover:border-gold/40 hover:bg-coal/90"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 transition-transform duration-500 group-hover:scale-110 group-hover:border-gold">
                {icons[idx % icons.length]}
              </div>
              <h3 className="mt-4 font-display text-lg text-ivory transition-colors group-hover:text-gold">
                {p.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ivory/55">
                {p.desc}
              </p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
