export type Product = {
  slug: string;
  name: string;
  tag: string;
  description: string;
  image: string;
  detail: string;
  from?: string;
  guessedPrice?: boolean;
  turnaround?: string;
  moq?: string;
  material?: string;
  colors?: string;
  folds?: string;
};

export type Faq = { q: string; a: string; guessed?: boolean };
export type Testimonial = { quote: string; name: string; role: string; city: string; sample?: boolean };

export type ExportRegion = {
  id: string;
  name: string;
  flag: string;
  hubs: string;
  timeline: string;
  popular: string[];
  note: string;
};

export type TechnicalSpecCategory = {
  category: string;
  items: { name: string; desc: string }[];
};

export type GlobalExportContent = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  sub: string;
  regions: ExportRegion[];
  technicalSpecs: TechnicalSpecCategory[];
  ctaHeading: string;
  ctaSub: string;
  ctaButton: string;
};

export type SeoSettings = {
  metaTitle?: string;
  metaDescription?: string;
  targetKeywords?: string;
  ratingValue?: string;
  reviewCount?: string;
  ogImage?: string;
};

export const site = {
  name: "Rafiq Sons Labels",
  shortName: "Rafiq Sons",
  legalNote: "Rafiq Sons Labels",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rafiqsonslabels.com",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/rafiqsonslabelss",
  whatsapp: "https://wa.me/923202025795",
  phoneDisplay: "+92 320 2025795",
  phoneIntl: "+923202025795",
  email: "hello@rafiqsonslabels.com",
  emailGuessed: true,
  location: "Pakistan, delivering worldwide",
  followers: 16386,
  bio: "All kinds of woven labels and printing accessories. Delivery all over the world.",
};

export const hero = {
  eyebrow: "Woven labels, tags and packaging. Made in Pakistan, worn worldwide.",
  line1: "The smallest detail",
  line2: "carries the whole brand.",
  sub: "Rafiq Sons Labels weaves, prints and finishes the labels, hang tags and packaging that clothing brands are remembered by. Made to order, delivered worldwide.",
  ctaPrimary: "Request a quote",
  ctaSecondary: "Explore the collections",
  video: "/videos/rs-003-video.mp4",
  poster: "/photos/rs-092-02.jpg",
};

export const marqueeItems = [
  "Woven Labels", "Satin Labels", "Hang Tags", "Heat Press", "Woven Patches",
  "Thank You Cards", "Stickers", "Zip Bags", "Business Cards", "Tissue and Tape",
];

export const manifesto = {
  eyebrow: "Why the label matters",
  big: [
    "A label is the last thing your customer touches",
    "and the first thing they remember.",
  ],
  body: "Fabric, foil, thread and card. We treat two centimetres of satin like a flagship store, because for your customer, it is. Every order is woven or printed to your artwork, checked piece by piece, and shipped anywhere in the world.",
  image: "/photos/rs-096-01.jpg",
  points: ["Made to your artwork", "Checked piece by piece", "Shipped worldwide"],
};

export const products: Product[] = [
  {
    slug: "woven-labels",
    name: "Woven Labels",
    tag: "Signature",
    description: "High density damask weave with crisp lettering and a soft hand feel. The label premium brands are judged by.",
    image: "/photos/rs-092-02.jpg",
    detail: "Damask, taffeta and satin bases. Up to 8 thread colors, laser cut or folded.",
    from: "0.09",
    guessedPrice: true,
  },
  {
    slug: "satin-labels",
    name: "Satin Labels",
    tag: "Soft touch",
    description: "Smooth satin with rich, edge to edge print. Gentle on skin, sharp on color, made for neck and hem.",
    image: "/photos/rs-070-03.jpg",
    detail: "Single or double sided print, cut sealed edges, custom folds.",
    from: "0.07",
    guessedPrice: true,
  },
  {
    slug: "hang-tags",
    name: "Hang Tags",
    tag: "First impression",
    description: "Heavy board, foil stamping, debossing and stringing. A tag that feels like an invitation.",
    image: "/photos/rs-057-00.jpg",
    detail: "400 to 800 gsm boards, metallic foils, cotton or waxed string, eyelets.",
    from: "0.12",
    guessedPrice: true,
  },
  {
    slug: "heat-press",
    name: "Heat Press Labels",
    tag: "Tagless",
    description: "High definition heat transfer labels for a tagless finish. Stretch with the garment, never scratch.",
    image: "/photos/rs-004-cover.jpg",
    detail: "HD and 3D silicone effects, iron on application, wash tested.",
    from: "0.08",
    guessedPrice: true,
  },
  {
    slug: "stickers",
    name: "Stickers and Patches",
    tag: "Finishing",
    description: "Vinyl stickers, woven and embroidered patches that carry your mark beyond the garment.",
    image: "/photos/rs-095-01.jpg",
    detail: "Kiss cut vinyl, embroidered merrowed edges, iron on backing.",
    from: "0.06",
    guessedPrice: true,
  },
  {
    slug: "thank-you-cards",
    name: "Thank You Cards",
    tag: "Gratitude",
    description: "Soft touch cards with gold or holographic foil. Pack every order like a gift.",
    image: "/photos/rs-089-00.jpg",
    detail: "Foil, letterpress and digital print on textured art card.",
    from: "0.05",
    guessedPrice: true,
  },
  {
    slug: "business-cards",
    name: "Business Cards",
    tag: "Identity",
    description: "Heavyweight cards with painted edges and metallic foil. Hand one over and be remembered.",
    image: "/photos/rs-024-01.jpg",
    detail: "600 gsm duplex boards, foil edges, spot gloss on matte lamination.",
    from: "0.10",
    guessedPrice: true,
  },
  {
    slug: "packaging",
    name: "Packaging and Bags",
    tag: "Unboxing",
    description: "Printed zip bags, mailers, tissue and tape. The full unboxing, branded end to end.",
    image: "/photos/rs-032-00.jpg",
    detail: "Frosted zip bags, polymailers, branded tissue and packing tape.",
    from: "0.14",
    guessedPrice: true,
  },
];

export const defaultExportRegions: ExportRegion[] = [
  {
    id: "north-america",
    name: "North America",
    flag: "🇺🇸 🇨🇦",
    hubs: "USA (New York, Los Angeles, Texas, Miami) & Canada (Toronto, Vancouver)",
    timeline: "4 – 6 Business Days (DHL / FedEx Express)",
    popular: ["High-Density Damask Woven Labels", "Custom Hang Tags with Foil", "Tagless Silicone Heat Transfers", "Frosted Zip Garment Bags"],
    note: "Serving independent streetwear labels, denim studios, and luxury apparel startups with low MOQ sampling and door-to-door customs clearance.",
  },
  {
    id: "uk-europe",
    name: "United Kingdom & Europe",
    flag: "🇬🇧 🇪🇺",
    hubs: "UK (London, Manchester), Germany, France, Italy, Spain & Netherlands",
    timeline: "3 – 5 Business Days (Air Express Courier)",
    popular: ["Ultrasonic Soft-Edge Satin Labels", "Vegetable-Tanned Leather Patches", "400-800 GSM Velvet Hang Tags", "Recycled rPET Eco Woven Labels"],
    note: "OEKO-TEX compliant yarns, fine micro-weave typography, and luxury finishes tailored for high-street brands and bespoke fashion houses.",
  },
  {
    id: "middle-east",
    name: "Middle East & GCC",
    flag: "🇦🇪 🇸🇦",
    hubs: "UAE (Dubai, Abu Dhabi), Saudi Arabia (Riyadh, Jeddah), Qatar & Kuwait",
    timeline: "2 – 4 Business Days (Direct GCC Express)",
    popular: ["Metallic Gold & Silver Lurex Labels", "Engraved Metal Plaques & Badges", "Luxury Abaya & Modest Wear Tags", "Embossed Duplex Thank You Cards"],
    note: "High-temperature resistant metallic threads, rich gold foiling, and premium garment packaging trusted across GCC fashion boutiques.",
  },
  {
    id: "australia-asia",
    name: "Australia & Asia-Pacific",
    flag: "🇦🇺 🇯🇵",
    hubs: "Australia (Sydney, Melbourne), Japan, Singapore & Domestic Hubs",
    timeline: "4 – 6 Business Days (Tracked International)",
    popular: ["Woven Damask Neck Labels", "Waterproof Die-Cut Stickers", "Embroidered Merrowed Border Patches", "Custom Poly Mailers"],
    note: "Fast sample proofing, piece-by-piece inspection, and streamlined reordering for sportswear, outdoor wear, and lifestyle brands.",
  },
];

export const defaultTechnicalSpecs: TechnicalSpecCategory[] = [
  {
    category: "Weave Densities & Finishes",
    items: [
      { name: "50D High-Density Damask", desc: "Ultra-fine yarn count for intricate artwork, micro-text, and needle-sharp clarity." },
      { name: "75D Standard Damask", desc: "Durable, high-tensile weave ideal for denim, outerwear, and everyday apparel." },
      { name: "Metallic Lurex Threads", desc: "Sparkling Gold, Silver, Rose Gold, and Copper metallic threads for luxury brands." },
      { name: "Laser & Ultrasonic Cut", desc: "Precision sealed edges that prevent fraying and remain 100% skin-soft." },
    ],
  },
  {
    category: "Fold Types & Applications",
    items: [
      { name: "Center Fold / Loop Fold", desc: "Classic neck seam tag with brand logo on front and care/size specs on reverse." },
      { name: "End Fold", desc: "Folded on left and right edges for a clean, stitch-ready flat luxury look." },
      { name: "Miter Fold", desc: "Angled 45° corner folds allowing garments to be hung with the label as a hook loop." },
      { name: "Manhattan Fold", desc: "Top & bottom double folded for sleeve trims, pockets, and hemline branding." },
    ],
  },
  {
    category: "Eco & Quality Standards",
    items: [
      { name: "Piece-by-Piece Hand QC", desc: "Every single unit counted, inspected for color fidelity, and verified before packing." },
      { name: "GRS Recycled Polyester", desc: "Sustainable yarns made from 100% post-consumer recycled plastic bottles." },
      { name: "Wash & Friction Tested", desc: "Resistant to 50+ commercial laundry wash cycles without fading or shrinkage." },
      { name: "Free Artwork Optimization", desc: "Complimentary vector conversion, Pantone matching, and 24h digital mockups." },
    ],
  },
];

export const defaultGlobalExport: GlobalExportContent = {
  eyebrow: "Worldwide Supply & Manufacturing",
  titleLine1: "Crafted in Pakistan.",
  titleLine2: "Worn in 20+ countries.",
  sub: "From emerging designer studios in London and New York to established fashion houses in Dubai and Riyadh, Rafiq Sons Labels delivers bespoke garment trims with door-to-door express air couriers.",
  regions: defaultExportRegions,
  technicalSpecs: defaultTechnicalSpecs,
  ctaHeading: "Need custom samples delivered to your brand?",
  ctaSub: "We provide free 24h digital mockups and worldwide physical sample packs upon request.",
  ctaButton: "Get Free Digital Mockup",
};

export const defaultSeoSettings: SeoSettings = {
  metaTitle: "Rafiq Sons Labels | Custom Woven Labels & Garment Trims Manufacturer (Worldwide Export)",
  metaDescription: "Global OEM manufacturer of premium custom damask woven labels, luxury embossed hang tags, satin wash care labels, leather denim patches, tagless heat transfers & bespoke clothing packaging. Low MOQ, 24h digital mockups, and fast express courier export to USA, UK, UAE, Europe, Canada, Australia & worldwide.",
  targetKeywords: "custom woven labels, damask woven labels manufacturer, clothing labels manufacturer UK, custom woven labels USA, apparel tags supplier Dubai UAE, garment labels factory Pakistan export, low MOQ custom clothing labels",
  ratingValue: "4.9",
  reviewCount: "186",
  ogImage: "/photos/rs-092-02.jpg",
};

export const atelierProcess = {
  eyebrow: "From artwork to doorstep",
  title: "A quiet, precise process.",
  image: "/ai/atelier.jpg",
  steps: [
    {
      n: "01",
      title: "Artwork and advice",
      body: "Send your logo in any format. We clean it up free of charge and advise on weave, size and folds for your fabric.",
    },
    {
      n: "02",
      title: "Digital sampling",
      body: "You receive a production mockup within 24 hours. We revise until the spacing, thread and color feel right.",
    },
    {
      n: "03",
      title: "Weaving and print",
      body: "Your order goes on the looms and presses. Thread by thread, foil by foil, everything made fresh for you.",
    },
    {
      n: "04",
      title: "Finishing and quality check",
      body: "Cutting, folding, counting and inspection. Every batch is checked piece by piece before it is packed.",
    },
    {
      n: "05",
      title: "Worldwide dispatch",
      body: "Tracked courier delivery to your door, anywhere in the world. You get updates until the box is in your hands.",
    },
  ],
};

export const reels = [
  { src: "/videos/rs-003-video.mp4", poster: "/photos/rs-003-cover.jpg", label: "The full range, in motion" },
  { src: "/videos/rs-005-video.mp4", poster: "/photos/rs-005-cover.jpg", label: "Hang tags, stickers and cards" },
  { src: "/videos/rs-017-video.mp4", poster: "/photos/rs-017-cover.jpg", label: "Steel logo plaques" },
  { src: "/videos/rs-013-video.mp4", poster: "/photos/rs-013-cover.jpg", label: "Fresh off the packing table" },
];

export const gallery: { src: string; tag: string; tall?: boolean }[] = [
  { src: "/photos/rs-092-02.jpg", tag: "Woven labels", tall: true },
  { src: "/photos/rs-070-03.jpg", tag: "Satin labels" },
  { src: "/photos/rs-057-00.jpg", tag: "Hang tags" },
  { src: "/photos/rs-020-00.jpg", tag: "Stickers" },
  { src: "/photos/rs-000-00.jpg", tag: "Thank you cards", tall: true },
  { src: "/photos/rs-085-00.jpg", tag: "Woven labels" },
  { src: "/photos/rs-043-00.jpg", tag: "Hang tags" },
  { src: "/photos/rs-096-01.jpg", tag: "Satin labels" },
  { src: "/photos/rs-049-02.jpg", tag: "Thank you cards" },
  { src: "/photos/rs-095-01.jpg", tag: "Patches", tall: true },
  { src: "/photos/rs-016-00.jpg", tag: "Woven labels" },
  { src: "/photos/rs-089-00.jpg", tag: "Thank you cards" },
  { src: "/photos/rs-051-00.jpg", tag: "Packaging" },
  { src: "/photos/rs-080-00.jpg", tag: "Satin labels", tall: true },
  { src: "/photos/rs-047-00.jpg", tag: "Hang tags" },
  { src: "/photos/rs-061-00.jpg", tag: "Satin labels" },
  { src: "/photos/rs-024-01.jpg", tag: "Business cards" },
  { src: "/photos/rs-004-cover.jpg", tag: "Heat press" },
  { src: "/photos/rs-036-00.jpg", tag: "Thank you cards" },
  { src: "/photos/rs-055-00.jpg", tag: "Woven labels" },
  { src: "/photos/rs-073-00.jpg", tag: "Packaging" },
  { src: "/photos/rs-037-02.jpg", tag: "Atelier", tall: true },
  { src: "/photos/rs-090-00.jpg", tag: "Hang tags" },
  { src: "/photos/rs-027-00.jpg", tag: "Thank you cards" },
];

export const stats = [
  { value: 16386, suffix: "", label: "Instagram community", display: "16K+" },
  { value: 8, suffix: "", label: "Dedicated crafts", display: "8" },
  { value: 24, suffix: "h", label: "Quote turnaround", display: "24h", guessed: true },
  { value: 20, suffix: "+", label: "Countries served", display: "20+", guessed: true },
];

export const testimonials: Testimonial[] = [
  {
    quote: "The weave density on our neck labels is better than suppliers quoting three times the price. Our customers notice.",
    name: "Sample review",
    role: "Founder, streetwear label",
    city: "Dubai",
    sample: true,
  },
  {
    quote: "Mockups in two days, delivery in a week, and the foil on the hang tags is flawless. Reordering is one WhatsApp message.",
    name: "Sample review",
    role: "Creative director, womenswear brand",
    city: "London",
    sample: true,
  },
  {
    quote: "They fixed our artwork for free and told us honestly which finish would last. That kind of advice is rare.",
    name: "Sample review",
    role: "Owner, denim studio",
    city: "Istanbul",
    sample: true,
  },
  {
    quote: "Fifty thousand labels a quarter, every batch consistent. The piece by piece checking shows.",
    name: "Sample review",
    role: "Production manager, uniforms company",
    city: "Riyadh",
    sample: true,
  },
];

export const faqs: Faq[] = [
  {
    q: "What is the minimum order quantity?",
    a: "Most labels and tags start from 100 pieces, which keeps the price per piece friendly for new brands. Larger runs bring the unit price down quickly. Tell us your quantity and we will send exact figures.",
    guessed: true,
  },
  {
    q: "How long does an order take?",
    a: "Digital mockups arrive within 24 hours of your artwork. Production typically takes 7 to 10 working days after you approve the design, then tracked courier delivery depends on your country.",
    guessed: true,
  },
  {
    q: "Do you ship to my country?",
    a: "Yes. We deliver worldwide with tracked couriers and share updates until the parcel reaches you. Shipping cost is confirmed with your quote, before you pay anything.",
  },
  {
    q: "I only have a rough logo. Can you help?",
    a: "Send whatever you have, even a phone photo. We redraw and clean up artwork free of charge, then show you exactly how it will look woven or printed before anything is produced.",
  },
  {
    q: "Can I get a sample first?",
    a: "Every order includes a free digital mockup. Physical samples of your exact design can be arranged for a small fee that is deducted from your final order.",
    guessed: true,
  },
  {
    q: "How do I pay?",
    a: "We confirm your design, quantity and price in writing first. Payment details are shared securely on WhatsApp, with options suitable for both local and international clients.",
    guessed: true,
  },
];

export const quote = {
  eyebrow: "Request a quote",
  title: "Tell us what you are making.",
  sub: "Share your product, quantity and artwork. A real person replies, usually within 24 hours, with a clear price and honest advice.",
  products: products.map((p) => p.name),
  quantities: ["100 to 500 pieces", "500 to 1,000 pieces", "1,000 to 5,000 pieces", "5,000 to 20,000 pieces", "20,000+ pieces"],
};

export const footer = {
  big: "Let us make your desired item.",
  note: "Artwork, honest advice and a clear price within 24 hours. No obligation.",
};
