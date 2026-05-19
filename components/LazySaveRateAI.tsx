"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SaveRateAI = dynamic(() => import("@/components/SaveRateAI.jsx"), {
  loading: () => null,
  ssr: false
});

export function LazySaveRateAI() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setShouldRender(true), {
        timeout: 2500
      });

      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(() => setShouldRender(true), 1800);

    return () => clearTimeout(timeoutId);
  }, []);

  return shouldRender ? <SaveRateAI /> : null;
}
