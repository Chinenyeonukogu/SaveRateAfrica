"use client";

import { useEffect, useState } from "react";
import { Share2, Smartphone, X } from "lucide-react";

function isStandalone() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function PwaInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissed = window.localStorage.getItem("sra-pwa-install-dismissed") === "true";
    const isiOSDevice =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

    setIsIOS(isiOSDevice);
    setIsVisible(!dismissed && !isStandalone());

    const handleBeforeInstallPrompt = () => {
      setIsVisible(!dismissed && !isStandalone());
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    window.localStorage.setItem("sra-pwa-install-dismissed", "true");
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-[92px] z-50 sm:left-auto sm:right-4 sm:w-[360px] md:bottom-4">
      <div className="rounded-2xl border border-emerald-200 bg-white p-3 text-[#123524] shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#145a32] text-white">
            <Smartphone className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-extrabold leading-tight">
                  Download SaveRateAfrica
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-[#3f5f4d]">
                  Add it to your device home screen and open it like an app.
                </p>
              </div>
              <button
                aria-label="Close install instructions"
                className="rounded-full p-1 text-[#3f5f4d] transition hover:bg-emerald-50"
                type="button"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#e8f5e2] p-2 text-[11px] font-bold leading-snug text-[#166534]">
              <Share2 className="mt-[1px] h-4 w-4 shrink-0" />
              <span>
                {isIOS
                  ? "On iPhone or iPad: tap Share, then Add to Home Screen."
                  : "Use the browser install banner, or tap the browser menu, then Install app or Add to Home screen."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
