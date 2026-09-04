export type Product = {
  slug: string;
  name: string;
  tag: string;
  description: string;
  image: string;
  detail: string;
  from?: string;
  guessedPrice?: boolean;
};

export type Faq = { q: string; a: string; guessed?: boolean };
export type Testimonial = { quote: string; name: string; role: string; city: string; sample?: boolean };

export const site = {
  name: "Rafiq Sons Labels",
  shortName: "Rafiq Sons",
  legalNote: "Rafiq Sons Labels",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rafiqsonslabels.com",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/rafiqsonslabelss",
  whatsapp: "https://wtspee.com/923202025795",
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
