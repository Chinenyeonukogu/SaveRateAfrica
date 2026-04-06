import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { MobileNav } from "@/components/MobileNav";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.saverateafrica.com"),
  title: {
    default: "SaveRateAfrica | Real-Time Rates to Nigeria",
    template: "%s | SaveRateAfrica"
  },
  description:
    "Compare real-time remittance rates to Nigeria from USA, UK, and Canada. Save more on fees, spot the best NGN payout, and send smarter.",
  applicationName: "SaveRateAfrica",
  keywords: [
    "send money to Nigeria from USA",
    "best exchange rate Nigeria 2025",
    "Wise vs Remitly Nigeria",
    "Nigeria remittance comparison",
    "NGN rate alerts"
  ],
  openGraph: {
    title: "SaveRateAfrica | Real-Time Rates to Nigeria",
    description:
      "Compare real-time remittance rates to Nigeria from USA, UK, and Canada.",
    siteName: "SaveRateAfrica",
    type: "website",
    url: "https://www.saverateafrica.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "SaveRateAfrica | Real-Time Rates to Nigeria",
    description:
      "Compare live remittance rates to Nigeria and maximize the amount your recipient gets."
  },
  category: "finance"
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
        <MobileNav />
        <SpeedInsights />
      </body>
    </html>
  );
}
