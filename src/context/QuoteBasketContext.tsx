"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/content/site";

export interface BasketItem {
  id: string;
  name: string;
  categorySlug?: string;
  quantity: string;
  specs?: string;
  image?: string;
  moq?: string;
}

interface QuoteBasketContextType {
  items: BasketItem[];
  addItem: (item: Omit<BasketItem, "id"> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: string) => void;
  clearBasket: () => void;
  totalCount: number;
  
  // Drawer state
  isBasketOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;

  // Quote Modal state
  isQuoteModalOpen: boolean;
  quoteModalProduct: string | null;
  openQuoteModal: (productName?: string) => void;
  closeQuoteModal: () => void;

  // Quick View Modal state
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuoteBasketContext = createContext<QuoteBasketContextType | undefined>(undefined);

export function QuoteBasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteModalProduct, setQuoteModalProduct] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rafiq_quote_basket");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load basket from localStorage", e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("rafiq_quote_basket", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save basket to localStorage", e);
    }
  }, [items]);

  const addItem = (newItem: Omit<BasketItem, "id"> & { id?: string }) => {
    const id = newItem.id || `${newItem.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.name === newItem.name);
      if (existing) {
        return prev.map((i) =>
          i.name === newItem.name
            ? { ...i, quantity: newItem.quantity || i.quantity, specs: newItem.specs || i.specs }
            : i
        );
      }
      return [...prev, { ...newItem, id }];
    });
    setIsBasketOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearBasket = () => {
    setItems([]);
  };

  const openQuoteModal = (productName?: string) => {
    setQuoteModalProduct(productName || null);
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setQuoteModalProduct(null);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const totalCount = items.length;

  return (
    <QuoteBasketContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearBasket,
        totalCount,
        isBasketOpen,
        openBasket: () => setIsBasketOpen(true),
        closeBasket: () => setIsBasketOpen(false),
        isQuoteModalOpen,
        quoteModalProduct,
        openQuoteModal,
        closeQuoteModal,
        quickViewProduct,
        openQuickView,
        closeQuickView,
      }}
    >
      {children}
    </QuoteBasketContext.Provider>
  );
}

export function useQuoteBasket() {
  const context = useContext(QuoteBasketContext);
  if (!context) {
    throw new Error("useQuoteBasket must be used within a QuoteBasketProvider");
  }
  return context;
}
