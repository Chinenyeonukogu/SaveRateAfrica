import Image from "next/image";
import Link from "next/link";

function LearnIcon({ type }: { type: "blog" | "video" | "review" }) {
  if (type === "video") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M9 7.5v9l7-4.5-7-4.5Z" fill="currentColor" />
      </svg>
    );
  }

  if (type === "review") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path d="M5 4.8C5 3.8 5.8 3 6.8 3H19v16H7.8A2.8 2.8 0 0 0 5 21.8v-17Z" fill="currentColor" opacity="0.35" />
      <path d="M5 4.8A2.8 2.8 0 0 1 7.8 2H19v16H7.8A2.8 2.8 0 0 0 5 20.8v-16Zm4.5 3.7h6M9.5 12h4.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

const learnCards = [
  {
    type: "blog" as const,
    title: "Blog / Insights",
    description: "Expert tips to help you save more and make smarter money transfers home.",
    cta: "Read articles",
    href: "/blog",
    imageSrc: "/learn/money-transfer-guides.webp",
    imageAlt: "Notebook, laptop, coffee, and desk setup for money transfer guides",
    imageWidth: 2048,
    imageHeight: 1365,
    mediaClassName: "bg-[#e8f5e9]",
    labelClassName: "text-[#2e7d32]",
    priority: true
  },
  {
    type: "video" as const,
    title: "Quick Videos",
    description: "Watch simple breakdowns for comparing providers and avoiding transfer mistakes.",
    cta: "Watch now",
    href: "/learn",
    imageSrc: "/learn/quick-video.webp",
    imageAlt: "Person watching a SaveRateAfrica money transfer video on a phone",
    imageWidth: 1536,
    imageHeight: 1024,
    mediaClassName: "bg-[#fff8e1]",
    labelClassName: "text-[#d88a00]",
    priority: false
  },
  {
    type: "review" as const,
    title: "Provider reviews",
    description: "View what people are saying about each provider.",
    cta: "Review Providers",
    href: "/providers",
    imageSrc: "/learn/provider-review.webp",
    imageAlt: "Provider reviews screen showing transfer providers and ratings",
    imageWidth: 1086,
    imageHeight: 1448,
    mediaClassName: "bg-[#f4faf5]",
    labelClassName: "text-[#2e7d32]",
    priority: false
  }
] as const;

export function HomeLearnSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-6 min-[600px]:py-7 lg:py-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-[18px] font-extrabold leading-tight text-[#1a3a2a] min-[600px]:text-[22px]">
            Learn &amp; save more
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {learnCards.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white"
            >
              <div className={`relative h-[110px] overflow-hidden ${card.mediaClassName}`}>
                <Image
                  alt={card.imageAlt}
                  className="h-full w-full object-cover"
                  height={card.imageHeight}
                  loading={card.priority ? undefined : "lazy"}
                  priority={card.priority}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  src={card.imageSrc}
                  width={card.imageWidth}
                />
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#2e7d32] text-white shadow-[0_8px_18px_rgba(46,125,50,0.24)]">
                  <LearnIcon type={card.type} />
                </div>
              </div>

              <div className="flex min-h-[128px] flex-col px-4 py-3">
                <h3 className="text-[13px] font-extrabold leading-[1.35] text-[#1a3a2a]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[11px] font-medium leading-[1.6] text-[#666666]">
                  {card.description}
                </p>
                <Link
                  className={`mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-extrabold ${card.labelClassName}`}
                  href={card.href}
                >
                  {card.cta} -&gt;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
