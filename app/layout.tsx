import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import ChatBot from "@/components/ChatBot";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saverateafrica.com"),
  manifest: "/manifest.webmanifest",
  title: "Compare Ways to Save Money Sending to Nigeria | SaveRateAfrica",
  description:
    "Compare 14+ money transfer providers and find top NGN exchange rates. Save hundreds of naira on every transfer from USA, UK and Canada to Nigeria.",
  applicationName: "SaveRateAfrica",
  keywords:
    "send money Nigeria, top NGN exchange rate, compare remittance Nigeria, Nigerian diaspora money transfer, USD to NGN top rate, GBP to NGN top rate, CAD to NGN top rate",
  openGraph: {
    title: "Compare Ways to Save Money Sending to Nigeria | SaveRateAfrica",
    description:
      "Find top NGN exchange rates from USA, UK and Canada. Compare 14+ providers instantly.",
    siteName: "SaveRateAfrica",
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
  themeColor: "#00C853"
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
      </head>
      <body className="bg-brand-light text-brand-navy">
        {children}
        <SiteFooter />
        <ChatBot />
        <MobileNav />
        <Analytics />
      </body>
    </html>
  );
}
