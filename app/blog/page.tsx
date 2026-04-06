import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { blogPosts } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Blog and Guides",
  description:
    "Guides and comparisons for Nigerians abroad sending money home and building financial stability overseas.",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogPage() {
  return (
    <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] bg-white px-6 py-8 shadow-float sm:px-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
            Blog and guides
          </p>
          <h1 className="mt-3 font-heading text-4xl leading-tight text-brand-navy sm:text-5xl">
            Practical money transfer and diaspora finance guides
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-brand-navy/70">
            Education content designed to rank for high-intent search and help
            users move from research to confident action.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float"
            >
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                <span>{post.category}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-4 font-heading text-3xl text-brand-navy">
                {post.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-brand-navy/70">
                {post.excerpt}
              </p>
              <Link
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-light px-4 text-sm font-semibold text-brand-navy"
                href="/providers"
              >
                Explore providers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
