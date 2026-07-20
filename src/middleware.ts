import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
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

  // Note: Standard Firebase Client SDK doesn't set HTTP-only cookies by default.
  // This middleware assumes a custom session cookie or token is managed.
  // For prototype continuity, we check for a standard session cookie name.
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
    "/wallet/:path*",
    "/messages/:path*",
    "/profile/:path*",
    "/donate/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/moderator/:path*"
  ]
};
