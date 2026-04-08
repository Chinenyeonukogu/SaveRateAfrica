"use client";

import { useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export function RateDisclaimer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mt-2 border-t border-[#e8f5e9] bg-transparent px-0 py-3 text-[11px] text-brand-navy shadow-none">
      <div className="flex items-start gap-2">
        <div className="shrink-0 pt-0.5 text-[#a0a0a0]">
          <AlertTriangle className="h-3 w-3" />
        </div>
        <div className="min-w-0">
          <span className="mb-[3px] block text-[10px] font-semibold uppercase tracking-[1px] text-[#a0a0a0]">
            RATE DISCLAIMER
          </span>
          <p className="max-w-3xl text-[11px] leading-[1.6] text-[#5a7a5a]">
            Rates are indicative. Updated every 5 minutes. Final rates are
            confirmed on the provider&apos;s checkout page.
            <button
              aria-expanded={isExpanded}
              className="ml-[6px] inline p-0 text-[11px] font-semibold text-[#2e7d32] underline transition hover:text-[#2e7d32]"
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
            >
              Learn more
            </button>
          </p>
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-3 space-y-3 border-t border-[#e8f5e9] pt-3 text-[11px] leading-[1.6] text-[#5a7a5a]">
          <p>
            SaveRateAfrica uses live mid-market FX data from ExchangeRate-API and
            applies modeled provider spreads and standard fees to estimate what
            your recipient may receive. Final quotes can change based on payout
            method, funding source, transfer size, promotions, compliance checks,
            and provider-side pricing updates.
          </p>

          <div className="flex items-start gap-3 rounded-[18px] bg-white/65 px-3 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            <p>
              Always confirm the final exchange rate and amount received on the
              provider checkout page before sending. SaveRateAfrica does not hold
              or move your money, and we may earn compensation from some partner
              links at no extra cost to you.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
