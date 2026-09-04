"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/content/site";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goQuote = () => {
    document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Floating Speed Dial on bottom right */}
      <div className="fixed bottom-6 right-5 z-[99] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
        {/* Back to top button */}
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 bg-coal/90 text-ivory/80 shadow-lg backdrop-blur-md transition-all hover:border-gold hover:text-gold"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp Direct Floating Button */}
        <motion.a
          href={site.whatsapp}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#0c0b09]/95 px-4 py-3 shadow-[0_10px_35px_-8px_rgba(37,211,102,0.4)] backdrop-blur-xl transition-colors hover:border-[#25D366]"
        >
          {/* Online green indicator pulse */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#25D366]" />
          </span>

          {/* WhatsApp Icon */}
          <svg className="h-5 w-5 fill-[#25D366]" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>

          <span className="hidden text-xs font-semibold tracking-wide text-ivory group-hover:text-gold sm:inline-block">
            Quick Chat
          </span>
        </motion.a>
      </div>

      {/* Mobile Sticky Quick-Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-[90] flex items-center justify-between gap-3 border-t border-ivory/15 bg-ink/95 px-4 py-3 backdrop-blur-xl sm:hidden">
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ivory/20 bg-coal py-2.5 text-xs font-semibold text-ivory"
        >
          <span className="h-2 w-2 rounded-full bg-[#25D366]" />
          WhatsApp Us
        </a>
        <button
          onClick={goQuote}
          className="btn-sheen flex flex-1 items-center justify-center rounded-full bg-gold py-2.5 text-xs font-bold text-ink"
        >
          Request a Quote
        </button>
      </div>
    </>
  );
}
