import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BYPASS_COOKIE = "sra_maintenance_bypass";
const BYPASS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const HAS_FILE_EXTENSION = /\.[^/]+$/;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "true") {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;

  // Always let the maintenance page, API routes and static assets through so
  // the site can render its own "down for maintenance" state without looping.
  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/api/") ||
    HAS_FILE_EXTENSION.test(pathname)
  ) {
    return NextResponse.next();
  }

  const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET;
  const cookieValue = request.cookies.get(BYPASS_COOKIE)?.value ?? "";
  const paramValue = searchParams.get("bypass") ?? "";

  if (bypassSecret && timingSafeEqual(cookieValue, bypassSecret)) {
    return NextResponse.next();
  }

  if (bypassSecret && timingSafeEqual(paramValue, bypassSecret)) {
    // Strip the secret from the URL before letting the admin through.
    const cleanUrl = new URL(pathname, request.url);
    searchParams.forEach((value, key) => {
      if (key !== "bypass") cleanUrl.searchParams.set(key, value);
    });

    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(BYPASS_COOKIE, bypassSecret, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: BYPASS_COOKIE_MAX_AGE
    });
    return response;
  }

  return NextResponse.redirect(new URL("/maintenance", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"]
};
