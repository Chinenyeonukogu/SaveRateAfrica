"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

interface SiteHeaderProps {
  showAnnouncementBar?: boolean;
  showBreadcrumb?: boolean;
}

interface NavigationItem {
  href: string;
  label: string;
  routeHref?: string;
  sectionId?: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: "#compare-rates",
    label: "Compare Rates",
    routeHref: "/#compare-rates",
    sectionId: "compare-rates"
  },
  {
    href: "#how-it-works",
    label: "How It Works",
    routeHref: "/#how-it-works",
    sectionId: "how-it-works"
  },
  {
    href: "#smart-sending",
    label: "Smart Sending",
    routeHref: "/#smart-sending",
    sectionId: "smart-sending"
  },
  {
    href: "#build-credit",
    label: "Build Credit",
    routeHref: "/#build-credit",
    sectionId: "build-credit"
  },
  {
    href: "#rate-alerts",
    label: "Rate Alerts",
    routeHref: "/#rate-alerts",
    sectionId: "rate-alerts"
  },
  {
    href: "#contact",
    label: "Contact Us",
    routeHref: "/#contact",
    sectionId: "contact"
  }
];

const appDownloadButtons = [
  {
    href: "/manifest.webmanifest",
    label: "App Store",
    platform: "iOS" as const,
    prefix: "Download on the"
  },
  {
    href: "/manifest.webmanifest",
    label: "Google Play",
    platform: "Android" as const,
    prefix: "Get it on"
  }
];

const brandFontStyle = {
  fontFamily: '"Sora", var(--font-heading), sans-serif'
} as const;
const headerShellClassName = "mx-auto w-full max-w-[1200px] px-4 lg:px-6";
const breadcrumbShellClassName =
  "mx-auto w-full max-w-[1200px] px-4 min-[600px]:px-6 lg:px-10";

function SaveRateAfricaLogo({
  href,
  onClick
}: {
  href: string;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      aria-label="SaveRateAfrica home"
      className="inline-flex items-center gap-0 text-[#1a2e1a]"
      href={href}
      onClick={onClick}
      style={brandFontStyle}
    >
      <svg
        aria-hidden="true"
        className="h-8 w-8 shrink-0"
        viewBox="0 0 32 32"
      >
        <defs>
          <linearGradient id="saverate-logo-gradient-header" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#66bb6a" />
            <stop offset="100%" stopColor="#2e7d32" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" fill="url(#saverate-logo-gradient-header)" r="16" />
        <text
          fill="#ffffff"
          fontFamily="Sora, Arial, sans-serif"
          fontSize="18"
          fontWeight="700"
          textAnchor="middle"
          x="16"
          y="22"
        >
          S
        </text>
      </svg>
      <span className="ml-0 text-[20px] font-bold leading-none tracking-[-0.03em]">
        Save<span className="text-[#2e7d32]">Rate</span>Africa
      </span>
    </a>
  );
}

function AppleBadgeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
      <path d="M16.52 12.55c.03 2.3 2.01 3.07 2.03 3.08-.02.06-.31 1.09-1.03 2.15-.62.91-1.27 1.82-2.3 1.84-1 .02-1.33-.6-2.49-.6-1.16 0-1.53.58-2.46.62-1 .04-1.76-1-2.39-1.91-1.29-1.88-2.28-5.29-.95-7.65.66-1.17 1.87-1.91 3.16-1.93.99-.02 1.93.67 2.56.67.62 0 1.78-.83 3-.71.51.02 1.97.21 2.9 1.59-.08.05-1.73 1.01-1.76 2.85Zm-2.06-6.15c.54-.65.89-1.57.79-2.48-.77.03-1.69.52-2.24 1.16-.5.58-.92 1.5-.81 2.38.85.07 1.71-.44 2.26-1.06Z" />
    </svg>
  );
}

function GooglePlayBadgeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path d="M3.5 3.2 13.7 12 3.5 20.8Z" fill="#00d2ff" />
      <path d="M13.7 12 17.2 8.9 21 11.1c1 .56 1 1.24 0 1.8l-3.8 2.2Z" fill="#ffd54f" />
      <path d="M3.5 3.2 17.2 8.9 13.7 12Z" fill="#66bb6a" />
      <path d="M3.5 20.8 13.7 12 17.2 15.1Z" fill="#ef5350" />
    </svg>
  );
}

function AppStoreBadge({
  href,
  label,
  platform,
  prefix
}: (typeof appDownloadButtons)[number]) {
  const Icon = platform === "iOS" ? AppleBadgeIcon : GooglePlayBadgeIcon;
  const isIOS = platform === "iOS";

  return (
    <a
      className={`inline-flex h-9 items-center gap-2 rounded-[7px] border px-3 py-[5px] text-white ${
        isIOS
          ? "border-black bg-black"
          : "border-[#016b4b] bg-[#01875f]"
      }`}
      download
      href={href}
    >
      <Icon />
      <span className="flex flex-col leading-none" style={brandFontStyle}>
        <span className="text-[8px] font-medium tracking-[0.02em] text-white/85">
          {prefix}
        </span>
        <span className="mt-[2px] text-[11px] font-bold">{label}</span>
      </span>
    </a>
  );
}

export function SiteHeader({
  showAnnouncementBar = false,
  showBreadcrumb = false
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    pathname === "/" ? "home" : null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSectionId(null);
      return;
    }

    const sectionIds = [
      "home",
      ...navigationItems.flatMap((item) => (item.sectionId ? [item.sectionId] : []))
    ];
    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSectionId(visibleEntry.target.id);
        }
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  function closeMobilePanels() {
    setIsMobileMenuOpen(false);
  }

  function getNavigationHref(item: NavigationItem) {
    return pathname === "/" ? item.href : item.routeHref ?? `/${item.href}`;
  }

  function getHomeHref() {
    return pathname === "/" ? "#home" : "/#home";
  }

  function navigateTo(href: string, sectionId?: string) {
    closeMobilePanels();

    if (sectionId && pathname === "/") {
      const targetElement = document.getElementById(sectionId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", href);
        return;
      }
    }

    if (href === "#home" && pathname === "/") {
      window.scrollTo({ behavior: "smooth", top: 0 });
      return;
    }

    router.push(href.startsWith("/") ? href : `/${href}`);
  }

  function handleNavClick(
    event: MouseEvent<HTMLAnchorElement>,
    item: NavigationItem
  ) {
    if (item.sectionId) {
      event.preventDefault();
      navigateTo(getNavigationHref(item), item.sectionId);
      if (pathname === "/") {
        setActiveSectionId(item.sectionId);
      }
      return;
    }

    closeMobilePanels();
  }

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    navigateTo("#home", "home");
    setActiveSectionId("home");
  }

  function isActiveNavigationItem(item: NavigationItem) {
    if (pathname === "/") {
      return activeSectionId === item.sectionId;
    }

    return pathname === "/credit-cards" && item.sectionId === "build-credit";
  }

  return (
    <>
      {showAnnouncementBar ? (
        <div className="bg-[#2e7d32]">
          <div className="mx-auto max-w-[1200px] px-5 py-[10px] text-center text-[13px] text-white">
            <span>
              ✦ Real-time NGN rates · No hidden fees · Compare 10+ providers and
              save on every transfer.{" "}
            </span>
            <Link
              className="font-bold underline underline-offset-2"
              href={pathname === "/" ? "#compare-rates" : "/#compare-rates"}
              onClick={(event) => {
                if (pathname === "/") {
                  event.preventDefault();
                  navigateTo("#compare-rates", "compare-rates");
                }
              }}
            >
              Compare now →
            </Link>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-[1000] border-b border-[#c8e6c9] bg-white shadow-[0_1px_8px_rgba(46,125,50,0.06)]">
        <div className={headerShellClassName}>
          <div className="relative flex h-14 flex-nowrap items-center justify-between gap-4 overflow-visible whitespace-nowrap lg:overflow-hidden">
            <div className="mr-5 shrink-0">
              <SaveRateAfricaLogo href={getHomeHref()} onClick={handleLogoClick} />
            </div>

            <nav
              aria-label="Primary"
              className="hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-1 whitespace-nowrap lg:flex"
            >
              {navigationItems.map((item) => {
                const isActive = isActiveNavigationItem(item);

                return (
                  <Link
                    key={item.label}
                    className={`inline-flex items-center whitespace-nowrap border-b-2 px-[10px] py-[6px] text-[13px] font-medium transition ${
                      isActive
                        ? "active border-[#2e7d32] text-[#2e7d32]"
                        : "border-transparent text-[#2e4a2e] hover:text-[#2e7d32]"
                    }`}
                    href={getNavigationHref(item)}
                    onClick={(event) => handleNavClick(event, item)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="ml-4 hidden shrink-0 items-center gap-2 lg:flex">
              <div className="flex items-center gap-2">
                {appDownloadButtons.map((button) => (
                  <AppStoreBadge key={button.platform} {...button} />
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center lg:hidden">
              <button
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#dcedc8] text-[#1a2e1a]"
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen((current) => !current);
                }}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            {isMobileMenuOpen ? (
              <div className="absolute left-0 right-0 top-14 z-[999] rounded-b-[12px] border border-[#c8e6c9] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] lg:hidden">
                <nav aria-label="Mobile primary" className="grid">
              {navigationItems.map((item) => {
                const isActive = isActiveNavigationItem(item);

                return (
                  <Link
                    key={item.label}
                    className={`block border-b border-[#e8f5e9] py-3 text-[15px] ${
                      isActive ? "active text-[#2e7d32]" : "text-[#1a2e1a]"
                    }`}
                    href={getNavigationHref(item)}
                    onClick={(event) => handleNavClick(event, item)}
                  >
                    {item.label}
                  </Link>
                );
              })}
                </nav>

                <div className="flex flex-col gap-2 pt-4">
                  {appDownloadButtons.map((button) => (
                    <AppStoreBadge key={button.platform} {...button} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {showBreadcrumb ? (
        <div className="bg-[#f4faf5]">
          <div className={`${breadcrumbShellClassName} py-2 text-[12px] text-[#5a7a5a]`}>
            <Link className="hover:text-[#2e7d32]" href="/">
              Home
            </Link>
            <span className="mx-2 text-[#aaa]">›</span>
            <span className="font-semibold text-[#1a2e1a]">Credit Cards</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
