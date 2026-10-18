import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { site, defaultSeoSettings } from "@/content/site";
import TitleSwitcher from "@/components/TitleSwitcher";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { QuoteBasketProvider } from "@/context/QuoteBasketContext";
import { loadContent } from "@/lib/content";

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

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadContent();
  const seo = content.seoSettings || defaultSeoSettings;

  const pageTitle = seo.metaTitle || defaultSeoSettings.metaTitle!;
  const pageDesc = seo.metaDescription || defaultSeoSettings.metaDescription!;
  const keywordsList = seo.targetKeywords
    ? seo.targetKeywords.split(",").map((s) => s.trim()).filter(Boolean)
    : [
        "custom woven labels",
        "damask woven labels manufacturer",
        "high density woven labels",
        "3d silicone rubber logos",
        "custom clothing labels manufacturer",
        "garment hang tags manufacturer",
        "luxury embossed hang tags",
        "custom satin care labels",
        "printed wash care labels",
        "heat transfer neck labels",
        "tagless garment labels supplier",
        "custom leather patches for jeans",
        "embossed faux leather patches",
        "custom clothing packaging bags",
        "frosted zipper garment bags",
        "metallic lurex woven labels",
        "laser cut woven labels",
        "custom woven labels USA",
        "clothing labels manufacturer UK",
        "apparel tags supplier Dubai UAE",
        "custom garment labels Saudi Arabia",
        "garment labels factory Pakistan export",
        "low MOQ custom clothing labels",
        "Rafiq Sons Labels",
      ];

  const ogImgUrl = seo.ogImage?.startsWith("http")
    ? seo.ogImage
    : `${siteUrl}${seo.ogImage || "/photos/rs-092-02.jpg"}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: pageTitle,
      template: "%s | Rafiq Sons Labels",
    },
    description: pageDesc,
    applicationName: content.site.name || "Rafiq Sons Labels",
    authors: [{ name: content.site.name || "Rafiq Sons Labels", url: siteUrl }],
    creator: content.site.name || "Rafiq Sons Labels",
    publisher: content.site.name || "Rafiq Sons Labels",
    generator: "Next.js",
    keywords: keywordsList,
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
      siteName: content.site.name || "Rafiq Sons Labels",
      title: pageTitle,
      description: pageDesc,
      images: [
        {
          url: ogImgUrl,
          width: 1200,
          height: 630,
          alt: `${content.site.name} - Custom Woven Labels & Garment Trims Manufacturer`,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [ogImgUrl],
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
      rating: "General",
      distribution: "Global",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

async function JsonLd() {
  const content = await loadContent();
  const seo = content.seoSettings || defaultSeoSettings;

  const organizationData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: content.site.name || site.name,
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
    description: seo.metaDescription || defaultSeoSettings.metaDescription,
    telephone: content.site.phoneIntl || site.phoneIntl,
    email: content.site.email || site.email,
    priceRange: "$$",
    currenciesAccepted: "USD, GBP, EUR, AED, SAR, PKR",
    paymentAccepted: "Bank Transfer, Wire, Western Union",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <link rel="canonical" href={siteUrl} />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased bg-[#f8fafc] text-slate-900 selection:bg-amber-200 selection:text-slate-900">
        <QuoteBasketProvider>
          <AnalyticsTracker />
          <JsonLd />
          <TitleSwitcher />
          {children}
        </QuoteBasketProvider>
      </body>
    </html>
  );
}
