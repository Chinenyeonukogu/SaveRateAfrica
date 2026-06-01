import Link from "next/link";

const learnCards = [
  {
    type: "alerts" as const,
    title: "Rate alerts",
    description: "Set your target NGN rate and get notified when the market moves.",
    cta: "Set alert",
    href: "/alerts",
    imageSrc: "/hero/rate-alerts.webp",
    imageAlt: "Rate alert dashboard for monitoring Nigeria exchange rates",
    imageWidth: 1200,
    imageHeight: 800,
    mediaClassName: "bg-[#e8f5e9]",
    labelClassName: "text-[#2e7d32]",
    priority: true
  },
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
    priority: false
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
    type: "credit" as const,
    title: "Build credit",
    description: "Find immigrant-friendly credit cards for building financial freedom.",
    cta: "Explore cards",
    href: "/credit-cards",
    imageSrc: "/hero/build-credit.webp",
    imageAlt: "Credit card tools for building US credit",
    imageWidth: 1200,
    imageHeight: 800,
    mediaClassName: "bg-[#e8f5e9]",
    labelClassName: "text-[#2e7d32]",
    priority: false
  },
  {
    type: "review" as const,
    title: "Review providers",
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
        <div className="mb-5 max-w-[620px]">
          <h2 className="text-[22px] font-extrabold leading-tight text-[#1a3a2a] min-[600px]:text-[28px]">
            Learn &amp; save more
          </h2>
          <p className="mt-2 text-[13px] font-semibold leading-6 text-[#5d6b5f] min-[600px]:text-[15px]">
            Tools to help you send smarter and build financial freedom.
          </p>
        </div>

        <div className="grid gap-4 min-[700px]:grid-cols-2 lg:grid-cols-5">
          {learnCards.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white"
            >
              <div className="flex min-h-[142px] flex-col px-4 py-3">
                <h3 className="text-[13px] font-extrabold leading-[1.35] text-[#1a3a2a]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[11px] font-medium leading-[1.6] text-[#666666]">
                  {card.description}
                </p>
                <Link
                  className={`mt-auto inline-flex min-h-9 items-center justify-center rounded-full border border-current px-4 text-[11px] font-extrabold ${card.labelClassName}`}
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
