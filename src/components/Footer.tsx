"use client";

import Image from "next/image";
import { site as defaultSite, footer, marqueeItems } from "@/content/site";
import { FadeUp } from "./Reveal";
import Magnetic from "./Magnetic";

export default function Footer({ site = defaultSite }: { site?: typeof defaultSite }) {
  const go = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line-dark bg-coal">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-gold/8 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-8">
        <FadeUp className="text-center">
          <p className="eyebrow text-gold">{footer.note}</p>
          <h2 className="display-tight mx-auto mt-6 max-w-4xl font-display text-5xl text-ivory sm:text-7xl">
            {footer.big}
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic strength={0.25}>
              <button
                onClick={() => go("#quote")}
                className="btn-sheen rounded-full bg-gold px-8 py-4 text-sm font-semibold text-ink"
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

        <div className="mt-24 grid gap-12 border-t border-line-dark pt-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/logo-wide-light.png"
              alt="Rafiq Sons logo"
              width={176}
              height={58}
              className="h-12 w-auto"
            />
            <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-smoke">Woven with intent</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/45">
              Woven labels, satin labels, hang tags, cards and packaging for clothing brands. {site.location}.
            </p>
          </div>

          <div>
            <p className="eyebrow text-[10px] text-smoke">Collections</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/60">
              {marqueeItems.slice(0, 5).map((m) => (
                <li key={m}>
                  <button onClick={() => go("#collections")} className="transition-colors hover:text-gold">{m}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-[10px] text-smoke">Studio</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/60">
              <li><button onClick={() => go("#atelier")} className="transition-colors hover:text-gold">The process</button></li>
              <li><button onClick={() => go("#gallery")} className="transition-colors hover:text-gold">Showroom</button></li>
              <li><button onClick={() => go("#faq")} className="transition-colors hover:text-gold">FAQ</button></li>
              <li><button onClick={() => go("#quote")} className="transition-colors hover:text-gold">Request a quote</button></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-[10px] text-smoke">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/60">
              <li><a href={site.whatsapp} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">{site.phoneDisplay}</a></li>
              <li><a href={`mailto:${site.email}`} className="transition-colors hover:text-gold">{site.email}</a></li>
              <li><a href={site.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">@rafiqsonslabelss</a></li>
              <li className="text-ivory/40">{site.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-line-dark pt-8 text-[11px] uppercase tracking-[0.2em] text-smoke sm:flex-row">
          <p>© {year} {site.legalNote}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-dot" />
            Delivering worldwide from Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
