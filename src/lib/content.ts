import * as base from "@/content/site";
import { getContent } from "@/lib/db";

export type Overrides = {
  site?: Partial<typeof base.site>;
  contact?: { phoneDisplay?: string; whatsapp?: string; email?: string; location?: string; instagram?: string; emailGuessed?: boolean };
  hero?: Partial<typeof base.hero>;
  trustBar?: {
    marquee1?: string[];
    marquee2?: string[];
    pillars?: { title: string; desc: string }[];
  };
  manifesto?: Partial<typeof base.manifesto>;
  products?: base.Product[];
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
  hero: typeof base.hero;
  trustBar?: {
    marquee1?: string[];
    marquee2?: string[];
    pillars?: { title: string; desc: string }[];
  };
  manifesto: typeof base.manifesto;
  products: base.Product[];
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
  hero: base.hero,
  manifesto: base.manifesto,
  products: base.products,
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
  const products = ov.products?.length ? ov.products : base.products;

  return {
    site,
    hero: { ...base.hero, ...(ov.hero ?? {}) },
    trustBar: ov.trustBar,
    manifesto: { ...base.manifesto, ...(ov.manifesto ?? {}) },
    products,
    atelierProcess: { ...base.atelierProcess, ...(ov.atelierProcess ?? {}) },
    philosophy: {
      ...defaultContent.philosophy,
      ...(ov.philosophy ?? {}),
    },
    reels: ov.reels?.length ? ov.reels : base.reels,
    stats: ov.stats?.length ? ov.stats : base.stats,
    gallery: ov.gallery?.length ? ov.gallery : base.gallery,
    testimonials: ov.testimonials?.length ? ov.testimonials : base.testimonials,
    faqs: ov.faqs?.length ? ov.faqs : base.faqs,
    quote: {
      ...base.quote,
      ...(ov.quote ?? {}),
      products: products.map((p) => p.name),
    },
    footer: { ...base.footer, ...(ov.footer ?? {}) },
  };
}
