"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuoteBasket } from "@/context/QuoteBasketContext";
import type { Product, ProductCategory } from "@/content/site";

interface ProductDetailClientProps {
  product: Product;
  category?: ProductCategory;
}

const QUANTITY_PRESETS = ["100 pcs", "250 pcs", "500 pcs", "1,000 pcs", "2,500 pcs", "5,000+ pcs"];

export default function ProductDetailClient({ product, category }: ProductDetailClientProps) {
  const { addItem, openQuoteModal } = useQuoteBasket();

  // Multi-image gallery logic
  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [selectedQty, setSelectedQty] = useState("500 pcs");
  const [selectedFinish, setSelectedFinish] = useState(
    product.finishes && product.finishes.length > 0 ? product.finishes[0] : ""
  );
  const [activeTab, setActiveTab] = useState<"specs" | "shipping" | "artwork">("specs");

  const handleAddToBasket = () => {
    const specsString = [
      selectedFinish ? `Finish: ${selectedFinish}` : null,
      product.material ? `Material: ${product.material}` : null,
    ].filter(Boolean).join(" • ");

    addItem({
      name: product.name,
      categorySlug: product.categorySlug,
      quantity: selectedQty,
      specs: specsString || product.detail,
      image: activeImage || product.image,
      moq: product.moq,
    });
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Rafiq Sons Labels! I am interested in ordering:
*Product:* ${product.name}
*Quantity:* ${selectedQty}
${selectedFinish ? `*Finish/Fold:* ${selectedFinish}\n` : ""}*Category:* ${category?.name || "Garment Trims"}
*Link:* https://www.rafiqsonslabels.com/product/${product.slug}

Please share pricing and production timeline.`
  );

  const whatsappUrl = `https://wa.me/923202025795?text=${whatsappMessage}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
      
      {/* LEFT COLUMN: Multi-Image Carousel / Gallery */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Main Display Image */}
        <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className="object-cover transition-all duration-300"
            priority
            sizes="(max-width: 768px) 100vw, 600px"
          />

          {/* Floating Tag */}
          <div className="absolute top-4 left-4 bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-md">
            ★ {product.tag}
          </div>

          {/* Low MOQ Badge */}
          {product.moq && (
            <div className="absolute bottom-4 left-4 bg-white/95 text-slate-900 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-extrabold border border-slate-200/80 shadow-md flex items-center gap-1.5">
              <span>📦 MOQ:</span>
              <span className="text-amber-800">{product.moq}</span>
            </div>
          )}
        </div>

        {/* Thumbnails Strip */}
        {galleryImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {galleryImages.map((img, idx) => {
              const isSelected = activeImage === img;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-amber-500 ring-2 ring-amber-400/30 scale-105"
                      : "border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Trust Highlight Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
            <span className="text-xl">🏭</span>
            <div className="text-[11px] font-bold text-slate-800 mt-1">Direct Factory</div>
            <div className="text-[10px] text-slate-500">Wholesale pricing</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
            <span className="text-xl">⚡</span>
            <div className="text-[11px] font-bold text-slate-800 mt-1">24h Free Mockup</div>
            <div className="text-[10px] text-slate-500">Digital artwork proof</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
            <span className="text-xl">✈️</span>
            <div className="text-[11px] font-bold text-slate-800 mt-1">Express Courier</div>
            <div className="text-[10px] text-slate-500">DHL/FedEx to GCC & Global</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
            <span className="text-xl">🛡️</span>
            <div className="text-[11px] font-bold text-slate-800 mt-1">Quality Guarantee</div>
            <div className="text-[10px] text-slate-500">100% Weave Inspection</div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Product Configurator & Instant Quote Actions */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Category & Badge */}
        <div>
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full uppercase tracking-wider mb-2 transition-colors"
            >
              <span>← Back to {category.name}</span>
            </Link>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {product.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Technical Highlights Bar */}
        <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Production Timeline:</span>
            <span className="text-slate-900 font-bold">{product.turnaround || "5 – 7 working days"}</span>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-slate-200 pt-2">
            <span className="text-slate-500 font-medium">Minimum Order (MOQ):</span>
            <span className="text-amber-800 font-bold">{product.moq || "100 pcs"}</span>
          </div>
          {product.material && (
            <div className="flex items-center justify-between text-xs border-t border-slate-200 pt-2">
              <span className="text-slate-500 font-medium">Standard Material:</span>
              <span className="text-slate-900 font-semibold truncate max-w-[200px]">{product.material}</span>
            </div>
          )}
        </div>

        {/* Finishes / Folds Selection (if available) */}
        {product.finishes && product.finishes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Select Finish / Fold Style:
              </label>
              <span className="text-xs font-bold text-amber-700">{selectedFinish}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.finishes.map((finish, idx) => {
                const isSelected = selectedFinish === finish;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedFinish(finish)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-sm ring-2 ring-slate-900"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {finish}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Select Target Quantity:
            </label>
            <span className="text-xs font-bold text-amber-700">{selectedQty}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {QUANTITY_PRESETS.map((qty, idx) => {
              const isSelected = selectedQty === qty;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedQty(qty)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-500"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {qty}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          
          {/* Add to Quote Basket */}
          <button
            type="button"
            onClick={handleAddToBasket}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-amber-600 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🛒 Add to Quote Basket</span>
            <span className="text-xs opacity-80">({selectedQty})</span>
          </button>

          {/* Instant Quote Modal Trigger */}
          <button
            type="button"
            onClick={() => openQuoteModal(product.name)}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>⚡ Request Custom Wholesale Quote</span>
          </button>

          {/* Instant WhatsApp Inquiry */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="text-base">💬</span>
            <span>WhatsApp Direct Inquiry</span>
          </a>

        </div>

        {/* Detailed Tabs: Specs / Shipping / Artwork */}
        <div className="border-t border-slate-200 pt-5 space-y-3">
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "specs"
                  ? "border-amber-600 text-amber-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Technical Specs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "shipping"
                  ? "border-amber-600 text-amber-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Courier & Shipping
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("artwork")}
              className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "artwork"
                  ? "border-amber-600 text-amber-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Artwork Guidelines
            </button>
          </div>

          {activeTab === "specs" && (
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p><strong className="text-slate-900">Composition:</strong> {product.detail || "Direct factory manufactured to your exact artwork specifications."}</p>
              {product.recommendedFor && (
                <p><strong className="text-slate-900">Recommended For:</strong> {product.recommendedFor}</p>
              )}
              <p><strong className="text-slate-900">Color Matching:</strong> Free Pantone (PMS) matching with physical thread/pantone book verification.</p>
              <p><strong className="text-slate-900">Durability:</strong> Industrial wash tested, heat resistant, zero-fray ultrasonic laser cut edges.</p>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p><strong className="text-slate-900">🇸🇦 Saudi Arabia (Riyadh, Jeddah, Dammam):</strong> 3 – 5 days via DHL/FedEx Express.</p>
              <p><strong className="text-slate-900">🇦🇪 UAE (Dubai, Abu Dhabi, Sharjah):</strong> 3 – 4 days doorstep delivery.</p>
              <p><strong className="text-slate-900">🇶🇦 🇰🇼 🇧🇭 Qatar, Kuwait, Bahrain, Oman:</strong> 4 – 5 days express courier.</p>
              <p><strong className="text-slate-900">🇵🇰 Pakistan (Karachi, Lahore, Faisalabad):</strong> 1 – 2 days via TCS / Leopard.</p>
              <p><strong className="text-slate-900">🇬🇧 🇺🇸 UK, USA & Europe:</strong> 4 – 6 working days tracked air courier.</p>
            </div>
          )}

          {activeTab === "artwork" && (
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p><strong className="text-slate-900">Accepted Formats:</strong> Adobe Illustrator (.AI), PDF, EPS, CorelDraw (.CDR), SVG, or high-res PNG (300+ DPI).</p>
              <p><strong className="text-slate-900">Don&apos;t have vector files?</strong> Send us your image or sketch on WhatsApp—our design team will digitize and vectorize it for free.</p>
              <p><strong className="text-slate-900">Free Digital Mockup:</strong> We provide a full 1:1 scale digital proof for approval before production begins.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
