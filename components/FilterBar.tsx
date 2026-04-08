"use client";

import type { ComparisonSort, SenderCountry, SourceCurrency } from "@/lib/providers";

const sortOptions: { label: string; value: ComparisonSort }[] = [
  { label: "Best Rate", value: "best-rate" },
  { label: "Lowest Fee", value: "lowest-fee" },
  { label: "Fastest", value: "fastest" }
];

interface FilterBarProps {
  amount: number;
  senderCountry: SenderCountry;
  sourceCurrency: SourceCurrency;
  sortBy: ComparisonSort;
  onSortChange: (value: ComparisonSort) => void;
}

export function FilterBar({
  amount,
  senderCountry,
  sourceCurrency,
  sortBy,
  onSortChange
}: FilterBarProps) {
  return (
    <div className="sticky top-4 z-20 rounded-[12px] border border-[#c8e6c9] bg-white/95 p-3 shadow-float backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">
            Corridor summary
          </p>
          <p className="mt-1 text-[12px] text-brand-navy/70 min-[600px]:text-sm">
            Sending {sourceCurrency} {amount.toLocaleString("en-US")} from {senderCountry} to Nigeria
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {sortOptions.map((option) => {
            const active = option.value === sortBy;

            return (
              <button
              key={option.value}
                className={`min-h-11 rounded-[12px] px-3 text-[12px] font-semibold transition min-[600px]:min-h-12 min-[600px]:text-sm ${
                  active
                    ? "bg-brand-navy text-white"
                    : "bg-brand-light text-brand-navy hover:bg-brand-green/10"
                }`}
                type="button"
                onClick={() => onSortChange(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
