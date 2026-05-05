import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { MobileNav } from "@/components/MobileNav";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import SaveRateAI from "@/components/SaveRateAI.jsx";
import { SiteFooter } from "@/components/SiteFooter";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saverateafrica.com"),
  manifest: "/manifest.json",
  title: "SaveRateAfrica | Best Way to Send Money to Nigeria",
  description:
    "Compare USD, GBP and CAD to NGN rates today. Find the cheapest way to send money to Nigeria from USA, UK and Canada.",
  applicationName: "SaveRateAfrica",
  keywords: [
    "best app to send money to Nigeria from US",
    "which platform gives best naira rate",
    "how to avoid transfer fees Nigeria",
    "cheapest way to send money to Nigeria",
    "Nigeria exchange rate today",
    "USD to NGN rate today",
    "compare remittance Nigeria",
    "GBP to NGN rate",
    "CAD to NGN rate"
  ],
  alternates: {
    canonical: "/"
  },
  verification: {
    google: "ZkilmT1V7LJp4qCpQs4y2758O5_TPxT-iVVDieULCq4"
  },
  openGraph: {
    title: "SaveRateAfrica | Best Way to Send Money to Nigeria",
    description:
      "Compare USD, GBP and CAD to NGN rates today. Find the cheapest way to send money to Nigeria.",
    siteName: "SaveRateAfrica",
    images: [{ url: "https://saverateafrica.com/logo.svg", width: 200, height: 200 }],
    type: "website",
    url: "https://saverateafrica.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Ways to Save Money Sending to Nigeria",
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
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#145a32" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SaveRateAfrica" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-brand-light text-brand-navy">
        {children}
        <SiteFooter />
        <SaveRateAI />
        <PwaInstallPrompt />
        <MobileNav />
        <Analytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
