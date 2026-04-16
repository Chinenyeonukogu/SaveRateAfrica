import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg rounded-[32px] bg-white p-8 text-center shadow-float">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
          Not found
        </p>
        <h1 className="mt-3 font-heading text-4xl text-brand-navy">
          This route is not available
        </h1>
        <p className="mt-4 text-base leading-7 text-brand-navy/70">
          The page you requested may have moved or does not exist yet.
        </p>
        <Link
          className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-brand-yellow px-5 text-sm font-bold text-brand-navy"
          href="/"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
