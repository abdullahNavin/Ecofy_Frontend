import { NextRequest, NextResponse } from "next/server";

const MEMBER_PATHS = ["/dashboard/member", "/payment"];
const ADMIN_PATHS = ["/dashboard/admin"];
const GUEST_ONLY = ["/auth/login", "/auth/signup"];

export function proxy(req: NextRequest) {
  const sessionToken = req.cookies.get("better-auth.session_token")?.value;
  const role = req.cookies.get("ecofy.role")?.value;
  const { pathname } = req.nextUrl;

  const needsMember = MEMBER_PATHS.some(p => pathname.startsWith(p));
  const needsAdmin = ADMIN_PATHS.some(p => pathname.startsWith(p));
  const isGuestOnly = GUEST_ONLY.some(p => pathname.startsWith(p));

  if (pathname === "/dashboard") {
    if (!sessionToken) return NextResponse.redirect(new URL("/auth/login", req.url));
    if (role === "ADMIN") return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    return NextResponse.redirect(new URL("/dashboard/member", req.url));
  }

  if (!sessionToken && (needsMember || needsAdmin))
    return NextResponse.redirect(new URL(`/auth/login?from=${encodeURIComponent(pathname)}`, req.url));

  if (needsAdmin && role !== "ADMIN")
    return NextResponse.redirect(new URL("/dashboard/member", req.url));

  if (sessionToken && isGuestOnly)
    return NextResponse.redirect(new URL(role === "ADMIN" ? "/dashboard/admin" : "/dashboard/member", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/payment/:path*"],
};
