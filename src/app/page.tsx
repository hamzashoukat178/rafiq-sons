import React from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedCatalog from "@/components/FeaturedCatalog";
import PackageBuilder from "@/components/PackageBuilder";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowToOrder from "@/components/HowToOrder";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import QuoteBasket from "@/components/QuoteBasket";
import QuoteModal from "@/components/QuoteModal";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import { loadContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const content = await loadContent();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-slate-900 flex flex-col justify-between">
      <div>
        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Sticky Light Header */}
        <Header site={content.site} />

        <main>
          {/* Hero Section */}
          <HeroSection hero={content.hero} />

          {/* Shop By Category (8 Core Pillars) */}
          <CategoryGrid />

          {/* Featured Products & Live Interactive Catalog */}
          <FeaturedCatalog items={content.products} />

          {/* Complete 5-in-1 Branding Combo Packages */}
          <PackageBuilder />

          {/* Why Choose Us - 5 Trust Pillars */}
          <WhyChooseUs />

          {/* How to Order in 4 Simple Steps */}
          <HowToOrder />

          {/* Real Finished Orders & Workbench Gallery */}
          <ShowcaseGallery items={content.gallery} />

          {/* Testimonials from GCC & Global Fashion Brands */}
          <TestimonialsSection items={content.testimonials} />

          {/* Frequently Asked Questions */}
          <FaqSection items={content.faqs} />
        </main>
      </div>

      {/* Footer */}
      <Footer site={content.site} footer={content.footer} />

      {/* Interactive Global Drawers & Modals */}
      <QuoteBasket />
      <QuoteModal />
      <ProductQuickViewModal />
      <FloatingActions />
    </div>
  );
}
