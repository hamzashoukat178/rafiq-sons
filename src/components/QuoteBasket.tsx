"use client";

import React from "react";
import Image from "next/image";
import { useQuoteBasket } from "@/context/QuoteBasketContext";

export default function QuoteBasket() {
  const {
    items,
    isBasketOpen,
    closeBasket,
    removeItem,
    updateQuantity,
    clearBasket,
    openQuoteModal,
  } = useQuoteBasket();

  if (!isBasketOpen) return null;

  const handleProceed = () => {
    closeBasket();
    openQuoteModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={closeBasket}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Custom Quote Basket</h3>
                <p className="text-xs text-slate-500">{items.length} item{items.length !== 1 ? "s" : ""} selected for quotation</p>
              </div>
            </div>
            <button
              onClick={closeBasket}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body / Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto text-slate-400">
                  🏷️
                </div>
                <h4 className="text-base font-bold text-slate-800">Your Quote Basket is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our catalog and add woven labels, hang tags, patches, or packaging bags to request a combined multi-item quote.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 relative group"
                  >
                    {item.image && (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pr-6 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                      {item.specs && (
                        <p className="text-[11px] text-slate-500 truncate">{item.specs}</p>
                      )}
                      
                      {/* Quantity input */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Qty:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                          className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="100 pcs">100 pcs (MOQ)</option>
                          <option value="250 pcs">250 pcs</option>
                          <option value="500 pcs">500 pcs</option>
                          <option value="1,000 pcs">1,000 pcs</option>
                          <option value="2,500 pcs">2,500 pcs</option>
                          <option value="5,000 pcs">5,000 pcs</option>
                          <option value="10,000+ pcs">10,000+ pcs (Wholesale)</option>
                        </select>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 text-xs"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  onClick={clearBasket}
                  className="text-xs text-slate-400 hover:text-red-600 underline underline-offset-2 pt-2"
                >
                  Clear all items
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-2">
            {items.length > 0 && (
              <button
                onClick={handleProceed}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡ Proceed to Custom Quotation ({items.length} Items)</span>
                <span aria-hidden="true">→</span>
              </button>
            )}
            <button
              onClick={closeBasket}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Continue Browsing Products
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
