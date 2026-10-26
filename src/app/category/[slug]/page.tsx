import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories as defaultCategories, defaultTechnicalSpecs } from "@/content/site";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteBasket from "@/components/QuoteBasket";
import QuoteModal from "@/components/QuoteModal";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import HowToOrder from "@/components/HowToOrder";
import FaqSection from "@/components/FaqSection";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import FloatingActions from "@/components/FloatingActions";
import { loadContent } from "@/lib/content";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return defaultCategories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const content = await loadContent();
  const category = content.categories.find((c) => c.slug === slug) || defaultCategories.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found - Rafiq Sons Labels" };

  return {
    title: `${category.name} Manufacturer | Custom Garment Trims - Rafiq Sons Labels`,
    description: `${category.description} Direct factory wholesale pricing, low MOQ starting at 100 pcs, and express courier shipping to GCC & worldwide.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const content = await loadContent();
  const category = content.categories.find((c) => c.slug === slug) || defaultCategories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = content.products.filter((p) => p.categorySlug === category.slug);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <AnnouncementBar
          text={content.announcement?.text}
          cta={content.announcement?.cta}
          link={content.announcement?.link}
        />
        <Header site={content.site} categories={content.categories} />

        <main>
          {/* Breadcrumb */}
          <div className="bg-white border-b border-slate-200 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Link href="/" className="hover:text-amber-700">Home</Link>
                <span>/</span>
                <Link href="/#categories" className="hover:text-amber-700">Categories</Link>
                <span>/</span>
                <span className="text-slate-900 font-bold">{category.name}</span>
              </nav>
            </div>
          </div>

          {/* Category Hero Banner */}
          <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
                    <span>★ {category.badge}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                    {category.name}
                  </h1>
                  <p className="text-base sm:text-lg font-semibold text-amber-800">
                    {category.tagline}
                  </p>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                    {category.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3">
                    {category.featuredSpecs.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <span className="text-amber-600 font-bold">✓</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* MOQ & Turnaround Bar */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                      📦 MOQ: {category.moq}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                      ⏱️ Turnaround: {category.turnaround}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      ⚡ 24h Free Digital Proof
                    </span>
                  </div>
                </div>

                {/* Right Image */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Products in this category */}
          <section className="py-14 lg:py-20 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Available Variations & Finishes
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Choose your preferred weave density, material finish, or fold type to request custom quotation.
                </p>
              </div>

              <CategoryProductGrid products={categoryProducts.length > 0 ? categoryProducts : content.products.slice(0, 4)} />
            </div>
          </section>

          {/* Technical Specifications Guide */}
          <section className="py-14 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Manufacturing Specifications & Quality Standards
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  We guarantee precise execution across all yarn densities, fold finishes, and color tolerances.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {defaultTechnicalSpecs.map((specCat, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                      {specCat.category}
                    </h4>
                    <div className="space-y-2.5">
                      {specCat.items.map((item, iIdx) => (
                        <div key={iIdx}>
                          <p className="text-xs font-bold text-amber-900">{item.name}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How to Order & FAQs */}
          <HowToOrder steps={content.orderSteps} />
          <FaqSection items={content.faqs} />

        </main>
      </div>

      <Footer site={content.site} categories={content.categories} footer={content.footer} />

      {/* Interactive Global Modals */}
      <QuoteBasket />
      <QuoteModal />
      <ProductQuickViewModal />
      <FloatingActions site={content.site} />
    </div>
  );
}
