"use client";

import React from "react";
import type { Product } from "@/content/site";
import ProductCardItem from "@/components/ProductCardItem";

interface CategoryProductGridProps {
  products: Product[];
}

export default function CategoryProductGrid({ products }: CategoryProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((prod) => (
        <ProductCardItem key={prod.slug} prod={prod} />
      ))}
    </div>
  );
}
