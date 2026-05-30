"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

import { trackProviderClick } from "@/lib/analytics";

interface TrackedProviderLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  affiliateLink: string;
  children: ReactNode;
  corridor: string;
  providerName: string;
}

export function TrackedProviderLink({
  affiliateLink,
  children,
  corridor,
  providerName,
  onClick,
  ...anchorProps
}: TrackedProviderLinkProps) {
  return (
    <a
      {...anchorProps}
      href={affiliateLink}
      onClick={(event) => {
        trackProviderClick({
          affiliateLink,
          corridor,
          providerName
        });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
