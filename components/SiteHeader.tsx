"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  CreditCard,
  Mail,
  Menu,
  UserRound,
  X
} from "lucide-react";
import {
  useEffect,
  useState,
  type MouseEvent
} from "react";

interface SiteHeaderProps {
  showAnnouncementBar?: boolean;
  showBreadcrumb?: boolean;
}

interface NavigationItem {
  description?: string;
  href: string;
  icon?: LucideIcon;
  iconBoxClassName?: string;
  iconColorClassName?: string;
  label: string;
  matchPathnames?: string[];
  routeHref?: string;
  sectionId?: string;
}

const aboutNavigationItem: NavigationItem = {
  description: "Our story",
  href: "/about",
  icon: UserRound,
  iconBoxClassName: "bg-[#fff4d8]",
  iconColorClassName: "text-[#d88a00]",
  label: "About Us",
  matchPathnames: ["/about"]
};

const navigationItems: NavigationItem[] = [
  {
    description: "Cards for the Nigerian diaspora",
    href: "/credit-cards",
    icon: CreditCard,
    iconBoxClassName: "bg-[#e8f5e9]",
    iconColorClassName: "text-[#2e7d32]",
    label: "Build Credit",
    matchPathnames: ["/credit-cards"]
  },
  {
    description: "Your 3-step send journey",
    href: "#how-it-works",
    icon: Clock3,
    iconBoxClassName: "bg-[#ede7f6]",
    iconColorClassName: "text-[#5e35b1]",
    label: "How It Works",
    routeHref: "/#how-it-works",
    sectionId: "how-it-works"
  },
  aboutNavigationItem
] as const;

const contactNavigationItem: NavigationItem = {
  href: "#contact",
  icon: Mail,
  iconBoxClassName: "bg-[#e8f5e9]",
  iconColorClassName: "text-[#2e7d32]",
  label: "Contact Us",
  routeHref: "/#contact",
  sectionId: "contact"
};

const brandFontStyle = {
  fontFamily: '"Sora", var(--font-heading), sans-serif'
} as const;
const headerShellClassName = "mx-auto w-full max-w-[1200px] px-4 lg:px-6";
const breadcrumbShellClassName =
  "mx-auto w-full max-w-[1200px] px-4 min-[600px]:px-6 lg:px-10";
const allNavigationItems = [...navigationItems, contactNavigationItem];

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

export function SiteHeader({
  showAnnouncementBar = true,
  showBreadcrumb = false
}: SiteHeaderProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    pathname === "/" ? "home" : null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSectionId(null);
      return;
    }

    const sectionIds = [
      "home",
      ...allNavigationItems.flatMap((item) => (item.sectionId ? [item.sectionId] : []))
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
    if (!isDrawerOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setIsDrawerOpen(false);
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDrawerOpen]);

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  function closePanels() {
    closeDrawer();
  }

  function getSectionNavigationHref(sectionId?: string, routeHref?: string, href?: string) {
    if (sectionId && pathname === "/") {
      return href ?? `#${sectionId}`;
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

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    navigateTo(getHomeHref(), "home");
    setActiveSectionId("home");
  }

  function isActiveNavigationItem(item: NavigationItem) {
    if (item.matchPathnames?.includes(pathname)) {
      return true;
    }

    if (pathname === "/") {
      return activeSectionId === item.sectionId;
    }

    if (item.sectionId) {
      return false;
    }

    return [item.href, item.routeHref]
      .filter((href): href is string => Boolean(href))
      .map((href) => href.split("#")[0])
      .includes(pathname);
  }

  function handleNavigationClick(
    event: MouseEvent<HTMLAnchorElement>,
    item: NavigationItem
  ) {
    if (!item.sectionId) {
      closePanels();
      return;
    }

    event.preventDefault();
    navigateTo(getNavigationHref(item), item.sectionId);

    if (pathname === "/") {
      setActiveSectionId(item.sectionId);
    }
  }

  function renderFeatureIcon(item: NavigationItem, compact = false) {
    if (!item.icon) {
      return null;
    }

    const Icon = item.icon;

    return (
      <div
        className={`si flex shrink-0 items-center justify-center ${
          compact
            ? "h-8 w-8 rounded-[9px]"
            : "h-9 w-9 rounded-[10px] max-[1150px]:h-7 max-[1150px]:w-7"
        } ${
          item.iconBoxClassName ?? "bg-[#f4faf5]"
        }`}
      >
        <Icon
          className={`${compact ? "h-4 w-4" : "h-5 w-5 max-[1150px]:h-4 max-[1150px]:w-4"} ${
            item.iconColorClassName ?? "text-[#2e7d32]"
          }`}
        />
      </div>
    );
  }

  function renderTabletNavigationItem(item: NavigationItem) {
    const isActive = isActiveNavigationItem(item);

    return (
      <Link
        aria-label={item.label}
        className={`strip-item group flex shrink-0 items-center gap-1.5 rounded-[14px] border px-3 py-1.5 transition-colors min-[860px]:gap-2 ${
          isActive
            ? "border-[#c8e6c9] bg-[#f4faf5] shadow-[0_0_0_1px_rgba(46,125,50,0.08)]"
            : "border-transparent bg-white hover:border-[#dcedc8] hover:bg-[#f8fcf8]"
        }`}
        href={getNavigationHref(item)}
        title={item.label}
        onClick={(event) => handleNavigationClick(event, item)}
      >
        {renderFeatureIcon(item, true)}
        <span
          className={`st-t block shrink-0 whitespace-nowrap text-[10px] leading-[1.2] min-[860px]:text-[11px] ${
            isActive
              ? "font-bold text-[#1b5e20]"
              : "font-semibold text-[#1a2e1a] group-hover:text-[#1b5e20]"
          }`}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-[999]">
        {showAnnouncementBar ? (
          <div className="bg-[#2e7d32]">
            <div className="mx-auto max-w-[1200px] px-5 py-[10px] text-center text-[13px] text-white">
              <span>
                ✦ Real-time NGN rates · No hidden fees · Compare 14 providers and
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

        <header className="border-b border-[#e0ede2] bg-white shadow-[0_2px_8px_rgba(46,125,50,0.08)]">
          <div className={headerShellClassName}>
            <div className="relative flex h-[60px] items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center">
              <SaveRateAfricaLogo href={getHomeHref()} onClick={handleLogoClick} />
              <nav aria-label="Primary" className="ml-3 hidden min-w-0 flex-1 lg:flex xl:ml-4">
                <ul className="strip grid min-w-0 flex-1 grid-cols-3 items-center gap-2 xl:gap-3">
                  {navigationItems.map((item) => {
                    const isActive = isActiveNavigationItem(item);

                    return (
                      <li key={item.label} className="min-w-0 list-none">
                        <Link
                          className={`strip-item group flex w-full min-w-0 items-center gap-1.5 rounded-[14px] border px-3.5 py-2 transition-colors xl:gap-2 xl:px-5 ${
                            isActive
                              ? "border-[#c8e6c9] bg-[#f4faf5] text-[#1b5e20] shadow-[0_0_0_1px_rgba(46,125,50,0.08)]"
                              : "border-transparent bg-white text-[#2e4a2e] hover:border-[#dcedc8] hover:bg-[#f8fcf8]"
                          }`}
                          href={getNavigationHref(item)}
                          onClick={(event) => handleNavigationClick(event, item)}
                        >
                          {renderFeatureIcon(item)}
                          <span
                            className={`st-t block min-w-0 whitespace-nowrap text-[11px] leading-[1.2] transition-colors xl:text-[12px] ${
                              isActive
                                ? "font-bold text-[#1b5e20]"
                                : "font-semibold text-[#1a2e1a] group-hover:text-[#1b5e20]"
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

            </div>

            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <Link
                className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-[13px] font-semibold transition ${
                  isActiveNavigationItem(contactNavigationItem)
                    ? "bg-[#f4faf5] text-[#1b5e20]"
                    : "text-[#2e4a2e] hover:bg-[#f4faf5] hover:text-[#2e7d32]"
                }`}
                href={getNavigationHref(contactNavigationItem)}
                onClick={(event) => handleNavigationClick(event, contactNavigationItem)}
              >
                {renderFeatureIcon(contactNavigationItem, true)}
                {contactNavigationItem.label}
              </Link>
            </div>

            <div className="flex shrink-0 items-center lg:hidden">
              <button
                aria-expanded={isDrawerOpen}
                aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
                className="inline-flex items-center justify-center gap-2 rounded-[20px] border-[1.5px] border-[#00c853] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#00a844]"
                type="button"
                onClick={() => {
                  setIsDrawerOpen((current) => !current);
                }}
              >
                <Menu className="h-4 w-4" />
                <span>Menu</span>
              </button>
            </div>

            </div>
          </div>
        </header>
      </div>

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

          {[...navigationItems, contactNavigationItem].map((item) => {
            const isActive = isActiveNavigationItem(item);

            return (
              <div key={item.label} className="border-b border-[#e8f5e9]">
                <Link
                  className={`flex cursor-pointer items-center gap-3 py-3 ${
                    isActive ? "font-semibold text-[#1b5e20]" : "text-[#1a2e1a]"
                  }`}
                  href={getNavigationHref(item)}
                  onClick={(event) => handleNavigationClick(event, item)}
                >
                  {renderFeatureIcon(item)}
                  <span className="block min-w-0 text-[15px]">{item.label}</span>
                </Link>
              </div>
            );
          })}
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
