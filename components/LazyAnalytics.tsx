"use client";

import { useEffect, useState } from "react";

import { Analytics } from "@vercel/analytics/react";

export function LazyAnalytics() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setShouldRender(true), {
        timeout: 3000
      });

      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(() => setShouldRender(true), 2200);

    return () => clearTimeout(timeoutId);
  }, []);

  return shouldRender ? <Analytics /> : null;
}
