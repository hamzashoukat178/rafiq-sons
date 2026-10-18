"use client";

import React, { useEffect, useState } from "react";
import { useQuoteBasket } from "@/context/QuoteBasketContext";
import { site } from "@/content/site";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const { totalCount, openBasket, openQuoteModal } = useQuoteBasket();

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappUrl = site.whatsapp || "https://wa.me/923202025795";

  return (
    <>
      {/* Floating Speed Dial on bottom right */}
      <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2.5 sm:bottom-8 sm:right-8">
        
        {/* Back to top button */}
        {showTop && (
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/95 text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-slate-100 hover:text-amber-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}

        {/* Floating Basket Shortcut */}
        {totalCount > 0 && (
          <button
            onClick={openBasket}
            className="relative flex items-center gap-2 rounded-full border border-amber-300 bg-amber-500 text-slate-950 px-4 py-2.5 shadow-lg transition-transform hover:scale-105 font-bold text-xs"
          >
            <span>🛒 Basket ({totalCount})</span>
          </button>
        )}

        {/* WhatsApp Direct Floating Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Rafiq Sons on WhatsApp"
          className="group relative flex items-center gap-2 rounded-full border border-emerald-500 bg-emerald-600 px-4 py-3 shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105 text-white"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>

          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.529 1.849.813 2.791.813h.005c3.18 0 5.767-2.586 5.768-5.766 0-3.181-2.587-5.767-5.768-5.767zm7.557 5.765c0 4.168-3.391 7.559-7.558 7.559-1.327 0-2.571-.347-3.66-1l-4.07 1.068 1.087-3.974c-.732-1.155-1.121-2.484-1.121-3.653 0-4.169 3.391-7.56 7.558-7.56 4.167 0 7.558 3.391 7.558 7.56zm-4.321 2.378c-.237-.118-1.403-.692-1.62-.771-.218-.079-.376-.118-.535.118-.158.237-.614.771-.752.929-.139.158-.277.178-.514.059-.237-.118-1.002-.369-1.908-1.177-.706-.629-1.183-1.406-1.321-1.644-.138-.237-.015-.365.104-.483.107-.106.237-.277.356-.415.119-.138.158-.237.237-.395.079-.158.04-.297-.02-.415-.059-.118-.535-1.286-.732-1.761-.193-.464-.389-.401-.535-.408-.138-.007-.297-.008-.455-.008-.158 0-.415.059-.633.297-.218.237-.831.812-.831 1.98 0 1.168.851 2.296.969 2.454.119.158 1.674 2.557 4.056 3.585.567.245 1.009.391 1.354.502.569.181 1.087.155 1.496.094.456-.068 1.403-.574 1.601-1.128.198-.554.198-1.029.139-1.128-.059-.099-.218-.158-.455-.277z" />
          </svg>

          <span className="hidden text-xs font-bold tracking-wide sm:inline-block">
            WhatsApp
          </span>
        </a>
      </div>

      {/* Mobile Sticky Quick-Action Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-md sm:hidden shadow-lg">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm"
        >
          <span>💬 WhatsApp Us</span>
        </a>
        <button
          onClick={() => openQuoteModal()}
          className="flex flex-1 items-center justify-center rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm"
        >
          ⚡ Custom Quote
        </button>
      </div>
    </>
  );
}
