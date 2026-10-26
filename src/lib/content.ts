import * as base from "@/content/site";
import { getContent } from "@/lib/db";
import { defaultCarouselItems, type ProductCarouselItem } from "@/components/ProductCarousel";

export type Overrides = {
  site?: Partial<typeof base.site>;
  contact?: {
    phoneDisplay?: string;
    whatsapp?: string;
    email?: string;
    location?: string;
    instagram?: string;
    emailGuessed?: boolean;
  };
  announcement?: Partial<typeof base.announcement>;
  hero?: Partial<typeof base.hero>;
  categories?: base.ProductCategory[];
  products?: base.Product[];
  brandingPackages?: base.BrandingPackage[];
  trustPillars?: typeof base.trustPillars;
  orderSteps?: typeof base.orderSteps;
  trustBar?: {
    marquee1?: string[];
    marquee2?: string[];
    pillars?: { title: string; desc: string }[];
  };
  manifesto?: Partial<typeof base.manifesto>;
  carousel?: ProductCarouselItem[];
  globalExport?: Partial<base.GlobalExportContent>;
  seoSettings?: Partial<base.SeoSettings>;
  atelierProcess?: Partial<typeof base.atelierProcess>;
  philosophy?: {
    eyebrow?: string;
    heading1?: string;
    heading2?: string;
    body?: string;
    image?: string;
  };
  reels?: typeof base.reels;
  stats?: typeof base.stats;
  gallery?: { src: string; tag: string; tall?: boolean }[];
  testimonials?: base.Testimonial[];
  faqs?: base.Faq[];
  quote?: Partial<typeof base.quote>;
  footer?: Partial<typeof base.footer>;
};

export type SiteContent = {
  site: typeof base.site;
  announcement: typeof base.announcement;
  hero: typeof base.hero;
  categories: base.ProductCategory[];
  products: base.Product[];
  brandingPackages: base.BrandingPackage[];
  trustPillars: typeof base.trustPillars;
  orderSteps: typeof base.orderSteps;
  trustBar?: {
    marquee1?: string[];
    marquee2?: string[];
    pillars?: { title: string; desc: string }[];
  };
  manifesto: typeof base.manifesto;
  carousel: ProductCarouselItem[];
  globalExport: base.GlobalExportContent;
  seoSettings: base.SeoSettings;
  atelierProcess: typeof base.atelierProcess;
  philosophy: {
    eyebrow: string;
    heading1: string;
    heading2: string;
    body: string;
    image: string;
  };
  reels: typeof base.reels;
  stats: typeof base.stats;
  gallery: { src: string; tag: string; tall?: boolean }[];
  testimonials: base.Testimonial[];
  faqs: base.Faq[];
  quote: typeof base.quote;
  footer: typeof base.footer;
};

export const defaultContent: SiteContent = {
  site: base.site,
  announcement: base.announcement,
  hero: base.hero,
  categories: base.categories,
  products: base.products,
  brandingPackages: base.brandingPackages,
  trustPillars: base.trustPillars,
  orderSteps: base.orderSteps,
  manifesto: base.manifesto,
  carousel: defaultCarouselItems,
  globalExport: base.defaultGlobalExport,
  seoSettings: base.defaultSeoSettings,
  atelierProcess: base.atelierProcess,
  philosophy: {
    eyebrow: "The Atelier Standard",
    heading1: "Detail is the difference between a",
    heading2: "good brand and a great one.",
    body: "The weave density under fingers, the satin softness against skin, the heavy foil card unpacked on delivery. We treat the smallest garment label like a luxury flagship store—because for your customer, it is where quality is proven.",
    image: "/photos/rs-092-02.jpg",
  },
  reels: base.reels,
  stats: base.stats,
  gallery: base.gallery,
  testimonials: base.testimonials,
  faqs: base.faqs,
  quote: base.quote,
  footer: base.footer,
};

export async function loadContent(): Promise<SiteContent> {
  const ov = (await getContent<Overrides>("overrides")) ?? {};
  const rawSite = { ...base.site, ...(ov.site ?? {}), ...(ov.contact ?? {}) };
  const whatsapp =
    rawSite.whatsapp && !rawSite.whatsapp.includes("wtspee")
      ? rawSite.whatsapp
      : "https://wa.me/923202025795";
  const site = { ...rawSite, whatsapp };
  const categories = Array.isArray(ov.categories) ? ov.categories : base.categories;
  const products = Array.isArray(ov.products) ? ov.products : base.products;
  const brandingPackages = Array.isArray(ov.brandingPackages) ? ov.brandingPackages : base.brandingPackages;
  const trustPillars = Array.isArray(ov.trustPillars) ? ov.trustPillars : base.trustPillars;
  const orderSteps = Array.isArray(ov.orderSteps) ? ov.orderSteps : base.orderSteps;

  const rawHero = ov.hero ?? {};
  const hero = {
    ...base.hero,
    ...rawHero,
    trustBadges: Array.isArray(rawHero.trustBadges) ? rawHero.trustBadges : base.hero.trustBadges,
    thumbnails: Array.isArray(rawHero.thumbnails) ? rawHero.thumbnails : base.hero.thumbnails,
  };

  return {
    site,
    announcement: { ...base.announcement, ...(ov.announcement ?? {}) },
    hero,
    categories,
    products,
    brandingPackages,
    trustPillars,
    orderSteps,
    trustBar: ov.trustBar,
    manifesto: { ...base.manifesto, ...(ov.manifesto ?? {}) },
    carousel: Array.isArray(ov.carousel) ? ov.carousel : defaultCarouselItems,
    globalExport: {
      ...base.defaultGlobalExport,
      ...(ov.globalExport ?? {}),
      regions: Array.isArray(ov.globalExport?.regions) ? ov.globalExport.regions : base.defaultExportRegions,
      technicalSpecs: Array.isArray(ov.globalExport?.technicalSpecs) ? ov.globalExport.technicalSpecs : base.defaultTechnicalSpecs,
    },
    seoSettings: {
      ...base.defaultSeoSettings,
      ...(ov.seoSettings ?? {}),
    },
    atelierProcess: { ...base.atelierProcess, ...(ov.atelierProcess ?? {}) },
    philosophy: {
      ...defaultContent.philosophy,
      ...(ov.philosophy ?? {}),
    },
    reels: Array.isArray(ov.reels) ? ov.reels : base.reels,
    stats: Array.isArray(ov.stats) ? ov.stats : base.stats,
    gallery: Array.isArray(ov.gallery) ? ov.gallery : base.gallery,
    testimonials: Array.isArray(ov.testimonials) ? ov.testimonials : base.testimonials,
    faqs: Array.isArray(ov.faqs) ? ov.faqs : base.faqs,
    quote: {
      ...base.quote,
      ...(ov.quote ?? {}),
      products: products.map((p) => p.name),
    },
    footer: { ...base.footer, ...(ov.footer ?? {}) },
  };
}
