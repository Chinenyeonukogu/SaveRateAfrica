import type { Metadata } from "next";
import { BellRing, Crown, Zap } from "lucide-react";

import { AlertsForm } from "@/components/AlertsForm";

export const metadata: Metadata = {
  title: "NGN Rate Alerts | SaveRateAfrica",
  description:
    "Create email or SMS alerts and get notified when USD, GBP, or CAD routes to Nigeria hit your target rate.",
  alternates: {
    canonical: "/alerts"
  }
};

export default function AlertsPage() {
  return (
    <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[32px] bg-brand-navy px-6 py-8 text-white shadow-float sm:px-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
            Rate alerts
          </p>
          <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl">
            We will alert you when the rate hits your target
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">
            Stop checking rates manually. Set a threshold for NGN and let
            SaveRateAfrica notify you when the market moves in your favor.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <BellRing className="h-6 w-6 text-brand-green" />
              <p className="mt-3 font-semibold">Free tier</p>
              <p className="mt-2 text-sm text-white/70">1 alert per month</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <Zap className="h-6 w-6 text-brand-yellow" />
              <p className="mt-3 font-semibold">Fast notifications</p>
              <p className="mt-2 text-sm text-white/70">
                Email or SMS-based updates for target hits
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <Crown className="h-6 w-6 text-brand-coral" />
              <p className="mt-3 font-semibold">Premium</p>
              <p className="mt-2 text-sm text-white/70">
                Unlimited alerts for $2.99/month
              </p>
            </div>
          </div>
        </section>

        <AlertsForm />
      </div>
    </main>
  );
}
