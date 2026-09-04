import * as base from "@/content/site";
import { getContent } from "@/lib/db";

export type Overrides = {
  hero?: Partial<typeof base.hero>;
  contact?: { phoneDisplay?: string; whatsapp?: string; email?: string; location?: string; emailGuessed?: boolean };
  products?: base.Product[];
  testimonials?: base.Testimonial[];
  faqs?: base.Faq[];
  gallery?: { src: string; tag: string; tall?: boolean }[];
};

export type SiteContent = {
  site: typeof base.site;
  hero: typeof base.hero;
  products: base.Product[];
  testimonials: base.Testimonial[];
  faqs: base.Faq[];
  gallery: { src: string; tag: string; tall?: boolean }[];
  quote: typeof base.quote;
};

export const defaultContent: SiteContent = {
  site: base.site,
  hero: base.hero,
  products: base.products,
  testimonials: base.testimonials,
  faqs: base.faqs,
  gallery: base.gallery,
  quote: base.quote,
};

export async function loadContent(): Promise<SiteContent> {
  const ov = (await getContent<Overrides>("overrides")) ?? {};
  const site = { ...base.site, ...(ov.contact ?? {}) };
  const products = ov.products?.length ? ov.products : base.products;
  return {
    site,
    hero: { ...base.hero, ...(ov.hero ?? {}) },
    products,
    testimonials: ov.testimonials?.length ? ov.testimonials : base.testimonials,
    faqs: ov.faqs?.length ? ov.faqs : base.faqs,
    gallery: ov.gallery?.length ? ov.gallery : base.gallery,
    quote: { ...base.quote, products: products.map((p) => p.name) },
  };
}
