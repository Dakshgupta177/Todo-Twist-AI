import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("Token")?.value || "";
  const path = request.nextUrl.pathname;
  const isPublicPath =
    "/login" === path ||
    "/signup" === path ||
    path.startsWith("/api/");
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher : [
    "/",
    "/signup",
    "/login",
    "/your-todos",
    "/your-challenging-todos",
  ]
}