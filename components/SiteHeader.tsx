"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent
} from "react";

import { providers } from "@/lib/providers";

interface SiteHeaderProps {
  showAnnouncementBar?: boolean;
  showBreadcrumb?: boolean;
}

interface DropdownLinkItem {
  description: string;
  href: string;
  routeHref?: string;
  sectionId?: string;
  title: string;
}

interface NavigationItem {
  dropdownAlign: "center" | "left" | "right";
  dropdownItems: DropdownLinkItem[];
  dropdownTitle: string;
  href: string;
  label: string;
  routeHref?: string;
  sectionId?: string;
}

const navigationItems: NavigationItem[] = [
  {
    dropdownAlign: "left",
    dropdownItems: [
      {
        description: "See all 14 providers ranked by payout",
        href: "#compare-rates",
        routeHref: "/#compare-rates",
        sectionId: "compare-rates",
        title: "Live Rate Comparison"
      },
      {
        description: "See how much you save vs Western Union",
        href: "#compare-rates",
        routeHref: "/#compare-rates",
        sectionId: "compare-rates",
        title: "Savings Calculator"
      },
      {
        description: "Grey Finance, LemFi, Sendwave and more",
        href: "#compare-rates",
        routeHref: "/#compare-rates",
        sectionId: "compare-rates",
        title: "Rate by Provider"
      }
    ],
    dropdownTitle: "Find Your Best NGN Rate",
    href: "#compare-rates",
    label: "Compare Rates",
    routeHref: "/#compare-rates",
    sectionId: "compare-rates"
  },
  {
    dropdownAlign: "left",
    dropdownItems: [
      {
        description: "Pick amount and sending country",
        href: "#how-it-works",
        routeHref: "/#how-it-works",
        sectionId: "how-it-works",
        title: "Enter Your Amount"
      },
      {
        description: "Rate, fee, speed side by side",
        href: "#how-it-works",
        routeHref: "/#how-it-works",
        sectionId: "how-it-works",
        title: "Compare Live Offers"
      },
      {
        description: "We never hold funds — you send direct",
        href: "#how-it-works",
        routeHref: "/#how-it-works",
        sectionId: "how-it-works",
        title: "Click & Send"
      }
    ],
    dropdownTitle: "Send in 3 Simple Steps",
    href: "#how-it-works",
    label: "How It Works",
    routeHref: "/#how-it-works",
    sectionId: "how-it-works"
  },
  {
    dropdownAlign: "center",
    dropdownItems: [
      {
        description: "AI picks the best provider for you now",
        href: "#smart-sending",
        routeHref: "/#smart-sending",
        sectionId: "smart-sending",
        title: "Route Guidance"
      },
      {
        description: "Watch NGN signals before you send",
        href: "#smart-sending",
        routeHref: "/#smart-sending",
        sectionId: "smart-sending",
        title: "Market Timing"
      },
      {
        description: "7, 30, 90-day NGN rate patterns",
        href: "#smart-sending",
        routeHref: "/#smart-sending",
        sectionId: "smart-sending",
        title: "Trend Tracking"
      }
    ],
    dropdownTitle: "Send at the Right Moment",
    href: "#smart-sending",
    label: "Smart Sending",
    routeHref: "/#smart-sending",
    sectionId: "smart-sending"
  },
  {
    dropdownAlign: "center",
    dropdownItems: [
      {
        description: "Best cards for no credit history",
        href: "/credit-cards",
        routeHref: "/credit-cards",
        title: "Credit Card Comparison"
      },
      {
        description: "Soft check — no score impact",
        href: "/credit-cards",
        routeHref: "/credit-cards",
        title: "Check Eligibility"
      },
      {
        description: "Step-by-step for new US arrivals",
        href: "/credit-cards",
        routeHref: "/credit-cards",
        title: "How Credit Building Works"
      }
    ],
    dropdownTitle: "Build U.S. Credit as a Nigerian",
    href: "#build-credit",
    label: "Build Credit",
    routeHref: "/#build-credit",
    sectionId: "build-credit"
  },
  {
    dropdownAlign: "right",
    dropdownItems: [
      {
        description: "Get notified by SMS or email",
        href: "/alerts",
        routeHref: "/alerts",
        title: "Set a Rate Alert"
      },
      {
        description: "Track the dollar corridor",
        href: "/alerts",
        routeHref: "/alerts",
        title: "USD to NGN Alerts"
      },
      {
        description: "For UK and Canada senders",
        href: "/alerts",
        routeHref: "/alerts",
        title: "GBP & CAD Alerts"
      }
    ],
    dropdownTitle: "Never Miss Your Target Rate",
    href: "#rate-alerts",
    label: "Rate Alerts",
    routeHref: "/#rate-alerts",
    sectionId: "rate-alerts"
  },
  {
    dropdownAlign: "right",
    dropdownItems: [
      {
        description: "We respond within 24 hours",
        href: "#contact",
        routeHref: "/#contact",
        sectionId: "contact",
        title: "Send a Message"
      },
      {
        description: "Most common sender questions",
        href: "#faq",
        routeHref: "/#faq",
        sectionId: "faq",
        title: "FAQ"
      },
      {
        description: "Our mission and data sources",
        href: "#contact",
        routeHref: "/#contact",
        sectionId: "contact",
        title: "About SaveRateAfrica"
      }
    ],
    dropdownTitle: "Get in Touch",
    href: "#contact",
    label: "Contact Us",
    routeHref: "/#contact",
    sectionId: "contact"
  }
] as const;

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
] as const;

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
      className="inline-flex shrink-0 items-center gap-0 text-[#1a2e1a]"
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
        isIOS ? "border-black bg-black" : "border-[#016b4b] bg-[#01875f]"
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

function getDropdownAlignmentClass(align: NavigationItem["dropdownAlign"]) {
  if (align === "left") {
    return "left-0";
  }

  if (align === "right") {
    return "right-0";
  }

  return "left-1/2 -translate-x-1/2";
}

function getDedicatedSectionRoute(sectionId?: string) {
  if (sectionId === "build-credit") {
    return "/credit-cards";
  }

  if (sectionId === "rate-alerts") {
    return "/alerts";
  }

  return null;
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDrawerSection, setOpenDrawerSection] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResultsQuery, setNoResultsQuery] = useState<string | null>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement | null>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);
  const noResultsTimeoutRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      desktopSearchInputRef.current?.focus();
      mobileSearchInputRef.current?.focus();
    }, 40);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen && !isDrawerOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setIsSearchOpen(false);
      setSearchQuery("");
      setNoResultsQuery(null);
      setIsDrawerOpen(false);
      setOpenDrawerSection(null);
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDrawerOpen, isSearchOpen]);

  useEffect(() => {
    return () => {
      if (noResultsTimeoutRef.current) {
        window.clearTimeout(noResultsTimeoutRef.current);
      }
    };
  }, []);

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchQuery("");
    setNoResultsQuery(null);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
    setOpenDrawerSection(null);
  }

  function closePanels() {
    closeSearch();
    closeDrawer();
  }

  function getSectionNavigationHref(sectionId?: string, routeHref?: string, href?: string) {
    if (sectionId && pathname === "/") {
      return href ?? `#${sectionId}`;
    }

    const dedicatedRoute = getDedicatedSectionRoute(sectionId);

    if (dedicatedRoute && pathname === dedicatedRoute) {
      return dedicatedRoute;
    }

    if (routeHref) {
      return routeHref;
    }

    if (sectionId) {
      return `/#${sectionId}`;
    }

    return href ?? "/";
  }

  function getNavigationHref(item: NavigationItem) {
    return getSectionNavigationHref(item.sectionId, item.routeHref, item.href);
  }

  function getMenuItemHref(item: DropdownLinkItem) {
    return getSectionNavigationHref(item.sectionId, item.routeHref, item.href);
  }

  function getHomeHref() {
    return getSectionNavigationHref("home", "/#home", "#home");
  }

  function navigateTo(href: string, sectionId?: string) {
    closePanels();

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

  function handleTopLevelClick(
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

    closePanels();
  }

  function handleMenuItemClick(
    event: MouseEvent<HTMLAnchorElement>,
    item: DropdownLinkItem
  ) {
    if (item.sectionId) {
      event.preventDefault();
      navigateTo(getMenuItemHref(item), item.sectionId);
      if (pathname === "/") {
        setActiveSectionId(item.sectionId);
      }
      return;
    }

    closePanels();
  }

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    navigateTo(getHomeHref(), "home");
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
      closePanels();
      router.push(`/providers/${matchedProvider.slug}`);
      return;
    }

    const dropdownItems = navigationItems.flatMap((item) => item.dropdownItems);
    const matchedNavTarget = [...navigationItems, ...dropdownItems].find((item) => {
      const haystack = [
        "dropdownTitle" in item ? item.dropdownTitle : "",
        "label" in item ? item.label : "",
        "title" in item ? item.title : "",
        "description" in item ? item.description : ""
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    if (matchedNavTarget) {
      if ("dropdownItems" in matchedNavTarget) {
        navigateTo(getNavigationHref(matchedNavTarget), matchedNavTarget.sectionId);
        return;
      }

      navigateTo(getMenuItemHref(matchedNavTarget), matchedNavTarget.sectionId);
      return;
    }

    showNoResults(trimmedQuery);
  }

  function isActiveNavigationItem(item: NavigationItem) {
    if (pathname === "/") {
      return activeSectionId === item.sectionId;
    }

    if (pathname === "/credit-cards") {
      return item.sectionId === "build-credit";
    }

    if (pathname === "/alerts") {
      return item.sectionId === "rate-alerts";
    }

    return false;
  }

  function renderDropdownItem(item: DropdownLinkItem) {
    return (
      <Link
        key={item.title}
        className="flex items-start gap-3 rounded-[8px] px-3 py-2.5 no-underline transition hover:bg-[#f4faf5]"
        href={getMenuItemHref(item)}
        onClick={(event) => handleMenuItemClick(event, item)}
      >
        <div className="mt-[5px] shrink-0 text-[8px] text-[#2e7d32]">●</div>
        <div>
          <span className="block text-[13px] font-semibold text-[#1a2e1a]">
            {item.title}
          </span>
          <span className="mt-[2px] block text-[11px] text-[#5a7a5a]">
            {item.description}
          </span>
        </div>
      </Link>
    );
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
          <div className="relative flex h-[60px] items-center justify-between gap-4">
            <div className="mr-5 shrink-0">
              <SaveRateAfricaLogo href={getHomeHref()} onClick={handleLogoClick} />
            </div>

            <nav aria-label="Primary" className="hidden min-w-0 flex-1 lg:flex">
              <ul className="flex min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap">
                {navigationItems.map((item) => {
                  const isActive = isActiveNavigationItem(item);

                  return (
                    <li key={item.label} className="group/nav relative list-none">
                      <Link
                        className={`inline-flex h-[60px] items-center gap-1 border-b-2 px-[10px] py-[6px] text-[13px] font-medium transition ${
                          isActive
                            ? "active border-[#2e7d32] text-[#2e7d32]"
                            : "border-transparent text-[#2e4a2e] hover:text-[#2e7d32]"
                        }`}
                        href={getNavigationHref(item)}
                        onClick={(event) => handleTopLevelClick(event, item)}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Link>

                      <div
                        className={`pointer-events-none absolute top-[60px] z-[999] min-w-[280px] rounded-b-[12px] border border-[#c8e6c9] bg-white px-6 py-5 opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition duration-200 group-hover/nav:pointer-events-auto group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:pointer-events-auto group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 ${getDropdownAlignmentClass(item.dropdownAlign)} -translate-y-2`}
                      >
                        <p className="mb-3 text-[13px] font-semibold text-[#1a2e1a]">
                          {item.dropdownTitle}
                        </p>
                        <div className="space-y-1">
                          {item.dropdownItems.map((dropdownItem) =>
                            renderDropdownItem(dropdownItem)
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <div className="relative flex items-center">
                <button
                  aria-expanded={isSearchOpen}
                  aria-label={isSearchOpen ? "Close search" : "Open search"}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full p-2 text-[#2e4a2e] transition hover:bg-[#f4faf5]"
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    setIsSearchOpen((current) => !current);
                    setNoResultsQuery(null);
                  }}
                >
                  <Search className="h-4 w-4" />
                </button>

                <div
                  className={`overflow-hidden transition-[width,opacity,margin] duration-200 ease-out ${
                    isSearchOpen ? "ml-2 w-[260px] opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <form
                    className="flex items-center rounded-[6px] border border-[#c8e6c9] bg-white px-3 py-1.5"
                    role="search"
                    onSubmit={handleSearchSubmit}
                  >
                    <input
                      ref={desktopSearchInputRef}
                      className="w-full border-none bg-transparent text-[13px] text-[#1a2e1a] outline-none placeholder:text-[#7a8d7a]"
                      placeholder="Search SaveRateAfrica..."
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    <button
                      aria-label="Close search"
                      className="ml-2 text-[13px] text-[#2e4a2e]"
                      type="button"
                      onClick={closeSearch}
                    >
                      ✕
                    </button>
                  </form>
                </div>

                {noResultsQuery && isSearchOpen ? (
                  <div className="absolute right-0 top-full mt-2 rounded-[6px] bg-[#1a2e1a] px-3 py-[5px] text-[11px] text-white">
                    No results for &apos;{noResultsQuery}&apos;
                  </div>
                ) : null}
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-2">
                {appDownloadButtons.map((button) => (
                  <AppStoreBadge key={button.platform} {...button} />
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <button
                aria-expanded={isSearchOpen}
                aria-label={isSearchOpen ? "Close search" : "Open search"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full p-2 text-[#2e4a2e] transition hover:bg-[#f4faf5]"
                type="button"
                onClick={() => {
                  closeDrawer();
                  setIsSearchOpen((current) => !current);
                  setNoResultsQuery(null);
                }}
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                aria-expanded={isDrawerOpen}
                aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#dcedc8] text-[#1a2e1a]"
                type="button"
                onClick={() => {
                  closeSearch();
                  setIsDrawerOpen((current) => !current);
                  setOpenDrawerSection(null);
                }}
              >
                {isDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {isSearchOpen ? (
              <div className="absolute left-4 right-4 top-[calc(100%+8px)] z-[1001] rounded-[6px] border border-[#c8e6c9] bg-white px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] lg:hidden">
                <form className="flex items-center gap-2" role="search" onSubmit={handleSearchSubmit}>
                  <input
                    ref={mobileSearchInputRef}
                    className="w-full border-none bg-transparent text-[13px] text-[#1a2e1a] outline-none placeholder:text-[#7a8d7a]"
                    placeholder="Search SaveRateAfrica..."
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                  <button
                    aria-label="Close search"
                    className="text-[13px] text-[#2e4a2e]"
                    type="button"
                    onClick={closeSearch}
                  >
                    ✕
                  </button>
                </form>

                {noResultsQuery ? (
                  <div className="mt-2 rounded-[6px] bg-[#1a2e1a] px-3 py-[5px] text-[11px] text-white">
                    No results for &apos;{noResultsQuery}&apos;
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[998] bg-brand-navy/20 transition lg:hidden ${
          isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-[1001] w-[300px] border-l border-[#c8e6c9] bg-white px-5 py-6 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-transform duration-200 lg:hidden ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#1a2e1a]">Menu</p>
          <button
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2e4a2e] transition hover:bg-[#f4faf5]"
            type="button"
            onClick={closeDrawer}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = isActiveNavigationItem(item);
            const isOpen = openDrawerSection === item.label;

            return (
              <div key={item.label} className="border-b border-[#e8f5e9]">
                <button
                  className={`flex w-full items-center justify-between py-3 text-left text-[15px] ${
                    isActive ? "text-[#2e7d32]" : "text-[#1a2e1a]"
                  }`}
                  type="button"
                  onClick={() =>
                    setOpenDrawerSection((current) =>
                      current === item.label ? null : item.label
                    )
                  }
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen ? (
                  <div className="pb-3">
                    <p className="px-3 pb-2 text-[12px] font-semibold text-[#1a2e1a]">
                      {item.dropdownTitle}
                    </p>
                    <div className="space-y-1">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.title}
                          className="flex items-start gap-3 rounded-[8px] px-3 py-2.5 no-underline transition hover:bg-[#f4faf5]"
                          href={getMenuItemHref(dropdownItem)}
                          onClick={(event) => handleMenuItemClick(event, dropdownItem)}
                        >
                          <div className="mt-[5px] shrink-0 text-[8px] text-[#2e7d32]">●</div>
                          <div>
                            <span className="block text-[13px] font-semibold text-[#1a2e1a]">
                              {dropdownItem.title}
                            </span>
                            <span className="mt-[2px] block text-[11px] text-[#5a7a5a]">
                              {dropdownItem.description}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {appDownloadButtons.map((button) => (
            <AppStoreBadge key={button.platform} {...button} />
          ))}
        </div>
      </aside>

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
