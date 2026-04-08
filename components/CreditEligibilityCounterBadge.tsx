"use client";

import { useEffect, useRef, useState } from "react";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function CreditEligibilityCounterBadge() {
  const [count, setCount] = useState(847);
  const [isFading, setIsFading] = useState(false);
  const intervalTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function clearTimers() {
      if (intervalTimeoutRef.current !== null) {
        window.clearTimeout(intervalTimeoutRef.current);
        intervalTimeoutRef.current = null;
      }

      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
    }

    function scheduleNextTick() {
      intervalTimeoutRef.current = window.setTimeout(() => {
        setIsFading(true);

        fadeTimeoutRef.current = window.setTimeout(() => {
          setCount((currentCount) => {
            const nextCount = currentCount + randomBetween(1, 6);

            if (nextCount > 1240) {
              return randomBetween(780, 820);
            }

            return nextCount;
          });
          setIsFading(false);
          scheduleNextTick();
        }, 300);
      }, randomBetween(8000, 15000));
    }

    setCount(randomBetween(820, 880));
    scheduleNextTick();

    return clearTimers;
  }, []);

  return (
    <div
      className={`absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-[12px] font-semibold text-[#1a2e1a] shadow-[0_8px_20px_rgba(8,20,10,0.18)] transition-opacity duration-300 ease-out ${
        isFading ? "opacity-40" : "opacity-100"
      }`}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#2e7d32] opacity-75" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-[#2e7d32]" />
      </span>
      <span>{count} Nigerians checked this week</span>
    </div>
  );
}
