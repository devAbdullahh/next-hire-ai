import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWT_COOKIE_NAME } from "@/lib/constants";
import { verifyToken } from "@/lib/jwt";

const protectedPrefixes = [
  "/dashboard",
  "/resumes",
  "/interviews",
  "/interview",
  "/settings",
  "/target-roles",
  "/avatars",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resumes/:path*",
    "/interviews/:path*",
    "/interview/:path*",
    "/settings/:path*",
    "/target-roles/:path*",
    "/avatars/:path*",
    "/login",
    "/register",
  ],
};
