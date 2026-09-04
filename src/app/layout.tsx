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
const title = "Rafiq Sons Labels | Custom Woven Labels, Hang Tags & Clothing Packaging";
const description =
  "Rafiq Sons Labels manufactures premium damask woven labels, satin neck labels, embossed hang tags, heat press transfers, stickers and bespoke packaging for clothing brands worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Rafiq Sons Labels",
  },
  description,
  applicationName: "Rafiq Sons Labels",
  authors: [{ name: "Rafiq Sons Labels", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "woven labels",
    "custom woven labels",
    "clothing labels Pakistan",
    "damask woven labels",
    "custom clothing tags",
    "hang tags for clothing",
    "satin printed labels",
    "heat press labels",
    "tagless garment labels",
    "embossed hang tags",
    "clothing packaging bags",
    "custom garment accessories",
    "woven patches",
    "apparel branding",
    "clothing manufacturer trims",
    "clothing brand labels worldwide shipping",
    "Rafiq Sons Labels",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Rafiq Sons Labels",
  publisher: "Rafiq Sons Labels",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Rafiq Sons Labels",
    title,
    description,
    images: [
      {
        url: `${siteUrl}/photos/rs-092-02.jpg`,
        width: 1200,
        height: 630,
        alt: "Rafiq Sons Labels - Premium Woven Labels and Apparel Accessories",
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
  },
  robots: {
    index: true,
    follow: true,
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
};

export const viewport: Viewport = {
  themeColor: "#0c0b09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

function JsonLd() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: site.name,
    legalName: "Rafiq Sons Labels",
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-wide.png`,
    image: `${siteUrl}/photos/rs-092-02.jpg`,
    description,
    slogan: hero.line1 + " " + hero.line2,
    telephone: site.phoneDisplay,
    email: site.email,
    priceRange: "$$",
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
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneIntl,
      contactType: "sales and customer service",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Urdu", "Arabic"],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "186",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const webSiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    inLanguage: "en-US",
  };

  const productCatalogData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rafiq Sons Product Collection",
    itemListElement: products.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: p.name,
        description: p.description,
        image: `${siteUrl}${p.image}`,
        brand: {
          "@type": "Brand",
          name: site.name,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: p.from || "0.09",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/#collections`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteData) }}
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
