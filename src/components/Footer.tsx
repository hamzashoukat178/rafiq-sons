"use client";

import Image from "next/image";
import { site as defaultSite, footer as defaultFooter, marqueeItems } from "@/content/site";
import { FadeUp } from "./Reveal";
import Magnetic from "./Magnetic";

const globalExportDestinations = [
  "United States (USA)", "United Kingdom (UK)", "United Arab Emirates (UAE)", "Saudi Arabia (KSA)",
  "Canada", "Australia", "Germany", "France", "Italy", "Spain", "Turkey", "Qatar", "Kuwait"
];

export default function Footer({
  site = defaultSite,
  footer = defaultFooter,
}: {
  site?: typeof defaultSite;
  footer?: typeof defaultFooter;
}) {
  const go = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ivory/10 bg-coal">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-gold/8 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-24 sm:px-8">
        <FadeUp className="text-center">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gold/50" />
            <span className="eyebrow text-gold">{footer.note}</span>
            <span className="h-px w-8 bg-gold/50" />
          </div>
          <h2 className="display-tight mx-auto mt-6 max-w-4xl font-display text-5xl text-ivory sm:text-7xl">
            {footer.big}
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic strength={0.25}>
              <button
                onClick={() => go("#quote")}
                className="btn-sheen rounded-full bg-gold px-8 py-4 text-sm font-semibold text-ink shadow-[0_10px_35px_-8px_rgba(198,161,91,0.5)]"
              >
                Request a quote
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-ivory/20 px-8 py-4 text-sm font-medium text-ivory/85 transition-colors hover:border-gold hover:text-gold"
              >
                WhatsApp us directly
              </a>
            </Magnetic>
          </div>
        </FadeUp>

        <div className="mt-24 grid gap-12 border-t border-ivory/10 pt-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/logo-wide-light.png"
              alt={`${site.name} - Custom Woven Labels & Garment Accessories`}
              width={176}
              height={58}
              className="h-12 w-auto"
            />
            <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-gold font-bold">Woven with intent</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
              Custom high-density damask woven labels, satin wash care labels, embossed hang tags, leather patches, and bespoke packaging for apparel brands worldwide. {site.location}.
            </p>
          </div>

          <div>
            <p className="eyebrow text-xs font-bold text-gold">Collections</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/75">
              {marqueeItems.slice(0, 6).map((m) => (
                <li key={m}>
                  <button onClick={() => go("#collections")} className="transition-colors hover:text-gold">{m}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-xs font-bold text-gold">Studio & Export</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/75">
              <li><button onClick={() => go("#worldwide-export")} className="transition-colors hover:text-gold">Worldwide Export Hubs</button></li>
              <li><button onClick={() => go("#atelier")} className="transition-colors hover:text-gold">The Process</button></li>
              <li><button onClick={() => go("#showcase")} className="transition-colors hover:text-gold">Photo Showcase</button></li>
              <li><button onClick={() => go("#reels")} className="transition-colors hover:text-gold">Workbench Reels</button></li>
              <li><button onClick={() => go("#gallery")} className="transition-colors hover:text-gold">Showroom</button></li>
              <li><button onClick={() => go("#faq")} className="transition-colors hover:text-gold">FAQ</button></li>
              <li><button onClick={() => go("#quote")} className="transition-colors hover:text-gold">Request a Quote</button></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-xs font-bold text-gold">Direct Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/75">
              <li>
                <a href={site.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-gold hover:underline">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                  WhatsApp: {site.phoneDisplay}
                </a>
              </li>
              <li><a href={`mailto:${site.email}`} className="transition-colors hover:text-gold">{site.email}</a></li>
              <li><a href={site.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">Instagram (@rafiqsonslabelss)</a></li>
              <li className="text-ivory/60">{site.location}</li>
            </ul>
          </div>
        </div>

        {/* Global Export Footprint SEO Tags Footer */}
        <div className="mt-12 border-t border-ivory/10 pt-8">
          <p className="eyebrow text-xs font-bold text-gold">Worldwide Express Air Delivery</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-ivory/60">
            {globalExportDestinations.map((dest) => (
              <span key={dest} className="rounded-full border border-ivory/15 bg-ink/60 px-3 py-1">
                {dest}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 text-[11px] uppercase tracking-[0.2em] text-ivory/60 sm:flex-row">
          <p>© {year} {site.legalNote}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-dot" />
            Express Courier Dispatch Worldwide from Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
