"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuoteBasket } from "@/context/QuoteBasketContext";
import { categories as defaultCategories, type ProductCategory } from "@/content/site";

interface HeaderProps {
  site?: {
    name?: string;
    phoneDisplay?: string;
    whatsapp?: string;
  };
  categories?: ProductCategory[];
}

export default function Header({ site, categories: passedCategories }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const { totalCount, openBasket, openQuoteModal } = useQuoteBasket();

  const categories = passedCategories && passedCategories.length > 0 ? passedCategories : defaultCategories;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = site?.whatsapp || "https://wa.me/923202025795";

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-2.5"
          : "bg-white border-b border-slate-100 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative h-10 w-44 sm:h-11 sm:w-52">
              <Image
                src="/brand/logo-wide.png"
                alt="Rafiq Sons Labels"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-700">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg hover:text-amber-700 hover:bg-slate-50 transition-colors"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-amber-700 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              >
                <span>Categories</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoriesDropdownOpen ? "rotate-180 text-amber-700" : "text-slate-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    8 Core Product Pillars
                  </div>
                  <div className="grid grid-cols-1 gap-0.5 p-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <span className="font-semibold">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                          {cat.moq.split(" ")[0]} {cat.moq.split(" ")[1]}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/#catalog"
              className="px-3 py-2 rounded-lg hover:text-amber-700 hover:bg-slate-50 transition-colors"
            >
              Products Catalog
            </Link>

            <Link
              href="/#packages"
              className="px-3 py-2 rounded-lg hover:text-amber-700 hover:bg-slate-50 transition-colors"
            >
              Combo Packages
            </Link>

            <Link
              href="/#how-to-order"
              className="px-3 py-2 rounded-lg hover:text-amber-700 hover:bg-slate-50 transition-colors"
            >
              How to Order
            </Link>

            <Link
              href="/#why-us"
              className="px-3 py-2 rounded-lg hover:text-amber-700 hover:bg-slate-50 transition-colors"
            >
              Why Us
            </Link>

            <Link
              href="/#faqs"
              className="px-3 py-2 rounded-lg hover:text-amber-700 hover:bg-slate-50 transition-colors"
            >
              FAQs
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quote Basket Drawer Button */}
            <button
              onClick={openBasket}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50/50 transition-all cursor-pointer flex items-center justify-center"
              aria-label="View Quote Basket"
              title="View Quote Basket"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Branded Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366]/10 text-emerald-800 border border-[#25D366]/40 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] font-bold text-xs transition-all shadow-sm group"
              title="Chat with Rafiq Sons Labels on WhatsApp"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 group-hover:bg-white" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600 group-hover:bg-white" />
              </span>
              <svg className="w-4 h-4 fill-emerald-600 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.529 1.849.813 2.791.813h.005c3.18 0 5.767-2.586 5.768-5.766 0-3.181-2.587-5.767-5.768-5.767zm7.557 5.765c0 4.168-3.391 7.559-7.558 7.559-1.327 0-2.571-.347-3.66-1l-4.07 1.068 1.087-3.974c-.732-1.155-1.121-2.484-1.121-3.653 0-4.169 3.391-7.56 7.558-7.56 4.167 0 7.558 3.391 7.558 7.56zm-4.321 2.378c-.237-.118-1.403-.692-1.62-.771-.218-.079-.376-.118-.535.118-.158.237-.614.771-.752.929-.139.158-.277.178-.514.059-.237-.118-1.002-.369-1.908-1.177-.706-.629-1.183-1.406-1.321-1.644-.138-.237-.015-.365.104-.483.107-.106.237-.277.356-.415.119-.138.158-.237.237-.395.079-.158.04-.297-.02-.415-.059-.118-.535-1.286-.732-1.761-.193-.464-.389-.401-.535-.408-.138-.007-.297-.008-.455-.008-.158 0-.415.059-.633.297-.218.237-.831.812-.831 1.98 0 1.168.851 2.296.969 2.454.119.158 1.674 2.557 4.056 3.585.567.245 1.009.391 1.354.502.569.181 1.087.155 1.496.094.456-.068 1.403-.574 1.601-1.128.198-.554.198-1.029.139-1.128-.059-.099-.218-.158-.455-.277z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Custom Quote Modal Button */}
            <button
              onClick={() => openQuoteModal()}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-amber-600 font-semibold text-xs transition-all shadow-sm hover:shadow cursor-pointer"
            >
              Get Custom Quote
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 pb-4 space-y-2 animate-in fade-in duration-150">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              href="/#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Products Catalog
            </Link>
            <Link
              href="/#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              5-in-1 Combo Packages
            </Link>
            <Link
              href="/#how-to-order"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              How to Order
            </Link>
            <Link
              href="/#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Why Choose Us
            </Link>
            <Link
              href="/#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              FAQs
            </Link>

            {/* Mobile Categories Accordion */}
            <div className="pt-2 border-t border-slate-100">
              <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Categories (8 Core Pillars)
              </p>
              <div className="grid grid-cols-1 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-amber-50"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">View →</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.529 1.849.813 2.791.813h.005c3.18 0 5.767-2.586 5.768-5.766 0-3.181-2.587-5.767-5.768-5.767zm7.557 5.765c0 4.168-3.391 7.559-7.558 7.559-1.327 0-2.571-.347-3.66-1l-4.07 1.068 1.087-3.974c-.732-1.155-1.121-2.484-1.121-3.653 0-4.169 3.391-7.56 7.558-7.56 4.167 0 7.558 3.391 7.558 7.56zm-4.321 2.378c-.237-.118-1.403-.692-1.62-.771-.218-.079-.376-.118-.535.118-.158.237-.614.771-.752.929-.139.158-.277.178-.514.059-.237-.118-1.002-.369-1.908-1.177-.706-.629-1.183-1.406-1.321-1.644-.138-.237-.015-.365.104-.483.107-.106.237-.277.356-.415.119-.138.158-.237.237-.395.079-.158.04-.297-.02-.415-.059-.118-.535-1.286-.732-1.761-.193-.464-.389-.401-.535-.408-.138-.007-.297-.008-.455-.008-.158 0-.415.059-.633.297-.218.237-.831.812-.831 1.98 0 1.168.851 2.296.969 2.454.119.158 1.674 2.557 4.056 3.585.567.245 1.009.391 1.354.502.569.181 1.087.155 1.496.094.456-.068 1.403-.574 1.601-1.128.198-.554.198-1.029.139-1.128-.059-.099-.218-.158-.455-.277z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openQuoteModal();
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                ⚡ Request Custom Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
