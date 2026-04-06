"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, CreditCard, Home, Menu, Search } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#compare", label: "Compare", icon: Search },
  { href: "/credit-cards", label: "Cards", icon: CreditCard },
  { href: "/alerts", label: "Alerts", icon: BellRing },
  { href: "/providers", label: "Menu", icon: Menu }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[28px] border border-brand-navy/10 bg-white/95 p-2 shadow-float backdrop-blur md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition ${
                active
                  ? "bg-brand-navy text-white"
                  : "text-brand-navy/70 hover:bg-brand-light"
              }`}
              href={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
