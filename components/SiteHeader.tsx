"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";

import { providers } from "@/lib/providers";

interface SiteHeaderProps {
  showAnnouncementBar?: boolean;
  showBreadcrumb?: boolean;
}

interface NavigationItem {
  href: string;
  keywords: string[];
  label: string;
  routeHref?: string;
  searchHref?: string;
  sectionId?: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: "#compare-rates",
    keywords: ["compare", "rates", "providers"],
    label: "Compare Rates",
    routeHref: "/#compare-rates",
    sectionId: "compare-rates"
  },
  {
    href: "#how-it-works",
    keywords: ["how", "works", "steps"],
    label: "How It Works",
    routeHref: "/#how-it-works",
    sectionId: "how-it-works"
  },
  {
    href: "#smart-sending",
    keywords: ["smart", "sending", "ai"],
    label: "Smart Sending",
    routeHref: "/#smart-sending",
    sectionId: "smart-sending"
  },
  {
    href: "#build-credit",
    keywords: ["credit", "build"],
    label: "Build Credit",
    routeHref: "/credit-cards",
    searchHref: "/credit-cards",
    sectionId: "build-credit"
  },
  {
    href: "#rate-alerts",
    keywords: ["alert", "notify"],
    label: "Rate Alerts",
    routeHref: "/#rate-alerts",
    sectionId: "rate-alerts"
  },
  {
    href: "#contact",
    keywords: ["contact"],
    label: "Contact Us",
    routeHref: "/#contact",
    sectionId: "contact"
  }
];

const searchOnlyTargets: NavigationItem[] = [
  {
    href: "#feature-hub",
    keywords: ["feature", "features", "tool", "tools"],
    label: "Feature Hub",
    routeHref: "/#feature-hub",
    sectionId: "feature-hub"
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
const pageShellClassName =
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [noResultsQuery, setNoResultsQuery] = useState<string | null>(null);
  const noResultsTimeoutRef = useRef<number | null>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isMobileSearchOpen) {
      return;
    }

    mobileSearchInputRef.current?.focus();
  }, [isMobileSearchOpen]);

  useEffect(() => {
    return () => {
      if (noResultsTimeoutRef.current) {
        window.clearTimeout(noResultsTimeoutRef.current);
      }
    };
  }, []);

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
    setIsMobileSearchOpen(false);
  }

  function getNavigationHref(item: NavigationItem) {
    return pathname === "/" ? item.href : item.routeHref ?? `/${item.href}`;
  }

  function getSearchHref(item: NavigationItem) {
    return item.searchHref ?? getNavigationHref(item);
  }

  function getHomeHref() {
    return pathname === "/" ? "#home" : "/#home";
  }

  function navigateTo(href: string, sectionId?: string) {
    closeMobilePanels();
    setSearchQuery("");
    setNoResultsQuery(null);

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

  function showNoResults(query: string) {
    if (noResultsTimeoutRef.current) {
      window.clearTimeout(noResultsTimeoutRef.current);
    }

    setNoResultsQuery(query);
    noResultsTimeoutRef.current = window.setTimeout(() => {
      setNoResultsQuery(null);
    }, 2500);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();
    const normalizedQuery = trimmedQuery.toLowerCase();

    if (!normalizedQuery) {
      return;
    }

    const matchedProvider = providers.find((provider) => {
      const normalizedName = provider.name.toLowerCase();
      const normalizedSlug = provider.slug.replace(/-/g, " ").toLowerCase();

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedSlug.includes(normalizedQuery)
      );
    });

    if (matchedProvider) {
      closeMobilePanels();
      setSearchQuery("");
      setNoResultsQuery(null);
      router.push(`/providers/${matchedProvider.slug}`);
      return;
    }

    const matchedTarget = [...navigationItems, ...searchOnlyTargets].find((item) =>
      item.keywords.some((keyword) => normalizedQuery.includes(keyword))
    );

    if (matchedTarget) {
      navigateTo(getSearchHref(matchedTarget), matchedTarget.sectionId);
      return;
    }

    showNoResults(trimmedQuery);
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

      <header className="sticky top-0 z-[1000] border-b border-[#c8e6c9] bg-white shadow-[0_1px_8px_rgba(46,125,50,0.08)]">
        <div className={pageShellClassName}>
          <div className="flex h-[60px] items-center justify-between gap-4">
            <div className="shrink-0">
              <SaveRateAfricaLogo href={getHomeHref()} onClick={handleLogoClick} />
            </div>

            <nav
              aria-label="Primary"
              className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex"
            >
              {navigationItems.map((item) => {
                const isActive = isActiveNavigationItem(item);

                return (
                  <Link
                    key={item.label}
                    className={`inline-flex h-[60px] items-center border-b-2 text-[13px] font-medium transition ${
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

            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <form className="relative" role="search" onSubmit={handleSearchSubmit}>
                <label className="sr-only" htmlFor="desktop-site-search">
                  Search SaveRateAfrica
                </label>
                <div className="group flex w-[180px] items-center gap-[6px] rounded-full border border-[#e0e0e0] bg-[#f4f4f4] px-[14px] py-[5px] pl-[10px] transition-[width,border-color,background-color,box-shadow] duration-200 ease-out focus-within:w-[240px] focus-within:border-[#2e7d32] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(46,125,50,0.08)]">
                  <Search className="h-[14px] w-[14px] shrink-0 text-[#888] transition group-focus-within:text-[#2e7d32]" />
                  <input
                    id="desktop-site-search"
                    className="w-full border-none bg-transparent text-[12px] text-[#1a2e1a] outline-none placeholder:text-[#aaa]"
                    placeholder="Search SaveRateAfrica"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>

                {noResultsQuery ? (
                  <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 rounded-[6px] bg-[#1a2e1a] px-3 py-[5px] text-[11px] text-white">
                    No results for &apos;{noResultsQuery}&apos;
                  </div>
                ) : null}
              </form>

              <div className="flex items-center gap-2">
                {appDownloadButtons.map((button) => (
                  <AppStoreBadge key={button.platform} {...button} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                aria-expanded={isMobileSearchOpen}
                aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[#dcedc8] text-[#1a2e1a]"
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen((current) => !current);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[#dcedc8] text-[#1a2e1a]"
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen((current) => !current);
                  setIsMobileSearchOpen(false);
                }}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileSearchOpen ? (
          <div className="border-t border-[#e8f5e9] bg-white px-4 py-3 min-[600px]:px-6">
            <form className="relative" role="search" onSubmit={handleSearchSubmit}>
              <label className="sr-only" htmlFor="mobile-site-search">
                Search SaveRateAfrica
              </label>
              <div className="group flex w-full items-center gap-[6px] rounded-full border border-[#e0e0e0] bg-[#f4f4f4] px-[14px] py-[5px] pl-[10px] transition-[border-color,background-color,box-shadow] duration-200 ease-out focus-within:border-[#2e7d32] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(46,125,50,0.08)]">
                <Search className="h-[14px] w-[14px] shrink-0 text-[#888] transition group-focus-within:text-[#2e7d32]" />
                <input
                  ref={mobileSearchInputRef}
                  id="mobile-site-search"
                  className="w-full border-none bg-transparent text-[12px] text-[#1a2e1a] outline-none placeholder:text-[#aaa]"
                  placeholder="Search SaveRateAfrica"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>

              {noResultsQuery ? (
                <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 rounded-[6px] bg-[#1a2e1a] px-3 py-[5px] text-[11px] text-white">
                  No results for &apos;{noResultsQuery}&apos;
                </div>
              ) : null}
            </form>
          </div>
        ) : null}

        {isMobileMenuOpen ? (
          <div className="border-t border-[#e8f5e9] bg-white lg:hidden">
            <nav aria-label="Mobile primary" className="grid">
              {navigationItems.map((item) => {
                const isActive = isActiveNavigationItem(item);

                return (
                  <Link
                    key={item.label}
                    className={`inline-flex min-h-11 items-center border-b border-[#e8f5e9] px-4 py-3 text-[13px] font-medium ${
                      isActive ? "active text-[#2e7d32]" : "text-[#2e4a2e]"
                    }`}
                    href={getNavigationHref(item)}
                    onClick={(event) => handleNavClick(event, item)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2 px-4 py-3">
              {appDownloadButtons.map((button) => (
                <AppStoreBadge key={button.platform} {...button} />
              ))}
            </div>
          </div>
        ) : null}
      </header>

      {showBreadcrumb ? (
        <div className="bg-[#f4faf5]">
          <div className={`${pageShellClassName} py-2 text-[12px] text-[#5a7a5a]`}>
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
