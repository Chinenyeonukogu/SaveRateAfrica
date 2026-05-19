"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openVideo = () => setIsPopupOpen(true);
  const closeVideo = () => setIsPopupOpen(false);

  useEffect(() => {
    if (!isPopupOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeVideo();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPopupOpen]);

  return (
    <>
      <article
        className={`overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white ${className}`}
      >
        <div className="relative h-[178px] overflow-hidden bg-[#fff8e1] sm:h-[220px] md:h-[154px] lg:h-[176px]">
          <button
            aria-label={`Play ${title}`}
            className="group relative h-full w-full overflow-hidden text-left"
            type="button"
            onClick={openVideo}
          >
            <Image
              alt=""
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              fill
              loading="lazy"
              sizes="(min-width: 768px) 33vw, 100vw"
              src={thumbnailUrl}
            />
            <span className="absolute inset-0 bg-brand-navy/12 transition group-hover:bg-brand-navy/18" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#2e7d32] text-white shadow-[0_12px_28px_rgba(46,125,50,0.35)] transition group-hover:scale-105 group-hover:bg-[#1b5e20]">
              <Play className="ml-0.5 h-6 w-6 fill-current" />
            </span>
          </button>
        </div>

        <div className="flex min-h-[128px] flex-col px-4 py-3">
          <h3 className="text-[13px] font-extrabold leading-[1.35] text-[#1a3a2a]">
            {title}
          </h3>
          <p className="mt-2 text-[11px] font-medium leading-[1.6] text-[#666666]">
            {description}
          </p>
          <button
            className="mt-auto inline-flex w-fit items-center gap-1 pt-3 text-[11px] font-extrabold text-[#2e7d32]"
            type="button"
            onClick={openVideo}
          >
            {ctaLabel} →
          </button>
        </div>
      </article>

      {isPopupOpen ? (
        <div
          aria-label={`${title} video player`}
          aria-modal="false"
          className="fixed left-1/2 top-1/2 z-[1200] w-[90vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 animate-[fadeIn_180ms_ease-out] rounded-[16px] bg-[#1a1a1a] shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
          role="dialog"
        >
          <button
            aria-label="Close video"
            className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#1a1a1a] text-white shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition hover:bg-[#2e7d32]"
            type="button"
            onClick={closeVideo}
          >
            <X className="h-5 w-5" />
          </button>
          <video
            autoPlay
            className="aspect-video h-auto w-full rounded-[16px] bg-black"
            controls
            playsInline
            poster={thumbnailUrl}
            preload="none"
            src={videoUrl}
            {...{ loading: "lazy" }}
          />
        </div>
      ) : null}
    </>
  );
}
