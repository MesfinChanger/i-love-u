import { NextRequest, NextResponse } from "next/server";

/**
 * @fileOverview Global Security Middleware.
 * Synchronized to redirect unauthorized hearts to the login pathway.
 * Hardened to protect the high-fidelity Identity Hub.
 */

const protectedRoutes = [
  "/dashboard",
  "/identity",
  "/wallet",
  "/messages",
  "/profile",
  "/donate",
  "/checkout",
  "/admin",
  "/moderator"
];

const authRoutes = [
  "/login",
  "/signup"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For high-fidelity prototype, we check for a standard session marker
  // Note: Firebase Client SDK doesn't set HTTP-only cookies by default without a custom backend.
  const session = request.cookies.get("firebase-auth-token");

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

  /*
     Protected Pages
     Redirect to Login if no session is detected
  */
  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("return", pathname);
    return NextResponse.redirect(url);
  }

  /*
     Authenticated users redirected from auth pages
  */
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/identity/:path*",
    "/wallet/:path*",
    "/messages/:path*",
    "/profile/:path*",
    "/donate/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/moderator/:path*"
  ]
};
