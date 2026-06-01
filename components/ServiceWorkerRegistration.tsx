"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      let hasReloadedForUpdate = false;

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (hasReloadedForUpdate) {
          return;
        }

        hasReloadedForUpdate = true;
        window.location.reload();
      });

      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => registration.update())
        .catch((err) => console.log("SW error:", err));
    }
  }, []);

  return null;
}
