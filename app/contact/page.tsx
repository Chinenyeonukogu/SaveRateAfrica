import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact Us | SaveRateAfrica",
  description:
    "Contact SaveRateAfrica for partnerships, support, and questions about comparing money transfer rates to Nigeria.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <section className="mx-auto max-w-3xl rounded-[24px] bg-white px-6 py-8 shadow-float sm:px-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
            Contact us
          </p>
          <h1 className="mt-3 font-heading text-2xl leading-tight text-brand-navy sm:text-3xl">
            We are here to help
          </h1>
          <p className="mt-4 text-base leading-7 text-brand-navy/70">
            For additional support please contact us at{" "}
            <a
              className="font-bold text-brand-green underline underline-offset-4"
              href="mailto:partnerships@saverateafrica.com"
            >
              partnerships@saverateafrica.com
            </a>
            , we respond within 24 hours.
          </p>
          <div className="mt-8">
            <Link
              className="inline-flex min-h-11 items-center rounded-full bg-brand-green px-5 text-sm font-bold text-white transition hover:bg-[#1b5e20]"
              href="/"
            >
              Back to rates
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
