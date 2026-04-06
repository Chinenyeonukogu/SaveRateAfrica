import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saverateafrica.com"),
  title: "Compare Ways to Save Money Sending to Nigeria | SaveRateAfrica",
  description:
    "Compare 15+ money transfer providers and find the best NGN exchange rate. Save hundreds of naira on every transfer from USA, UK and Canada to Nigeria.",
  applicationName: "SaveRateAfrica",
  keywords:
    "send money Nigeria, best NGN exchange rate, compare remittance Nigeria, Nigerian diaspora money transfer, USD to NGN best rate, GBP to NGN best rate, CAD to NGN best rate",
  openGraph: {
    title: "Compare Ways to Save Money Sending to Nigeria | SaveRateAfrica",
    description:
      "Find the best NGN exchange rate from USA, UK and Canada. Compare 15+ providers instantly.",
    siteName: "SaveRateAfrica",
    type: "website",
    url: "https://saverateafrica.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Ways to Save Money Sending to Nigeria",
    description:
      "Find the best NGN rate from USA, UK and Canada instantly."
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "512x512" }
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico"
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
      <body className="bg-brand-light text-brand-navy">
        {children}
        <SiteFooter />
        <MobileNav />
        <Analytics />
      </body>
    </html>
  );
}
