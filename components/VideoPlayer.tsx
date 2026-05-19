"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  ctaLabel?: string;
  className?: string;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  description,
  ctaLabel = "Watch video",
  className = ""
}: VideoPlayerProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const playVideo = () => setIsVideoLoaded(true);

  return (
    <article
      className={`overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white ${className}`}
    >
      <div className="relative h-[178px] overflow-hidden bg-[#fff8e1] sm:h-[220px] md:h-[154px] lg:h-[176px]">
        {isVideoLoaded ? (
          <video
            autoPlay
            className="h-full w-full object-cover"
            controls
            playsInline
            poster={thumbnailUrl}
            preload="none"
            src={videoUrl}
            {...{ loading: "lazy" }}
          />
        ) : (
          <button
            aria-label={`Play ${title}`}
            className="group relative h-full w-full overflow-hidden text-left"
            type="button"
            onClick={playVideo}
          >
            <Image
              alt=""
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              src={thumbnailUrl}
            />
            <span className="absolute inset-0 bg-brand-navy/12 transition group-hover:bg-brand-navy/18" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#2e7d32] text-white shadow-[0_12px_28px_rgba(46,125,50,0.35)] transition group-hover:scale-105 group-hover:bg-[#1b5e20]">
              <Play className="ml-0.5 h-6 w-6 fill-current" />
            </span>
          </button>
        )}
      </div>

      <div className="flex min-h-[128px] flex-col px-4 py-3">
        <h3 className="text-[13px] font-extrabold leading-[1.35] text-[#1a3a2a]">
          {title}
        </h3>
        <p className="mt-2 text-[11px] font-medium leading-[1.6] text-[#666666]">
          {description}
        </p>
        {!isVideoLoaded ? (
          <button
            className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-extrabold text-[#2e7d32]"
            type="button"
            onClick={playVideo}
          >
            {ctaLabel} →
          </button>
        ) : null}
      </div>
    </article>
  );
}
