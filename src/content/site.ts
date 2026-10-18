export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  badge: string;
  featuredSpecs: string[];
  moq: string;
  turnaround: string;
};

export type Product = {
  slug: string;
  categorySlug?: string;
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
  finishes?: string[];
  colors?: string;
  folds?: string;
  dimensions?: string;
  recommendedFor?: string;
};

export type BrandingPackage = {
  id: string;
  name: string;
  tier: string;
  popular?: boolean;
  description: string;
  badge: string;
  turnaround: string;
  items: {
    title: string;
    qty: string;
    desc: string;
  }[];
  highlights: string[];
  ctaLabel: string;
};

export type Faq = { q: string; a: string; category?: string; guessed?: boolean };
export type Testimonial = { quote: string; name: string; role: string; city: string; rating?: number; sample?: boolean };

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
  legalNote: "Rafiq Sons Labels - Direct Manufacturer of Custom Garment Trims & Packaging",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rafiqsonslabels.com",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/rafiqsonslabelss",
  whatsapp: "https://wa.me/923202025795",
  phoneDisplay: "+92 320 2025795",
  phoneIntl: "+923202025795",
  email: "hello@rafiqsonslabels.com",
  emailGuessed: false,
  location: "Direct Factory in Pakistan • Express Doorstep Courier to GCC & Worldwide",
  followers: 16386,
  bio: "All kinds of woven labels, rubber logos, leather patches, metal badges, hang tags, stickers, cards and packaging accessories. Delivery all over the world.",
};

export const announcement = {
  text: "✦ Direct Factory Manufacturer • Express Courier Shipping to KSA, UAE, Qatar, Kuwait & Worldwide • 24h Free Digital Artwork Proofing",
  cta: "Order on WhatsApp",
  link: "https://wa.me/923202025795?text=Hello%20Rafiq%20Sons%2C%20I%20would%20like%20to%20get%20a%20quotation%20for%20my%20brand.",
};

export const hero = {
  eyebrow: "Factory Direct Garment Trims & Packaging",
  line1: "Custom Labels, Logos &",
  line2: "Packaging for Your Brand",
  sub: "Elevate your clothing line with precision-manufactured woven labels, 3D rubber logos, debossed leather patches, metal badges, luxury hang tags, waterproof stickers, and custom frosted garment bags. Factory direct wholesale pricing with low MOQ starting at 100 pcs.",
  ctaPrimary: "Explore Products",
  ctaSecondary: "Get Instant Quote",
  video: "/videos/rs-003-video.mp4",
  poster: "/photos/rs-092-02.jpg",
  trustBadges: [
    { icon: "🏭", label: "100% Direct Factory Manufacturing" },
    { icon: "📦", label: "Low MOQ Starts at 100 pcs" },
    { icon: "⚡", label: "24h Free Digital Mockup Proof" },
    { icon: "✈️", label: "Express Doorstep Delivery (GCC & Global)" },
  ],
};

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

export const marqueeItems = [
  "High-Density Woven Labels",
  "3D Silicone Rubber Logos",
  "Debossed Leather Patches",
  "Steel & Metal Badges",
  "Luxury Foil Hang Tags",
  "Waterproof Die-Cut Stickers",
  "Velvet Thank-You Cards",
  "Frosted Ziplock Garment Bags",
  "Custom Poly Mailers",
  "Branded Packing Tape",
];

// 8 Core Pillar Categories
export const categories: ProductCategory[] = [
  {
    id: "woven-labels",
    slug: "woven-labels",
    name: "Woven / Knitting Labels",
    tagline: "50D High-Density Damask & Satin Weaves",
    description: "Ultra-fine yarn weaving with crisp lettering, soft hand feel, and ultrasonic laser-sealed edges that never scratch.",
    image: "/photos/rs-092-02.jpg",
    badge: "Most Popular",
    featuredSpecs: ["50D / 75D High-Density Damask", "Ultrasonic Soft Edge Sealing", "Up to 8 Pantone Colors", "Center / End / Mitre Folds"],
    moq: "100 pcs (Bulk discounts at 500+)",
    turnaround: "5 – 7 Business Days",
  },
  {
    id: "rubber-silicone-logos",
    slug: "rubber-silicone-logos",
    name: "Rubber / Silicone Logos",
    tagline: "3D Heat Transfers & PVC Rubber Patches",
    description: "High-definition flexible 3D silicone logos and soft PVC rubber patches engineered for sportswear, hoodies, caps, and outdoor gear.",
    image: "/photos/rs-004-cover.jpg",
    badge: "High Durability",
    featuredSpecs: ["3D High-Density Silicone", "50+ Wash Cycles Tested", "Tagless Iron-On / Sew-On", "Matte & Gloss 3D Relief"],
    moq: "100 pcs",
    turnaround: "6 – 8 Business Days",
  },
  {
    id: "leather-labels",
    slug: "leather-labels",
    name: "Leather Labels & Patches",
    tagline: "Debossed Genuine & PU Faux Leather",
    description: "Premium cowhide and soft microfiber PU leather patches with deep heat debossing, laser engraving, and custom stitch channels.",
    image: "/photos/rs-095-01.jpg",
    badge: "Denim & Outerwear",
    featuredSpecs: ["Genuine Cowhide & Suede", "Washable Microfiber PU", "Deep Hot Stamped Debossing", "Perforated Stitch Grooves"],
    moq: "100 pcs",
    turnaround: "6 – 8 Business Days",
  },
  {
    id: "metal-logos",
    slug: "metal-logos",
    name: "Steel / Metal Logos & Badges",
    tagline: "Zinc Alloy, Brass & Stainless Steel Hardware",
    description: "Jewelry-grade metallic logo plaques, engraved brand tags, and luxury metal plates with polished gold, matte black, and chrome finishes.",
    image: "/photos/rs-017-cover.jpg",
    badge: "Luxury Hardware",
    featuredSpecs: ["Zinc Alloy & Brass", "Mirror Gold & Matte Black", "Dual Back Prongs / Rivet Holes", "Corrosion & Rust Proof"],
    moq: "100 pcs",
    turnaround: "7 – 10 Business Days",
  },
  {
    id: "hang-tags",
    slug: "hang-tags",
    name: "Hang Tags & Price Tags",
    tagline: "400 – 800 GSM Luxury Foil Stamped Cards",
    description: "Heavyweight duplex board tags featuring soft-touch velvet lamination, hot metallic foil stamping, spot UV gloss, and waxed cord seals.",
    image: "/photos/rs-057-00.jpg",
    badge: "Retail Ready",
    featuredSpecs: ["400 to 800 GSM Duplex Board", "Gold / Silver / Holographic Foil", "Spot Gloss UV & Embossing", "Waxed Cotton & Metal Eyelets"],
    moq: "100 pcs",
    turnaround: "5 – 7 Business Days",
  },
  {
    id: "stickers-tape",
    slug: "stickers-tape",
    name: "Custom Stickers & Tape",
    tagline: "Die-Cut Vinyl, Roll Labels & Branded Tape",
    description: "Heavy-duty waterproof die-cut vinyl stickers, holographic foil roll labels, and custom logo printed packaging tape for complete unboxing.",
    image: "/photos/rs-020-00.jpg",
    badge: "Waterproof & UV",
    featuredSpecs: ["Die-Cut Waterproof Vinyl", "Iridescent Holographic Finish", "Continuous Printed Packing Tape", "Strong Acrylic Adhesive"],
    moq: "100 pcs",
    turnaround: "4 – 6 Business Days",
  },
  {
    id: "cards",
    slug: "cards",
    name: "Thank-You Cards & Cards",
    tagline: "Velvet Soft-Touch & Gilded Metallic Edges",
    description: "Luxury customer appreciation cards and heavyweight business cards with debossed foil lettering to elevate your customer unboxing experience.",
    image: "/photos/rs-000-00.jpg",
    badge: "Unboxing Touch",
    featuredSpecs: ["450 – 600 GSM Rigid Art Card", "Gilded Metallic Foil Edges", "Matte Velvet Touch Coating", "Custom QR & Socials"],
    moq: "100 pcs",
    turnaround: "4 – 6 Business Days",
  },
  {
    id: "packaging-bags",
    slug: "packaging-bags",
    name: "Custom Bags & Packaging Boxes",
    tagline: "Frosted Ziplock Bags, Mailers & Rigid Boxes",
    description: "Custom printed frosted matte ziplock garment bags, tear-proof poly mailers, branded tissue wrapping paper, and rigid magnetic gift boxes.",
    image: "/photos/rs-032-00.jpg",
    badge: "Complete Packaging",
    featuredSpecs: ["Frosted Matte EVA Ziplock", "Waterproof Poly Mailers", "17 GSM Branded Tissue Paper", "Rigid Magnetic Apparel Boxes"],
    moq: "100 pcs",
    turnaround: "7 – 10 Business Days",
  },
];

// Rich Featured Catalog Products
export const products: Product[] = [
  // Woven Labels
  {
    slug: "damask-woven-labels",
    categorySlug: "woven-labels",
    name: "50D High-Density Damask Woven Labels",
    tag: "Factory Flagship",
    description: "Ultra-fine 50-denier warp yarns for ultra-sharp typography, crisp lines, and a smooth touch that never irritates the skin.",
    image: "/photos/rs-092-02.jpg",
    detail: "50D/75D weave, laser cut soft sealed borders, up to 8 thread colors, OEKO-TEX certified yarn.",
    material: "100% High-Density Polyester Damask Yarn",
    finishes: ["Center Fold", "End Fold", "Mitre Fold", "Laser Cut Flat"],
    turnaround: "5 – 7 working days",
    moq: "100 pcs (Recommended 500+)",
    recommendedFor: "Neck labels, hem tags, sleeve badges, streetwear, formalwear, abayas",
  },
  {
    slug: "metallic-lurex-labels",
    categorySlug: "woven-labels",
    name: "Luxury Metallic Lurex Woven Labels",
    tag: "Luxury Edition",
    description: "Woven with sparkling gold, silver, or rose-gold metallic Lurex threads on a rich black or ivory damask base.",
    image: "/photos/rs-016-00.jpg",
    detail: "Metallic thread weave, heat-resistant, high wash durability, custom width 10mm to 80mm.",
    material: "Metallic Lurex Yarn + Damask Base",
    finishes: ["Gold Metallic", "Silver Metallic", "Rose Gold", "Bronze"],
    turnaround: "6 – 8 working days",
    moq: "100 pcs",
    recommendedFor: "Haute couture, evening wear, luxury streetwear, designer trims",
  },
  {
    slug: "satin-printed-woven-labels",
    categorySlug: "woven-labels",
    name: "Satin Soft-Touch Printed & Wash Care Labels",
    tag: "Ultra Soft",
    description: "Silky soft woven satin tape with high-resolution thermal or screen print for wash care instructions and size tagging.",
    image: "/photos/rs-070-03.jpg",
    detail: "Single or double sided print, ultra-soft ultrasonic sealed edges, resistant to 50+ wash cycles.",
    material: "100% Double-Face Polyester Satin",
    finishes: ["Roll Form", "Single Cut", "Center Fold Loop"],
    turnaround: "5 – 7 working days",
    moq: "100 pcs",
    recommendedFor: "Wash care instructions, infant wear, activewear, lingerie, swimwear",
  },
  {
    slug: "cotton-eco-woven-labels",
    categorySlug: "woven-labels",
    name: "Organic Cotton & Eco-Friendly Woven Labels",
    tag: "Eco Friendly",
    description: "Natural organic cotton twill or 100% GRS recycled polyester yarn labels for sustainable apparel collections.",
    image: "/photos/rs-080-00.jpg",
    detail: "Natural unbleached cotton twill, screen printed or woven, soft raw edge or folded.",
    material: "100% Organic Cotton Twill or GRS Recycled rPET",
    finishes: ["Natural Off-White", "Bleached White", "Twill Weave", "Flat Cut"],
    turnaround: "5 – 7 working days",
    moq: "100 pcs",
    recommendedFor: "Sustainable fashion, organic cotton collections, artisanal brands",
  },

  // Rubber / Silicone
  {
    slug: "3d-silicone-heat-transfer",
    categorySlug: "rubber-silicone-logos",
    name: "3D High-Density Silicone Heat Transfer Logos",
    tag: "Tagless 3D",
    description: "Raised 3D silicone heat transfer badges that apply cleanly with an iron or heat press. Flexible, lightweight, and stretch-proof.",
    image: "/photos/rs-004-cover.jpg",
    detail: "High-density silicone, wash-tested at 60°C, zero-feel interior, multi-color registration.",
    material: "Medical-grade Silicone + Hot Melt Adhesive",
    finishes: ["Matte 3D", "Gloss 3D", "Reflective 3D", "Multi-layered"],
    turnaround: "6 – 8 working days",
    moq: "100 pcs",
    recommendedFor: "Gym wear, compression garments, hoodies, caps, techwear",
  },
  {
    slug: "pvc-rubber-patches",
    categorySlug: "rubber-silicone-logos",
    name: "Embossed PVC Rubber Logos & Patches",
    tag: "All-Weather",
    description: "Durable waterproof PVC rubber patches with deep multi-level 3D embossing, sew-on perimeter groove, or velcro backing.",
    image: "/photos/rs-095-01.jpg",
    detail: "Soft flexible PVC, custom mold injection, pantone color matching, hook-and-loop velcro option.",
    material: "Soft Flexible PVC Compound",
    finishes: ["Sew-on Groove", "Velcro Hook & Loop", "Iron-on Backing", "3D Molded Relief"],
    turnaround: "7 – 9 working days",
    moq: "100 pcs",
    recommendedFor: "Tactical gear, jackets, beanies, caps, backpacks, swimwear",
  },

  // Leather Labels
  {
    slug: "debossed-genuine-leather-patches",
    categorySlug: "leather-labels",
    name: "Deep Heat-Debossed Genuine Leather Patches",
    tag: "Heritage Craft",
    description: "Heavyweight genuine cowhide leather with crisp heat debossing and rich natural patina. Built to age gracefully on denim.",
    image: "/photos/rs-085-00.jpg",
    detail: "Vegetable-tanned cowhide, hot metal die stamping, custom burnt edge, pre-punched stitch holes.",
    material: "100% Genuine Cowhide / Buffalo Leather",
    finishes: ["Tan Brown", "Vintage Dark Brown", "Jet Black", "Natural Raw"],
    turnaround: "6 – 8 working days",
    moq: "100 pcs",
    recommendedFor: "Denim jeans, canvas jackets, luxury beanies, leather goods",
  },
  {
    slug: "laser-engraved-pu-leather-patches",
    categorySlug: "leather-labels",
    name: "Washable Faux Suede & PU Leather Patches",
    tag: "Denim & Knitwear",
    description: "100% machine-washable synthetic PU and faux suede leather patches with high-contrast laser engraved or hot-stamped branding.",
    image: "/photos/rs-021-01.jpg",
    detail: "Water-resistant PU microfibre, laser cut, custom shapes, edge stitching channel.",
    material: "Microfiber PU Leather / Faux Suede",
    finishes: ["Laser Engraved", "Gold Foil Stamped", "Pre-Punched Stitch Holes"],
    turnaround: "5 – 7 working days",
    moq: "100 pcs",
    recommendedFor: "Winter beanies, denim waistbands, fleece sweaters, caps",
  },

  // Metal Logos
  {
    slug: "polished-gold-metal-badges",
    categorySlug: "metal-logos",
    name: "Polished Gold & Silver Metal Logo Plaques",
    tag: "Jewelry Grade",
    description: "Solid zinc alloy metal badges with high-mirror gold, silver, or chrome plating. Equipped with dual back prongs or sew-on holes.",
    image: "/photos/rs-017-cover.jpg",
    detail: "Zinc alloy die casting, electroplated mirror finish, corrosion resistant, back prongs & backing plate.",
    material: "Die-Cast Zinc Alloy / Brass",
    finishes: ["24K Shiny Gold", "Polished Chrome Silver", "Matte Gunmetal", "Rose Gold"],
    turnaround: "7 – 10 working days",
    moq: "100 pcs",
    recommendedFor: "Handbags, luxury abayas, formal suit jackets, high-end headwear",
  },
  {
    slug: "matte-black-metal-tags",
    categorySlug: "metal-logos",
    name: "Matte Black & Antique Brass Metal Tags",
    tag: "Stealth Luxury",
    description: "Tactile matte black electroplated or antique brass metal brand plates with recessed laser-engraved typography.",
    image: "/photos/rs-037-02.jpg",
    detail: "CNC engraved or cast, matte anodized coating, scratch resistant, secure rivet back.",
    material: "Stainless Steel & Zinc Alloy",
    finishes: ["Matte Black", "Antique Brass", "Brushed Titanium", "Antique Silver"],
    turnaround: "7 – 10 working days",
    moq: "100 pcs",
    recommendedFor: "Luxury streetwear outerwear, techwear accessories, travel bags",
  },

  // Hang Tags
  {
    slug: "velvet-foil-hang-tags",
    categorySlug: "hang-tags",
    name: "Luxury Velvet Soft-Touch Foil Hang Tags",
    tag: "Best Seller",
    description: "Heavy 600-800 GSM duplex art card laminated in tactile soft-touch velvet with gleaming metallic hot foil stamping.",
    image: "/photos/rs-057-00.jpg",
    detail: "600-800 GSM board, gold/silver/holographic foil, matte velvet lamination, metal eyelet + waxed cord.",
    material: "600–800 GSM Heavy Duplex Art Board",
    finishes: ["Gold Foil", "Silver Foil", "Holographic Foil", "Spot UV Gloss", "Embossed"],
    turnaround: "5 – 7 working days",
    moq: "100 pcs",
    recommendedFor: "Garment retail pricing, designer clothing tags, luxury boutique apparel",
  },
  {
    slug: "custom-die-cut-hang-tags",
    categorySlug: "hang-tags",
    name: "Custom Die-Cut Shaped & Layered Hang Tags",
    tag: "Creative Shape",
    description: "Unique custom shaped tags with sandwich duplex board, layered translucent vellum overlay, and custom brass safety pin seals.",
    image: "/photos/rs-043-00.jpg",
    detail: "Precision steel die cutting, custom multi-tier card layering, tracing paper top layer, wax seal string.",
    material: "Multi-layered 700 GSM Card + Vellum Paper",
    finishes: ["Custom Die Cut Shape", "Vellum Overlay", "Debossed Logo", "Wax Seal Cord"],
    turnaround: "6 – 8 working days",
    moq: "100 pcs",
    recommendedFor: "Bespoke fashion collections, capsule drops, flagship retail tags",
  },

  // Stickers & Tape
  {
    slug: "waterproof-die-cut-stickers",
    categorySlug: "stickers-tape",
    name: "Waterproof Die-Cut Vinyl Stickers",
    tag: "Vibrant Print",
    description: "Heavy-duty waterproof vinyl stickers with UV-protective matte or gloss lamination. Scratch-resistant, weatherproof, and residue-free.",
    image: "/photos/rs-020-00.jpg",
    detail: "Thick vinyl base, precision kiss cut / die cut, UV protected, waterproof adhesive.",
    material: "100µm Waterproof Outdoor Vinyl",
    finishes: ["Matte Velvet", "High Gloss", "Holographic Rainbow", "Clear Transparent"],
    turnaround: "4 – 6 working days",
    moq: "100 pcs",
    recommendedFor: "Product unboxing inserts, laptop decals, giveaway promos, bag seals",
  },
  {
    slug: "branded-packaging-tape",
    categorySlug: "stickers-tape",
    name: "Custom Printed Heavy-Duty Packing Tape",
    tag: "Secure Dispatch",
    description: "High-adhesion BOPP or eco-friendly water-activated reinforced kraft packing tape printed with your continuous brand pattern.",
    image: "/photos/rs-073-00.jpg",
    detail: "50mm / 75mm width, 50m roll length, strong rubber adhesive, sharp 2-color flexographic print.",
    material: "Reinforced Kraft Paper or Heavy Duty BOPP",
    finishes: ["White Base Tape", "Brown Eco Kraft", "Clear Base", "Fragile Branding"],
    turnaround: "6 – 8 working days",
    moq: "20 rolls (Custom MOQ)",
    recommendedFor: "Shipping parcel sealing, brand security, unboxing presentation",
  },

  // Cards
  {
    slug: "velvet-thank-you-cards",
    categorySlug: "cards",
    name: "Soft-Touch Thank-You Cards with Gold Foil",
    tag: "Customer Love",
    description: "Heavy 450 GSM cards with velvet lamination, metallic hot foil typography, and dedicated space for custom notes and QR codes.",
    image: "/photos/rs-000-00.jpg",
    detail: "450 GSM art board, double-sided full color print, gold/rose foil, velvet soft touch lamination.",
    material: "450 GSM Heavyweight Art Card",
    finishes: ["Gold Foil Accent", "Velvet Lamination", "Custom Socials & QR", "Rounded Corners"],
    turnaround: "4 – 6 working days",
    moq: "100 pcs",
    recommendedFor: "Unboxing inserts, e-commerce order enclosures, customer loyalty cards",
  },
  {
    slug: "gilded-edge-business-cards",
    categorySlug: "cards",
    name: "Gilded Metallic Edge Luxury Business Cards",
    tag: "600 GSM Ultra-Thick",
    description: "Ultra-thick 600 GSM duplex board with gleaming mirror-gold or silver foil gilded edges. The card that commands immediate attention.",
    image: "/photos/rs-024-01.jpg",
    detail: "600 GSM heavy duplex board, mirror foil edge painting, debossed lettering, spot gloss.",
    material: "600 GSM Double-Thick Pure Cotton Card",
    finishes: ["Gilded Gold Edges", "Gilded Silver Edges", "Deep Letterpress Deboss", "Matte Black Core"],
    turnaround: "5 – 7 working days",
    moq: "100 pcs",
    recommendedFor: "Fashion founders, corporate executives, creative directors",
  },

  // Packaging & Bags
  {
    slug: "frosted-matte-ziplock-bags",
    categorySlug: "packaging-bags",
    name: "Frosted Matte Ziplock Garment Bags",
    tag: "Essential Packaging",
    description: "Premium semi-translucent frosted EVA ziplock bags printed with your brand logo. Includes a micro air ventilation hole and secure slider.",
    image: "/photos/rs-032-00.jpg",
    detail: "140µm heavy frosted EVA plastic, durable ziplock slider, single or double sided silk screen print.",
    material: "Eco Frosted EVA / CPE Waterproof Plastic",
    finishes: ["Frosted Translucent", "Solid Matte Black", "White Silk Screen", "Air Vent Hole"],
    turnaround: "7 – 10 working days",
    moq: "100 pcs",
    recommendedFor: "T-shirts, hoodies, abayas, swimwear, activewear packaging",
  },
  {
    slug: "custom-poly-mailers",
    categorySlug: "packaging-bags",
    name: "Custom Printed Waterproof Poly Mailers",
    tag: "Courier Grade",
    description: "Heavy-duty waterproof courier shipping bags printed with your brand logo, featuring a tamper-proof permanent self-adhesive strip.",
    image: "/photos/rs-051-00.jpg",
    detail: "3-layer co-extruded LDPE film, 100% opaque interior, tear-proof and waterproof, dual seal strip option.",
    material: "Heavy-Duty Co-Extruded LDPE Poly",
    finishes: ["Matte Black", "Pastel Shades", "All-Over Print", "Permanent Seal Strip"],
    turnaround: "7 – 10 working days",
    moq: "100 pcs",
    recommendedFor: "E-commerce direct-to-consumer parcel shipping",
  },
  {
    slug: "branded-tissue-wrapping-paper",
    categorySlug: "packaging-bags",
    name: "Custom Branded Translucent Tissue Paper",
    tag: "Luxury Wrapping",
    description: "Acid-free 17 GSM luxury translucent tissue paper printed with an all-over repeating pattern of your brand emblem.",
    image: "/photos/rs-027-00.jpg",
    detail: "17 GSM acid-free luxury tissue, crisp flexo print, custom sheet size 50x70cm, bleed-proof ink.",
    material: "17 GSM Acid-Free Translucent Paper",
    finishes: ["White Translucent", "Black Tissue", "Metallic Gold Print", "Repeating Pattern"],
    turnaround: "6 – 8 working days",
    moq: "500 sheets",
    recommendedFor: "Garment wrapping, gift box stuffing, luxury unboxing touch",
  },
];

// Complete 5-in-1 Branding Packages
export const brandingPackages: BrandingPackage[] = [
  {
    id: "starter-pack",
    name: "Starter Boutique Pack",
    tier: "Ideal for Emerging Brands & New Drops",
    popular: false,
    badge: "Startup Favorite",
    description: "Everything you need to launch a professional clothing collection with matching high-end trims and custom packaging.",
    turnaround: "6 – 8 Working Days",
    items: [
      { title: "50D Damask Woven Labels", qty: "500 pcs", desc: "Center or end-fold, up to 4 colors" },
      { title: "Velvet Soft-Touch Hang Tags", qty: "500 pcs", desc: "400 GSM card with gold/silver foil & string" },
      { title: "Waterproof Die-Cut Stickers", qty: "500 pcs", desc: "Matte or gloss vinyl unboxing stickers" },
      { title: "Soft-Touch Thank You Cards", qty: "500 pcs", desc: "450 GSM art card with socials & QR" },
      { title: "Frosted Matte Ziplock Bags", qty: "250 pcs", desc: "Custom printed frosted garment bags" },
    ],
    highlights: [
      "Free 24h digital artwork proofing",
      "Consistent color matching across all 5 items",
      "Door-to-door tracked courier delivery",
      "Direct factory wholesale bundle pricing",
    ],
    ctaLabel: "Get Starter Pack Quote",
  },
  {
    id: "pro-pack",
    name: "Boutique Pro Pack",
    tier: "Most Popular for Growing Fashion Brands",
    popular: true,
    badge: "Best Value",
    description: "Our best-selling combo package for established apparel boutiques, streetwear brands, and online fashion stores.",
    turnaround: "7 – 9 Working Days",
    items: [
      { title: "50D Damask Woven Labels", qty: "1,000 pcs", desc: "Laser soft edge, up to 6 thread colors" },
      { title: "Luxury 600 GSM Hang Tags", qty: "1,000 pcs", desc: "Duplex board with foil stamping + eyelet & wax cord" },
      { title: "Waterproof Die-Cut Stickers", qty: "1,000 pcs", desc: "Heavy vinyl with scratch-proof UV coating" },
      { title: "Gilded Foil Thank You Cards", qty: "1,000 pcs", desc: "Double-sided print with gold foil accents" },
      { title: "Frosted Matte Ziplock Bags", qty: "500 pcs", desc: "Heavy frosted EVA bags with custom logo" },
    ],
    highlights: [
      "Maximum cost-per-unit savings",
      "Free vector artwork cleanup & Pantone proofing",
      "Express DHL/FedEx shipping to GCC & Global",
      "Priority manufacturing queue",
    ],
    ctaLabel: "Get Pro Pack Quote",
  },
  {
    id: "enterprise-pack",
    name: "Manufacturer Enterprise Pack",
    tier: "For Full-Scale Production & Retail Supply",
    popular: false,
    badge: "Maximum Wholesale Savings",
    description: "Full production volume package designed for multi-garment manufacturers, retail chains, and international exporters.",
    turnaround: "8 – 12 Working Days",
    items: [
      { title: "50D Damask Woven Labels", qty: "3,000 pcs", desc: "Ultrasonic sealed, up to 8 colors + size tabs" },
      { title: "Heavy 800 GSM Duplex Hang Tags", qty: "3,000 pcs", desc: "Embossed + Foil stamped with metal eyelets" },
      { title: "Custom Die-Cut Stickers & Tape", qty: "3,000 pcs", desc: "3,000 stickers + 20 rolls branded packing tape" },
      { title: "Luxury Thank You / Care Cards", qty: "3,000 pcs", desc: "600 GSM heavy card with metallic finish" },
      { title: "Frosted Garment Bags & Mailers", qty: "1,500 pcs", desc: "Frosted zip bags + custom printed poly mailers" },
    ],
    highlights: [
      "Lowest factory direct wholesale rates",
      "Dedicated account manager & production tracking",
      "Split shipment & scheduled dispatch available",
      "Comprehensive piece-by-piece QC report",
    ],
    ctaLabel: "Get Enterprise Quote",
  },
];

// Why Choose Us - 5 Trust Pillars
export const trustPillars = [
  {
    icon: "🏭",
    title: "Direct Factory Manufacturing",
    desc: "No middlemen or brokers. We own our weaving looms, die-casting molds, and printing presses, ensuring direct factory wholesale pricing and strict quality control.",
  },
  {
    icon: "🧵",
    title: "Multi-Material Mastery",
    desc: "From 50D high-density damask to 3D silicone, genuine leather, zinc alloy metal, and 800 GSM duplex board—get all your trims produced under one roof.",
  },
  {
    icon: "📦",
    title: "Low MOQ & Fast Sampling",
    desc: "Test new collections with low minimum order quantities starting at just 100 pcs. Free 24h digital mockups and fast sample proofing before bulk production.",
  },
  {
    icon: "✈️",
    title: "Express Tracked Delivery (GCC & Global)",
    desc: "Rapid doorstep air shipping with DHL, FedEx, Aramex, and Skynet across Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman, UK, USA, and worldwide.",
  },
  {
    icon: "🔍",
    title: "Piece-by-Piece Quality Inspection",
    desc: "Every single label, tag, and bag is counted, inspected for color accuracy, and hand-checked before being safely boxed and dispatched.",
  },
];

// 4-Step Order Process
export const orderSteps = [
  {
    step: "01",
    title: "Select Products & Share Artwork",
    desc: "Choose your products, size, and quantity. Send your logo file (AI, PDF, PNG, JPG) or sketch via our quote form or direct WhatsApp.",
  },
  {
    step: "02",
    title: "Free 24h Digital Proof & Quotation",
    desc: "Our design team provides a 3D digital mockup with exact dimensions, Pantone yarn matches, and a transparent factory direct price quote.",
  },
  {
    step: "03",
    title: "Precision Weaving & Production",
    desc: "Upon approval, your order enters production on our high-speed looms and presses. Every detail is monitored for flawless execution.",
  },
  {
    step: "04",
    title: "Quality Inspection & Fast Delivery",
    desc: "Your order is hand-inspected, packed with care, and dispatched via tracked express courier straight to your doorstep.",
  },
];

export const defaultExportRegions: ExportRegion[] = [
  {
    id: "gcc-middle-east",
    name: "Saudi Arabia, UAE & GCC",
    flag: "🇸🇦 🇦🇪 🇶🇦 🇰🇼 🇧🇭 🇴🇲",
    hubs: "Riyadh, Jeddah, Dubai, Abu Dhabi, Doha, Kuwait City, Manama, Muscat",
    timeline: "2 – 4 Business Days (Express Air Courier)",
    popular: ["50D Damask Woven Labels", "Polished Gold Metal Plaques", "Luxury Foil Hang Tags", "Frosted Ziplock Bags"],
    note: "Serving luxury abaya designers, streetwear labels, and modest wear boutiques across GCC with rapid customs clearance and tracked delivery.",
  },
  {
    id: "uk-europe",
    name: "United Kingdom & Europe",
    flag: "🇬🇧 🇪🇺",
    hubs: "London, Manchester, Birmingham, Paris, Berlin, Milan, Amsterdam",
    timeline: "3 – 5 Business Days (DHL / FedEx Express)",
    popular: ["Soft-Edge Satin Labels", "Vegetable-Tanned Leather Patches", "400-800 GSM Velvet Hang Tags", "Recycled Eco Labels"],
    note: "OEKO-TEX compliant yarns, fine micro-weave typography, and luxury finishes tailored for high-street brands and bespoke fashion houses.",
  },
  {
    id: "north-america",
    name: "USA & Canada",
    flag: "🇺🇸 🇨🇦",
    hubs: "New York, Los Angeles, Miami, Dallas, Toronto, Vancouver",
    timeline: "4 – 6 Business Days (Door-to-Door Courier)",
    popular: ["High-Density Damask Woven Labels", "Custom Hang Tags with Foil", "3D Silicone Heat Transfers", "Frosted Garment Bags"],
    note: "Serving independent streetwear labels, denim studios, and apparel startups with low MOQ sampling and door-to-door delivery.",
  },
  {
    id: "pakistan-domestic",
    name: "Pakistan Nationwide",
    flag: "🇵🇰",
    hubs: "Karachi, Lahore, Faisalabad, Islamabad, Rawalpindi, Sialkot, Multan",
    timeline: "24 – 48 Hours (TCS / Leopard Express)",
    popular: ["All Woven Labels", "Hang Tags & Cards", "Rubber Badges", "Custom Packaging Boxes"],
    note: "Direct factory wholesale supply to leading textile mills, fashion exporters, and domestic apparel retailers.",
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
  titleLine1: "Crafted with Precision.",
  titleLine2: "Delivered to 25+ Countries.",
  sub: "From emerging designer studios in Riyadh, Dubai, and London to established fashion houses in Karachi and New York, Rafiq Sons Labels delivers bespoke garment trims with door-to-door express air couriers.",
  regions: defaultExportRegions,
  technicalSpecs: defaultTechnicalSpecs,
  ctaHeading: "Need custom samples delivered to your brand?",
  ctaSub: "We provide free 24h digital mockups and international physical sample packs upon request.",
  ctaButton: "Get Free Digital Mockup",
};

export const defaultSeoSettings: SeoSettings = {
  metaTitle: "Rafiq Sons Labels | Custom Woven Labels, Rubber Logos, Hang Tags & Packaging Manufacturer",
  metaDescription: "Direct factory manufacturer of custom high-density damask woven labels, 3D silicone rubber logos, debossed leather patches, metal badges, luxury foil hang tags, waterproof stickers, and frosted garment bags. Low MOQ starts at 100 pcs, free 24h digital mockups, and express courier shipping to Saudi Arabia, UAE, Qatar, Kuwait, UK, USA & worldwide.",
  targetKeywords: "custom woven labels, 3d silicone rubber logos, clothing labels manufacturer, hang tags supplier, custom frosted ziplock bags, leather patches denim, garment trims factory Pakistan, custom clothing labels Dubai Saudi Arabia",
  ratingValue: "4.9",
  reviewCount: "210",
  ogImage: "/photos/rs-092-02.jpg",
};

export const atelierProcess = {
  eyebrow: "From artwork to doorstep",
  title: "A simple, precise 4-step process.",
  image: "/photos/rs-037-02.jpg",
  steps: orderSteps.map((s) => ({ n: s.step, title: s.title, body: s.desc })),
};

export const reels = [
  { src: "/videos/rs-003-video.mp4", poster: "/photos/rs-003-cover.jpg", label: "The full range, in motion" },
  { src: "/videos/rs-005-video.mp4", poster: "/photos/rs-005-cover.jpg", label: "Hang tags, stickers and cards" },
  { src: "/videos/rs-017-video.mp4", poster: "/photos/rs-017-cover.jpg", label: "Steel logo plaques & badges" },
  { src: "/videos/rs-013-video.mp4", poster: "/photos/rs-013-cover.jpg", label: "Fresh off the packing table" },
];

export const gallery: { src: string; tag: string; tall?: boolean }[] = [
  { src: "/photos/rs-092-02.jpg", tag: "Woven Labels", tall: true },
  { src: "/photos/rs-004-cover.jpg", tag: "Rubber Logos" },
  { src: "/photos/rs-057-00.jpg", tag: "Hang Tags" },
  { src: "/photos/rs-017-cover.jpg", tag: "Metal Badges" },
  { src: "/photos/rs-095-01.jpg", tag: "Leather Patches", tall: true },
  { src: "/photos/rs-020-00.jpg", tag: "Stickers" },
  { src: "/photos/rs-000-00.jpg", tag: "Thank You Cards", tall: true },
  { src: "/photos/rs-032-00.jpg", tag: "Frosted Bags" },
  { src: "/photos/rs-085-00.jpg", tag: "Woven Labels" },
  { src: "/photos/rs-043-00.jpg", tag: "Hang Tags" },
  { src: "/photos/rs-070-03.jpg", tag: "Satin Labels" },
  { src: "/photos/rs-089-00.jpg", tag: "Thank You Cards" },
  { src: "/photos/rs-051-00.jpg", tag: "Poly Mailers" },
  { src: "/photos/rs-080-00.jpg", tag: "Eco Labels", tall: true },
  { src: "/photos/rs-047-00.jpg", tag: "Hang Tags" },
  { src: "/photos/rs-024-01.jpg", tag: "Business Cards" },
  { src: "/photos/rs-073-00.jpg", tag: "Branded Tape" },
  { src: "/photos/rs-037-02.jpg", tag: "Atelier Workbench", tall: true },
  { src: "/photos/rs-090-00.jpg", tag: "Hang Tags" },
  { src: "/photos/rs-027-00.jpg", tag: "Tissue Wrapping" },
];

export const stats = [
  { value: 16386, suffix: "", label: "Instagram community", display: "16K+" },
  { value: 8, suffix: "", label: "Core product pillars", display: "8" },
  { value: 100, suffix: " pcs", label: "Low MOQ starting from", display: "100 pcs" },
  { value: 25, suffix: "+", label: "Countries delivered", display: "25+" },
];

export const testimonials: Testimonial[] = [
  {
    quote: "The weave density on our neck labels and the heavy gold foil on the hang tags are exceptional. Our clients in Riyadh noticed the quality upgrade immediately.",
    name: "Fahad Al-Otaibi",
    role: "Founder, Streetwear & Abaya Brand",
    city: "Riyadh, Saudi Arabia",
    rating: 5,
  },
  {
    quote: "Rafiq Sons Labels produced our complete branding package—from 3D silicone badges to frosted ziplock bags. High quality, delivered on time in Dubai with zero hassle.",
    name: "Zaid Al-Mansoor",
    role: "Creative Director, Activewear Apparel",
    city: "Dubai, UAE",
    rating: 5,
  },
  {
    quote: "Their 24h digital sampling proof was super fast and vector clean. Received 5,000 damask labels and foil cards in London within 4 days via DHL. Top notch factory!",
    name: "Oliver Harrison",
    role: "Production Lead, Independent Clothing Co.",
    city: "London, UK",
    rating: 5,
  },
  {
    quote: "Best label and packaging supplier in Pakistan. As a textile manufacturer exporting to Europe, their OEKO-TEX compliance and piece-by-piece inspection are unbeatable.",
    name: "Tariq Mehmood",
    role: "Managing Director, Garment Exporters",
    city: "Lahore, Pakistan",
    rating: 5,
  },
];

export const faqs: Faq[] = [
  {
    q: "What is your Minimum Order Quantity (MOQ)?",
    a: "Our standard Minimum Order Quantity (MOQ) starts at just 100 pieces per design for woven labels, hang tags, leather patches, stickers, and cards. For larger quantities (500, 1,000, 5,000+ pcs), we offer substantial wholesale discounts.",
    category: "Ordering & MOQ",
  },
  {
    q: "How fast can you deliver to Saudi Arabia, UAE, and GCC countries?",
    a: "We ship directly via express door-to-door air couriers (DHL, FedEx, Aramex, and Skynet). Production usually takes 5 to 7 business days, and courier transit to KSA, UAE, Qatar, Kuwait, Bahrain, and Oman takes 2 to 4 business days.",
    category: "Shipping & Delivery",
  },
  {
    q: "Do you provide digital sampling mockups before production?",
    a: "Yes! We provide complimentary 24-hour digital vector mockups showing your exact logo, dimensions, fold types, and Pantone yarn/foil colors for your approval before taking anything into mass production.",
    category: "Artwork & Sampling",
  },
  {
    q: "What file formats do you accept for logo artwork?",
    a: "We accept vector formats (AI, EPS, PDF, SVG) as well as high-resolution PNG, JPG, or PSD files. If your logo is low-resolution, our in-house design team will clean and vectorize it free of charge.",
    category: "Artwork & Sampling",
  },
  {
    q: "Can I order a Complete Branding Package (Combo) for my clothing brand?",
    a: "Absolutely! Our 5-in-1 combo package includes Woven Neck Labels, Luxury Hang Tags, Waterproof Stickers, Thank-You Cards, and Frosted Ziplock Garment Bags. Ordering the combo gives you consistent color matching and maximum bundle savings.",
    category: "Packages & Pricing",
  },
  {
    q: "What payment terms and payment methods do you accept?",
    a: "For international orders, we accept Bank Wire Transfer (IBAN / Swift), Western Union, and online payments. Standard terms are 50% advance to initiate production and 50% upon video/photo QC approval before tracked courier dispatch.",
    category: "Payment & Billing",
  },
  {
    q: "Can you match exact Pantone color codes?",
    a: "Yes. We cross-reference your artwork with the official Pantone Matching System (PMS) to match yarn threads, silicone pigments, foil shades, and printing inks precisely.",
    category: "Quality & Specifications",
  },
];

export const quote = {
  eyebrow: "Factory Direct Quotation",
  title: "Direct from the atelier.",
  heading: "Get an instant quote for your brand.",
  sub: "Tell us what you need. Upload your logo or reference photo, and we will send a detailed price breakdown, digital mockup, and turnaround estimate within 24 hours.",
  whatsappDirect: "Or chat with us directly on WhatsApp for instant 5-minute replies:",
  products: [
    "Woven Labels",
    "Satin Labels",
    "Hang Tags",
    "3D Silicone Logos",
    "Leather Patches",
    "Metal Badges",
    "Stickers & Tape",
    "Thank You Cards",
    "Packaging & Bags",
  ],
  quantities: [
    "100 pcs (MOQ)",
    "250 pcs",
    "500 pcs",
    "1,000 pcs",
    "2,500 pcs",
    "5,000 pcs",
    "10,000+ pcs",
  ],
};

export const footer = {
  big: "Rafiq Sons Labels",
  cta: "Start your order with Rafiq Sons Labels",
  note: "Direct factory in Pakistan, shipping worldwide via express air couriers.",
  tagline: "Direct Manufacturer of Custom Woven Labels, Rubber Logos, Leather Patches, Metal Badges, Hang Tags & Luxury Apparel Packaging.",
  address: "Direct Factory in Pakistan • Express Doorstep Air Courier to GCC (Saudi Arabia, UAE, Qatar, Kuwait), UK, USA & Worldwide.",
  phone: "+92 320 2025795",
  whatsapp: "https://wa.me/923202025795",
  email: "hello@rafiqsonslabels.com",
  instagram: "https://www.instagram.com/rafiqsonslabelss",
  copyright: `© ${new Date().getFullYear()} Rafiq Sons Labels. All rights reserved.`,
};
