"use client";

import { usePathname } from "next/navigation";

import { GlobalClientWidgets } from "./GlobalClientWidgets";
import { SiteFooter } from "./SiteFooter";

export function ConditionalChrome() {
  const pathname = usePathname();

  if (pathname === "/maintenance") {
    return null;
  }

  return (
    <>
      <SiteFooter />
      <GlobalClientWidgets />
    </>
  );
}
