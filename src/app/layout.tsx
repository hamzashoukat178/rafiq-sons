import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { site, hero } from "@/content/site";
import TitleSwitcher from "@/components/TitleSwitcher";

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

const title = "Rafiq Sons Labels | Woven Labels, Hang Tags and Packaging for Clothing Brands";
const description =
  "Premium woven labels, satin labels, hang tags, heat press labels, stickers, cards and packaging, made to your artwork and delivered worldwide from Pakistan.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Rafiq Sons Labels" },
  description,
  keywords: [
    "woven labels", "custom clothing labels", "satin labels", "hang tags",
    "heat press labels", "thank you cards", "branded packaging", "clothing accessories",
    "custom printed labels", "labels Pakistan", "labels worldwide shipping",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title,
    description,
    url: site.url,
    images: [{ url: "/photos/rs-092-02.jpg", width: 1400, height: 1400, alt: "Gold woven labels by Rafiq Sons Labels" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/photos/rs-092-02.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  themeColor: "#0c0b09",
  width: "device-width",
  initialScale: 1,
};

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description,
    slogan: hero.line1 + " " + hero.line2,
    telephone: site.phoneDisplay,
    sameAs: [site.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneIntl,
      contactType: "sales",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Urdu", "Arabic"],
    },
    makesOffer: [
      "Woven Labels", "Satin Labels", "Hang Tags", "Heat Press Labels",
      "Stickers", "Thank You Cards", "Business Cards", "Packaging",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name } })),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <JsonLd />
        <TitleSwitcher />
        {children}
      </body>
    </html>
  );
}
