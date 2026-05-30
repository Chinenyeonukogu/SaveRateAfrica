"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

import { trackCreditCardClick } from "@/lib/analytics";

interface TrackedCreditCardLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  affiliateLink: string;
  cardCategory: string;
  cardName: string;
  children: ReactNode;
}

export function TrackedCreditCardLink({
  affiliateLink,
  cardCategory,
  cardName,
  children,
  onClick,
  ...anchorProps
}: TrackedCreditCardLinkProps) {
  return (
    <a
      {...anchorProps}
      href={affiliateLink}
      onClick={(event) => {
        trackCreditCardClick({
          affiliateLink,
          cardCategory,
          cardName
        });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
