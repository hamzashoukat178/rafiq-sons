import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products as defaultProducts } from "@/content/site";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteBasket from "@/components/QuoteBasket";
import QuoteModal from "@/components/QuoteModal";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import ProductDetailClient from "@/components/ProductDetailClient";
import HowToOrder from "@/components/HowToOrder";
import FaqSection from "@/components/FaqSection";
import FloatingActions from "@/components/FloatingActions";
import { loadContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return defaultProducts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const content = await loadContent();
  const product = content.products.find((p) => p.slug === slug) || defaultProducts.find((p) => p.slug === slug);
  
  if (!product) {
    return { title: "Product Not Found - Rafiq Sons Labels" };
  }

  const category = content.categories.find((c) => c.slug === product.categorySlug);

  return {
    title: `${product.name} | Custom Manufacturing - Rafiq Sons Labels`,
    description: `${product.description} Direct factory manufacturer for clothing brands in Saudi Arabia, UAE, Qatar, Kuwait, UK, USA & Pakistan. Low MOQ ${product.moq || "100 pcs"}. Free digital artwork mockup.`,
    keywords: [
      product.name,
      category?.name || "Garment Trims",
      "custom clothing labels manufacturer",
      "custom garment tags Saudi Arabia",
      "woven labels Dubai UAE",
      "clothing packaging Riyadh",
      "custom patches low MOQ",
    ],
    openGraph: {
      title: `${product.name} | Direct Factory Manufacturer`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const content = await loadContent();
  const product = content.products.find((p) => p.slug === slug) || defaultProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const category = content.categories.find((c) => c.slug === product.categorySlug);
  const relatedProducts = content.products
    .filter((p) => p.slug !== product.slug && (p.categorySlug === product.categorySlug || !product.categorySlug))
    .slice(0, 4);

  // Structured JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `https://www.rafiqsonslabels.com${product.image}`,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Rafiq Sons Labels",
    },
    category: category?.name || "Clothing Trims & Packaging",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0.05",
      highPrice: "2.50",
      offerCount: "1000",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Rafiq Sons Labels",
      },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.rafiqsonslabels.com",
      },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: `https://www.rafiqsonslabels.com/category/${category.slug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `https://www.rafiqsonslabels.com/product/${product.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: product.name,
              item: `https://www.rafiqsonslabels.com/product/${product.slug}`,
            },
          ]),
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div>
        <AnnouncementBar
          text={content.announcement?.text}
          cta={content.announcement?.cta}
          link={content.announcement?.link}
        />
        <Header site={content.site} />

        <main>
          {/* Breadcrumb Bar */}
          <div className="bg-white border-b border-slate-200 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto scrollbar-none">
                <Link href="/" className="hover:text-amber-800 transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link href="/#categories" className="hover:text-amber-800 transition-colors">
                  Catalog
                </Link>
                {category && (
                  <>
                    <span>/</span>
                    <Link href={`/category/${category.slug}`} className="hover:text-amber-800 transition-colors truncate max-w-[150px]">
                      {category.name}
                    </Link>
                  </>
                )}
                <span>/</span>
                <span className="text-slate-900 font-bold truncate max-w-[200px]">{product.name}</span>
              </nav>
            </div>
          </div>

          {/* Main Product Details Section */}
          <section className="py-8 sm:py-12 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ProductDetailClient product={product} category={category} />
            </div>
          </section>

          {/* Related Products Grid */}
          {relatedProducts.length > 0 && (
            <section className="py-12 lg:py-16 bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Explore More Trims
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      Related Products & Custom Options
                    </h2>
                  </div>
                  {category && (
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1"
                    >
                      <span>View All in {category.name}</span>
                      <span>→</span>
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/product/${p.slug}`}
                      className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-amber-400 transition-all duration-300"
                    >
                      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                        <div className="absolute top-3 left-3 bg-slate-900/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold">
                          {p.tag}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition-colors line-clamp-2">
                            {p.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                            {p.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-800">
                          <span>MOQ: {p.moq || "100 pcs"}</span>
                          <span className="group-hover:translate-x-1 transition-transform">View Details →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 4-Step How to Order */}
          <HowToOrder steps={content.orderSteps} />

          {/* FAQs */}
          <FaqSection items={content.faqs} />
        </main>
      </div>

      <Footer site={content.site} footer={content.footer} />

      <QuoteBasket />
      <QuoteModal />
      <ProductQuickViewModal />
      <FloatingActions />
    </div>
  );
}
