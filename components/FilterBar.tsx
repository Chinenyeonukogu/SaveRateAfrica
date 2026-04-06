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
    <div className="sticky top-4 z-20 rounded-[24px] border border-brand-navy/10 bg-white/95 p-3 shadow-float backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">
            Corridor summary
          </p>
          <p className="mt-1 text-sm text-brand-navy/70">
            Sending {sourceCurrency} {amount.toLocaleString("en-US")} from {senderCountry} to Nigeria
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {sortOptions.map((option) => {
            const active = option.value === sortBy;

            return (
              <button
                key={option.value}
                className={`min-h-12 rounded-2xl px-3 text-sm font-semibold transition ${
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
