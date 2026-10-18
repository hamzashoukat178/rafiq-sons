"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { categories, site as defaultSite } from "@/content/site";

interface FooterProps {
  site?: typeof defaultSite;
  footer?: {
    tagline?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    instagram?: string;
    copyright?: string;
  };
}

export default function Footer({ site = defaultSite, footer }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const phone = footer?.phone || site.phoneDisplay || "+92 320 2025795";
  const whatsappUrl = footer?.whatsapp || site.whatsapp || "https://wa.me/923202025795";
  const instagramUrl = footer?.instagram || site.instagram || "https://www.instagram.com/rafiqsonslabelss";

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1 & 2: Brand Profile */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-48">
                <Image
                  src="/brand/logo-wide-light.png"
                  alt="Rafiq Sons Labels"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Direct factory manufacturer of custom high-density damask woven labels, 3D silicone rubber logos, debossed leather patches, metal badges, luxury hang tags, and frosted apparel packaging.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-amber-400 pt-1">
              <span>🏭 Direct Factory Rates</span>
              <span>•</span>
              <span>📦 MOQ 100 pcs</span>
              <span>•</span>
              <span>⚡ 24h Digital Proofs</span>
            </div>
            
            <div className="pt-2 flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>💬 WhatsApp Support</span>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>📸 @rafiqsonslabelss</span>
              </a>
            </div>
          </div>

          {/* Col 3: Core Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Core Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Packaging & Trims */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              More Products
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(4).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#packages" className="text-amber-400 font-semibold hover:text-amber-300">
                  🎁 5-in-1 Combo Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Global Shipping Hubs & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Express Delivery Hubs
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ✈️ <strong>GCC Express (2–4 Days):</strong> Riyadh, Jeddah, Dubai, Abu Dhabi, Doha, Kuwait City, Manama, Muscat.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              🌍 <strong>Worldwide:</strong> UK (London), USA (New York, LA), Europe, Canada, Australia.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <p>Direct Inquiries: <span className="text-slate-200 font-semibold">{phone}</span></p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Rafiq Sons Labels. Direct Factory Manufacturer. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/#faqs" className="hover:text-slate-400 transition-colors">
              FAQ
            </Link>
            <Link href="/#how-to-order" className="hover:text-slate-400 transition-colors">
              Ordering Guide
            </Link>
            <Link
              href="/admin"
              className="text-slate-500 hover:text-amber-400 transition-colors"
            >
              🔐 Admin CMS Studio
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
