"use client";

import React, { useState, useEffect } from "react";
import { useQuoteBasket } from "@/context/QuoteBasketContext";

const COUNTRY_OPTIONS = [
  { code: "SA", name: "Saudi Arabia (KSA)", flag: "🇸🇦" },
  { code: "AE", name: "United Arab Emirates (UAE)", flag: "🇦🇪" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "GB", name: "United Kingdom (UK)", flag: "🇬🇧" },
  { code: "US", name: "United States (USA)", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "OTHER", name: "Other International", flag: "🌍" },
];

export default function QuoteModal() {
  const {
    items,
    isQuoteModalOpen,
    quoteModalProduct,
    closeQuoteModal,
    clearBasket,
  } = useQuoteBasket();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [contact, setContact] = useState("");
  const [country, setCountry] = useState("Saudi Arabia (KSA)");
  const [city, setCity] = useState("");
  const [quantity, setQuantity] = useState("500 pcs");
  const [dimensions, setDimensions] = useState("");
  const [colors, setColors] = useState("");
  const [material, setMaterial] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState("Express Air (3 – 5 Days)");
  const [message, setMessage] = useState("");
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designFilePreview, setDesignFilePreview] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isQuoteModalOpen) {
      setSubmitted(false);
      setError("");
    }
  }, [isQuoteModalOpen]);

  if (!isQuoteModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesignFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setDesignFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeProductSummary = quoteModalProduct
    ? quoteModalProduct
    : items.length > 0
    ? items.map((i) => `${i.name} (${i.quantity})`).join(", ")
    : "Custom Garment Trims & Packaging";

  // Preformatted WhatsApp message
  const whatsappText = encodeURIComponent(
    `Hello Rafiq Sons Labels,\n\nI just submitted a custom quotation request:\n• Name: ${name || "Client"}\n• Brand: ${brand || "Not provided"}\n• Products: ${activeProductSummary}\n• Country/City: ${city ? `${city}, ` : ""}${country}\n• Quantity: ${quantity}\n• Delivery: ${deliveryPreference}\n\nPlease share quotation & 24h digital mockup.`
  );

  const whatsappRedirectUrl = `https://wa.me/923202025795?text=${whatsappText}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setError("Please provide your name and contact number / WhatsApp.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        name,
        brand,
        contact,
        country,
        city,
        product: activeProductSummary,
        quantity: items.length > 0 ? items.map((i) => `${i.quantity}`).join(", ") : quantity,
        dimensions,
        colors,
        material,
        deliveryPreference,
        items: items.length > 0 ? items : undefined,
        message,
        fileUrl: designFilePreview ? `Uploaded: ${designFile?.name}` : "",
      };

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit quote request.");
      }

      setSubmitted(true);
      clearBasket();

      // AUTOMATICALLY REDIRECT TO WHATSAPP
      try {
        window.open(whatsappRedirectUrl, "_blank");
      } catch (err) {
        console.log("Auto-popup blocked, user can click the button", err);
      }
    } catch (err: unknown) {
      console.error("Quote submission error:", err);
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again or message on WhatsApp.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <span>⚡ Free 24h Digital Mockup & Quotation</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">Request Factory Direct Quote</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Wholesale manufacturer pricing with low MOQ starting at 100 pcs.
            </p>
          </div>
          <button
            onClick={closeQuoteModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto animate-bounce">
                ✓
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900">Quotation Request Received!</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>! We have saved your request and automatically redirected you to WhatsApp. If WhatsApp did not open automatically, please click below:
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto text-xs space-y-1.5">
                <p><strong>Product(s):</strong> {activeProductSummary}</p>
                <p><strong>Location:</strong> {city ? `${city}, ` : ""}{country}</p>
                <p><strong>Contact:</strong> {contact}</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.529 1.849.813 2.791.813h.005c3.18 0 5.767-2.586 5.768-5.766 0-3.181-2.587-5.767-5.768-5.767zm7.557 5.765c0 4.168-3.391 7.559-7.558 7.559-1.327 0-2.571-.347-3.66-1l-4.07 1.068 1.087-3.974c-.732-1.155-1.121-2.484-1.121-3.653 0-4.169 3.391-7.56 7.558-7.56 4.167 0 7.558 3.391 7.558 7.56zm-4.321 2.378c-.237-.118-1.403-.692-1.62-.771-.218-.079-.376-.118-.535.118-.158.237-.614.771-.752.929-.139.158-.277.178-.514.059-.237-.118-1.002-.369-1.908-1.177-.706-.629-1.183-1.406-1.321-1.644-.138-.237-.015-.365.104-.483.107-.106.237-.277.356-.415.119-.138.158-.237.237-.395.079-.158.04-.297-.02-.415-.059-.118-.535-1.286-.732-1.761-.193-.464-.389-.401-.535-.408-.138-.007-.297-.008-.455-.008-.158 0-.415.059-.633.297-.218.237-.831.812-.831 1.98 0 1.168.851 2.296.969 2.454.119.158 1.674 2.557 4.056 3.585.567.245 1.009.391 1.354.502.569.181 1.087.155 1.496.094.456-.068 1.403-.574 1.601-1.128.198-.554.198-1.029.139-1.128-.059-.099-.218-.158-.455-.277z" />
                  </svg>
                  <span>💬 Open WhatsApp Chat Directly</span>
                </a>
                <button
                  onClick={closeQuoteModal}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  ⚠️ {error}
                </div>
              )}

              {/* Selected Items Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80">
                <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Requested Items:
                </p>
                <p className="text-xs font-semibold text-slate-900">
                  {activeProductSummary}
                </p>
              </div>

              {/* Grid: Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fahad Al-Otaibi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand / Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Streetwear Studio"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Grid: Contact & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+966 50 123 4567 or 0320 1234567"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Destination Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: City & Estimated Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Delivery Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Riyadh, Dubai, London, Lahore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="100 pcs">100 pcs (Minimum Trial Order)</option>
                    <option value="250 pcs">250 pcs</option>
                    <option value="500 pcs">500 pcs (Standard Run)</option>
                    <option value="1,000 pcs">1,000 pcs (Best Value)</option>
                    <option value="2,500 pcs">2,500 pcs</option>
                    <option value="5,000 pcs">5,000 pcs (Wholesale)</option>
                    <option value="10,000+ pcs">10,000+ pcs (Factory Wholesale)</option>
                  </select>
                </div>
              </div>

              {/* Grid: Dimensions & Material / Finish */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dimensions / Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50mm x 25mm"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Yarn / Foil Colors
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Black + Gold Metallic"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Material / Finish
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50D Damask Center Fold"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Delivery Speed */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Speed Preference
                </label>
                <select
                  value={deliveryPreference}
                  onChange={(e) => setDeliveryPreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Express Air (3 – 5 Days)">⚡ Express Air Courier (3 – 5 Days)</option>
                  <option value="Standard Courier (6 – 8 Days)">📦 Standard Courier (6 – 8 Days)</option>
                  <option value="Urgent Sampling & Bulk">🚀 Urgent Sampling Proof First</option>
                </select>
              </div>

              {/* File Upload for Logo Artwork */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Logo Artwork / Reference Photo (AI, PDF, PNG, JPG)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-amber-500 transition-colors bg-slate-50">
                  <input
                    type="file"
                    id="artwork-upload"
                    accept="image/*,.pdf,.ai,.eps,.psd"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="artwork-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <span className="text-2xl">📁</span>
                    <span className="text-xs font-bold text-slate-800">
                      {designFile ? designFile.name : "Click to select or drag logo file"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Vector formats preferred. Low-resolution images will be cleaned for free.
                    </span>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Notes / Fold Preferences / Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Center-fold neck label with black background and gold metallic thread. Need 1,000 pcs delivered to Riyadh."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-amber-600 disabled:bg-slate-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <span>Submitting & Redirecting to WhatsApp...</span>
                  ) : (
                    <span>⚡ Submit Quote & Chat on WhatsApp</span>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
