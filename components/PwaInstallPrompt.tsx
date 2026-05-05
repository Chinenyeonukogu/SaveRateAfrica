"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISSED_STORAGE_KEY = "sra-pwa-install-dismissed-v2";

function isStandalone() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isiOSDevice =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const dismissed = window.localStorage.getItem(DISMISSED_STORAGE_KEY) === "true";
    const shouldShow = !isStandalone() && (!dismissed || isTouchDevice);

    setIsIOS(isiOSDevice);
    setIsVisible(shouldShow);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setIsVisible(shouldShow);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("pwa-install-visible", isVisible);

    return () => {
      document.body.classList.remove("pwa-install-visible");
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISSED_STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const handleInstall = async () => {
    if (installEvent) {
      await installEvent.prompt();
      await installEvent.userChoice;
      setInstallEvent(null);
      setIsVisible(false);
      return;
    }

    window.alert(
      isIOS
        ? "On iPhone or iPad: tap Share, then Add to Home Screen."
        : "Open your browser menu, then tap Install app or Add to Home screen."
    );
  };

  return (
    <div className="fixed inset-x-3 bottom-[92px] z-[10000] sm:left-auto sm:right-4 sm:w-[360px] md:bottom-6">
      <div className="rounded-2xl border border-emerald-200 bg-white p-3 text-[#123524] shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#145a32] text-white">
            <Smartphone className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-extrabold leading-tight">
                  Install SaveRateAfrica
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-[#3f5f4d]">
                  Free · Add to home screen.
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

            <button
              className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-full bg-[#145a32] px-4 text-[12px] font-extrabold text-white shadow-[0_8px_20px_rgba(20,90,50,0.22)]"
              type="button"
              onClick={handleInstall}
            >
              <Download className="h-4 w-4" />
              Install ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
