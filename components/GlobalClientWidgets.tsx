"use client";

import dynamic from "next/dynamic";

const LazySaveRateAI = dynamic(
  () => import("@/components/LazySaveRateAI").then((mod) => mod.LazySaveRateAI),
  { loading: () => null, ssr: false }
);

const PwaInstallPrompt = dynamic(
  () => import("@/components/PwaInstallPrompt").then((mod) => mod.PwaInstallPrompt),
  { loading: () => null, ssr: false }
);

const LazyAnalytics = dynamic(
  () => import("@/components/LazyAnalytics").then((mod) => mod.LazyAnalytics),
  { loading: () => null, ssr: false }
);

const ServiceWorkerRegistration = dynamic(
  () =>
    import("@/components/ServiceWorkerRegistration").then(
      (mod) => mod.ServiceWorkerRegistration
    ),
  { loading: () => null, ssr: false }
);

export function GlobalClientWidgets() {
  return (
    <>
      <LazySaveRateAI />
      <PwaInstallPrompt />
      <LazyAnalytics />
      <ServiceWorkerRegistration />
    </>
  );
}
