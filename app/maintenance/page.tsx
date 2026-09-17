import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "We're Making Improvements | SaveRateAfrica",
  description:
    "SaveRateAfrica is temporarily offline while we roll out new features and improvements. Please check back soon.",
  robots: {
    index: false,
    follow: false
  }
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-brand-light px-5 py-16">
      <div className="w-full max-w-[520px] rounded-[20px] border border-[#e2ece3] bg-white p-8 text-center shadow-float sm:p-12">
        <div className="mb-6 flex items-center justify-center gap-[10px]">
          <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#43a047,#1b5e20)] text-[18px] font-extrabold text-white">
            S
          </span>
          <span className="text-[20px] font-bold text-brand-navy">
            Save<span className="text-brand-green">Rate</span>Africa
          </span>
        </div>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5e9]">
          <svg
            aria-hidden="true"
            className="h-8 w-8 text-brand-green"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            viewBox="0 0 24 24"
          >
            <path
              d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mb-4 text-[26px] font-bold leading-tight text-brand-navy sm:text-[30px]">
          We&rsquo;re currently making improvements.
        </h1>

        <p className="text-[15px] font-medium leading-relaxed text-[#4a5a4a] sm:text-[16px]">
          Thank you for your patience. We are currently updating our website with new
          features and improvements. Please check back soon.
        </p>
      </div>
    </main>
  );
}
