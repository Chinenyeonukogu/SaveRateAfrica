import { ArrowRightLeft, PiggyBank } from "lucide-react";

import { formatNaira } from "@/lib/format";
import type { ComparisonResult } from "@/lib/fetchRates";

interface SavingsCalculatorProps {
  comparison: ComparisonResult;
}

export function SavingsCalculator({ comparison }: SavingsCalculatorProps) {
  return (
    <div className="rounded-[28px] border border-brand-navy/10 bg-brand-navy p-6 text-white shadow-float">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
        <PiggyBank className="h-6 w-6 text-brand-yellow" />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
        Savings calculator
      </p>
      <h3 className="mt-2 font-heading text-3xl">
        You could save up to {formatNaira(comparison.savings.maxSavings)}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
        Based on a {comparison.sourceCurrency} {comparison.amount.toLocaleString("en-US")} transfer,
        {` ${comparison.savings.bestProvider}`} currently delivers more than{" "}
        {comparison.savings.worstProvider} after fees and spread.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/60">Best value</p>
          <p className="mt-2 text-2xl font-heading">{comparison.savings.bestProvider}</p>
          <p className="mt-2 text-sm text-white/75">
            Recipient gets {formatNaira(comparison.savings.bestAmount)}
          </p>
        </div>

        <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-brand-green md:flex">
          <ArrowRightLeft className="h-5 w-5 text-white" />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/60">Less efficient route</p>
          <p className="mt-2 text-2xl font-heading">{comparison.savings.worstProvider}</p>
          <p className="mt-2 text-sm text-white/75">
            Recipient gets {formatNaira(comparison.savings.worstAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}
