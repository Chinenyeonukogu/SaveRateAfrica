import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { SiteHeader } from "@/components/SiteHeader";
import { tutorialVideos } from "@/lib/tutorial-videos";

const seoKeywords = [
  "money transfer videos Nigeria",
  "how to send money to Nigeria",
  "cheapest way to send money to Nigeria",
  "Nigeria money transfer tutorials",
  "SaveRateAfrica videos"
];

export const metadata: Metadata = {
  title: "Quick Videos | SaveRateAfrica",
  description:
    "Short video guides that help Nigerians abroad compare money transfer providers, fees, and exchange rates before sending money home.",
  keywords: seoKeywords,
  alternates: {
    canonical: "https://www.saverateafrica.com/learn"
  },
  openGraph: {
    title: "Quick Videos | SaveRateAfrica",
    description:
      "Short video guides for Nigerians abroad comparing money transfer providers and exchange rates.",
    url: "https://saverateafrica.com/learn"
  }
};

const VideoPlayer = dynamic(
  () => import("@/components/VideoPlayer").then((mod) => mod.VideoPlayer),
  {
    loading: () => (
      <div className="min-h-[320px] animate-pulse rounded-[28px] border border-brand-navy/10 bg-white shadow-float" />
    )
  }
);

export default function LearnPage() {
  return (
    <>
      <SiteHeader />

      <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-white px-6 py-8 shadow-float sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
              Quick videos
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-brand-navy sm:text-5xl">
              Smart money transfer Tips.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-brand-navy/70">
              Short, practical videos to help you compare providers, spot hidden
              fees, and send more naira home.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {tutorialVideos.map((video) => (
              <VideoPlayer
                key={video.slug}
                className="shadow-float"
                ctaLabel="Watch now"
                description={video.description}
                thumbnailUrl={video.thumbnailUrl}
                title={video.title}
                videoUrl={video.videoUrl}
              />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
