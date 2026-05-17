"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, BellRing, Home } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home, variant: "default" },
  { href: "/#compare-rates", label: "Compare", icon: ArrowLeftRight, variant: "primary" },
  { href: "/alerts", label: "Alerts", icon: BellRing, variant: "default" }
];

export function MobileNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="mobile-nav fixed inset-x-3 bottom-3 z-40 rounded-[28px] border border-brand-navy/10 bg-white/95 px-3 py-2 shadow-float backdrop-blur md:hidden">
      <div className="grid grid-cols-3 items-center gap-2">
        {items.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          const isPrimary = item.variant === "primary";

          return (
            <Link
              key={item.href}
              className={
                isPrimary
                  ? "mx-auto -mt-5 flex min-h-[58px] w-[94px] flex-col items-center justify-center gap-1 rounded-full bg-[#00c853] text-[11px] font-extrabold text-white shadow-[0_12px_24px_rgba(0,200,83,0.32)] transition hover:bg-[#00a844]"
                  : `flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition ${
                      active
                        ? "bg-[#f0fbf4] text-[#00a844]"
                        : "text-brand-navy/70 hover:bg-brand-light"
                    }`
              }
              href={item.href}
            >
              <Icon className={isPrimary ? "h-5 w-5" : "h-4 w-4"} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
