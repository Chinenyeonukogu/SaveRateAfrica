import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { blogPosts } from "@/lib/site-data";

const blogDescription =
  "Smart financial guides for the Nigerian diaspora. Compare live exchange rates, track hidden fees, and find the cheapest, fastest ways to send money to Nigeria.";

const seoKeywords = [
<<<<<<< HEAD
  "Blog and guides",
  "Smart financial guides for the Nigerian diaspora",
  "Nigerian diaspora money transfer guides",
  "send money to Nigeria blog",
  "compare live exchange rates Nigeria",
  "track hidden fees money transfer",
  "cheapest fastest ways to send money to Nigeria",
  "best app to send money to Nigeria from US",
=======
  "best app to send money to Africa from US",
>>>>>>> a11c1ae (feat: generalize Nigeria copy for Africa)
  "which platform gives best naira rate",
  "how to avoid transfer fees Africa",
  "cheapest way to send money to Africa",
  "Africa exchange rate today",
  "USD to NGN rate today",
  "compare remittance Africa",
  "GBP to NGN rate",
  "CAD to NGN rate"
];

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Blog and Guides | Nigerian Diaspora Money Transfer Tips",
  description: blogDescription,
=======
  title: "Blog and Guides",
  description:
    "Compare Live Africa Exchange Rates & See Which Providers Pays the Most.",
>>>>>>> a11c1ae (feat: generalize Nigeria copy for Africa)
  keywords: seoKeywords,
  alternates: {
    canonical: "https://www.saverateafrica.com/blog"
  },
  openGraph: {
<<<<<<< HEAD
    title: "Blog and Guides | Nigerian Diaspora Money Transfer Tips",
    description: blogDescription,
    url: "https://www.saverateafrica.com/blog"
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog and Guides | Nigerian Diaspora Money Transfer Tips",
    description: blogDescription
=======
    title: "Blog and Guides",
    description:
      "Guides and comparisons for Africans abroad sending money home and building financial stability overseas.",
    url: "https://saverateafrica.com/blog"
>>>>>>> a11c1ae (feat: generalize Nigeria copy for Africa)
  }
};

export default function BlogPage() {
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SaveRateAfrica Blog and Guides",
    description: blogDescription,
    url: "https://www.saverateafrica.com/blog",
    publisher: {
      "@type": "Organization",
      name: "SaveRateAfrica",
      url: "https://www.saverateafrica.com"
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://www.saverateafrica.com${post.href ?? "/providers"}`
    }))
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SaveRateAfrica Blog and Guides",
    itemListElement: blogPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.saverateafrica.com${post.href ?? "/providers"}`,
      name: post.title
    }))
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-white px-6 py-8 shadow-float sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
              Blog and guides
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-brand-navy sm:text-5xl">
<<<<<<< HEAD
              Smart financial guides for the Nigerian diaspora.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-brand-navy/70">
              Compare live exchange rates, track hidden fees, and find the
              cheapest, fastest ways to send money to Nigeria.
=======
              Smart financial guides for Africans abroad
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-brand-navy/70">
              Financial education and money transfer insights designed to help
              Africans in the diaspora make smarter financial decisions.
>>>>>>> a11c1ae (feat: generalize Nigeria copy for Africa)
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="flex h-full flex-col rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float"
              >
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                  <span>{post.category}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                  <span>{post.readTime}</span>
                </div>
                <h2 className="mt-4 font-heading text-3xl text-brand-navy">
                  {post.title}
                </h2>
                <p className="mb-6 mt-4 text-sm leading-7 text-brand-navy/70">
                  {post.excerpt}
                </p>
                <Link
                  className={`mt-auto inline-flex min-h-12 w-fit items-center gap-2 rounded-2xl px-4 text-sm font-semibold text-brand-navy ${
                    post.href ? "bg-brand-yellow" : "bg-brand-light"
                  }`}
                  href={post.href ?? "/providers"}
                >
                  {post.href ? "Read" : "Explore providers"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
