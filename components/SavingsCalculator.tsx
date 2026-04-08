import { ArrowRightLeft, PiggyBank } from "lucide-react";

import { formatNaira } from "@/lib/format";
import type { ComparisonResult } from "@/lib/fetchRates";

interface SavingsCalculatorProps {
  comparison: ComparisonResult;
}

export function SavingsCalculator({ comparison }: SavingsCalculatorProps) {
  return (
    <div className="rounded-[14px] border border-[#c8e6c9] bg-[#f4faf5] p-6 text-brand-navy shadow-float min-[600px]:p-8">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10">
        <PiggyBank className="h-6 w-6 text-brand-green" />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
        Savings calculator
      </p>
      <h3 className="mt-2 text-[28px] font-heading min-[600px]:text-3xl">
        You could save up to{" "}
        {formatNaira(comparison.savings.maxSavings, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </h3>
      <p className="mt-3 max-w-xl text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
        Based on a {comparison.sourceCurrency} {comparison.amount.toLocaleString("en-US")} transfer,
        {` ${comparison.savings.bestProvider}`} currently delivers more than{" "}
        {comparison.savings.worstProvider} after fees and spread.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="rounded-[12px] border border-[#c8e6c9] bg-white p-5">
          <p className="text-[12px] text-brand-navy/60 min-[600px]:text-sm">Best value</p>
          <p className="mt-2 text-[22px] font-heading min-[600px]:text-2xl">
            {comparison.savings.bestProvider}
          </p>
          <p className="mt-2 text-[12px] text-brand-navy/70 min-[600px]:text-sm">
            Recipient gets{" "}
            {formatNaira(comparison.savings.bestAmount, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>

        <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-brand-green md:flex">
          <ArrowRightLeft className="h-5 w-5 text-white" />
        </div>

        <div className="rounded-[12px] border border-[#c8e6c9] bg-white p-5">
          <p className="text-[12px] text-brand-navy/60 min-[600px]:text-sm">
            Less efficient route
          </p>
          <p className="mt-2 text-[22px] font-heading min-[600px]:text-2xl">
            {comparison.savings.worstProvider}
          </p>
          <p className="mt-2 text-[12px] text-brand-navy/70 min-[600px]:text-sm">
            Recipient gets{" "}
            {formatNaira(comparison.savings.worstAmount, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
