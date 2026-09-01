import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import { GlobalClientWidgets } from "@/components/GlobalClientWidgets";
import { SiteFooter } from "@/components/SiteFooter";

import "./globals.css";

const GA_ID = "G-QV5C8SFWTV";

const founderSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.saverateafrica.com/about#chinenye-onukogu",
      name: "Chinenye Onukogu",
      jobTitle: "Founder & CEO",
      image: "https://www.saverateafrica.com/founder-chinenye-onukogu.webp",
      url: "https://www.saverateafrica.com/about",
      sameAs: ["https://www.linkedin.com/in/chinenye-onukogu"],
      worksFor: {
        "@id": "https://www.saverateafrica.com/#organization"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://www.saverateafrica.com/#organization",
      name: "SaveRateAfrica",
      url: "https://www.saverateafrica.com",
      founder: {
        "@id": "https://www.saverateafrica.com/about#chinenye-onukogu"
      }
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL("https://saverateafrica.com"),
  manifest: "/manifest.json",
  title: "SaveRateAfrica | Best Way to Send Money to Africa",
  description:
<<<<<<< HEAD
    "Compare Live Nigeria Exchange Rates & See Which Provider Pays the Most.",
=======
    "Compare Live Africa Exchange Rates & See Which Providers Pays the Most.",
>>>>>>> a11c1ae (feat: generalize Nigeria copy for Africa)
  applicationName: "SaveRateAfrica",
  keywords: [
    "best app to send money to Africa from US",
    "which platform gives best naira rate",
    "how to avoid transfer fees Africa",
    "cheapest way to send money to Africa",
    "Africa exchange rate today",
    "USD to NGN rate today",
    "compare remittance Africa",
    "GBP to NGN rate",
    "CAD to NGN rate"
  ],
  alternates: {
    canonical: "https://www.saverateafrica.com/"
  },
  verification: {
    google: "ZkilmT1V7LJp4qCpQs4y2758O5_TPxT-iVVDieULCq4"
  },
  openGraph: {
    title: "SaveRateAfrica | Best Way to Send Money to Africa",
    description:
      "Compare USD, GBP and CAD to NGN rates today. Find the cheapest way to send money to Africa.",
    siteName: "SaveRateAfrica",
    images: [{ url: "https://saverateafrica.com/logo.svg", width: 200, height: 200 }],
    type: "website",
    url: "https://saverateafrica.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Ways to Save Money Sending to Africa",
    description:
      "Find top NGN rates from USA, UK and Canada instantly."
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/favicon-16x16.png", type: "image/png", sizes: "16x16" }
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }]
  },
  other: {
    "impact-site-verification": "9cbeb41a-8be1-40d7-835b-0afd8f2ff0a6"
  },
  category: "finance"
};

export const viewport: Viewport = {
  themeColor: "#145a32"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://lbcntbalsinojbbsvcra.supabase.co"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body{margin:0;background:#f0f7f1;color:#0a1628}
              #home{background:linear-gradient(135deg,#1a3a1a 0%,#2e7d32 50%,#0d2416 100%);contain:layout paint}
              #home h1{font-family:"Sora","Syne","Avenir Next","Segoe UI",sans-serif}
            `
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#145a32" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SaveRateAfrica" />
        <meta name="fo-verify" content="7fa9dafe-9dbb-4692-9cb7-a208826baaba" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
        />
      </head>
      <body className="bg-brand-light text-brand-navy">
        {children}
        <SiteFooter />
        <GlobalClientWidgets />
        <Script
          id="google-tag-manager"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script
          id="google-tag-manager-config"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `
          }}
        />
      </body>
    </html>
  );
}
