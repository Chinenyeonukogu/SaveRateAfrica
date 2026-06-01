"use client";

import { useEffect } from "react";

const CLIENT_VERSION = "2026-06-01-modal-provider-grid-v1";

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
        .register(`/sw.js?v=${CLIENT_VERSION}`, { updateViaCache: "none" })
        .then(async (registration) => {
          await registration.update();

          const previousVersion = window.localStorage.getItem(
            "saverateafrica-client-version"
          );

          if (previousVersion === CLIENT_VERSION) {
            return;
          }

          if ("caches" in window) {
            const cacheNames = await window.caches.keys();
            await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
          }

          window.localStorage.setItem("saverateafrica-client-version", CLIENT_VERSION);

          if (previousVersion) {
            window.location.reload();
          }
        })
        .catch((err) => console.log("SW error:", err));
    }
  }, []);

  return null;
}
