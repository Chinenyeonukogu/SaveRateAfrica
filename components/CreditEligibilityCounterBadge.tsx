"use client";

import { useEffect, useState } from "react";

const NUMBER_POOL = [
  257, 300, 341, 389, 412, 468, 500, 534, 612, 689, 731, 800, 874, 923, 1000,
  1042, 1100
] as const;

function getWeekNumber(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);

  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function CreditEligibilityCounterBadge() {
  const [count, setCount] = useState<string>(String(NUMBER_POOL[0]));

  useEffect(() => {
    const weekKey = `${new Date().getFullYear()}-${getWeekNumber(new Date())}`;
    const storedWeek = window.localStorage.getItem("sra_fomo_week");
    const storedNumber = window.localStorage.getItem("sra_fomo_number");

    let display = storedNumber;

    if (storedWeek !== weekKey || !storedNumber) {
      let next: number;

      do {
        next = NUMBER_POOL[Math.floor(Math.random() * NUMBER_POOL.length)];
      } while (String(next) === storedNumber);

      window.localStorage.setItem("sra_fomo_number", String(next));
      window.localStorage.setItem("sra_fomo_week", weekKey);
      display = String(next);
    }

    if (display) {
      setCount(display);
    }
  }, []);

  return (
    <div
      className="relative mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-[5px] text-[11px] font-semibold shadow-[0_8px_20px_rgba(8,20,10,0.18)] min-[600px]:mb-5 lg:absolute lg:right-6 lg:top-6 lg:mb-0 lg:px-4 lg:py-2 lg:text-[12px]"
      style={{
        background: "rgba(255,255,255,0.13)",
        border: "1px solid rgba(255,255,255,0.25)",
        color: "#ffffff",
        opacity: 1,
        transition: "opacity 350ms ease"
      }}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#4cdf6e] opacity-75" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-[#4cdf6e]" />
      </span>
      <span id="fomo-count" style={{ color: "#a8e6b8" }}>
        {count}
      </span>
      <span>
        Nigerians checked this week
      </span>
    </div>
  );
}
