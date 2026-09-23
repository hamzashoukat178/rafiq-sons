import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { site, hero, faqs, products } from "@/content/site";
import TitleSwitcher from "@/components/TitleSwitcher";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = "https://www.rafiqsonslabels.com";
const title = "Rafiq Sons Labels | Custom Woven Labels & Garment Trims Manufacturer (Worldwide Export)";
const description =
  "Global OEM manufacturer of premium custom damask woven labels, luxury embossed hang tags, satin wash care labels, leather denim patches, tagless heat transfers & bespoke clothing packaging. Low MOQ, 24h digital mockups, and fast express courier export to USA, UK, UAE, Europe, Canada, Australia & worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Rafiq Sons Labels",
  },
  description,
  applicationName: "Rafiq Sons Labels",
  authors: [{ name: "Rafiq Sons Labels", url: siteUrl }],
  creator: "Rafiq Sons Labels",
  publisher: "Rafiq Sons Labels",
  generator: "Next.js",
  keywords: [
    // Core Product Keywords
    "custom woven labels",
    "damask woven labels manufacturer",
    "high density woven labels",
    "custom clothing labels manufacturer",
    "garment hang tags manufacturer",
    "luxury embossed hang tags",
    "custom satin care labels",
    "printed wash care labels",
    "heat transfer neck labels",
    "tagless garment labels supplier",
    "custom leather patches for jeans",
    "embossed faux leather patches",
    "woven patches with iron on backing",
    "custom clothing packaging bags",
    "frosted zipper garment bags",
    "metallic lurex woven labels",
    "laser cut woven labels",
    "miter fold woven labels",
    "center fold neck tags",
    // Geo-targeted Worldwide B2B Export Keywords
    "custom woven labels USA",
    "clothing labels manufacturer UK",
    "apparel tags supplier Dubai UAE",
    "custom garment labels Canada",
    "woven labels manufacturer Australia",
    "clothing trims supplier Europe",
    "garment labels factory Pakistan export",
    "clothing labels manufacturer Saudi Arabia",
    "apparel branding trims worldwide shipping",
    "low MOQ custom clothing labels",
    "clothing brand manufacturer trims",
    "clothing brand packaging supplier",
    "Rafiq Sons Labels",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "en-GB": siteUrl,
      "en-CA": siteUrl,
      "en-AU": siteUrl,
      "ar-AE": siteUrl,
      "ar-SA": siteUrl,
      "ur-PK": siteUrl,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "ar_AE", "ur_PK", "de_DE", "fr_FR"],
    url: siteUrl,
    siteName: "Rafiq Sons Labels",
    title,
    description,
    images: [
      {
        url: `${siteUrl}/photos/rs-092-02.jpg`,
        width: 1200,
        height: 630,
        alt: "Rafiq Sons Labels - Premium Custom Woven Labels & Garment Trims Manufacturer",
        type: "image/jpeg",
      },
      {
        url: `${siteUrl}/photos/rs-057-00.jpg`,
        width: 1200,
        height: 630,
        alt: "Luxury Embossed Hang Tags & Apparel Branding by Rafiq Sons Labels",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/photos/rs-092-02.jpg`],
    creator: "@rafiqsonslabelss",
    site: "@rafiqsonslabelss",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  other: {
    "geo.region": "PK-PB",
    "geo.placename": "Pakistan",
    "geo.position": "31.4504;73.1350",
    ICBM: "31.4504, 73.1350",
    "revisit-after": "1 days",
    "rating": "General",
    "distribution": "Global",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

function JsonLd() {
  const targetMarkets = [
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Country", name: "Saudi Arabia" },
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "Australia" },
    { "@type": "Country", name: "Germany" },
    { "@type": "Country", name: "France" },
    { "@type": "Country", name: "Italy" },
    { "@type": "Country", name: "Spain" },
    { "@type": "Country", name: "Netherlands" },
    { "@type": "Country", name: "Turkey" },
    { "@type": "Country", name: "Pakistan" },
    { "@type": "Country", name: "Qatar" },
    { "@type": "Country", name: "Kuwait" },
    { "@type": "Country", name: "Bahrain" },
    { "@type": "Country", name: "Oman" },
  ];

  const organizationData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    alternateName: ["Rafiq Sons", "Rafiq Sons Woven Labels", "Rafiq Sons Apparel Trims"],
    legalName: "Rafiq Sons Labels & Trims Co.",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/brand/logo-wide.png`,
      width: 512,
      height: 168,
    },
    image: `${siteUrl}/photos/rs-092-02.jpg`,
    description,
    slogan: hero.line1 + " " + hero.line2,
    telephone: site.phoneDisplay,
    email: site.email,
    priceRange: "$$",
    currenciesAccepted: "USD, EUR, GBP, AED, SAR, CAD, AUD, PKR",
    paymentAccepted: "Bank Transfer, Wire Transfer, Western Union, Digital Payments",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
      addressLocality: "Pakistan",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "31.4504",
      longitude: "73.1350",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    sameAs: [site.instagram],
    areaServed: targetMarkets,
    knowsAbout: [
      "Custom Woven Labels",
      "50D Damask Weaving",
      "75D High Density Damask",
      "Metallic Lurex Thread Weaving",
      "Satin Wash Care Labels",
      "Garment Hang Tags & Foil Stamping",
      "Embossed Leather Patches for Denim",
      "Tagless Heat Press Silicone Transfers",
      "Custom Frosted Zipper Garment Bags",
      "Apparel Packaging & Unboxing Materials",
      "Worldwide Air Courier Export Logistics",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phoneIntl,
        contactType: "sales and customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Urdu", "Arabic"],
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "186",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Custom Apparel Labels & Trims Manufacturing",
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
    areaServed: targetMarkets,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Apparel Branding and Trims Manufacturing Catalog",
      itemListElement: products.map((p, idx) => ({
        "@type": "OfferCatalog",
        name: p.name,
        position: idx + 1,
      })),
    },
  };

  const webSiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.name,
    url: siteUrl,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/#collections?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbsData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: `${siteUrl}/#collections`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Showcase Carousel",
        item: `${siteUrl}/#showcase`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Worldwide Export",
        item: `${siteUrl}/#worldwide-export`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Request Quote",
        item: `${siteUrl}/#quote`,
      },
    ],
  };

  const productCatalogData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rafiq Sons Custom Apparel Trims & Labels Collection",
    itemListElement: products.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: `${p.name} - Custom Garment Trims`,
        description: p.description,
        image: `${siteUrl}${p.image}`,
        sku: `RS-${p.slug}`,
        mpn: `RS-${p.slug}`,
        category: "Clothing Accessories > Garment Labels & Tags",
        brand: {
          "@type": "Brand",
          name: site.name,
        },
        manufacturer: {
          "@type": "Organization",
          name: site.name,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: p.from || "0.09",
          priceValidUntil: "2027-12-31",
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/#collections`,
          seller: {
            "@id": `${siteUrl}/#organization`,
          },
        },
      },
    })),
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCatalogData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <link rel="canonical" href={siteUrl} />
        <meta name="theme-color" content="#0c0b09" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased bg-[#0c0b09] text-ivory selection:bg-gold selection:text-ink">
        <AnalyticsTracker />
        <JsonLd />
        <TitleSwitcher />
        {children}
      </body>
    </html>
  );
}
