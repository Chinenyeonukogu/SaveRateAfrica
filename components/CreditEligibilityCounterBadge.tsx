"use client";

import { useEffect, useRef, useState } from "react";

const NUMBER_POOL = [
  257, 300, 341, 389, 412, 468, 500, 534, 612, 689, 731, 800, 874, 923, 1000,
  1042, 1100
] as const;

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickNextNumber(currentCount: number) {
  const availableNumbers = NUMBER_POOL.filter((number) => number !== currentCount);
  return availableNumbers[randomBetween(0, availableNumbers.length - 1)];
}

export function CreditEligibilityCounterBadge() {
  const [count, setCount] = useState<(typeof NUMBER_POOL)[number]>(NUMBER_POOL[0]);
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
          setCount((currentCount) => pickNextNumber(currentCount));
          setIsFading(false);
          scheduleNextTick();
        }, 350);
      }, randomBetween(6000, 12000));
    }

    setCount(NUMBER_POOL[randomBetween(0, NUMBER_POOL.length - 1)]);
    scheduleNextTick();

    return clearTimers;
  }, []);

  return (
    <div
      className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold shadow-[0_8px_20px_rgba(8,20,10,0.18)]"
      style={{
        background: "rgba(255,255,255,0.13)",
        border: "1px solid rgba(255,255,255,0.25)",
        color: "#ffffff",
        opacity: isFading ? 0.2 : 1,
        transition: "opacity 350ms ease"
      }}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#4cdf6e] opacity-75" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-[#4cdf6e]" />
      </span>
      <span style={{ color: "#a8e6b8" }}>{count}</span>
      <span>
        Nigerians checked this week
      </span>
    </div>
  );
}
