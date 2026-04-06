"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ShieldCheck } from "lucide-react";

export function RateDisclaimer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="rounded-[24px] border border-amber-200/80 bg-amber-50 px-4 py-3 text-[11px] text-brand-navy shadow-float sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-200/70 text-brand-navy">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold uppercase tracking-[0.16em] text-[#8A5B00]">
              Rate disclaimer
            </p>
            <p className="mt-1 max-w-3xl leading-5 text-brand-navy/75">
              Rates are indicative. Updated every 5 minutes. Final rates are
              confirmed on the provider&apos;s checkout page.
            </p>
          </div>
        </div>

        <button
          aria-expanded={isExpanded}
          className="inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-amber-300 bg-white/70 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy transition hover:bg-white"
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
        >
          Learn more
          <ChevronDown
            className={`h-4 w-4 transition ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isExpanded ? (
        <div className="mt-3 space-y-3 border-t border-amber-200/80 pt-3 text-[11px] leading-5 text-brand-navy/75">
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
